<?php


namespace App\Http\Controllers;

use Request;
use Mockery\CountValidator\Exception;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Services\BasicInfoService;
use DB;

class BasicInfoController extends Controller
{

    protected $basicInfoService;

    public function __construct(BasicInfoService $basicInfoService)
    {
        $this->basicInfoService = $basicInfoService;
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
            $resultList = $this->basicInfoService->getBasicInfo($empNo);

            if(count($resultList) == 0){
                return $result = response()->json(['ResultCode'=>ResultCode::_014908_accountNotExist,
                    'Message'=>"帳號不存在",
                    'Content'=>""]);
            }else{
                return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Content'=>$resultList]);
            }

        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
        }
    }
}

