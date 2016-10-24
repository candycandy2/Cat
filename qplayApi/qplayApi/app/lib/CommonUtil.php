<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午1:25
 */

use Request;
use Illuminate\Support\Facades\Input;

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

        return $userList[0];
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
        //TODO
        return "";
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
        $jpush_app_id = "b376539a868fdf5696228432";//"293a09f63dd77abea15f42c3";  //TODO
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
        $url = "http://aic0-s2.qgroup.corp.com/War/MessageCenter/MessageService.asmx/SendPNS"; //TODO
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
}