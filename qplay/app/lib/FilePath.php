<?php
namespace App\lib;

use App\Http\Controllers\Config;

class FilePath
{
   
    public static function getApkUploadPath($appRowId,$deviceType,$versionCode){
         return base_path(\Config::get('app.upload_path')).'\\'.$appRowId.'\\'.'apk'.'\\'.$deviceType.'\\'. $versionCode .'\\';
    }

    public static function getApkUrl($appRowId,$deviceType,$versionCode,$fileName){
       return url(\Config::get('app.upload_url')).'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

    public static function getApkDownloadUrl($appRowId,$deviceType,$versionCode,$fileName){

        $url = self::getApkUrl($appRowId,$deviceType,$versionCode,$fileName);
        if($deviceType == 'ios'){
             $url = 'itms-services://?action=download-manifest&url='. $url;
        }

        return $url;
    }

    public static function getIconUploadPath($appRowId){
        return base_path(\Config::get('app.upload_path')).'\\'.$appRowId.'\\'.'icon'.'\\';
    }

    public static function getIconUrl($appRowId,$fileName){
         return url(\Config::get('app.upload_url')).'/'.$appRowId.'/'.'icon'.'/'.$fileName;
    } 

    public static function getBannerUploadPath($appRowId,$langRowId,$deviceType){
        return base_path(\Config::get('app.upload_path')).'\\'.$appRowId.'\\'.'banner'.'\\'.$langRowId.'\\'. $deviceType .'\\';
    }

    public static function getBannerUrl($appRowId,$langRowId,$deviceType,$fileName){
         return url(\Config::get('app.upload_url')).'/'.$appRowId.'/'.'banner'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    public static function getScreenShotUploadPath($appRowId,$langRowId,$deviceType){
        return base_path(\Config::get('app.upload_path')).'\\'.$appRowId.'\\'.'screenshot'.'\\'.$langRowId.'\\'. $deviceType .'\\';
    }

    public static function getScreenShotUrl($appRowId,$langRowId,$deviceType,$fileName){
         return url(\Config::get('app.upload_url')).'/'.$appRowId.'/'.'screenshot'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    public static function getErrorCodeUploadPath($appRowId){
        return base_path(\Config::get('app.upload_path')).'\\'.$appRowId.'\\'.'error_code'.'\\';
    }

    public static function getErrorCodeUrl($appRowId,$fileName){
         return url(\Config::get('app.upload_url')).'/'.$appRowId.'/'.'error_code'.'/'.$fileName;
    }

}