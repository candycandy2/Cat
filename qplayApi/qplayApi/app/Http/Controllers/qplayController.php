<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\FilePath;
use App\lib\PushUtil;
use Illuminate\Support\Facades\Input;
use Mockery\CountValidator\Exception;
use Request;
use App\Http\Requests;
use App\lib\ResultCode;
use App\lib\Verify;
use DB;


class qplayController extends Controller
{
    public function getIpInfo()
    {
        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'getIpInfo';

        $ip = $input['ip'];


        $url = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip='.$ip;
        $ch = curl_init($url);
        //curl_setopt($ch,CURLOPT_ENCODING ,'utf8');
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回
        $location = curl_exec($ch);
        $location = json_decode($location);
        curl_close($ch);
        $loc = "";
        if($location===FALSE)
            //return "";
            if (empty($location->desc)) {
                $loc = $location->province.$location->city.$location->district.$location->isp;
            }else{
                $loc = $location->desc;
            }

//        $url = 'http://ip.qq.com/cgi-bin/searchip?searchip1='.$ip;
//        $ch = curl_init($url);
//        curl_setopt($ch,CURLOPT_ENCODING ,'gb2312');
//        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回
//        $result = curl_exec($ch);
//        $result = mb_convert_encoding($result, "utf-8", "gb2312"); // 编码转换，否则乱码
//        curl_close($ch);
//        preg_match("@(.*)@iU",$result,$ipArray);
//        $loc = $ipArray[1];

        $result = response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>'',
            'content'=>array("ip info"=>$loc)]);
        
        return $result;
    }

    public function isLogin()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'isLogin';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi('', $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        $uuid = $input["uuid"];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $uuidList = \DB::table("qp_register")
                -> where('uuid', '=', $uuid)
                -> where('status', '=', 'A')
                -> select('uuid')->get();
            if(count($uuidList) > 0)
            {
                $userId = CommonUtil::getUserIdByUUID($uuid);
                if($userId != null) {
                    $userList = \DB::table("qp_user")
                        -> where('row_id', '=', $userId)
                        -> select()->get();
                    $userInfo = $userList[0];

                    $sessionList = \DB::table("qp_session")
                        -> where('user_row_id', '=', $userId)
                        -> where('uuid', '=', $uuid)
                        -> select()->get();

                    if(count($sessionList) <= 0) {
                        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                            'message'=>trans("messages.MSG_IS_NOT_LOGIN"),
                            'is_login'=>0,
                            'login_id'=>$userInfo->login_id];
                        CommonUtil::logApi("", $ACTION,
                            response()->json(apache_response_headers()), $result);
                        $result = response()->json($result);
                        return $result;
                    } else {
                        $sessionInfo = $sessionList[0];
                        $nowTimestamp = time();
                        $token_valid = $sessionInfo->token_valid_date;
                        if($nowTimestamp <= $token_valid) {
                            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                'message'=>trans("messages.MSG_IS_LOGIN"),
                                'is_login'=>1,
                                'login_id'=>$userInfo->login_id];
                            CommonUtil::logApi("", $ACTION,
                                response()->json(apache_response_headers()), $result);
                            $result = response()->json($result);
                            return $result;
                        } else {
                            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                'message'=>trans("messages.MSG_IS_NOT_LOGIN"),
                                'is_login'=>0,
                                'login_id'=>$userInfo->login_id];
                            CommonUtil::logApi("", $ACTION,
                                response()->json(apache_response_headers()), $result);
                            $result = response()->json($result);
                            return $result;
                        }
                    }
                } else {
                    $result = ['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>trans("messages.MSG_UNKNOWN_ERROR"),
                        //'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999999_unknownError),
                        'is_login'=>0,
                        'login_id'=>""];
                    CommonUtil::logApi("", $ACTION,
                        response()->json(apache_response_headers()), $result);
                    $result = response()->json($result);
                    return $result;
                }
            }
            else
            {
                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_DEVICE_HAS_NOT_REGISTERED"),
                    'is_login'=>0,
                    'login_id'=>""];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                $result = response()->json($result);
                return $result;
            }
        }
        else
        {
            $result = ['result_code'=>$verifyResult["code"],
                //'message'=>$verifyResult["message"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            $result = response()->json($result);
            return $result;
        }
    }

    public function logoutSmartFactory() {
        $input = Input::get();

        $uuid = $input["uuid"];

        \DB::table("qp_session")
            -> where('uuid', '=', $uuid)
            -> delete();
    }

    public function isRegister()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }
        
        //For Log
        $ACTION = 'isRegister';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                //'message'=>'傳入參數不足或傳入參數格式錯誤',
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi('', $ACTION,
                response()->json(apache_response_headers()), $result);
            $result = response()->json($result);
            return $result;
        }
        $uuid = $input["uuid"];
        $userId = CommonUtil::getUserRowIDByUUID($uuid);
        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $uuidList = \DB::table("qp_register")
                -> where('uuid', '=', $uuid)
                -> where('status', '=', 'A')
                -> select('uuid')->get();
            if(count($uuidList) > 0)
            {
                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'content'=>array("is_register"=>1)];
                CommonUtil::logApi( $userId, $ACTION,
                    response()->json(apache_response_headers()), $result);
                $result = response()->json($result);
                return $result;
            }
            else
            {
                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_DEVICE_HAS_NOT_REGISTERED"),
                    'content'=>array("is_register"=>0)];
                CommonUtil::logApi( $userId, $ACTION,
                    response()->json(apache_response_headers()), $result);
                $result = response()->json($result);
                return $result;
            }
        }
        else
        {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>''];
            CommonUtil::logApi( $userId, $ACTION,
                response()->json(apache_response_headers()), $result);
            $result = response()->json($result);
            return $result;
        }
    }

    public function register()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $request = Request::instance();
        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'register';

        $redirect_uri = $request->header('redirect-uri');
        $domain = $request->header('domain');
        $loginid = $request->header('loginid');
        $password = rawurldecode($request->header('password'));

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == ""
            || !array_key_exists('device_type', $input) || trim($input["device_type"]) == ""
            || $redirect_uri == null || $domain == null
            || $loginid == null || $password == null)
        {
            $message = CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect);
            $finalUrl = urlencode($redirect_uri.'?result_code='
                .ResultCode::_999001_requestParameterLostOrIncorrect
                .'&message='
                .$message);
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>$message,
                'content'=>array("redirect_uri"=>$finalUrl)];
            CommonUtil::logApi('', $ACTION,
                response()->json(apache_response_headers()), $result);
            $result = response()->json($result);
            return $result;

        }

        $uuid = $input["uuid"];
        $device_type = $input["device_type"];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyUserByUserID($loginid, $domain);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {
                $user = CommonUtil::getUserInfoJustByUserID($loginid, $domain);

                //Check user password with LDAP
                //$LDAP_SERVER_IP = "LDAP://BQYDC01.benq.corp.com";
		$LDAP_SERVER_IP = "LDAP://10.82.12.61";
                $userId = $domain . "\\" . $loginid;
                $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
                $bind = @ldap_bind($ldapConnect, $userId, $password); //TODO true;
                if(!$bind)
                {
                    $message = CommonUtil::getMessageContentByCode(ResultCode::_000902_passwordError);
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000902_passwordError
                        .'&message='
                        .$message);
                    $result = ['result_code'=>ResultCode::_000902_passwordError,
                        'message'=>$message,
                        'content'=>array("redirect_uri"=>$finalUrl)];
                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    $result = response()->json($result);
                    return $result;
                }

                //Check uuid exist
                $uuidList = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    -> where('status', '=', 'A')
                    -> select('uuid')->get();
                if(count($uuidList) > 0)
                {
                    $message = CommonUtil::getMessageContentByCode(ResultCode::_000903_deviceHasRegistered);
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000903_deviceHasRegistered
                        .'&message='
                        .$message);
                    $result = ['result_code'=>ResultCode::_000903_deviceHasRegistered,
                        'message'=>$message,
                        'content'=>array("redirect_uri"=>$finalUrl)];
                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    $result = response()->json($result);
                    return $result;
                }

                try
                {
                    $token = uniqid();  //生成token
                    $nowTimestamp = time();
                    $token_valid = $nowTimestamp + (7 * 86400);
                    $now = date('Y-m-d H:i:s',$nowTimestamp);

                    \DB::table("qp_register")->insert([
                        'user_row_id'=>$user->row_id,
                        'uuid'=>$uuid,
                        'device_type'=>$device_type,
                        'register_date'=>$now,
                        'created_user'=>$user->row_id,
                        'created_at'=>$now,
                        'status'=>'A'
                        //, 'remember_token'=>$token
                    ]);

                    $sessionList = \DB::table("qp_session")
                        -> where('uuid', "=", $uuid)
                        -> where('user_row_id', '=', $user->row_id)
                        -> select('uuid')->get();
                    if(count($sessionList) > 0)
                    {
                        \DB::table("qp_session")
                            ->where('user_row_id', '=', $user->row_id)
                            ->where('uuid', '=', $uuid)
                            ->update(['token'=>$token,
                                'token_valid_date'=>$token_valid,
                                'updated_at'=>$now,
                                'updated_user'=>$user->row_id,
                            ]);
                    }
                    else
                    {
                        \DB::table("qp_session")->insert([
                            'user_row_id'=>$user->row_id,
                            'uuid'=>$uuid,
                            'token'=>$token,
                            'token_valid_date'=>$token_valid,
                            'created_at'=>$now,
                            'created_user'=>$user->row_id,
                        ]);
                    }
                    //bug 14023 2017.3.27
                    \DB::table("qp_user_message")
                        -> where('uuid', '=', $user->row_id)
                        -> update(
                            ['uuid'=>$uuid]
                        );
                    \DB::table("qp_user_message_pushonly")
                        -> where('uuid', '=', $user->row_id)
                        -> update(
                            ['uuid'=>$uuid]
                        );
                }
                catch (Exception $e)
                {
                    $message = trans('messages.MSG_CALL_SERVICE_SUCCESS');
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_999999_unknownError
                        .'&message='
                        .$message);
                    $result = ['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>$message,
                        'content'=>array("redirect_uri"=>$finalUrl)];
                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    $result = response()->json($result);
                    return $result;
                }
                $appHeaderList = \DB::table("qp_app_head")
                    ->join("qp_project","qp_app_head.project_row_id",  "=", "qp_project.row_id")
                    ->whereNotNull('qp_app_head.security_updated_at')
                    ->select('qp_project.app_key', 'qp_app_head.security_updated_at')->get();
                $security_update_list = array();
                $temp = 5184000;//两个月 60 * 60 * 24 * 30 * 2 = 5184000;
                foreach ($appHeaderList as $item) {
                    if((time() -  $item->security_updated_at) < $temp) {
                        $sItem = array('app_key'=>$item->app_key,
                            'security_updated_at'=>$item->security_updated_at
                        );
                        array_push($security_update_list, $sItem);
                    }
                }
                $userInfo = CommonUtil::getUserInfoByUUID($uuid);
                $message = CommonUtil::getMessageContentByCode($verifyResult["code"]);
                $finalUrl = urlencode($redirect_uri.'?token='
                    .$token
                    .'&token_valid='
                    .$token_valid);
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>$message,
                    'token_valid'=>$token_valid,
                    'content'=>array(
                        "uuid" => $uuid,
                        "redirect_uri"=>$finalUrl,
                        "token"=>$token,
                        "loginid"=>$userInfo->login_id,
                        "emp_no"=>$userInfo->emp_no,
                        "domain"=>$userInfo->user_domain,
                        "site_code"=>$userInfo->site_code,
                        "checksum"=>md5($password),
                        'security_update_list' => $security_update_list)
                ];

                CommonUtil::logApi($user->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
	
        	//register to QMessage
        	$QMessage_register_url = \Config::get('app.QMessage_Register_URL');
        	if(!empty($QMessage_register_url)){
           	 $qmessage_result = self::Register2QMessage($userInfo->login_id, $QMessage_register_url);
            	CommonUtil::logApi("", "Register2Qmessage",
                	response()->json(apache_response_headers()), $qmessage_result);
            	//更新标志位
            	\DB::table("qp_user")
                	->where('login_id', '=', $userInfo->login_id)
                	->update(['register_message'=>'Y']);
        	}
        	return response()->json($result);
            }
        }
        $message = CommonUtil::getMessageContentByCode($verifyResult["code"]);
        $finalUrl = urlencode($redirect_uri.'?result_code='
            .$verifyResult["code"]
            .'&message='
            .$message);
        $result = ['result_code'=>$verifyResult["code"],
            'message'=>$message,
            'content'=>array("redirect_uri"=>$finalUrl)];
        CommonUtil::logApi("", $ACTION,
            response()->json(apache_response_headers()), $result);
        $result = response()->json($result);
	return $result;
    }

    public function Register2QMessage($loginid,$url){
        $data = ["username" => $loginid];
        $data_string = json_encode($data);
        $result = self::http_post_data($url,$data_string);
        return $result;
    }

    function http_post_data($url, $data_string) {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json; charset=utf-8',
                'Content-Length: ' . strlen($data_string))
        );
        //add for QCS Test
        //curl_setopt($ch, CURLOPT_PROXY,'qcsproxyy.qgroup.corp.com:80');
        //curl_setopt($ch, CURLOPT_PROXYUSERPWD,'john.zc.zhuang:Zucc53546211');
        //curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,0);
        //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,0);
        //add end
        ob_start();
        curl_exec($ch);
        $return_content = ob_get_contents();
        ob_end_clean();

        $return_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        return array($return_code, $return_content);
    }

    public function unregister() {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'unregister';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == ""
        || !array_key_exists('target_uuid', $input) || trim($input["target_uuid"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            $result = response()->json($result);
            return $result;
        }

        $uuid = $input["uuid"];

        $target_uuid = $input["target_uuid"];


        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            $result = response()->json($result);
            return $result;
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            \DB::beginTransaction();
            $now = date('Y-m-d H:i:s',time());
            try {
                \DB::table("qp_session")
                    ->where("uuid", "=", $target_uuid)
                    ->delete();

                \DB::table("qp_register")
                    ->where("uuid", "=", $target_uuid)
                    ->update(
                        [
                            'status'=>'I',
                            'unregister_date'=>$now,
                            'updated_at'=>$now,
                            'updated_user'=>$userInfo->row_id,
                        ]
                    );

                $registerList = \DB::table("qp_register")
                    ->where("uuid", "=", $target_uuid)->select()->get();

                foreach ($registerList as $registerInfo) {
                    $registerId = $registerInfo->row_id;
                    $pushTokenList = \DB::table("qp_push_token")
                        -> where("register_row_id", "=", $registerId)
                        -> select() -> get();

                    //Unregister to Message Center
                    /*$app_id = "33938c8b001b601c1e647cbd";  //TODO 正式上线需要读配置
                    $url = "http://58.210.86.182/MessageCenterWebService/MessageService.asmx/UnregisterDevice";
                    foreach ($pushTokenList as $pushTokenInfo) {
                        $args = array('App_id' => $app_id,
                            'Client_id' => $pushTokenInfo->push_token);
                        $data["register"] = json_encode($args);
                        $result = CommonUtil::doPost($url, $data);
                        if(!str_contains($result, "true")) {
                            \DB::rollBack();
                            return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                                'message'=>'Unregister to Message Center Failed!' . $result,
                                'content'=>$data]);
                        }
                    }*/

                    \DB::table("qp_push_token")
                        ->where("register_row_id", "=", $registerId)
                        ->delete();
                }

                \DB::commit();
            } catch (Exception $e) {
                \DB::rollBack();
                $result = ['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>trans('messages.MSG_UNKNOWN_ERROR'),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }

            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'content'=>array('uuid'=>$uuid)
            ];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }

    public function login()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $request = Request::instance();
        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'login';

        $redirect_uri = $request->header('redirect-uri');
        $domain = $request->header('domain');
        $loginid = $request->header('loginid');
        $password = rawurldecode($request->header('password'));

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || $redirect_uri == null
            || $domain == null || $loginid == null || $password == null)
        {
            $message = CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect);
            $finalUrl = urlencode($redirect_uri.'?result_code='
                .ResultCode::_999001_requestParameterLostOrIncorrect
                .'&message='
                .$message);
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>$message,
                'content'=>array("redirect_uri"=>$finalUrl)];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        $uuid = $input["uuid"];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $verifyResult = $Verify->verifyUserByUserID($loginid, $domain);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {
                $uuidList = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    -> where('status', "=", "A")
                    -> select('row_id','uuid', 'user_row_id')->get();
                $uuidInDB = null;
                if(count($uuidList) < 1)
                {
                    $message = CommonUtil::getMessageContentByCode(ResultCode::_000905_deviceNotRegistered);
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000905_deviceNotRegistered
                        .'&message='
                        .$message);
                    $result = ['result_code'=>ResultCode::_000905_deviceNotRegistered,
                        'message'=>$message,
                        'content'=>array("redirect_uri"=>$finalUrl)];
                    CommonUtil::logApi("", $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }
                else
                {
                    $uuidInDB = $uuidList[0];
                    $tempUser = CommonUtil::getUserInfoJustByUserID($loginid, $domain);
                    if($tempUser->row_id != $uuidInDB->user_row_id)
                    {
                        $message = CommonUtil::getMessageContentByCode(ResultCode::_000904_loginUserNotMathRegistered);
                        $finalUrl = urlencode($redirect_uri.'?result_code='
                            .ResultCode::_000904_loginUserNotMathRegistered
                            .'&message='
                            .$message);
                        $result = ['result_code'=>ResultCode::_000904_loginUserNotMathRegistered,
                            'message'=>$message,
                            'content'=>array("redirect_uri"=>$finalUrl)];
                        CommonUtil::logApi($tempUser->row_id, $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                }

                $user = CommonUtil::getUserInfoByUserID($loginid, $domain);

                //Check user password with LDAP
                //$LDAP_SERVER_IP = "LDAP://BQYDC01.benq.corp.com";
		$LDAP_SERVER_IP = "LDAP://10.82.12.61";
                $userId = $domain . "\\" . $loginid;
                $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
               $bind = @ldap_bind($ldapConnect, $userId, $password); //TODO true;
                if(!$bind)
                {
                    $message = CommonUtil::getMessageContentByCode(ResultCode::_000902_passwordError);
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000902_passwordError
                        .'&message='
                        .$message);
                    $result = ['result_code'=>ResultCode::_000902_passwordError,
                        'message'=>$message,
                        'content'=>array("redirect_uri"=>$finalUrl)];
                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }

                //Check uuid exist
                //Check user


                $token = uniqid();  //生成token
                $nowTimestamp = time();
                $token_valid = $nowTimestamp + (7 * 86400);
                $now = date('Y-m-d H:i:s',$nowTimestamp);
                try
                {
                    $sessionList = \DB::table("qp_session")
                        -> where('uuid', "=", $uuid)
                        -> where('user_row_id', '=', $user->row_id)
                        -> select()
                        -> get();

                    if(count($sessionList) > 0)
                    {
                        $old_token_valid = $sessionList[0]->token_valid_date;
                        $old_token = $sessionList[0]->token;
                        if($nowTimestamp <= $old_token_valid && $old_token_valid - $nowTimestamp >= (60 * 60)) {
                            $token = $old_token;
                            $token_valid = $old_token_valid;
                        } else {
                            \DB::table("qp_session")
                                -> where('user_row_id', '=', $user->row_id)
                                -> where('uuid', '=', $uuid)
                                -> update([
                                    'token'=>$token,
                                    'token_valid_date'=>$token_valid,
                                    'updated_at'=>$now,
                                    'updated_user'=>$user->row_id,
                                ]);
                        }
                    }
                    else
                    {
                        \DB::table("qp_session")
                            -> insert([
                                'user_row_id'=>$user->row_id,
                                'uuid'=>$uuid,
                                'token'=>$token,
                                'token_valid_date'=>$token_valid,//'token_valid_date'=>date('Y-m-d H:i:s',time()),
                                'created_user'=>$user->row_id,
                                'created_at'=>$now,
                            ]);
                    }
                }
                catch (Exception $e)
                {
                    $message = trans('messages.MSG_CALL_SERVICE_ERROR');
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_999999_unknownError
                        .'&message='
                        .$message);
                    $status_code = ResultCode::_999999_unknownError;
                    $result = ['result_code'=>$status_code,
                        'message'=>$message,
                        'token_valid'=>$token_valid,
                        'content'=>array("redirect_uri"=>$finalUrl)];
                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }

                $appHeaderList = \DB::table("qp_app_head")
                    ->join("qp_project","qp_app_head.project_row_id",  "=", "qp_project.row_id")
                    ->whereNotNull('qp_app_head.security_updated_at')
                    ->select('qp_project.app_key', 'qp_app_head.security_updated_at')->get();
                $security_update_list = array();
                $temp = 5184000;//两个月 60 * 60 * 24 * 30 * 2 = 5184000;
                foreach ($appHeaderList as $item) {
                    if(time() -  $item->security_updated_at < $temp) {
                        $sItem = array('app_key'=>$item->app_key,
                            'security_updated_at'=>$item->security_updated_at
                        );
                        array_push($security_update_list, $sItem);
                    }
                }

                $userInfo = CommonUtil::getUserInfoByUUID($uuid);

                $finalUrl = urlencode($redirect_uri.'?token='
                    .$token
                    .'&token_valid='
                    .$token_valid);
                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_LOGIN_SUCCESS"),
                    'token_valid'=>$token_valid,
                    'content'=>array("uuid" => $uuid,
                        "redirect_uri"=>$finalUrl,
                        "token"=>$token,
                        "loginid"=>$userInfo->login_id,
                        "emp_no"=>$userInfo->emp_no,
                        "domain"=>$userInfo->user_domain,
                        "site_code"=>$userInfo->site_code,
                        "checksum"=>md5($password),
                        'security_update_list' => $security_update_list)
                ];

                CommonUtil::logApi($user->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        }
        $message = CommonUtil::getMessageContentByCode($verifyResult["code"]);
        $finalUrl = urlencode($redirect_uri.'?result_code='
            .$verifyResult["code"]
            .'&message='
            .$message);
        $result = ['result_code'=>$verifyResult["code"],
            'message'=>$message,
            'content'=>array("redirect_uri"=>$finalUrl)];
        CommonUtil::logApi("", $ACTION,
            response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public function logout()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'logout';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('domain', $input) || !array_key_exists('loginid', $input))
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        $uuid = $input["uuid"];
        $domain = $input['domain'];
        $loginid = $input['loginid'];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $verifyResult = $Verify->verifyUserByUserID4Logout($loginid, $domain);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $user = CommonUtil::getUserInfoByUserID4Logout($loginid, $domain);
                //用户没找到则直接return
                if (is_null($user)){
                    $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>trans("messages.MSG_LOGOUT_SUCCESS"),
                        'content'=>"[".$domain."]".$loginid."not found"
                    ];
                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }
                //Check uuid exist
                //Check user
                $uuidList = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    //-> where('status', '=', 'A')
                    -> select('row_id','uuid', 'user_row_id')->get();
                $uuidInDB = null;
                if(count($uuidList) < 1)
                {
                    $result = ['result_code'=>ResultCode::_000905_deviceNotRegistered,
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000905_deviceNotRegistered),
                        'content'=>''];
                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }
                else
                {
                    $uuidInDB = $uuidList[0];
                    if($user->row_id != $uuidInDB->user_row_id)
                    {
                        $result = ['result_code'=>ResultCode::_000904_loginUserNotMathRegistered,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000904_loginUserNotMathRegistered),
                            'content'=>''];
                        CommonUtil::logApi($user->row_id, $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                }

                try
                {
                    \DB::table("qp_session")-> where('uuid', "=", $uuid)->delete();
                }
                catch (Exception $e)
                {
                    $result = ['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>trans('messages.MSG_CALL_SERVICE_ERROR'),
                        'content'=>''
                    ];

                    CommonUtil::logApi($user->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);

                    return response()->json($result);
                }

                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_LOGOUT_SUCCESS"),
                    'content'=>array("uuid" => $uuid)
                ];

                CommonUtil::logApi($user->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        }

        $result = ['result_code'=>$verifyResult["code"],
            'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
            'content'=>''];
        CommonUtil::logApi("", $ACTION,
            response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public function checkAppVersion()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyCustom(false);

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'checkAppVersion';

        //通用api參數判斷
        if(!array_key_exists('package_name', $input) || !array_key_exists('device_type', $input) || !array_key_exists('version_code', $input)
        || trim($input["package_name"]) == "" || trim($input['device_type']) == "" || trim($input['version_code']) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $package_name = $input["package_name"];
        $device_type = $input['device_type'];
        $version_code = $input['version_code'];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $appRowIdList = \DB::table("qp_app_head")
                -> where('package_name', "=", $package_name)
                -> select('row_id')->get();
            if(count($appRowIdList) < 1) {
                $result = ['result_code'=>ResultCode::_000915_packageNotExist,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000915_packageNotExist),
                    'content'=>''];

                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
            $app_row_id = $appRowIdList[0]->row_id;

            $allVersionList = \DB::table("qp_app_version")
                -> where('app_row_id', "=", $app_row_id)
                -> where('device_type', '=', $device_type)
                -> select('version_code', 'url')->get();
            if(count($allVersionList) < 1)
            {
                $result = ['result_code'=>ResultCode::_999015_haveNoAppVersion,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999015_haveNoAppVersion),
                    'content'=>''];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }

            $versionList = \DB::table("qp_app_version")
                -> where('app_row_id', "=", $app_row_id)
                -> where('device_type', '=', $device_type)
                -> where('status', '=', 'ready')
                -> select('version_code', 'url')->get();

            if(count($versionList) < 1)
            {
                $result = ['result_code'=>ResultCode::_999012_appOffTheShelf,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999012_appOffTheShelf),
                    'content'=>''];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }

            if(count($versionList) > 1)
            {
                $result = ['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>trans('messages.MSG_CALL_SERVICE_ERROR'),
                    'content'=>''];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }

            $versionLine = $versionList[0];
            if($versionLine->version_code <= $version_code)
            {
                $result = ['result_code'=>ResultCode::_000913_NotNeedUpdate,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000913_NotNeedUpdate),
                    'content'=>''];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
            else
            {
                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_NEED_TO_UPDATE"),
                    'content'=>array("version_code"=>$versionLine->version_code,
                        'download_url'=>FilePath::getApkDownloadUrl($app_row_id, $device_type, $versionLine->version_code, $versionLine->url,true))];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        }
        else
        {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }

    public function getAppList()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'getAppList';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $message = CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError);
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> $message];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> $message];
                } else if($userStatus == 2) {
                    $message = CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight);
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> $message];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {

                $registerInfo = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    -> where('status', '=', 'A')
                    -> select('uuid', 'device_type')->get();
                $device_type = $registerInfo[0]->device_type;

//                $companyAppList = \DB::table('qp_app_head')
//                    -> where('company_label', 'like',  $userInfo->company) -> select() ->get();
                $companyAppList = DB::select("select * from qp_app_head where company_label like '%" . $userInfo->company . "%'");

                $sql = "";
                $appDataList = array();
                if(count($companyAppList) > 0) {
                    $companyAppIdStr = "";
                    foreach ($companyAppList as $companyApp) {
                        $companyAppIdStr = $companyAppIdStr.$companyApp->row_id.',';
                    }
                    $companyAppIdStr = substr($companyAppIdStr, 0, strlen($companyAppIdStr) - 1);
                    $companyAppIdStr = rtrim($companyAppIdStr, ',');
                    $companyAppIdStr = ltrim($companyAppIdStr, ',');
                    $sql = "select distinct h.row_id as app_id, p.project_code as app_code, h.package_name, c.row_id as category_id, c.app_category, lan.lang_code, v.version_code as version, v.version_name, h.security_level, h.avg_score, us.score as user_score, h.sequence, v.url, h.icon_url, v.external_app, v.size from qp_app_head h left join qp_app_line l on l.app_row_id = h.row_id left join qp_user_score us on us.app_head_row_id = h.row_id and us.user_row_id = "
                        . $userInfo->row_id
                        . " left join qp_project p on h.project_row_id = p.row_id left join qp_language lan on h.default_lang_row_id = lan.row_id left join qp_app_category c on h.app_category_row_id = c.row_id left join qp_app_version v on v.app_row_id = h.row_id and v.device_type = '"
                        . $device_type
                        ."' and v.status = 'ready' where h.row_id in (select row_id from qp_app_head where row_id in ( select app_row_id from qp_role_app where role_row_id in ( select role_row_id from qp_user_role where user_row_id = "
                        . $userInfo->row_id
                        . " )) union  select row_id from qp_app_head where row_id in ( select app_row_id from qp_user_app where user_row_id = "
                        . $userInfo->row_id
                        . ") union select row_id from qp_app_head where row_id in ("
                        . $companyAppIdStr
                        . ")) and version_code is not null order by h.sequence desc, h.created_at desc";
                    //return response()->json(['sql'=>$sql]);
                    $appDataList = DB::select($sql);
                } else {
                    $sql = <<<SQL
select distinct h.row_id as app_id, p.project_code as app_code,
h.package_name, c.row_id as category_id, c.app_category, lan.lang_code,
v.version_code as version, v.version_name,
h.security_level,h.avg_score, us.score as user_score,
h.sequence, v.url, h.icon_url, v.external_app, v.size
from qp_app_head h left join qp_app_line l on l.app_row_id = h.row_id
left join qp_user_score us on us.app_head_row_id = h.row_id and us.user_row_id = :id3
left join qp_project p on h.project_row_id = p.row_id
left join qp_language lan on h.default_lang_row_id = lan.row_id
left join qp_app_category c on h.app_category_row_id = c.row_id
left join qp_app_version v on v.app_row_id = h.row_id and v.device_type = :device_type and v.status = 'ready'
where h.row_id in
(select row_id from qp_app_head where row_id in (
	select app_row_id from qp_role_app where role_row_id in (
		select role_row_id from qp_user_role where user_row_id = :id1))
union 
select row_id from qp_app_head where row_id in (
	select app_row_id from qp_user_app where user_row_id = :id2))
	
and version_code is not null
order by h.sequence desc, h.created_at desc
SQL;


                    $appDataList = DB::select($sql, [':id1'=>$userInfo->row_id,
                            ':id2'=>$userInfo->row_id,
                            ':device_type'=>$device_type,
                            ':id3'=>$userInfo->row_id]
                    );
                }



                //test return response()->json(['result_code'=>count($appDataList),'type'=>$device_type, 'id'=>$userInfo->row_id]);

                $app_list = array();
                $categoryIdListStr = "";
                $appIdListStr = "";
                foreach ($appDataList as $appData)
                {
                    $appUrl = $appData->url;
                    $iconUrl = FilePath::getIconUrl($appData->app_id, $appData->icon_url);
                    if($appData->external_app == 0) {
                        $appUrl = FilePath::getApkDownloadUrl($appData->app_id, $device_type, $appData->version, $appData->url);
                    }
                    $app = array('app_id'=>$appData->app_id,
                        'app_code'=>$appData->app_code,
                        'package_name'=>$appData->package_name,
                        'app_category_id'=>$appData->category_id,
                        'default_lang'=>$appData->lang_code,
                        'app_version'=>$appData->version,
                        'app_version_name'=>$appData->version_name,
                        'security_level'=>$appData->security_level,
                        'avg_score'=>$appData->avg_score,
                        'user_score'=>$appData->user_score,
                        'sequence'=>$appData->sequence,
                        'url'=>$appUrl,
                        'icon_url'=>$iconUrl,
                        'size'=>$appData->size
                    );
                    if($appData->category_id != null && trim($appData->category_id) != "") {
                        $categoryIdListStr = $categoryIdListStr.($appData->category_id).",";
                    }
                    $appIdListStr = $appIdListStr.($appData->app_id).",";
                    array_push($app_list, $app);
                }

                $app_category_list = array();
                $categoryIdListStr = substr($categoryIdListStr, 0, strlen($categoryIdListStr) - 1);
                $categoryIdListStr = rtrim($categoryIdListStr, ',');
                $categoryIdListStr = ltrim($categoryIdListStr, ',');
//                $sql = <<<SQL
//                select row_id as category_id, app_category, sequence
//                from qp_app_category
//                where row_id in (:idList)
//SQL;
//                $categoryDataList = DB::select($sql, [':idList'=>$categoryIdListStr]);

                $categoryDataList = array();
                if(strlen($categoryIdListStr) > 0) {
                    $sql = 'select row_id as category_id, app_category, sequence from qp_app_category where row_id in ( ' . $categoryIdListStr . ') order by sequence desc, created_at desc';
                    $categoryDataList = DB::select($sql);
                }

                foreach ($categoryDataList as $categoryData)
                {
                    $category = array('category_id'=>$categoryData->category_id,
                        'app_category'=>$categoryData->app_category,
                        'sequence'=>$categoryData->sequence
                    );
                    array_push($app_category_list, $category);
                }

                $multi_lang = array();
                $appIdListStr = substr($appIdListStr, 0, strlen($appIdListStr) - 1);
                $appIdListStr = rtrim($appIdListStr, ',');
                $appIdListStr = ltrim($appIdListStr, ',');
                $langDataList = array();
                if(strlen($appIdListStr) > 0) {
                    $sql = 'select line.app_row_id,lang.row_id as lang_id,lang.lang_code as lang, line.app_name, line.app_summary, line.app_description ,proj.project_code from qp_app_line line, qp_language lang, qp_app_head head, qp_project proj where line.lang_row_id = lang.row_id and line.app_row_id = head.row_id and head.project_row_id = proj.row_id and line.app_row_id in ('
                        .$appIdListStr
                        .') order by app_row_id, lang_id';
                    $langDataList = DB::select($sql);
                }
                foreach ($langDataList as $langData)
                {

                    $appId = $langData->app_row_id;
                    $langId = $langData->lang_id;

                    $picList = \DB::table("qp_app_pic")->where('app_row_id', '=', $appId)
                        ->where('lang_row_id', '=', $langId)
                        ->where('pic_type', '=', $device_type.'_screenshot')->select('pic_type', 'pic_url', 'sequence_by_type')->get();
                    foreach ($picList as $picItem) {
                        $picItem->pic_url = FilePath::getScreenShotUrl($appId, $langId , $device_type, $picItem->pic_url);
                    }

                    $lang = array('lang'=>$langData->lang,
                        'app_name'=>$langData->app_name,
                        'app_summary'=>$langData->app_summary,
                        'app_description'=>$langData->app_description,
                        'project_code'=>$langData->project_code,
                        'pic_list'=>$picList
                    );

                    array_push($multi_lang, $lang);
                }


                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array(
                        'app_category_list'=>$app_category_list,
                        'app_list'=>$app_list,
                        'multi_lang'=>$multi_lang)
                ];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
            else
            {
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                    'content'=>''];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        }
        else
        {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }

    public function getSecurityList()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyCustom(true);

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'getSecurityList';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('app_key', $input))
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $token = $request->header('token');
        $uuid = $input['uuid'];
        $appKey = $input['app_key'];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }


        if(!Verify::chkAppKeyExist($appKey)) {
            $result = ['result_code'=>ResultCode::_999010_appKeyIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect),
                'content'=>''];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }


        if ($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {

            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {
                $app_row_id = \DB::table("qp_app_head")
                    -> join("qp_project","qp_app_head.project_row_id",  "=", "qp_project.row_id")
                    -> where('qp_project.app_key', "=", $appKey)
                    -> select('qp_app_head.row_id')
                    -> lists('qp_app_head.row_id');

                $whitelist = \DB::table("qp_white_list")
//                    -> whereNull('deleted_at')
		    -> where('deleted_at', "=", '0000-00-00 00:00:00')
                    -> where('app_row_id', "=", $app_row_id)
                    -> select('allow_url')
                    -> get();

                $level = \DB::table("qp_app_head")
                    -> join("qp_project","project_row_id",  "=", "qp_project.row_id")
                    -> where('qp_project.app_key', "=", $appKey)
                    -> select('security_level')
                    -> lists('security_level');


                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>json_encode($whitelist),
                    'security_level'=>$level[0],
                ];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            } else {
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

    }

    public function getMessageList()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'getMessageList';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input))
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $userId = $userInfo->row_id;
            $company = $userInfo->company;

            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {
                $last_message_time = 0;
                $registerInfoList = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    -> where('status', '=', 'A')
                    -> select('last_message_time')->get();
                if(count($registerInfoList) > 0) {
                    $last_message_time = $registerInfoList[0]->last_message_time;
                }

                $date_from = $last_message_time;//$verifyResult["last_message_time"];
                if($date_from == null) {
                    $date_from = 0;
                }
                $date_to = time();
                $useUserDate = false;

                $count_from = -1;
                $count_to = -1;
                $overwrite_timestamp = 0;
                if(array_key_exists('date_from', $input) && trim($input['date_from']) != "") {
                    if(!array_key_exists('date_to', $input) || trim($input['date_to']) == "") {
                        $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                            'content'=>''];
                        CommonUtil::logApi($userInfo->row_id, $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                }
                if(array_key_exists('date_to', $input) && trim($input['date_to']) != "") {
                    if(!array_key_exists('date_from', $input) || trim($input['date_from']) == "") {
                        $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                            'content'=>''];
                        CommonUtil::logApi($userInfo->row_id, $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                }
                if(array_key_exists('count_from', $input) && trim($input['count_from']) != "") {
                    if (!array_key_exists('count_to', $input) || trim($input['count_to']) == "") {
                        $result = ['result_code' => ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message' => CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                            'content' => ''];
                        CommonUtil::logApi($userInfo->row_id, $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                }
                if(array_key_exists('count_to', $input) && trim($input['count_to']) != "") {
                    if (!array_key_exists('count_from', $input) || trim($input['count_from']) == "") {
                        $result = ['result_code' => ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message' => CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                            'content' => ''];
                        CommonUtil::logApi($userInfo->row_id, $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                }

                if(array_key_exists('date_from', $input) && trim($input['date_from']) != "") {
                    $useUserDate = true;
                    if(array_key_exists('overwrite_timestamp', $input)) {
                        $overwrite_timestamp = trim($input['overwrite_timestamp']);
                    }
                    $date_from = $input['date_from'];
                    $date_to = $input['date_to'];
                    if($date_to < $date_from) {
                        $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                            'content'=>''];
                        CommonUtil::logApi($userInfo->row_id, $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }

                    if(array_key_exists('count_from', $input) && trim($input['count_from']) != "") {
                        if(!array_key_exists('count_to', $input) || trim($input['count_to']) == "") {
                            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                                'content'=>''];
                            CommonUtil::logApi($userInfo->row_id, $ACTION,
                                response()->json(apache_response_headers()), $result);
                            return response()->json($result);
                        }

                        $count_from = $input['count_from'];
                        $count_to = $input['count_to'];
                        if($count_from < 1 || $count_to < 1 || $count_to < $count_from) {
                            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                                'content'=>''];
                            CommonUtil::logApi($userInfo->row_id, $ACTION,
                                response()->json(apache_response_headers()), $result);
                            return response()->json($result);
                        }
                    }
                }


                $sql = <<<SQL
select ms.row_id as message_send_row_id,
		m.row_id as message_row_id,        
		m.message_title,
		m.message_type,
		m.message_text,
		m.message_html,
		m.message_url,
		m.message_source,
		u.login_id as source_user,
		u2.login_id as create_user,
		ms.created_at as create_time,
		ms.read,
		ms.read_time
from qp_message m
, (select distinct qp_message_send.* , if(um.read_time > 0, 'Y', 'N') as 'read', um.read_time
     from qp_message_send 
left join qp_user_message um on um.message_send_row_id = qp_message_send.row_id
left join qp_message on qp_message.row_id = qp_message_send.message_row_id
where um.user_row_id = $userId
and um.uuid = '$uuid'
and qp_message.message_type = 'event'
and qp_message.visible = 'Y'
and UNIX_TIMESTAMP(qp_message_send.created_at) >= $date_from
and UNIX_TIMESTAMP(qp_message_send.created_at) <= $date_to
and qp_message_send.row_id in (
select message_send_row_id from qp_user_message 
where user_row_id = $userId
and uuid = '$uuid'
-- and deleted_at <>'0000-00-00 00:00:00'
and deleted_at = 0
)
union
select distinct qp_message_send.* , 'N' as 'read', '' as 'read_time'
     from qp_message_send 
left join qp_message on qp_message.row_id = qp_message_send.message_row_id
where qp_message.message_type = 'news'
and qp_message.visible = 'Y'
and UNIX_TIMESTAMP(qp_message_send.created_at) >= $date_from
and UNIX_TIMESTAMP(qp_message_send.created_at) <= $date_to
and qp_message_send.company_label like '%$company%'
) ms,
qp_user u,qp_user u2
where m.row_id = ms.message_row_id
and ms.source_user_row_id = u.row_id
and m.created_user = u2.row_id
order by ms.created_at desc
SQL;

                $r = DB::select($sql);

                if($count_from >= 1) {
                    $r = array_slice($r, $count_from - 1, $count_to - $count_from + 1);
                }

                if(!$useUserDate || ($useUserDate && $overwrite_timestamp == "1") ) {
                    $now = date('Y-m-d H:i:s',time());
                    \DB::table("qp_register")
                        -> where('user_row_id', '=', $userId)
                        -> where('uuid', '=', $uuid)
                        -> where('status', '=', 'A')
                        -> update(['last_message_time'=>$date_to,
                        'updated_at'=>$now,
                        'updated_user'=>$userId]);
                }

                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array('message_count'=> count($r),
                        'message_list'=>$r)
                ];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            } else {
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }

    public function getMessageDetail()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'getMessageDetail';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == ""
            || !array_key_exists('message_send_row_id', $input) || trim($input["message_send_row_id"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $message_send_row_id = $input["message_send_row_id"];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $userId = $userInfo->row_id;
            $company = $userInfo->company;
            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $sql = 'select * from qp_message where visible ="Y" and row_id = (select message_row_id from qp_message_send where row_id = '.$message_send_row_id.')';
                $msgList = DB::select($sql, []);
                if(count($msgList) == 0) {
                    $result = ['result_code'=>ResultCode::_000910_messageNotExist,
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000910_messageNotExist),
                        'token_valid'=>$verifyResult["token_valid_date"],
                        'content'=>''
                    ];
                    CommonUtil::logApi($userInfo->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }
                $msg = $msgList[0];
                $sql = <<<SQL
select m.row_id as message_row_id,
        ms.row_id as message_send_row_id,
		   m.message_title,
           m.template_id,
			 m.message_type, m.message_text,
			 m.message_html, m.message_url,
			 m.message_source,
			 u2.login_id as create_user,
			 u1.login_id as source_user,
			 ms.created_at as create_time
from qp_message m, 
		 qp_message_send ms,
		 qp_user u1,
	   qp_user u2,
		 qp_user_message um
where m.row_id = ms.message_row_id
and m.visible = 'Y'
and ms.row_id = $message_send_row_id
and ms.source_user_row_id = u1.row_id
and m.created_user = u2.row_id
and um.message_send_row_id = ms.row_id
and um.deleted_at = '0000-00-00 00:00:00'
and um.user_row_id = $userId
and um.uuid = '$uuid'
SQL;
                if($msg->message_type == 'news') {

                    $sql = <<<SQL
                    select distinct m.row_id as message_row_id,
        ms.row_id as message_send_row_id,
		   m.message_title,
           m.template_id,
			 m.message_type, m.message_text,
			 m.message_html, m.message_url,
			 m.message_source,
			 u2.login_id as create_user,
			 u1.login_id as source_user,
			 ms.created_at as create_time
from qp_message m, 
		 qp_message_send ms,
		 qp_user u1,
	   qp_user u2
where m.row_id = ms.message_row_id
and m.visible = 'Y'
and ms.row_id = $message_send_row_id
and ms.source_user_row_id = u1.row_id
and m.created_user = u2.row_id
and ms.company_label like '%$company%'
SQL;
                }

                $msgDetailList = DB::select($sql, []);
                if(count($msgDetailList) > 0) {
                    $msgDetail = $msgDetailList[0];
                    $msgDetail->read = "N";
                    $msgDetail->read_time = "";
                    if($msgDetail->message_type == "event") {

                        $sql = <<<SQL
select if(read_time > 0, 'Y', 'N') as 'read', 
	  		read_time 
  from qp_user_message
where message_send_row_id = :msgSendId
  and user_row_id = :userId
  and uuid = '$uuid'
SQL;
                        $userReadList = DB::select($sql, [':msgSendId'=>$message_send_row_id, ':userId'=>$userId]);
                        if(count($userReadList) > 0) {
                            $userRead = $userReadList[0];
                            $msgDetail->read = $userRead->read;
                            $msgDetail->read_time = $userRead->read_time;
                        }
                    }
                    $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                        'token_valid'=>$verifyResult["token_valid_date"],
                        'content'=>$msgDetail
                    ];
                    CommonUtil::logApi($userInfo->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                } else /*no data need to show 000910 {
                    $result = response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>'Call Service Successed',
                        'token_valid'=>$verifyResult["token_valid_date"],
                        'content'=>$msgDetailList
                    ]);*/
			 { //no data need to show 000910
                    $result = ['result_code'=>ResultCode::_000910_messageNotExist,
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000910_messageNotExist),
                        'token_valid'=>$verifyResult["token_valid_date"],
                        'content'=>''
                    ];
                    CommonUtil::logApi($userInfo->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }

            } else {
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }

    public function updateMessage()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'updateMessage';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('message_send_row_id', $input)
            || !array_key_exists('message_type', $input) || !array_key_exists('status', $input)
        || trim($input["uuid"]) == "" || trim($input["message_send_row_id"]) == ""
            || trim($input["message_type"]) == "" || trim($input["status"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $message_send_row_id_str = $input["message_send_row_id"];
        $message_type = $input["message_type"];
        $status = $input["status"];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $updateAll = false;
        $messageSendIdList = explode(',', $message_send_row_id_str);
        if(strtolower($message_send_row_id_str) == "all") {
            $updateAll = true;
        } else {
            foreach ($messageSendIdList as $message_send_row_id) {
                $msgSendList = \DB::table("qp_message_send")
                    -> where('row_id', "=", $message_send_row_id)
                    -> select('message_row_id')->get();
                if(count($msgSendList) < 1 ) {
                    $result = ['result_code'=>ResultCode::_000910_messageNotExist,
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000910_messageNotExist),
                        'content'=>''];
                    CommonUtil::logApi($userInfo->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }
                $message_row_id = $msgSendList[0]->message_row_id;
                $msgList = \DB::table("qp_message")
                    -> where('row_id', "=", $message_row_id)
                    -> select('row_id')->get();
                if(count($msgList) < 1 ) {
                    $result = ['result_code'=>ResultCode::_000910_messageNotExist,
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000910_messageNotExist),
                        'content'=>''];
                    CommonUtil::logApi($userInfo->row_id, $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }
            }
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);

            $nowTime = time();
            $now = date('Y-m-d H:i:s',$nowTime);
            $user = CommonUtil::getUserInfoByUUID($uuid);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                if($status == 'read' && $message_type == "event") {
                    if(!$updateAll) {
                        foreach ($messageSendIdList as $message_send_row_id) {
                            \DB::table("qp_user_message")
                                -> where('user_row_id', '=', $userInfo->row_id)
                                -> where('message_send_row_id', '=', $message_send_row_id)
                                -> where('uuid', '=', $uuid)
                                -> update(
                                    ['read_time'=>$nowTime,
                                        'updated_at'=>$now,
                                        'updated_user'=>$user->row_id]);
                        }
                    } else {
                        $userMessageIdList = \DB::table("qp_user_message")
                            ->leftJoin("qp_message_send","qp_message_send.row_id","=","qp_user_message.message_send_row_id")
                            ->leftJoin("qp_message","qp_message.row_id","=","qp_message_send.message_row_id")
                            -> where('qp_user_message.user_row_id', '=', $userInfo->row_id)
                            -> where('qp_user_message.uuid', '=', $uuid)
                            -> where('qp_message.message_type', '=', $message_type)
                            -> select('qp_user_message.row_id') -> get();
                        foreach ($userMessageIdList as $rowId) {
                            \DB::table("qp_user_message")
                                -> where('row_id', '=', $rowId)
                                -> update(
                                    ['read_time'=>$nowTime,
                                        'updated_at'=>$now,
                                        'updated_user'=>$user->row_id]);
                        }
                    }
                } else if($status == 'delete' && $message_type == "event") {
                    if(!$updateAll) {
                        foreach ($messageSendIdList as $message_send_row_id) {
                            \DB::table("qp_user_message")
                                -> where('user_row_id', '=', $userInfo->row_id)
                                -> where('uuid', '=', $uuid)
                                -> where('message_send_row_id', '=', $message_send_row_id)
                                -> update(
                                    ['deleted_at'=>$now,
                                        'updated_at'=>$now,
                                        'updated_user'=>$user->row_id]);
                        }
                    } else {
                        $userMessageIdList = \DB::table("qp_user_message")
                            ->leftJoin("qp_message_send","qp_message_send.row_id","=","qp_user_message.message_send_row_id")
                            ->leftJoin("qp_message","qp_message.row_id","=","qp_message_send.message_row_id")
                            -> where('qp_user_message.user_row_id', '=', $userInfo->row_id)
                            -> where('qp_user_message.uuid', '=', $uuid)
                            -> where('qp_message.message_type', '=', $message_type)
                            -> select('qp_user_message.row_id') -> get();
                        foreach ($userMessageIdList as $rowId) {
                            \DB::table("qp_user_message")
                                -> where('row_id', '=', $rowId)
                                -> update(
                                    ['deleted_at'=>$now,
                                        'updated_at'=>$now,
                                        'updated_user'=>$user->row_id]);
                        }
                    }
                }  

                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array('message_send_row_id' => $message_send_row_id_str)
                ];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            } else {
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }

    public function sendPushToken()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        $pushToken = $request->header('push-token');

        //For Log
        $ACTION = 'sendPushToken';

        //通用api參數判斷
        if($pushToken == null || !array_key_exists('uuid', $input) || !array_key_exists('app_key', $input)
            || !array_key_exists('device_type', $input) || trim($input["uuid"]) == "" || trim($input["app_key"]) == "" || trim($input["device_type"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $uuid = $input["uuid"];
        $appKey = $input["app_key"];
        $deviceType = $input["device_type"];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if(!$Verify->chkAppKeyExist($appKey)) {
            $result = ['result_code'=>ResultCode::_000909_appKeyNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000909_appKeyNotExist),
                'content'=>''];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {

            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> where('status', '=', 'A')
                -> where('device_type', "=", $deviceType)
                -> select('uuid', 'row_id')->get();
            if(count($uuidList) < 1)
            {
                $result = ['result_code'=>ResultCode::_000905_deviceNotRegistered,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000905_deviceNotRegistered),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }

            $registerId = $uuidList[0]->row_id;

            $projectId = \DB::table("qp_project")
                -> where('app_key', "=", $appKey)
                -> select('row_id')->lists('row_id')[0];

            $existInfoList = \DB::table("qp_push_token")
                -> where('push_token', "=", $pushToken)
                -> select()->get();
            if(count($existInfoList) > 1 || (count($existInfoList) == 1 && $existInfoList[0]->register_row_id != $registerId)) {
                $result = ['result_code'=>ResultCode::_999013_pushTokenUsed,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999013_pushTokenUsed),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                \DB::table("qp_register")-> where('row_id', "=", $registerId)->delete();
                return response()->json($result);
            }

            $existPushToken =  \DB::table("qp_push_token")
                    -> where('register_row_id', "=", $registerId)
                    -> where('project_row_id', "=", $projectId)
                    -> where('device_type', "=", $deviceType)
                    -> select('row_id')->get();

            $now = date('Y-m-d H:i:s',time());
            $user = CommonUtil::getUserInfoByUUID($uuid);
            \DB::beginTransaction();
            try {
                if(count($existPushToken) > 0) {
                    \DB::table("qp_push_token")
                        -> where('register_row_id', "=", $registerId)
                        -> where('project_row_id', "=", $projectId)
                        -> where('device_type', "=", $deviceType)
                        ->update([
                            'push_token'=>$pushToken,
                            'updated_at'=>$now,
                            'updated_user'=>$user->row_id,]);
                } else {
                    \DB::table("qp_push_token")->insert([
                        'register_row_id'=>$registerId,
                        'project_row_id'=>$projectId,
                        'push_token'=>$pushToken,
                        'created_user'=>$user->row_id,
                        'created_at'=>$now,
                        'device_type'=>$deviceType]);
                }

                //Register to JPush Tag
                $tag = PushUtil::GetTagByUserInfo($userInfo);
                $pushResult = PushUtil::AddTagsWithJPushWebAPI($pushToken, $tag);
                if(!$pushResult["result"]) {
                    \DB::rollBack();
                    $result = ['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>trans('messages.MSG_ADD_TAG_TO_JPUSH_FAILED'),
                        'content'=>''
                    ];
                    CommonUtil::logApi("", $ACTION,
                        response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }

                \DB::commit();
            } catch (Exception $e) {
                \DB::rollBack();
                $result = ['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>trans('messages.MSG_UNKNOWN_ERROR'),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }

            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'content'=>array('uuid'=>$uuid)
            ];

            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }

    public function renewToken()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'renewToken';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input))
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $token = uniqid();
                $token_valid = time() + (7 * 86400);
                $userInfo = CommonUtil::getUserInfoByUUID($uuid);
                $now = date('Y-m-d H:i:s',time());
                $user = CommonUtil::getUserInfoByUUID($uuid);
                \DB::table("qp_session")
                    -> where('user_row_id', "=", $userInfo->row_id)
                    -> where('uuid', "=", $uuid)
                    -> update(['token'=>$token,
                        'token_valid_date'=>$token_valid,
                        'updated_at'=>$now,
                        'updated_user'=>$user->row_id,]);

                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_RENEW_SUCCESS"),
                    'token_valid'=>$token_valid,
                    'content'=>array("uuid" => $uuid, "token"=>$token)
                ];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            } else {
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                    'content'=>''];
                CommonUtil::logApi($userInfo->row_id, $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi($userInfo->row_id, $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }
    
    public function sendPushMessage()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyCustom(false);

        $input = Input::get();
        $request = \Request::instance();

        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'sendPushMessage';

        //通用api參數判斷
        if(!array_key_exists('app_key', $input) || !array_key_exists('need_push', $input)
        || trim($input["app_key"]) == "" || trim($input["need_push"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        
        $isSchedule = false;
        $push_time_utc = 0;
        if(array_key_exists('push_time_utc', $input))
        {
            $isSchedule = true;
            $push_time_utc = trim($input["push_time_utc"]);
        }

        $app_key = $input["app_key"];
        $need_push = trim(strtoupper($input["need_push"]));
        if($need_push != "Y" && $need_push != "N") {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if(!$Verify->chkAppKeyExist($app_key)) {
            $result = ['result_code'=>ResultCode::_000909_appKeyNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000909_appKeyNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            //$message = file_get_contents('php://input');

            $content = file_get_contents('php://input');//html_entity_decode($request->getContent());
            //$content = iconv('GBK//IGNORE', 'UTF-8', $content);
            $content = CommonUtil::prepareJSON($content);
            if (\Request::isJson($content)) {
                $jsonContent = json_decode($content, true);

                if(!array_key_exists('message_title', $jsonContent) || trim($jsonContent['message_title']) == ""
                || !array_key_exists('template_id', $jsonContent) || trim($jsonContent['template_id']) == ""
                || !array_key_exists('message_type', $jsonContent)
                    || (strtolower($jsonContent['message_type']) != "news" && strtolower($jsonContent['message_type']) != "event")
                || ( (!array_key_exists('message_text', $jsonContent) || trim($jsonContent['message_text']) == "")
                  && (!array_key_exists('message_html', $jsonContent) || trim($jsonContent['message_html']) == "")
                  && (!array_key_exists('message_url', $jsonContent) || trim($jsonContent['message_url']) == "") )
                || !array_key_exists('message_source', $jsonContent) || trim($jsonContent['message_source']) == ""
                || !array_key_exists('source_user_id', $jsonContent) || trim($jsonContent['source_user_id']) == "") {
                    return ['result_code'=>ResultCode::_000918_dataIncomplete,
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                        'content'=>''];
                }
                $need_push_db = 0;
                if($need_push == "Y") {
                    $need_push_db = 1;
                    if(strtolower($jsonContent['message_type']) == "event" &&
                        ( (!array_key_exists('destination_user_id', $jsonContent) || $jsonContent['destination_user_id'] == null)
                            && (!array_key_exists('destination_role_id', $jsonContent) || $jsonContent['destination_role_id'] == null))) {
                        return ['result_code'=>ResultCode::_000918_dataIncomplete,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                            'content'=>''];
                    }

                    if(strtolower($jsonContent['message_type']) == "news" &&
                        (!array_key_exists('destination_user_id', $jsonContent) || $jsonContent['destination_user_id'] == null)) {
                        $result = ['result_code'=>ResultCode::_000918_dataIncomplete,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                            'content'=>''];
                        CommonUtil::logApi("", $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                }

                $sourceUseId = $jsonContent['source_user_id'];

                $userid = explode('\\', $sourceUseId)[1];
                $domain = explode('\\', $sourceUseId)[0];
                $verifyResult = $Verify->verifyUserByUserIDAndDomain($userid, $domain);
                if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                    $sourceUserInfo = CommonUtil::getUserInfoJustByUserIDAndDomain($userid, $domain);

                    $projectInfo = CommonUtil::getProjectInfoAppKey($app_key);
                    if($projectInfo == null) {
                        $result = ['result_code'=>ResultCode::_000909_appKeyNotExist,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000909_appKeyNotExist),
                            'content'=>''];
                        CommonUtil::logApi("", $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }

                    $message_type = strtolower($jsonContent['message_type']);
                    $message_title = CommonUtil::jsUnescape(base64_decode($jsonContent['message_title']));
                    if(mb_strlen($message_title,'utf-8') > 99) {
                        $result = ['result_code'=>ResultCode::_000916_titleLengthTooLong,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000916_titleLengthTooLong),
                            'content'=>''];

                        CommonUtil::logApi("", $ACTION,
                            response()->json(apache_response_headers()), $result);
                        return response()->json($result);
                    }
                    $template_id = $jsonContent['template_id'];
                    $message_text = CommonUtil::jsUnescape(base64_decode($jsonContent['message_text']));
                    $message_html = CommonUtil::jsUnescape(base64_decode($jsonContent['message_html']));
                    $message_url = CommonUtil::jsUnescape(base64_decode($jsonContent['message_url']));
                    $message_source = $jsonContent['message_source'];
                    $now = date('Y-m-d H:i:s',time());

                    if($message_type == "news")
                    {  //News
                        $CompanyList = $jsonContent['destination_user_id'];
                        $companyStr = "";
                        foreach ($CompanyList as $company) {
                            if(!CommonUtil::checkCompanyExist(trim($company))) {
                                $result = ['result_code'=>ResultCode::_999014_companyNotExist,
                                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999014_companyNotExist),
                                    'content'=>''];
                                CommonUtil::logApi("", $ACTION,
                                    response()->json(apache_response_headers()), $result);
                                return response()->json($result);
                            }
                            $companyStr = $companyStr.trim($company).";";
                        }
                        if(count($companyStr) == 0) {
                            $result = ['result_code'=>ResultCode::_000918_dataIncomplete,
                                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                                'content'=>''];
                            CommonUtil::logApi("", $ACTION,
                                response()->json(apache_response_headers()), $result);
                            return response()->json($result);
                        }

                        \DB::beginTransaction();
                        try {
                            $newMessageId = \DB::table("qp_message")
                                -> insertGetId([
                                    'template_id'=>$template_id, 'visible'=>'Y',
                                    'message_type'=>$message_type, 'message_title'=>$message_title,
                                    'message_text'=>$message_text, 'message_html'=>$message_html,
                                    'message_url'=>$message_url, 'message_source'=>$message_source,
                                    'created_user'=>$sourceUserInfo->row_id,
                                    'created_at'=>$now,
                                ]);

                            $newMessageSendId = \DB::table("qp_message_send")
                                -> insertGetId([
                                    'message_row_id'=>$newMessageId,
                                    'source_user_row_id'=>$sourceUserInfo->row_id,
                                    'created_user'=>$sourceUserInfo->row_id,
                                    'created_at'=>$now,
                                    'need_push'=>$need_push_db,
                                    'company_label'=>$companyStr,
                                    'push_flag'=>'0'
                                ]);
                            $countFlag = 0;
                            if($need_push == "Y") {
                                $to = [];
                                foreach ($CompanyList as $company) {
                                    for ($i = 1; $i <= 6; $i++) {
                                        $to[$countFlag] = strtoupper($company).$i;
                                        $countFlag ++;
                                    }
                                }


                                if($isSchedule) {
                                    $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$newMessageSendId, $push_time_utc, $message_title, $to, $newMessageSendId, true);
                                } else {
                                    $result = PushUtil::PushMessageWithJPushWebAPI($message_title, $to, $newMessageSendId, true);
                                }

                                if(!$result["result"]) {
                                    \DB::table("qp_message_send")
                                        -> where(['row_id'=>$newMessageSendId])
                                        -> update([
                                            'jpush_error_code'=>$result["info"],
                                            'updated_user'=>$sourceUserInfo->row_id,
                                            'updated_at'=>$now
                                        ]);
                                    \DB::commit();
                                    $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                        'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                        'content'=>array('jsonContent'=>$countFlag,
                                            'content'=>$content)
                                    ];
                                    CommonUtil::logApi("", $ACTION,
                                        response()->json(apache_response_headers()), $result);
                                    return response()->json($result);
                                }
                            }

                            \DB::commit();
                            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                'content'=>array('jsonContent'=>$countFlag,
                                    'content'=>$content)//json_encode($jsonContent)
                            ];
                            CommonUtil::logApi("", $ACTION,
                                response()->json(apache_response_headers()), $result);
                            return response()->json($result);
                        } catch (Exception $e) {
                            \DB::rollBack();
                            $result = ['result_code'=>ResultCode::_999999_unknownError,
                                'message'=>trans('messages.MSG_UNKNOWN_ERROR'),
                                'content'=>''];
                            CommonUtil::logApi("", $ACTION,
                                response()->json(apache_response_headers()), $result);
                            return response()->json($result);
                        }
                    }
                    else {  //Event
                        $destinationUserIdList = $jsonContent['destination_user_id'];
                        $destinationUserInfoList = array();
                        foreach ($destinationUserIdList as $destinationUserId)
                        {
                            $userid = explode('\\', $destinationUserId)[1];
                            $domain = explode('\\', $destinationUserId)[0];
                            $verifyResult = $Verify->verifyUserByUserIDAndDomain($userid, $domain);

                            if($verifyResult["code"] == ResultCode::_000901_userNotExistError) {
                                $result = ['result_code'=>ResultCode::_000912_userReceivePushMessageNotExist,
                                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000912_userReceivePushMessageNotExist),
                                    'content'=>''];
                                CommonUtil::logApi("", $ACTION,
                                    response()->json(apache_response_headers()), $result);
                                return response()->json($result);
                            }

                            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful) {
                                $result = ['result_code'=>$verifyResult["code"],
                                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                                    'content'=>''];
                                CommonUtil::logApi("", $ACTION,
                                    response()->json(apache_response_headers()), $result);
                                return response()->json($result);
                            }

                            $destinationUserInfo = CommonUtil::getUserInfoJustByUserIDAndDomain($userid, $domain);

                            array_push($destinationUserInfoList, $destinationUserInfo);
                        }

                        $destinationRoleIdList = $jsonContent['destination_role_id'];
                        $destinationRoleInfoList = array();
                        foreach ($destinationRoleIdList as $destinationRoleId)
                        {
                            $roleDesc = explode('/', $destinationRoleId)[1];
                            $company = explode('/', $destinationRoleId)[0];

                            $destinationRoleInfo = CommonUtil::getRoleInfo($roleDesc, $company);
                            if($destinationRoleInfo == null) {
                                $result = ['result_code'=>ResultCode::_000917_roleNotExist,
                                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000917_roleNotExist),
                                    'content'=>''];

                                CommonUtil::logApi("", $ACTION,
                                    response()->json(apache_response_headers()), $result);
                                return response()->json($result);
                            }

                            array_push($destinationRoleInfoList, $destinationRoleInfo);
                        }

                        \DB::beginTransaction();
                        try {
                            $newMessageId = \DB::table("qp_message")
                                -> insertGetId([
                                    'template_id'=>$template_id, 'visible'=>'Y',
                                    'message_type'=>$message_type, 'message_title'=>$message_title,
                                    'message_text'=>$message_text, 'message_html'=>$message_html,
                                    'message_url'=>$message_url, 'message_source'=>$message_source,
                                    'created_user'=>$sourceUserInfo->row_id,
                                    'created_at'=>$now,
                                ]);

                            $newMessageSendId = \DB::table("qp_message_send")
                                -> insertGetId([
                                    'message_row_id'=>$newMessageId,
                                    'source_user_row_id'=>$sourceUserInfo->row_id,
                                    'created_user'=>$sourceUserInfo->row_id,
                                    'created_at'=>$now,
                                    'need_push'=>$need_push_db,
                                    'push_flag'=>'0'
                                ]);

                            $hasSentUserIdList = array();
                            $real_push_user_list = array();

                            foreach ($destinationUserInfoList as $destinationUserInfo) {
                                if(in_array($destinationUserInfo->row_id, $hasSentUserIdList)) {
                                    continue;
                                }
                                if(count($destinationUserInfo->uuidList) == 0) {
                                    /*
                                     * bug 14023 2017.3.27
                                    \DB::rollBack();
                                    $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                                        'content'=>''];
                                    CommonUtil::logApi("", $ACTION,
                                        response()->json(apache_response_headers()), $result);
                                    return response()->json($result);
                                    */
                                    //该用户如无设备，先以user_row_id代替
                                    $destinationUserInfo->uuidList = [
                                        ["uuid"=>$destinationUserInfo->row_id]
                                    ];
                                }
                                foreach ($destinationUserInfo->uuidList as $uuid) {
                                    \DB::table("qp_user_message")
                                        -> insertGetId([
                                            'project_row_id'=>$projectInfo->row_id,
                                            'user_row_id'=>$destinationUserInfo->row_id,
                                            'uuid'=> is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                            'message_send_row_id'=>$newMessageSendId,
                                            'created_user'=>$sourceUserInfo->row_id,
                                            'created_at'=>$now
                                        ]);
                                }

                                $hasSentUserIdList[] = $destinationUserInfo->row_id;
                                $real_push_user_list[] = $destinationUserInfo->row_id;
                            }

                            foreach ($destinationRoleInfoList as $destinationRoleInfo) {
                                \DB::table("qp_role_message")
                                    -> insertGetId([
                                        'project_row_id'=>$projectInfo->row_id, 'role_row_id'=>$destinationRoleInfo->row_id,
                                        'message_send_row_id'=>$newMessageSendId,
                                        'created_user'=>$sourceUserInfo->row_id,
                                        'created_at'=>$now
                                    ]);

                                $sql = 'select * from qp_user where row_id in (select user_row_id from qp_user_role where role_row_id = '.$destinationRoleInfo->row_id.' )';
                                $userInRoleList = DB::select($sql, []);
                                foreach ($userInRoleList as $userRoleInfo) {
                                    $userRowId = $userRoleInfo->row_id;

                                    if(!in_array($userRowId, $hasSentUserIdList)) {
                                        $thisUserInfo = CommonUtil::getUserInfoByRowID($userRowId);//CommonUtil::getUserInfoJustByUserIDAndDomain($userRoleInfo->login_id, $userRoleInfo->user_domain);
                                        if($thisUserInfo->status == "Y" && $thisUserInfo->resign == "N") {
                                            //bug 14023 2017.3.27
                                            if (count($thisUserInfo->uuidList)==0){
                                                $thisUserInfo->uuidList = [
                                                    ["uuid"=>$userRowId]
                                                ];
                                            }
                                            foreach ($thisUserInfo->uuidList as $uuid) {
                                                \DB::table("qp_user_message")
                                                    -> insertGetId([
                                                        'project_row_id'=>$projectInfo->row_id,
                                                        'user_row_id'=>$userRowId,
                                                        'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                                        'message_send_row_id'=>$newMessageSendId,
                                                        'created_user'=>$sourceUserInfo->row_id,
                                                        'created_at'=>$now
                                                    ]);
                                            }
                                            $hasSentUserIdList[] = $userRowId;
                                            $real_push_user_list[] = $userRowId;
                                        }
                                    }
                                }
                            }

                            if($need_push == "Y") {
                                $to = [];
                                $newCountFlag = 0;
                                foreach ($real_push_user_list as $uId) {
                                    $userPushList = \DB::table("qp_user")
                                        ->join("qp_register","qp_register.user_row_id","=","qp_user.row_id")
                                        ->join("qp_push_token","qp_push_token.register_row_id","=","qp_register.row_id")
                                        ->where("qp_user.row_id", "=", $uId)
                                        ->where("qp_user.status","=","Y")
                                        ->where("qp_user.resign","=","N")
                                        ->select("qp_push_token.push_token")
                                        ->get();
                                    if(count($userPushList) > 0 ) {
                                        foreach($userPushList as $tempUser){
                                            $to[$newCountFlag] = $tempUser->push_token;
                                            $newCountFlag ++;
                                        }
                                    }
                                }

                                if($isSchedule) {
                                    $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$newMessageSendId, $push_time_utc, $message_title, $to, $newMessageSendId);
                                } else {
                                    $result = PushUtil::PushMessageWithJPushWebAPI($message_title, $to, $newMessageSendId);
                                }
                                if(!$result["result"]) {
                                    \DB::table("qp_message_send")
                                        -> where(['row_id'=>$newMessageSendId])
                                        -> update([
                                            'jpush_error_code'=>$result["info"],
                                            'updated_user'=>$sourceUserInfo->row_id,
                                            'updated_at'=>$now
                                        ]);
                                    \DB::commit();
                                    $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                        'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                        'content'=>array('jsonContent'=>$newCountFlag,
                                            'content'=>$content)
                                    ];
                                    CommonUtil::logApi("", $ACTION,
                                        response()->json(apache_response_headers()), $result);
                                    return response()->json($result);
                                }
                            }

                            \DB::commit();
                            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                'content'=>array('jsonContent'=>count($destinationUserIdList),
                                    'content'=>$content)//json_encode($jsonContent)
                            ];
                            CommonUtil::logApi("", $ACTION,
                                response()->json(apache_response_headers()), $result);
                            return response()->json($result);
                        } catch (Exception $e) {
                            \DB::rollBack();
                            $result = ['result_code'=>ResultCode::_999999_unknownError,
                                'message'=>trans('messages.MSG_UNKNOWN_ERROR'),
                                'content'=>''];
                            CommonUtil::logApi("", $ACTION,
                                response()->json(apache_response_headers()), $result);
                            return response()->json($result);
                        }
                    }
                }
            }
        }

        $result = ['result_code'=>$verifyResult["code"],
            'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
            'content'=>''];
        CommonUtil::logApi("", $ACTION,
            response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public function updateLastMessageTime() {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();

        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'updateLastMessageTime';

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('last_update_time', $input)
            || trim($input["uuid"]) == "" || trim($input["last_update_time"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $last_update_time = $input["last_update_time"];

        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        $user = CommonUtil::getUserInfoByUUID($uuid);
        if($user == null)
        {
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist)];
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if($userId != null) {
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                if($userStatus == 1) {
                    $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)];
                } else if($userStatus == 2) {
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)];
                }
            }

            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);
            $now = date('Y-m-d H:i:s',time());

            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                \DB::table("qp_register")
                    -> where('uuid', '=', $uuid)
                    -> where('status', '=', 'A')
                    -> update(
                        ['last_message_time'=>$last_update_time,
                            'updated_at'=>$now,
                            'updated_user'=>$user->row_id]);

                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array('uuid'=>$uuid)
                ];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            } else {
                $result = ['result_code'=>$verifyResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                    'content'=>''];
                CommonUtil::logApi("", $ACTION,
                    response()->json(apache_response_headers()), $result);
                return response()->json($result);
            }
        } else {
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            CommonUtil::logApi("", $ACTION,
                response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
    }
}
