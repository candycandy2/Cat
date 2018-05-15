<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Contracts\Validation;
use Mockery\CountValidator\Exception;
use App\Services\AppVersionService;
use App\lib\ResultCode;
use App\lib\FilePath;
use App\lib\CommonUtil;
use App\lib\Verify;
use File;
use Validator;

class appVersionController extends Controller
{   

    protected $appVersionService;

    public function __construct(AppVersionService $appVersionService)
    {
        $this->appVersionService = $appVersionService;
    }
    /**
     * 多筆刪除App相關檔案
     * @return json
     */
    public function deleteAppFile(Request $request){
        
        $input = Input::all();
        foreach ($input as $key => $delVersionInfo) {

            $destinationPath = FilePath::getApkUploadPath( trim($delVersionInfo['app_id']),
                                        trim($delVersionInfo['device_type']),
                                        trim($delVersionInfo['version_code']));

            if(file_exists($destinationPath)){
                $it = new \RecursiveDirectoryIterator($destinationPath, \RecursiveDirectoryIterator::SKIP_DOTS);
                $files = new \RecursiveIteratorIterator($it,
                             \RecursiveIteratorIterator::CHILD_FIRST);
                foreach($files as $file) {
                    if ($file->isDir()){
                        rmdir($file->getRealPath());
                    } else {
                        unlink($file->getRealPath());
                    }
                }
                rmdir($destinationPath);
            }
        }

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
            'content'=>""
        ];
        return response()->json($result);
    }

    /**
     * 從發布路徑刪除App及manifest
     * @return json
     */
    public function deleteAppFileFromPublish(){

        $input = Input::all();
        $appId = $input['app_id'];
        $deviceType = $input['device_type'];
        $fileName = $input['file_name'];
        $publishFilePath = FilePath::getApkPublishFilePath($appId,$deviceType);
        if($fileName!="" && file_exists($publishFilePath.$fileName)){
            unlink($publishFilePath.$fileName);
        }
        if(file_exists($publishFilePath.'manifest.plist')){
            unlink($publishFilePath.'manifest.plist');
        }

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
            'content'=>""
        ];
        return response()->json($result);
    }

    /**
     *上傳App檔案
     * @return json
     */
    public function uploadAppFile(){
        
        $input = Input::all();
        $appId = trim($input['app_ida']);
        $deviceType = trim($input['device_type']);
        $versionCode = trim($input['version_code']);
        $appKey = trim($input['app_key']);
        $versionFile =  Input::file('version_file');

        $destinationPath = FilePath::getApkUploadPath($appId,$deviceType,$versionCode);
        if(isset($versionFile)){
            $fileName = $versionFile->getClientOriginalName();
            $versionFile ->move($destinationPath,$fileName);
            if($deviceType == 'ios'){
                $manifestContent = $this->getManifest($appId, $appKey, $deviceType, $versionCode ,$fileName);
                 if(isset($manifestContent)){
                    $file = fopen($destinationPath."manifest.plist","w"); 
                    fwrite($file,$manifestContent );
                    fclose($file);
                 }
            }
        }

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
            'content'=>""
        ];
        return response()->json($result);
    }

    /**
     * 將app檔案搬到發布路徑
     * @return json
     */
    public function copyAppFileToPublish(){

        $input = Input::all();
        $appId = trim($input['app_id']);
        $versionData = $input['version_data'];
        $destinationPath = FilePath::getApkUploadPath($appId,$versionData['device_type'],$versionData['version_code']);
        $publishFilePath = FilePath::getApkPublishFilePath($appId,$versionData['device_type']);
        $fileName = $versionData['file_name'];
        \File::copy($destinationPath.$fileName,$publishFilePath.$fileName);
        if($versionData['device_type'] == 'ios'){
            \File::copy($destinationPath.'manifest.plist',$publishFilePath.'manifest.plist');
        }

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
            'content'=>""
        ];
        return response()->json($result);

        return $publishFilePath;
    }

    /**
     * 取得歷史版本說明
     * @return json
     */
    public function getVersionLog(Request $request){
        
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
         $input = Input::all();
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful)
        {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            return response()->json($result);
        }

        $validator = Validator::make($request->all(), [
            'uuid'=>'required',
            'app_key' => 'required',
            'device_type' => 'required|in:ios,android',
        ],
        [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'in' => ResultCode::_999001_requestParameterLostOrIncorrect
        ]);
        if ($validator->fails()) {
             return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }
    
        $uuid = $input['uuid'];
        $appKey = $input['app_key'];
        $deviceType = $input['device_type'];

        $verifyUserStatus = $Verify->checkUserStatusByUuid($uuid);
        if($verifyUserStatus["result_code"] != ResultCode::_1_reponseSuccessful)
        {
            return response()->json($verifyUserStatus);
        }

        if(!Verify::chkAppKeyExist($appKey)) {
            $result = ['result_code'=>ResultCode::_999010_appKeyIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect),
                'content'=>''];
            return response()->json($result);
        }
        
        $appInfo = CommonUtil::getAppHeaderInfo();
        $versionLogList =  $this->appVersionService->getVersionLog($appInfo->row_id, $deviceType);

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'content'=>array('version_list'=>$versionLogList)
            ];
        return response()->json($result);
    }

    /**
     * Create nessary ManiFest Content form parameter for IOS ipa download
     * @param  int    $appRowId    qp_app_head.row_id
     * @param  string $appKey      qp_project.app_key
     * @param  string $deviceType  device type string ,ios|android
     * @param  string $versionCode cersion code
     * @param  string $fileName    ipa fileName 
     * @return string              manifest file content
     * @author Cleo.W.Chan
     */
    private function getManifest($appRowId, $appKey, $deviceType, $versionCode, $fileName){
    
        $MANIFEST_TEMPLETE_PATH = base_path('resources'. DIRECTORY_SEPARATOR .'templete'. DIRECTORY_SEPARATOR .'manifest.plist');
        $contents = null;
        $intra = true;
        if (File::exists($MANIFEST_TEMPLETE_PATH))
        {
            $contents = File::get($MANIFEST_TEMPLETE_PATH);
            $appDownLoadUrl = FilePath:: getApkUrl($appRowId,$deviceType,$versionCode,$fileName, $intra);
            $package = \Config::get('app.app_package') .'.'.$appKey;

            $contents = str_replace("{{url}}", $appDownLoadUrl, $contents);
            $contents = str_replace("{{package}}", $package, $contents);
            $contents = str_replace("{{version}}", $versionCode, $contents);
            $contents = str_replace("{{title}}", $appKey, $contents);
        }
        return $contents ;  
    }
}