<?php
namespace App\lib;

use Config;


class QPlayApi
{

    public static function post($action, $data, $headers=array('Content-Type: application/json')){
        $method = 'POST';
        $signatureTime = time();
        //$data = json_encode($data);
        $url = Config::get('app.qplay_api_server').$action;
        return self::callAPI($method, $url, $headers, $data);
    }

    /**
     * 呼叫API
     * @param  String      $method 呼叫方式(POST|GET)
     * @param  String      $url    API網址
     * @param  Array|array $header request header
     * @param  boolean     $data   傳遞的參數
     * @return mixed               API result
     */
    private static function callAPI($method, $url, Array $header = array(), $data = false)
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
        curl_setopt($curl, CURLOPT_SAFE_UPLOAD, true);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        if( ! $result = curl_exec($curl)) 
        { 
            trigger_error(curl_error($curl)); 
        } 

        curl_close($curl);

        return $result;
    }
}