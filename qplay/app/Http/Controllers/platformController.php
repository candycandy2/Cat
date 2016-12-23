<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use DB;

class platformController extends Controller
{
    private function setLanguage() {
        //date_default_timezone_set('UTC');
        //date_default_timezone_set('PRC');
        \App::setLocale("en-us");
        if(\Session::has('lang') && \Session::get("lang") != "") {
            \App::setLocale(\Session::get("lang"));
        }
    }

    public function process()
    {
        
    }

    public function getUserList()
    {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $this->setLanguage();

        $userList = \DB::table("qp_user")
            -> where("resign", "=", "N")
            -> select()
            -> orderBy("department")
            -> orderBy("login_id")
            -> get();
        return response()->json($userList);
    }

    public function getUserListWithoutGroup() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $this->setLanguage();

        $rowIdListWithoutGroup = array();
        $userWithoutGroupList = \DB::table("qp_user_group")
            -> select()
            -> get();
        foreach ($userWithoutGroupList as $info) {
            array_push($rowIdListWithoutGroup, $info->user_row_id);
        }

        $userList = \DB::table("qp_user")
            -> where("resign", "=", "N")
            -> whereNotIn("row_id", $rowIdListWithoutGroup)
            -> select()
            -> orderBy("department")
            -> orderBy("login_id")
            -> get();
        return response()->json($userList);
    }

    public function getRoleList()
    {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $roleList = \DB::table("qp_role")
            -> select()
            -> orderBy('company')
            -> orderBy('role_description')
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

        $this->setLanguage();

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

        $this->setLanguage();

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
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
            } catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
            }
        } else {
            return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
        }
    }

    public function deleteRole() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

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

        $this->setLanguage();

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

        $this->setLanguage();

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

        $this->setLanguage();

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
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

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

        $this->setLanguage();

        $input = Input::get();
        $menuId = $input["menu_id"];

        return CommonUtil::getSubMenuList($menuId);
    }

    public function deleteMenu() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $roleIdList = $jsonContent['menu_id_list'];
            foreach ($roleIdList as $mId) {
                \DB::table("qp_menu_language")
                    -> where('menu_row_id', "=", $mId)
                    -> delete();
                \DB::table("qp_user_menu")
                    -> where('menu_row_id', "=", $mId)
                    -> delete();
                \DB::table("qp_group_menu")
                    -> where('menu_row_id', "=", $mId)
                    -> delete();
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

        $this->setLanguage();

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

            $existList = \DB::table("qp_menu")
                -> select() -> get();

            foreach ($existList as $existMenu) {
                if(strtoupper($existMenu->menu_name) == strtoupper($menuName)) {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>trans("messages.MSG_MENU_NAME_EXIST")]);
                }
            }

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

                //Add right to Administrator
                $adminList = \DB::table("qp_group")->where("group_name", "=", "Administrator")->select()->get();
                if(count($adminList) > 0) {
                    $adminId = $adminList[0]->row_id;
                    \DB::table("qp_group_menu")
                        -> insert([
                            'menu_row_id'=>$newMenuId,
                            'group_row_id'=>$adminId,
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

    public function saveMenuSequence() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $menuSequencMappingList = $jsonContent['menu_sequence_mapping_list'];
            \DB::beginTransaction();
            try {
                foreach ($menuSequencMappingList as $mapping) {
                    \DB::table("qp_menu")
                        -> where('row_id', '=', $mapping["row_id"])
                        -> update(
                            ['sequence'=>$mapping["sequence"],
                                'updated_at'=>$now,
                                'updated_user'=>\Auth::user()->row_id]);
                }
                \DB::commit();
            } catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError, 'message'=>$e->getMessage().$e->getTraceAsString()]);
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

        $this->setLanguage();

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

            $existList = \DB::table("qp_menu")
                -> select() -> get();

            foreach ($existList as $existMenu) {
                if(strtoupper($existMenu->menu_name) == strtoupper($menu_name)
                && $existMenu->row_id != $menu_id) {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                        'message'=>trans("messages.MSG_MENU_NAME_EXIST")]);
                }
            }

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
                \DB::table("qp_user_menu")
                    -> where('menu_row_id', "=", $deleteMenuId)
                    -> delete();
                \DB::table("qp_group_menu")
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

                    //Add right to Administrator
                    $adminList = \DB::table("qp_group")->where("group_name", "=", "Administrator")->select()->get();
                    if(count($adminList) > 0) {
                        $adminId = $adminList[0]->row_id;
                        \DB::table("qp_group_menu")
                            -> insert([
                                'menu_row_id'=>$newMenuId,
                                'group_row_id'=>$adminId,
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

        $this->setLanguage();

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

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $groupIdList = $jsonContent['group_id_list'];
            \DB::beginTransaction();
            foreach ($groupIdList as $gId) {
                \DB::table("qp_group_menu")
                    -> where('group_row_id', '=', $gId)
                    -> delete();

                \DB::table("qp_group")
                    -> where('row_id', '=', $gId)
                    -> delete();
            }
            \DB::commit();
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveGroup() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

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

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $groupId = $jsonContent['group_id'];
            $userIdList = $jsonContent['user_id_list'];
            \DB::beginTransaction();
            //\DB::table("qp_user_group")-> where('group_row_id', "=", $groupId)->delete();
            $currentUserList = \DB::table("qp_user_group")
                -> where('group_row_id', "=", $groupId)
                -> select()->get();
            $dataNeedToDelete = array();
            foreach ($currentUserList as $existUser) {
                $existUserRowId = $existUser->user_row_id;
                $exist = false;
                foreach ($userIdList as $uId) {
                    if($uId == $existUserRowId) {
                        $exist = true;
                        break;
                    }
                }
                if(!$exist) {
                    array_push($dataNeedToDelete, $existUser);
                }
            }
            foreach ($dataNeedToDelete as $deleteItem) {
                \DB::table("qp_user_menu")
                    ->where("user_row_id", "=", $deleteItem->user_row_id)
                    ->delete();
                \DB::table("qp_user_group")
                    ->where("row_id", "=", $deleteItem->row_id)
                    ->delete();
            }

            foreach ($userIdList as $uId) {

                $existInfo = \DB::table("qp_user_group")
//                    -> where('group_row_id', "=", $groupId)
                    -> where('user_row_id', "=", $uId)
                    -> select()->get();
                if(count($existInfo) > 1
                    || (count($existInfo) == 1 && $existInfo[0]->group_row_id != $groupId)) {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError, 'message'=>trans("messages.ERR_USER_HAS_IN_GROUP")]);
                } else if(count($existInfo) == 0) {
                    \DB::table("qp_user_group")
                        -> insert(
                            ['user_row_id'=>$uId,
                                'group_row_id'=>$groupId,
                                'authority_by_group' => 'Y',
                                'created_at'=>$now,
                                'created_user'=>\Auth::user()->row_id]);
                }
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

        $this->setLanguage();

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

        $this->setLanguage();

        $typeList = \DB::table("qp_parameter_type")
            -> select()
            ->orderBy("parameter_type_name")
            -> get();

        return response()->json($typeList);
    }

    public function deleteParameterType() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

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
                    'message'=>trans("messages.ERR_EXIST_PARAMETER_IN_TYPE")]);
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

        $this->setLanguage();

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

        $this->setLanguage();

//        select p.row_id, p.parameter_name, p.parameter_value, t.parameter_type_name from qp_parameter p
//left join qp_parameter_type t on t.row_id = p.parameter_type_row_id
        $paraList = \DB::table("qp_parameter")
            -> leftJoin("qp_parameter_type", "qp_parameter_type.row_id", "=", "qp_parameter.parameter_type_row_id")
            -> orderBy("qp_parameter_type.parameter_type_name")
            -> orderBy("qp_parameter.parameter_name")
            -> select("qp_parameter.row_id", "qp_parameter.parameter_type_row_id", "qp_parameter_type.parameter_type_name", "qp_parameter.parameter_name", "qp_parameter.parameter_value")
            -> get();

        return response()->json($paraList);
    }

    public function deleteParameter() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

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

        $this->setLanguage();

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
                $existParameterList = \DB::table("qp_parameter")
                    ->where('parameter_type_row_id', '=', $type_id)
                    ->select()->get();
                foreach ($existParameterList as $existParameterInfo) {
                    if(strtoupper($existParameterInfo->parameter_name) == strtoupper($para_name)) {
                        return response()->json(['result_code'=>ResultCode::_999999_unknownError, 'message'=>trans("messages.ERR_PARAMETER_NAME_EXIST_IN_TYPE")]);
                    }
                }

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

        $this->setLanguage();

        $messageList = array();
        if(\Auth::user()->isAdmin()) {
            $messageList = \DB::table("qp_message")
                ->leftJoin("qp_user",  "qp_user.row_id", "=", "qp_message.created_user")
                -> select("qp_message.row_id", "qp_message.message_type",
                    "qp_message.message_title", "qp_user.login_id as created_user",
                    "qp_message.created_at", "qp_message.visible")
                -> orderBy(\DB::raw('qp_message.created_at'),"DESC")
                -> get();
        } else {
            $messageList = \DB::table("qp_message")
                ->leftJoin("qp_user",  "qp_user.row_id", "=", "qp_message.created_user")
                -> select("qp_message.row_id", "qp_message.message_type",
                    "qp_message.message_title", "qp_user.login_id as created_user",
                    "qp_message.created_at", "qp_message.visible")
                -> where("qp_user.row_id", "=", \Auth::user()->row_id)
                -> orderBy(\DB::raw('qp_message.created_at'),"DESC")
                -> get();
        }

        return response()->json($messageList);
    }

    public function getSecretaryMessageList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $messageList = array();
        if(\Auth::user()->isAdmin()) {
            $messageList = \DB::table("qp_message")
                ->leftJoin("qp_user",  "qp_user.row_id", "=", "qp_message.created_user")
                -> where('qp_message.message_type', '=', 'news')
                -> select("qp_message.row_id", "qp_message.message_type",
                    "qp_message.message_title", "qp_user.login_id as created_user",
                    "qp_message.created_at", "qp_message.visible")
                -> orderBy(\DB::raw('qp_message.created_at'),"DESC")
                -> get();
        } else {
            $messageList = \DB::table("qp_message")
                ->leftJoin("qp_user",  "qp_user.row_id", "=", "qp_message.created_user")
                -> select("qp_message.row_id", "qp_message.message_type",
                    "qp_message.message_title", "qp_user.login_id as created_user",
                    "qp_message.created_at", "qp_message.visible")
                -> where("qp_user.row_id", "=", \Auth::user()->row_id)
                -> where('qp_message.message_type', '=', 'news')
                -> orderBy(\DB::raw('qp_message.created_at'),"DESC")
                -> get();
        }

        return response()->json($messageList);
    }

    public function getMessageSendList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $input = Input::get();
        $message_id = $input["message_id"];

        $sendList = \DB::table("qp_message_send")
            -> leftJoin("qp_user", "qp_user.row_id", "=", "qp_message_send.created_user")
            -> where('qp_message_send.message_row_id', '=', $message_id)
            -> select("qp_message_send.row_id", "qp_message_send.created_at", "qp_user.login_id as source_user")
            -> orderBy("qp_message_send.created_at", "desc")
            -> get();

        return $sendList;
    }

    public function getSecretaryMessageSendList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $input = Input::get();
        $message_id = $input["message_id"];

        $sendList = \DB::table("qp_message_send_pushonly")
            -> leftJoin("qp_user", "qp_user.row_id", "=", "qp_message_send_pushonly.created_user")
            -> where('qp_message_send_pushonly.message_row_id', '=', $message_id)
            -> select("qp_message_send_pushonly.row_id", "qp_message_send_pushonly.created_at", "qp_user.login_id as source_user")
            -> orderBy("qp_message_send_pushonly.created_at", "desc")
            -> get();

        return $sendList;
    }

    public function saveNewMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $sourcer = $jsonContent['sourcer'];
            $template_id = $jsonContent['template_id'];
            $type = $jsonContent['type'];
            $title = $jsonContent['title'];
            $content = $jsonContent['content'];
            $receiver = $jsonContent['receiver'];
            $from_history = $jsonContent['from_history'];
            $newMessageId = $jsonContent['msg_id'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                if($from_history != "Y") {
                    $newMessageId = \DB::table("qp_message")
                        -> insertGetId([
                            'message_type'=>$type,
                            'template_id' => $template_id,
                            'message_title'=>$title,
                            'message_text'=>$content,
                            'message_source'=>$sourcer,
                            'visible'=>'Y',
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);
                }

                $companyList = $receiver["company_list"];
                $companyLabel = "";
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $companyLabel = $companyLabel.$company.";";
                    }
                }
                $newMessageSendId = \DB::table("qp_message_send")
                    -> insertGetId([
                        'message_row_id'=>$newMessageId,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'company_label'=>$companyLabel,
                        'need_push'=>0,
                        'push_flag'=>0,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                $real_push_user_list = array();
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $userList = \DB::table("qp_user")
                            ->where("company", "=", $company)
                            ->select()->get();
                        foreach ($userList as $user) {
                            $userId = $user -> row_id;
                            if(!in_array($userId, $real_push_user_list)) {
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }
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
                                //'need_push'=>1,
                                //'push_flag'=>0,
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
                                        //'need_push'=>1,
                                        //'push_flag'=>0,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                array_push($insertedUserIdList, $userId);
                                array_push($real_push_user_list, $userId);
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
                                    //'need_push'=>1,
                                    //'push_flag'=>0,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                            array_push($insertedUserIdList, $userId);
                            array_push($real_push_user_list, $userId);
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

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'send_id'=>$newMessageSendId, 'message_id'=>$newMessageId]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e->getMessage().$e->getTraceAsString()]);
            }
        }
    }

    public function saveUpdateMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $sourcer = $jsonContent['sourcer'];
            $template_id = $jsonContent['template_id'];
            $type = $jsonContent['type'];
            $title = $jsonContent['title'];
            $content = $jsonContent['content'];
            $receiver = $jsonContent['receiver'];
            $messageId = $jsonContent['message_id'];
            $messageSendId = $jsonContent['message_send_id'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                \DB::table("qp_message")
                    -> where('row_id', '=', $messageId)
                    -> update(
                        ['message_type'=>$type,
                            'template_id' => $template_id,
                            'message_title'=>$title,
                            'message_text'=>$content,
                            'message_source'=>$sourcer,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

                $companyList = $receiver["company_list"];
                $companyLabel = "";
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $companyLabel = $companyLabel.$company.";";
                    }
                }
                \DB::table("qp_message_send")
                    -> where('row_id', '=', $messageSendId)
                    -> update([
                        'company_label'=>$companyLabel,
                        'updated_user'=>\Auth::user()->row_id,
                        'updated_at'=>$now,
                    ]);

                \DB::table("qp_role_message")
                    -> where('message_send_row_id', '=', $messageSendId)
                    -> delete();
                \DB::table("qp_user_message")
                    -> where('message_send_row_id', '=', $messageSendId)
                    -> delete();

                $real_push_user_list = array();
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $userList = \DB::table("qp_user")
                            ->where("company", "=", $company)
                            ->select()->get();
                        foreach ($userList as $user) {
                            $userId = $user -> row_id;
                            if(!in_array($userId, $real_push_user_list)) {
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }
                } else {
                    $roleList = $receiver["role_list"];
                    $userList = $receiver["user_list"];

                    $insertedUserIdList = array();
                    foreach($roleList as $roleId) {
                        \DB::table("qp_role_message")
                            -> insert([
                                'project_row_id'=>1,
                                'role_row_id'=>$roleId,
                                'message_send_row_id'=>$messageSendId,
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
                                        'message_send_row_id'=>$messageSendId,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                array_push($insertedUserIdList, $userId);
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }

                    foreach($userList as $userId) {
                        if(!in_array($userId, $insertedUserIdList)) {
                            \DB::table("qp_user_message")
                                -> insert([
                                    'project_row_id'=>1,
                                    'user_row_id'=>$userId,
                                    'message_send_row_id'=>$messageSendId,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                            array_push($insertedUserIdList, $userId);
                            array_push($real_push_user_list, $userId);
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

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'send_id'=>$messageSendId, 'message_id'=>$messageId]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e->getMessage().$e->getTraceAsString()]);
            }
        }
    }

    public function saveUpdateAndPushMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $sourcer = $jsonContent['sourcer'];
            $template_id = $jsonContent['template_id'];
            $type = $jsonContent['type'];
            $title = $jsonContent['title'];
            $content = $jsonContent['content'];
            $receiver = $jsonContent['receiver'];
            $messageId = $jsonContent['message_id'];
            $messageSendId = $jsonContent['message_send_id'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                \DB::table("qp_message")
                    -> where('row_id', '=', $messageId)
                    -> update(
                        ['message_type'=>$type,
                            'template_id' => $template_id,
                            'message_title'=>$title,
                            'message_text'=>$content,
                            'message_source'=>$sourcer,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);


                $companyList = $receiver["company_list"];
                $companyLabel = "";
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $companyLabel = $companyLabel.$company.";";
                    }
                }

                \DB::table("qp_message_send")
                    -> where('row_id', '=', $messageSendId)
                    -> update(
                        ['need_push'=>1,
                            'company_label'=>$companyLabel,
                            'created_at'=>$now,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

                \DB::table("qp_role_message")
                    -> where('message_send_row_id', '=', $messageSendId)
                    -> delete();
                \DB::table("qp_user_message")
                    -> where('message_send_row_id', '=', $messageSendId)
                    -> delete();

                $real_push_user_list = array();
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $userList = \DB::table("qp_user")
                            ->where("company", "=", $company)
                            ->select()->get();
                        foreach ($userList as $user) {
                            $userId = $user -> row_id;
                            if(!in_array($userId, $real_push_user_list)) {
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }
                } else {
                    $roleList = $receiver["role_list"];
                    $userList = $receiver["user_list"];

                    $insertedUserIdList = array();
                    foreach($roleList as $roleId) {
                        \DB::table("qp_role_message")
                            -> insert([
                                'project_row_id'=>1,
                                'role_row_id'=>$roleId,
                                'message_send_row_id'=>$messageSendId,
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);
                        $userListInRole = \DB::table("qp_user_role")
                            ->where("role_row_id", "=", $roleId)
                            ->select()->get();
                        foreach ($userListInRole as $userInRole) {
                            $userId = $userInRole->user_row_id;
                            $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                            if(!in_array($userId, $insertedUserIdList)) {
                                foreach ($currentUserInfo->uuidList as $uuid) {
                                    \DB::table("qp_user_message")
                                        -> insert([
                                            'project_row_id'=>1,
                                            'user_row_id'=>$userId,
                                            'uuid'=>$uuid,
                                            'message_send_row_id'=>$messageSendId,
                                            'created_user'=>\Auth::user()->row_id,
                                            'created_at'=>$now,
                                        ]);
                                }
                                array_push($insertedUserIdList, $userId);
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }

                    foreach($userList as $userId) {
                        if(!in_array($userId, $insertedUserIdList)) {
                            $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                            foreach ($currentUserInfo->uuidList as $uuid) {
                                \DB::table("qp_user_message")
                                    -> insert([
                                        'project_row_id'=>1,
                                        'user_row_id'=>$userId,
                                        'uuid'=>$uuid,
                                        'message_send_row_id'=>$messageSendId,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                            }
                            array_push($insertedUserIdList, $userId);
                            array_push($real_push_user_list, $userId);
                        }
                    }
                }

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

                //$result = CommonUtil::PushMessageWithMessageCenter($title, $to, $messageSendId);
                $result = CommonUtil::PushMessageWithJPushWebAPI($title, $to, $messageSendId);
                if(!$result["result"]) {
                    //\DB::rollBack();
                    //Update jpush_error_code
                    \DB::table("qp_message_send")
                        -> where(['row_id'=>$messageSendId])
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->login_id,
                            'updated_at'=>$now
                        ]);
                    \DB::commit();
                    //return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$result["info"]]);
                    return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'send_id'=>$messageSendId, 'message_id'=>$messageId]);
                }
                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'send_id'=>$messageSendId, 'message_id'=>$messageId]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e->getMessage().$e->getTraceAsString()]);
            }
        }
    }

    public function pushMessageImmediately() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $sourcer = $jsonContent['sourcer'];
            $template_id = $jsonContent['template_id'];
            $type = $jsonContent['type'];
            $title = $jsonContent['title'];
            $content = $jsonContent['content'];
            $receiver = $jsonContent['receiver'];
            $from_history = $jsonContent['from_history'];
            $newMessageId = $jsonContent['msg_id'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                if($from_history != "Y") {
                    $newMessageId = \DB::table("qp_message")
                        -> insertGetId([
                            'message_type'=>$type,
                            'template_id' => $template_id,
                            'message_title'=>$title,
                            'message_text'=>$content,
                            'message_source'=>$sourcer,
                            'visible'=>'Y',
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);
                }

                $companyList = $receiver["company_list"];
                $companyLabel = "";
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $companyLabel = $companyLabel.$company.";";
                    }
                }
                $newMessageSendId = \DB::table("qp_message_send")
                    -> insertGetId([
                        'message_row_id'=>$newMessageId,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'company_label'=>$companyLabel,
                        'need_push'=>1,
                        'push_flag'=>0,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                $real_push_user_list = array();
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $userList = \DB::table("qp_user")
                            ->where("company", "=", $company)
                            ->select()->get();
                        foreach ($userList as $user) {
                            $userId = $user -> row_id;
                            if(!in_array($userId, $real_push_user_list)) {
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }
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
                                //'need_push'=>1,
                                //'push_flag'=>0,
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
                                        //'need_push'=>1,
                                        //'push_flag'=>0,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                array_push($insertedUserIdList, $userId);
                                array_push($real_push_user_list, $userId);
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
                                    //'need_push'=>1,
                                    //'push_flag'=>0,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                            array_push($insertedUserIdList, $userId);
                            array_push($real_push_user_list, $userId);
                        }
                    }
                }

                $to = [];
                $CountFlag = 0;
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
                            $to[$CountFlag] = $tempUser->push_token;
                            $CountFlag ++;
                        }
                    }
                }
                $result = CommonUtil::PushMessageWithJPushWebAPI($title, $to, $newMessageSendId);
                if(!$result["result"]) {
                    \DB::table("qp_message_send")
                        -> where(['row_id'=>$newMessageSendId])
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->row_id,
                            'updated_at'=>$now
                        ]);
                    \DB::commit();
                    //return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$result["info"]]);
                    return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'message'=>"From MessageCenter:" .$result["info"], 'send_id'=>$newMessageSendId, 'message_id'=>$newMessageId]);
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'message'=>"From MessageCenter:" .$result["info"], 'send_id'=>$newMessageSendId, 'message_id'=>$newMessageId]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e->getMessage().$e->getTraceAsString()]);
            }
        }
    }

    public function pushSecretaryMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $sourcer = $jsonContent['sourcer'];
            $template_id = $jsonContent['template_id'];
            $type = $jsonContent['type'];
            $title = $jsonContent['title'];
            $content = $jsonContent['content'];
            $receiver = $jsonContent['receiver'];
            $from_history = "N";
            if(key_exists("from_history", $jsonContent)) {
                $from_history = $jsonContent['from_history'];
            }
            $newMessageId = -1;
            if(key_exists("msg_id", $jsonContent)) {
                $newMessageId = $jsonContent['msg_id'];
            }

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                if($from_history != "Y") {
                    $newMessageId = \DB::table("qp_message")
                        -> insertGetId([
                            'message_type'=>'news',
                            'template_id' => $template_id,
                            'message_title'=>$title,
                            'message_text'=>$content,
                            'message_source'=>$sourcer,
                            'visible'=>'Y',
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);
                }

                $companyList = array();
                $companyLabel = "";
                if($receiver["type"] == "company") {
                    $companyList = $receiver["company_list"];
                    foreach ($companyList as $company) {
                        $companyLabel = $companyLabel.$company.";";
                    }
                }
                $newMessageSendId = \DB::table("qp_message_send_pushonly")
                    -> insertGetId([
                        'message_row_id'=>$newMessageId,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'company_label'=>$companyLabel,
                        'need_push'=>1,
                        'push_flag'=>0,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);
                if($from_history != 'Y') { //让原推播功能正常
                    \DB::table("qp_message_send")
                        -> insertGetId([
                            'message_row_id'=>$newMessageId,
                            'source_user_row_id'=>\Auth::user()->row_id,
                            'company_label'=>$companyLabel,
                            'need_push'=>0,
                            'push_flag'=>0,
                            'created_user'=>\Auth::user()->row_id,
                            'created_at'=>$now,
                        ]);
                }

                $real_push_user_list = array();
                if($receiver["type"] == "company") {
                    foreach ($companyList as $company) {
                        $userList = \DB::table("qp_user")
                            ->where("company", "=", $company)
                            ->select()->get();
                        foreach ($userList as $user) {
                            $userId = $user -> row_id;
                            if(!in_array($userId, $real_push_user_list)) {
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }
                } else {
                    $userList = $receiver["user_list"];
                    foreach($userList as $userId) {
                        \DB::table("qp_user_message_pushonly")
                            -> insert([
                                'project_row_id'=>1,
                                'user_row_id'=>$userId,
                                'message_send_pushonly_row_id'=>$newMessageSendId,
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);

                        array_push($real_push_user_list, $userId);
                    }
                }

                $to = [];
                $CountFlag = 0;
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
                            $to[$CountFlag] = $tempUser->push_token;
                            $CountFlag ++;
                        }
                    }
                }

                $result = CommonUtil::PushMessageWithJPushWebAPI($title, $to, $newMessageSendId);
                if(!$result["result"]) {
                    \DB::table("qp_message_send")
                        -> where(['row_id'=>$newMessageSendId])
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->row_id,
                            'updated_at'=>$now
                        ]);
                    \DB::commit();
                    return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'message'=>"From MessageCenter:" .$result["info"], 'send_id'=>$newMessageSendId, 'message_id'=>$newMessageId]);
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'message'=>"From MessageCenter:" .$result["info"], 'send_id'=>$newMessageSendId, 'message_id'=>$newMessageId]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e->getMessage().$e->getTraceAsString()]);
            }
        }
    }

    public function pushMessageImmediatelyAgain() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $message_id = $jsonContent['message_id'];
            $receiver = $jsonContent['receiver'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                $title = \DB::table("qp_message")->where("row_id", "=", $message_id)->select()->get()[0]->message_title;

                $companyList = $receiver["company_list"];
                $companyLabel = "";
                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $companyLabel = $companyLabel.$company.";";
                    }
                }

                $newMessageSendId = \DB::table("qp_message_send")
                    -> insertGetId([
                        'message_row_id'=>$message_id,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'company_label'=>$companyLabel,
                        'need_push'=>1,
                        'push_flag'=>0,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                $real_push_user_list = array();

                if($receiver["type"] == "news") {
                    foreach ($companyList as $company) {
                        $userList = \DB::table("qp_user")
                            ->where("company", "=", $company)
                            ->select()->get();
                        foreach ($userList as $user) {
                            $userId = $user -> row_id;
                            if(!in_array($userId, $real_push_user_list)) {
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }

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
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                array_push($insertedUserIdList, $userId);
                                array_push($real_push_user_list, $userId);
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
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                            array_push($insertedUserIdList, $userId);
                            array_push($real_push_user_list, $userId);
                        }
                    }
                }

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
                $result = CommonUtil::PushMessageWithJPushWebAPI($title, $to, $newMessageSendId);
                if(!$result["result"]) {
                    \DB::table("qp_message_send")
                        -> where(['row_id'=>$newMessageSendId])
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->login_id,
                            'updated_at'=>$now
                        ]);
                    \DB::commit();
                    //return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$result["info"]]);
                    return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e]);
            }
        }
    }

    public function pushSecretaryMessageAgain() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $message_send_id = $jsonContent['message_send_id'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
                $sourceMessageSendInfo = CommonUtil::getSecretaryMessageSendInfo($message_send_id);

                $companyLabel = "";
                if($sourceMessageSendInfo->send_type == "company") {
                    $companyLabel = $sourceMessageSendInfo->company_label;
                }

                $newMessageSendId = \DB::table("qp_message_send_pushonly")
                    -> insertGetId([
                        'message_row_id'=>$sourceMessageSendInfo->message_info->row_id,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'company_label'=>$companyLabel,
                        'need_push'=>1,
                        'push_flag'=>0,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                $real_push_user_list = array();
                if($sourceMessageSendInfo->send_type == "company") {
                    foreach ($sourceMessageSendInfo->company_list as $company) {
                        $userList = \DB::table("qp_user")
                            ->where("company", "=", $company)
                            ->select()->get();
                        foreach ($userList as $user) {
                            $userId = $user -> row_id;
                            if(!in_array($userId, $real_push_user_list)) {
                                array_push($real_push_user_list, $userId);
                            }
                        }
                    }
                } else {
                    $userList = CommonUtil::getSecretaryMessageDesignatedReceiver($message_send_id);
                    foreach($userList as $user) {
                        \DB::table("qp_user_message_pushonly")
                            -> insert([
                                'project_row_id'=>1,
                                'user_row_id'=>$user->user_row_id,
                                'message_send_pushonly_row_id'=>$newMessageSendId,
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);

                        array_push($real_push_user_list, $userId);
                    }
                }

                $to = [];
                $CountFlag = 0;
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
                            $to[$CountFlag] = $tempUser->push_token;
                            $CountFlag ++;
                        }
                    }
                }

                $title = $sourceMessageSendInfo->message_info->message_title;

                $result = CommonUtil::PushMessageWithJPushWebAPI($title, $to, $newMessageSendId);
                if(!$result["result"]) {
                    \DB::table("qp_message_send")
                        -> where(['row_id'=>$newMessageSendId])
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->row_id,
                            'updated_at'=>$now
                        ]);
                    \DB::commit();
                    return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'message'=>"From MessageCenter:" .$result["info"], 'send_id'=>$newMessageSendId, 'message_id'=>$newMessageId]);
                }

                $newMessageId = $sourceMessageSendInfo->message_info->row_id;

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'message'=>"From MessageCenter:" .$result["info"], 'send_id'=>$newMessageSendId, 'message_id'=>$newMessageId]);
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

        $this->setLanguage();

        $input = Input::get();
        $messageSendId = $input["message_send_row_id"];

        $userList = \DB::table('qp_user_message')
            -> where('message_send_row_id', '=', $messageSendId)
            -> select()->get();

        $roleList = \DB::table('qp_role_message')
            -> where('message_send_row_id', '=', $messageSendId)
            -> select()->get();

        $userIdListInRole = array();
        $userIdListNotInRole = array();

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

    public function getSecretaryMessageDesignatedReceiver() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $input = Input::get();
        $messageSendId = $input["message_send_row_id"];

        $userList = CommonUtil::getSecretaryMessageDesignatedReceiver($messageSendId);

        $userIdList = array();
        foreach ($userList as $user) {
            $user_id = $user->user_row_id;
            array_push($userIdList, $user_id);
        }

        return \DB::table('qp_user')->whereIn("row_id", $userIdList)->select()->get();
    }

    public function saveMessageVisible() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

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

    public function getProjectList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $projectList = \DB::table("qp_project")
            -> select()
            -> orderBy("project_code")
            -> get();
        foreach ($projectList as $project) {
            $project->with_app = "N";
            $appList = \DB::table("qp_app_head")
                -> where("project_row_id", "=", $project->row_id)
                -> select()
                -> get();
            if(count($appList) > 0) {
                foreach ($appList as $appInfo) {
                    $appId = $appInfo->row_id;
                    $appVersionList = \DB::table("qp_app_version")
                        -> where("app_row_id", "=", $appId)
                        -> where("status", "=", "ready")
                        -> select()
                        -> get();

                    if(count($appVersionList) > 0) {
                        $project->with_app = "Y";
                        break;
                    }
                }
            }
        }

        return response()->json($projectList);
    }

    public function deleteProject() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $project_id_list = $jsonContent['project_id_list'];

            \DB::beginTransaction();
            try{
                foreach ($project_id_list as $pId) {
                    $appHeadList = \DB::table("qp_app_head")
                        ->where("project_row_id", "=", $pId)
                        ->select()->get();
                    foreach ($appHeadList as $appHead) {
                        $appHeadId = $appHead->row_id;
                        \DB::table("qp_app_line")
                            -> where('app_row_id', '=', $appHeadId)
                            -> delete();
                        \DB::table("qp_app_evalution")
                            -> where('app_row_id', '=', $appHeadId)
                            -> delete();
                        \DB::table("qp_app_pic")
                            -> where('app_row_id', '=', $appHeadId)
                            -> delete();
                        \DB::table("qp_app_version")
                            -> where('app_row_id', '=', $appHeadId)
                            -> delete();
                        \DB::table("qp_app_head")
                            -> where('row_id', '=', $appHeadId)
                            -> delete();
                    }

                    \DB::table("qp_project")
                        -> where('row_id', '=', $pId)
                        -> delete();

                    \DB::commit();
                }
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveProject() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $action = $jsonContent['action'];
            $project_id = $jsonContent['project_id'];
            $project_code = $jsonContent['project_code'];
            $app_key = $jsonContent['app_key'];
            $project_pm = $jsonContent['project_pm'];
            $project_description = $jsonContent['project_description'];
            $project_memo = $jsonContent['project_memo'];

            //Check pm exist
            $pmList = \DB::table("qp_user") -> where('login_id', '=', $project_pm) ->select() ->get();
            if(count($pmList) <= 0) {
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_PROJECT_PM_NOT_EXIST")]);
            }

            \DB::beginTransaction();

            $now = date('Y-m-d H:i:s',time());
            if($action == "N") { //New
                $existList = \DB::table("qp_project")->where("project_code", '=', $project_code)->select()->get();
                if(count($existList) > 0) {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_PROJECT_CODE_EXIST")]);
                }
                $existList = \DB::table("qp_project")->where("app_key", '=', $app_key)->select()->get();
                if(count($existList) > 0) {
                    return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_APP_KEY_EXIST")]);
                }

                $newProjectId = \DB::table("qp_project")
                    -> insertGetId([
                        'project_code'=>$project_code,
                        'app_key' => $app_key,
                        'project_description' => $project_description,
                        'project_memo' => $project_memo,
                        'project_pm' => $project_pm,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);
            } else if($action == "U") { //Edit
                $existList = \DB::table("qp_project")->where("project_code", '=', $project_code)->select()->get();
                if(count($existList) > 0) {
                    foreach ($existList as $existProject) {
                        if($existProject->row_id != $project_id) {
                            return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_PROJECT_CODE_EXIST")]);
                        }
                    }
                }
                $existList = \DB::table("qp_project")->where("app_key", '=', $app_key)->select()->get();
                if(count($existList) > 0) {
                    foreach ($existList as $existProject) {
                        if($existProject->row_id != $project_id) {
                            return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_APP_KEY_EXIST")]);
                        }
                    }
                }

                \DB::table("qp_project")
                    ->where("row_id", "=", $project_id)
                    -> update([
                        'project_code'=>$project_code,
                        'app_key' => $app_key,
                        'project_description' => $project_description,
                        'project_memo' => $project_memo,
                        'project_pm' => $project_pm,
                        'updated_user'=>\Auth::user()->row_id,
                        'updated_at'=>$now,
                    ]);
            }

            \DB::commit();
            if($action == "N") {
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,'new_project_id'=>$newProjectId]);
            } else {
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
            }

        }

        return null;
    }
}
