<?php
namespace App\lib;

use App\Http\Controllers\Config;

class FilePath
{
   /**
    * 取得Apk/ipa檔案上傳位置
    * @param  int    $appRowId         app_row_id
    * @param  String $deviceType       裝置類型 (ios|android) 
    * @param  int    $versionCode      版號
    * @return String
    */
    public static function getApkUploadPath($appRowId,$deviceType,$versionCode){
        $deviceType = strtolower($deviceType);
         return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'apk'. DIRECTORY_SEPARATOR .$deviceType. DIRECTORY_SEPARATOR . $versionCode . DIRECTORY_SEPARATOR ;
    }

    /**
     * 取得App原始下載路徑
     * @param  int    $appRowId    app_row_id
     * @param  String $deviceType  裝置類型 (ios|android) 
     * @param  int    $versionCode 版號
     * @param  String $fileName    檔案名稱
     * @return String              下載路徑
     */
    public static function getApkUrl($appRowId,$deviceType,$versionCode,$fileName){
        $deviceType = strtolower($deviceType);
       return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

    /**
     * 取得Apk/ipa檔案下載路徑
     * @param  int    $appRowId         app_row_id
     * @param  String $deviceType       裝置類型 (ios|android) 
     * @param  int    $versionCode      版號
     * @param  String $fileName         檔案名稱
     * @return String                   下載路徑
     */
    public static function getApkDownloadUrl($appRowId,$deviceType,$versionCode,$fileName){
        $deviceType = strtolower($deviceType);
        $url = "";
        if($deviceType == 'ios'){
             $url = self::getApkUrl($appRowId,$deviceType,$versionCode,'manifest.plist');
             $url = 'itms-services://?action=download-manifest&url='. $url;
        }else{
            $url = self::getApkUrl($appRowId,$deviceType,$versionCode,$fileName);
        }

        return $url;
    }

    /**
     * 取得App上架位置
     * @param  int $appRowId        app_row_id
     * @param  String $deviceType   裝置類型 (ios|android)
     * @return String               App發布位置
     */
    public static function getApkPublishFilePath($appRowId,$deviceType){
        $deviceType = strtolower($deviceType);
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'apk'. DIRECTORY_SEPARATOR .$deviceType. DIRECTORY_SEPARATOR;
    }

    /**
     * 取得已上架App的下載路徑
     * @param  int $appRowId      app_row_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @param  String $fileName   檔案名稱
     * @return String             已發佈的app下載路徑
     */
    public static function getApkPublishUrl($appRowId,$deviceType,$fileName){
        $deviceType = strtolower($deviceType);
        return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

    /**
     * 取得icon的檔案上傳位置
     * @param  int $appRowId   app_row_id
     * @return String          
     */
    public static function getIconUploadPath($appRowId){
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'icon'. DIRECTORY_SEPARATOR ;
    }

    /**
     * 取得icon的檔案下載路徑
     * @param  int      $appRowId   app_row_id
     * @param  String   $fileName   檔案名稱
     * @return String
     */
    public static function getIconUrl($appRowId,$fileName){
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'icon'.'/'.$fileName;
    } 

    /**
     * 取得Banner的上傳位置
     * @param  int    $appRowId   app_row_id
     * @param  int    $langRowId  qp_language.row_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @return String
     */
    public static function getBannerUploadPath($appRowId,$langRowId,$deviceType){
        $deviceType = strtolower($deviceType);
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'banner'. DIRECTORY_SEPARATOR .$langRowId. DIRECTORY_SEPARATOR . $deviceType . DIRECTORY_SEPARATOR ;
    }

    /**
     * 取得Banner的檔案下載路徑
     * @param  int    $appRowId   app_row_id
     * @param  int    $langRowId  qp_language.row_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @param  String $fileName   檔案名稱
     * @return String
     */
    public static function getBannerUrl($appRowId,$langRowId,$deviceType,$fileName){
        $deviceType = strtolower($deviceType);
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'banner'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    /**
     * 取得螢幕截圖檔案上傳路徑
     * @param  int    $appRowId   app_row_id
     * @param  int    $langRowId  qp_language.row_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @return String
     */
    public static function getScreenShotUploadPath($appRowId,$langRowId,$deviceType){
        $deviceType = strtolower($deviceType);
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'screenshot'. DIRECTORY_SEPARATOR .$langRowId. DIRECTORY_SEPARATOR . $deviceType . DIRECTORY_SEPARATOR ;
    }

    /**
     * 取得螢幕截圖檔案下載路徑
     * @param  int    $appRowId   app_row_id
     * @param  int    $langRowId  qp_language.row_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @param  String $fileName   檔案名稱
     * @return String
     */
    public static function getScreenShotUrl($appRowId,$langRowId,$deviceType,$fileName){
        $deviceType = strtolower($deviceType);
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'screenshot'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    /**
     * 取得錯誤代碼檔案上傳路徑
     * @param  int    $appRowId app_row_id
     * @return String
     */
    public static function getErrorCodeUploadPath($appRowId){
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'error_code'. DIRECTORY_SEPARATOR ;
    }

    /**
     * 取得錯誤代碼下載路徑
     * @param  int    $appRowId app_row_id
     * @param  String $fileName 檔案名稱
     * @return String
     */
    public static function getErrorCodeUrl($appRowId,$fileName){
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'error_code'.'/'.$fileName;
    }

    /**
     * 取得文件存放位置
     * @param  String $docCat   文件分類
     * @param  String $fileName 檔案名稱
     * @return String
     */
    public static function getDocPath($docCat,$fileName){
        return base_path('public'. DIRECTORY_SEPARATOR .'doc'). DIRECTORY_SEPARATOR .$docCat. DIRECTORY_SEPARATOR.$fileName;    
    }

    /**
     * 取得Jenkins部屬資訊(deploy.jenkins)的檔案存放路徑
     * @return String
     */
    public static function getDeployJenkinsPath(){
        return base_path(). DIRECTORY_SEPARATOR .'deploy.jenkins';
    } 

}