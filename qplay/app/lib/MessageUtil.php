<?php
namespace App\lib;

use Config;

class MessageUtil
{

    public function register($loginId){
        $data['username'] = $loginId;
        $apiFunction = 'register';
        $result = $this->callQmessageAPI($apiFunction, $data);
        return $result;
    }

    /**
     * 呼叫QMessageAPI
     * @param  String $apiFunction 呼叫的function名稱
     * @param  Array $data        傳送的參數
     * @return json
     */
    private function callQmessageAPI($apiFunction, $data){
         $signatureTime = time();
         $data = json_encode($data);
         $url = Config::get('app.qmessage_api_server').$apiFunction;
         $headers = array('Content-Type: application/json');
         return $this->callAPI('POST', $url, $headers, $data);
    }

    /**
     * 呼叫API
     * @param  String      $method 呼叫方式(POST|GET)
     * @param  String      $url    API網址
     * @param  Array|array $header request header
     * @param  boolean     $data   傳遞的參數
     * @return mixed               API result
     */
    private function callAPI($method, $url, Array $header = array(), $data = false)
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
}