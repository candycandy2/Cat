<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午1:25
 */

use App\Http\Controllers\platformController;
use Config;
use DB;
use Request;
use Illuminate\Support\Facades\Input;
use JPush\Client as JPush;

class CommonUtil
{
    public static function setLanguage() {
        //date_default_timezone_set('UTC');
        //date_default_timezone_set('PRC');
        \App::setLocale("en-us");
        if(\Session::has('lang') && \Session::get("lang") != "") {
            \App::setLocale(\Session::get("lang"));
        }
    }

    public static function getUserInfoByRowId($userRowId) {
        $userList = \DB::table('qp_user')
            -> where('qp_user.row_id', '=', $userRowId)
            -> select()->get();
        if(count($userList) < 1) {
            return null;
        }
        $userList[0] -> uuidList = array();
        $userList[0] -> uuidList = \DB::table('qp_register')
            ->join("qp_push_token","qp_push_token.register_row_id","=","qp_register.row_id")
            -> where('user_row_id', '=', $userList[0]->row_id)
            -> where('status', '=', 'A')
            -> select('qp_register.uuid',"qp_push_token.push_token")
            ->get();

        return $userList[0];
    }

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

        $user = $userList[0];
        $user->roleList = array();

        $roleList = \DB::table('qp_user_role')
            -> where('user_row_id', '=', $user->row_id)
            -> select('role_row_id')->get();

        foreach ($roleList as $role) {
            $user->roleList[] = $role->role_row_id;
        }

        $user->group_id = null;
        $user->authority_by_group = null;
        $groupList = \DB::table('qp_user_group')
            -> where('user_row_id', '=', $user->row_id)
            -> select('group_row_id','authority_by_group')->get();
        if(count($groupList) > 0) {
            $user->group_id = $groupList[0]->group_row_id;
            $user->authority_by_group =  $groupList[0]->authority_by_group;
        }

        $user->menuList = array();
        if($user->authority_by_group != null && $user->authority_by_group == "Y") {
            $menuList = \DB::table('qp_group_menu')
                -> where('group_row_id', '=', $user->group_id)
                -> select('menu_row_id')->get();
            foreach ($menuList as $menu) {
                $user->menuList[] = $menu->menu_row_id;
            }
        } else {
            $menuList = \DB::table('qp_user_menu')
                -> where('user_row_id', '=', $user->row_id)
                -> select('menu_row_id')->get();
            foreach ($menuList as $menu) {
                $user->menuList[] = $menu->menu_row_id;
            }
        }

        return $user;
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

    public static function getUserInfoJustByUserID($loginId, $domain=null)
    {
        $query = \DB::table('qp_user')
            -> where('qp_user.status', '=', 'Y')
            -> where('qp_user.resign', '=', 'N')
            -> where('qp_user.login_id', '=', $loginId);
        if(!is_null($domain)){
            $query -> where('qp_user.user_domain', '=', $domain);
        }
         $userList= $query -> select('qp_user.row_id','emp_no','email')->get();
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
            ->select('company')->distinct()->orderBy('company')->get();
        foreach ($companyList as $company) {
            $roleList = \DB::table('qp_role')
                ->where('company', '=', $company->company)
                ->select()->orderBy('role_description')->get();
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
        foreach ($groupList as $group) {
            $menuList = \DB::table('qp_group_menu')
                ->where('group_row_id', '=', $group->row_id)
                ->select()->get();
            $group->menuList = array();
            foreach ($menuList as $menu)
            {
                $group->menuList[] = $menu;
            }
        }
        return $groupList;
    }

    public static function getGroup($groupId) {
        $groupList = \DB::table('qp_group')
            ->where("row_id", "=", $groupId)
            ->select()->get();
        if(count($groupList) > 0) {
            $groupInfo = $groupList[0];
            $groupInfo->menuList = array();
            $menuList = \DB::table('qp_group_menu')
                ->where('group_row_id', '=', $groupInfo->row_id)
                ->select()->get();
            foreach ($menuList as $menu)
            {
                $groupInfo->menuList[] = $menu->menu_row_id;
            }

            return $groupInfo;
        }
        return null;
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

    public static function getMenuInfo($menuId) {
        $menuInfoList = \DB::table("qp_menu")
            -> where("row_id", "=", $menuId)
            -> select()
            -> get();
        if(count($menuInfoList) == 0) {
            return null;
        }

        $menu = $menuInfoList[0];
        $menu = self::getMenuMultyLanguage($menu);

        return $menu;
    }

    public static function getSubMenuList($rootMenuId) {
        $menuList = \DB::table("qp_menu")
            -> where("parent_id", "=", $rootMenuId)
            -> select()
            -> get();
        for($i = 0; $i < count($menuList); $i ++) {
            $menu = $menuList[$i];
            $menuList[$i] = CommonUtil::getMenuMultyLanguage($menu);
        }

        return $menuList;
    }

    public static function getMenuMultyLanguage($menu) {
        $menuId = $menu->row_id;

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

        return $menu;
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
        $lang_row_id = self::getLanguageIdByName(session('lang'));
        //$project_id = self::getProjectInfo()->row_id;
        $errorMessage = \DB::table('qp_error_code')
            -> where('lang_row_id', '=', $lang_row_id)
            -> where('error_code', '=', $messageCode)
            //-> where ('project_row_id','=',$project_id)
            -> select("qp_error_code.error_desc")
            ->get();
        if(count($errorMessage) < 1) {
            return "";
        }
        $result = $errorMessage[0]->error_desc;
        return $result;
    }

    public static function getLanguageIdByName($lang) {
        $lang_row_id = 1;
        if (empty($lang)){
            return $lang_row_id;
        }
        $lang = strtolower($lang);

        switch ($lang) {
            case "en-us":
                $lang_row_id = 1;
                break;
            case "zh-cn":
                $lang_row_id = 2;
                break;
            case "zh-tw":
                $lang_row_id = 3;
                break;
        }
        return $lang_row_id;
    }

    public static function getMessageInfo($messageId) {
        $messageList = \DB::table('qp_message')
            -> where('row_id', '=', $messageId)
            -> select()->get();
        if(count($messageList) < 1) {
            return null;
        }

        $messageInfo = $messageList[0];

        $sendList = \DB::table('qp_message_send')
            -> where('message_row_id', '=', $messageId)
            -> select()->get();
        $messageInfo->send_list = $sendList;

        return $messageInfo;
    }

    public static function getMessageSendInfo($messageSendId) {
        $messageSendList = \DB::table('qp_message_send')
            -> leftJoin("qp_user", "qp_user.row_id", "=", "qp_message_send.created_user")
            -> where('qp_message_send.row_id', '=', $messageSendId)
            -> select("qp_message_send.*", "qp_user.login_id as source_user")->get();
        if(count($messageSendList) < 1) {
            return null;
        }

        $sendInfo = $messageSendList[0];

        $messageList = \DB::table('qp_message')
            -> where('row_id', '=', $sendInfo->message_row_id)
            -> select()->get();
        if(count($messageList) < 1) {
            return null;
        }

        $sendInfo->message_info = $messageList[0];
        $sendInfo->role_list = array();
        $sendInfo->company_list = array();
        $sendInfo->user_list = array();

        $roleList = \DB::table('qp_role_message')
            -> where('message_send_row_id', '=', $messageSendId)
            -> select()->get();
        foreach ($roleList as $role) {
            array_push($sendInfo->role_list, $role->role_row_id);
        }

        if($sendInfo->message_info->message_type == "event") {

        } else {
            $companyStr = $sendInfo->company_label;
            $sendInfo->company_list = explode(";", $companyStr);
//            if(count($sendInfo->role_list) > 0) {
//                $companyList = \DB::table('qp_role')
//                    -> whereIn('row_id', $sendInfo->role_list)
//                    -> select('company')->distinct()->get();
//                foreach ($companyList as $companyInfo) {
//                    array_push($sendInfo->company_list, $companyInfo->company);
//                }
//            }
        }

        return $sendInfo;
    }

    public static function getSecretaryMessageSendInfo($messageSendId) {
        $messageSendList = \DB::table('qp_message_send_pushonly')
            -> leftJoin("qp_user", "qp_user.row_id", "=", "qp_message_send_pushonly.created_user")
            -> where('qp_message_send_pushonly.row_id', '=', $messageSendId)
            -> select("qp_message_send_pushonly.*", "qp_user.login_id as source_user")->get();
        if(count($messageSendList) < 1) {
            return null;
        }

        $sendInfo = $messageSendList[0];

        $messageList = \DB::table('qp_message')
            -> where('row_id', '=', $sendInfo->message_row_id)
            -> select()->get();
        if(count($messageList) < 1) {
            return null;
        }

        $sendInfo->message_info = $messageList[0];

        $sendInfo->company_list = array();
        $sendInfo->user_list = array();
        if(trim($sendInfo->company_label) != '') {
            $sendInfo->send_type = 'company';
            $companyStr = $sendInfo->company_label;
            $sendInfo->company_list = explode(";", $companyStr);
        } else {
            $sendInfo->send_type = 'designated';
            $sendInfo->user_list = self::getSecretaryMessageDesignatedReceiver($messageSendId);
        }

        return $sendInfo;
    }

    public static function getSecretaryMessageDesignatedReceiver($messageSendId) {
        $userList = \DB::table('qp_user_message_pushonly')
            -> where('message_send_pushonly_row_id', '=', $messageSendId)
            -> select()->get();

        return $userList;
    }

    public static function getCategoryInfoByRowId($categoryId){
        $categoryList = \DB::table('qp_app_category')
            -> where('row_id', '=', $categoryId)
            -> select('row_id', 'app_category')->get();
        
        if(count($categoryList) < 1) {
            return null;
        }

        return $categoryList[0];
    }

    public static function getNonUsedProjectList()
    {
        $applistArray = array();
                $appList = \DB::table("qp_app_head")
                -> select("project_row_id")
                -> distinct()
                -> get();
                foreach ($appList as $app)
                {
                    $applistArray[] = $app->project_row_id;
                }

        $projectList = \DB::table('qp_project')
            -> select('row_id', 'app_key')
            ->whereNotIn('row_id', $applistArray)
            ->get();
        return $projectList;
    }

    public static function getProjectInfoById($projectId)
    {
        $projectList = \DB::table('qp_project')
            -> where("row_id", "=", $projectId)
            -> select()->get();
        if(count($projectList) > 0) {
            return $projectList[0];
        }
        return null;
    }

    public static function getLangList(){
        $langList = \DB::table('qp_language')
            -> select('row_id', 'lang_code', 'lang_desc')->get();
        return $langList;
    }

    public static function getAllCategoryList(){
        $categoryList = \DB::table('qp_app_category')
            -> select('row_id', 'app_category')
            -> orderBy('app_category')
            ->get();
        if(count($categoryList) > 0) {
             return $categoryList;
        }
        return null;
    }

    public static function getAppRoleByAppId($appId){
        $enableRole = \DB::table('qp_role_app')
            -> select('row_id', 'role_row_id')
            -> where('app_row_id','=',$appId)
            ->get();
        return $enableRole;
    }

    public static function getAppVersionStatus($appId){
        
      $appStatus = array('android'=>array(
                                    'str'=>'Unpublish',
                                    'versionCode'=>'',
                                    'url'=>''
                                ),
                         'ios'=>array(
                                    'str'=>'Unpublish',
                                    'versionCode'=>'',
                                    'url'=>''
                                )
                        );
    
      foreach ( $appStatus as $key => $value) {     
          $deviceStatus = \DB::table('qp_app_version')
            -> select('version_name','version_code','url')
            -> where('app_row_id','=',$appId)
            -> where('device_type','=',$key)
            -> where('status','=','ready')
            ->first();
        if(count($deviceStatus) > 0){
            $appStatus[$key]['str'] = $deviceStatus->version_name;
            $appStatus[$key]['versionCode'] = $deviceStatus->version_code;
            $appStatus[$key]['url'] = $deviceStatus->url;
        }
      }
        return $appStatus;
    }

    public static function  removeBOM($str = '')
    {
        if (substr($str, 0,3) == pack("CCC",0xef,0xbb,0xbf))
            $str = substr($str, 3);

        return $str;
    }

    public static function getProjectIdByAppId($appId){
        $projectId = null;
            $appHead = \DB::table('qp_app_head')
            -> select('project_row_id')
            -> where('row_id','=',$appId)
            ->first();
        if(count ($appHead) > 0){
             $projectId = $appHead->project_row_id;
        }
        return $projectId;
    }

    /**
     * 取得0-9 a-z A-Z 亂數
     * @param  integer $length 取得亂數長度(預設10)
     * @return string
     */
    public static function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * 取得所有環境設定
     * @return Array 環境設定代號
     */
    public static function getAllEnv(){
        return array('dev','test','production');
    }

    /**
     * 根據輸入環境取得appkey
     * @return String 
     */
    public static function getContextAppKey($env,$key){
        $env = strtolower($env);
        $key = "app".$key;
        switch ($env)
        {
            case  "dev":
                $key = $key."dev";
                break;
            case  "test":
                $key = $key."test";
                break;
            case  "production":
                break;
            default :
                break;
        }
        return $key;
    }

    /**
     * 根據appKey 取得secretKey
     * @param  String $appKey app-key (ex:appqplaydev)
     * @return mixed  
     */
    public static function getSecretKeyByAppKey($appKey) {
        $projectList = \DB::table('qp_project')
            -> where('qp_project.app_key', '=', $appKey)
            -> select('qp_project.row_id', 'qp_project.secret_key')->get();
        if(count($projectList) > 0) {
            return $projectList[0]->secret_key;
        }

        return null;
    }

    /**
     * 依時區取得與UTC時間的時差
     * @param  String $timeZone 時區
     * @return String +/-毫秒
     */
    public static function getTimeOffset($timeZone){
        $dtz = new \DateTimeZone($timeZone);
        $time = new \DateTime('now', $dtz);
        $offset = $dtz->getOffset( $time ) / 3600;
        $timeOffset  = (int)($offset < 0 ? "-".$offset : $offset) * 1000 * 60 * 60;
        return $timeOffset;
    }

}