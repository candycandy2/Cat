<?php
namespace App\lib;
use App\Model\MNG_Log;
use App\Model\QP_API_Log;
use Request;
use Config;


class Logger{


public static function logApi($userId, $action, $responseHeader, $responseBody) {
        $version = self::getApiVersionFromUrl();
        $appKey = self::getAppKeyFromHeader();
        if($appKey == null) {
            $appKey = "";
        }
        $now = date('Y-m-d H:i:s',time());
        $ip = self::getIP();
        $url_parameter = $_SERVER["QUERY_STRING"];
        $request_header = apache_request_headers();
        $request_body = self::prepareJSON(file_get_contents('php://input'));
        $requestHeaderInfo = [];
        $needToLogArray = ["app-key", "signature", "signature-time", "token",
            "domain", "loginid", "redirect-uri", "push-token"];

        foreach ($request_header as $key => $value) {
            $loweheaderKey = strtolower($key);
            if(in_array($loweheaderKey,$needToLogArray)){
                $requestHeaderInfo[$loweheaderKey] = $value;
            }
        }
        $logMode = Config::get('app.log_mode');
        //Mysql
        if ($logMode == 'ALL' || $logMode == 'MYSQL'){
            QP_API_Log::insert([
                    'user_row_id'=>$userId,
                    'app_key'=>$appKey,
                    'api_version'=>$version,
                    'action'=>$action,
                    'ip'=>$ip,
                    'url_parameter'=>$url_parameter,
                    'request_header'=>self::unicodeDecode(json_encode($requestHeaderInfo)),
                    'request_body'=>self::unicodeDecode($request_body),
                    'response_header'=>self::unicodeDecode(json_encode($responseHeader)),
                    'response_body'=>self::unicodeDecode(json_encode($responseBody)),
                    'created_at'=>$now,
                ]);
        }

        //MongoDB
        if ($logMode == 'ALL' || $logMode == 'MONGODB'){
            $log = new MNG_Log();
            $log->user_row_id = $userId;
            $log->app_key = $appKey;
            $log->api_version = $version;
            $log->action = $action;
            $log->latitude = '';
            $log->longitude = '';
            $log->ip = $ip;
            $log->county = '';
            $log->city = '';
            $log->url_parameter = $url_parameter;
            $log->request_header= self::unicodeDecode(json_encode($requestHeaderInfo));
            $log->request_body= self::unicodeDecode($request_body);
            $log->response_header= self::unicodeDecode(json_encode($responseHeader));
            $log->response_body= self::unicodeDecode(json_encode($responseBody));
            $log->created_at= $now;
            $log->save();
        }
    }

    public static function replace_unicode_escape_sequence($match) {
        return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');

    }

    public static function unicodeDecode($data) {
        return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', 'self::replace_unicode_escape_sequence', $data);
    }

    public static function getApiVersionFromUrl() {
        return explode("/", Request::instance()->path())[0];
    }

    public static function getAppKeyFromHeader() {
        $request = Request::instance();
        return $request->header('App-Key');
    }

    public static function getIP() {
        if (getenv('HTTP_CLIENT_IP')) {
            $ip = getenv('HTTP_CLIENT_IP');
        }
        elseif (getenv('HTTP_X_FORWARDED_FOR')) {
            $ip = getenv('HTTP_X_FORWARDED_FOR');
        }
        elseif (getenv('HTTP_X_FORWARDED')) {
            $ip = getenv('HTTP_X_FORWARDED');
        }
        elseif (getenv('HTTP_FORWARDED_FOR')) {
            $ip = getenv('HTTP_FORWARDED_FOR');

        }
        elseif (getenv('HTTP_FORWARDED')) {
            $ip = getenv('HTTP_FORWARDED');
        }
        else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    public static function prepareJSON($input){
        $input = mb_convert_encoding($input,'UTF-8','ASCII,UTF-8,ISO-8859-1');
        if(substr($input,0,3) == pack("CCC",0xEF,0xBB,0xBF)) $input = substr($input,3);
        return $input;
    }

}