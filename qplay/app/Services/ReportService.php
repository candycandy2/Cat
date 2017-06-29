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
     * @param  int    $timeOffset 時差
     * @return Array  
     */
    public function getApiReport($appKey, $timeOffset){
        $cursor =  $this->apiLogRepository->getApiLogCountEachUserByAppKey($appKey, $timeOffset);
        $res = $cursor->toArray();
        return $res;
    }

     /**
     * 取得API執行時間資料
     * @param  String $appKey app_key
     * @param  int    $timeOffset 時差
     * @return Array  
     */
    public function getApiOperationTimeReport($appKey, $timeOffset){
        $cursor =  $this->apiLogRepository->getApiOperationTimeByAppKey($appKey, $timeOffset);
        $res = $cursor->toArray();
        return $res;
    }

    /**
     * 取得API執行時間每小時知詳細資料
     * @param  String $appKey     app_key
     * @param  String $date       欲查詢的日期
     * @param  int    $timeOffset 時差
     * @param  String $actionName 欲查詢的API名稱
     * @return Array
     */
    public function getApiOperationTimeDetailReport($appKey, $date, $timeOffset, $actionName){
        $cursor = $this->apiLogRepository->getApiOperationTimeDetail($appKey, $date, $timeOffset, $actionName);
        $res = $cursor->toArray();
        return $res;
    }

    /**
     * 取得每日設備與用戶資料
     * @param  int    $timeOffset 時差
     * @return mixed
     */
    public function getDailyRegisterReport($timeOffset){
        return $this->registerRepository->getRegisterDataEachDay($timeOffset);
    }

    /**
     * 取得累計註冊設備與用戶詳細資料
     * @param  int    $timeOffset 時差
     * @return mixed
     */
    public function getCumulativeRegisterReport($timeOffset){
        return $this->registerRepository->getRegisterDetail($timeOffset);
    }
}