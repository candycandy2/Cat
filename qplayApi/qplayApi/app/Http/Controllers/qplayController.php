<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\FilePath;
use Illuminate\Support\Facades\Input;
use Mockery\CountValidator\Exception;
use Request;
use App\Http\Requests;
use App\lib\ResultCode;
use App\lib\Verify;
use DB;


class qplayController extends Controller
{
    public function isRegister()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
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
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Device Has Registered',
                    'content'=>array("is_register"=>1)]);
            }
            else
            {
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Device Has not Registered',
                    'content'=>array("is_register"=>0)]);
            }
        }
        else
        {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        $redirect_uri = $request->header('redirect-uri');
        $domain = $request->header('domain');
        $loginid = $request->header('loginid');
        $password = $request->header('password');

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == ""
            || !array_key_exists('device_type', $input) || trim($input["device_type"]) == ""
            || $redirect_uri == null || $domain == null
            || $loginid == null || $password == null)
        {
            $finalUrl = urlencode($redirect_uri.'?result_code='
                .ResultCode::_999001_requestParameterLostOrIncorrect
                .'&message='
                .'傳入參數不足或傳入參數格式錯誤');
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>array("redirect_uri"=>$finalUrl)]);
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
                $LDAP_SERVER_IP = "LDAP://BenQ.corp.com";
                $userId = $domain . "\\" . $loginid;
                $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
                $bind = @ldap_bind($ldapConnect, $userId, $password); //TODO true;
                if(!$bind)
                {
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000902_passwordError
                        .'&message='
                        .'Password Error');
                    return response()->json(['result_code'=>ResultCode::_000902_passwordError,
                        'message'=>'Password Error',
                        'content'=>array("redirect_uri"=>$finalUrl)]);
                }

                //Check uuid exist
                $uuidList = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    -> where('status', '=', 'A')
                    -> select('uuid')->get();
                if(count($uuidList) > 0)
                {
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000903_deviceHasRegistered
                        .'&message='
                        .'Device Has Registered');
                    return response()->json(['result_code'=>ResultCode::_000903_deviceHasRegistered,
                        'message'=>'Device Has Registered',
                        'content'=>array("redirect_uri"=>$finalUrl)]);
                }

                try
                {
                    $token = uniqid();  //生成token
                    $token_valid = time() + (2 * 86400);
                    $now = date('Y-m-d H:i:s',$token_valid);

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
                }
                catch (Exception $e)
                {
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_999999_unknownError
                        .'&message='
                        .'Call Service Error');
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>'Call Service Error',
                        'content'=>array("redirect_uri"=>$finalUrl)]);
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
                $finalUrl = urlencode($redirect_uri.'?token='
                    .$token
                    .'&token_valid='
                    .$token_valid);
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>'Call Service Successed',
                    'token_valid'=>$token_valid,
                    'content'=>array(
                        "uuid" => $uuid,
                        "redirect_uri"=>$finalUrl,
                        "token"=>$token,
                        "emp_no"=>$userInfo->emp_no,
                        "emp_no"=>$userInfo->emp_no,
                        "domain"=>$userInfo->user_domain,
                        "checksum"=>md5($password),
                        'security_update_list' => $security_update_list)
                ]);
            }
        }

        $finalUrl = urlencode($redirect_uri.'?result_code='
            .$verifyResult["code"]
            .'&message='
            .$verifyResult["message"]);
        return response()->json(['result_code'=>$verifyResult["code"],
            'message'=>$verifyResult["message"],
            'content'=>array("redirect_uri"=>$finalUrl)]);
    }

    public function unregister() {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == ""
        || !array_key_exists('target_uuid', $input) || trim($input["target_uuid"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $uuid = $input["uuid"];
        $userInfo = CommonUtil::getUserInfoByUUID($uuid);

        $target_uuid = $input["target_uuid"];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
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
                    $app_id = "293a09f63dd77abea15f42c3";  //TODO 正式上线需要读配置
                    $url = "http://aic0-s2.qgroup.corp.com/War/MessageCenter/MessageService.asmx/UnregisterDevice";
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
                    }

                    \DB::table("qp_push_token")
                        ->where("register_row_id", "=", $registerId)
                        ->delete();
                }

                \DB::commit();
            } catch (Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>'未知错误',
                    'content'=>'']);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>'Call Service Successed',
                'content'=>array('uuid'=>$uuid)
            ]);
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        $redirect_uri = $request->header('redirect-uri');
        $domain = $request->header('domain');
        $loginid = $request->header('loginid');
        $password = $request->header('password');
        $appKey = $request->header('App-Key');

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || $redirect_uri == null
            || $domain == null || $loginid == null || $password == null)
        {
            $finalUrl = urlencode($redirect_uri.'?result_code='
                .ResultCode::_999001_requestParameterLostOrIncorrect
                .'&message='
                .'傳入參數不足或傳入參數格式錯誤');
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>array("redirect_uri"=>$finalUrl)]);
        }
        $uuid = $input["uuid"];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $verifyResult = $Verify->verifyUserByUserID($loginid, $domain);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {
                $user = CommonUtil::getUserInfoByUserID($loginid, $domain);

                //Check user password with LDAP
                $LDAP_SERVER_IP = "LDAP://BenQ.corp.com";
                $userId = $domain . "\\" . $loginid;
                $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
                $bind = @ldap_bind($ldapConnect, $userId, $password); //TODO true;
                if(!$bind)
                {
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000902_passwordError
                        .'&message='
                        .'Password Error');
                    return response()->json(['result_code'=>ResultCode::_000902_passwordError,
                        'message'=>'Password Error',
                        'content'=>array("redirect_uri"=>$finalUrl)]);
                }

                //Check uuid exist
                //Check user
                $uuidList = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    -> where('status', "=", "A")
                    -> select('row_id','uuid', 'user_row_id')->get();
                $uuidInDB = null;
                if(count($uuidList) < 1)
                {
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_000905_deviceNotRegistered
                        .'&message='
                        .'Device Not Registered');
                    return response()->json(['result_code'=>ResultCode::_000905_deviceNotRegistered,
                        'message'=>'Device Not Registered',
                        'content'=>array("redirect_uri"=>$finalUrl)]);
                }
                else
                {
                    $uuidInDB = $uuidList[0];
                    if($user->row_id != $uuidInDB->user_row_id)
                    {
                        $finalUrl = urlencode($redirect_uri.'?result_code='
                            .ResultCode::_000904_loginUserNotMathRegistered
                            .'&message='
                            .'User Not Match Device');
                        return response()->json(['result_code'=>ResultCode::_000904_loginUserNotMathRegistered,
                            'message'=>'User Not Match Device',
                            'content'=>array("redirect_uri"=>$finalUrl)]);
                    }
                }

                $token = uniqid();  //生成token
                $nowTimestamp = time();
                $token_valid = $nowTimestamp + (2 * 86400);
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
                    $finalUrl = urlencode($redirect_uri.'?result_code='
                        .ResultCode::_999999_unknownError
                        .'&message='
                        .'Call Service Error');
                    $status_code = ResultCode::_999999_unknownError;
                    return response()->json(['result_code'=>$status_code,
                        'message'=>'Call Service Error',
                        'token_valid'=>$token_valid,
                        'content'=>array("redirect_uri"=>$finalUrl)]);
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
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Login Successed',
                    'token_valid'=>$token_valid,
                    'content'=>array("uuid" => $uuid,
                        "redirect_uri"=>$finalUrl,
                        "token"=>$token,
                        "emp_no"=>$userInfo->emp_no,
                        "domain"=>$userInfo->user_domain,
                        "checksum"=>md5($password),
                        'security_update_list' => $security_update_list)
                ]);
            }
        }

        $finalUrl = urlencode($redirect_uri.'?result_code='
            .$verifyResult["code"]
            .'&message='
            .$verifyResult["message"]);
        return response()->json(['result_code'=>$verifyResult["code"],
            'message'=>$verifyResult["message"],
            'content'=>array("redirect_uri"=>$finalUrl)]);
    }

    public function logout()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('domain', $input) || !array_key_exists('loginid', $input))
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }
        $uuid = $input["uuid"];
        $domain = $input['domain'];
        $loginid = $input['loginid'];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $verifyResult = $Verify->verifyUserByUserID($loginid, $domain);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $user = CommonUtil::getUserInfoByUserID($loginid, $domain);
                //Check uuid exist
                //Check user
                $uuidList = \DB::table("qp_register")
                    -> where('uuid', "=", $uuid)
                    -> where('status', '=', 'A')
                    -> select('row_id','uuid', 'user_row_id')->get();
                $uuidInDB = null;
                if(count($uuidList) < 1)
                {
                    return response()->json(['result_code'=>ResultCode::_000905_deviceNotRegistered,
                        'message'=>'Device Not Registered',
                        'content'=>'']);
                }
                else
                {
                    $uuidInDB = $uuidList[0];
                    if($user->row_id != $uuidInDB->user_row_id)
                    {
                        return response()->json(['result_code'=>ResultCode::_000904_loginUserNotMathRegistered,
                            'message'=>'User Not Match Device',
                            'content'=>'']);
                    }
                }

                try
                {
                    \DB::table("qp_session")-> where('uuid', "=", $uuid)->delete();
                }
                catch (Exception $e)
                {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>'Call Service Error',
                        'content'=>''
                    ]);
                }

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Logout Successed',
                    'content'=>array("uuid" => $uuid)
                ]);
            }
        }

        return response()->json(['result_code'=>$verifyResult["code"],
            'message'=>$verifyResult["message"],
            'content'=>'']);
    }

    public function checkAppVersion()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //通用api參數判斷
        if(!array_key_exists('package_name', $input) || !array_key_exists('device_type', $input) || !array_key_exists('version_code', $input)
        || trim($input["package_name"]) == "" || trim($input['device_type']) == "" || trim($input['version_code']) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
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
                return response()->json(['result_code'=>ResultCode::_000915_packageNotExist,
                    'message'=>'package name不存在',
                    'content'=>'']);
            }
            $app_row_id = $appRowIdList[0]->row_id;

            $versionList = \DB::table("qp_app_version")
                -> where('app_row_id', "=", $app_row_id)
                -> where('device_type', '=', $device_type)
                -> where('status', '=', 'ready')
                -> select('version_code', 'url')->get();
            if(count($versionList) < 1)
            {
                return response()->json(['result_code'=>ResultCode::_999012_appOffTheShelf,
                    'message'=>'app已经下架',
                    'content'=>'']);
            }
            if(count($versionList) > 1)
            {
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>'Call Service Failed',
                    'content'=>'']);
            }

            $versionLine = $versionList[0];
            if($versionLine->version_code == $version_code)
            {
                return response()->json(['result_code'=>ResultCode::_000913_NotNeedUpdate,
                    'message'=>'App version is Nearest',
                    'content'=>'']);
            }
            else
            {
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Need to update',
                    'content'=>array("version_code"=>$versionLine->version_code,
                        'download_url'=>$versionLine->url)]);
            }
        }
        else
        {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
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

                $userInfo = CommonUtil::getUserInfoByUUID($uuid);
                
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
                    $sql = "select distinct h.row_id as app_id, p.project_code as app_code, h.package_name, c.row_id as category_id, c.app_category, v.version_code as version, v.version_name, h.security_level, h.avg_score, us.score as user_score, h.sequence, v.url, h.icon_url from qp_app_head h left join qp_app_line l on l.app_row_id = h.row_id left join qp_user_score us on us.app_head_row_id = h.row_id and us.user_row_id = "
                        . $userInfo->row_id
                        . " left join qp_project p on h.project_row_id = p.row_id left join qp_app_category c on h.app_category_row_id = c.row_id left join qp_app_version v on v.app_row_id = h.row_id and v.device_type = '"
                        . $device_type
                        ."' and v.status = 'ready' where h.row_id in (select row_id from qp_app_head where row_id in ( select app_row_id from qp_role_app where role_row_id in ( select role_row_id from qp_user_role where user_row_id = "
                        . $userInfo->row_id
                        . " )) union  select row_id from qp_app_head where row_id in ( select app_row_id from qp_user_app where user_row_id = "
                        . $userInfo->row_id
                        . ") union select row_id from qp_app_head where row_id in ("
                        . $companyAppIdStr
                        . ")) and version_code is not null";
                    //return response()->json(['sql'=>$sql]);
                    $appDataList = DB::select($sql);
                } else {
                    $sql = <<<SQL
select distinct h.row_id as app_id, p.project_code as app_code,
h.package_name, c.row_id as category_id, c.app_category,
v.version_code as version, v.version_name,
h.security_level,h.avg_score, us.score as user_score,
h.sequence, v.url, h.icon_url
from qp_app_head h left join qp_app_line l on l.app_row_id = h.row_id
left join qp_user_score us on us.app_head_row_id = h.row_id and us.user_row_id = :id3
left join qp_project p on h.project_row_id = p.row_id
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
                    $app = array('app_id'=>$appData->app_id,
                        'app_code'=>$appData->app_code,
                        'package_name'=>$appData->package_name,
                        'app_category'=>$appData->app_category,
                        'app_version'=>$appData->version,
                        'app_version_name'=>$appData->version_name,
                        'security_level'=>$appData->security_level,
                        'avg_score'=>$appData->avg_score,
                        'user_score'=>$appData->user_score,
                        'sequence'=>$appData->sequence,
                        'url'=>FilePath::getApkDownloadUrl($appData->app_id, $device_type, $appData->version, $appData->url),//$appData->url
                        'icon_url'=>FilePath::getIconUrl($appData->app_id, $appData->icon_url)//$appData->icon_url
                    );
                    $categoryIdListStr = $categoryIdListStr.($appData->category_id).",";
                    $appIdListStr = $appIdListStr.($appData->app_id).",";
                    array_push($app_list, $app);
                }

                $app_category_list = array();
                $categoryIdListStr = substr($categoryIdListStr, 0, strlen($categoryIdListStr) - 1);
//                $sql = <<<SQL
//                select row_id as category_id, app_category, sequence
//                from qp_app_category
//                where row_id in (:idList)
//SQL;
//                $categoryDataList = DB::select($sql, [':idList'=>$categoryIdListStr]);

                $categoryDataList = array();
                if(strlen($categoryIdListStr) > 0) {
                    $sql = 'select row_id as category_id, app_category, sequence from qp_app_category where row_id in ( ' . $categoryIdListStr . ')';
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
                        ->where('lang_row_id', '=', $langId)->select('pic_type', 'pic_url', 'sequence_by_type')->get();
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


                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Call Service Successed',
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array(
                        'app_category_list'=>$app_category_list,
                        'app_list'=>$app_list,
                        'multi_lang'=>$multi_lang)
                ]);
            }
            else
            {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>'']);
            }
        }
        else
        {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
        }
    }

    public function getSecurityList()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('app_key', $input))
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input['uuid'];
        $appKey = $input['app_key'];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
        }

        if ($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {

            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
            {
                $app_row_id = \DB::table("qp_app_head")
                    -> join("qp_project","project_row_id",  "=", "qp_project.row_id")
                    -> where('qp_project.app_key', "=", $appKey)
                    -> select('qp_app_head.row_id')
                    -> lists('qp_app_head.row_id');

                $whitelist = \DB::table("qp_white_list")
                    -> whereNull('deleted_at')
                    -> where('app_row_id', "=", $app_row_id)
                    -> select('allow_url')
                    -> get();

                $level = \DB::table("qp_app_head")
                    -> join("qp_project","project_row_id",  "=", "qp_project.row_id")
                    -> where('qp_project.app_key', "=", $appKey)
                    -> select('security_level')
                    -> lists('security_level');


                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Call Service Successed',
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>json_encode($whitelist),
                    'security_level'=>$level[0],
                ]);
            } else {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>'']);
            }
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        //通用api參數判斷
        if(!array_key_exists('uuid', $input))
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
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
                if(array_key_exists('date_from', $input) && trim($input['date_from']) != "") {
                    if(!array_key_exists('date_to', $input) || trim($input['date_to']) == "") {
                        return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message'=>'傳入參數不足或傳入參數格式錯誤',
                            'content'=>'']);
                    }
                }
                if(array_key_exists('date_to', $input) && trim($input['date_to']) != "") {
                    if(!array_key_exists('date_from', $input) || trim($input['date_from']) == "") {
                        return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message'=>'傳入參數不足或傳入參數格式錯誤',
                            'content'=>'']);
                    }
                }
                if(array_key_exists('count_from', $input) && trim($input['count_from']) != "") {
                    if (!array_key_exists('count_to', $input) || trim($input['count_to']) == "") {
                        return response()->json(['result_code' => ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message' => '傳入參數不足或傳入參數格式錯誤',
                            'content' => '']);
                    }
                }
                if(array_key_exists('count_to', $input) && trim($input['count_to']) != "") {
                    if (!array_key_exists('count_from', $input) || trim($input['count_from']) == "") {
                        return response()->json(['result_code' => ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message' => '傳入參數不足或傳入參數格式錯誤',
                            'content' => '']);
                    }
                }


                if(array_key_exists('date_from', $input) && trim($input['date_from']) != "") {
                    if(!array_key_exists('date_to', $input) || trim($input['date_to']) == "") {
                        return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message'=>'傳入參數不足或傳入參數格式錯誤',
                            'content'=>'']);
                    }
                    $useUserDate = true;
                    $date_from = $input['date_from'];

                    $date_to = $input['date_to'];
                    if($date_to < $date_from) {
                        return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                            'message'=>'傳入參數不足或傳入參數格式錯誤',
                            'content'=>'']);
                    }

                    if(array_key_exists('count_from', $input) && trim($input['count_from']) != "") {
                        if(!array_key_exists('count_to', $input) || trim($input['count_to']) == "") {
                            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                'message'=>'傳入參數不足或傳入參數格式錯誤',
                                'content'=>'']);
                        }

                        $count_from = $input['count_from'];
                        $count_to = $input['count_to'];
                        if($count_from < 1 || $count_to < 1 || $count_to < $count_from) {
                            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                'message'=>'傳入參數不足或傳入參數格式錯誤',
                                'content'=>'']);
                        }
                    }
                }

                $userInfo = CommonUtil::getUserInfoByUUID($uuid);
                $userId = $userInfo->row_id;
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
where um.user_row_id = :uId1
and qp_message.message_type = 'event'
and qp_message.visible = 'Y'
and UNIX_TIMESTAMP(qp_message_send.created_at) >= $date_from
and UNIX_TIMESTAMP(qp_message_send.created_at) <= $date_to
and qp_message_send.row_id in (
select message_send_row_id from qp_user_message 
where user_row_id = :uId2
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
and qp_message_send.row_id in (
select message_send_row_id from qp_role_message
where role_row_id in (select role_row_id from qp_user_role where user_row_id = :uId3)
and deleted_at = 0
)) ms,
qp_user u,qp_user u2
where m.row_id = ms.message_row_id
and ms.source_user_row_id = u.row_id
and m.created_user = u2.row_id
order by ms.created_at desc
SQL;

                $r = DB::select($sql, [':uId1'=>$userId, ':uId2'=>$userId, ':uId3'=>$userId,]);

                if($count_from >= 1) {
                    $r = array_slice($r, $count_from - 1, $count_to - $count_from + 1);
                }

                if(!$useUserDate) {
                    $now = date('Y-m-d H:i:s',time());
                    \DB::table("qp_register")
                        -> where('user_row_id', '=', $userId)
                        -> where('uuid', '=', $uuid)
                        -> where('status', '=', 'A')
                        -> update(['last_message_time'=>$date_to,
                        'updated_at'=>$now,
                        'updated_user'=>$userId]);
                }

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Call Service Successed',
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array('message_count'=> count($r),
                        'message_list'=>$r)
                ]);
            } else {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>'']);
            }
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == ""
            || !array_key_exists('message_send_row_id', $input) || trim($input["message_send_row_id"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $message_send_row_id = $input["message_send_row_id"];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $userInfo = CommonUtil::getUserInfoByUUID($uuid);
            $userId = $userInfo->row_id;
            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $sql = 'select * from qp_message where row_id = (select message_row_id from qp_message_send where row_id = '.$message_send_row_id.')';
                $msgList = DB::select($sql, []);
                if(count($msgList) == 0) {
                    return response()->json(['result_code'=>ResultCode::_000910_messageNotExist,
                        'message'=>'消息不存在',
                        'token_valid'=>$verifyResult["token_valid_date"],
                        'content'=>''
                    ]);
                }
                $msg = $msgList[0];
                $sql = <<<SQL
select m.row_id as message_row_id,
        ms.row_id as message_send_row_id,
		   m.message_title,
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
and um.deleted_at = 0
and um.user_row_id = $userId
SQL;
                if($msg->message_type == 'news') {
                    $sql = <<<SQL
select distinct m.row_id as message_row_id,
        ms.row_id as message_send_row_id,
		   m.message_title,
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
		 qp_role_message rm
where m.row_id = ms.message_row_id
and m.visible = 'Y'
and ms.row_id = $message_send_row_id
and ms.source_user_row_id = u1.row_id
and m.created_user = u2.row_id
and rm.message_send_row_id = ms.row_id
and rm.deleted_at = 0
and rm.role_row_id in (select role_row_id from qp_user_role where user_row_id = $userId)
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
SQL;
                        $userReadList = DB::select($sql, [':msgSendId'=>$message_send_row_id, ':userId'=>$userId]);
                        if(count($userReadList) > 0) {
                            $userRead = $userReadList[0];
                            $msgDetail->read = $userRead->read;
                            $msgDetail->read_time = $userRead->read_time;
                        }
                    }
                    return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>'Call Service Successed',
                        'token_valid'=>$verifyResult["token_valid_date"],
                        'content'=>$msgDetail
                    ]);
                } else {
                    return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>'Call Service Successed',
                        'token_valid'=>$verifyResult["token_valid_date"],
                        'content'=>$msgDetailList
                    ]);
                }

            } else {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>'']);
            }
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('message_send_row_id', $input)
            || !array_key_exists('message_type', $input) || !array_key_exists('status', $input)
        || trim($input["uuid"]) == "" || trim($input["message_send_row_id"]) == ""
            || trim($input["message_type"]) == "" || trim($input["status"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $message_send_row_id = $input["message_send_row_id"];
        $message_type = $input["message_type"];
        $status = $input["status"];

        $msgSendList = \DB::table("qp_message_send")
            -> where('row_id', "=", $message_send_row_id)
            -> select('message_row_id')->get();
        if(count($msgSendList) < 1 ) {
            return response()->json(['result_code'=>ResultCode::_000910_messageNotExist,
                'message'=>'此消息不存在',
                'content'=>'']);
        }
        $message_row_id = $msgSendList[0]->message_row_id;
        $msgList = \DB::table("qp_message")
            -> where('row_id', "=", $message_row_id)
            -> select('row_id')->get();
        if(count($msgList) < 1 ) {
            return response()->json(['result_code'=>ResultCode::_000910_messageNotExist,
                'message'=>'此消息不存在',
                'content'=>'']);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $userInfo = CommonUtil::getUserInfoByUUID($uuid);
                if($status == 'read' && $message_type == "event") {
                    $now = date('Y-m-d H:i:s',time());
                    $user = CommonUtil::getUserInfoByUUID($uuid);
                    \DB::table("qp_user_message")
                        -> where('user_row_id', '=', $userInfo->row_id)
                        -> where('message_send_row_id', '=', $message_send_row_id)
                        -> update(
                            ['read_time'=>time(),
                                'updated_at'=>$now,
                                'updated_user'=>$user->row_id]);
                }

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Call Service Successed',
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array('message_send_row_id' => $message_send_row_id)
                ]);
            } else {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>'']);
            }
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        //通用api參數判斷
        if($pushToken == null || !array_key_exists('uuid', $input) || !array_key_exists('app_key', $input)
            || !array_key_exists('device_type', $input) || trim($input["uuid"]) == "" || trim($input["app_key"]) == "" || trim($input["device_type"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $uuid = $input["uuid"];
        $appKey = $input["app_key"];
        $deviceType = $input["device_type"];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
        }

        if(!$Verify->chkAppKeyExist($appKey)) {
            return response()->json(['result_code'=>ResultCode::_000909_appKeyNotExist,
                'message'=>'app_key不存在',
                'content'=>'']);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $userInfo = CommonUtil::getUserInfoByUUID($uuid);
            if($userInfo == null)
            {
                return array("code"=>ResultCode::_000914_userWithoutRight,
                    "message"=> "账号已被停权");
            }

            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> where('status', '=', 'A')
                -> where('device_type', "=", $deviceType)
                -> select('uuid', 'row_id')->get();
            if(count($uuidList) < 1)
            {
                return response()->json(['result_code'=>ResultCode::_000905_deviceNotRegistered,
                    'message'=>'设备未注册',
                    'content'=>'']);
            }

            $registerId = $uuidList[0]->row_id;

            $projectId = \DB::table("qp_project")
                -> where('app_key', "=", $appKey)
                -> select('row_id')->lists('row_id')[0];

            $existInfoList = \DB::table("qp_push_token")
                -> where('push_token', "=", $pushToken)
                -> select()->get();
            if(count($existInfoList) > 1 || (count($existInfoList) == 1 && $existInfoList[0]->register_row_id != $registerId)) {
                return response()->json(['result_code'=>ResultCode::_999013_pushTokenUsed,
                    'message'=>'push token已使用',
                    'content'=>'']);
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
                if(count($existPushToken) > 0)
                {
                    \DB::table("qp_push_token")
                        -> where('register_row_id', "=", $registerId)
                        -> where('project_row_id', "=", $projectId)
                        -> where('device_type', "=", $deviceType)
                        ->update([
                            'push_token'=>$pushToken,
                            'updated_at'=>$now,
                            'updated_user'=>$user->row_id,]);
                }
                else
                {
                    \DB::table("qp_push_token")->insert([
                        'register_row_id'=>$registerId,
                        'project_row_id'=>$projectId,
                        'push_token'=>$pushToken,
                        'created_user'=>$user->row_id,
                        'created_at'=>$now,
                        'device_type'=>$deviceType]);
                }

                //Register to Message Center
                $app_id = "b376539a868fdf5696228432";//"293a09f63dd77abea15f42c3";  //TODO 正式上线需要读配置
//                $url = "http://10.85.17.209/MessageCenterWebService/MessageService.asmx/RegisterDevice";
                $url = "http://aic0-s2.qgroup.corp.com/War/MessageCenter/MessageService.asmx/RegisterDevice";
                $args = array('App_id' => $app_id,
                    'Tenant_id' => '00000000-0000-0000-0000-000000000000',
                    'Provider' => 'JPush',
                    'Client_id' => $pushToken,
                    'User_Name' => $user->login_id,
                    'Badge_number' => '0');
                $data["register"] = json_encode($args);
                $result = CommonUtil::doPost($url, $data);
                if(!str_contains($result, "true")) {
                    \DB::rollBack();
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>'Register to Message Center Failed!' . $result,
                        'content'=>$data]);
                }

                \DB::commit();
            } catch (Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>'未知错误',
                    'content'=>'']);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>'Call Service Successed',
                'content'=>array('uuid'=>$uuid)
            ]);
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
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

        //通用api參數判斷
        if(!array_key_exists('uuid', $input))
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $token = uniqid();
                $token_valid = time() + (2 * 86400);
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

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Renew Successed',
                    'token_valid'=>$token_valid,
                    'content'=>array("uuid" => $uuid, "token"=>$token)
                ]);
            } else {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>'']);
            }
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
        }
    }
    
    public function sendPushMessage()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = \Request::instance();

        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //通用api參數判斷
        if(!array_key_exists('app_key', $input) || !array_key_exists('need_push', $input)
        || trim($input["app_key"]) == "" || trim($input["need_push"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $app_key = $input["app_key"];
        $need_push = trim(strtoupper($input["need_push"]));
        if($need_push != "Y" && $need_push != "N") {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        if(!$Verify->chkAppKeyExist($app_key)) {
            return response()->json(['result_code'=>ResultCode::_000909_appKeyNotExist,
                'message'=>'app_key不存在',
                'content'=>'']);
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
                || !array_key_exists('message_type', $jsonContent) || ($jsonContent['message_type'] != "news" && $jsonContent['message_type'] != "event")
                || ( (!array_key_exists('message_text', $jsonContent) || trim($jsonContent['message_text']) == "")
                  && (!array_key_exists('message_html', $jsonContent) || trim($jsonContent['message_html']) == "")
                  && (!array_key_exists('message_url', $jsonContent) || trim($jsonContent['message_url']) == "") )
                || !array_key_exists('message_source', $jsonContent) || trim($jsonContent['message_source']) == ""
                || !array_key_exists('source_user_id', $jsonContent) || trim($jsonContent['source_user_id']) == "") {
                    return response()->json(['result_code'=>ResultCode::_000918_dataIncomplete,
                        'message'=>"数据不完整",
                        'content'=>'']);
                }
                if($need_push == "Y") {
                    if($jsonContent['message_type'] == "event" &&
                        ( (!array_key_exists('destination_user_id', $jsonContent) || $jsonContent['destination_user_id'] == null)
                            && (!array_key_exists('destination_role_id', $jsonContent) || $jsonContent['destination_role_id'] == null))) {
                        return response()->json(['result_code'=>ResultCode::_000918_dataIncomplete,
                            'message'=>"数据不完整",
                            'content'=>'']);
                    }

                    if($jsonContent['message_type'] == "news" &&
                        (!array_key_exists('destination_role_id', $jsonContent) || $jsonContent['destination_role_id'] == null)) {
                        return response()->json(['result_code'=>ResultCode::_000918_dataIncomplete,
                            'message'=>"数据不完整",
                            'content'=>'']);
                    }
                }

                $sourceUseId = $jsonContent['source_user_id'];

                $userid = explode('\\', $sourceUseId)[1];
                $domain = explode('\\', $sourceUseId)[0];
                $verifyResult = $Verify->verifyUserByUserIDAndDomain($userid, $domain);
                if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                    $userInfo = CommonUtil::getUserInfoJustByUserIDAndDomain($userid, $domain);

                    $projectInfo = CommonUtil::getProjectInfoAppKey($app_key);
                    if($projectInfo == null) {
                        return response()->json(['result_code'=>ResultCode::_000909_appKeyNotExist,
                            'message'=>"app key不存在",
                            'content'=>'']);
                    }

                    $destinationUserIdList = $jsonContent['destination_user_id'];
                    $destinationUserInfoList = array();
                    foreach ($destinationUserIdList as $destinationUserId)
                    {
                        $userid = explode('\\', $destinationUserId)[1];
                        $domain = explode('\\', $destinationUserId)[0];
                        $verifyResult = $Verify->verifyUserByUserIDAndDomain($userid, $domain);

                        if($verifyResult["code"] == ResultCode::_000901_userNotExistError) {
                            return response()->json(['result_code'=>ResultCode::_000912_userReceivePushMessageNotExist,
                                'message'=>"接收推播的用户不存在",
                                'content'=>'']);
                        }

                        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful) {
                            return response()->json(['result_code'=>$verifyResult["code"],
                                'message'=>$verifyResult["message"],
                                'content'=>'']);
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
                            return response()->json(['result_code'=>ResultCode::_000917_roleNotExist,
                                'message'=>"角色不存在",
                                'content'=>'']);
                        }

                        array_push($destinationRoleInfoList, $destinationRoleInfo);
                    }

                    $message_type = $jsonContent['message_type'];
                    $message_title = CommonUtil::jsUnescape(base64_decode($jsonContent['message_title']));
                    if(strlen($message_title) > 99) {
                        return response()->json(['result_code'=>ResultCode::_000916_titleLengthTooLong,
                            'message'=>"标题栏位太长",
                            'content'=>'']);
                    }
                    $template_id = $jsonContent['template_id'];
                    $message_text = CommonUtil::jsUnescape(base64_decode($jsonContent['message_text']));
                    $message_html = CommonUtil::jsUnescape(base64_decode($jsonContent['message_html']));
                    $message_url = CommonUtil::jsUnescape(base64_decode($jsonContent['message_url']));
                    $message_source = $jsonContent['message_source'];
                    $now = date('Y-m-d H:i:s',time());
                    \DB::beginTransaction();
                    try {
                        $newMessageId = \DB::table("qp_message")
                            -> insertGetId([
                                'template_id'=>$template_id, 'visible'=>'Y',
                                'message_type'=>$message_type, 'message_title'=>$message_title,
                                'message_text'=>$message_text, 'message_html'=>$message_html,
                                'message_url'=>$message_url, 'message_source'=>$message_source,
                                'created_user'=>$userInfo->row_id,
                                'created_at'=>$now,
                            ]);

                        $newMessageSendId = \DB::table("qp_message_send")
                            -> insertGetId([
                                'message_row_id'=>$newMessageId,
                                'source_user_row_id'=>$userInfo->row_id,
                                'created_user'=>$userInfo->row_id,
                                'created_at'=>$now,
                                'need_push'=>$need_push,
                                'push_flag'=>'0'
                            ]);

                        if($need_push == "Y") {
                            $hasSentUserIdList = array();
                            $real_push_user_list = array();
                            if($message_type == "event") {
                                foreach ($destinationUserInfoList as $destinationUserInfo) {
                                    if(in_array($destinationUserInfo->row_id, $hasSentUserIdList)) {
                                        continue;
                                    }
                                    \DB::table("qp_user_message")
                                        -> insertGetId([
                                            'project_row_id'=>$projectInfo->row_id, 'user_row_id'=>$destinationUserInfo->row_id,
                                            'message_send_row_id'=>$newMessageSendId, //,'push_flag'=>'0','need_push'=>'1',//'need_push'=>$need_push,
                                            'created_user'=>$userInfo->row_id,
                                            'created_at'=>$now
                                        ]);
                                    $hasSentUserIdList[] = $destinationUserInfo->row_id;
                                    $real_push_user_list[] = $destinationUserInfo->row_id;
                                }
                            }

                            foreach ($destinationRoleInfoList as $destinationRoleInfo) {
                                \DB::table("qp_role_message")
                                    -> insertGetId([
                                        'project_row_id'=>$projectInfo->row_id, 'role_row_id'=>$destinationRoleInfo->row_id,
                                        'message_send_row_id'=>$newMessageSendId, //,'push_flag'=>'0', 'need_push'=>'1',//'need_push'=>$need_push,
                                        'created_user'=>$userInfo->row_id,
                                        'created_at'=>$now
                                    ]);

                                if($message_type == "event") {
                                    $sql = 'select * from qp_user where row_id in (select user_row_id from qp_user_role where role_row_id = '.$destinationRoleInfo->row_id.' )';
                                    $userInRoleList = DB::select($sql, []);
                                    foreach ($userInRoleList as $userRoleInfo) {
                                        $userRowId = $userRoleInfo->row_id;
                                        $hasSent = false;
                                        foreach ($destinationUserInfoList as $destinationUserInfo){
                                            if($destinationUserInfo->row_id == $userRowId) {
                                                $hasSent = true;
                                                break;
                                            }
                                        }
                                        if(in_array($userRowId, $hasSentUserIdList)) {
                                            $hasSent = true;
                                        }

                                        if(!$hasSent) {
                                            \DB::table("qp_user_message")
                                                -> insertGetId([
                                                    'project_row_id'=>$projectInfo->row_id, 'user_row_id'=>$userRowId,
                                                    'message_send_row_id'=>$newMessageSendId,  'need_push'=>'1',//'need_push'=>$need_push,
                                                    'created_user'=>$userInfo->row_id,
                                                    'created_at'=>$now,
                                                    'push_flag'=>'0'
                                                ]);
                                            $hasSentUserIdList[] = $userRowId;
                                            $real_push_user_list[] = $userRowId;
                                        }
                                    }
                                }
                            }

                            $to = "";
                            foreach ($real_push_user_list as $uId) {
                                $userPushList = \DB::table("qp_user")->where("row_id", "=", $uId)->select()->get();
                                if(count($userPushList) > 0 && $userPushList[0]->status == "Y" && $userPushList[0]->resign == "N") {
                                    $to = $to.$userPushList[0]->login_id.";";
                                }
                            }
                            $result = CommonUtil::PushMessageWithMessageCenter($message_title, $to);
                            if(!$result["result"]) {
                                \DB::rollBack();
                                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$result["info"]]);
                            }
                        }

                        \DB::commit();
                        return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                            'message'=>'Send Push Message Successed',
                            'content'=>array('jsonContent'=>count($destinationUserIdList),
                                'content'=>$content)//json_encode($jsonContent)
                        ]);
                    } catch (Exception $e) {
                        \DB::rollBack();
                        return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                            'message'=>'未知错误',
                            'content'=>'']);
                    }
                }
            }
        }

        return response()->json(['result_code'=>$verifyResult["code"],
            'message'=>$verifyResult["message"],
            'content'=>'']);
    }

    public function updateLastMessageTime() {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();

        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('last_update_time', $input)
            || trim($input["uuid"]) == "" || trim($input["last_update_time"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $last_update_time = $input["last_update_time"];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);
            $now = date('Y-m-d H:i:s',time());
            $user = CommonUtil::getUserInfoByUUID($uuid);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                \DB::table("qp_register")
                    -> where('uuid', '=', $uuid)
                    -> where('status', '=', 'A')
                    -> update(
                        ['last_message_time'=>$last_update_time,
                            'updated_at'=>$now,
                            'updated_user'=>$user->row_id]);

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Call Service Successed',
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>array('uuid'=>$uuid)
                ]);
            } else {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>'']);
            }
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
        }
    }
}
