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
}
