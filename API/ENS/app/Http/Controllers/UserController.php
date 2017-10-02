<?php

namespace App\Http\Controllers;

use Request;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Services\UserService;
use App\Services\BasicInfoService;
use DB;
use Config;

class UserController extends Controller
{
    protected $userService;
    protected $basicInfoService;

    /**
     * 建構子，初始化引入相關服務
     * @param UserService      $userService      用戶服務
     * @param BasicInfoService      $basicInfoService      成員資訊
     */
    public function __construct(UserService $userService, BasicInfoService $basicInfoService)
    {
        $this->userService = $userService;
        $this->basicInfoService = $basicInfoService;
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
            $result = [];

            $roleList = $this->userService->getUserRoleList($empNo);

            foreach ( Config::get('app.ens_project') as $project) {
                $tmpResult = [];
                if(isset($roleList[$project])){
                    $tmpResult['Project'] = $project;
                    $tmpResult['RoleList'] = $roleList[$project];
                }else{
                    $rs = $this->basicInfoService->checkUserIsMember($project, $empNo);
                    if($rs){
                        $tmpResult['Project'] = $project;
                        $tmpResult['RoleList'][] = 'common';
                    }
                }
                if(count($tmpResult) > 0){
                    array_push($result,$tmpResult);
                }
            }

           if(count($result) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014923_noAuthority,
                    'Message'=>"沒有任何專案權限",
                    'Content'=>""]);
           }
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Content'=>$result]);

        } catch (\Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
        }
    }
}