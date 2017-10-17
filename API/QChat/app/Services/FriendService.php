<?php
namespace App\Services;
use Config;
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

    /**
     * 發送交友邀請給保護名單
     * @param  string $fromEmpNo       使用者的員工編號
     * @param  string $targetEmpNo     受邀者的員工編號
     * @param  string $inviationReason 邀請原因
     */
    public function sendQInvitation($fromEmpNo, $targetEmpNo, $inviationReason=""){
        $friendMatrixData = $this->friendMatrixRepository->getFriendShip($fromEmpNo, $targetEmpNo);
         if(count($friendMatrixData) == 0){
            $this->friendMatrixRepository->newFriendShip($fromEmpNo, $targetEmpNo);
        } 
        $this->friendMatrixRepository->sendInvaitation($fromEmpNo, $targetEmpNo, $inviationReason);

        $tokens=[];
        $pushToken = $this->userRepository->getUserPushToken($targetEmpNo);
        $ownerData = $this->userRepository->getUserData($fromEmpNo);
        $owner = $ownerData->login_id;
        foreach ($pushToken as $token) {
             $tokens[] = $token->push_token;
         }
        $this->push->setReceiver($tokens)
             ->setTitle($owner."邀請您成為好友")
             ->send();
    }

    /**
     * 保護名單接受好友邀請
     * @param  string $empNo       使用者的員工編號
     * @param  string $sourceEmpNo 邀請者的員工編號
     */
    public function acceptQInvitation($empNo, $sourceEmpNo){
        $this->friendMatrixRepository->acceptInvitation($fromEmpNo, $sourceEmpNo);
        
        $tokens=[];
        $pushToken = $this->userRepository->getUserPushToken($targetEmpNo);
        $ownerData = $this->userRepository->getUserData($fromEmpNo);
        $owner = $ownerData->login_id;
        foreach ($pushToken as $token) {
             $tokens[] = $token->push_token;
         }
        $this->push->setReceiver($tokens)
             ->setTitle($owner."接受您的好友邀請")
             ->send();
    }

}   