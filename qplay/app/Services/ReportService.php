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

    /**
     * 取得該app最後的log日期
     * @param  String $appKey app key
     * @return mixed
     */
    public function getApiLogEndDate($appKey){
        $lastRecord = $this->apiLogRepository->getApiLogLastRecord($appKey);
        $endDate = null;
        if(!is_null($lastRecord )){
             $endDate = $this->apiLogRepository->getApiLogLastRecord($appKey)->created_at;
        }
        return  $endDate;
    }

    /**
     * 取得Api呼叫人數與次數資料
     * @param  String $appKey app_key
     * @return Array  
     */
    public function getApiReport($appKey){
        $cursor =  $this->apiLogRepository->getApiLogCountEachUserByDate($appKey);
        $res = $cursor->toArray();
        return $res;
    }
}