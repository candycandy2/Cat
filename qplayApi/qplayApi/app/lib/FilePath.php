<?php
namespace App\lib;

use App\Http\Controllers\Config;

class FilePath
{
   
    public static function getApkUrl($appRowId,$deviceType,$versionCode,$fileName){
       return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

    public static function getApkDownloadUrl($appRowId,$deviceType,$versionCode,$fileName){

        $url = self::getApkUrl($appRowId,$deviceType,$versionCode,$fileName);
        if($deviceType == 'ios'){
             $url = 'itms-services://?action=download-manifest&url='. $url;
        }

        return $url;
    }

    public static function getIconUrl($appRowId,$fileName){
         return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'icon'.'/'.$fileName;
    } 

    public static function getBannerUrl($appRowId,$langRowId,$deviceType,$fileName){
         return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'banner'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    public static function getScreenShotUrl($appRowId,$langRowId,$deviceType,$fileName){
         return \Config::get('app.app_file_url').\Config::get('app.upload_folder').'/'.$appRowId.'/'.'screenshot'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

}