<?php
/**
 * 處理App Version 相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\AppVersionRepository;
use App\lib\FilePath;
use File;

class AppVersionService
{   

    protected $appVersionRepository;

    public function __construct(AppVersionRepository $appVersionRepository)
    {
        $this->appVersionRepository = $appVersionRepository;
    }


    /**
     * 下架版本
     * @param  int    $appId      qp_app_head.row_id
     * @param  String $deviceType 裝置類型(ios|android)
     * @param  int    $userRowId  qp_user.row_id
     */
    public function unPublishVersion($appId, $deviceType, $userRowId){
        
        //delete file
        $this->deleteApkFileFromPath($appId,$deviceType);
        
        //update DB
        $updateData = array(
                    "status"=>"cancel",
                    "updated_user"=>$userRowId
                    );
        $whereCondi = array(
                        array(
                        "field"=>"status",
                        "op"=>"=",
                        "value"=>"ready"
                        )
                    );
        $this->appVersionRepository->updateAppVersion($appId, $deviceType, $whereCondi, $updateData);
        
    }

    /**
     * 上傳並發佈版本
     * @param  int    $appId       qp_app_head.row_id
     * @param  String $deviceType  裝置類型(ios|android)
     * @param  int    $versionCode 版本號
     * @param  file   $versionFile 檔案
     */
    public function uploadAndPublishVersion($appId, $versionData, $versionFile, $userRowId){
    
        //insert DB
        $insertData = array(
            array(
                'app_row_id' => $appId,
                'device_type'  => $versionData['device_type'],
                'version_code' => $versionData['version_code'],
                'version_name' => $versionData['version_name'],
                'version_log'  => $versionData['version_log'],
                'url' => $versionFile->getClientOriginalName(),
                'size' => $versionFile->getSize(),
                'ready_date'=> time(),
                'status' =>'ready',
                'created_user'=>$userRowId,
                'created_at'=>date('Y-m-d H:i:s',time())
                )
            );
        $this->appVersionRepository->newAppVersion($insertData);

        //upload File
        $this->uploadApkFile($appId, $versionData, $versionFile);
        
        $destinationPath = FilePath::getApkUploadPath($appId,$versionData['device_type'],$versionData['version_code']);
        $publishFilePath = FilePath::getApkPublishFilePath($appId,$versionData['device_type']);
        $alsoCopyManifest = ( $versionData['device_type'] == 'ios')?true:false;
        $this->copyApkFileToPath($versionFile->getClientOriginalName(), $destinationPath, $publishFilePath, $alsoCopyManifest);
        
    }

    public function validateVersionCode($appId, $deviceType, $versionCode){
        $whereCondi = array(
                array(
                "field"=>"version_code",
                "op"=>">=",
                "value"=>$versionCode
                )
            );
        $selectData = array('row_id');
        $result = $this->appVersionRepository->getAppVersion($appId, $deviceType, $whereCondi, $selectData);
        if(count($result) > 0){
            return false;
        }
        return true;
    }

    public function validateVersionName($appId, $deviceType, $versionName){
        $whereCondi = array(
                array(
                "field"=>"version_name",
                "op"=>"=",
                "value"=>$versionName
                )
            );
        $selectData = array('row_id');
        $result = $this->appVersionRepository->getAppVersion($appId, $deviceType, $whereCondi, $selectData);
        if(count($result) > 0){
            return false;
        }
        return true;
    }

    /**
     * 上傳檔案
     * @param  int    $appId       qp_app_head.row_id
     * @param  String $deviceType  裝置類型(ios|android)
     * @param  int    $versionCode 版本號
     * @param  file   $versionFile 檔案
     */
    private function uploadApkFile($appId, $versionData, $versionFile){
        
        $deviceType =  $versionData['device_type'];
        $versionCode = $versionData['version_code'];
        $appKey =  $versionData['app_key'];

        $destinationPath = FilePath::getApkUploadPath($appId, $deviceType, $versionCode);

        $fileName = $versionFile->getClientOriginalName();
        if(isset($versionFile)){
            $versionFile->move($destinationPath,$fileName);
            if($deviceType == 'ios'){
                $manifestContent = $this->getManifest($appId, $appKey, $deviceType, $versionCode, $fileName);
                 if(isset($manifestContent)){
                    $file = fopen($destinationPath."manifest.plist","w"); 
                    fwrite($file,$manifestContent );
                    fclose($file);
                 }
            }
        }

    }


    /**
     * 將檔案複製到目的
     * @param  string  $fileName           目標檔案名稱
     * @param  string  $copyFromPath       來源檔案路徑
     * @param  string  $copyToPath         目標檔案路徑
     * @param  boolean $alsoCopyManifest 是否一併移動manifest.plist檔案                 
     */
    private function copyApkFileToPath($fileName, $copyFromPath, $copyToPath, $alsoCopyManifest = false){ 
        \File::copy($copyFromPath.$fileName,$copyToPath.$fileName);
        if($alsoCopyManifest){
            \File::copy($copyFromPath.'manifest.plist',$copyToPath.'manifest.plist');
        }
    }

    /**
     * 移除檔案
     * @param  int      $appId      app_row_id
     * @param  string   $deviceType device type android|ios
     * @return string   $targetFilePath the path that had been delete
     */
    private function deleteApkFileFromPath($appId,$deviceType){

        $publishFilePath = FilePath::getApkPublishFilePath($appId,$deviceType);
        $OriPublish = $this->appVersionRepository->getPublishedApp($appId,$deviceType);

        //發佈的版本不為外部連結
        if(!is_null($OriPublish) && $OriPublish->external_app == 0){
            if($OriPublish->url!="" && file_exists($publishFilePath.$OriPublish->url)){
                $result = unlink($publishFilePath.$OriPublish->url);
            }
            //ios 需多刪除 manifest.plist
            if($deviceType == 'ios'){
                if(file_exists($publishFilePath.'manifest.plist')){
                    unlink($publishFilePath.'manifest.plist');
                }
            }
        }
    }

    /**
     * 產生ios下載時必要的 ManiFest 檔案
     * @param  int    $appRowId    qp_app_head.row_id
     * @param  string $appKey      qp_project.app_key
     * @param  string $deviceType  裝置類型 (ios|android)
     * @param  string $versionCode 版本號
     * @param  string $fileName    ipa 檔案名稱 
     * @return string              manifest 檔案內容
     * @author Cleo.W.Chan
     */
    private function getManifest($appRowId, $appKey, $deviceType, $versionCode, $fileName){
    
        $MANIFEST_TEMPLETE_PATH = base_path('resources'. DIRECTORY_SEPARATOR .'templete'. DIRECTORY_SEPARATOR .'manifest.plist');
        $contents = null;

        if (File::exists($MANIFEST_TEMPLETE_PATH))
        {
            $contents = File::get($MANIFEST_TEMPLETE_PATH);
            $appDownLoadUrl = FilePath:: getApkUrl($appRowId,$deviceType,$versionCode,$fileName);
            $package = \Config::get('app.app_package') .'.'.$appKey;

            $contents = str_replace("{{url}}", $appDownLoadUrl, $contents);
            $contents = str_replace("{{package}}", $package, $contents);
            $contents = str_replace("{{version}}", $versionCode, $contents);
            $contents = str_replace("{{title}}", $appKey, $contents);
        }

        return $contents ;
           
    }
}