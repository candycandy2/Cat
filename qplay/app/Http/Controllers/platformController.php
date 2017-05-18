<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\PushUtil;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use Illuminate\Http\Request;
use DB;
use App\Services\ProjectService;
use App\Repositories\ProjectRepository;

class platformController extends Controller
{   

    protected $projectService;

    public function __construct(ProjectService $projectService, ProjectRepository $projectRepository)
    {
        $this->projectService = $projectService;
        $this->projectRepository = $projectRepository;
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
        CommonUtil::setLanguage();


        $input = Input::get();
        $order = "login_id";
      
        if(array_key_exists("order", $input) && $input["order"] != null) {
            $order = $input["order"];
        }
        $offset = $input["offset"];
        $limit = $input["limit"];
      
        $sort = "asc";
        if(array_key_exists("sort", $input) && $input["sort"] != null) {
            $sort = $input["sort"];
        }

        $search = "";
        if(array_key_exists("search", $input) && $input["search"] != null) {
            $search = $input["search"];
        }
        $searchContent = "%" . $search . "%";


        $userList = \DB::table("qp_user")
            -> where("resign", "=", "N")
            -> where(function($query) use($searchContent) {
                $query -> where("department", "like", $searchContent)
                       -> orWhere("login_id", "like", $searchContent)
                       -> orWhere("emp_name", "like", $searchContent)
                       -> orWhere("user_domain", "like", $searchContent)
                       -> orWhere("company", "like", $searchContent);
            })
            -> select()
            -> orderBy($sort, $order)
            //-> orderBy("department")
            //-> orderBy("login_id")
            -> Paginate($limit,['*'],null,($offset/$limit)+1);
        return response()->json(["total"=>$userList->total(),"rows"=>$userList->items()]);

//        $userList = \DB::table("qp_user")
//            -> where("resign", "=", "N")
//            -> select()
//            -> orderBy("department")
//            -> orderBy("login_id")
//            -> get();
//        return response()->json($userList);
    }

    public function getUserListWithoutGroup() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $userIdList = $jsonContent['user_id_list'];
            try {
                foreach ($userIdList as $uId) {
                    \DB::beginTransaction();
                    \DB::table("qp_user")
                        -> where('row_id', '=', $uId)
                        -> update(
                            ['status'=>'N',
                                'updated_at'=>$now,
                                'updated_user'=>\Auth::user()->row_id]);

                    $userInfo = CommonUtil::getUserInfoByRowId($uId);
                    $tag = PushUtil::GetTagByUserInfo($userInfo);
                    foreach ($userInfo->uuidList as $uuid) {
                        $pushToken = $uuid->uuid;
                        $pushResult = PushUtil::RemoveTagsWithJPushWebAPI($pushToken, $tag);
                    }

                    $registerList = \DB::table("qp_register")
                        ->where("user_row_id", "=", $uId)
                        ->select()->get();
                    foreach ($registerList as $registerInfo)
                    {
                        $registerId = $registerInfo->row_id;
                        \DB::table("qp_push_token")
                            ->where("register_row_id", "=", $registerId)
                            ->delete();
                        \DB::table("qp_register")
                            ->where("row_id", "=", $registerId)
                            ->delete();
                        \DB::table("qp_session")
                            ->where("user_row_id", "=", $uId)
                            ->delete();
                    }
                    DB::commit();
                }
            }
            catch(\Exception $e){
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError]);
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful]);
        }else  {
            return response()->json(['result_code'=>ResultCode::_999999_unknownError]);
        }
    }

    public function saveUser() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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
                $pushResult = null;
                if($status == "N") {
                    $userInfo = CommonUtil::getUserInfoByRowId($userId);
                    $tag = PushUtil::GetTagByUserInfo($userInfo);
                    foreach ($userInfo->uuidList as $uuid) {
                        $pushToken = $uuid->uuid;
                        $pushResult = PushUtil::RemoveTagsWithJPushWebAPI($pushToken, $tag);
                    }

                    $registerList = \DB::table("qp_register")
                        ->where("user_row_id", "=", $userId)
                        ->select()->get();
                    foreach ($registerList as $registerInfo)
                    {
                        $registerId = $registerInfo->row_id;
                        \DB::table("qp_push_token")
                            ->where("register_row_id", "=", $registerId)
                            ->delete();
                        \DB::table("qp_register")
                            ->where("row_id", "=", $registerId)
                            ->delete();
                        \DB::table("qp_session")
                            ->where("user_row_id", "=", $userId)
                            ->delete();
                    }
                }

                \DB::commit();
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,'jpush-result'=>$pushResult]);
            } catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'content']);
            }
        } else {
            return response()->json(['result_code'=>ResultCode::_999999_unknownError]);
        }
    }

    public function deleteRole() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

        $input = Input::get();
        $menuId = $input["menu_id"];

        return CommonUtil::getSubMenuList($menuId);
    }

    public function deleteMenu() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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

        CommonUtil::setLanguage();

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
    
    public function getProjectList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

        $query = \DB::table("qp_project");
            if(!\Auth::user()->isAppAdmin()){
               $query -> where('created_user','=',\Auth::user()->row_id);
               $query -> orwhere('project_pm','=',\Auth::user()->login_id);
            }
            $projectList =  $query-> orderBy("project_code")
            -> select()
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
                     $project->app_row_id =  $appId;
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

            $pm = CommonUtil::getUserInfoJustByUserID($project->project_pm);
            $createUser = CommonUtil::getUserInfoByRowId($project->created_user);
            $project->pm_email = (!is_null($pm))?$pm->email:"";
            $project->created_user_email = (!is_null($createUser))?$createUser->email:"";
        }
        return response()->json($projectList);
    }

    public function deleteProject() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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

    /**
     * 新增專案
     * @param  Request $request  Form Post Request
     * @return json   
     */
    public function newProject(Request $request) {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $app_key = $jsonContent['txbAppKey'];
            $project_pm = $jsonContent['tbxProjectPM'];
            $project_description = $jsonContent['tbxProjectDescription'];
            $mailTo = array(\Auth::user()->email);
          
            \DB::connection('mysql_production')->beginTransaction();
            \DB::connection('mysql_test')->beginTransaction();
            \DB::connection('mysql_dev')->beginTransaction();
            try{
                $validator = \Validator::make($request->all(), [
                'txbAppKey' => 'required|regex:/^[a-z]*$/|max:50|is_app_key_unique',
                'tbxProjectPM' => 'required|is_user_exist',
                'tbxProjectDescription' => 'required'
                ]);

                if ($validator->fails()) {
                 return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,'message'=>$validator->messages()], 200);
                }
                
                $projectCode = $this->projectService->getProjectCode(\DB::connection('mysql_production'));
                if(is_null($projectCode)){
                      throw new Exception('newProjectError :There might have project code not 3 digit number in DB.');
                }           
                $secretKey = hash('md5', CommonUtil::generateRandomString());

                $this->projectService->newProject('production', $app_key, $secretKey, $projectCode, $project_description, $project_pm);
                $this->projectService->newProject('test', $app_key, $secretKey, $projectCode, $project_description, $project_pm);
                $this->projectService->newProject('dev', $app_key, $secretKey, $projectCode, $project_description, $project_pm);

               //send project information
               $pm = CommonUtil::getUserInfoJustByUserID($project_pm);
               $envAppKey =  CommonUtil::getContextAppKey(\Config::get('app.env'),$app_key);

               array_push($mailTo,$pm->email);
               $mailTo = array_unique($mailTo);

               $this->projectService->sendProjectInformation($mailTo, $envAppKey, $secretKey, $projectCode);

                \DB::connection('mysql_production')->commit();
                \DB::connection('mysql_test')->commit();
                \DB::connection('mysql_dev')->commit();
            }catch (\Exception $e) {
                \DB::connection('mysql_production')->rollBack();
                \DB::connection('mysql_test')->rollBack();
                \DB::connection('mysql_dev')->rollBack();
               return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
            }
           
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    /**
     * 更新專案
     * @param  Request $request Form Post Request
     * @return json
     */
    public function updateProject(Request $request) {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            
            $jsonContent = json_decode($content, true);
            $projectCode = $jsonContent['projectCode'];
            $project_pm = $jsonContent['tbxProjectPM'];
            $project_description = $jsonContent['tbxProjectDescription'];
            $project_memo = $jsonContent['tbxProjectMemo'];
               
            \DB::connection('mysql_production')->beginTransaction();
            \DB::connection('mysql_test')->beginTransaction();
            \DB::connection('mysql_dev')->beginTransaction();

            try{

                $validator = \Validator::make($request->all(), [
                'projectCode'           => 'required',
                'tbxProjectPM'          => 'required|is_user_exist',
                'tbxProjectDescription' => 'required'
                ]);

                if ($validator->fails()) {
                 return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,'message'=>$validator->messages()], 200);
                }
                $this->projectService->updateProject('production', $projectCode, $project_description, $project_memo, $project_pm);
                $this->projectService->updateProject('test', $projectCode, $project_description, $project_memo, $project_pm);
                $this->projectService->updateProject('dev', $projectCode, $project_description, $project_memo, $project_pm);

                \DB::connection('mysql_production')->commit();
                \DB::connection('mysql_test')->commit();
                \DB::connection('mysql_dev')->commit();

            }catch (\Exception $e) {

                \DB::connection('mysql_production')->rollBack();
                \DB::connection('mysql_test')->rollBack();
                \DB::connection('mysql_dev')->rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);

        }

        return null;
    }

    /**
     * 寄送專案資訊給PM以及申請人
     * @param  Request $request form post request
     * @return json
     */
    public function sendProjectInformation(Request $request){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

         $validator = \Validator::make($request->all(), [
            'appKey' => 'required|regex:/^[a-z]*$/|max:50|is_app_key_unique',
            ]);
        
        CommonUtil::setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $app_key = $jsonContent['appKey'];
            $receiver = $jsonContent['receiver'];
            try{
                $projectInfo = $this->projectRepository->getProjectInfoByAppKey($app_key);
                $secretKey =  $projectInfo->secret_key;
                $projectCode =  $projectInfo->project_code;
                $this->projectService->sendProjectInformation($receiver, $app_key, $secretKey, $projectCode);
            
            } catch (\Exception $e) {    
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,]);
            }
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }
        return null;
    }
}
