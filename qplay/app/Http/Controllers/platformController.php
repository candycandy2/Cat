<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use Illuminate\Http\Request;

use App\Http\Requests;

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
}
