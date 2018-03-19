<?php
namespace App\lib;

use Config;

class CommonUtil
{
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
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            if( ! $result = curl_exec($curl)) 
            { 
                trigger_error(curl_error($curl)); 
            } 

            curl_close($curl);

            return $result;
        }


    /**
     * 取得與QPlay Custom Api 溝通的Signature
     * Base64( HMAC-SHA256( SignatureTime , AppSecretKey ) )
     * @param  timestamp $signatureTime 時間戳記
     * @param  string    $appKey appKey
     * @return String    加密後的字串
     */
    public static function getCustomSignature($signatureTime, $appKey)
        {
            $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, Config::get('appkey.'.self::getProjectName($appKey)), true));
            return $ServerSignature;
        }

    
    /**
     * 過濾掉環境變數，取得原始app專案名稱
     * @param  String $appKey 加上環境變數後的appKey
     * @return String         ex : appqplaydev，處理後會回傳qplqy
     */
    public static function getProjectName($appKey){
        $projectName = preg_replace("/^app/", '',$appKey);
        if(Config::get('app.env')!= 'production' ){
            $projectName = preg_replace("/".Config::get('app.env')."$/", '',trim($projectName));
        }
        return trim($projectName);
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
}