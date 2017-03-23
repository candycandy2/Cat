<?php
namespace App\lib;
/**
 * Created by PhpStorm.
 * User: John.ZC.Zhuang
 * Date: 2017/1/10
 * Time: 9:11
 */

use Config;
use Request;
use JMessage\JMessage;

class CommonUtil
{
    private static $JIM;
    public static function getJIM()
    {
        if(empty(self::$JIM))
        {
            $appKey = Config::get("app.appKey");
            $masterSecret = Config::get("app.masterSecret");
            self::$JIM = new JMessage($appKey, $masterSecret);
        }
        return self::$JIM;
    }

    public static function generatePasswordByUsername($username){
        return md5(hash_hmac( "sha256",$username.substr($username,0,3),Config::get('app.registerKey')));
    }

    public static function ResultFactory($code,$message,$content=""){
        return empty($content)?
            ["ResultCode"=> $code,"Message"=>$message]:
            ["ResultCode"=> $code,"Message"=>$message,"Content"=>$content];
    }

    public static function UnpackageResponse($response){
        $result = [];
        /*
         * {"username":"Sammi.Yao","error":{"code":899001,"message":"user exist"}}
         * {"username":"Moses.zhu"}
         * */
        /*
        if ($response->http_code == 200 && !property_exists($response,"body")){
            $result = self::ResultFactory(ResultCode::_1_reponseSuccessful,
                "Success","No response body");
        }*/
        if (is_array($response) && $response["http_code"] <= 299 && $response["http_code"] >= 200) {
            $result = self::ResultFactory(ResultCode::_1_reponseSuccessful,
                "Success",$response["body"]);
        } else {
            if(is_array($response)){
                $response = $response["body"];
            }
            $result = self::ResultFactory(ResultCode::_998002_callAPIFailedOrErrorOccurs,
                "Call API failed or error occurred", $response);
        }
        return $result;
    }

    /*
    public static function getSecretKeyByAppKey($appKey) {
        $projectList = \DB::connection("qplay")
            -> table('qp_project')
            -> where('qp_project.app_key', '=', $appKey)
            -> select('qp_project.row_id', 'qp_project.secret_key')
            -> get();
        if(count($projectList) > 0) {
            return $projectList[0]->secret_key;
        }
        return null;
    }

    public static function getUserStatusByUsername($username)
    {
        $userList = \DB::connection("qplay")
            -> table('qp_user')
            -> where('qp_user.login_id', '=', $username)
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

    public static function checkUserListStatusByUsername($usernameList)
    {
        for ($i=0; $i<count($usernameList); $i++) {
            if (self::getUserStatusByUsername($usernameList[$i])!=3){
                return false;
            }
        }
        return true;
    }
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
        $request_header = response()->json(apache_request_headers());
        $request_body = self::prepareJSON(file_get_contents('php://input'));

        \DB::connection("qmessage")
            ->table("qm_api_log")
            -> insert([
                'user_row_id'=>$userId,
                'app_key'=>$appKey,
                'api_version'=>$version,
                'action'=>$action,
                'ip'=>$ip,
                'url_parameter'=>$url_parameter,
                'request_header'=>$request_header,
                'request_body'=>$request_body,
                'response_header'=>$responseHeader,
                'response_body'=>$responseBody,
                'created_at'=>$now,
            ]);
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

    public static function guid(){
        if (function_exists('com_create_guid')){
            return com_create_guid();
        }else{
            mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);// "-"
            $uuid = substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12);
            return $uuid;
        }
    }

    public static function saveHistory($data){
        $msg_id = \DB::connection("qmessage")
            -> table("qm_history")
            -> insert([
                'msg_id'=>$data->msg_id,
                'msg_type'=>$data->msg_type,
                'from_id'=>$data->from_id,
                'from_type'=>$data->from_type,
                'target_id'=>$data->target_id,
                'target_type'=>$data->target_type,
                'target_name'=>$data->target_name,
                'ctime'=>$data->ctime,
                'content'=>$data->content
            ]);
        return $msg_id;
    }

    public static function saveHistoryFile($fileInfo){
        $msg_id = \DB::connection("qmessage")
            -> table("qm_history_file")
            -> insert([
                'msg_id'=>$fileInfo["msg_id"],
                'fname'=>$fileInfo["fname"],
                'fsize'=>$fileInfo["fsize"],
                'format'=>$fileInfo["format"],
                'npath'=>$fileInfo["npath"]
            ]);
        return $msg_id;
    }

    public static function updateHistory($msg_id,$lpath){
        \DB::connection("qmessage")
            -> table("qm_history_file")
            -> where('msg_id',"=",$msg_id)
            -> update([
                'lpath'=>$lpath
            ]);
    }

    public static function http_get_data($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);

        //add for QCS Test
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,0);
        curl_setopt($ch, CURLOPT_PROXY,'qcsproxyy.qgroup.corp.com:80');
        curl_setopt($ch, CURLOPT_PROXYUSERPWD,'john.zc.zhuang:Zucc53546211');
        //end add

        $output = curl_exec($ch);
        curl_close($ch);
        return $output;

    }

    public static function getHistoryList($gid,$count,$ctime=""){
        $whereClause = [
            ['first_name','', 'last_name'],
            ['updated_at', '>', 'created_at']
        ];
        $entries = \DB::connection("qmessage")
            -> table('qm_history')
            -> leftJoin('qm_history_file','qm_history_file.msg_id','=','qm_history.msg_id')
            -> where('qm_history.target_id','=',$gid);
            if (!empty($ctime)){
                $entries = $entries->where('qm_history.ctime', '<', $ctime);
            }
        $entries = $entries
            -> orderBy('qm_history.ctime','desc')
            -> select(
                'qm_history.msg_id'
                ,'qm_history.target_id'
                ,'qm_history.ctime'
                ,'qm_history.msg_type'
                ,'qm_history.from_id'
                ,'qm_history.content'
                ,'qm_history_file.fname'
                ,'qm_history_file.fsize'
                ,'qm_history_file.format'
                ,'qm_history_file.npath'
                ,'qm_history_file.lpath'
            )
            -> take($count)
            -> get();
        return $entries;
    }
}