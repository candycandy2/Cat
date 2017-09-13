<?php
/**
 * 處理使用者身分相關邏輯
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\UserRepository;
use App\Components\Message;
use Config;

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
     * @param  String $empNo  工號
     * @return array          角色列表，一個人可能所屬於多個角色 (admin:機房管理者|supervisor:主管|common:一般用戶)
     */
    public function getUserRoleList($empNo){

        $roleList = [];
        $groups = $this->userRepository->getUserAuth($empNo);

        foreach ($groups as $value) {
            $roleList[$value->project][] = $value->usergroup;
        }
        return  $roleList ;
    }

     /**
     * 依專案取得用戶所屬角色
     * @param  String $project  project
     * @param  String $empNo  工號
     * @return array          角色列表，一個人可能所屬於多個角色 (admin:機房管理者|supervisor:主管|common:一般用戶)
     */
    public function getUserRoleListByProject($project, $empNo){
        $roleList = $this->getUserRoleList($empNo);
        if(isset($roleList[$project])){
            return $roleList[$project];
        }else{
            return null;
        }
    }

    /**
     * 向Qmessage註冊管理者與主管
     * @return json 註冊結果
     */
    public function registerSuperUserToMessage($project){
        $users = $this->userRepository->getSuperUserLoginId($project);
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

    /**
     * 取得管理員及主管
     * @param  String $project project
     * @return mixed
     */
    public function getSuperUser($project){
        return $this->userRepository->getSuperUser($project);
    }

     /**
     * 依員工編號取得使用者資訊
     * @param  Array  $empNoArr 員工編號清單
     * @return mixed
     */
    public function getUserInfoByEmpNo(Array $empNoArr){
        return $this->userRepository->getUserInfoByEmpNo($empNoArr);
    }
}