<?php
namespace App\lib;

use App\Http\Controllers\Config;

class FilePath
{
   
    /**
     * 取得Apk/ipa檔案下載路徑
     * @param  int    $appRowId    qp_app_row_id
     * @param  String $deviceType  裝置類型 (ios|android) 
     * @param  int    $versionCode 版號
     * @param  String $fileName    檔案名稱
     * @return String              下載路徑
     */
    public static function getApkDownloadUrl($appRowId, $deviceType, $versionCode, $fileName){
       $deviceType = strtolower($deviceType);
       $url="";
        if($deviceType == 'ios'){
             $url = self::getApkUrl($appRowId,$deviceType,$versionCode,'manifest.plist');
             $url = 'itms-services://?action=download-manifest&url='. $url;
        }else{
             $url = self::getApkUrl($appRowId,$deviceType,$versionCode,$fileName);
        }

        return $url;
    }

    /**
     * 取得icon圖片網址
     * @param  int    $appRowId qp_app_row_id
     * @param  String $fileName 圖檔名稱
     * @return String           圖片路徑
     */
    public static function getIconUrl($appRowId, $fileName){
         return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'icon'.'/'.$fileName;
    } 

    /**
     * 取得banner圖片網址
     * @param  int    $appRowId   qp_app_row_id
     * @param  int    $langRowId  language_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @param  String $fileName   檔案名稱
     * @return String             圖片路徑
     */
    public static function getBannerUrl($appRowId, $langRowId, $deviceType, $fileName){
        $deviceType = strtolower($deviceType);
         return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'banner'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    /**
     * 取得ScreenShot圖片網址
     * @param  int    $appRowId   qp_app_row_id
     * @param  int    $langRowId  language_id
     * @param  String $deviceType 裝置類型 (ios|android)
     * @param  String $fileName   檔案名稱
     * @return String             圖片路徑
     */
    public static function getScreenShotUrl($appRowId, $langRowId,$deviceType, $fileName){
        $deviceType = strtolower($deviceType);
         return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'screenshot'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    }

    /**
     * 取得App版本資料路徑
     * @param  int    $appRowId    qp_app_row_id
     * @param  String $deviceType  裝置類型 (ios|android) 
     * @param  int    $versionCode 版號
     * @param  String $fileName    檔案名稱
     * @return String              下載路徑
     */
    private static function getApkUrl($appRowId, $deviceType, $versionCode, $fileName){
       $deviceType = strtolower($deviceType);
       return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    } 

}