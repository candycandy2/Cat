<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午1:25
 */

use DB;
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
            -> select('qp_user.row_id', 'qp_user.emp_no')->get();
        if(count($userList) < 1) {
            return null;
        }

        return $userList[0];
    }

    public static function getUserEnableInfoByUserID($loginId)
    {
        $userList = \DB::table('qp_user')
            -> where('qp_user.resign', '=', 'N')
            -> where('qp_user.login_id', '=', $loginId)
            -> select()->get();
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

    public static function getAllCompanyRoleList()
    {
        $companyList = \DB::table('qp_role')
            ->select('company')->distinct()->get();
        foreach ($companyList as $company) {
            $roleList = \DB::table('qp_role')
                ->where('company', '=', $company->company)
                ->select()->get();
            $company->roles = array();
            foreach ($roleList as $role)
            {
                $company->roles[] = $role;
            }
        }

        return $companyList;
    }

    public static function getAllGroupList()
    {
        $groupList = \DB::table('qp_group')
            ->select()->get();

        return $groupList;
    }

    public static function getAllMenuList()
    {
        $lang = 'en-us';
        if(\Session::has("lang"))
        {
            $lang = \Session::get("lang");
        }
        $sql = <<<SQL
select menu.row_id as Id, menu.menu_name as Name, path as Url, parent_id as pId , ml.menu_name as sName
from qp_menu menu
join qp_menu_language ml on ml.menu_row_id = menu.row_id
and ml.lang_row_id in (select l.row_id from qp_language l where l.lang_code = '$lang')
SQL;
        $menuList = $r = DB::select($sql, []);

        return $menuList;
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
}