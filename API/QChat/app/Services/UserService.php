<?php
namespace App\Services;

use App\Repositories\UserRepository;

class UserService
{   

    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * 取得使用者列表
     * @param  string $loginId    登入帳號
     * @param  String $friendOnly 僅查詢好友 (Y:是 | N:否)
     * @param  string $empNo      員工編號
     * @return object
     */
    public function getUserList($searchType, $friendOnly, $empNo, $searchString=""){
        $userList = [];
        $userListCount  = 0;
        $userCount = 0;       
        $userList = $this->userRepository->getList($searchType, $friendOnly, $empNo, $searchString);
        $userCount = $this->userRepository->getCount($searchType, $friendOnly, $empNo, $searchString);
        $result['userList'] = $userList;
        $result['over_threshold'] = ($userCount > 0)?'Y':'N';
        return $result;
    }

    /**
     * 取得特定用戶對使用者狀態
     * @param  String $fromEmpNo   來源使用者的員工編號
     * @param  String $targetEmpNo 特定用戶的員工編號
     * @return String              common|friend|protected
     */
    public function getUserStatus($fromEmpNo, $targetEmpNo){
        $result = array('login_id'=>'','status'=>'common');
        $userData = $this->userRepository->getUserLevel($targetEmpNo);
        $result['login_id'] = $userData->login_id;
        
        if(!is_null($userData->level)){
            $friendStatus = $this->userRepository->getFriendStatus($fromEmpNo, $targetEmpNo);
            if(!is_null($friendStatus) && $friendStatus->status == 1){
                $result['status'] = 'friend';
            }else{
                $result['status'] = 'protected';
            }
        }
        return $result;
    }

    /**
     * 取得用戶基本資料
     * @param  String $empNo 員工編號
     * @return String
     */
    public function getUserData($empNo){
        return $this->userRepository->getUserData($empNo);
    }

    public function getUserPushToken($empNo){
        return $this->userRepository->getUserPushToken($empNo);
    }
}