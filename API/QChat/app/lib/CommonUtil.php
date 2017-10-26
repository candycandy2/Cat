<?php
namespace App\lib;
use Config;
use Mail;
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
        curl_setopt($curl, CURLOPT_PROXYUSERPWD,'Cleo.W.Chan:1234qwe:2');

        if( ! $result = curl_exec($curl)) 
        { 
            $errno = curl_errno($curl);
            $result = json_encode(['error'=>$errno,'message'=>curl_strerror($errno)]);
            return  $result;
        }
        return $result;
    }

     /**
     * 根據輸入環境取得appkey
     * @return String 
     */
    public static function getContextAppKey($env,$key){
        $env = strtolower($env);
        $key = "app".$key;
        switch ($env)
        {
            case  "dev":
                $key = $key."dev";
                break;
            case  "test":
                $key = $key."test";
                break;
            case  "production":
                break;
            default :
                break;
        }
        return $key;
    }

    /**
     * 將字串做javascript escape
     * @param  string $str Utf-8字串
     * @return string      javascript escape 後的字串
     */
    public static function jsEscape($str){
        $ret = '';
        $len = mb_strlen($str);
        for ($i = 0; $i < $len; $i++)
        {
            $oriStr = mb_substr( $str,$i,1,"utf-8");
            $uniStr = self::utf8_str_to_unicode($oriStr);
            $ret .= $uniStr; 
         }
        return $ret;
    }

    /**
     * utf8字符轉換成Unicode字符 (%uxxxx)
     * @param  string $utf8_str Utf-8字符
     * @return string           Unicode字符
     */
    public static function utf8_str_to_unicode($utf8_str) {
        $conv = json_encode($utf8_str);
        $cov = preg_replace_callback("/(\\\u[0-9a-cf]{4})/i",function($conv){
            return '%'.$conv[0];
        },$conv); //emoji的unicode留下，其他改為%uXXXX
        return  json_decode($conv);
    }


     /**
     * 取得與QPlay Api 溝通的Signature
     * Base64( HMAC-SHA256( SignatureTime , AppSecretKey ) )
     * @param  timestamp $signatureTime 時間戳記
     * @return String    加密後的字串
     */
    public static function getSignature($signatureTime)
        {
            $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, Config::get('app.secret_key'), true));
            return $ServerSignature;
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

  /**
   * 發送email
   * @param  string $template 信件板模
   * @param  Array  $data     array(
                                    'sender'      =>寄件者login_id (ex:Cleo.W.Chan),
                                    'receiver'    =>收件者login_id (ex:Steven.Yan),
                                    'to'          =>收件者email,
                                    'fromName'    =>發信名稱,
                                    'fromAddress' =>發信者email,
                                    'subject'     =>信件標題 
                                );
   * @return [type]           [description]
   */
  public static function sendMail($template, $data){
    Mail::send($template, $data, function ($message) use ($data){
        $message->from($data['fromAddress'], $data['fromName']);
        $message->to($data['to']);
        $message->subject($data['subject']);
        $message->getSwiftMessage();
    });
  }

}