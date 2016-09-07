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
            -> orderBy('company', 'role_description')
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
                    'authority_by_group'=>$menuBelongToGroup,
                    'created_user'=>\Auth::user()->row_id,
                    'created_at'=>$now]);

                \DB::table("qp_user_menu")-> where('user_row_id', "=", $userId)->delete();

                if($menuBelongToGroup == "Y") {
//                    $menuList = \DB::table('qp_group_menu')
//                        ->where('group_row_id', '=', $groupId)
//                        ->select()->get();
//                    foreach ($menuList as $menu) {
//                        \DB::table("qp_user_menu")->insert([
//                            'user_row_id'=>$userId,
//                            'menu_row_id'=>$menu->menu_row_id,
//                            'created_user'=>\Auth::user()->row_id,
//                            'created_at'=>$now]);
//                    }
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
            $existList = \DB::table("qp_role")->where('role_description', '=', $roleDesc)
                ->where('company', '=', $company)->select()->get();
            if($isNew == 'Y') {
                if(count($existList) > 0) {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError, 'message'=>trans("messages.ERR_EXIST_ROLE")]);
                }
                \DB::table("qp_role")
                    -> insert(
                        ['role_description'=>$roleDesc,
                            'company'=>$company,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $roleId = $jsonContent['roleId'];
                if(count($existList) > 0) {
                    if($existList[0]->row_id != $roleId) {
                        return response()->json(['result_code'=>ResultCode::_999999_unknownError, 'message'=>trans("messages.ERR_EXIST_ROLE")]);
                    }
                }
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

        return CommonUtil::getSubMenuList($menuId);
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
            $visible = $jsonContent['visible'];

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
                        'visible'=>$visible,
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

    public function saveRootMenu() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $menu_id = $jsonContent['menu_id'];
            $sub_menu_list = $jsonContent['sub_menu_list'];
            $menu_name = $jsonContent['menu_name'];
            $link = $jsonContent['link'];
            $english_name = $jsonContent['english_name'];
            $simple_chinese_name = $jsonContent['simple_chinese_name'];
            $tradition_chinese_name = $jsonContent['tradition_chinese_name'];
            $visible = $jsonContent['visible'];
            \DB::beginTransaction();

            \DB::table("qp_menu")
                -> where('row_id', '=', $menu_id)
                -> update(
                    ['menu_name'=>$menu_name,
                        'path'=>$link,
                        'visible'=>$visible,
                        'updated_at'=>$now,
                        'updated_user'=>\Auth::user()->row_id]);

            $lang_code = 'en-us';
            $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
            $resList = DB::select($sql, []);
            if($resList > 0) {
                $lang_id = $resList[0]->row_id;
                \DB::table("qp_menu_language")
                    -> where('menu_row_id', "=", $menu_id)
                    -> where('lang_row_id', "=", $lang_id)
                    -> update(['menu_name'=>$english_name,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now]);
            }
            $lang_code = 'zh-cn';
            $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
            $resList = DB::select($sql, []);
            if($resList > 0) {
                $lang_id = $resList[0]->row_id;
                \DB::table("qp_menu_language")
                    -> where('menu_row_id', "=", $menu_id)
                    -> where('lang_row_id', "=", $lang_id)
                    -> update(['menu_name'=>$simple_chinese_name,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now]);
            }
            $lang_code = 'zh-tw';
            $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
            $resList = DB::select($sql, []);
            if($resList > 0) {
                $lang_id = $resList[0]->row_id;
                \DB::table("qp_menu_language")
                    -> where('menu_row_id', "=", $menu_id)
                    -> where('lang_row_id', "=", $lang_id)
                    -> update(['menu_name'=>$tradition_chinese_name,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now]);
            }

            //SUB
            $oriSubMenuList = CommonUtil::getSubMenuList($menu_id);
            $deleteMenuIdList = array();
            //Check delete
            foreach ($oriSubMenuList as $menu) {
                $exist = false;
                foreach ($sub_menu_list as $currentMenu) {
                    if($currentMenu["row_id"] == $menu->row_id) {
                        $exist = true;
                        break;
                    }
                }
                if(!$exist) {
                    array_push($deleteMenuIdList, $menu->row_id);
                }
            };
            //delete
            foreach ($deleteMenuIdList as $deleteMenuId) {
                \DB::table("qp_menu_language")
                    -> where('menu_row_id', "=", $deleteMenuId)
                    -> delete();
                \DB::table("qp_menu")
                    -> where('row_id', "=", $deleteMenuId)
                    -> delete();
            }

            //update and insert
            for($i = 0; $i < count($sub_menu_list); $i++) {
                $seq = $i + 1;
                $thisMenu = $sub_menu_list[$i];
                if(strstr($thisMenu["row_id"], "temp_id_")) { //insert
                    $newMenuId = \DB::table("qp_menu")
                        -> insertGetId([
                            'parent_id'=>$menu_id,
                            'menu_name'=>$thisMenu["menu_name"],
                            'path'=>$thisMenu["path"],
                            'visible'=>$thisMenu["visible"],
                            'sequence'=>$seq,
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);

                    $lang_code = 'en-us';
                    $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
                    $resList = DB::select($sql, []);
                    if($resList > 0) {
                        $lang_id = $resList[0]->row_id;
                        \DB::table("qp_menu_language")
                            -> insert([
                                'menu_row_id'=>$newMenuId,
                                'lang_row_id'=>$lang_id,
                                'menu_name'=>$thisMenu["english_name"],
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
                                'menu_name'=>$thisMenu["simple_chinese_name"],
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
                                'menu_name'=>$thisMenu["traditional_chinese_name"],
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);
                    }
                } else { //update
                    \DB::table("qp_menu")
                        -> where("row_id", "=", $thisMenu["row_id"])
                        -> update([
                            'menu_name'=>$thisMenu["menu_name"],
                            'path'=>$thisMenu["path"],
                            'visible'=>$thisMenu["visible"],
                            'sequence'=>$seq,
                            'updated_user'=>\Auth::user()->row_id,
                            'updated_at'=>$now,
                        ]);

                    $lang_code = 'en-us';
                    $sql = "select row_id from qp_language where lang_code = '".$lang_code."'";
                    $resList = DB::select($sql, []);
                    if($resList > 0) {
                        $lang_id = $resList[0]->row_id;
                        \DB::table("qp_menu_language")
                            -> where('menu_row_id', "=", $thisMenu["row_id"])
                            -> where('lang_row_id', "=", $lang_id)
                            -> update(['menu_name'=>$thisMenu["english_name"],
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
                            -> where('menu_row_id', "=", $thisMenu["row_id"])
                            -> where('lang_row_id', "=", $lang_id)
                            -> update(['menu_name'=>$thisMenu["simple_chinese_name"],
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
                            -> where('menu_row_id', "=", $thisMenu["row_id"])
                            -> where('lang_row_id', "=", $lang_id)
                            -> update(['menu_name'=>$thisMenu["traditional_chinese_name"],
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);
                    }
                }
            }

            \DB::commit();
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getGroupList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $groupList = \DB::table("qp_group")
            -> select()
            -> get();
        foreach ($groupList as $group) {
            $count = \DB::table('qp_user_group')
                ->where('group_row_id', '=', $group->row_id)
                ->count();
            $group->user_count = $count;
        }

        return response()->json($groupList);
    }

    public function deleteGroup() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $groupIdList = $jsonContent['group_id_list'];
            foreach ($groupIdList as $gId) {
                \DB::table("qp_group")
                    -> where('row_id', '=', $gId)
                    -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveGroup() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $action = $jsonContent['action'];
            $group_id = $jsonContent['group_id'];
            $group_name = $jsonContent['group_name'];
            $menu_list = $jsonContent['menu_list'];
            \DB::beginTransaction();

            $now = date('Y-m-d H:i:s',time());
            if($action == "N") { //New
                $existList = \DB::table("qp_group")->where("group_name", '=', $group_name)->select()->get();
                if(count($existList) > 0) {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_GROUP_NAME_EXIST")]);
                }

                $newGroupId = \DB::table("qp_group")
                    -> insertGetId([
                        'group_name'=>$group_name,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                foreach ($menu_list as $menuId) {
                    \DB::table("qp_group_menu")->insert([
                        'group_row_id'=>$newGroupId,
                        'menu_row_id'=>$menuId,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now]);
                }
            } else if($action == "U") { //Edit
                $existList = \DB::table("qp_group")->where("group_name", '=', $group_name)->select()->get();
                if(count($existList) > 0) {
                    foreach ($existList as $existGroup) {
                        if($existGroup->row_id != $group_id) {
                            return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_GROUP_NAME_EXIST")]);
                        }
                    }
                }
                \DB::table("qp_group")
                    ->where("row_id", "=", $group_id)
                    -> update([
                        'group_name'=>$group_name,
                        'updated_user'=>\Auth::user()->row_id,
                        'updated_at'=>$now,
                    ]);

                \DB::table("qp_group_menu")
                    -> where("group_row_id", "=", $group_id)
                    -> delete();
                foreach ($menu_list as $menuId) {
                    \DB::table("qp_group_menu")->insert([
                        'group_row_id'=>$group_id,
                        'menu_row_id'=>$menuId,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now]);
                }
            }

            \DB::commit();
            if($action == "N") {
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,'new_group_id'=>$newGroupId]);
            } else {
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
            }

        }

        return null;
    }

    public function saveGroupUsers() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $groupId = $jsonContent['group_id'];
            $userIdList = $jsonContent['user_id_list'];
            \DB::beginTransaction();
            \DB::table("qp_user_group")-> where('group_row_id', "=", $groupId)->delete();
            foreach ($userIdList as $uId) {
                \DB::table("qp_user_group")
                    -> insert(
                        ['user_row_id'=>$uId,
                            'group_row_id'=>$groupId,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);

            }
            \DB::commit();
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getGroupUsers() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        $groupId = $input["group_id"];

        $sql = 'select * from qp_user where row_id in (select user_row_id from qp_user_group where group_row_id = '.$groupId.')';
        return DB::select($sql, []);
    }

    public function getParameterTypeList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $typeList = \DB::table("qp_parameter_type")
            -> select()
            -> get();

        return response()->json($typeList);
    }

    public function deleteParameterType() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $typeIdList = $jsonContent['type_id_list'];

            //Check
            foreach ($typeIdList as $tId) {
                $paraList = \DB::table("qp_parameter")
                    -> where('parameter_type_row_id', '=', $tId)
                    -> select() -> get();
                if(count($paraList) > 0) {
                    return response()->json(['result_code'=>999,
                    'message'=>'Exist Parameter']); //TODO define error code and message
                }
            }

            foreach ($typeIdList as $tId) {
                \DB::table("qp_parameter_type")
                    -> where('row_id', '=', $tId)
                    -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveParameterType() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $type_name = $jsonContent['type_name'];
            $type_desc = $jsonContent['type_desc'];

            $isNew = $jsonContent['isNew'];
            if($isNew == 'Y') {
                \DB::table("qp_parameter_type")
                    -> insert(
                        ['parameter_type_name'=>$type_name,
                            'parameter_type_desc'=>$type_desc,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $typeId = $jsonContent['typeId'];
                \DB::table("qp_parameter_type")
                    -> where('row_id', '=', $typeId)
                    -> update(
                        ['parameter_type_name'=>$type_name,
                            'parameter_type_desc'=>$type_desc,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getParameterList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

//        select p.row_id, p.parameter_name, p.parameter_value, t.parameter_type_name from qp_parameter p
//left join qp_parameter_type t on t.row_id = p.parameter_type_row_id
        $typeList = \DB::table("qp_parameter")
            -> leftJoin("qp_parameter_type", "qp_parameter_type.row_id", "=", "qp_parameter.parameter_type_row_id")
            -> select()
            -> get();

        return response()->json($typeList);
    }

    public function deleteParameter() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $paraIdList = $jsonContent['para_id_list'];

            foreach ($paraIdList as $pId) {
                \DB::table("qp_parameter")
                    -> where('row_id', '=', $pId)
                    -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveParameter() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $type_id = $jsonContent['type_id'];
            $para_name = $jsonContent['para_name'];
            $para_value = $jsonContent['para_value'];

            $isNew = $jsonContent['isNew'];
            if($isNew == 'Y') {
                \DB::table("qp_parameter")
                    -> insert(
                        ['parameter_type_row_id' => $type_id,
                            'parameter_name'=>$para_name,
                            'parameter_value'=>$para_value,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $paraId = $jsonContent['paraId'];
                \DB::table("qp_parameter")
                    -> where('row_id', '=', $paraId)
                    -> update(
                        ['parameter_type_row_id' => $type_id,
                            'parameter_name'=>$para_name,
                            'parameter_value'=>$para_value,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getMessageList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $messageList = \DB::table("qp_message")
            ->leftJoin("qp_user",  "qp_user.row_id", "=", "qp_message.created_user")
            -> select("qp_message.row_id", "qp_message.message_type",
                "qp_message.message_title", "qp_user.login_id as created_user",
                "qp_message.created_at", "qp_message.visible")
            -> get();

        return response()->json($messageList);
    }

    public function getMessageSendList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        $message_id = $input["message_id"];

        $sendList = \DB::table("qp_message_send")
            -> leftJoin("qp_user", "qp_user.row_id", "=", "qp_message_send.created_user")
            -> where('qp_message_send.message_row_id', '=', $message_id)
            -> select("qp_message_send.row_id", "qp_message_send.created_at", "qp_user.login_id as source_user")
            -> get();

        return $sendList;
    }

    public function pushMessageImmediately() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $sourcer = $jsonContent['sourcer'];
            $type = $jsonContent['type'];
            $title = $jsonContent['title'];
            $content = $jsonContent['content'];
            $receiver = $jsonContent['receiver'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                $newMessageId = \DB::table("qp_message")
                    -> insertGetId([
                        'message_type'=>$type,
                        'message_title'=>$title,
                        'message_text'=>$content,
                        'message_source'=>$sourcer,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);
                $newMessageSendId = \DB::table("qp_message_send")
                    -> insertGetId([
                        'message_row_id'=>$newMessageId,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                if($receiver["type"] == "news") {
                    $companyList = $receiver["company_list"];
                    foreach ($companyList as $company) {
                        $roleList = \DB::table("qp_role")
                            ->where("company", '=', $company)
                            ->select()
                            ->get();
                        foreach($roleList as $role) {
                            \DB::table("qp_role_message")
                                -> insert([
                                    'project_row_id'=>1,
                                    'role_row_id'=>$role->row_id,
                                    'message_send_row_id'=>$newMessageSendId,
                                    'need_push'=>1,
                                    'push_flag'=>0,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                        }
                    }

                    //TODO do push
                } else {
                    $roleList = $receiver["role_list"];
                    $userList = $receiver["user_list"];

                    $insertedUserIdList = array();
                    foreach($roleList as $roleId) {
                        \DB::table("qp_role_message")
                            -> insert([
                                'project_row_id'=>1,
                                'role_row_id'=>$roleId,
                                'message_send_row_id'=>$newMessageSendId,
                                'need_push'=>1,
                                'push_flag'=>0,
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);
                        $userListInRole = \DB::table("qp_user_role")
                            ->where("role_row_id", "=", $roleId)
                            ->select()->get();
                        foreach ($userListInRole as $userInRole) {
                            $userId = $userInRole->user_row_id;
                            if(!in_array($userId, $insertedUserIdList)) {
                                \DB::table("qp_user_message")
                                    -> insert([
                                        'project_row_id'=>1,
                                        'user_row_id'=>$userId,
                                        'message_send_row_id'=>$newMessageSendId,
                                        'need_push'=>1,
                                        'push_flag'=>0,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                array_push($insertedUserIdList, $userId);
                            }
                        }
                    }

                    foreach($userList as $userId) {
                        if(!in_array($userId, $insertedUserIdList)) {
                            \DB::table("qp_user_message")
                                -> insert([
                                    'project_row_id'=>1,
                                    'user_row_id'=>$userId,
                                    'message_send_row_id'=>$newMessageSendId,
                                    'need_push'=>1,
                                    'push_flag'=>0,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                            array_push($insertedUserIdList, $userId);
                        }
                    }
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e]);
            }
        }
    }

    public function pushMessageImmediatelyAgain() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $message_id = $jsonContent['message_id'];
            $receiver = $jsonContent['receiver'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                $newMessageSendId = \DB::table("qp_message_send")
                    -> insertGetId([
                        'message_row_id'=>$message_id,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                if($receiver["type"] == "news") {
                    $companyList = $receiver["company_list"];
                    foreach ($companyList as $company) {
                        $roleList = \DB::table("qp_role")
                            ->where("company", '=', $company)
                            ->select()
                            ->get();
                        foreach($roleList as $role) {
                            \DB::table("qp_role_message")
                                -> insert([
                                    'project_row_id'=>1,
                                    'role_row_id'=>$role->row_id,
                                    'message_send_row_id'=>$newMessageSendId,
                                    'need_push'=>1,
                                    'push_flag'=>0,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                        }
                    }

                    //TODO do push
                } else {
                    $roleList = $receiver["role_list"];
                    $userList = $receiver["user_list"];

                    $insertedUserIdList = array();
                    foreach($roleList as $roleId) {
                        \DB::table("qp_role_message")
                            -> insert([
                                'project_row_id'=>1,
                                'role_row_id'=>$roleId,
                                'message_send_row_id'=>$newMessageSendId,
                                'need_push'=>1,
                                'push_flag'=>0,
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);
                        $userListInRole = \DB::table("qp_user_role")
                            ->where("role_row_id", "=", $roleId)
                            ->select()->get();
                        foreach ($userListInRole as $userInRole) {
                            $userId = $userInRole->user_row_id;
                            if(!in_array($userId, $insertedUserIdList)) {
                                \DB::table("qp_user_message")
                                    -> insert([
                                        'project_row_id'=>1,
                                        'user_row_id'=>$userId,
                                        'message_send_row_id'=>$newMessageSendId,
                                        'need_push'=>1,
                                        'push_flag'=>0,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                array_push($insertedUserIdList, $userId);
                            }
                        }
                    }

                    foreach($userList as $userId) {
                        if(!in_array($userId, $insertedUserIdList)) {
                            \DB::table("qp_user_message")
                                -> insert([
                                    'project_row_id'=>1,
                                    'user_row_id'=>$userId,
                                    'message_send_row_id'=>$newMessageSendId,
                                    'need_push'=>1,
                                    'push_flag'=>0,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                            array_push($insertedUserIdList, $userId);
                        }
                    }
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e]);
            }
        }
    }

    public function getSingleEventMessageReceiver() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        $messageSendId = $input["message_send_row_id"];

        $userList = \DB::table('qp_user_message')
            -> where('message_send_row_id', '=', $messageSendId)
            -> select()->get();

        $userIdListInRole = array();
        $userIdListNotInRole = array();
        $roleList = \DB::table('qp_role_message')
            -> where('message_send_row_id', '=', $messageSendId)
            -> select()->get();
        foreach ($roleList as $role) {
            $role_id = $role->role_row_id;
            $userRoleList = \DB::table('qp_user_role')
                -> where('role_row_id', '=', $role_id)
                -> select()->get();
            foreach ($userRoleList as $userRole) {
                array_push($userIdListInRole, $userRole->user_row_id);
            }
        }

        foreach ($userList as $user) {
            $user_id = $user->user_row_id;
            if(!in_array($user_id, $userIdListInRole)) {
                array_push($userIdListNotInRole, $user_id);
            }
        }

        return \DB::table('qp_user')->whereIn("row_id", $userIdListNotInRole)->select()->get();
    }

    public function saveMessageVisible() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $message_id = $jsonContent['message_id'];
            $visible = $jsonContent['visible'];

            \DB::table("qp_message")
                -> where('row_id', '=', $message_id)
                -> update(
                    ['visible' => $visible,
                        'updated_at'=>$now,
                        'updated_user'=>\Auth::user()->row_id]);

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }
}
