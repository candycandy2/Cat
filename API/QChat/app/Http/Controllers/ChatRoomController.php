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
use Exception;

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

    /**
     * 透過此API可以新增聊天室
     */
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
        $descData = $this->chatRoomService->getChatroomExtraData($chatroomDesc);
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
        if(count($targetUserList) == 0){
            return $result = response()->json(['ResultCode'=>ResultCode::_025919_ChatroomMemberInvalid,
                    'Message'=>"傳入的成員不存在",
                    'Content'=>""]);
        }
        foreach ($targetUserList as $targetEmpNo) {
            $userStatus = $this->userService->getUserStatus($fromEmpNo, $targetEmpNo);
            if($userStatus['status'] == 'protected'){
                return $result = response()->json(['ResultCode'=>ResultCode::_025926_CannotInviteProtectedUserWhoIsNotFriend,
                    'Message'=>"保護名單必須是好友才能聊天",
                    'Content'=>""]);
            }else{
                 $members[] = $userStatus['login_id'];
            }
        }

        \DB::beginTransaction();
        $newGroupId = null;
        try {
            $ownerData = $this->userService->getUserData($fromEmpNo);
            $owner = $ownerData->login_id;
            $member=[];
            //檢查是否已存在私聊聊天室，直接回傳既有聊天室id；不存在則繼續新增聊天室
            if($descData['group_message'] == 'N' && count($targetUserList) == 1){
                $privateGroupId = $this->chatRoomService->getPrivateGroup($fromEmpNo,$targetUserList[0]);
                if(isset($privateGroupId) && $privateGroupId!=""){
                    return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>array("group_id"=>$privateGroupId,
                                         "is_new"=>'N')]);
                }
            }
            //新增聊天室
            //1. call Jmessage to create chatroom
            $response = $this->chatRoomService->newChatRoom( $owner, $chatRoomName, $members, $chatroomDesc);
            if(isset($response->error)){
                return $result = response()->json(['ResultCode'=>ResultCode::_025925_CallAPIFailedOrErrorOccurs,
                        'Message'=>"Call API failed or error occurred",
                        'Content'=>$response]);
            }
            // 2. save chatroom information to DB
            $userId = $ownerData->row_id;
            $newGroupId = $response->gid;
            $member = array_push($targetUserList, $fromEmpNo);
            $memberList = implode(',',$member);
            $this->chatRoomService->saveChatroom($response->gid,
                                                 $response->name,
                                                 $response->desc,
                                                 $userId,
                                                 $memberList);

            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>array("group_id"=> $response->gid,
                                         "is_new"=>'Y')]);
           \DB::commit();

        }catch (JMessageException $e){
            throw new JMessageException($response->error->message);
        }catch (\Exception $e) {
            \DB::rollBack();
            if(!is_null($newGroupId)){
                $this->chatRoomService->deleteGroup($newGroupId);
            }
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
         }
    }
    
    /**
     * 透過此API可以新增成員
     */
    public function addQMember(){

        \DB::beginTransaction();
        try {
            $required = Validator::make($this->data, [
                'emp_no' => 'required',
                'lang' => 'required',
                'need_push' => 'required',
                'app_key' => 'required',
                'group_id' => 'required',
                'member_list' => 'required',
                'member_list.destination_emp_no' => 'required',
            ]);

            if($required->fails())
            {
                return $result = response()->json(['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                        'Message'=>"必填字段缺失",
                        'Content'=>""]);
            }

            $destArr = [];
            $member = [];

            $groupId = $this->data['group_id'];
            $empNo = $this->data['emp_no'];
            $destEmpArr = array_unique($this->data['member_list']['destination_emp_no']);
            $userId = $this->userService->getUserData($empNo)->row_id;
            $chatroom = $this->chatRoomService->getChatroom($groupId);
            $member = explode(',', $chatroom->member);
            $destEmpArr = array_diff($destEmpArr, $member);
            $member = array_merge($member, $destEmpArr);
           

            if(count($chatroom) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025920_TheChatroomIdIsInvalid,
                        'Message'=>"傳入的聊天室編號無法識別",
                        'Content'=>""]);
                
            }
            if( $chatroom->extraData['group_message'] == 'N'){
                return $result = response()->json(['ResultCode'=>ResultCode::_025929_PrivateChatroomCanNotAddMember,
                        'Message'=>"私聊聊天室不可新增成員",
                        'Content'=>""]);
            }
            
            foreach ($destEmpArr as $targetEmpNo) {
                $userStatus = $this->userService->getUserStatus($empNo, $targetEmpNo);
                if($userStatus['status'] == 'protected'){
                    return $result = response()->json(['ResultCode'=>ResultCode::_025926_CannotInviteProtectedUserWhoIsNotFriend,
                        'Message'=>"保護名單必須是好友才能聊天",
                        'Content'=>""]);
                }else{
                     $destArr[] = $userStatus['login_id'];
                }
            }

            //1.update chatroom infomation on DB
            if(count($member) > 0){
                $data=array('member'=>implode(',',$member));
                $this->chatRoomService->updateChatroom($groupId, $data, $userId);
            }
            //2. call Jmessage to add group mamber
            if(count($destArr) > 0){
                $response = $this->chatRoomService->addGroupMember($groupId, $destArr);
            }

            if(isset($response->error)){
                throw new JMessageException($response->error->message);
            }
            \DB::commit();
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>""]);
            
        }catch (JMessageException $e){
             return $result = response()->json(['ResultCode'=>ResultCode::_025925_CallAPIFailedOrErrorOccurs,
                        'Message'=>"Call API failed or error occurred",
                        'Content'=>$response]);
        }catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>$e->getMessage()]);
        }

    }
}

class JMessageException extends Exception { }