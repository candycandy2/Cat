<?php
namespace App\Services;

use App\Repositories\RegisterRepository;
use App\Repositories\SessionRepository;
use App\Repositories\PushTokenRepository;
use App\lib\PushUtil;
use Exception;
use Illuminate\Support\Facades\Log;

class RegisterService
{
    protected $registerRepository;
    protected $sessionRepository;
    protected $pushTokenRepository;

    public function __construct(RegisterRepository $registerRepository,
                                SessionRepository $sessionRepository,
                                PushTokenRepository $pushTokenRepository)
    {
        $this->registerRepository = $registerRepository;
        $this->sessionRepository = $sessionRepository;
        $this->pushTokenRepository = $pushTokenRepository;
    }

    /**
     * unregister users by qp_user.row_id 
     * @param  Array  $UserIds delete user id list
     */
    public function unRegisterUserbyUserIds(Array $UserIds){
            
        $registerInfo = $this->registerRepository->getRegisterInfoByUserIds($UserIds);
        $delRegisterIds = $registerInfo['registerIds'];
        $delUuids =  $registerInfo['UUIDs'];
        
        $this->sessionRepository->deleteSessionByUserIds($UserIds);
        $this->registerRepository->deleteRegisterByUserIds($UserIds);
        $this->pushTokenRepository->deletePushTokenByUserIds($delRegisterIds);
        
       foreach ($delUuids as $uuid) {
            $delDeviceInfo =  PushUtil::getDeviceInfoWithJPushWebAPI($uuid);
            if($delDeviceInfo["result"]) {
                $tags = $delDeviceInfo['info']['body']['tags'];
                foreach ($tags as $tag) {
                    $removeResult = PushUtil::RemoveTagsWithJPushWebAPI($tag, $uuid);
                    if(!$removeResult["result"]) {
                        Log::error('['.$uuid.'] remove tag error'.':'.$tag);
                    }
                }
            }
       }
       return count($delUuids);
    }
}