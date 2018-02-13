<?php
namespace App\Services;

use App\Repositories\AppPushTokenRepository;
use App\Repositories\AppMessageSendPushonlyRepository;

class AppPushService
{
    protected $appMessageSendPushonlyRepositorie;

    public function __construct(AppMessageSendPushonlyRepository $appMessageSendPushonlyRepository)
    {
        $this->appMessageSendPushonlyRepository = $appMessageSendPushonlyRepository;
    }

    public function getUserPushTokenList($appKey, $userid, $domain){

        return $userTokenRes = $this->appPushTokenRepository
                                    ->getUserPushToken($appKey, $userid, $domain)
                                    ->pluck('push_token')
                                    ->toArray();
        
    }

    public function newAppPushMessage($sourceUserInfo, $message_title, $message_text, $message_html, $message_url, $company_label=null)
    {
         $now = date('Y-m-d H:i:s',time());
         $data = [         
                    'source_user_row_id' => $sourceUserInfo->row_id,
                    'source_user_login_id' => $sourceUserInfo->login_id,
                    'source_user_company' => $sourceUserInfo->company,
                    'source_user_site_code' => $sourceUserInfo->site_code,
                    'source_user_emp_no' => $sourceUserInfo->emp_no,
                    'source_user_emp_name' => $sourceUserInfo->emp_name,
                    'source_user_domain' => $sourceUserInfo->user_domain,
                    'source_user_department' => $sourceUserInfo->department,
                    'company_label' => $company_label,
                    'message_title'=>$message_title,
                    'message_text' => $message_text,
                    'message_html' => $message_html,
                    'message_url'  =>  $message_url,
                    'jpush_error_code' => null,
                    'created_user' => $sourceUserInfo->row_id,
                    'updated_user' => null,
                    'created_at' => $now,
                    'updated_at' => null
                ];
        return $this->appMessageSendPushonlyRepository->insertAppPushMessage($data);
    }

    public function updatePushMessageStatus($sourceUserInfo, $messageId, $result){
        $now = date('Y-m-d H:i:s',time());
        $data = [
                    'jpush_error_code'=>$result["info"],
                    'updated_user'=>$sourceUserInfo->row_id,
                    'updated_at'=>$now
                ];
        return $this->appMessageSendPushonlyRepository->updateAppPushMessage($messageId, $data);
    }

    public function newPushToken($appKey, $empNo, $deviceType, $pushToken, $userId){
        $now = date('Y-m-d H:i:s',time());
        $data = [];
        $oriPushToken = $this->appPushTokenRepository->getPushToken($appKey, $empNo, $deviceType, $pushToken);       
        if(is_null($oriPushToken)){
            $data = [
                    'app_key'=>$appKey,
                    'emp_no'=>$empNo,
                    'device_type'=>$deviceType,
                    'push_token'=>$pushToken,
                    'created_at' =>$now,
                    'created_user'=>$userId
                ];
            return $this->appPushTokenRepository->insertPushToken($data);
        }
    }
}