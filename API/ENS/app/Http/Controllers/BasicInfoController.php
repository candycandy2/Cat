<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Services\BasicInfoService;
use App\Services\UserService;
use DB;
use Config;

class BasicInfoController extends Controller
{

    protected $basicInfoService;
    protected $userService;

    /**
     * 建構子，初始化引入相關服務
     * @param BasicInfoService $basicInfoService 地點基本資訊服務
     */
    public function __construct(BasicInfoService $basicInfoService, UserService $userService)
    {
        $this->basicInfoService = $basicInfoService;
        $this->userService = $userService;
    }
    /**
     * 取得地點等基本資訊
     * @return json
     */
    public function getBasicInfo(){
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
            $project = (string)$xml->project[0];

            if($project ==""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if(!in_array($project, Config::get('app.ens_project'))){
                return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                    'Message'=>"project參數不存在",
                    'Content'=>""]);
            }
            
            $resultList = $this->basicInfoService->getBasicInfo($project);

            if(count($resultList) == 0){
                return $result = response()->json(['ResultCode'=>ResultCode::_014908_accountNotExist,
                    'Message'=>"帳號不存在",
                    'Content'=>""]);
            }else{
                return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Content'=>$resultList]);
            }

        } catch (\Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
        }
    }
}

