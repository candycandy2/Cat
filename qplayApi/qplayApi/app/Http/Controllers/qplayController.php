<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
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

        $redirect_uri = $request->header('redirect-uri');
        $domain = $request->header('domain');
        $loginid = $request->header('loginid');
        $password = $request->header('password');

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "" || !array_key_exists('device_type', $input) || trim($input["device_type"]) == "" || $redirect_uri == null || $domain == null || $loginid == null || $password == null)
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_999001_requestParameterLostOrIncorrect.'message='.'傳入參數不足或傳入參數格式錯誤')]);
        }

        $uuid = $input["uuid"];
        $device_type = $input["device_type"];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            //Check user
            $userList = \DB::table("qp_user")
                -> where('login_id', "=", $loginid)
                -> select('row_id', 'login_id', 'emp_no', 'emp_name', 'email', 'user_domain', 'company'
                    , 'department', 'status', 'resign')->get();
            if(count($userList) == 0)
            {
                return response()->json(['result_code'=>ResultCode::_000901_userNotExistError,
                    'message'=>'離職或是帳號資訊打錯',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000901_userNotExistError.'message='.'離職或是帳號資訊打錯')]);
            }
            $user = $userList[0];
            if($user->status != "Y" || $user->resign != "N")
            {
                return response()->json(['result_code'=>ResultCode::_000914_userWithoutRight,
                    'message'=>'Access Forbidden',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000914_userWithoutRight.'message='.'Access Forbidden')]);
            }

            //Check user password with LDAP
            $LDAP_SERVER_IP = "LDAP://BenQ.corp.com";
            $userId = $domain . "\\" . $loginid;
            $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
            $bind = true;//TODO @ldap_bind($ldapConnect, $userId, $password);
            if(!$bind)
            {
                return response()->json(['result_code'=>ResultCode::_000902_passwordError,
                    'message'=>'Password Error',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000902_passwordError.'message='.'Password Error')]);
            }

            //Check uuid exist
            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> where('status', '=', 'A')
                -> select('uuid')->get();
            if(count($uuidList) > 0)
            {
                return response()->json(['result_code'=>ResultCode::_000903_deviceHasRegistered,
                    'message'=>'Device Has Registered',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000903_deviceHasRegistered.'message='.'Device Has Registered')]);
            }

            try
            {
                $now = date('Y-m-d H:i:s',time());
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

                $token = uniqid();  //生成token
                $token_valid = time();
                $sessionList = \DB::table("qp_session")
                    -> where('uuid', "=", $uuid)
                    -> where('user_row_id', '=', $user->row_id)
                    -> select('uuid')->get();
                if(count($sessionList) > 0)
                {
                    \DB::table("qp_session")
                        ->where('user_row_id', '=',
                                $user->row_id,
                                'uuid', '=', $uuid)
                        ->update(['token'=>$token,
                                  'token_valid_date'=>$now,
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
                        'token_valid_date'=>date('Y-m-d H:i:s',time()),
                        'created_at'=>$now,
                        'created_user'=>$user->row_id,
                    ]);
                }
            }
            catch (Exception $e)
            {
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>'Call Service Error',
                    'token_valid'=>$token_valid,
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_999999_unknownError.'message='.'Call Service Error')]);
            }
            $appHeaderList = \DB::table("qp_app_head")
                ->join("qp_project","project_row_id",  "=", "qp_project.row_id")
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
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>'Call Service Successed',
                'token_valid'=>$token_valid,
                'content'=>array(
                    "uuid" => $uuid,
                    "redirect_uri"=>$redirect_uri.'?token='.$token.'&token_valid='.$token_valid,
                    "token"=>$token,
                    "emp_no"=>$userInfo->emp_no,
                    'security_update_list' => $security_update_list)
            ]);

        }
        else
        {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>array("redirect_uri"=>$redirect_uri)]);
        }
    }

    public function login()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $request = Request::instance();
        $input = Input::get();

        $redirect_uri = $request->header('redirect-uri');
        $domain = $request->header('domain');
        $loginid = $request->header('loginid');
        $password = $request->header('password');
        $appKey = $request->header('App-Key');

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || $redirect_uri == null
            || $domain == null || $loginid == null || $password == null)
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_999001_requestParameterLostOrIncorrect.'message='.'傳入參數不足或傳入參數格式錯誤')]);
        }
        $uuid = $input["uuid"];

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            //Check user
            $userList = \DB::table("qp_user")
                -> where('login_id', "=", $loginid)
                -> select('row_id', 'login_id', 'emp_no', 'emp_name', 'email', 'user_domain', 'company'
                    , 'department', 'status', 'resign')->get();
            if(count($userList) == 0)
            {
                return response()->json(['result_code'=>ResultCode::_000901_userNotExistError,
                    'message'=>'離職或是帳號資訊打錯',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000901_userNotExistError.'message='.'離職或是帳號資訊打錯')]);
            }
            $user = $userList[0];
            if($user->status != "Y" || $user->resign != "N")
            {
                return response()->json(['result_code'=>ResultCode::_000914_userWithoutRight,
                    'message'=>'Access Forbidden',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000914_userWithoutRight.'message='.'Access Forbidden')]);
            }

            //Check user password with LDAP
            $LDAP_SERVER_IP = "LDAP://BenQ.corp.com";
            $userId = $domain . "\\" . $loginid;
            $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
            $bind = true; //TODO @ldap_bind($ldapConnect, $userId, $password);
            if(!$bind)
            {
                return response()->json(['result_code'=>ResultCode::_000902_passwordError,
                    'message'=>'Password Error',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000902_passwordError.'message='.'Password Error')]);
            }

            //Check uuid exist
            //Check user
            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> select('row_id','uuid', 'user_row_id')->get();
            $uuidInDB = null;
            if(count($uuidList) < 1)
            {
                return response()->json(['result_code'=>ResultCode::_000905_deviceNotRegistered,
                    'message'=>'Device Not Registered',
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000905_deviceNotRegistered.'message='.'Device Not Registered')]);
            }
            else
            {
                $uuidInDB = $uuidList[0];
                if($user->row_id != $uuidInDB->user_row_id)
                {
                    return response()->json(['result_code'=>ResultCode::_000904_loginUserNotMathRegistered,
                        'message'=>'User Not Match Device',
                        'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_000904_loginUserNotMathRegistered.'message='.'User Not Match Device')]);
                }
            }

            $token = uniqid();  //生成token
            $token_valid = time();
            try
            {
                $sessionList = \DB::table("qp_session")
                    -> where('uuid', "=", $uuid)
                    -> where('user_row_id', '=', $user->row_id)
                    -> select('uuid')
                    -> get();
                $now = date('Y-m-d H:i:s',time());
                if(count($sessionList) > 0)
                {
                    \DB::table("qp_session")
                        -> where('user_row_id', '=', $user->row_id)
                        -> where('uuid', '=', $uuid)
                        -> update([
                        'token'=>$token,
                        'token_valid_date'=>time(),
                        'updated_at'=>$now,
                        'updated_user'=>$user->row_id,
                    ]);
                }
                else
                {
                    \DB::table("qp_session")
                        -> insert([
                        'user_row_id'=>$user->row_id,
                        'uuid'=>$uuid,
                        'token'=>$token,
                        'token_valid_date'=>time(),//'token_valid_date'=>date('Y-m-d H:i:s',time()),
                        'created_user'=>$user->row_id,
                        'created_at'=>$now,
                    ]);
                }
            }
            catch (Exception $e)
            {
                $status_code = ResultCode::_999999_unknownError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Call Service Error',
                    'token_valid'=>$token_valid,
                    'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.ResultCode::_999999_unknownError.'message='.'Call Service Error')]);
            }

            $appHeaderList = \DB::table("qp_app_head")
                ->join("qp_project","project_row_id",  "=", "qp_project.row_id")
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
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>'Login Successed',
                'token_valid'=>$token_valid,
                'content'=>array("uuid" => $uuid,
                    "redirect_uri"=>$redirect_uri.'?token='.$token.'&token_valid='.$token_valid,
                    "token"=>$token,
                    "emp_no"=>$userInfo->emp_no,
                    'security_update_list' => $security_update_list)
            ]);
        }
        else
        {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>array("redirect_uri"=>$redirect_uri.'?result_code='.$verifyResult["code"].'message='.$verifyResult["message"])]);
        }
    }

    public function logout()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();

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
            //Check user
            $userList = \DB::table("qp_user")
                -> where('login_id', "=", $loginid)
                -> where('user_domain', '=', $domain)
                -> select('row_id', 'login_id', 'emp_no', 'emp_name', 'email', 'user_domain', 'company'
                    , 'department', 'status', 'resign')->get();
            if(count($userList) == 0)
            {
                return response()->json(['result_code'=>ResultCode::_000901_userNotExistError,
                    'message'=>'離職或是帳號資訊打錯',
                    'content'=>'']);
            }
            $user = $userList[0];
            if($user->status != "Y" || $user->resign != "N")
            {
                return response()->json(['result_code'=>ResultCode::_000914_userWithoutRight,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            //Check uuid exist
            //Check user
            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
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
        else
        {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
        }
    }

    public function checkAppVersion()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();

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
                    -> select('uuid', 'device_type')->get();
                $device_type = $registerInfo[0]->device_type;

                $userInfo = CommonUtil::getUserInfoByUUID($uuid);

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

                $app_list = array();
                $categoryIdListStr = "";
                $appIdListStr = "";
                foreach ($appDataList as $appData)
                {
                    $app = array('app_id'=>$appData->app_id,
                        'app_code'=>$appData->app_code,
                        'package_name'=>$appData->package_name,
                        'app_category'=>$appData->app_category,
                        'version'=>$appData->version,
                        'version_name'=>$appData->version_name,
                        'security_level'=>$appData->security_level,
                        'avg_score'=>$appData->avg_score,
                        'user_score'=>$appData->user_score,
                        'sequence'=>$appData->sequence,
                        'url'=>$appData->url,
                        'icon_url'=>$appData->icon_url
                    );
                    $categoryIdListStr = $categoryIdListStr.$appData->category_id.",";
                    $appIdListStr = $appIdListStr.$appData->app_id.",";
                    array_push($app_list, $app);
                }

                $app_category_list = array();
                $categoryIdListStr = substr($categoryIdListStr, 0, strlen($categoryIdListStr) - 1);
//                $sql = <<<SQL
//select row_id as category_id, app_category, sequence from qp_app_category
//where row_id in (:idList)
//SQL;
                $sql = 'select row_id as category_id, app_category, sequence from qp_app_category where row_id in ( ' . $categoryIdListStr . ')';
                $categoryDataList = DB::select($sql);

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
                $sql = 'select line.app_row_id,lang.row_id as lang_id,lang.lang_code as lang, line.app_name, line.app_summary, line.app_description from qp_app_line line, qp_language lang where line.lang_row_id = lang.row_id and line.app_row_id in ('.$appIdListStr.')';
                $langDataList = DB::select($sql);
                foreach ($langDataList as $langData)
                {

                    $appId = $langData->app_row_id;
                    $langId = $langData->lang_id;

                    $picList = \DB::table("qp_app_pic")->where('app_row_id', '=', $appId)
                        ->where('lang_row_id', '=', $langId)->select('pic_type', 'pic_url', 'sequence_by_type')->get();

                    $lang = array('lang'=>$langData->lang,
                        'app_name'=>$langData->app_name,
                        'app_summary'=>$langData->app_summary,
                        'app_description'=>$langData->app_description,
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

    public function getSecturityList()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();

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
select distinct tt.message_row_id, m.message_title,
	m.message_type, m.message_text,
  m.message_html, m.message_url,
	if(tt.read_time > 0, 'Y', 'N') as 'read',
	m.message_source,
  u.login_id as source_user,
  tt.read_time,
  u2.login_id as create_user, tt.created_at as create_time
from qp_message m
join
(
	select message_row_id, need_push, push_flag,
			   read_time,deleted_at,qp_user_message.created_at
    from qp_user_message 
left join qp_message on qp_message.row_id = qp_user_message.message_row_id
   where user_row_id = :uId1 
     and deleted_at = '0000-00-00 00:00:00'
     and qp_message.message_type = 'event'
   union
  select message_row_id, need_push, push_flag,
			   read_time,deleted_at, qp_role_message.created_at
    from qp_role_message 
    left join qp_message on qp_message.row_id = qp_role_message.message_row_id
   where role_row_id in (select role_row_id 
                           from qp_user_role 
                          where user_row_id = :uId2) 
		 
     and deleted_at = '0000-00-00 00:00:00'
     and qp_message.message_type = 'news'
) as tt on tt.message_row_id = m.row_id
LEFT JOIN qp_user u on m.source_user_row_id = u.row_id
LEFT JOIN qp_user u2 on m.created_user = u2.row_id
and UNIX_TIMESTAMP(m.created_at) >= $date_from
and UNIX_TIMESTAMP(m.created_at) <= $date_to
order by tt.created_at
SQL;
                $r = DB::select($sql, [':uId1'=>$userId, ':uId2'=>$userId,]);

                if($count_from >= 1) {
                    array_slice($r, $count_from - 1, $count_to - $count_from + 1);
                }

                if(!$useUserDate) {
                    $now = date('Y-m-d H:i:s',time());
                    $user = CommonUtil::getUserInfoByUUID($uuid);
                    \DB::table("qp_register")
                        -> where('user_row_id', '=', $userId)
                        -> where('uuid', '=', $uuid)
                        -> update(['last_message_time'=>$date_to,
                        'updated_at'=>$now,
                        'updated_user'=>$user->row_id]);
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

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('message_row_id', $input))
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $message_row_id = $input["message_row_id"];

        if(!$Verify->chkUuidExist($uuid)) {
            return response()->json(['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>'uuid不存在',
                'content'=>'']);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            $verifyResult = $Verify->verifyToken($uuid, $token);
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                $sql = <<<SQL
select m.row_id as message_row_id, m.message_title,
			  m.message_type, m.message_text,
				m.message_html, m.message_url,
				m.message_source, u2.login_id as create_user,
				u1.login_id as source_user,
				m.created_at as create_time
from qp_message m
left join qp_user u1 on m.source_user_row_id = u1.row_id
left join qp_user u2 on m.created_user = u2.row_id
where m.row_id = :msgId
SQL;
                $msgDetailList = DB::select($sql, [':msgId'=>$message_row_id]);
                if(count($msgDetailList) > 0) {
                    $msgDetail = $msgDetailList[0];
                    $msgDetail->read = "N";
                    $msgDetail->read_time = "";
                    if($msgDetail->message_type == "event") {
                        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
                        $userId = $userInfo->row_id;

                        $sql = <<<SQL
select if(read_time > 0, 'Y', 'N') as 'read', 
	  		read_time 
  from qp_user_message
where message_row_id = :msgId
  and user_row_id = :userId
SQL;
                        $userReadList = DB::select($sql, [':msgId'=>$message_row_id, ':userId'=>$userId]);
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

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || !array_key_exists('message_row_id', $input)
            || !array_key_exists('message_type', $input) || !array_key_exists('status', $input)
        || trim($input["uuid"]) == "" || trim($input["message_row_id"]) == "" || trim($input["message_type"]) == "" || trim($input["status"]) == "")
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];
        $message_row_id = $input["message_row_id"];
        $message_type = $input["message_type"];
        $status = $input["status"];

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
                        -> where('message_row_id', '=', $message_row_id)
                        -> update(
                            ['read_time'=>time(),
                                'updated_at'=>$now,
                                'updated_user'=>$user->row_id]);
                }

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Call Service Successed',
                    'token_valid'=>$verifyResult["token_valid_date"],
                    'content'=>''
                ]);
            } else {
                return response()->json(['result_code'=>$verifyResult["code"],
                    'message'=>$verifyResult["message"],
                    'content'=>array('message_row_id' => $message_row_id)]);
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

            $existPushToken =  \DB::table("qp_push_token")
                    -> where('register_row_id', "=", $registerId)
                    -> where('project_row_id', "=", $projectId)
                    -> where('device_type', "=", $deviceType)
                    -> select('row_id')->get();

            $now = date('Y-m-d H:i:s',time());
            $user = CommonUtil::getUserInfoByUUID($uuid);
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
                $token_valid = time();
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

        //通用api參數判斷
        if(!array_key_exists('app_key', $input) || !array_key_exists('need_push', $input))
        {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>'傳入參數不足或傳入參數格式錯誤',
                'content'=>'']);
        }

        $app_key = $input["app_key"];
        $need_push = $input["need_push"];

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
                $sourceUseId = $jsonContent['source_user_id'];
                $userStatus = CommonUtil::getUserStatusByUserID($sourceUseId);
                if($userStatus == 2) {
                    return response()->json(['result_code'=>ResultCode::_000914_userWithoutRight,
                        'message'=>"账号已被停权",
                        'content'=>'']);
                }
                if($userStatus == 0 || $userStatus == 1) {
                    return response()->json(['result_code'=>ResultCode::_000901_userNotExistError,
                        'message'=>"離職或是帳號資訊打錯",
                        'content'=>'']);
                }

                $userInfo = CommonUtil::getUserInfoByUserID($sourceUseId);
//                if($userInfo == null) {
//                    return response()->json(['result_code'=>ResultCode::_000914_userWithoutRight,
//                        'message'=>"账号已被停权",
//                        'content'=>'']);
//                }

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
                    $userStatus = CommonUtil::getUserStatusByUserID($destinationUserId);
                    if($userStatus == 0) {
                        return response()->json(['result_code'=>ResultCode::_000912_userReceivePushMessageNotExist,
                            'message'=>"接收推播用户不存在",
                            'content'=>'']);
                    }
                    if($userStatus == 1) {
                        return response()->json(['result_code'=>ResultCode::_000901_userNotExistError,
                            'message'=>"離職或是帳號資訊打錯",
                            'content'=>'']);
                    }
                    if($userStatus == 2) {
                        return response()->json(['result_code'=>ResultCode::_000914_userWithoutRight,
                            'message'=>"账号已被停权",
                            'content'=>'']);
                    }

                    $destinationUserInfo = CommonUtil::getUserInfoByUserID($destinationUserId);
//                    if($destinationUserInfo == null) {
//                        return response()->json(['result_code'=>ResultCode::_000912_userReceivePushMessageNotExist,
//                            'message'=>"接收推播用户不存在",
//                            'content'=>'']);
//                    }
                    array_push($destinationUserInfoList, $destinationUserInfo);
                }

                $message_type = $jsonContent['message_type'];
                $message_title = $jsonContent['message_title'];
                $message_text = $jsonContent['message_text'];
                $message_html = $jsonContent['message_html'];
                $message_url = $jsonContent['message_url'];
                $message_source = $jsonContent['message_source'];
                $now = date('Y-m-d H:i:s',time());
                $newMessageId = \DB::table("qp_message")
                    -> insertGetId([
                            'message_type'=>$message_type, 'message_title'=>$message_title,
                            'message_text'=>$message_text, 'message_html'=>$message_html,
                            'message_url'=>$message_url, 'message_source'=>$message_source,
                            'created_user'=>$userInfo->row_id,
                            'created_at'=>$now,
                            'source_user_row_id'=>$userInfo->row_id,'created_at'=>date('Y-m-d H:i:s',time())
                        ]);

                foreach ($destinationUserInfoList as $destinationUserInfo) {
                    \DB::table("qp_user_message")
                        -> insertGetId([
                            'project_row_id'=>$projectInfo->row_id, 'user_row_id'=>$destinationUserInfo->row_id,
                            'message_row_id'=>$newMessageId, 'need_push'=>$need_push,
                            'created_user'=>$userInfo->row_id,
                            'created_at'=>$now,
                            'push_flag'=>'0'
                        ]);
                }

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>'Send Push Message Successed',
                    'content'=>array('jsonContent'=>count($destinationUserIdList),
                        'content'=>$content)//json_encode($jsonContent)
                ]);
            } else {
                return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                    "message"=>"Content-Type錯誤");
            }
        } else {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>$verifyResult["message"],
                'content'=>'']);
        }
    }

    public function updateLastMessageTime() {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        $input = Input::get();
        $request = Request::instance();

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
            if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                \DB::table("qp_register")
                    -> where('uuid', '=', $uuid)
                    -> update(
                        ['last_message_time'=>$last_update_time]);

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
