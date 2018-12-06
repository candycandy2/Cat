    public function sendPushMessage()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyCustom(false);

        $input = Input::get();
        $request = \Request::instance();

        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }

        //For Log
        $ACTION = 'sendPushMessage';

        //通用api參數判斷
        if(!array_key_exists('app_key', $input) || !array_key_exists('need_push', $input)
        || trim($input["app_key"]) == "" || trim($input["need_push"]) == "")
        {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            return response()->json($result);
        }
        
        $isSchedule = false;
        $push_time_utc = 0;
        if(array_key_exists('push_time_utc', $input))
        {
            $isSchedule = true;
            $push_time_utc = trim($input["push_time_utc"]);
        }

        $showInMessageList=true;
        if(array_key_exists('qplay_message_list', $input))
        {
            $showInMessageList = (trim($input["qplay_message_list"])=='Y')?true:false;
        }

        $app_key = $input["app_key"];
        //推播時使用的key
        $pushAppKey = ($showInMessageList)?CommonUtil::getContextAppKey():$app_key;

        $need_push = trim(strtoupper($input["need_push"]));
        if($need_push != "Y" && $need_push != "N") {
            $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
            return response()->json($result);
        }

        if(!$Verify->chkAppKeyExist($app_key)) {
            $result = ['result_code'=>ResultCode::_000909_appKeyNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000909_appKeyNotExist),
                'content'=>''];
            return response()->json($result);
        }

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {
            //$message = file_get_contents('php://input');

            $content = file_get_contents('php://input');//html_entity_decode($request->getContent());
            //$content = iconv('GBK//IGNORE', 'UTF-8', $content);
            $content = CommonUtil::prepareJSON($content);
            if (\Request::isJson($content)) {
                $jsonContent = json_decode($content, true);

                if(!array_key_exists('message_title', $jsonContent) || trim($jsonContent['message_title']) == ""
                || !array_key_exists('template_id', $jsonContent) || trim($jsonContent['template_id']) == ""
                || !array_key_exists('message_type', $jsonContent)
                    || (strtolower($jsonContent['message_type']) != "news" && strtolower($jsonContent['message_type']) != "event")
                || ( (!array_key_exists('message_text', $jsonContent) || trim($jsonContent['message_text']) == "")
                  && (!array_key_exists('message_html', $jsonContent) || trim($jsonContent['message_html']) == "")
                  && (!array_key_exists('message_url', $jsonContent) || trim($jsonContent['message_url']) == "") )
                || !array_key_exists('message_source', $jsonContent) || trim($jsonContent['message_source']) == ""
                || !array_key_exists('source_user_id', $jsonContent) || trim($jsonContent['source_user_id']) == "") {
                    return ['result_code'=>ResultCode::_000918_dataIncomplete,
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                        'content'=>''];
                }
                $need_push_db = 0;
                if($need_push == "Y") {
                    $need_push_db = 1;
                    if(strtolower($jsonContent['message_type']) == "event" &&
                        ( (!array_key_exists('destination_user_id', $jsonContent) || $jsonContent['destination_user_id'] == null)
                            && (!array_key_exists('destination_role_id', $jsonContent) || $jsonContent['destination_role_id'] == null))) {
                        return ['result_code'=>ResultCode::_000918_dataIncomplete,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                            'content'=>''];
                    }

                    if(strtolower($jsonContent['message_type']) == "news" &&
                        (!array_key_exists('destination_user_id', $jsonContent) || $jsonContent['destination_user_id'] == null)) {
                        $result = ['result_code'=>ResultCode::_000918_dataIncomplete,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                            'content'=>''];
                        return response()->json($result);
                    }
                }
                $extraParam = (!array_key_exists('extra', $jsonContent))?"":$jsonContent['extra'];
                $sourceUseId = $jsonContent['source_user_id'];

                $userid = explode('\\', $sourceUseId)[1];
                $domain = explode('\\', $sourceUseId)[0];
                $verifyResult = $Verify->verifyUserByUserIDAndDomain($userid, $domain);
                if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
                    $sourceUserInfo = CommonUtil::getUserInfoJustByUserIDAndDomain($userid, $domain);

                    $projectInfo = CommonUtil::getProjectInfoAppKey($app_key);
                    if($projectInfo == null) {
                        $result = ['result_code'=>ResultCode::_000909_appKeyNotExist,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000909_appKeyNotExist),
                            'content'=>''];
                        return response()->json($result);
                    }

                    $message_type = strtolower($jsonContent['message_type']);
                    $message_title = CommonUtil::jsUnescape(base64_decode($jsonContent['message_title']));
                    if(mb_strlen($message_title,'utf-8') > 99) {
                        $result = ['result_code'=>ResultCode::_000916_titleLengthTooLong,
                            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000916_titleLengthTooLong),
                            'content'=>''];
                        return response()->json($result);
                    }
                    $template_id = $jsonContent['template_id'];
                    $message_text = CommonUtil::jsUnescape(base64_decode($jsonContent['message_text']));
                    $message_html = CommonUtil::jsUnescape(base64_decode($jsonContent['message_html']));
                    $message_url = CommonUtil::jsUnescape(base64_decode($jsonContent['message_url']));
                    $message_source = $jsonContent['message_source'];
                    $now = date('Y-m-d H:i:s',time());

                    if($message_type == "news")
                    {  //News
                        $CompanyList = $jsonContent['destination_user_id'];
                        $companyStr = "";
                        foreach ($CompanyList as $company) {
                            if(!CommonUtil::checkCompanyExist(trim($company))) {
                                $result = ['result_code'=>ResultCode::_999014_companyNotExist,
                                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999014_companyNotExist),
                                    'content'=>''];
                                return response()->json($result);
                            }
                            $companyStr = $companyStr.trim($company).";";
                        }
                        if(count($companyStr) == 0) {
                            $result = ['result_code'=>ResultCode::_000918_dataIncomplete,
                                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000918_dataIncomplete),
                                'content'=>''];
                            return response()->json($result);
                        }

                        \DB::beginTransaction();
                        try {
                            if($showInMessageList){
                                $newMessageId = \DB::table("qp_message")
                                    -> insertGetId([
                                        'template_id'=>$template_id, 'visible'=>'Y',
                                        'message_type'=>$message_type, 'message_title'=>$message_title,
                                        'message_text'=>$message_text, 'message_html'=>$message_html,
                                        'message_url'=>$message_url, 'message_source'=>$message_source,
                                        'created_user'=>$sourceUserInfo->row_id,
                                        'created_at'=>$now,
                                    ]);

                                $newMessageSendId = \DB::table("qp_message_send")
                                    -> insertGetId([
                                        'message_row_id'=>$newMessageId,
                                        'source_user_row_id'=>$sourceUserInfo->row_id,
                                        'created_user'=>$sourceUserInfo->row_id,
                                        'created_at'=>$now,
                                        'need_push'=>$need_push_db,
                                        'company_label'=>$companyStr,
                                        'push_flag'=>'0'
                                    ]);
                                $extraParam = $newMessageSendId;
                            }else{
                                //20181205 Darren - hide for MongoDB
                                /*
                                $newMessageSendId = $this->appPushService
                                ->newAppPushMessage($sourceUserInfo, $message_title, $message_text, $message_html, $message_url,  $extraParam, $companyStr);
                                */
                            }
                            $countFlag = 0;
                            if($need_push == "Y") {
                                $to = [];
                                foreach ($CompanyList as $company) {
                                    for ($i = 1; $i <= 6; $i++) {
                                        $to[$countFlag] = strtoupper($company).$i;
                                        $countFlag ++;
                                    }
                                }

                                if($isSchedule) {
                                    $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$newMessageSendId, $push_time_utc, $message_title, $message_text, $to, $extraParam, true, $pushAppKey);
                                } else {
                                    $result = PushUtil::PushMessageWithJPushWebAPI($message_title, $message_text, $to, $extraParam, true, $pushAppKey);
                                }

                                if(!$result["result"]) {
                                    if($showInMessageList){
                                        \DB::table("qp_message_send")
                                        -> where(['row_id'=>$newMessageSendId])
                                        -> update([
                                            'jpush_error_code'=>$result["info"],
                                            'updated_user'=>$sourceUserInfo->row_id,
                                            'updated_at'=>$now
                                        ]);
                                    }else{
                                        //20181205 Darren - hide for MongoDB
                                        /*
                                        $this->appPushService
                                             ->updatePushMessageStatus($sourceUserInfo, $newMessageSendId, $result);
                                        */
                                    }
                                    \DB::commit();
                                    $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                        'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                        'content'=>array('jsonContent'=>$countFlag,
                                            'content'=>$content)
                                    ];
                                    return response()->json($result);
                                }
                            }

                            \DB::commit();
                            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                'content'=>array('jsonContent'=>$countFlag,
                                    'content'=>$content)//json_encode($jsonContent)
                            ];
                            return response()->json($result);
                        } catch (\Exception $e) {
                            \DB::rollBack();
                           throw $e;
                        }
                    }
                    else {  //Event
                        $destinationUserIdList = $jsonContent['destination_user_id'];
                        $destinationUserInfoList = array();
                        foreach ($destinationUserIdList as $destinationUserId)
                        {
                            $userid = explode('\\', $destinationUserId)[1];
                            $domain = explode('\\', $destinationUserId)[0];
                            $verifyResult = $Verify->verifyUserByUserIDAndDomain($userid, $domain);

                            if($verifyResult["code"] == ResultCode::_000901_userNotExistError) {
                                $result = ['result_code'=>ResultCode::_000912_userReceivePushMessageNotExist,
                                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000912_userReceivePushMessageNotExist),
                                    'content'=>''];
                                return response()->json($result);
                            }

                            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful) {
                                $result = ['result_code'=>$verifyResult["code"],
                                    'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                                    'content'=>''];
                                return response()->json($result);
                            }

                            $destinationUserInfo = CommonUtil::getUserInfoJustByUserIDAndDomain($userid, $domain);

                            array_push($destinationUserInfoList, $destinationUserInfo);
                        }

                        $destinationRoleIdList = $jsonContent['destination_role_id'];
                        $destinationRoleInfoList = array();
                        foreach ($destinationRoleIdList as $destinationRoleId)
                        {
                            $roleDesc = explode('/', $destinationRoleId)[1];
                            $company = explode('/', $destinationRoleId)[0];

                            $destinationRoleInfo = CommonUtil::getRoleInfo($roleDesc, $company);
                            if($destinationRoleInfo == null) {
                                $result = ['result_code'=>ResultCode::_000917_roleNotExist,
                                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000917_roleNotExist),
                                    'content'=>''];
                                return response()->json($result);
                            }
                            array_push($destinationRoleInfoList, $destinationRoleInfo);
                        }

                        \DB::beginTransaction();
                        try {
                            if($showInMessageList){
                                $newMessageId = \DB::table("qp_message")
                                    -> insertGetId([
                                        'template_id'=>$template_id, 'visible'=>'Y',
                                        'message_type'=>$message_type, 'message_title'=>$message_title,
                                        'message_text'=>$message_text, 'message_html'=>$message_html,
                                        'message_url'=>$message_url, 'message_source'=>$message_source,
                                        'created_user'=>$sourceUserInfo->row_id,
                                        'created_at'=>$now,
                                    ]);

                                $newMessageSendId = \DB::table("qp_message_send")
                                    -> insertGetId([
                                        'message_row_id'=>$newMessageId,
                                        'source_user_row_id'=>$sourceUserInfo->row_id,
                                        'created_user'=>$sourceUserInfo->row_id,
                                        'created_at'=>$now,
                                        'need_push'=>$need_push_db,
                                        'push_flag'=>'0'
                                    ]);
                                $extraParam = $newMessageSendId;
                            }else{
                                //20181205 Darren - hide for MongoDB
                                /*
                                $newMessageSendId = $this->appPushService
                                ->newAppPushMessage($sourceUserInfo, $message_title, $message_text, $message_html, $message_url,  $extraParam);
                                */
                            }
                            $hasSentUserIdList = array();
                            $real_push_user_list = array();

                            foreach ($destinationUserInfoList as $destinationUserInfo) {
                                if(in_array($destinationUserInfo->row_id, $hasSentUserIdList)) {
                                    continue;
                                }
                                if(count($destinationUserInfo->uuidList) == 0) {
                                    /*
                                     * bug 14023 2017.3.27
                                    \DB::rollBack();
                                    $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                                        'content'=>''];
                                    CommonUtil::logApi("", $ACTION,
                                        response()->json(apache_response_headers()), $result);
                                    return response()->json($result);
                                    */
                                    //该用户如无设备，先以user_row_id代替
                                    $destinationUserInfo->uuidList = [
                                        ["uuid"=>$destinationUserInfo->row_id]
                                    ];
                                }
                                if($showInMessageList){
                                    foreach ($destinationUserInfo->uuidList as $uuid) {
                                        \DB::table("qp_user_message")
                                            -> insertGetId([
                                                'project_row_id'=>$projectInfo->row_id,
                                                'user_row_id'=>$destinationUserInfo->row_id,
                                                'uuid'=> is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                                'message_send_row_id'=>$newMessageSendId,
                                                'created_user'=>$sourceUserInfo->row_id,
                                                'created_at'=>$now
                                            ]);
                                    }
                                }
                                $hasSentUserIdList[] = $destinationUserInfo->row_id;
                                $real_push_user_list[] = $destinationUserInfo->row_id;
                            }

                            foreach ($destinationRoleInfoList as $destinationRoleInfo) {
                                if($showInMessageList){
                                    \DB::table("qp_role_message")
                                    -> insertGetId([
                                        'project_row_id'=>$projectInfo->row_id, 'role_row_id'=>$destinationRoleInfo->row_id,
                                        'message_send_row_id'=>$newMessageSendId,
                                        'created_user'=>$sourceUserInfo->row_id,
                                        'created_at'=>$now
                                    ]);
                                }
                                $sql = 'select * from qp_user where row_id in (select user_row_id from qp_user_role where role_row_id = '.$destinationRoleInfo->row_id.' )';
                                $userInRoleList = DB::select($sql, []);
                                foreach ($userInRoleList as $userRoleInfo) {
                                    $userRowId = $userRoleInfo->row_id;

                                    if(!in_array($userRowId, $hasSentUserIdList)) {
                                        $thisUserInfo = CommonUtil::getUserInfoByRowID($userRowId);//CommonUtil::getUserInfoJustByUserIDAndDomain($userRoleInfo->login_id, $userRoleInfo->user_domain);
                                        if($thisUserInfo->status == "Y" && $thisUserInfo->resign == "N") {
                                            //bug 14023 2017.3.27
                                            if (count($thisUserInfo->uuidList)==0){
                                                $thisUserInfo->uuidList = [
                                                    ["uuid"=>$userRowId]
                                                ];
                                            }
                                            if($showInMessageList){
                                                foreach ($thisUserInfo->uuidList as $uuid) {
                                                    \DB::table("qp_user_message")
                                                        -> insertGetId([
                                                            'project_row_id'=>$projectInfo->row_id,
                                                            'user_row_id'=>$userRowId,
                                                            'uuid'=>is_array($uuid)?$uuid["uuid"]:$uuid->uuid,
                                                            'message_send_row_id'=>$newMessageSendId,
                                                            'created_user'=>$sourceUserInfo->row_id,
                                                            'created_at'=>$now
                                                        ]);
                                                }
                                            }
                                            $hasSentUserIdList[] = $userRowId;
                                            $real_push_user_list[] = $userRowId;
                                        }
                                    }
                                }
                            }

                            if($need_push == "Y") {
                                $to = [];
                                $newCountFlag = 0;
                                $pushProjectId = ($showInMessageList)?1:$projectInfo->row_id;
                                foreach ($real_push_user_list as $uId) {
                                    $userPushList = \DB::table("qp_user")
                                        ->join("qp_register","qp_register.user_row_id","=","qp_user.row_id")
                                        ->join("qp_push_token","qp_push_token.register_row_id","=","qp_register.row_id")
                                        ->where("qp_push_token.project_row_id", $pushProjectId)
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

                                if($isSchedule) {
                                    $result = PushUtil::PushScheduleMessageWithJPushWebAPI("send".$newMessageSendId, $push_time_utc, $message_title, $message_text, $to, $extraParam, false, $pushAppKey);
                                } else {
                                    $result = PushUtil::PushMessageWithJPushWebAPI($message_title, $message_text, $to, $extraParam, false, $pushAppKey);
                                }
                                if(!$result["result"]) {
                                    if($showInMessageList){
                                        \DB::table("qp_message_send")
                                        -> where(['row_id'=>$newMessageSendId])
                                        -> update([
                                            'jpush_error_code'=>$result["info"],
                                            'updated_user'=>$sourceUserInfo->row_id,
                                            'updated_at'=>$now
                                        ]);
                                    }else{
                                        //20181205 Darren - hide for MongoDB
                                        /*
                                        $this->appPushService
                                             ->updatePushMessageStatus($sourceUserInfo, $newMessageSendId, $result);
                                        */
                                    }
                                    \DB::commit();
                                    $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                        'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                        'content'=>array('jsonContent'=>$newCountFlag,
                                            'content'=>$content)
                                    ];
                                    return response()->json($result);
                                }
                            }

                            \DB::commit();
                            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                                'message'=>trans("messages.MSG_SEND_PUSH_MESSAGE_SUCCESS"),
                                'content'=>array('jsonContent'=>count($destinationUserIdList),
                                    'content'=>$content)//json_encode($jsonContent)
                            ];
                            return response()->json($result);
                        } catch (\Exception $e) {
                            \DB::rollBack();
                            throw $e;
                        }
                    }
                }
            }
        }

        $result = ['result_code'=>$verifyResult["code"],
            'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
            'content'=>''];
        return response()->json($result);
    }