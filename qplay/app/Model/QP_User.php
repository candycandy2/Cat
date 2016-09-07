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

    public function getMenuList()
    {
        $userId = $this->row_id;

        $menuFromGroup = "N";
        $groupId = -1;
        $groupList = DB::table("qp_user_group")->where("user_row_id", "=", $userId)->select()->get();
        if(count($groupList) > 0) {
            if($groupList[0]->authority_by_group == "Y") {
                $menuFromGroup = "Y";
                $groupId = $groupList[0]->group_row_id;
            }
        }

        $lang = 'en-us';
        if(\Session::has("lang"))
        {
            $lang = \Session::get("lang");
        }

        if($menuFromGroup == "Y") {
            $sql = <<<SQL
select menu.row_id as Id, menu.menu_name as Name, path as Url, parent_id as pId , ml.menu_name as sName
from qp_menu menu
join qp_menu_language ml on ml.menu_row_id = menu.row_id
and ml.lang_row_id in (select l.row_id from qp_language l where l.lang_code = '$lang')
and menu.row_id in
 (
select distinct menu_row_id from qp_group_menu gm where gm.group_row_id = $groupId
)
and menu.visible = 'Y'
SQL;
        } else {
            $sql = <<<SQL
select menu.row_id as Id, menu.menu_name as Name, path as Url, parent_id as pId , ml.menu_name as sName
from qp_menu menu
join qp_menu_language ml on ml.menu_row_id = menu.row_id
and ml.lang_row_id in (select l.row_id from qp_language l where l.lang_code = '$lang')
and menu.row_id in
 (
select distinct menu_row_id from qp_user_menu gm where gm.user_row_id = $userId
)
and menu.visible = 'Y'
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
}
