<?php
namespace App\lib;

use App\Http\Controllers\Config;

class FilePath
{

    /**
     * 取得Apk/ipa檔案下載路徑
     * @param  int    $appRowId         qp_app_row_id
     * @param  String $deviceType       裝置類型 (ios|android) 
     * @param  int    $versionCode      版號
     * @param  String $fileName         檔案名稱
     * @param  String $useResquestUrl   是否使用呼叫路徑
     * @return String                   下載路徑
     */
    public static function getApkDownloadUrl($appRowId, $deviceType, $versionCode, $fileName, $useResquestUrl=false){
       $deviceType = strtolower($deviceType);
       $url="";
        if($deviceType == 'ios'){
             $url = self::getApkUrl($appRowId, $deviceType, $versionCode, 'manifest.plist', $useResquestUrl);
             $url = 'itms-services://?action=download-manifest&url='. $url;
        }else{
             $url = self::getApkUrl($appRowId, $deviceType, $versionCode, $fileName, $useResquestUrl);
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
         return self::getDefaultPath().'/'.$appRowId.'/'.'icon'.'/'.$fileName;
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
         return self::getDefaultPath().'/'.$appRowId.'/'.'banner'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
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
         return self::getDefaultPath().'/'.$appRowId.'/'.'screenshot'.'/'.$langRowId.'/'.$deviceType.'/'.$fileName;
    }

    /**
     * 取得App版本資料路徑
     * @param  int    $appRowId    qp_app_row_id
     * @param  String $deviceType  裝置類型 (ios|android) 
     * @param  int    $versionCode 版號
     * @param  String $fileName    檔案名稱
     * @return String              下載路徑
     */
    public static function getApkUrl($appRowId, $deviceType, $versionCode, $fileName, $useResquestUrl=false){
       $deviceType = strtolower($deviceType);
       $appFileUrl = self::getDefaultPath();
       if($useResquestUrl){
            $appFileUrl =  'https://'.$_SERVER['HTTP_HOST'].\Config::get('app.app_file_path');
       }
       return $appFileUrl.'/'.$appRowId.'/'.'apk'.'/'.$deviceType.'/'. $versionCode .'/'.$fileName;
    }

    
    /**
     * 取得App資料預設路徑
     * @return [type] [description]
     */
    private static function getDefaultPath() {
       return  \Config::get('app.app_file_server').\Config::get('app.app_file_path');
    }

}