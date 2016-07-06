<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Input;
use Mockery\CountValidator\Exception;
use Request;
use App\Http\Requests;
use App\lib\ResultCode;
use App\lib\Verify;
use DB;


class qplayController extends Controller
{
    static $TOKEN_VALIDATE_TIME = 2 * 86400;

    public function getSecturityList()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();

        $request = Request::instance();
        $appKey = $request->header('App-Key');
        if ($status_code == ResultCode::_1_reponseSuccessful) {
            $app_row_id = \DB::table("qp_app_head")->join("qp_project","project_row_id",  "=", "qp_project.row_id")
                -> where('qp_project.app_key', "=", $appKey)
                ->select('qp_app_head.row_id')->lists('qp_app_head.row_id');

//            select * from qp_white_list where app_row_id = (
//                select row_id from qp_app_head where project_row_id = (
//                    select row_id from qp_project where app_key = 'qplay'
//            ))
            $whitelist = \DB::table("qp_white_list")
                -> whereNull('deleted_at')
                -> where('app_row_id', "=", $app_row_id)
                -> select('allow_url')->get();

//            select security_level from qp_app_head where project_row_id = (
//                select row_id from qp_project where app_key = 'qplay')
            $level = \DB::table("qp_app_head")->join("qp_project","project_row_id",  "=", "qp_project.row_id")
                -> where('qp_project.app_key', "=", $appKey)
                ->select('security_level')->lists('security_level');


            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>'Call Service Successed',
                'content'=>json_encode($whitelist),
                'security_level'=>$level[0],
            ]);
//            ->header("version", "1.0.1")
//            ->header("name", "qplay")
//            ->header("action", "getSecturityList");
        } else {
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Failed',
                'content'=>'']);
        }

    }

    public function register()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $redirect_uri = $request->header('redirect-uri');
        $input = Input::get();
        $uuid = $input["uuid"];
        $device_type = $input["device_type"];
        if($status_code == ResultCode::_1_reponseSuccessful) {

            $domain = $request->header('domain');
            $loginid = $request->header('loginid');
            $password = $request->header('password');

            $status_code = ResultCode::_1_reponseSuccessful;
            if($uuid == null || $redirect_uri == null || $domain == null || $loginid == null || $password == null)
            {
                $status_code = ResultCode::_999001_requestParameterLostOrIncorrect;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Parameter Error',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }


            //Check user
            $userList = \DB::table("qp_user")
                -> where('login_id', "=", $loginid)
                -> select('row_id', 'login_id', 'emp_no', 'emp_name', 'email', 'user_domain', 'company'
                , 'department', 'status', 'resign')->get();
            if(count($userList) == 0)
            {
                $status_code = ResultCode::_000901_userNotExistError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'User Not Exist',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }
            $user = $userList[0];
            if($user->status != "Y" || $user->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }

            //Check user password with LDAP
            $LDAP_SERVER_IP = "";
            $LDAP_SERVER_PORT = "";
            //TODO for test: $ldapConnect = ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
            $bind= true;//TODO for test: @ldap_bind($ldapConnect, $loginid, $password);
            if(!$bind)
            {
                $status_code = ResultCode::_000902_passwordError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Password Error',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }

            //Check uuid exist
            //Check user
            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> select('uuid')->get();
            if(count($uuidList) > 0)
            {
                $status_code = ResultCode::_000903_deviceHasRegistered;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Device Has Registered',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }


            $token = uniqid();  //生成token
            $token_valid = time();
            try
            {
                \DB::table("qp_register")->insert([
                    'user_row_id'=>$user->row_id,
                    'uuid'=>$uuid,
                    'device_type'=>$device_type,
                    'register_date'=>date('Y-m-d H:i:s',time()),
                    'status'=>'A',
                    'remember_token'=>$token]);
                $sessionList = \DB::table("qp_session")
                    -> where('uuid', "=", $uuid, 'user_row_id', '=', $user->row_id)
                    -> select('uuid')->get();
                if(count($sessionList) > 0)
                {
                    \DB::table("qp_session")->where('user_row_id', '=', $user->row_id,
                        'uuid', '=', $uuid)->update([
                        'token'=>$token,
                        'token_valid_date'=>date('Y-m-d H:i:s',time()),
                    ]);
                }
                else
                {
                    \DB::table("qp_session")->insert([
                        'user_row_id'=>$user->row_id,
                        'uuid'=>$uuid,
                        'token'=>$token,
                        'token_valid_date'=>date('Y-m-d H:i:s',time()),
                    ]);
                }
            }
            catch (Exception $e)
            {
                $status_code = ResultCode::_999999_unknownError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Call Service Error',
                    'token_valid'=>$token_valid,
                    'content'=>array("uuid" => $uuid, "redirect_uri"=>$redirect_uri, "token"=>$token)
                ]);
            }

            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Successed',
                'token_valid'=>$token_valid,
                'content'=>array("uuid" => $uuid, "redirect_uri"=>$redirect_uri, "token"=>$token)
            ]);
        }
        else
        {
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Failed',
                'content'=>array("redirect_uri"=>$redirect_uri)]);
        }
    }

    public function isRegister()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $input = Input::get();
        $uuid = $input["uuid"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> select('uuid')->get();
            if(count($uuidList) > 0)
            {
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Device Has Registered',
                    'content'=>array("is_register"=>1)]);
            }
            else
            {
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Device Has not Registered',
                    'content'=>array("is_register"=>0)]);
            }
        }
        else
        {
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Failed',
                'content'=>'']);
        }
    }

    public function login()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $redirect_uri = $request->header('redirect-uri');
        $appKey = $request->header('App-Key');
        $input = Input::get();
        $uuid = $input["uuid"];
        if($status_code == ResultCode::_1_reponseSuccessful) {

            $domain = $request->header('domain');
            $loginid = $request->header('loginid');
            $password = $request->header('password');

            $status_code = ResultCode::_1_reponseSuccessful;
            if($uuid == null || $redirect_uri == null || $domain == null || $loginid == null || $password == null)
            {
                $status_code = ResultCode::_999001_requestParameterLostOrIncorrect;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Parameter Error',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }


            //Check user
            $userList = \DB::table("qp_user")
                -> where('login_id', "=", $loginid)
                -> select('row_id', 'login_id', 'emp_no', 'emp_name', 'email', 'user_domain', 'company'
                    , 'department', 'status', 'resign')->get();
            if(count($userList) == 0)
            {
                $status_code = ResultCode::_000901_userNotExistError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'User Not Exist',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }
            $user = $userList[0];
            if($user->status != "Y" || $user->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }

            //Check user password with LDAP
            $LDAP_SERVER_IP = "";
            $LDAP_SERVER_PORT = "";
            //TODO for test: $ldapConnect = ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
            $bind= true;//TODO for test: @ldap_bind($ldapConnect, $loginid, $password);
            if(!$bind)
            {
                $status_code = ResultCode::_000902_passwordError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Password Error',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }

            //Check uuid exist
            //Check user
            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> select('row_id','uuid', 'user_row_id')->get();
            $uuidInDB = null;
            if(count($uuidList) < 1)
            {
                $status_code = ResultCode::_000905_deviceNotRegistered;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Device Not Registered',
                    'content'=>array("redirect_uri"=>$redirect_uri)]);
            }
            else
            {
                $uuidInDB = $uuidList[0];
                if($user->row_id != $uuidInDB->user_row_id)
                {
                    $status_code = ResultCode::_000904_loginUserNotMathRegistered;
                    return response()->json(['result_code'=>$status_code,
                        'message'=>'User Not Match Device',
                        'content'=>array("redirect_uri"=>$redirect_uri)]);
                }
            }

            $token = uniqid();  //生成token
            $token_valid = time();
            try
            {
//                \DB::table("qp_register")->where('row_id','=', $uuidInDB->row_id)->update([
//                    'remember_token'=>$token]);
                $sessionList = \DB::table("qp_session")
                    -> where('uuid', "=", $uuid) ->where('user_row_id', '=', $user->row_id)
                    -> select('uuid')->get();
                if(count($sessionList) > 0)
                {
                    \DB::table("qp_session")->where('user_row_id', '=', $user->row_id)->where('uuid', '=', $uuid)->update([
                        'token'=>$token,
                        'token_valid_date'=>date('Y-m-d H:i:s',time()),
                    ]);
                }
                else
                {
                    \DB::table("qp_session")->insert([
                        'user_row_id'=>$user->row_id,
                        'uuid'=>$uuid,
                        'token'=>$token,
                        'token_valid_date'=>time(),//'token_valid_date'=>date('Y-m-d H:i:s',time()),
                    ]);
                }
            }
            catch (Exception $e)
            {
                $status_code = ResultCode::_999999_unknownError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Call Service Error',
                    'token_valid'=>$token_valid,
                    'content'=>array("redirect_uri"=>$redirect_uri)
                ]);
            }

            $appHeader = \DB::table("qp_app_head")->join("qp_project","project_row_id",  "=", "qp_project.row_id")
                -> where('qp_project.app_key', "=", $appKey)
                ->select('qp_app_head.updated_at','security_level')->get();
            $security_updated_at = $appHeader[0]->updated_at;
            return response()->json(['result_code'=>$status_code,
                'message'=>'Login Successed',
                'token_valid'=>$token_valid,
                'content'=>array("uuid" => $uuid, "redirect_uri"=>$redirect_uri, "token"=>$token,
                    'security_updated_at' => $security_updated_at)
            ]);
        }
        else
        {
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Failed',
                'content'=>array("redirect_uri"=>$redirect_uri)]);
        }
    }

    public function logout()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $appKey = $request->header('App-Key');
        $input = Input::get();
        $uuid = $input["uuid"];
        $domain = $input['domain'];
        $loginid = $input['loginid'];
        if($status_code == ResultCode::_1_reponseSuccessful) {
            $status_code = ResultCode::_1_reponseSuccessful;
            if($uuid == null || $domain == null || $loginid == null )
            {
                $status_code = ResultCode::_999001_requestParameterLostOrIncorrect;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Parameter Error',
                    'content'=>'']);
            }

            //Check user
            $userList = \DB::table("qp_user")
                -> where('login_id', "=", $loginid)
                -> select('row_id', 'login_id', 'emp_no', 'emp_name', 'email', 'user_domain', 'company'
                    , 'department', 'status', 'resign')->get();
            if(count($userList) == 0)
            {
                $status_code = ResultCode::_000901_userNotExistError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'User Not Exist',
                    'content'=>'']);
            }
            $user = $userList[0];
            if($user->status != "Y" || $user->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            //Check user password with LDAP
            $LDAP_SERVER_IP = "";
            $LDAP_SERVER_PORT = "";
            //TODO for test: $ldapConnect = ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
            $bind= true;//TODO for test: @ldap_bind($ldapConnect, $loginid, $password);
            if(!$bind)
            {
                $status_code = ResultCode::_000902_passwordError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Password Error',
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
                $status_code = ResultCode::_000905_deviceNotRegistered;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Device Not Registered',
                    'content'=>'']);
            }
            else
            {
                $uuidInDB = $uuidList[0];
                if($user->row_id != $uuidInDB->user_row_id)
                {
                    $status_code = ResultCode::_000904_loginUserNotMathRegistered;
                    return response()->json(['result_code'=>$status_code,
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
                $status_code = ResultCode::_999999_unknownError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Call Service Error',
                    'content'=>''
                ]);
            }

            return response()->json(['result_code'=>$status_code,
                'message'=>'Logout Successed',
                'content'=>array("uuid" => $uuid)
            ]);
        }
        else
        {
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Failed',
                'content'=>'']);
        }
    }

    public function checkAppVersion()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $appKey = $request->header('App-Key');
        $input = Input::get();
        $package_name = $input["package_name"];
        $device_type = $input['device_type'];
        $version_code = $input['version_code'];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $app_row_id = \DB::table("qp_app_head")->join("qp_project","project_row_id",  "=", "qp_project.row_id")
                -> where('qp_project.app_key', "=", $appKey)
                ->select('qp_app_head.row_id')->lists('qp_app_head.row_id');
            $versionList = \DB::table("qp_app_version")
                -> where('app_row_id', "=", $app_row_id)
                ->where('device_type', '=', $device_type)
                ->where('status', '=', 'ready')
                -> select('version_code', 'url')->get();
            if(count($versionList) != 1)
            {
                $status_code = ResultCode::_999999_unknownError;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Call Service Failed',
                    'content'=>'']);
            }

            $versionLine = $versionList[0];
            if($versionLine->version_code == $version_code)
            {
                $status_code = ResultCode::_000913_NotNeedUpdate;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'App version is Nearest',
                    'content'=>'']);
            }
            else
            {
                $status_code = ResultCode::_1_reponseSuccessful;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Need to update',
                    'content'=>array("version_code"=>$versionLine->version_code,
                        'download_url'=>$versionLine->url)]);
            }
        }
        else
        {
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Failed',
                'content'=>'']);
        }
    }

    public function getAppList()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $appKey = $request->header('App-Key');
        $token = $request->header('token');
        $input = Input::get();
        $uuid = $input["uuid"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $sessionList = \DB::table("qp_session")
                -> where('uuid', "=", $uuid)
                -> where('token', '=', $token)
                -> select('token_valid_date')->get();
            if(count($sessionList) < 1)
            {
                $status_code = ResultCode::_000908_tokenInvalid;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Invalid',
                    'content'=>'']);
            }

            $token_valid_date = $sessionList[0]->token_valid_date;
            $ts = time() - strtotime($token_valid_date);
            if($ts > qplayController::$TOKEN_VALIDATE_TIME)
            {
                $status_code = ResultCode::_000907_tokenOverdue;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Overdue',
                    'content'=>'']);
            }

            $userList = DB::select('select * from qp_user where row_id = (select user_row_id from qp_register where uuid = :uuid)', [':uuid'=>$uuid]);
            if(count($userList) < 1 || $userList[0]->status != "Y" || $userList[0]->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            $registerInfo = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> select('uuid', 'device_type')->get();
            $device_type = $registerInfo[0]->device_type;

            $sql = <<<SQL
select h.row_id as app_id, p.app_key as app_code,
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

            $appDataList = DB::select($sql, [':id1'=>$userList[0]->row_id,
                    ':id2'=>$userList[0]->row_id,
                    ':device_type'=>$device_type,
                    ':id3'=>$userList[0]->row_id]
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
            $sql = <<<SQL
select row_id as category_id, app_category, sequence from qp_app_category
where row_id in (:idList)
SQL;
            $categoryDataList = DB::select($sql, [':idList'=>$categoryIdListStr]);
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
            $sql = <<<SQL
select line.app_row_id,lang.row_id as lang_id,lang.lang_code as lang, line.app_name, 
line.app_summary, line.app_description 
from qp_app_line line, qp_language lang
where line.lang_row_id = lang.row_id
and line.app_row_id in (:idList)
SQL;
            $langDataList = DB::select($sql, [':idList'=>$appIdListStr]);
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


            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Successed',
                'token_valid'=>$token_valid_date,
                'content'=>array(
                    'app_category_list'=>$app_category_list,
                    'app_list'=>$app_list,
                    'multi_lang'=>$multi_lang)  //TODO
            ]);

        }
    }

    public function getMessageList()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $appKey = $request->header('App-Key');
        $token = $request->header('token');
        $input = Input::get();
        $uuid = $input["uuid"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $sessionList = \DB::table("qp_session")
                -> where('uuid', "=", $uuid)
                -> where('token', '=', $token)
                -> select('token_valid_date')->get();
            if(count($sessionList) < 1)
            {
                $status_code = ResultCode::_000908_tokenInvalid;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Invalid',
                    'content'=>'']);
            }

            $token_valid_date = $sessionList[0]->token_valid_date;
            $ts = time() - strtotime($token_valid_date);
            if($ts > qplayController::$TOKEN_VALIDATE_TIME)
            {
                $status_code = ResultCode::_000907_tokenOverdue;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Overdue',
                    'content'=>'']);
            }

            $userList = DB::select('select * from qp_user where row_id = (select user_row_id from qp_register where uuid = :uuid)', [':uuid'=>$uuid]);
            if(count($userList) < 1 || $userList[0]->status != "Y" || $userList[0]->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }
            $project_id = \DB::table("qp_project")
                -> where('app_key', "=", $appKey)
                ->select('row_id')->lists('row_id');

            $userId = $userList[0]->row_id;
            $sql = <<<SQL
select message_row_id, need_push, push_flag,
			 read_time,deleted_at
from qp_user_message where project_row_id = :pId1 and user_row_id = :uId1 and deleted_at != '0'
union
select message_row_id, need_push, push_flag,
			 read_time,deleted_at
from qp_role_message where project_row_id = :pId2 and role_row_id in (
	select role_row_id from qp_user_role where user_row_id = :uId2
) and deleted_at != '0'
SQL;
            $r = DB::select($sql, [':pId1'=>$project_id, ':pId2'=>$project_id,
                        ':uId1'=>$userId, ':uId2'=>$userId,]);
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Successed',
                'content'=>$r
            ]);

        }
    }

    public function getMessageDetail()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $token = $request->header('token');
        $input = Input::get();
        $uuid = $input["uuid"];
        $message_row_id = $input["message_row_id"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $sessionList = \DB::table("qp_session")
                -> where('uuid', "=", $uuid)
                -> where('token', '=', $token)
                -> select('token_valid_date')->get();
            if(count($sessionList) < 1)
            {
                $status_code = ResultCode::_000908_tokenInvalid;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Invalid',
                    'content'=>'']);
            }

            $token_valid_date = $sessionList[0]->token_valid_date;
            $ts = time() - strtotime($token_valid_date);
            if($ts > qplayController::$TOKEN_VALIDATE_TIME)
            {
                $status_code = ResultCode::_000907_tokenOverdue;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Overdue',
                    'content'=>'']);
            }

            $userList = DB::select('select * from qp_user where row_id = (select user_row_id from qp_register where uuid = :uuid)', [':uuid'=>$uuid]);
            if(count($userList) < 1 || $userList[0]->status != "Y" || $userList[0]->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            $msgDetail = \DB::table("qp_message")
                -> where('row_id', "=", $message_row_id)
                ->select('row_id', 'message_type', 'message_text', 'message_html', 'message_url', 'message_source', 'source_user_row_id')->get();
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Successed',
                'content'=>$msgDetail
            ]);

        }
    }

    public function updateMessage()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $token = $request->header('token');
        $input = Input::get();
        $uuid = $input["uuid"];
        $message_row_id = $input["message_row_id"];
        $message_type = $input["message_type"];
        $status = $input["status"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $sessionList = \DB::table("qp_session")
                -> where('uuid', "=", $uuid)
                -> where('token', '=', $token)
                -> select('token_valid_date')->get();
            if(count($sessionList) < 1)
            {
                $status_code = ResultCode::_000908_tokenInvalid;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Invalid',
                    'content'=>'']);
            }

            $token_valid_date = $sessionList[0]->token_valid_date;
            $ts = time() - strtotime($token_valid_date);
            if($ts > qplayController::$TOKEN_VALIDATE_TIME)
            {
                $status_code = ResultCode::_000907_tokenOverdue;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Overdue',
                    'content'=>'']);
            }

            $userList = DB::select('select * from qp_user where row_id = (select user_row_id from qp_register where uuid = :uuid)', [':uuid'=>$uuid]);
            if(count($userList) < 1 || $userList[0]->status != "Y" || $userList[0]->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            if($status == 'read') {
                \DB::table("qp_user_message")->where('user_row_id', '=', $userList[0]->row_id)
                    ->where('message_row_id', '=', $message_row_id)->update([
                        'read_time'=>time()]);
            }

            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Successed',
                'content'=>''
            ]);
        }
    }

    public function sendPushToken()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $token = $request->header('token');
        $pushToken = $request->header('push-token');
        $input = Input::get();
        $uuid = $input["uuid"];
        $appKey = $input["app_key"];
        $deviceType = $input["device_type"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $sessionList = \DB::table("qp_session")
                -> where('uuid', "=", $uuid)
                -> where('token', '=', $token)
                -> select('token_valid_date')->get();
            if(count($sessionList) < 1)
            {
                $status_code = ResultCode::_000908_tokenInvalid;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Invalid',
                    'content'=>'']);
            }

            $token_valid_date = $sessionList[0]->token_valid_date;
            $ts = time() - strtotime($token_valid_date);
            if($ts > qplayController::$TOKEN_VALIDATE_TIME)
            {
                $status_code = ResultCode::_000907_tokenOverdue;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Overdue',
                    'content'=>'']);
            }

            $userList = DB::select('select * from qp_user where row_id = (select user_row_id from qp_register where uuid = :uuid)', [':uuid'=>$uuid]);
            if(count($userList) < 1 || $userList[0]->status != "Y" || $userList[0]->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            $uuidList = \DB::table("qp_register")
                -> where('uuid', "=", $uuid)
                -> where('device_type', "=", $deviceType)
                -> select('uuid', 'row_id')->get();
            if(count($uuidList) < 1)
            {
                $status_code = ResultCode::_000903_deviceHasRegistered;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Device not Registered',
                    'content'=>'']);
            }

            $registerId = $uuidList[0]->row_id;

            $projectId = \DB::table("qp_project")
                -> where('app_key', "=", $appKey)
                ->select('row_id')->lists('row_id')[0];

            $existPushToken =  \DB::table("qp_push_token")
                    -> where('register_row_id', "=", $registerId)
                    -> where('project_row_id', "=", $projectId)
                    -> where('device_type', "=", $deviceType)
                    -> select('row_id')->get();

            if(count($existPushToken) > 0)
            {
                \DB::table("qp_push_token")
                    -> where('register_row_id', "=", $registerId)
                    -> where('project_row_id', "=", $projectId)
                    -> where('device_type', "=", $deviceType)
                    ->update(['push_token'=>$pushToken]);
            }
            else
            {
                \DB::table("qp_push_token")->insert([
                    'register_row_id'=>$registerId,
                    'project_row_id'=>$projectId,
                    'push_token'=>$pushToken,
                    'device_type'=>$deviceType]);
            }

            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Successed',
                'content'=>''
            ]);
        }
    }

    public function renewToken()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $token = $request->header('token');
        $input = Input::get();
        $uuid = $input["uuid"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $sessionList = \DB::table("qp_session")
                -> where('uuid', "=", $uuid)
                -> where('token', '=', $token)
                -> select('token_valid_date')->get();
            if(count($sessionList) < 1)
            {
                $status_code = ResultCode::_000908_tokenInvalid;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Invalid',
                    'content'=>'']);
            }

            $token_valid_date = $sessionList[0]->token_valid_date;
            $ts = time() - strtotime($token_valid_date);
            if($ts > qplayController::$TOKEN_VALIDATE_TIME)
            {
                $status_code = ResultCode::_000907_tokenOverdue;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Overdue',
                    'content'=>'']);
            }

            $userList = DB::select('select * from qp_user where row_id = (select user_row_id from qp_register where uuid = :uuid)', [':uuid'=>$uuid]);
            if(count($userList) < 1 || $userList[0]->status != "Y" || $userList[0]->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            $token = uniqid();
            $token_valid = time();
            \DB::table("qp_session")
                -> where('user_row_id', "=", $userList[0]->row_id)
                -> where('uuid', "=", $uuid)
                ->update(['token'=>$token, 'token_valid_date'=>$token_valid]);

            return response()->json(['result_code'=>$status_code,
                'message'=>'Renew Successed',
                'token_valid'=>$token_valid,
                'content'=>array("uuid" => $uuid, "token"=>$token)
            ]);
        }
    }

    public function sendPushMessage()
    {
        $Verify = new Verify();
        $status_code = $Verify->json();
        $request = Request::instance();
        $token = $request->header('token');
        $input = Input::get();
        $uuid = $input["uuid"];
        if($status_code == ResultCode::_1_reponseSuccessful)
        {
            $sessionList = \DB::table("qp_session")
                -> where('uuid', "=", $uuid)
                -> where('token', '=', $token)
                -> select('token_valid_date')->get();
            if(count($sessionList) < 1)
            {
                $status_code = ResultCode::_000908_tokenInvalid;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Invalid',
                    'content'=>'']);
            }

            $token_valid_date = $sessionList[0]->token_valid_date;
            $ts = time() - strtotime($token_valid_date);
            if($ts > qplayController::$TOKEN_VALIDATE_TIME)
            {
                $status_code = ResultCode::_000907_tokenOverdue;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Token Overdue',
                    'content'=>'']);
            }

            $userList = DB::select('select * from qp_user where row_id = (select user_row_id from qp_register where uuid = :uuid)', [':uuid'=>$uuid]);
            if(count($userList) < 1 || $userList[0]->status != "Y" || $userList[0]->resign != "N")
            {
                $status_code = ResultCode::_000914_userWithoutRight;
                return response()->json(['result_code'=>$status_code,
                    'message'=>'Access Forbidden',
                    'content'=>'']);
            }

            $token = uniqid();
            $token_valid = time();
            \DB::table("qp_session")
                -> where('user_row_id', "=", $userList[0]->row_id)
                -> where('uuid', "=", $uuid)
                ->update(['token'=>$token, 'token_valid_date'=>$token_valid]);

            return response()->json(['result_code'=>$status_code,
                'message'=>'Renew Successed',
                'token_valid'=>$token_valid,
                'content'=>array("uuid" => $uuid, "token"=>$token)
            ]);
        }
    }
}
