<?php
/**
 * 處理統計報表相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\RegisterRepository;
use App\Repositories\ApiLogRespository;

class ReportService
{  
    protected $registerRepository;
    protected $apiLogRepository;

    public function __construct(RegisterRepository $registerRepository, ApiLogRespository $apiLogRepository)
    {
        $this->registerRepository = $registerRepository;
        $this->apiLogRepository = $apiLogRepository;
    }

    /**
     * 取得QPlay註冊率 (註冊總用戶數/設備總數)
     * @return String
     */
    public function getRegisterRate(){
        return $this->registerRepository->getRegisterUserCount().'/'.$this->registerRepository->getRegisterDeviceCount();
    }

    public function getApiReport($appKey){
        return $this->apiLogRepository->getApiLog($appKey);
    }
}