<?php

namespace App\Model;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Auth\UserInterface;
use DB;

class QP_User extends Model implements  Authenticatable
{
    protected $table = 'qp_user';
    protected $primaryKey = 'row_id';

    public static $rules = [
        'login_id' => 'required',
        'password'=>'required|alpha_num|between:6,12|confirmed',
    ];

    /**
     * 是否為管理者群組
     * @return boolean 
     */
    public function isAdmin() {
        $adminGroupList = DB::table("qp_group")->where("group_name", '=', "Administrator")->select()->get();
        if(count($adminGroupList) > 0) {
            $adminId = $adminGroupList[0]->row_id;
            $testList = DB::table("qp_user_group")
                ->where("group_row_id", '=', $adminId)
                ->where("user_row_id", '=', $this->row_id)
                ->select()->get();
            if(count($testList) > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否為App管理者
     * @return boolean 
     */
    public function isAppAdmin(){
        $userId = $this->row_id;

        $mainTainMenuId = \DB::table("qp_menu")
            -> where('menu_name','=','SYS_PROJECT_MAINTAIN')
            -> select('row_id')
            -> first();
        if(is_null($mainTainMenuId)){
            return false;
        }
        $groupId  = $this->getMenuGroupId();

        $menu = [];
        if(!is_null($groupId)) {
            $menu = \DB::table("qp_group_menu")
            -> where('group_row_id', '=', $groupId)
            -> where('menu_row_id', '=', $mainTainMenuId->row_id)
            -> select('row_id')
            -> get();
        }else{
            $menu = \DB::table("qp_user_menu")
            -> where('user_row_id', '=', $userId)
            -> where('menu_row_id', '=', $mainTainMenuId->row_id)
            -> select('row_id')
            -> get();
        }
        if(count($menu) > 0){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 取得菜單列表
     * @return Array 菜單列表
     */
    public function getMenuList()
    {   
        $lang = 'en-us';
        if(\Session::has("lang"))
        {
            $lang = \Session::get("lang");
        }
        $defaultMenuName = array('ABOUT','APP_MAINTAIN','SYS_PROJECT_MAINTAIN');
        //取得原始菜單
        $authMenuList = $this->getAuthMenuList();
        
        //剔除預設以免重複
        foreach ($authMenuList as $index => $menu) {
            if(in_array($menu->Name, $defaultMenuName)){
                 unset($authMenuList[$index]);
            }
        }
        //加入預設菜單
        $defaultMenuList = \DB::table("qp_menu as menu")
            -> join('qp_menu_language as ml', 'ml.menu_row_id', '=', 'menu.row_id')
            -> join('qp_language as l', 'ml.lang_row_id', '=', 'l.row_id')
            -> whereIn('menu.menu_name', $defaultMenuName)
            -> where('l.lang_code', '=', $lang)
            -> select('menu.sequence', 'menu.row_id as Id', 'menu.menu_name as Name', 
                'menu.path as Url', 'menu.parent_id as pId', 'ml.menu_name as sName')
            ->get();

        return array_merge($authMenuList,$defaultMenuList);
    }

    /**
     * 由群組或個人權限取得原始菜單列表
     * @return Array 菜單列表
     */
    public function getAuthMenuList(){

        $userId = $this->row_id;
        $groupId  = $this->getMenuGroupId();
        $lang = 'en-us';
        if(\Session::has("lang"))
        {
            $lang = \Session::get("lang");
        }

        if(!is_null($groupId)) {
            $sql = <<<SQL
select menu.sequence, menu.row_id as Id, menu.menu_name as Name, path as Url, parent_id as pId , ml.menu_name as sName
from qp_menu menu
join qp_menu_language ml on ml.menu_row_id = menu.row_id
and ml.lang_row_id in (select l.row_id from qp_language l where l.lang_code = '$lang')
and menu.row_id in
 (
select distinct menu_row_id from qp_group_menu gm where gm.group_row_id = $groupId
)
and menu.visible = 'Y'
order by menu.sequence
SQL;
        } else {
            $sql = <<<SQL
select menu.sequence, menu.row_id as Id, menu.menu_name as Name, path as Url, parent_id as pId , ml.menu_name as sName
from qp_menu menu
join qp_menu_language ml on ml.menu_row_id = menu.row_id
and ml.lang_row_id in (select l.row_id from qp_language l where l.lang_code = '$lang')
and menu.row_id in
 (
select distinct menu_row_id from qp_user_menu gm where gm.user_row_id = $userId
)
and menu.visible = 'Y'
order by menu.sequence
SQL;
        }

        $menuList = $r = DB::select($sql, []);

        return $menuList;
    }

    public function getAuthIdentifierName()
    {

    }

    public function getAuthIdentifier()
    {
        return $this->row_id;
    }

    public function getAuthPassword()
    {

    }

    public function getRememberToken()
    {

    }

    public function setRememberToken($value)
    {

    }

    public function getRememberTokenName()
    {

    }
    /**
     * 依環境取得使用者row_id
     * @param string $env
     * @return int   qp_user.row_id
     */
    public function getUserRowId($db){
        $user = \DB::connection($db)->table($this->table)
        ->where("login_id", '=', $this->login_id)->select('row_id')->first();
        return $user->row_id;
        return 32;
    }
    /**
     * 是否使用群組清單
     * @return int 清單Id
     */
    private function getMenuGroupId(){
        $userId = $this->row_id;
        $menuFromGroup = false;
        $groupId = null;
        $groupList = DB::table("qp_user_group")->where("user_row_id", "=", $userId)->select()->get();
        if(count($groupList) > 0) {
            if($groupList[0]->authority_by_group == "Y") {
                $menuFromGroup = true;
                $groupId = $groupList[0]->group_row_id;
            }
        }
        return $groupId;
    }


}
