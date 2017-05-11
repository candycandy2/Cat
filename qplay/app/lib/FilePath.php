<?php
namespace App\lib;

use App\Http\Controllers\Config;

class FilePath
{
   
    public static function getApkUploadPath($appRowId,$deviceType,$versionCode){
        $deviceType = strtolower($deviceType);
         return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'apk'. DIRECTORY_SEPARATOR .$deviceType. DIRECTORY_SEPARATOR . $versionCode . DIRECTORY_SEPARATOR ;
    }

    public static function getApkUrl($appRowId,$deviceType,$versionCode,$fileName){
        $deviceType = strtolower($deviceType);
       return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

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

    public static function getApkPublishFilePath($appRowId,$deviceType){
        $deviceType = strtolower($deviceType);
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'apk'. DIRECTORY_SEPARATOR .$deviceType. DIRECTORY_SEPARATOR;
    }

    public static function getApkPublishUrl($appRowId,$deviceType,$fileName){
        $deviceType = strtolower($deviceType);
        return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

    public static function getIconUploadPath($appRowId){
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'icon'. DIRECTORY_SEPARATOR ;
    }

    public static function getIconUrl($appRowId,$fileName){
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'icon'.'/'.$fileName;
    } 

    public static function getBannerUploadPath($appRowId,$langRowId,$deviceType){
        $deviceType = strtolower($deviceType);
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'banner'. DIRECTORY_SEPARATOR .$langRowId. DIRECTORY_SEPARATOR . $deviceType . DIRECTORY_SEPARATOR ;
    }

    public static function getBannerUrl($appRowId,$langRowId,$deviceType,$fileName){
        $deviceType = strtolower($deviceType);
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'banner'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    public static function getScreenShotUploadPath($appRowId,$langRowId,$deviceType){
        $deviceType = strtolower($deviceType);
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'screenshot'. DIRECTORY_SEPARATOR .$langRowId. DIRECTORY_SEPARATOR . $deviceType . DIRECTORY_SEPARATOR ;
    }

    public static function getScreenShotUrl($appRowId,$langRowId,$deviceType,$fileName){
        $deviceType = strtolower($deviceType);
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'screenshot'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    } 

    public static function getErrorCodeUploadPath($appRowId){
        return base_path(\Config::get('app.upload_path')). DIRECTORY_SEPARATOR .$appRowId. DIRECTORY_SEPARATOR .'error_code'. DIRECTORY_SEPARATOR ;
    }

    public static function getErrorCodeUrl($appRowId,$fileName){
         return url(\Config::get('app.upload_folder')).'/'.$appRowId.'/'.'error_code'.'/'.$fileName;
    }

    public static function getDocPath($docCat,$fileName){
        return base_path('public'. DIRECTORY_SEPARATOR .'doc'). DIRECTORY_SEPARATOR .$docCat. DIRECTORY_SEPARATOR.$fileName;    
    }

    /**
     * 取得Jenkins部屬資訊(deploy.jenkins)的檔案存放路徑
     * @return [type] [description]
     */
    public static function getDeployJenkinsPath(){
        return base_path(). DIRECTORY_SEPARATOR .'deploy.jenkins';
    } 

}