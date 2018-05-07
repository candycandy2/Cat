<?php
namespace App\Services;

use App\Repositories\AppVersionRepository;

class AppVersionService
{
    protected $appVersionRepository;

    public function __construct(AppVersionRepository $appVersionRepository)
    {
        $this->appVersionRepository = $appVersionRepository;
    }

    /**
     * 取得最近N筆APP版本備註
     * @param  int $appId         qp_app_head.row_id
     * @param  string $deviceType 裝置類型(ios|android)
     * @param  int $cnt           欲取得的筆數
     * @return array
     */
    public function getVersionLog($appId, $deviceType, $cnt=50){
        return $this->appVersionRepository->getVersionLog($appId, $deviceType, $cnt);
    }
}