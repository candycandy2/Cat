<?php
/**
 * 處理App Version 相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\AppVersionRepository;
use App\lib\ResultCode;
use App\lib\FilePath;
use App\lib\QPlayApi;
use File;
use Config;

class AppVersionService
{   

    protected $appVersionRepository;

    public function __construct(AppVersionRepository $appVersionRepository)
    {
        $this->appVersionRepository = $appVersionRepository;
    }

    public function getAppOnlineVersion($appId, $deviceType){
         $whereCondi = array(
                        array(
                        "field"=>"status",
                        "op"=>"=",
                        "value"=>"ready"
                        )
                    );
         $selectData = array('row_id','device_type', 'version_code', 'version_name', 'url', 'external_app', 'version_log', 'size', 'status','ready_date', 'created_at');
         $appVersionList = $this->appVersionRepository->getAppVersion($appId, $deviceType, $whereCondi, $selectData);
         $appVersionList = $this->arrangeVersionList($appId, $deviceType, $appVersionList);
       return  $appVersionList;
    }

    /**
     * 取得最新一筆上傳後未發布的版本，並刪除其他從未上架過的版本
     * @param  int    $appId      qp_app_head.row_id
     * @param  String $deviceType 裝置類型(ios|android)
     * @return Array
     */
    public function getAppNewVersion($appId, $deviceType){
        $appVersionList = $this->appVersionRepository->getNewAppVersion($appId, $deviceType);
        $delVersionArr = [];

        foreach ($appVersionList as $key => $version) {
           if($key!=0){
                //第二筆以後刪除
                $delVersionArr[] = $version->row_id;
                unset($appVersionList[$key]);
           }
        }
        $this->deleteAppVersion($appId, $delVersionArr);
        $appVersionList = $this->arrangeVersionList($appId, $deviceType, $appVersionList);
       return  $appVersionList;
    }

    /**
     * 取得歷史版本列表
     * @param   int    $appId      qp_app_head.row_id
     * @param   String $deviceType 裝置類型(ios|android)
     * @param   int    $offset     從第幾筆開始
     * @param   int    $limit      每次最多查詢筆數
     * @param  String  $sort       排序的欄位
     * @param  String  $order      排序方式(asc|desc)
     * @param  String  $search     查詢字串
     * @return  Array
     */
    public function getAppHistoryVersion($appId, $deviceType, $offset, $limit, $sort, $order, $search){
         $whereCondi = array(
                        array(
                        "field"=>"status",
                        "op"=>"=",
                        "value"=>"cancel"
                        ),
                        array(
                        "field"=>"ready_date",
                        "op"=>"!=",
                        "value"=>null
                        ),
                    );
         $selectData = array('row_id','device_type', 'version_code', 'version_name', 'url', 'external_app', 'version_log', 'size', 'status','ready_date', 'archived', 'created_at');
         $appVersionList = $this->appVersionRepository->getAppVersion($appId, $deviceType, $whereCondi, $selectData, $offset, $limit, $sort, $order, $search);

         $appVersionList = $this->arrangeVersionList($appId, $deviceType, $appVersionList); 
       return  $appVersionList;

    }
    /**
     * 下架版本
     * @param  int    $appId      qp_app_head.row_id
     * @param  String $deviceType 裝置類型(ios|android)
     * @param  int    $userRowId  qp_user.row_id
     */
    public function unPublishVersion($appId, $deviceType, $userRowId){
        
        //delete file
        $this->deleteApkFileFromPublish($appId,$deviceType, true);
        
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
     * @param  String $appKey
     */
    public function uploadAndPublishVersion($appId, $versionData, $versionFile, $userRowId, $appKey){
    
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
        $this->uploadApkFile($appId, $versionData, $versionFile, $appKey);
        $versionData['file_name'] = $versionFile->getClientOriginalName();
        $this->copyAppFileToPublish($appId, $versionData);
        
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
     * @param  String $appKey      appKey
     */
    private function uploadApkFile($appId, $versionData, $versionFile, $appKey){
        
        $deviceType =  $versionData['device_type'];
        $versionCode = $versionData['version_code'];
        $appKey = $appKey;

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
            //upload app to ota folder 
            $data = array('app_id'=>$appId,
                         'app_key'=>$appKey,
                         'device_type'=>$deviceType,
                         'version_code'=>$versionCode,
                         'version_file'=> new \CURLFile(realpath($destinationPath.$fileName))
                         );
            $res = QPlayApi::post('uploadAppFile',  $data, array('Content-Type: multipart/form-data'));
            $res = json_decode($res,true);
            if($res['result_code']!= ResultCode::_1_reponseSuccessful){
                throw new \Exception("OTA API uploadAppFile Error");
            }
        }

       
    }


    /**
     * 將檔案複製到目的
     * @param  string  $appId              ap_app.row_id
     * @param  string  $versionData        版本資訊                
     */
    public function copyAppFileToPublish($appId, $versionData){
        
        $destinationPath = FilePath::getApkUploadPath($appId,$versionData['device_type'],$versionData['version_code']);
        $publishFilePath = FilePath::getApkPublishFilePath($appId,$versionData['device_type']);
        $fileName = $versionData['file_name'];
        \File::copy($destinationPath.$fileName,$publishFilePath.$fileName);
        if($versionData['device_type'] == 'ios'){
            \File::copy($destinationPath.'manifest.plist',$publishFilePath.'manifest.plist');
        }
        $data = array('app_id'=>$appId, 'version_data'=>$versionData);;
        $res = QPlayApi::post('copyAppFileToPublish', json_encode($data));
        $res = json_decode($res,true);
        if($res['result_code']!= ResultCode::_1_reponseSuccessful){
            throw new \Exception("OTA API copyAppFileToPublish Error");
        }
    }

    /**
     * 從發佈路徑中移除版本檔案
     * @param  int      $appId      app_row_id
     * @param  string   $deviceType device type android|ios
     * @param  boolean  $deleteHistory 是否刪除歷史版本，如果未來須改為上架則不需刪除
     * @return string   $targetFilePath the path that had been delete
     */
    public function deleteApkFileFromPublish($appId, $deviceType,  $deleteHistory){
        $data=[];

        $publishFilePath = FilePath::getApkPublishFilePath($appId,$deviceType);
        $OriPublish = $this->appVersionRepository->getPublishedApp($appId,$deviceType);

        //發佈的版本不為外部連結
        if(!is_null($OriPublish) && $OriPublish->external_app == 0){
            
            if($OriPublish->url!=""){
                //刪除發佈路徑檔案
                if(file_exists($publishFilePath.$OriPublish->url)){
                    $result = unlink($publishFilePath.$OriPublish->url);
                }

                //ios 需多刪除 manifest.plist
                if($deviceType == 'ios'){
                    if(file_exists($publishFilePath.'manifest.plist')){
                        unlink($publishFilePath.'manifest.plist');
                    }
                }

                //remove ota
                $data=array('app_id'=>$appId,'device_type'=>$deviceType, 'file_name'=>$OriPublish->url);
                $res = QPlayApi::post('deleteAppFileFromPublish',  json_encode($data));
                $res = json_decode($res,true);
                if($res['result_code']!= ResultCode::_1_reponseSuccessful){
                    throw new \Exception("OTA API deleteAppFileFromPublish Error");
                }

                //不保留歷史檔案，刪除上上筆原始檔案
                if( \Config::get('app.keep_history') == false &&  $deleteHistory == true){
                    $archiveVersion = $this->getArchiveVersion($appId);
                    if($archiveVersion != null){
                        $destinationPath = FilePath::getApkUploadPath($appId,
                                                                      $deviceType,
                                                                      $archiveVersion['version_code']);

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

                        //remove ota
                        $tmpHistoryData =  array('app_id'=>$appId,
                                            'device_type'=>$deviceType,
                                            'version_code'=>$archiveVersion['version_code']);
                        $historyData[] = $tmpHistoryData;
                        $res = QPlayApi::post('deleteAppFile', json_encode($historyData));
                        $res = json_decode($res,true);
                        if($res['result_code']!= ResultCode::_1_reponseSuccessful){
                             throw new \Exception("OTA API deleteAppFile Error");
                        }
                        
                        $this->appVersionRepository->setVersionArchived($archiveVersion['row_id']);
                    }
                }
            }
        }
    }

    /**
     * 刪除App 版本資訊以及檔案
     * @param  int    $appIdappId  qp_app_head.row_id         
     * @param  Array  $delVersionArr 預刪除的version row_id 陣列
     * @return
     */
    public function deleteAppVersion(Int $appId, Array $delVersionArr){
        $data=[];   
        $appStatus = $this->getAllPublishedAppStatus($appId);
        foreach ($delVersionArr as  $vId) {
            $versionItem = $this->appVersionRepository->getAppVersionById($vId);
            if(!is_null($versionItem)){
                //將線上版本改為下架
                if(($versionItem['version_code'] == $appStatus[$versionItem['device_type']]['versionCode'])){
                    $this->unPublishVersion($appId, $versionItem['device_type'], \Auth::user()->row_id);
                }

                //remove data
                $tmpData = array('app_id'=>$appId,
                                'device_type'=>$versionItem['device_type'],
                                'version_code'=>$versionItem['version_code']);
                $data[]=$tmpData;

                //remove local
                $destinationPath = FilePath::getApkUploadPath($appId,$versionItem['device_type'],$versionItem['version_code']);
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
        }
        //remove ota
        if(count($data) > 0){
            $res = QPlayApi::post('deleteAppFile', json_encode($data));
            
            $res = json_decode($res,true);
            if($res['result_code']!= ResultCode::_1_reponseSuccessful){
                throw new \Exception("OTA API deleteAppFile Error");
            }
        }
        $this->appVersionRepository->deleteAppVersionById($delVersionArr);
    }

    /**
     * 更新app version 資料
     * @param  Array $updateArray 慾更新的資料 ["欄位名稱"=>"欄位值"]
     *
     */
    public function updateVersion(Array $updateArray){

        $this->appVersionRepository->updateAppVersionById($updateArray);

    }

    /**
     * 新增app version,支援批量賦值
     * @param  Array $insertArray  慾寫入的資料 [["欄位名稱"=>"欄位值"]]
     */
    public function insertVersion(Array $insertArray){
        $this->appVersionRepository->newAppVersion($insertArray);
    }

    /**
     * 取得單一App在所有裝置的發布狀態
     * @return Array
     */
    public function getAllPublishedAppStatus($appId){
        $appStatus = array('android'=>array(
                                    'str'=>'Unpublish',
                                    'versionCode'=>'',
                                    'url'=>''
                                ),
                         'ios'=>array(
                                    'str'=>'Unpublish',
                                    'versionCode'=>'',
                                    'url'=>''
                                )
                        );
    
      foreach ( $appStatus as $deviceType => $value) {
        $deviceStatus = $this->appVersionRepository->getPublishedApp($appId, $deviceType);
        if(count($deviceStatus) > 0){
            $appStatus[$deviceType]['str'] = $deviceStatus->version_name;
            $appStatus[$deviceType]['versionCode'] = $deviceStatus->version_code;
            $appStatus[$deviceType]['url'] = $deviceStatus->url;
        }
      }
        return $appStatus;
    }


    /**
     * 產生ios下載時必要的 ManiFest 檔案
     * @param  int    $appIdappId  qp_app_head.row_id
     * @param  string $appKey      qp_project.app_key
     * @param  string $deviceType  裝置類型 (ios|android)
     * @param  string $versionCode 版本號
     * @param  string $fileName    ipa 檔案名稱 
     * @return string              manifest 檔案內容
     * @author Cleo.W.Chan
     */
    private function getManifest($appId, $appKey, $deviceType, $versionCode, $fileName){
    
        $MANIFEST_TEMPLETE_PATH = base_path('resources'. DIRECTORY_SEPARATOR .'templete'. DIRECTORY_SEPARATOR .'manifest.plist');
        $contents = null;

        if (File::exists($MANIFEST_TEMPLETE_PATH))
        {
            $contents = File::get($MANIFEST_TEMPLETE_PATH);
            $appDownLoadUrl = FilePath:: getApkUrl($appId,$deviceType,$versionCode,$fileName);
            $package = \Config::get('app.app_package') .'.'.$appKey;

            $contents = str_replace("{{url}}", $appDownLoadUrl, $contents);
            $contents = str_replace("{{package}}", $package, $contents);
            $contents = str_replace("{{version}}", $versionCode, $contents);
            $contents = str_replace("{{title}}", $appKey, $contents);
        }

        return $contents ;
           
    }

    /**
     * 將版本列表整理為可輸出在前台的格式
     * @param   int    $appId    qp_app_head.row_id
     * @param   string $deviceType  裝置類型 (ios|android)
     * @param   Array  $appVersionList version列表資料
     * @return  Array
     */
    private function arrangeVersionList($appId, $deviceType, $appVersionList){
        foreach ($appVersionList as $appVersion) {
            if($appVersion->external_app == 1){
                $appVersion->download_url = $appVersion->url;
            }else{
                $appVersion->download_url = FilePath::getApkDownloadUrl($appId,$deviceType,
                $appVersion->version_code,$appVersion->url);
            }
           
        }
        return $appVersionList;
    }

    /**
     * 儲存App版本控制的異動
     * @param  String $appKey      app key
     * @param  Int    $appId       欲儲存的app_row_id
     * @param  Array  $versionList 異動的版本列表
     * @return 
     */
    public function saveAppVersionList($appKey ,Int $appId, Array $versionList){

        
        $appStatus = $this->getAllPublishedAppStatus($appId);
        $insertArray = [];
        $updateArray = [];
        $saveId = [];
        $uploadFiledata = [];
        $now = date('Y-m-d H:i:s',time());

        foreach ($versionList as $deviceType => $versionItems) {
           
            $deletePublishFile = true;

            foreach ($versionItems as $value) 
            {
                $data = array(
                    'app_row_id'=>$appId,
                    'version_code'=>$value['version_code'],
                    'version_name'=>$value['version_name'],
                    'url'=>$value['url'],
                    'external_app'=>$value['external_app'],
                    'version_log'=>($value['version_log'] == 'null')?NULL:$value['version_log'],
                    'status'=>$value['status'],
                    'device_type'=>$deviceType,
                );
                if($value['status'] == 'ready'){
                    $data ['ready_date'] = time();
                }else{
                    $data ['ready_date'] = NULL;
                }
                if(isset($value['row_id'])){//update
                     $data['row_id'] = $value['row_id'];
                     $data['updated_user'] = \Auth::user()->row_id;
                     $data['updated_at'] = $now;
                     $updateArray[] = $data;
                     $saveId[] = $value['row_id'];
                }else{//new
                    if($value['external_app']==0){//file upload  
                        $this->uploadApkFile($appId, $data, $value['version_file'], $appKey);
                    }
                    //arrange data
                    $data['size'] =(!isset($value['size']) || $value['size'] == 'null')?0:$value['size'];
                    $data['created_user'] = \Auth::user()->row_id;
                    $data['created_at'] = $value['created_at'];
                    $insertArray[]=$data;
                }
              
                if($value['status'] == 'ready' && $value['external_app'] == 0){
                    $deletePublishFile = false;
                    $versionData['device_type'] = $deviceType;
                    $versionData['version_code'] = $value['version_code'];
                    $versionData['file_name'] = $value['url'];
                    $deleteHistory = false;
                    if(!isset($value['ready_date'])){//上傳新版本封存歷史版本
                        $deleteHistory = true;
                    }
                    $this->deleteApkFileFromPublish($appId, $deviceType,  $deleteHistory);
                    $this->copyAppFileToPublish($appId, $versionData);
                }
            }
            if($deletePublishFile){
                $this->deleteApkFileFromPublish($appId, $deviceType, true);
            }
        }
      
        $this->updateVersion($updateArray);
        $this->insertVersion($insertArray);
    }

    /**
     * 取得該存區的版本
     * @param  int $appId qp_app.row_id
     * @return mixed
     */
    private function getArchiveVersion($appId)
    {
        $result  = $this->appVersionRepository->getHistoryVersion($appId)->toArray();
        if(isset($result[0])){
            return $result[0];
        }else{
            return null;
        }

    }
}