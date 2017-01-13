<?php

namespace App\Http\Controllers;

use Request;
use Mockery\CountValidator\Exception;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Services\UserService;
use DB;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * 取得登入者的權限資訊
     * @return json 
     */
    public function getAuthority(){
        try{
            
            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                 $result = response()->json(['ResultCode'=>$verifyResult["code"],
                    'Message'=>$verifyResult["message"],
                    'Content'=>'']);
                return $result;
            }

            $input = Input::get();
            $xml=simplexml_load_string($input['strXml']);
            $empNo = (string)$xml->emp_no[0];
            
            $roleList = $this->userService->getUserRoleList($empNo);
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Content'=>array("RoleList"=>$roleList)]);

        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
        }

    }
}