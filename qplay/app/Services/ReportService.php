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
     * 取得API呼叫人數與次數資料
     * @param  String $appKey app_key
     * @param  int    $timeZone 時區
     * @return Array  
     */
    public function getApiReport($appKey, $timeZone){
        $cursor =  $this->apiLogRepository->getApiLogCountEachUserByAppKey($appKey, $timeZone);
        $res = $cursor->toArray();
        return $res;
    }

     /**
     * 取得API執行時間資料
     * @param  String $appKey app_key
     * @param  int    $timeZone 時區
     * @return Array  
     */
    public function getApiOperationTimeReport($appKey, $timeZone){
        $cursor =  $this->apiLogRepository->getApiOperationTimeByAppKey($appKey, $timeZone);
        $res = $cursor->toArray();
        return $res;
    }

    /**
     * 取得API執行時間每小時知詳細資料
     * @param  String $appKey     app_key
     * @param  String $date       欲查詢的日期
     * @param  int    $timeZone 時區
     * @param  String $actionName 欲查詢的API名稱
     * @return Array
     */
    public function getApiOperationTimeDetailReport($appKey, $date, $timeZone, $actionName){
        $cursor = $this->apiLogRepository->getApiOperationTimeDetail($appKey, $date, $timeZone, $actionName);
        $res = $cursor->toArray();
        return $res;
    }

    /**
     * 取得每日設備與用戶資料
     * @param  int    $timeZone 時區
     * @return mixed
     */
    public function getDailyRegisterReport($timeZone){
        return $this->registerRepository->getRegisterDataEachDay($timeZone);
    }

    /**
     * 取得累計註冊設備與用戶詳細資料
     * @param  int    $timeZone 時區
     * @return mixed
     */
    public function getCumulativeRegisterReport($timeZone){
        return $this->registerRepository->getRegisterDetail($timeZone);
    }
}