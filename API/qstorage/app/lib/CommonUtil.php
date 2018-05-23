<?php
namespace App\lib;

use App\Model\QP_User as QP_User;
use Config;

class CommonUtil
{

    /**
     * 依副檔名取得mine type
     * @return array
     */
    public static function getMineTypeWithExt($ext)
    {
        $map = static::getMineTypeMap();
        return $map[$ext];
    }

    /**
     * 取得副檔名對應的mine type
     * @return array
     */
    public static function getMineTypeMap()
    {
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
    public static function checkGifCartoon($image_file)
    {
        $fp = fopen($image_file, 'rb');
        $image_head = fread($fp, 1024);
        fclose($fp);
        return preg_match("/".chr(0x21).chr(0xff).chr(0x0b).'NETSCAPE2.0'."/", $image_head)?false:true;
    }

    /**
    * desription 壓縮圖片
    * @param sting $imgsrc 圖片路徑
    * @param string $imgdst 壓縮後保存路徑
    */
    public static function compressImage($imgsrc, $imgdst, $standard, $quality)
    {
        list($width, $height, $type)=getimagesize($imgsrc);
        $source_ratio = $width/$height;
        $new_ratio = 1;
        if ($source_ratio > 1) { //橫圖
            $target_ratio = $standard/$width;
        } else { //直圖
            $target_ratio = $standard/$height;
        }
        //長或寬 > standard 才需做壓縮
        if ($target_ratio < 1) {
            $new_ratio = $target_ratio;
        }
        $new_width = $width * $new_ratio;
        $new_height = $height * $new_ratio;
        switch ($type) {
      case 1:
        $giftype=self::checkGifCartoon($imgsrc);
        if ($giftype) {
            header('Content-Type:image/gif');
            $image_wp=imagecreatetruecolor($new_width, $new_height);
            $image = imagecreatefromgif($imgsrc);
            imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            imagejpeg($image_wp, $imgdst, $quality);
            imagedestroy($image_wp);
        }
        break;
      case 2:
       // header('Content-Type:image/jpeg');
        $image_wp=imagecreatetruecolor($new_width, $new_height);
        $image = imagecreatefromjpeg($imgsrc);
        imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
        imagejpeg($image_wp, $imgdst, $quality);
        imagedestroy($image_wp);
        break;
      case 3:
       // header('Content-Type:image/png');
        $image_wp=imagecreatetruecolor($new_width, $new_height);
        $image = imagecreatefrompng($imgsrc);
        imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
        imagejpeg($image_wp, $imgdst, $quality);
        imagedestroy($image_wp);
        break;
    }
    }

    /**
     * Convert gif or jpg image to png format
     *
     * @param string  original image file name
     * @param int     output image quality (0..100)
     * @return string output png file name
     */
    public static function img2png($filename, $quality = 100)
    {
        if (file_exists($filename) && is_readable($filename)) {
            $p = pathinfo($filename);
            $ext = strtolower($p['extension']);
            if ($ext == "png") {
                return($filename);
            } elseif ($img = imagecreatefromstring(file_get_contents($filename))) {
                $newname = $p['dirname'].'/'.$p['filename'].'.png';
                if (imagepng($img, $newname, $quality)) {
                    imagedestroy($img);
                    return($newname);
                } else {
                    imagedestroy($img);
                    die("Error creating ".$newname."\n");
                }
            }
        }
        die("Error loading ".$filename."\n");
    }


    public static function getUserInfoJustByUserEmpNo($empNo, $domain=null)
    {
        $userList = QP_User::where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')
            -> where('qp_user.emp_no', '=', $empNo);
        if (!is_null($domain)) {
            $userList = $userList->where('qp_user.user_domain', '=', $domain);
        }
        $userList = $userList->select(
              'qp_user.row_id',
              'qp_user.login_id',
              'qp_user.company',
              'qp_user.site_code',
              'qp_user.ext_no',
              'qp_user.emp_no',
              'qp_user.emp_name',
              'qp_user.user_domain',
              'qp_user.department',
              'qp_user.email'
            )->get();
        if (count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }

    public static function getUserInfoByUUID($uuid, $auth=true)
    {
        $query = QP_User::join('qp_register', 'qp_user.row_id', '=', 'qp_register.user_row_id')
            -> where('qp_register.uuid', '=', $uuid);
        if ($auth) {
            $query -> where('qp_register.status', '=', 'A');
            $query -> where('qp_user.status', '=', 'Y');
            $query -> where('qp_user.resign', '=', 'N');
        }
        $userList = $query-> select(
               'qp_user.row_id',
               'qp_user.login_id',
               'qp_user.emp_no',
                'qp_user.emp_name',
               'qp_user.email',
               'qp_user.user_domain',
               'qp_user.company',
                'qp_user.department',
               'qp_user.site_code',
               'qp_user.status',
               'qp_user.resign'
           )->get();
        if (count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }


    /**
     * 取得QPlay App Key
     * @return String
     */
    public static function getContextAppKey()
    {
        $key = "appqplay";
        $env = strtolower(Config::get('app.env'));

        switch ($env) {
            case  "dev":
                $key = $key."dev";
                break;
            case  "test":
                $key = $key."test";
                break;
            case  "production":
                break;
            default:
                break;
        }
        return $key;
    }
}
