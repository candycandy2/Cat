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
use Excel;

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
            $appKey = (string)$xml->app_key[0];

            if($appKey ==""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }
            
            $resultList = $this->basicInfoService->getBasicInfo($appKey);

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

    /**
     * 上傳成員基本資料
     * @return json
     */
    public function uploaBasicInfo(Request $request){
        
        \DB::beginTransaction();
        try{

           $validator = Validator::make($request->all(), [
                    'basicInfoFile' => 'required|mimes:xls,xlsx'
                ],[
                    'required'=>'請上傳檔案',
                    'mimes'=>'請上傳檔案格式 :values'
                ]);
            if ($validator->fails()) {
                return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                        'Message'=>"validate error",
                        'Content'=> $validator->errors()->all()]);
            }
       
            $input = $request->all();
            $validRes = $this->basicInfoService->validateUploadBasicInfo($input['basicInfoFile']);
            if($validRes['ResultCode'] == ResultCode::_1_reponseSuccessful){
               $this->basicInfoService->importBasicInfo($input['basicInfoFile']);
               $registerManager = $this->registerSuperUserToMessage()->getData();
               if($registerManager->ResultCode != ResultCode::_1_reponseSuccessful){
                    return $registerManager;
               }
               return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful]);
            }else{
               return $result = response()->json($validRes);  
            }
            
          \DB::commit();
        } catch (\Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>"",
            'Message'=>$e->getMessage()]);
        }
      
    }

    /**
     * 向QMessage註冊主管與管理員
     * @return json
     */
    public function registerSuperUserToMessage(){
        try{
            
            $res = $this->userService->registerSuperUserToMessage();

         } catch (\Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>"",
            'Message'=>$e->getMessage()]);
        }
            return $result = response()->json($res);
    }

    /**
     * 成員基本資料管理
     * @return View 成員基本資料維護頁
     */
    public function basicInfoMaintain(){
        $basicInfo = $this->basicInfoService->getBasicInfoMemberRawData();
        return view('basic_info/basic_info_maintain')->with('basicInfo',$basicInfo );
    }

}

