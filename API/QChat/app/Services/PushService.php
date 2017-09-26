<?php
namespace App\Services;

use App\Repositories\PushTokenRepository;

class PushService
{   

    protected $userRepository;

    public function __construct(PushTokenRepository $pushTokenRepository)
    {
        $this->pushTokenRepository = $pushTokenRepository;
    }

    /**
     * 檢查push token 是否已經存在，若無則新增push token
     * @param  String $empNo       員工編號
     * @param  String $pushToken   push token
     * @param  String $deviceType  裝置類型(ios | android)
     * @param  int    $createdUder 創建者的user_row_id
     * @return int         
     */
    public function savePushToken($empNo, $pushToken, $deviceType, $createdUder){
        $isPushTokenExist = $this->pushTokenRepository->getPushToken($deviceType, $pushToken);
        if($isPushTokenExist == 0){
            $this->pushTokenRepository->newPushToken($empNo, $pushToken, $deviceType, $createdUder);
        }
    }

    /**
     * 取得特定使用者的所有push token
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getPushTokenByEmpNo($empNo){
        return $this->pushTokenRepository->getPushTokenByEmpNo($empNo);
    }

}