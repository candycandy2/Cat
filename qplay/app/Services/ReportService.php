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

    public function getApiReport($appKey){
        $retArr = [];

        $cursor = $this->apiLogRepository->getApiLog($appKey);
        $res = $cursor->toArray();
            foreach ($res as $key => $value) {
                if(!isset($retArr[$value->_id->action])){
                    $retArr[$value->_id->action]=array();
                    if(!isset( $retArr[$value->_id->action][$value->_id->company_site])){
                        $retArr[$value->_id->action][$value->_id->company_site]=array();
                        if(!isset($retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount'])){
                            $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount']=0;
                        }
                        if(!isset($retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount'])){
                            $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount']=0;
                        }
                    }
                }
                $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount']=$value->totalCount;
                $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount']=$value->distinctCount;
            }
        return  $retArr;
    }

    public function getApiLogByTimeInteval($appKey){
        $tmpArr = [];
        $totalCount = [];
        $distinctCount = [];
        $retArr = [];
        $cursor =  $this->apiLogRepository->getApiLogByTimeInteval($appKey);
        $res = $cursor->toArray();
        if(count($res) > 0) {
            foreach ($res as $key => $value) {
                $date = $value->_id->created_at->toDateTime()->format('U.u');
                $date = date('Y-m-d', $date);
                if(!isset($tmpArr[$date])){
                    $tmpArr[$date]=array();
                    if(!isset($tmpArr[$date]['totalCount'])){
                            $tmpArr[$date]['totalCount'] = 0;
                        }
                    if(!isset($tmpArr[$date]['distinctCount'])){
                        $tmpArr[$date]['distinctCount'] = 0;
                    }
                }
                $tmpArr[$date]['totalCount']= $tmpArr[$date]['totalCount'] + $value->count;
                $tmpArr[$date]['distinctCount']= $value->count;
            }
            $startDate = date('Y-m-d', $res[count($res)-1]->_id->created_at->toDateTime()->format('U.u'));
            $endDate =  date('Y-m-d', $res[0]->_id->created_at->toDateTime()->format('U.u'));
            $begin = new \DateTime($startDate);
            $end = new \DateTime($endDate);
            $end = $end->modify( '+1 day' );  // 不包含结束日期当天，需要人为的加一天
            $interval = new \DateInterval('P1D');
            //$interval = \DateInterval::createFromDateString('1 day');  // 等同于上一条

            // 如果第4个参数为\DatePeriod::EXCLUDE_START_DATE，则不包含开始日期当天
            $daterange = new \DatePeriod($begin, $interval ,$end);

            foreach($daterange as $date){
                if (!array_key_exists($date->format("Y-m-d"), $tmpArr)) {
                    $tmpArr[$date->format("Y-m-d")]['totalCount'] = 0;
                    $tmpArr[$date->format("Y-m-d")]['distinctCount'] = 0;
               }
            }
            $retArr['startDate'] =  $startDate;
            $retArr['endDate'] =  $endDate;
            foreach ($tmpArr as $key => $value) {
                $retArr['totalCount'][] =  $value['totalCount'];
                $retArr['distinctCount'][] =  $value['distinctCount'];
            }
        }
        return  $retArr;
    }

    public function getApiLogByDepartment($appKey){
        $retArr = [];
        $cursor = $this->apiLogRepository->getApiLog($appKey);
        $res = $cursor->toArray();
        if(count($res) > 0){
            $sumTotalCnt = 0;
            $sumDistinctCnt = 0;
            foreach ($res as $key => $value) {
                if(!isset($retArr[$value->_id->action])){
                    $retArr[$value->_id->action]=array();
                    if(!isset( $retArr[$value->_id->action][$value->_id->company_site])){
                        $retArr[$value->_id->action][$value->_id->company_site]=array();
                        if(!isset($retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount'])){
                            $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount']=0;
                        }
                        if(!isset($retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount'])){
                            $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount']=0;
                        }
                    }
                }
                $sumTotalCnt  =  $sumTotalCnt  + $value->totalCount;
                $sumDistinctCnt =  $sumDistinctCnt + $value->distinctCount;
                $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount']=$value->totalCount;
                $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount']=$value->distinctCount;
            }
            foreach ($retArr as  &$siteData) {
                foreach ($siteData as &$departmentData) {
                    foreach ($departmentData as &$value) {
                        if(!isset( $value['totalCountPercent'])){
                             $value['totalCountPercent'] = 0;
                        }
                        if(!isset( $value['distinctCountPercent'])){
                             $value['distinctCountPercent'] = 0;
                        }
                        $value['totalCountPercent'] = round($value['totalCount'] / $sumTotalCnt * 100,2); 
                        $value['distinctCountPercent'] = round($value['distinctCount'] / $sumDistinctCnt * 100,2);
                    }
                }
            }
        }
        return  $retArr;
    }

    
}