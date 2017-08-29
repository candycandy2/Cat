<?php
namespace App\lib;
use Illuminate\Support\Facades\Log;

class CommonUtil{
    
    /**
     * 計算兩日期相差天數
     * @param  date $startTime 開始時間
     * @param  date $endTime   結束時間
     * @return int
     */
    static function dateDiff($startTime, $endTime) {
        $start = strtotime($startTime);
        $end = strtotime($endTime);
        $timeDiff = $end - $start;
        return floor($timeDiff / (60 * 60 * 24));
    }

        /**
     * 呼叫API
     * @param  String      $method 呼叫方式(POST|GET)
     * @param  String      $url    API網址
     * @param  Array|array $header request header
     * @param  boolean     $data   傳遞的參數
     * @return mixed               API result
     */
    public static function callAPI($method, $url, Array $header = array(), $data = false)
    {
        $curl = curl_init();
        $url =  preg_replace('/\s+/', '%20', $url);
        $api_max_exe_time = 5000;
        $result = null;

        switch ($method)
        {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);

                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_PUT, 1);
                break;
            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }
    
        // Optional Authentication:
        //設定header
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT_MS, $api_max_exe_time);
        //add for Develop
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
        curl_setopt($curl, CURLOPT_PROXY,'proxyt2.benq.corp.com:3128');
        curl_setopt($curl, CURLOPT_PROXYUSERPWD,'Cleo.W.Chan:1234qwe:1');

        if( ! $result = curl_exec($curl)) 
        { 
            $errno = curl_errno($curl);
            $result = json_encode(['error'=>$errno,'message'=>curl_strerror($errno)]);
            return  $result;
        }
        return $result;
    }
    /**
     * 取得副檔名對應的mine type
     * @return array
     */
    public static function getMineTypeMap(){
         return array(
            'txt' => 'text/plain',
            'htm' => 'text/html',
            'html' => 'text/html',
            'php' => 'text/html',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'xml' => 'application/xml',
            'swf' => 'application/x-shockwave-flash',
            'flv' => 'video/x-flv',

            // images
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'jpe' => 'image/jpeg',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'ico' => 'image/vnd.microsoft.icon',
            'tiff' => 'image/tiff',
            'tif' => 'image/tiff',
            'svg' => 'image/svg+xml',
            'svgz' => 'image/svg+xml',

            // archives
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'exe' => 'application/x-msdownload',
            'msi' => 'application/x-msdownload',
            'cab' => 'application/vnd.ms-cab-compressed',

            // audio/video
            'mp3' => 'audio/mpeg',
            'qt' => 'video/quicktime',
            'mov' => 'video/quicktime',

            // adobe
            'pdf' => 'application/pdf',
            'psd' => 'image/vnd.adobe.photoshop',
            'ai' => 'application/postscript',
            'eps' => 'application/postscript',
            'ps' => 'application/postscript',

            // ms office
            'doc' => 'application/msword',
            'rtf' => 'application/rtf',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',

            // open office
            'odt' => 'application/vnd.oasis.opendocument.text',
            'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
        );
    }

      /**
   * desription 判斷是否gif動畫
   * @param sting $image_file圖片路徑
   * @return boolean t 是 f 否
   */
  public static function checkGifCartoon($image_file){
    $fp = fopen($image_file,'rb');
    $image_head = fread($fp,1024);
    fclose($fp);
    return preg_match("/".chr(0x21).chr(0xff).chr(0x0b).'NETSCAPE2.0'."/",$image_head)?false:true;
  }

  /**
  * desription 壓縮圖片
  * @param sting $imgsrc 圖片路徑
  * @param string $imgdst 壓縮後保存路徑
  */
  public static function compressImage($imgsrc, $imgdst, $quality){
    list($width,$height,$type)=getimagesize($imgsrc);
    $new_width = $width;
    $new_height = $height;
    switch($type){
      case 1:
        $giftype=self::checkGifCartoon($imgsrc);
        if($giftype){
          header('Content-Type:image/gif');
          $image_wp=imagecreatetruecolor($new_width, $new_height);
          $image = imagecreatefromgif($imgsrc);
          imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
          imagejpeg($image_wp, $imgdst, $quality);
          imagedestroy($image_wp);
        }
        break;
      case 2:
        header('Content-Type:image/jpeg');
        $image_wp=imagecreatetruecolor($new_width, $new_height);
        $image = imagecreatefromjpeg($imgsrc);
        imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
        imagejpeg($image_wp, $imgdst, $quality);
        imagedestroy($image_wp);
        break;
      case 3:
        header('Content-Type:image/png');
        $image_wp=imagecreatetruecolor($new_width, $new_height);
        $image = imagecreatefrompng($imgsrc);
        imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
        imagejpeg($image_wp, $imgdst, $quality);
        imagedestroy($image_wp);
        break;
    }
  }


}