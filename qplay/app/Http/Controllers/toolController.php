<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\PushUtil;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use DB;

class toolController extends Controller
{
    public function syncJpushTags() {
        $result = ['result_code'=>ResultCode::_1_reponseSuccessful, 'content'=>''];

        $userList = \DB::table("qp_user") 
            -> where('status', '=', 'Y')
            -> where('resign', '=', 'N')
            -> select()
            -> get();
        foreach ($userList as $user) {
            $tag = PushUtil::GetTagByUserInfo($user);
            $userRowId = $user->row_id;
            $registerInfoList = \DB::table("qp_register")
                -> where('status', '=', 'A')
                -> where('user_row_id', '=', $userRowId)
                -> select()
                -> get();
            foreach ($registerInfoList as $registerInfo) {
                $registerRowId = $registerInfo->row_id;
                $pushTokenInfoList = \DB::table("qp_push_token")
                    -> where('register_row_id', '=', $registerRowId)
                    -> select()
                    -> get();
                foreach ($pushTokenInfoList as $pushTokenInfo) {
                    $pushToken = $pushTokenInfo->push_token;
                    $pushResult = PushUtil::AddTagsWithJPushWebAPI($pushToken, $tag);
                    if(!$pushResult["result"]) {
                        $result["result_code"] = ResultCode::_999999_unknownError;
                        $result["content"] .= $pushToken . "-" . $tag ."-Error-".$pushResult["info"].";";
                    }else{
                        $result["content"] .= $pushToken . "-" . $tag ."-Success-".$pushResult["info"].";";
                    }
                }
            }
        }

        return response()->json($result);
    }
}
