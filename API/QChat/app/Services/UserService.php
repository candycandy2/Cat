<?php
namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\FriendMatrixRepository;

class UserService
{   

    protected $userRepository;
    protected $friendMatrixRepository;

    public function __construct(UserRepository $userRepository,
                                FriendMatrixRepository $friendMatrixRepository)
    {
        $this->userRepository = $userRepository;
        $this->friendMatrixRepository = $friendMatrixRepository;
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
        $limit = 10;
        $userList = $this->userRepository->getList($searchType, $friendOnly, $empNo, $searchString);
        $userCount = $this->userRepository->getCount($searchType, $friendOnly, $empNo, $searchString);
        $result['user_list'] = $userList;
        if($userCount > 0){
            $result['over_threshold'] = ($userCount > $limit)?'Y':'N';
        }
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
            $friendStatus = $this->friendMatrixRepository->getFriendStatus($fromEmpNo, $targetEmpNo);
            if(!is_null($friendStatus) && $friendStatus->status > 0){
                if($friendStatus->status == 1){
                    $result['status'] = 'friend';
                }else if($friendStatus->status == 2){
                    $result['status'] = 'invitated';
                }else if($friendStatus->status == 3){
                    $result['status'] = 'rejected';
                }
            }else{
                $result['status'] = 'protected';
            }
        }
        return $result;
    }

    /**
     * 檢查用戶是否為保護名單
     * @param   String $empNo   使用者的原編
     * @return  boolean
     */
    public function checkUserIsProteted($empNo){
        $rs = $this->userRepository->getUserLevel($empNo);
        if($rs->level = null){
            return true;
        }else{
            return false;
        }
    }

     /**
     * 取得用戶基本資料
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getUserData($empNo){
        return  $this->userRepository->getUserData($empNo);
    }

    /**
     * 設定用戶詳細資料
     * @param String $empNo 使用者原編
     * @param Array  $data  寫入的資料
     */
    public function setQUserDetail($empNo, $data, $userId){
        $result=null;
        $userDetail = $this->userRepository->getQUserDetail($empNo);
        if(count($userDetail) > 0){
            $result = $this->userRepository->updateUserDetail($empNo, $data, $userId);
        }else{
            $result = $this->userRepository->insertUserDetail($empNo, $data, $userId);
        }
        return $result;
    }

    /**
     * 取得用戶詳細資料
     * @param  String $destinationEmpNo 特定用戶員工編號
     * @return mixed
     */
    public function getQUserDetail($destinationEmpNo){
        return $this->userRepository->getUserDetailByEmpNo($destinationEmpNo);
    }

    /**
     * 取得用戶詳細資料
     * @param  String $destinationEmpNo 特定用戶員工編號
     * @return mixed
     */
    public function getQMessageRegister($destinationEmpNo){
        return $this->userRepository->getQMessageRegister($destinationEmpNo);
    }
}