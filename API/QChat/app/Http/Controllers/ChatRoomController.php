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
            'member_list' => 'required',
            'member_list.destination_emp_no' => 'required'
        ]);

        $range = Validator::make($this->data, [
            'need_push' => 'in:Y,N',
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
            if(count($pushToken) <= 0){
                return $result = response()->json(['ResultCode'=>ResultCode::_025919_ChatroomMemberInvalid,
                    'Message'=>"成員未安裝QChat",
                    'Content'=>""]);
            }
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
        
        try {
            // 1. call Jmessage to create chatroom
            $chatRoomName = $this->data['chatroom_name'];
            $chatroomDesc = (is_null($this->data['chatroom_desc']))?"":$this->data['chatroom_desc'];
            $ownerData = $this->userService->getUserData($fromEmpNo);
            $owner = $ownerData->login_id;
            $response = $this->chatRoomService->newChatRoom( $owner, $chatRoomName, $members, $chatroomDesc);
            if(isset($response->error)){
                return $result = response()->json(['ResultCode'=>ResultCode::_025925_CallAPIFailedOrErrorOccurs,
                        'Message'=>"Call API failed or error occurred",
                        'Content'=>$response]);
            }
            // 2. save chatroom information to DB
            $userId = $ownerData->row_id;
            $this->chatRoomService->saveChatroom($response->gid, $response->name, $response->desc, $userId);
            //3. send push 
            $push = new JPush(Config::get("app.app_key"),Config::get("app.master_secret"));
            $push->setReceiver($tokens)
                 ->setTitle($response->name)
                 ->setDesc($owner."邀請您加入聊天")
                 ->send();

            $result = response()->json(['ResultCode'=>ResultCode::_025901_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>""]);
            \DB::commit();
         }catch (\Exception $e) {
            \DB::rollBack();
            $result = response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>$e->getMessage()]);
         }
         return $result;
    }
}