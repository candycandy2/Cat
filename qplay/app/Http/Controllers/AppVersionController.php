<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Validation;
use Illuminate\Support\Facades\Input;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\Services\AppVersionService;
use App\Services\AppService;

class AppVersionController extends Controller
{

    protected $appService;
    protected $appVersionService;
    /**
     * 建構子，初始化引入相關服務
     * @param AppVersionService $appVersionService 地點基本資訊服務
     */
    public function __construct(AppService $appService, AppVersionService $appVersionService)
    {
        $this->appService = $appService;
        $this->appVersionService = $appVersionService;
    }


    public function uploadVersion(Request $request){

         $validator = \Validator::make($request->all(), [
            'app_key' => 'required',
            'device_type' => 'required|in:android,ios',
            'version_code' => 'required|integer',
            'version_name' => 'required',
            'version_log' => 'required',
            'userfile'=>'required',
            'user_id' => 'required|is_user_exist'
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>ResultCode::_999001_requestParameterLostOrIncorrect,'Message'=>$validator->messages()], 200);
        }


        $input = Input::all();
        $appKey     = trim($input['app_key']);
        $deviceType = trim($input['device_type']);
        $userId     = trim($input['user_id']);
        $versionCode = trim($input['version_code']);
        $versionName = trim($input['version_name']);
        $versionFile =  Input::file('userfile');

        $isApkFile = $this->validatAppFileType($deviceType, $versionFile->getClientOriginalName());
        if(!$isApkFile){
            return response()->json(['ResultCode'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'Message'=>'wrong file type']);
        }

        $userInfo = CommonUtil::getUserInfoJustByUserID($userId);
        $userRowId = $userInfo->row_id;
        $appInfo = $this->appService->getAppInfoByAppKey($appKey);
        if(is_null($appInfo)){
            return response()->json(['ResultCode'=>ResultCode::_000909_appKeyNotExist,
                'Message'=>'there is no app whith this app key']);
        }
        $appId = $appInfo->row_id;
        if(!$this->appVersionService->validateVersionCode($appId, $deviceType, $versionCode)){
            return response()->json(['ResultCode'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'Message'=>'the version_code must bigger than before version']);
        }
         if(!$this->appVersionService->validateVersionName($appId, $deviceType, $versionName)){
            return response()->json(['ResultCode'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'Message'=>'version name is already exist']);
        }

        \DB::beginTransaction();
        try{
            //step1:下架舊版本
            $this->appVersionService->unPublishVersion($appId, $deviceType, $userRowId);
             
            //step2:上傳新版本並將版本設定為上架中
            $this->appVersionService->uploadAndPublishVersion($appId, $input, $versionFile, $userRowId);
            
            \DB::commit();
              return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Message'=>trans("messages.MSG_OPERATION_SUCCESS"),
                'Content'=>''
            ]);
        }catch(\Exception $e){
           \DB::rollBack();
             return response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
                'Message'=>$e->getMessage(),
                'Content'=>''
            ]);
        }

    }

    /**
     * 根據副檔名驗證檔案類型
     * @param  String $deviceType 裝置類型(ios|android)
     * @param  String $fileName   檔案名稱(含附檔名)
     * @return bool             驗證結果
     */
    private function validatAppFileType($deviceType, $fileName){
        $result = false;
        if($deviceType == 'ios'){
            $result = (substr($fileName,-4) == '.ipa')?true:fasle;
        }else if($deviceType == 'android'){
            $result = (substr($fileName,-4) == '.apk')?true:fasle;
        }
        return $result;   
    }
}