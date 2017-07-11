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
        $result = ['result_code'=>ResultCode::_1_reponseSuccessful, 'content'=>array()];

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
                        $result["content"][] = ["push_token"=>$pushToken, "tag"=>$tag, "result"=>$pushResult["info"]];
                    }else{
                        $result["content"][] = ["push_token"=>$pushToken, "tag"=>$tag, "result"=>$pushResult["info"]];
                    }
                }
            }
        }

        return response()->json($result);
    }

    public function getRegisterList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $result = \DB::table("qp_register")
        -> join('qp_user','qp_user.row_id','=','qp_register.user_row_id')
        -> select()
        -> get();
        return json_encode($result);
    }

    public function removeDeviceRegistedData(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {
             \DB::beginTransaction();
            try{
                $jsonContent = json_decode($content, true);
                $uuidList = $jsonContent['uuid_list'];
                \DB::table("qp_register")
                -> whereIn('uuid', $uuidList)
                -> delete();
                \DB::table("qp_push_token")
                -> whereIn('push_token', $uuidList)
                -> delete();
                \DB::table("qp_session")
                -> whereIn('uuid', $uuidList)
                -> delete();
                \DB::commit();
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
             }catch(\Exception $e){
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>trans("messages.MSG_OPERATION_FAILED").$e->getMessage(),
                    'content'=>''
                ]);
               \DB::rollBack();
            }
        }

        return null;
    }
}
