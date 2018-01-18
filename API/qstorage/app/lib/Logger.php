<?php
namespace App\lib;
use App\Model\MNG_QS_API_Log;
use App\Model\QS_API_Log;
use App\Model\QP_Register;
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
        $requestHeaderInfo = [];
        $operationTime = 0;
        $SignatureTime = 0;
        $needToLogArray = ["app-key", "signature", "signature-time", "token",
            "domain", "loginid", "redirect-uri", "push-token"];

        foreach ($request_header as $key => $value) {
            $loweheaderKey = strtolower($key);
            if(in_array($loweheaderKey,$needToLogArray)){
                $requestHeaderInfo[$loweheaderKey] = $value;
            }
        }
        if(isset($requestHeaderInfo["signature-time"])){
            $SignatureTime = $requestHeaderInfo["signature-time"];
        }
        $request_body = self::prepareJSON(file_get_contents('php://input'));
        $apiStartTime = Request::instance()->get('ApiStartTime');
        $operationTime = microtime(true) - $apiStartTime;

        $logMode = Config::get('app.log_mode');
        //Mysql
        if ($logMode == 'ALL' || $logMode == 'MYSQL'){
            QS_API_Log::insert([
                    'user_row_id'=>$userId,
                    'app_key'=>$appKey,
                    'api_version'=>$version,
                    'action'=>$action,
                    'ip'=>$ip,
                    'url_parameter'=>$url_parameter,
                    'request_header'=>self::unicodeDecode(json_encode($requestHeaderInfo)),
                    'request_body'=>self::unicodeDecode($request_body),
                    'response_header'=>self::unicodeDecode($responseHeader),
                    'response_body'=>self::userTextDecode(self::userTextEncode($responseBody)),
                    'signature_time'=> $SignatureTime,
                    'operation_time'=> number_format($operationTime,3),
                    'created_at'=>$now,
                ]);
        }

        //MongoDB
        if ($logMode == 'ALL' || $logMode == 'MONGODB'){
            $log = new MNG_QS_API_Log();
            $log->user_row_id = (int)$userId;
            $log->app_key = $appKey;
            $log->api_version = $version;
            $log->action = $action;
            $log->latitude = '';
            $log->longitude = '';
            $log->ip = $ip;
            $log->county = '';
            $log->city = '';
            $userInfo = self::getUserInfoByRowID($userId);
            if(!is_null($userInfo)){
                $log->login_id = $userInfo->login_id;
                $log->user_domain = $userInfo->user_domain;
                $log->company = $userInfo->company;
                $log->site_code = $userInfo->site_code;
                $log->department = $userInfo->department;
                $log->emp_no = $userInfo->emp_no;
                $log->login_id = $userInfo->login_id;
                $log->status = $userInfo->status;
            }
            $log->url_parameter = $url_parameter;
            $log->request_header= self::unicodeDecode(json_encode($requestHeaderInfo));
            $log->request_body= self::unicodeDecode($request_body);
            $requestTime = explode(" ",gmdate('Y-m-d H:i:s', (int)$SignatureTime));
            $log->request_date= $requestTime[0];
            $log->request_time= $requestTime[1];
            $log->response_header= self::unicodeDecode($responseHeader);
            $log->response_body= self::userTextDecode(self::userTextEncode($responseBody));
            $log->signature_time= (int)$SignatureTime;
            $log->operation_time= (float)(number_format($operationTime,3));
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

    /**
     * 解碼userTextEncode
     * @param  string     $str 與解碼的字串
     * @return string
     */
    public static function userTextDecode($str){
        $str = json_encode($str,JSON_UNESCAPED_UNICODE); //暴露出unicode
        $text = preg_replace_callback('/\\\\\\\\u/i',function($str){
            return '\\u';
        },$str); //將\\u改為\u其他不動
    
        return $text;
    }

    /**
     * 把輸入的本文轉譯(主要針對特殊符號和emoji表情)
     * @param  string     $str 欲編碼的字串
     * @return object
     */
    public static function userTextEncode($str){
        $str = json_encode($str);
        $text = preg_replace_callback("/(\\\u[ed][0-9a-f]{3})/i",function($str){
            return addslashes($str[0]);
        },$str); //將emoji的unicode留下，其他不動，\ud開頭的emoji改為\\ud
        return json_decode($text);
    }
    
    public static function getUserInfoByRowID($userRowId)
    {
        $userList = \DB::connection("mysql_qplay")
        ->table('qp_user')
            -> where('qp_user.row_id', '=', $userRowId)
            -> select()->get();
        if(count($userList) < 1) {
            return null;
        }

        $userList[0] -> uuidList = array();
        $userList[0] -> uuidList = QP_Register::where('user_row_id', '=', $userList[0]->row_id)
            -> where('status', '=', 'A')
            -> select('uuid')->get();

        return $userList[0];
    }

}