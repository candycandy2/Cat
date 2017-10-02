<?php
namespace App\Http\Controllers;
use Config;
use Validator;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\JPush;
use Illuminate\Support\Facades\Input;
use App\Services\UserService;
use App\Services\PushService;
use App\Services\ChatRoomService;

class ChatRoomController extends Controller
{

    protected $xml;
    protected $data;
    protected $userService;
    protected $chatRoomService;
    protected $pushService;
    

    /**
     * ChatRoomController constructor.
     * @param UserService $userService
     * @param ChatRoomService $chatRoomService
     * @param PushService $pushService
     */
    public function __construct(UserService $userService,
                               ChatRoomService $chatRoomService,
                               PushService $pushService)
    {
        $this->userService = $userService;
        $this->chatRoomService = $chatRoomService;

        $input = Input::get();
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
    }

    public function newQChatroom(){

        $required = Validator::make($this->data, [
            'emp_no' => 'required',
            'lang' => 'required',
            'need_push' => 'required',
            'app_key' => 'required',
            'chatroom_name' => 'required',
            'chatroom_desc' => 'required',
            'member_list' => 'required',
            'member_list.destination_emp_no' => 'required'
        ]);

        $range = Validator::make($this->data, [
            'need_push' => 'in:Y,N',
            'chatroom_desc'=>'regex:/^(\S*=\S*)+;*/',
        ]);

        if($required->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                    'Message'=>"必填字段缺失",
                    'Content'=>""]);
        }

        if($range->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
        }
        $verify = new Verify();

        //check member_list
        $fromEmpNo = $this->data['emp_no'];
        $targetUserList = $this->data['member_list']['destination_emp_no'];
        $chatRoomName = $this->data['chatroom_name'];
        $chatroomDesc = $this->data['chatroom_desc'];
        $descData = $this->getExtraData($chatroomDesc);
        if( $descData['group_message'] == 'N'){
            if(count($targetUserList) > 1){
                return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
        }
        if(is_array($targetUserList)){
            $targetUserList = array_unique($this->data['member_list']['destination_emp_no']);
            if(($key = array_search($fromEmpNo, $targetUserList)) !== false) {
                unset($targetUserList[$key]);
            }
        }else{
            if($targetUserList == $fromEmpNo){
                $targetUserList = [];
            }else{
                $targetUserList = array($targetUserList);
            }
        }
        $members=[];
        $tokens=[];
        if(count($targetUserList) == 0){
            return $result = response()->json(['ResultCode'=>ResultCode::_025919_ChatroomMemberInvalid,
                    'Message'=>"傳入的成員不存在",
                    'Content'=>""]);
        }
        foreach ($targetUserList as $targetEmpNo) {
            $pushToken = $this->userService->getUserPushToken($targetEmpNo);
            $userStatus = $this->userService->getUserStatus($fromEmpNo, $targetEmpNo);
            if($userStatus['status'] == 'protected'){
                return $result = response()->json(['ResultCode'=>ResultCode::_025926_CannotInviteProtectedUserWhoIsNotFriend,
                    'Message'=>"保護名單必須是好友才能聊天",
                    'Content'=>""]);
            }else{
                 foreach ($pushToken as $token) {
                     $tokens[] = $token->push_token;
                 }
                 $members[] = $userStatus['login_id'];
            }
        }

        \DB::beginTransaction();
        $newGroupId = null;
        try {
            $ownerData = $this->userService->getUserData($fromEmpNo);
            $owner = $ownerData->login_id;
            $member="";
            //檢查是否已存在私聊聊天室，直接回傳既有聊天室id；不存在則繼續新增聊天室
            if($descData['group_message'] == 'N' && count($targetUserList) == 1){
                $privateGroup = $this->chatRoomService->getPrivateGroup($fromEmpNo,$targetUserList[0]);
                if(isset($privateGroup->chatroom_id)){
                    return  $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>array("group_id"=>$privateGroup->chatroom_id,
                                         "is_new"=>'N')]);
                }else{
                    $member = $fromEmpNo.','.$targetUserList[0];
                }
            }
            //新增聊天室
            // 1. call Jmessage to create chatroom
            $response = $this->chatRoomService->newChatRoom( $owner, $chatRoomName, $members, $chatroomDesc);
            if(isset($response->error)){
                return $result = response()->json(['ResultCode'=>ResultCode::_025925_CallAPIFailedOrErrorOccurs,
                        'Message'=>"Call API failed or error occurred",
                        'Content'=>$response]);
            }
            // 2. save chatroom information to DB
            $userId = $ownerData->row_id;
            $newGroupId = $response->gid;
            $this->chatRoomService->saveChatroom($response->gid,
                                                 $response->name,
                                                 $response->desc,
                                                 $userId,
                                                 $member);
            // 3. send push 
            // $push = new JPush(Config::get("app.app_key"),Config::get("app.master_secret"));
            // $push->setReceiver($tokens)
            //      ->setTitle($response->name)
            //      ->setDesc($owner."邀請您加入聊天")
            //      ->send();

            $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>array("group_id"=> $response->gid,
                                         "is_new"=>'Y')]);
           \DB::commit();
         }catch (\Exception $e) {
            \DB::rollBack();
            if(!is_null($newGroupId)){
                $this->chatRoomService->deleteGroup($newGroupId);
            }
            $result = response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
         }
         return $result;
    }

    private function getExtraData(String $list){
        $array = explode(';',$list);
        $result = [];
        foreach ($array as $item) {
            $result[explode('=',$item)[0]] = explode('=',$item)[1];    
        }
        return $result;
    }
}