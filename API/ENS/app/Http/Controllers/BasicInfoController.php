<?php
namespace App\Http\Controllers;

use Mockery\CountValidator\Exception;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Services\BasicInfoService;
use DB;

class BasicInfoController extends Controller
{

    protected $basicInfoService;

    /**
     * 建構子，初始化引入相關服務
     * @param BasicInfoService $basicInfoService 地點基本資訊服務
     */
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
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
        }
    }

    /**
     * 上傳成員基本資料
     * @return json
     */
    public function uploaBasicInfo(Request $request){
    
       $validator = Validator::make($request->all(), [
            'basicInfoFile' => 'required|mimes:xls,xlsx'
        ]);
        if ($validator->fails()) {
            return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
        }
       $input = $request->all();
       $this->basicInfoService->importBasicInfo($input['basicInfoFile']);
    }

    public function basicInfoMaintain(){
        $basicInfo = $this->basicInfoService->getBasicInfo();
        return view('basic_info/basic_info_maintain')->with('basicInfo',$basicInfo );
    }
}

