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
     * 依員工編號取得用戶基本資料
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getUserData($empNo){
        return  $this->userRepository->getUserData($empNo);
    }

     /**
     * 依帳號取得用戶基本資料
     * @param  String $loginId 員工帳號
     * @return mixed
     */
    public function getUserDataByLoginId($loginId){
        return  $this->userRepository->getUserDataByLoginId($loginId);
    }

}


