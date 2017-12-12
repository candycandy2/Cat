<?php
namespace App\Http\Controllers;

use Validator;
use App\lib\Verify;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Services\UserService;

class UserController extends Controller
{

    protected $xml;
    protected $data;
    protected $userService;

    /**
     * PushController constructor.
     * @param UserService $userService
     * @param PushService $pushService
     */
    public function __construct(UserService $userService)
    {   
        $this->userService = $userService;
        $input = Input::get();
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
    }
    
    /**
     * 透過此API可以設定人員的詳細資料
     */
    public function setQUserDetail(){
        $range = Validator::make($this->data, [
            'memo'=>'max:200'
         ]);
        if($range->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
        }
        if(!isset($this->data['memo'])){
            $this->data['memo'] = null;
        }
        if(is_array($this->data['memo'])){   
            if(count($this->data['memo']) > 0){
             return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }else {
                $this->data['memo'] = null;
            }
        }
        $empNo = $this->data['emp_no'];
        $userData = $this->userService->getUserData($empNo);
        $userId = $userData['row_id'];
        $memo = $this->data['memo'];
        $data = array('memo'=>$memo);
        $res = $this->userService->setQUserDetail($empNo, $data, $userId);
        $result = ['ResultCode'=>ResultCode::_1_reponseSuccessful,'Message'=>''];
        return response()->json($result);
    }

    /**
     * 透過此API可以獲得人員的詳細資訊, 包含分機號碼等
     */
    public function getQUserDetail(){
        $required = Validator::make($this->data, [
            'destination_emp_no' => 'required_without:destination_login_id',
            'destination_login_id'=>'required_without:destination_emp_no'
        ]);

        if($required->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                    'Message'=>"必填字段缺失",
                    'Content'=>""]);
        }
        $empNo = $this->data['emp_no'];
        $destinationEmpNo = "";
        $destinationLoginId = "";
        if(isset($this->data['destination_emp_no'])){
            if(!is_null($this->data['destination_emp_no'])){
                 $destinationEmpNo = $this->data['destination_emp_no'];
            }
        }
        if(isset($this->data['destination_login_id'])){
            if(!is_null($this->data['destination_login_id'])){
                 $destinationLoginId = $this->data['destination_login_id'];
            }
        }
        if($destinationLoginId!="" && count($destinationLoginId) > 0){//用員工編號查
           $userData = $this->userService->getUserDataByLoginId($destinationLoginId);
           if(is_null($userData)){
                return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeInfoIsInvalid,
                'Message'=>"要查詢的人員不存在",
                'Content'=>""]);
           }
           $destinationEmpNo = $userData->emp_no;
        }
        if(!Verify::checkUserStatusByUserEmpNo($destinationEmpNo)) {
         return $result = response()->json(['ResultCode'=>ResultCode::_025921_DestinationEmployeeInfoIsInvalid,
                'Message'=>"要查詢的人員不存在",
                'Content'=>""]);
        }
        $userDerail = $this->userService->getQUserDetail($empNo, $destinationEmpNo);
        if($userDerail ==null || count($userDerail) == 0){
             return $result = response()->json(['ResultCode'=>ResultCode::_025998_NoData,
                    'Message'=>"查無資料",
                    'Content'=>""]);
        }
        $result = ['ResultCode'=>ResultCode::_1_reponseSuccessful,'Content'=>$userDerail,'Message'=>''];
        return response()->json($result);
    }

}
