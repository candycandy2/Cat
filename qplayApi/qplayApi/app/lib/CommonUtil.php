<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午1:25
 */

use App\Model\Log;
use DB;
use JPush\Exceptions\APIConnectionException;
use JPush\Exceptions\APIRequestException;
use JPush\Exceptions\JPushException;
use Mockery\CountValidator\Exception;
use Request;
use Illuminate\Support\Facades\Input;
use JPush\Client as JPush;
use Config;

class CommonUtil
{
    public static function getUserInfoByUUID($uuid,$auth=true)
    {
        $query = \DB::table('qp_user')
            -> join('qp_register', 'qp_user.row_id', '=', 'qp_register.user_row_id')
            -> where('qp_register.uuid', '=', $uuid);
            if($auth){
               $query -> where('qp_register.status', '=', 'A');
               $query -> where('qp_user.status', '=', 'Y');
               $query -> where('qp_user.resign', '=', 'N');
            }
           $userList = $query-> select('qp_user.row_id', 'qp_user.login_id', 'qp_user.emp_no',
                'qp_user.emp_name', 'qp_user.email', 'qp_user.user_domain', 'qp_user.company',
                'qp_user.department','qp_user.site_code','qp_user.status', 'qp_user.resign'  )->get();
        if(count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }

    public static function getUserInfoByUserID($loginId, $domain)
    {
        $userList = \DB::table('qp_user')
            -> join('qp_register', 'qp_user.row_id', '=', 'qp_register.user_row_id')
            -> where('qp_register.status', '=', 'A')
            -> where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.user_domain', '=', $domain)
            -> select('qp_user.row_id')->get();
        if(count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }

    public static function getUserInfoByUserID4Logout($loginId, $domain)
    {
        $userList = \DB::table('qp_user')
            /*--> join('qp_register', 'qp_user.row_id', '=', 'qp_register.user_row_id')
            > where('qp_register.status', '=', 'A')
            -> where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')*/
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.user_domain', '=', $domain)
            -> select('qp_user.row_id')
            -> get();
        if(count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }

    public static function getUserInfoJustByUserID($loginId, $domain)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.user_domain', '=', $domain)
            -> select('qp_user.row_id')->get();
        if(count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }

    public static function getRoleInfo($roleDesc, $company)
    {
        $roleList = \DB::table('qp_role')
            -> where('qp_role.role_description', '=', $roleDesc)
            -> where('qp_role.company', '=', $company)
            -> select('qp_role.row_id')->get();
        if(count($roleList) < 1) {
            return null;
        }

        return $roleList[0];
    }

    public static function getUserInfoJustByUserIDAndCompany($loginId, $company)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.company', '=', $company)
            -> select('qp_user.row_id')->get();
        if(count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }

    public static function getUserInfoJustByUserIDAndDomain($loginId, $domain)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.user_domain', '=', $domain)
            -> select('qp_user.row_id')->get();
        if(count($userList) < 1) {
            return null;
        }
        $userList[0] -> uuidList = array();
        $userList[0] -> uuidList = \DB::table('qp_register')
            -> where('user_row_id', '=', $userList[0]->row_id)
            -> where('status', '=', 'A')
            -> select('uuid')->get();

        return $userList[0];
    }

    public static function getUserInfoByRowID($userRowId)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.row_id', '=', $userRowId)
            -> select()->get();
        if(count($userList) < 1) {
            return null;
        }

        $userList[0] -> uuidList = array();
        $userList[0] -> uuidList = \DB::table('qp_register')
            -> where('user_row_id', '=', $userList[0]->row_id)
            -> where('status', '=', 'A')
            -> select('uuid')->get();

        return $userList[0];
    }

    public static function getUserIdByUUID($uuid) {
        $userList = \DB::table('qp_user')
            -> join('qp_register', 'qp_user.row_id', '=', 'qp_register.user_row_id')
            -> where('qp_register.uuid', '=', $uuid)
            -> select('qp_user.row_id', 'qp_user.login_id', 'qp_user.emp_no',
                'qp_user.emp_name', 'qp_user.email', 'qp_user.user_domain', 'qp_user.company',
                'qp_user.department','qp_user.status', 'qp_user.resign'  )->get();
        if(count($userList) < 1) {
            return null;
        }

        return $userList[0]->row_id;
    }

    public static function getUserStatusByUserRowID($userRowId)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.row_id', '=', $userRowId)
            -> select('qp_user.row_id', 'qp_user.status', 'qp_user.resign')->get();
        if(count($userList) < 1) {
            return 0; //用户不存在
        }

        if(count($userList) == 1) {
            $user = $userList[0];
            if($user->resign != "N") {
                return 1; //用户已离职
            }

            if($user->status != "Y") {
                return 2; //用户已停权
            }
        } else {
            foreach ($userList as $user)
            {
                if($user->resign == "N") {
                    if($user->status == "Y") {
                        return 3; //正常
                    } else {
                        return 2; //停权
                    }
                }
            }
            return 1;  //离职
        }

        return 3; //正常
    }

    public static function getUserStatusByUserID($loginId, $domain)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.user_domain', '=', $domain)
            -> select('qp_user.row_id', 'qp_user.status', 'qp_user.resign')->get();
        if(count($userList) < 1) {
            return 0; //用户不存在
        }

        if(count($userList) == 1) {
            $user = $userList[0];
            if($user->resign != "N") {
                return 1; //用户已离职
            }

            if($user->status != "Y") {
                return 2; //用户已停权
            }
        } else {
            foreach ($userList as $user)
            {
                if($user->resign == "N") {
                    if($user->status == "Y") {
                        return 3; //正常
                    } else {
                        return 2; //停权
                    }
                }
            }
            return 1;  //离职
        }

        return 3; //正常
    }

    public static function getUserStatusByUserIDAndCompany($loginId, $company)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.company', '=', $company)
            -> select('qp_user.row_id', 'qp_user.status', 'qp_user.resign')->get();
        if(count($userList) < 1) {
            return 0; //用户不存在
        }

        if(count($userList) == 1) {
            $user = $userList[0];
            if($user->resign != "N") {
                return 1; //用户已离职
            }

            if($user->status != "Y") {
                return 2; //用户已停权
            }
        } else {
            foreach ($userList as $user)
            {
                if($user->resign == "N") {
                    if($user->status == "Y") {
                        return 3; //正常
                    } else {
                        return 2; //停权
                    }
                }
            }
            return 1;  //离职
        }

        return 3; //正常
    }

    public static function getUserStatusByUserIDAndDomain($loginId, $domain)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.login_id', '=', $loginId)
            -> where('qp_user.user_domain', '=', $domain)
            -> select('qp_user.row_id', 'qp_user.status', 'qp_user.resign')->get();
        if(count($userList) < 1) {
            return 0; //用户不存在
        }

        if(count($userList) == 1) {
            $user = $userList[0];
            if($user->resign != "N") {
                return 1; //用户已离职
            }

            if($user->status != "Y") {
                return 2; //用户已停权
            }
        } else {
            foreach ($userList as $user)
            {
                if($user->resign == "N") {
                    if($user->status == "Y") {
                        return 3; //正常
                    } else {
                        return 2; //停权
                    }
                }
            }
            return 1;  //离职
        }

        return 3; //正常
    }

    public static function getProjectInfoAppKey($appKey)
    {
        $projectList = \DB::table('qp_project')
            -> where('app_key', '=', $appKey)
            -> select('row_id')->get();
        if(count($projectList) < 1) {
            return null;
        }

        return $projectList[0];
    }

    public static function prepareJSON($input){
        $input = mb_convert_encoding($input,'UTF-8','ASCII,UTF-8,ISO-8859-1');
        if(substr($input,0,3) == pack("CCC",0xEF,0xBB,0xBF)) $input = substr($input,3);
        return $input;
    }

    public static function getMessageContentByCode($messageCode) {
        $lang = "";
        if (array_key_exists('lang',$_GET)){
            $lang = $_GET["lang"];
        }
        $lang_row_id = self::getLanguageIdByName($lang);
        $project_id = self::getProjectInfo();
        if ($project_id == null ||  count($project_id)<0){
            return "";
        }
        $project_id =    $project_id->row_id;
        $errorMessage = \DB::table('qp_error_code')
            -> where('lang_row_id', '=', $lang_row_id)
            -> where('error_code', '=', $messageCode)
            -> where ('project_row_id','=',$project_id)
            -> select("qp_error_code.error_desc")
            ->get();
        if(count($errorMessage) < 1) {
            return "";
        }
        $result = $errorMessage[0]->error_desc;
        return $result;
    }

    public static function getLanguageIdByName($lang) {
        $lang_row_id = 1;
        if (empty($lang)){
            return $lang_row_id;
        }
        $lang = strtolower($lang);

        switch ($lang) {
            case "en-us":
                $lang_row_id = 1;
                break;
            case "zh-cn":
                $lang_row_id = 2;
                break;
            case "zh-tw":
                $lang_row_id = 3;
                break;
        }
        return $lang_row_id;
    }

    public static function getSecretKeyByAppKey($appKey) {
        $projectList = \DB::table('qp_project')
            -> where('qp_project.app_key', '=', $appKey)
            -> select('qp_project.row_id', 'qp_project.secret_key')->get();
        if(count($projectList) > 0) {
            return $projectList[0]->secret_key;
        }

        return null;
    }

    /**
     * 實作jacascript unescape
     * @param  String $str javascript escape過的字串
     * @return String
     */
    public static function jsUnescape($str){
        $ret = '';
        $len = strlen($str);
        for ($i = 0; $i < $len; $i++)
        {
            if ($str[$i] == '%' && $str[$i+1] == 'u')
            {
                $val = hexdec(substr($str, $i+2, 4));
                if ($val < 0x7f) $ret .= chr($val);
                else if($val < 0x800) $ret .= chr(0xc0|($val>>6)).chr(0x80|($val&0x3f));
                else $ret .= chr(0xe0|($val>>12)).chr(0x80|(($val>>6)&0x3f)).chr(0x80|($val&0x3f));
                $i += 5;
            }
            else if ($str[$i] == '%')
            {   
                $map = \Config::get('encodemap.window1251_utf8');
                $subStr = substr($str, $i, 3);
                $subStr = (isset($map[$subStr]))?$map[$subStr]:$subStr;
                $ret .= urldecode($subStr);
                $i += 2;
            }
            else $ret .= $str[$i];
        }
        return $ret;
    }

    public static function getApiVersionFromUrl() {
        return explode("/", Request::instance()->path())[0];
    }

    public static function getAppKeyFromHeader() {
        $request = Request::instance();
        return $request->header('App-Key');
    }

    public static function getProjectInfo() {
        $appKey = self::getAppKeyFromHeader();
        return self::getProjectInfoByAppKey($appKey);
    }

    public static function getProjectInfoByAppKey($appKey) {
        $projectList = \DB::table('qp_project')
            -> where('app_key', '=', $appKey)
            -> select()->get();
        if(count($projectList) < 1) {
            return null;
        }

        return $projectList[0];
    }

    public static function getAppHeaderInfo() {
        $projectInfo = self::getProjectInfo();
        if($projectInfo == null) {
            return null;
        }
        $appList = \DB::table('qp_app_head')
            -> where('project_row_id', '=', $projectInfo->row_id)
            -> select()->get();

        if(count($appList) < 1) {
            return null;
        }

        return $appList[0];
    }

    public static function getApiCustomerUrl($action) {
        $appKey = self::getAppKeyFromHeader();
        $apiVersion = self::getApiVersionFromUrl();
        $appRowId = self::getAppHeaderInfo() -> row_id;
        $urlInfoList = \DB::table('qp_app_custom_api')
            -> where('app_row_id', '=', $appRowId)
            -> where('app_key', '=', $appKey)
            -> where('api_version', '=', $apiVersion)
            -> where('api_action', '=', $action)
            -> select()->get();
        if(count($urlInfoList) < 1) {
            return null;
        }

        return $urlInfoList[0]->api_url;
    }

    public static function getCompanyList() {
        $companyList = \DB::table('qp_user')
            ->select('company')->distinct()->orderBy('company')->get();
        return $companyList;
    }

    public static function checkCompanyExist($company) {
        $userList = \DB::table('qp_user')
            -> where('company', '=', $company)
            -> select()->get();
        if(count($userList) > 0) {
            return true;
        }

        return false;
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

    public static function replace_unicode_escape_sequence($match) {
        return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');

    }

    public static function unicodeDecode($data) {
        return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', 'self::replace_unicode_escape_sequence', $data);
    }

    public static function unicode_decode($name) {
        $json = '{"str":"'.$name.'"}';
        $arr = json_decode($json,true);
        if(empty($arr)) return '';
        return $arr['str'];
    }

    /**
     * @param $userId
     * @param $action
     * @param $responseHeader
     * @param $responseBody
     */
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
        /*
         * "App-Key":"appyellowpagedev",
         * "Signature":"UTpzSsnqBrMJ9mmz1g0dicvlmwEYWjPi69fGmSwm1ug=",
         * "Signature-Time":"1483581882",
         * "token":"586da9b75a3ab"
         * */
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
            \DB::table("qp_api_log")
                -> insert([
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
            $log = new Log();
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

    public static function logCustomApi($version,$appKey,$action, $responseHeader, $responseBody) {
        $now = date('Y-m-d H:i:s',time());
        $ip = self::getIP();
        $url_parameter = $_SERVER["QUERY_STRING"];
        $request_header = apache_request_headers();
        $request_body = self::prepareJSON(file_get_contents('php://input'));
        /*
             * "app-key":"appyellowpagedev",
             * "signature":"UTpzSsnqBrMJ9mmz1g0dicvlmwEYWjPi69fGmSwm1ug=",
             * "signature-time":"1483581882",
             * "token":"586da9b75a3ab"
             * */
        $requestHeaderInfo = [];
        $operationTime = 0;
        $SignatureTime = 0;
        
        $needToLogArray = ["app-key","signature","signature-time","token"];

        foreach ($request_header as $key => $value) {
            $loweheaderKey = strtolower($key);
            if(in_array($loweheaderKey,$needToLogArray)){
                $requestHeaderInfo[$loweheaderKey] = $value;
            }
        }
        if(isset($requestHeaderInfo["signature-time"])){
            $SignatureTime = $requestHeaderInfo["signature-time"];
        }
        $apiStartTime = Request::instance()->get('ApiStartTime');
        $operationTime = microtime(true) - $apiStartTime;
        $uuid = "";
        if (array_key_exists('uuid',$_GET)){
            $uuid = $_GET["uuid"];
        }

        $logMode = Config::get('app.log_mode');

        //Mysql
        if ($logMode == 'ALL' || $logMode == 'MYSQL') {
        \DB::table("qp_api_log")
            -> insert([
                'user_row_id'=> (int)self::getUserRowIDByUUID($uuid),
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
            $log = new Log();
            $log->user_row_id = self::getUserRowIDByUUID($uuid);
            $log->app_key = $appKey;
            $log->api_version = $version;
            $log->action = $action;
            $log->latitude = '';
            $log->longitude = '';
            $log->ip = $ip;
            $log->county = '';
            $log->city = '';
            $userInfo = self::getUserInfoByUUID($uuid);
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

    public static function getUserRowIDByUUID($uuid){
        $id = DB::table("qp_register")
            -> where('uuid','=',$uuid)
            -> select('user_row_id')
            -> get();
        return count($id)>0?$id[0]->user_row_id:"";
    }

    public static function checkCustomApiUrl($version,$appKey,$action){
        $result = DB::table('qp_app_custom_api')
            -> where('app_key', '=', $appKey)
            -> where('api_version', '=', $version)
            -> where('api_action', '=', $action)
            -> select('qp_app_custom_api.app_row_id')
            -> get();
        return count($result) > 0;
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

    public static function getContextAppKey(){
        $key = "appqplay";
        $env = strtolower(Config::get('app.env'));
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

}
