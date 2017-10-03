<?php
namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\FriendMatrixRepository;
use App\lib\JPush;

class FriendService
{   

    protected $userRepository;
    protected $friendMatrixRepository;
    protected $push;

    public function __construct(UserRepository $userRepository,
                                FriendMatrixRepository $friendMatrixRepository)
    {
        $this->userRepository = $userRepository;
        $this->friendMatrixRepository = $friendMatrixRepository;
        $this->push = new JPush(Config::get("app.app_key"),Config::get("app.master_secret"));
    }

    /**
     * 設定為好友
     * @param string $fromEmpNo   使用者的員工編號
     * @param string $targetEmpNo 邀請對象的員工編號
     */
    public function setQfriend($fromEmpNo, $targetEmpNo){
        $friendMatrixData = $this->friendMatrixRepository->getFriendShip($fromEmpNo, $targetEmpNo);
        if(count($friendMatrixData) == 0){
            $this->friendMatrixRepository->newFriendShip($fromEmpNo, $targetEmpNo);
        } 
        $this->friendMatrixRepository->setFriend($fromEmpNo, $targetEmpNo);
    }

}   