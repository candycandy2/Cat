<?php
namespace App\Http\Controllers;

use DB;
use Validator;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use App\lib\Verify;
use App\lib\ResultCode;
use App\Services\UserService;
use App\Services\FriendService;

class FriendController extends Controller
{
    protected $userService;
    protected $friendService;
    protected $xml;
    protected $data;

    public function __construct(UserService $userService,
                                FriendService $friendService)
    {
        $input = Input::get();
        $this->userService = $userService;
        $this->friendService = $friendService;
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
    }

    /**
     * 透過此API可以獲得集團內的人員基本資料
     * @param  Request $request
     * @return json
     */
    public function getQList(Request $request){

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
    }

    /**
     * 透過此API可以獲得登入者的所有朋友名單, 包含保護名單已經成為朋友者
     * @param  Request $request $request
     * @return json
     */
    public function getQFriend(Request $request){
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

        $searchString = $this->data['search_string'];
        $empNo = $this->data['emp_no'];

        $userList =  $this->userService->getUserList(1, 'Y', $empNo, $searchString);

        if(!isset($userList['user_list']) || count($userList['user_list']) == 0){
             return $result = response()->json(['ResultCode'=>ResultCode::_025998_NoData,
                    'Message'=>"查無資料",
                    'Content'=>""]);
        }
        
        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Message'=>"",
                    'Content'=>$userList]);
    }

    /**
     * 透過API設定為好友, 比較貼近設定為我的最愛的概念, 只能針對非保護名單設定好友
     * @param  Request $request
     * @return json
     */
    public function setQFriend(Request $request){

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

        $this->friendService->setQfriend($fromEmpNo, $targetEmpNo);

        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Message'=>"",
                    'Content'=>""]);
    }

}