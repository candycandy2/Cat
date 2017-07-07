<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\PushUtil;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use DB;

class pushController extends Controller
{
    public function getMessageList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

        $messageList = array();
        if(\Auth::user()->isAdmin()) {
            $messageList = \DB::table("qp_message")
                -> leftJoin("qp_user",  "qp_user.row_id", "=", "qp_message.created_user")
                -> leftJoin("qp_message_send",  "qp_message_send.message_row_id", "=", "qp_message.row_id")
                -> select("qp_message.row_id", "qp_message.message_type",
                    "qp_message.message_title", "qp_user.login_id as created_user",
                    "qp_message.created_at", "qp_message.visible",
                    "qp_user.department", "qp_user.site_code",
                    \DB::raw("SUM(qp_message_send.need_push) as need_push" ))
                -> groupBy("qp_message.row_id")
                -> orderBy(\DB::raw('qp_message.created_at'),"DESC")
                -> get();
        } else {
            $messageList = \DB::table("qp_message")
                -> leftJoin("qp_user",  "qp_user.row_id", "=", "qp_message.created_user")
                -> leftJoin("qp_message_send",  "qp_message_send.message_row_id", "=", "qp_message.row_id")
                -> select("qp_message.row_id", "qp_message.message_type",
                    "qp_message.message_title", "qp_user.login_id as created_user",
                    "qp_message.created_at", "qp_message.visible",
                    "qp_user.department", "qp_user.site_code",
                    \DB::raw("SUM(qp_message_send.need_push) as need_push" ))
                -> where("qp_user.row_id", "=", \Auth::user()->row_id)
                -> orderBy(\DB::raw('qp_message.created_at'),"DESC")
                -> get();
        }

        return response()->json($messageList);
    }

    public function saveNewMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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
                                'created_user'=>\Auth::user()->row_id,
                                'created_at'=>$now,
                            ]);
                        $userListInRole = \DB::table("qp_user_role")
                            ->where("role_row_id", "=", $roleId)
                            ->select()->get();
                        foreach ($userListInRole as $userInRole) {
                            $userId = $userInRole->user_row_id;
                            if(!in_array($userId, $insertedUserIdList)) {
                                $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                                //bug 14023 2017.3.27
                                if (count($currentUserInfo->uuidList)==0){
                                    $currentUserInfo->uuidList = [
                                        ["uuid"=>$userId]
                                    ];
                                }
                                foreach ($currentUserInfo->uuidList as $uuid) {
                                    \DB::table("qp_user_message")
                                        -> insert([
                                            'project_row_id'=>1,
                                            'user_row_id'=>$userId,
                                            'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                            'message_send_row_id'=>$newMessageSendId,
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
                            //bug 14023 2017.3.27
                            if (count($currentUserInfo->uuidList)==0){
                                $currentUserInfo->uuidList = [
                                    ["uuid"=>$userId]
                                ];
                            }
                            foreach ($currentUserInfo->uuidList as $uuid) {
                                \DB::table("qp_user_message")
                                    -> insert([
                                        'project_row_id'=>1,
                                        'user_row_id'=>$userId,
                                        'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                        'message_send_row_id'=>$newMessageSendId,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                            }
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

    public function getMessageSendList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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

    public function saveMessageVisible() {
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

    public function saveUpdateMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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
                                $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                                //bug 14023 2017.3.27
                                if (count($currentUserInfo->uuidList)==0){
                                    $currentUserInfo->uuidList = [
                                        ["uuid"=>$userId]
                                    ];
                                }
                                foreach ($currentUserInfo->uuidList as $uuid) {
                                    \DB::table("qp_user_message")
                                        -> insert([
                                            'project_row_id'=>1,
                                            'user_row_id'=>$userId,
                                            'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
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
                            //bug 14023 2017.3.27
                            if (count($currentUserInfo->uuidList)==0){
                                $currentUserInfo->uuidList = [
                                    ["uuid"=>$userId]
                                ];
                            }
                            foreach ($currentUserInfo->uuidList as $uuid) {
                                \DB::table("qp_user_message")
                                    -> insert([
                                        'project_row_id'=>1,
                                        'user_row_id'=>$userId,
                                        'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
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

    public function getSingleEventMessageReceiver() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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

    public function saveUpdateAndPushMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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

            $is_schedule = $jsonContent['is_schedule'];
            $schedule_datetime = $jsonContent['schedule_datetime'];

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
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

                \DB::table("qp_role_message")
                    -> where('message_send_row_id', '=', $messageSendId)
                    -> delete();
                \DB::table("qp_user_message")
                    -> where('message_send_row_id', '=', $messageSendId)
                    -> delete();

                $real_push_user_list = array();
                $event_push_token_list = array();
                if($receiver["type"] == "event") {
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
                                $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                                //bug 14023 2017.3.27
                                if (count($currentUserInfo->uuidList)==0){
                                    $currentUserInfo->uuidList = [
                                        ["uuid"=>$userId]
                                    ];
                                }
                                if($currentUserInfo->status == "Y" && $currentUserInfo->resign == "N") {
                                    foreach ($currentUserInfo->uuidList as $uuid) {
                                        \DB::table("qp_user_message")
                                            -> insert([
                                                'project_row_id'=>1,
                                                'user_row_id'=>$userId,
                                                'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                                'message_send_row_id'=>$messageSendId,
                                                'created_user'=>\Auth::user()->row_id,
                                                'created_at'=>$now,
                                            ]);
                                        if(!is_array($uuid)){
                                            array_push($event_push_token_list,$uuid->push_token);
                                        }
                                    }
                                    array_push($insertedUserIdList, $userId);
                                    array_push($real_push_user_list, $userId);
                                }
                            }
                        }
                    }

                    foreach($userList as $userId) {
                        if(!in_array($userId, $insertedUserIdList)) {
                            $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                            if($currentUserInfo->status != "Y") {
                                if(count($roleList) == 0) {
                                    \DB::rollBack();
                                    return response()->json(['result_code'=>ResultCode::_000914_userWithoutRight,
                                        CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)]);
                                } else {
                                    //TODO Log
                                }
                            }
                            //bug 14023 2017.3.27
                            if (count($currentUserInfo->uuidList)==0){
                                $currentUserInfo->uuidList = [
                                    ["uuid"=>$userId]
                                ];
                            }
                            foreach ($currentUserInfo->uuidList as $uuid) {
                                \DB::table("qp_user_message")
                                    -> insert([
                                        'project_row_id'=>1,
                                        'user_row_id'=>$userId,
                                        'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                        'message_send_row_id'=>$messageSendId,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                if(!is_array($uuid)){
                                    array_push($event_push_token_list,$uuid->push_token);
                                }
                            }
                            array_push($insertedUserIdList, $userId);
                            array_push($real_push_user_list, $userId);
                        }
                    }
                }

                if($receiver["type"] == "news") {
                    $news_push_token_list = [];
                    foreach ($companyList as $company) {
                        for ($i = 1; $i <= 6; $i++) {
                            array_push($news_push_token_list, strtoupper($company) . $i);
                        }
                    }
                    if($is_schedule) {
                        $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$messageSendId, $schedule_datetime, $title, $news_push_token_list, $messageSendId, true);
                    } else {
                        $result = PushUtil::PushMessageWithJPushWebAPI($title, $news_push_token_list, $messageSendId, true);
                    }
                } else {
                    if($is_schedule) {
                        $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$messageSendId, $schedule_datetime, $title, $event_push_token_list, $messageSendId);
                    } else {
                        $result = PushUtil::PushMessageWithJPushWebAPI($title, $event_push_token_list, $messageSendId);
                    }
                }

                if(!$result["result"]) {
                    \DB::table("qp_message_send")
                        -> where(['row_id'=>$messageSendId])
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->row_id,
                            'updated_at'=>$now
                        ]);
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'send_id'=>$messageSendId, 'message_id'=>$messageId]);
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

        CommonUtil::setLanguage();

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $message_id = $jsonContent['message_id'];
            $receiver = $jsonContent['receiver'];

            $is_schedule = $jsonContent['is_schedule'];
            $schedule_datetime = $jsonContent['schedule_datetime'];

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

                if($receiver["type"] == "event") {
                    $roleList = $receiver["role_list"];
                    $userList = $receiver["user_list"];

                    $insertedUserIdList = array();
                    $event_push_token_list = array();
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
                                $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                                //bug 14023 2017.3.27
                                if (count($currentUserInfo->uuidList)==0){
                                    $currentUserInfo->uuidList = [
                                        ["uuid"=>$userId]
                                    ];
                                }
                                if($currentUserInfo->status == "Y" && $currentUserInfo->resign == "N") {
                                    foreach ($currentUserInfo->uuidList as $uuid) {
                                        \DB::table("qp_user_message")
                                            -> insert([
                                                'project_row_id'=>1,
                                                'user_row_id'=>$userId,
                                                'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                                'message_send_row_id'=>$newMessageSendId,
                                                'created_user'=>\Auth::user()->row_id,
                                                'created_at'=>$now,
                                            ]);
                                        if(!is_array($uuid)){
                                            array_push($event_push_token_list,$uuid->push_token);
                                        }
                                    }
                                    array_push($insertedUserIdList, $userId);
                                    array_push($real_push_user_list, $userId);
                                }
                            }

                        }
                    }

                    foreach($userList as $userId) {
                        if(!in_array($userId, $insertedUserIdList)) {
                            $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                            //bug 14023 2017.3.27
                            if (count($currentUserInfo->uuidList)==0){
                                $currentUserInfo->uuidList = [
                                    ["uuid"=>$userId]
                                ];
                            }
                            foreach ($currentUserInfo->uuidList as $uuid) {
                                \DB::table("qp_user_message")
                                    -> insert([
                                        'project_row_id'=>1,
                                        'user_row_id'=>$userId,
                                        'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                        'message_send_row_id'=>$newMessageSendId,
                                        'created_user'=>\Auth::user()->row_id,
                                        'created_at'=>$now,
                                    ]);
                                if(!is_array($uuid)){
                                    array_push($event_push_token_list,$uuid->push_token);
                                }
                            }
                            array_push($insertedUserIdList, $userId);
                            array_push($real_push_user_list, $userId);
                        }
                    }
                }

                if($receiver["type"] == "news") {
                    $news_push_token_list = array();
                    foreach ($companyList as $company) {
                        for ($i = 1; $i <= 6; $i++) {
                            array_push($news_push_token_list, strtoupper($company) . $i);
                        }
                    }
                    if($is_schedule) {
                        $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$newMessageSendId, $schedule_datetime, $title, $news_push_token_list, $newMessageSendId, true);
                    } else {
                        $result = PushUtil::PushMessageWithJPushWebAPI($title, $news_push_token_list, $newMessageSendId, true);
                    }
                } else {
                    if($is_schedule) {
                        $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$newMessageSendId, $schedule_datetime, $title, $event_push_token_list, $newMessageSendId);
                    } else {
                        $result = PushUtil::PushMessageWithJPushWebAPI($title, $event_push_token_list, $newMessageSendId);
                    }
                }

                if(!$result["result"]) {
                    \DB::table("qp_message_send")
                        -> where(['row_id'=>$newMessageSendId])
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->row_id,
                            'updated_at'=>$now
                        ]);
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e]);
            }
        }
    }

    //Secretary Push
    public function getSecretaryMessageList() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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

    public function pushSecretaryMessage() {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

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
            $message_id = $jsonContent['message_id'];

            $is_schedule = $jsonContent['is_schedule'];
            $schedule_datetime = $jsonContent['schedule_datetime'];

            $now = date('Y-m-d H:i:s',time());
            \DB::beginTransaction();
            try {
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
                        'message_row_id'=>$message_id,
                        'source_user_row_id'=>\Auth::user()->row_id,
                        'company_label'=>$companyLabel,
                        'need_push'=>1,
                        'push_flag'=>0,
                        'created_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                    ]);

                $real_push_user_list = array();
                $push_token_list = array();
                if($receiver["type"] != "company") {
                    $userList = $receiver["user_list"];
                    foreach($userList as $userId) {
                        $currentUserInfo = CommonUtil::getUserInfoByRowId($userId);
                        //bug 14023 2017.3.27
                        if (count($currentUserInfo->uuidList)==0){
                            $currentUserInfo->uuidList = [
                                ["uuid"=>$userId]
                            ];
                        }
                        foreach ($currentUserInfo->uuidList as $uuid) {
                            \DB::table("qp_user_message_pushonly")
                                -> insert([
                                    'project_row_id'=>1,
                                    'user_row_id'=>$userId,
                                    'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                    'message_send_pushonly_row_id'=>$newMessageSendId,
                                    'created_user'=>\Auth::user()->row_id,
                                    'created_at'=>$now,
                                ]);
                            if(!is_array($uuid)){
                                array_push($push_token_list,$uuid->push_token);
                            }
                        }
                        array_push($real_push_user_list, $userId);
                    }
                }

                $messageSendRowIdList = DB::table("qp_message_send")
                    ->join("qp_message_send_pushonly","qp_message_send_pushonly.message_row_id","=","qp_message_send.message_row_id")
                    ->join('qp_message', function($join)
                    {
                        $join->on("qp_message.row_id","=","qp_message_send_pushonly.message_row_id")
                            ->on("qp_message.row_id","=","qp_message_send.message_row_id");
                    })
                    ->where("qp_message_send_pushonly.row_id","=",$newMessageSendId)
                    ->select("qp_message_send.row_id")
                    ->get();
                $messageSendRowId = $messageSendRowIdList[0]->row_id;
                if($receiver["type"] == "company") {
                    $tag_list = array();
                    foreach ($companyList as $company) {
                        for ($i = 1; $i <= 6; $i++) {
                            array_push($tag_list, strtoupper($company) . $i);
                        }
                    }
                    if($is_schedule) {
                        $result = PushUtil::PushScheduleMessageWithJPushWebAPI("pushonly".$newMessageSendId, $schedule_datetime, $title, $tag_list, $newMessageSendId, true);
                    } else {
                        $result = PushUtil::PushMessageWithJPushWebAPI($title, $tag_list, $messageSendRowId, true);
                    }
                } else {
                    if($is_schedule) {
                        $result = PushUtil::PushScheduleMessageWithJPushWebAPI("pushonly".$newMessageSendId, $schedule_datetime, $title, $push_token_list, $newMessageSendId);
                    } else {
                        $result = PushUtil::PushMessageWithJPushWebAPI($title, $push_token_list, $messageSendRowId);
                    }
                }

                if(!$result["result"]) {
                    \DB::table("qp_message_send")
                        -> where('row_id',"=",$messageSendRowId)
                        -> update([
                            'jpush_error_code'=>$result["info"],
                            'updated_user'=>\Auth::user()->row_id,
                            'updated_at'=>$now
                        ]);
                }

                \DB::commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful, 'message'=>"From MessageCenter:" .$result["info"], 'send_id'=>$messageSendRowId, 'message_id'=>$message_id]);
            }catch (\Exception $e) {
                \DB::rollBack();
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>$e->getMessage().$e->getTraceAsString()]);
            }
        }
    }
}
