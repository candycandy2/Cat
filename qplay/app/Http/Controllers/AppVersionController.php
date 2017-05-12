<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Validation;
use Illuminate\Support\Facades\Input;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\FilePath;
use App\Services\AppVersionService;
use App\Services\AppService;
use App\lib\Verify;

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

    /**
     * 自動上架App版本
     * @param  Request $request 
     * @return json
     */
    public function uploadAppVersion(Request $request){
        \DB::beginTransaction();
        try{
            $request->request->add(['lang' => 'zh-tw']);
            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {

                $validator = \Validator::make($request->all(), [
                'device_type' => 'required|in:android,ios',
                'version_code' => 'required|integer',
                'version_name' => 'required',
                'version_log' => 'required',
                'userfile'=>'required',
                'user_id' => 'required|is_user_exist'
                ],
                [
                    'is_user_exist' => 'user is not exist'
                ]);

                if ($validator->fails()) {
                     return response()->json(['ResultCode'=>ResultCode::_999001_requestParameterLostOrIncorrect,'Message'=>$validator->messages()], 200);
                }
            
                $input = Input::all();
                $appKey     = $request->header('App-Key');
                $deviceType = trim($input['device_type']);
                $userId     = trim($input['user_id']);
                $versionCode = trim($input['version_code']);
                $versionName = trim($input['version_name']);
                $versionFile =  Input::file('userfile');
                
                if(is_null($versionFile)){
                    $errorMsg['userfile'] = ['userfile must be file type'];
                    return response()->json(['ResultCode'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                        'Message'=>$errorMsg]);
                }

                $isApkFile = $this->validatAppFileType($deviceType, $versionFile->getClientOriginalName());
                if(!$isApkFile){
                    $errorMsg['userfile'] = ['userfile type error'];
                    return response()->json(['ResultCode'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                        'Message'=>$errorMsg]);
                }

                $userInfo = CommonUtil::getUserInfoJustByUserID($userId);
                $userRowId = $userInfo->row_id;
                $appInfo = $this->appService->getAppInfoByAppKey($appKey);
                if(is_null($appInfo)){
                    return response()->json(['ResultCode'=>ResultCode::_999010_appKeyIncorrect,
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


                //step1:下架舊版本
                $this->appVersionService->unPublishVersion($appId, $deviceType, $userRowId);
                 
                //step2:上傳新版本並將版本設定為上架中
                $this->appVersionService->uploadAndPublishVersion($appId, $input, $versionFile, $userRowId, $appKey);
                
                //step3:更新qp_app_head.update_at
                $this->appService->updateAppInfoById($appId,['updated_at'=>date('Y-m-d H:i:s',time())]);

                \DB::commit();
                  return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Message'=>trans("messages.MSG_OPERATION_SUCCESS"),
                    'Content'=>''
                ]);
            }else{
                $result = ['ResultCode'=>$verifyResult["code"],
                'Message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'Content'=>''];
                $result = response()->json($result);
                return $result;
            }

        }catch(\Exception $e){
           \DB::rollBack();
             return response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
                'Message'=>$e->getMessage(),
                'Content'=>''
            ]);
        }

    }

    /**
     * 取得目前發布中的版本
     * @return Array
     */
    public function getAppOnlineVersion(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
         if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $appRowId = $input["app_row_id"];
        $deviceType = $input["device_type"];

        $appVersionList = $this->appVersionService->getAppOnlineVersion($appRowId, $deviceType);
        return response()->json($appVersionList);
    }

    /**
     * 取得最新上傳的版本
     * @return Array
     */
    public function getAppNewVersion(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
         if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $appRowId = $input["app_row_id"];
        $deviceType = $input["device_type"];
        $appVersionList = $this->appVersionService->getAppNewVersion($appRowId, $deviceType);
        return response()->json($appVersionList);
    }

    /**
     * 取得歷史版本
     * @return Array
     */
    public function getAppHistoryVersion(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();

        if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }

        $appRowId = $input["app_row_id"];
        $deviceType = $input["device_type"];
        $offset = $input["offset"];
        $limit = $input["limit"];
        $sort = $input["sort"];
        $order = $input["order"];
        $search = (isset($input["search"]) && $input["search"]!="")?$input["search"]:null;

        $appVersionList = $this->appVersionService->getAppHistoryVersion($appRowId, $deviceType, $offset, $limit, $sort, $order, $search);
        return response()->json(["total"=>$appVersionList->total(),"rows"=>$appVersionList->items()]);
    }

    public function ajxValidVersion(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

         if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $versionNo = $jsonContent['versionNo'];
            $versionName = $jsonContent['versionName'];
            $deviceType = $jsonContent['deviceType'];
            $appId = $jsonContent['appId'];
            $error = [];
            $resValidCode = $this->appVersionService->validateVersionCode($appId, $deviceType, $versionNo);
            if(!$resValidCode){
                $error['No'] = trans('messages.ERR_VERSION_NO_MUST_GREATER_THAN_PREVIOUS');
            }
            $resValidName = $this->appVersionService->validateVersionName($appId, $deviceType, $versionName);
            if(!$resValidName){
                $error['Name'] = trans('messages.ERR_VERSION_NAME_DUPLICATE');
            }
            if(count($error) > 0){
                return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,'messages'=>$error ]);
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful]);
        }

        return null;
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
            $result = (substr($fileName,-4) == '.ipa')?true:false;
        }else if($deviceType == 'android'){
            $result = (substr($fileName,-4) == '.apk')?true:false;
        }
        return $result;   
    }
}