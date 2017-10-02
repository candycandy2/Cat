<?php
namespace App\lib;

use App\Http\Controllers\Config;

class FilePath
{

    /**
     * 取得Apk/ipa檔案下載路徑
     * @param  String $action           來源的method name
     * @param  int    $appRowId         app_row_id
     * @param  String $deviceType       裝置類型 (ios|android) 
     * @param  int    $versionCode      版號
     * @param  String $fileName         檔案名稱
     * @return String                   下載路徑
     */
    public static function getApkDownloadUrl($appRowId, $deviceType, $versionCode, $fileName, $intra = false){
       $deviceType = strtolower($deviceType);
       $url="";
        if($deviceType == 'ios'){
             $url = self::getApkUrl($appRowId, $deviceType, $versionCode, 'manifest.plist', $intra);
             $url = 'itms-services://?action=download-manifest&url='. $url;
        }else{
             $url = self::getApkUrl($appRowId, $deviceType, $versionCode, $fileName, $intra);
        }

        return $url;
    }

    /**
     * 取得icon圖片網址
     * @param  int    $appRowId app_row_id
     * @param  String $fileName 圖檔名稱
     * @return String           圖片路徑
     */
    public static function getIconUrl($appRowId, $fileName){
         return self::getDefaultPath().'/'.$appRowId.'/'.'icon'.'/'.$fileName;
    } 

    /**
     * 取得banner圖片網址
     * @param  int    $appRowId   app_row_id
     * @param  int    $langRowId  language_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @param  String $fileName   檔案名稱
     * @return String             圖片路徑
     */
    public static function getBannerUrl($appRowId, $langRowId, $deviceType, $fileName){
        $deviceType = strtolower($deviceType);
         return self::getDefaultPath().'/'.$appRowId.'/'.'banner'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    /**
     * 取得ScreenShot圖片網址
     * @param  int    $appRowId   app_row_id
     * @param  int    $langRowId  language_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @param  String $fileName   檔案名稱
     * @return String             圖片路徑
     */
    public static function getScreenShotUrl($appRowId, $langRowId,$deviceType, $fileName){
        $deviceType = strtolower($deviceType);
         return self::getDefaultPath().'/'.$appRowId.'/'.'screenshot'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    }

    /**
     * 取得App原始下載路徑
     * @param  int    $appRowId    app_row_id
     * @param  String $deviceType  裝置類型 (ios|android) 
     * @param  int    $versionCode 版號
     * @param  String $fileName    檔案名稱
     * @return String              下載路徑
     */
    public static function getApkUrl($appRowId, $deviceType, $versionCode, $fileName, $intra){
       $deviceType = strtolower($deviceType);
       $appFileUrl = self::getDefaultPath();
       if($intra){
              $appFileUrl =  url(\Config::get('app.upload_folder'));
       }
       return $appFileUrl.'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

    
    /**
     * 取得App資料預設路徑
     * @return String
     */
    private static function getDefaultPath() {
       return  \Config::get('app.app_file_server').\Config::get('app.app_file_path');
    }

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
     * 取得App上架位置
     * @param  int $appRowId        app_row_id
     * @param  String $deviceType   裝置類型 (ios|android)
     * @return String               App發布位置
     */
    public static function getApkPublishFilePath($appRowId,$deviceType){
        $deviceType = strtolower($deviceType);
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'apk'. DIRECTORY_SEPARATOR .$deviceType. DIRECTORY_SEPARATOR;
    }

}