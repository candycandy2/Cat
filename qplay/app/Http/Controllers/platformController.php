<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use DB;

class platformController extends Controller
{
    public function process()
    {
        
    }

    public function getUserList()
    {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $userList = \DB::table("qp_user")
            -> where("resign", "=", "N")
            -> select()
            -> get();
        return response()->json($userList);
    }

    public function getRoleList()
    {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $roleList = \DB::table("qp_role")
            -> select()
            -> get();
        foreach ($roleList as $role) {
            $count = \DB::table('qp_user_role')
                ->where('role_row_id', '=', $role->row_id)
                ->count();
            $role->user_count = $count;
        }

        return response()->json($roleList);
    }

    public function removeUserRight() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $userIdList = $jsonContent['user_id_list'];
            foreach ($userIdList as $uId) {
                \DB::table("qp_user")
                    -> where('row_id', '=', $uId)
                    -> update(
                        ['status'=>'N',
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveUser() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $userId = $jsonContent['user_id'];
            $status = $jsonContent['status'];
            $groupId = $jsonContent['groupId'];
            $menuBelongToGroup = $jsonContent['menuBelongToGroup'];
            \DB::beginTransaction();

            try {
                \DB::table("qp_user")
                    -> where('row_id', '=', $userId)
                    -> update(
                        ['status'=>$status,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

                \DB::table("qp_user_role")-> where('user_row_id', "=", $userId)->delete();
                $role_list = $jsonContent['role_list'];
                foreach ($role_list as $roleId)
                {
                    \DB::table("qp_user_role")->insert([
                        'user_row_id'=>$userId,
                        'role_row_id'=>$roleId,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now]);
                }

                \DB::table("qp_user_group")-> where('user_row_id', "=", $userId)->delete();

                \DB::table("qp_user_group")->insert([
                    'user_row_id'=>$userId,
                    'group_row_id'=>$groupId,
                    'created_user'=>\Auth::user()->row_id,
                    'created_at'=>$now]);

                \DB::table("qp_user_menu")-> where('user_row_id', "=", $userId)->delete();

                if($menuBelongToGroup == "Y") {
                    $menuList = \DB::table('qp_group_menu')
                        ->where('group_row_id', '=', $groupId)
                        ->select()->get();
                    foreach ($menuList as $menu) {
                        \DB::table("qp_user_menu")->insert([
                            'user_row_id'=>$userId,
                            'menu_row_id'=>$menu->menu_row_id,
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now]);
                    }
                } else {
                    $menu_list = $jsonContent['menu_list'];
                    foreach ($menu_list as $menuId) {
                        \DB::table("qp_user_menu")->insert([
                            'user_row_id'=>$userId,
                            'menu_row_id'=>$menuId,
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now]);
                    }
                }

                \DB::commit();
            } catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
            }
        } else {
            return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
        }

        return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
    }

    public function deleteRole() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $roleIdList = $jsonContent['role_id_list'];
            foreach ($roleIdList as $rId) {
                \DB::table("qp_role")
                    -> where('row_id', '=', $rId)
                    -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveRole() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $company = $jsonContent['company'];
            $roleDesc = $jsonContent['roleDesc'];

            $isNew = $jsonContent['isNew'];
            if($isNew == 'Y') {
                \DB::table("qp_role")
                    -> insert(
                        ['role_description'=>$roleDesc,
                            'company'=>$company,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $roleId = $jsonContent['roleId'];
                \DB::table("qp_role")
                    -> where('row_id', '=', $roleId)
                    -> update(
                        ['role_description'=>$roleDesc,
                            'company'=>$company,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getRoleUsers() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        $roleId = $input["role_id"];

        $sql = 'select * from qp_user where row_id in (select user_row_id from qp_user_role where role_row_id = '.$roleId.')';
        return DB::select($sql, []);
    }

    public function saveRoleUsers() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $roleId = $jsonContent['role_id'];
            $userIdList = $jsonContent['user_id_list'];
            \DB::beginTransaction();
            \DB::table("qp_user_role")-> where('role_row_id', "=", $roleId)->delete();
            foreach ($userIdList as $uId) {
                \DB::table("qp_user_role")
                    -> insert(
                        ['user_row_id'=>$uId,
                            'role_row_id'=>$roleId,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);

            }
            \DB::commit();
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getRootMenuList() {
        $rootMenuList = \DB::table("qp_menu")
            -> where("parent_id", "=", "0")
            -> select()
            -> get();

        foreach ($rootMenuList as $menu) {
            $menuId = $menu->row_id;

            //count sub
            $menu->number_submenu = 0;
            $sql = "select count(*) as num from qp_menu where parent_id = ".$menuId;
            $menu->number_submenu = DB::select($sql, [])[0] -> num;

            //multi language
            $menu->english_name = "";
            $lang_code = 'en-us';
            $sql = "select * from qp_menu_language where menu_row_id = ".$menuId
                ." and lang_row_id in (select row_id from qp_language where lang_code = '".$lang_code."')";
            $res = DB::select($sql, []);
            if(count($res) > 0) {
                $menu->english_name = $res[0] -> menu_name;
            }

            $menu->simple_chinese_name = "";
            $lang_code = 'zh-cn';
            $sql = "select * from qp_menu_language where menu_row_id = ".$menuId
                ." and lang_row_id in (select row_id from qp_language where lang_code = '".$lang_code."')";
            $res = DB::select($sql, []);
            if(count($res) > 0) {
                $menu->simple_chinese_name = $res[0] -> menu_name;
            }

            $menu->traditional_chinese_name = "";
            $lang_code = 'zh-tw';
            $sql = "select * from qp_menu_language where menu_row_id = ".$menuId
                ." and lang_row_id in (select row_id from qp_language where lang_code = '".$lang_code."')";
            $res = DB::select($sql, []);
            if(count($res) > 0) {
                $menu->traditional_chinese_name = $res[0] -> menu_name;
            }
        }
        return $rootMenuList;
    }

    public function getSubMenuList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        $menuId = $input["menu_id"];

        $menuList = \DB::table("qp_menu")
            -> where("parent_id", "=", $menuId)
            -> select()
            -> get();
        for($i = 0; $i < count($menuList); $i ++) {
            $menu = $menuList[$i];
            $menuList[$i] = CommonUtil::getMenuMultyLanguage($menu);
        }

        return $menuList;
    }

    public function deleteMenu() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $roleIdList = $jsonContent['menu_id_list'];
            foreach ($roleIdList as $mId) {
                \DB::table("qp_menu")
                    -> where('row_id', '=', $mId)
                    -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function newMenu() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $parentId = $jsonContent['parentId'];
            $menuName = $jsonContent['menuName'];
            $link = $jsonContent['link'];
            $englishName = $jsonContent['englishName'];
            $simpleChineseName = $jsonContent['simpleChineseName'];
            $traditionChineseName = $jsonContent['traditionChineseName'];

            \DB::beginTransaction();
            $sequence = 0;
            $sql = "select max(sequence) as maxSeq from qp_menu where parent_id = ".$parentId;
            $resList = DB::select($sql, []);
            if($resList > 0) {
                $sequence = $resList[0]->maxSeq + 1;
            }
            try {
                $newMenuId = \DB::table("qp_menu")
                    -> insertGetId([
                        'parent_id'=>$parentId,
                        'menu_name'=>$menuName,
                        'path'=>$link,
                        'sequence'=>$sequence,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                $lang_code = 'en-us';
                $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
                $resList = DB::select($sql, []);
                if($resList > 0) {
                    $lang_id = $resList[0]->row_id;
                    \DB::table("qp_menu_language")
                        -> insertGetId([
                            'menu_row_id'=>$newMenuId,
                            'lang_row_id'=>$lang_id,
                            'menu_name'=>$englishName,
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);
                }
                $lang_code = 'zh-cn';
                $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
                $resList = DB::select($sql, []);
                if($resList > 0) {
                    $lang_id = $resList[0]->row_id;
                    \DB::table("qp_menu_language")
                        -> insertGetId([
                            'menu_row_id'=>$newMenuId,
                            'lang_row_id'=>$lang_id,
                            'menu_name'=>$simpleChineseName,
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);
                }
                $lang_code = 'zh-tw';
                $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
                $resList = DB::select($sql, []);
                if($resList > 0) {
                    $lang_id = $resList[0]->row_id;
                    \DB::table("qp_menu_language")
                        -> insertGetId([
                            'menu_row_id'=>$newMenuId,
                            'lang_row_id'=>$lang_id,
                            'menu_name'=>$traditionChineseName,
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);
                }

                \DB::commit();
            } catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

}
