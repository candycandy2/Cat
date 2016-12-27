<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午1:25
 */

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
    public static function getUserInfoByUUID($uuid)
    {
        $userList = \DB::table('qp_user')
            -> join('qp_register', 'qp_user.row_id', '=', 'qp_register.user_row_id')
            -> where('qp_register.uuid', '=', $uuid)
            -> where('qp_register.status', '=', 'A')
            -> where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')
            -> select('qp_user.row_id', 'qp_user.login_id', 'qp_user.emp_no',
                'qp_user.emp_name', 'qp_user.email', 'qp_user.user_domain', 'qp_user.company',
                'qp_user.department','qp_user.status', 'qp_user.resign'  )->get();
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
        $lang_row_id = self::getLanguageIdByName($_GET['lang']);
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
        $lang = strtolower($lang);
        $lang_row_id = 1;
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
                $ret .= urldecode(substr($str, $i, 3));
                $i += 2;
            }
            else $ret .= $str[$i];
        }
        return $ret;
    }

    public static function doPost($url, $data){//file_get_content
        $postdata = http_build_query($data);

        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata
            )
        );
        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        return $result;
    }

    public static function PushMessageWithMessageCenter($message, $to, $parameter = '') {
        $jpush_app_id = "33938c8b001b601c1e647cbd";//"1dd3ebb8bb12f1895b4a5e25";  //TODO
        $id = strtoupper(md5(uniqid(rand(),true)));
        $args = array('Id' => $id,
            'TenantId' => '00000000-0000-0000-0000-000000000000',
            'AppId' => $jpush_app_id,
            'To' => $to,
            'Message' => $message,
            'Sound' => 'default',
            'Badge' => '0',
            'Timing' => '1900-01-01 00:00:00.000',
            'Expire' => '2099-12-31 00:00:00.000',
            'Status' => 'W',
            'To_Type' => 'NONE',
            'Parameter' => $parameter,
            'CreatedDate' => date('Y-m-d H:i:s',time()));
        $url = "http://58.210.86.182/MessageCenterWebService/MessageService.asmx/SendPNS"; //TODO http://aic0-s2.qgroup.corp.com/War/MessageCenter/MessageService.asmx
        $data["pns"] = json_encode($args);
        $response = self::doPost($url, $data);

        $result = array();
        if(str_contains($response, "true")) {
            $result["result"] = true;
            $result["info"] = $data["pns"];
        } else {
            $result["result"] = false;
            $result["info"] = $data["pns"];
        }

        return $result;
    }

    public static function PushMessageWithJPushWebAPI($message, $to, $parameter = '') {
        $result = array();
        $result["result"] = true;
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $platform = array('ios', 'android');
            $alert = $message;
            $regId = $to;
            $ios_notification = array(
                'sound' => 'default',
                'badge' => '0',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $android_notification = array(
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $content = $message;
            $message = array(
                'title' => $message,
                'content_type' => 'text',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $time2live =  Config::get('time_to_live',864000);
            $apnsFlag = Config::get('apns_flag',true);
            $options = array(
                'time_to_live'=>$time2live,
                'apns_production'=>$apnsFlag
            );
            $response = $client->push()->setPlatform($platform)
                ->addRegistrationId($regId)
                ->iosNotification($alert, $ios_notification)
                ->androidNotification($alert, $android_notification)
                ->message($content, $message)
                ->options($options)
            ->send();
        } catch (APIConnectionException $e) {
            $result["result"] = false;
            $result["info"] = "APIConnection Exception occurred";
        }catch (APIRequestException $e) {
            $result["result"] = false;
            $result["info"] = "APIRequest Exception occurred";
        }catch (JPushException $e) {
            $result["result"] = false;
            $result["info"] = "JPush Exception occurred";
        }catch (\ErrorException $e) {
            $result["result"] = false;
            $result["info"] = "Error Exception occurred";
        }catch (\Exception $e){
            $result["result"] = false;
            $result["info"] = "Exception occurred";
        }
        return $result;
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

    public static function checkCompanyExist($company) {
        $userList = \DB::table('qp_user')
            -> where('company', '=', $company)
            -> select()->get();
        if(count($userList) > 0) {
            return true;
        }

        return false;
    }

    public static function logApi($userId, $action, $responseHeader, $responseBody) {
        $version = self::getApiVersionFromUrl();
        $appKey = self::getAppKeyFromHeader();
        if($appKey == null) {
            $appKey = "";
        }
        $now = date('Y-m-d H:i:s',time());
        $ip = self::getIP();
        $url_parameter = $_SERVER["QUERY_STRING"];
        $request_header = response()->json(apache_request_headers());
        $request_body = self::prepareJSON(file_get_contents('php://input'));

        \DB::table("qp_api_log")
            -> insert([
                'user_row_id'=>$userId,
                'app_key'=>$appKey,
                'api_version'=>$version,
                'action'=>$action,
                'ip'=>$ip,
                'url_parameter'=>$url_parameter,
                'request_header'=>$request_header,
                'request_body'=>$request_body,
                'request_header'=>$request_header,
                'request_body'=>$request_body,
                'response_header'=>$responseHeader,
                'response_body'=>$responseBody,
                'created_at'=>$now,
            ]);
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