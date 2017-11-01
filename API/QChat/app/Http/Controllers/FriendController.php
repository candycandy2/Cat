<?php
namespace App\Http\Controllers;

use DB;
use Validator;
use Config;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\Services\UserService;
use App\Services\FriendService;

class FriendController extends Controller
{
    protected $userService;
    protected $friendService;
    protected $xml;
    protected $data;

    private $userId;

    public function __construct(UserService $userService,
                                FriendService $friendService)
    {
        $input = Input::get();
        $this->userService = $userService;
        $this->friendService = $friendService;
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
        $this->ini();

    }

    private function ini(){
        $userData = $this->userService->getUserData($this->data['emp_no']);
        $this->userId=$userData->row_id;
    }
    /**
     * 透過此API可以獲得集團內的人員基本資料
     * @param  Request $request
     * @return json
     */
    public function getQList(Request $request){
        try {
            $required = Validator::make($this->data, [
                'search_type' => 'required',
                'friend_only' => 'required',
                'emp_no' => 'required',
                'search_string' => 'required_if:search_type,==,1|
                                    required_if:search_type,==,2',
            ]);

            $range = Validator::make($this->data, [
                'friend_only' => 'in:Y,N',
                'search_type' => 'in:1,2,3',
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
            if(is_array($this->data['search_string'])){
                
                if(count($this->data['search_string']) > 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                        'Message'=>"欄位格式錯誤",
                        'Content'=>""]);
                }else {
                    $this->data['search_string'] = "";
                }
            }

            $searchType = $this->data['search_type'];
            $searchString = $this->data['search_string'];
            $friendOnly = $this->data['friend_only'];
            $empNo = $this->data['emp_no'];

            
            $userList =  $this->userService->getUserList($searchType, $friendOnly, $empNo, $searchString);
            
            if(!isset($userList['user_list']) || count($userList['user_list']) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025998_NoData,
                        'Message'=>"查無資料",
                        'Content'=>""]);
            }
            
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>$userList]);
        }catch (\Exception $e) {
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }
    }

    /**
     * 透過此API可以獲得登入者的所有朋友名單, 包含保護名單已經成為朋友者
     * @param  Request $request $request
     * @return json
     */
    public function getQFriend(Request $request){
        try {
            if(!isset($this->data['search_string']) || 
                count($this->data['search_string']) == 0){
                $this->data['search_string'] = "";
            }else{
                 if(count($this->data['search_string']) > 1){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                        'Message'=>"欄位格式錯誤",
                        'Content'=>""]);
                }
            }

            $userList = ['friend'=>[],'inviter'=>[]];
            $searchString = $this->data['search_string'];
            $empNo = $this->data['emp_no'];

            $friendList =  $this->userService->getUserList(1, 'Y', $empNo, $searchString);
            $inviterList = $this->friendService->getInviterList($empNo);

            $userList['friend'] = $friendList;
            $userList['inviter']['user_list'] = $inviterList;

            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>$userList]);
        }catch (\Exception $e) {
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }
    }

    /**
     * 透過API設定為好友, 比較貼近設定為我的最愛的概念, 只能針對非保護名單設定好友
     * @param  Request $request
     * @return json
     */
    public function setQFriend(Request $request){
        \DB::beginTransaction();
        try {
            $required = Validator::make($this->data, [
                'destination_emp_no' => 'required',
            ]);

            $range = Validator::make($this->data, [
                'destination_emp_no' => 'numeric|different:emp_no',
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

            $fromEmpNo = $this->data['emp_no'];
            $targetEmpNo = $this->data['destination_emp_no'];
            
            if(!Verify::checkUserStatusByUserEmpNo($targetEmpNo)) {
                 return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeNumberIsInvalid,
                        'Message'=>"要設定的好友工號不存在",
                        'Content'=>""]);
            }

            $friendShip = $this->userService->getUserStatus($fromEmpNo, $targetEmpNo);

            if($friendShip['status']  == 'protected'){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025922_DestinationEmployeeNumberIsProtectUser,
                        'Message'=>"要設定的好友是保護名單",
                        'Content'=>""]);
            }
            if($friendShip['status']  == 'friend'){//已經是好友
                return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>""]);
            }

            $this->friendService->setQfriend($fromEmpNo, $targetEmpNo, $this->userId);
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>""]);

           
        }catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }
    }

    /**
     * 透過此API送出交友邀請給保護名單用戶
     * @return json
     */
    public function sendQInvitation(){
        \DB::beginTransaction();
        try {
            $required = Validator::make($this->data, [
                'destination_emp_no' => 'required',
            ]);

            $range = Validator::make($this->data, [
                'destination_emp_no' => 'numeric|different:emp_no',
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

            
            if(!isset($this->data['reason']) || 
                count($this->data['reason']) == 0){
                $this->data['reason'] = "";
            }else{
                 if(count($this->data['reason']) > 1){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                        'Message'=>"欄位格式錯誤",
                        'Content'=>""]);
                }
            }

            $fromEmpNo = $this->data['emp_no'];
            $targetEmpNo = $this->data['destination_emp_no'];
            $reason = $this->data['reason'];
            
            if(!Verify::checkUserStatusByUserEmpNo($targetEmpNo)) {
                 return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeNumberIsInvalid,
                        'Message'=>"要設定的好友工號不存在",
                        'Content'=>""]);
            }

            $friendShip = $this->userService->getUserStatus($fromEmpNo, $targetEmpNo);
            $status = $friendShip['status'];

            if( $status  == 'common'){
                return $result = response()->json(['ResultCode'=>ResultCode::_025922_DestinationEmployeeNumberIsProtectUser,
                        'Message'=>"要設定的好友不是保護名單",
                        'Content'=>""]);
            }
            if( $status  == 'friend'){//已經是好友
                return $result = response()->json(['ResultCode'=>ResultCode::_025923_YouCannotSendTheInvitationToFriends,
                        'Message'=>"要設定對象已經是好友",
                        'Content'=>""]);
            }
            if( $status == 'invitated'){
                return $result = response()->json(['ResultCode'=>ResultCode::_025927_InvitationAlreadySend,
                        'Message'=>"好友邀請已送出",
                        'Content'=>""]);
            }

            $this->friendService->sendQInvitation($fromEmpNo, $targetEmpNo, $this->userId, $reason);
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>""]);
            
        }catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }
    }

    /**
     * 接受交友邀請
     * @return json
     */
    public function acceptQInvitation(){
        \DB::beginTransaction();
        try {
            $required = Validator::make($this->data, [
                'source_emp_no' => 'required',
            ]);

            $range = Validator::make($this->data, [
                'source_emp_no' => 'numeric|different:emp_no',
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

            $empNo = $this->data['emp_no'];
            $sourceEmpNo = $this->data['source_emp_no'];
            
            if(!Verify::checkUserStatusByUserEmpNo($sourceEmpNo)) {
                 return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeNumberIsInvalid,
                        'Message'=>"要設定的好友工號不存在",
                        'Content'=>""]);
            }
            $invitation = $this->friendService->getQInvitation($sourceEmpNo,$empNo);
            if(count($invitation) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025928_InvitationNotExist,
                        'Message'=>"交友邀請不存在",
                        'Content'=>""]);
            }

            $this->friendService->acceptQInvitation($empNo, $sourceEmpNo, $this->userId);
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>""]);
            
        }catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }

    }

    /**
     * 拒絕交友邀請
     * @return json
     */
    public function rejectQInvitation(){
        \DB::beginTransaction();
        try {
            $required = Validator::make($this->data, [
                'source_emp_no' => 'required',
            ]);

            $range = Validator::make($this->data, [
                'source_emp_no' => 'numeric|different:emp_no',
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

            if(!isset($this->data['reason']) || 
                count($this->data['reason']) == 0){
                $this->data['reason'] = "";
            }else{
                 if(count($this->data['reason']) > 1){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                        'Message'=>"欄位格式錯誤",
                        'Content'=>""]);
                }
            }

            $empNo = $this->data['emp_no'];
            $sourceEmpNo = $this->data['source_emp_no'];
            $rejectReason = $this->data['reason'];

            if(!Verify::checkUserStatusByUserEmpNo($sourceEmpNo)) {
                 return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeNumberIsInvalid,
                        'Message'=>"要設定的好友工號不存在",
                        'Content'=>""]);
            }
            $invitation = $this->friendService->getQInvitation($sourceEmpNo,$empNo);
            if(count($invitation) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025928_InvitationNotExist,
                        'Message'=>"交友邀請不存在",
                        'Content'=>""]);
            }
            $this->friendService->rejectQInvitation($empNo, $sourceEmpNo, $this->userId, $rejectReason);
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>""]);
            
        }catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }
    }

    /**
     * 透過此API刪除好友
     * @return json
     */
    public function removeQFriend(){
         \DB::beginTransaction();
         try {
            $required = Validator::make($this->data, [
                'destination_emp_no' => 'required',
            ]);

            $range = Validator::make($this->data, [
                'destination_emp_no' => 'numeric|different:emp_no',
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

            $empNo = $this->data['emp_no'];
            $destinationEmpNo = $this->data['destination_emp_no'];

            if(!Verify::checkUserStatusByUserEmpNo($destinationEmpNo)) {
                 return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeNumberIsInvalid,
                        'Message'=>"要設定的好友工號不存在",
                        'Content'=>""]);
            }
            $isProtectedUser = $this->userService->checkUserIsProteted($empNo);
            $this->friendService->removeQFriend($empNo, $destinationEmpNo, $this->userId);
            if( $isProtectedUser ){
                //保護用戶需雙向解除朋友關係
                $this->friendService->removeQFriend($destinationEmpNo, $empNo, $this->userId);
            }
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>""]);
            
        }catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }
    }

    /**
     * 透過此API送出安裝邀請
     * @return json
     */
    public function sendQInstall(){
       try {
          
            $required = Validator::make($this->data, [
                'destination_emp_no' => 'required'
            ]);

            if($required->fails())
            {
                return $result = response()->json(['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                        'Message'=>"必填字段缺失",
                        'Content'=>""]);
            }

            $empNo = $this->data['emp_no'];
            $destEmpNo = $this->data['destination_emp_no'];
           
            if(!Verify::checkUserStatusByUserEmpNo($destEmpNo)) {
             return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeNumberIsInvalid,
                    'Message'=>"要設定的好友工號不存在",
                    'Content'=>""]);
            }
            $registerMessage = $this->userService->getQMessageRegister($destEmpNo);
            if($registerMessage->register_message == 'Y'){
                return $result = response()->json(['ResultCode'=>ResultCode::_025924_DestinationEmployeeAlreadyRegistered,
                'Message'=>"要邀請的好友已經註冊過QPlay",
                'Content'=>""]);
            }

            $user = $this->userService->getUserData($empNo);
            $destUser = $this->userService->getUserData($destEmpNo);
            $data = array(
                        'sender'      =>$user->login_id,
                        'receiver'    =>$destUser->login_id,
                        'to'          =>$destUser->email,
                        'fromName'    =>Config::get('app.mail_name'),
                        'fromAddress' =>Config::get('app.mail_address'),
                        'subject'     =>$user->login_id ."邀請您使用QPlay",
                        'sendDate'    =>time()
                    );
            $template = 'emails.invitation_to_install';
            CommonUtil::sendMail($template,$data);

            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"",
                        'Content'=>""]);
        }catch (\Exception $e) {
            return response()->json(['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""]);
        }
    }
}