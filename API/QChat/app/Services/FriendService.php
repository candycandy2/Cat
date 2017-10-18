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
     * @param string $userId      使者的qp_user.row_id
     */
    public function setQfriend($fromEmpNo, $targetEmpNo, $userId){
        $friendMatrixData = $this->friendMatrixRepository->getFriendShip($fromEmpNo, $targetEmpNo);
        if(count($friendMatrixData) == 0){
            $this->friendMatrixRepository->newFriendShip($fromEmpNo, $targetEmpNo, $userId);
        } 
        $this->friendMatrixRepository->setFriend($fromEmpNo, $targetEmpNo, $userId);
    }

    /**
     * 發送交友邀請給保護名單
     * @param  string $fromEmpNo       使用者的員工編號
     * @param  string $targetEmpNo     受邀者的員工編號
     * @param  string $userId          使者的qp_user.row_id
     * @param  string $inviationReason 邀請原因
     */
    public function sendQInvitation($fromEmpNo, $targetEmpNo, $userId, $inviationReason=""){
        $friendMatrixData = $this->friendMatrixRepository->getFriendShip($fromEmpNo, $targetEmpNo);
         if(count($friendMatrixData) == 0){
            $this->friendMatrixRepository->newFriendShip($fromEmpNo, $targetEmpNo, $userId);
        } 
        $this->friendMatrixRepository->sendInvaitation($fromEmpNo, $targetEmpNo,$userId, $inviationReason);

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
     * 取得邀約
     * @param  string $fromEmpNo       使用者的員工編號
     * @param  string $targetEmpNo     受邀者的員工編號
     * @return mixed
     */
    public function getQInvitation($empNo, $sourceEmpNo){
        return $this->friendMatrixRepository->getInvitation($empNo, $sourceEmpNo);
    }

    /**
     * 保護名單接受好友邀請
     * @param  string $empNo       使用者的員工編號
     * @param  string $sourceEmpNo 邀請者的員工編號
     * @param  string $userId      使者的qp_user.row_id
     */
    public function acceptQInvitation($empNo, $sourceEmpNo, $userId){
        $this->friendMatrixRepository->acceptInvitation($empNo, $sourceEmpNo, $userId);
        
        $tokens=[];
        $pushToken = $this->userRepository->getUserPushToken($sourceEmpNo);
        $ownerData = $this->userRepository->getUserData($empNo);
        $owner = $ownerData->login_id;
        foreach ($pushToken as $token) {
             $tokens[] = $token->push_token;
         }
        $this->push->setReceiver($tokens)
             ->setTitle($owner."接受您的好友邀請")
             ->send();
    }


    /**
     * 保護名單拒絕好友邀請
     * @param  string $empNo       使用者的員工編號
     * @param  string $sourceEmpNo 邀請者的員工編號
     * @param  string $userId      使者的qp_user.row_id
     * @param  string $reason      拒絕理由
     */
    public function rejectQInvitation($empNo, $sourceEmpNo, $userId, $rejectReason){
        $this->friendMatrixRepository->rejectInvitation($empNo, $sourceEmpNo, $userId, $rejectReason);
        
        $tokens=[];
        $pushToken = $this->userRepository->getUserPushToken($sourceEmpNo);
        $ownerData = $this->userRepository->getUserData($empNo);
        $owner = $ownerData->login_id;
        foreach ($pushToken as $token) {
             $tokens[] = $token->push_token;
         }
        $this->push->setReceiver($tokens)
             ->setTitle($owner."拒絕您的好友邀請")
             ->send();
    }

    /**
     * 移除好友關係
     * @param  String $empNo            使用者的員工編號
     * @param  String $destinationEmpNo 移除的員工編號
     * @param  string $userId      使者的qp_user.row_id
     * @return mixed
     */
    public function removeQFriend($empNo, $destinationEmpNo, $userId){
        return $this->friendMatrixRepository->removeFriend($empNo, $destinationEmpNo, $userId);
    }

}   