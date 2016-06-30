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
        $status_code = 1;//TODO for test: $Verify->json();
        $request = Request::instance();
        $redirect_uri = $request->header('redirect-uri');
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
                    'device_type'=>'android', //TODO unknow device type
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
        $status_code = 1;//TODO for test: $Verify->json();
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
        $status_code = 1;//TODO for test: $Verify->json();
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
        $status_code = 1;//TODO for test: $Verify->json();
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
}
