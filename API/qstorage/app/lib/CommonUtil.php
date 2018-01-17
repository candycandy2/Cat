<?php
namespace App\lib;
use Config;

class CommonUtil{

    /**
     * 依副檔名取得mine type
     * @return array
     */
    public static function getMineTypeWithExt($ext){
        $map = static::getMineTypeMap();
        return $map[$ext];
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
  public static function compressImage($imgsrc, $imgdst, $standard, $quality){
    list($width,$height,$type)=getimagesize($imgsrc);
    $source_ratio = $width/$height;
    $new_ratio = 1;
    if($source_ratio > 1){ //橫圖
        $target_ratio = round($standard/$width, 1);
    }else{ //直圖
        $target_ratio = round($standard/$height, 1);
    }
    //長或寬 > standard 才需做壓縮
    if($target_ratio < 1){
        $new_ratio = $target_ratio;
    }
    $new_width = $width * $new_ratio;
    $new_height = $height * $new_ratio;
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