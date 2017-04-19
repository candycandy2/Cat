<?php
/**
 * 處理使用者身分相關邏輯
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\UserRepository;
use App\Components\Message;

class UserService
{   

    protected $userRepository;
    protected $message;

    public function __construct(UserRepository $userRepository, Message $message)
    {
        $this->userRepository = $userRepository;
        $this->message = $message;
    }

    /**
     * 取得用戶所屬角色
     * @param  String $empNo 工號
     * @return array         角色列表，一個人可能所屬於多個角色 (admin:機房管理者|supervisor:主管|common:一般用戶)
     */
    public function getUserRoleList($empNo){
        $roleList = [];
        $groups = $this->userRepository->getUserAuth($empNo);
        if(count($groups) > 0){
            foreach ($groups as $group) {
                $roleList [] = $group->usergroup;
            }
        }else{
            $roleList [] ='common';
        }
        return $roleList;
    }

    /**
     * 向Qmessage註冊管理者與主管
     * @return json 註冊結果
     */
    public function registerSuperUserToMessage(){
        $users = $this->userRepository->getSuperUserLoginId();
        if(count($users) == 0){
            return ['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Message'=>'尚無需註冊用戶','Content'=>''];
        }
        $registeredUser = [];
        foreach ($users as $user) {
            $res = $this->message->register($user->login_id);
            $resultCode = json_decode($res)->ResultCode;
            if( $resultCode  == ResultCode::_1_reponseSuccessful || $resultCode  == $this->message::_998002_userAlreadyExist){
                 $this->userRepository->updateUserByLoginId($user->login_id, array('register_message'=>'Y'));
                 $registeredUser[] = $user->login_id;
            }else{
                return $res;
            }
        }
        return ['ResultCode'=>ResultCode::_1_reponseSuccessful,'Message'=>'用戶註冊成功','Content'=>implode(',',$registeredUser)];
    }
}