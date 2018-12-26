<?php
/**
 * Emp Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceReserveRepository;
use App\Repositories\EmpServiceDataLogRepository as EmpServiceLog;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\PushUtil;


class EmpServiceReserveService
{

    const TABLE = 'reserve_record';

    const ACTION_ADD = 'add';
    const ACTION_UPDATE = 'update';
    const ACTION_DELETE = 'delete';

    protected $serviceReserveRepository;

    public function __construct(EmpServiceReserveRepository $serviceReserveRepository)
    {
        $this->serviceReserveRepository = $serviceReserveRepository;
    }

    /**
     * new a reserve
     * @param  Array $data        reserve data
     * @param  Array $managerInfo manager info
     * @param  string $lang       push lang parameter
     * @return array
     */
    public function newReserve($data, $managerInfo, $lang){
        
        $newReserveRowId = $this->serviceReserveRepository->newReserve($data);
        $logData = [];
        
        $loginId = $data['login_id'];
        $domain = $data['domain'];
        $empNO = $data['emp_no'];
        $pushTitle = $data['info_push_title'];
        $pushContent = $data['info_push_content'];
        $push = $data['push'];
        
        $managerLoginId = $managerInfo['manager_login_id'];
        $managerDomain = $managerInfo['manager_domain'];
        $managerEmpNo = $managerInfo['manager_emp_no'];


        $logData = EmpServiceLog::getLogData(self::TABLE, $newReserveRowId,
                                             self::ACTION_ADD,
                                             $loginId, $domain, $empNO,
                                             $data);

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        //Push reserve message
        $title = $pushTitle;
        $text  = $pushContent;
        $extra = [];
        $queryParam =  array(
                        'lang' => $lang
                        );

        $pushList = [];
        //add to push to manager
        if(substr($push, 0, 1)){
            array_push($pushList,['from'=>$domain . "\\" . $loginId,
                                'to'=>$managerDomain . "\\" . $managerLoginId]);
        }
        //add to push to user
        if(substr($push, 1, 1)){
            array_push($pushList,['from'=>$managerDomain . "\\" . $managerLoginId,
                                'to'=>$domain . "\\" . $loginId]);
        }

        foreach ($pushList as $item) {
            $from = $item['from'];
            $to = (array)$item['to'];
            PushUtil::sendPushMessage($from, $to, $title, $text, $extra, $queryParam);
        }
        
        return [$result,$logData];
    }

    /**
     * Get formated Reserve Record List
     * @param  string $serviceId service_id
     * @param  int $startDate query start date
     * @param  int $endDate   query end date
     * @return array
     */
    public function getReserveRecord($serviceId, $startDate, $endDate){
        
        $result =  $this->serviceReserveRepository->getReserveRecord($serviceId, $startDate, $endDate);

        foreach ($result as $key=> $value) {
            $result[$key]['complete_at'] = strtotime($value->complete_at);
            if($value->complete == 'N'){
                unset($result[$key]['complete_login_id']);
                unset($result[$key]['complete_at']);
            }
        }

        return [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                    "content" => ['record_list'=>$result]
                ];
    }

    /**
     * Get Arranged reserve list by target_id_row_id 
     * @param  int $targetIdRowId target_id_row_id
     * @param  timestamp $startDate     start date
     * @param  timestamp $endDate       end date
     * @return Array
     */
    public function getTargetReserveData($targetIdRowId, $startDate, $endDate){

        $result =  $this->serviceReserveRepository->getTargetReserveData($targetIdRowId, $startDate, $endDate);

        foreach ($result as $key=> $value) {
            $result[$key]['complete_at'] = strtotime($value->complete_at);
            if($value->complete == 'N'){
                unset($result[$key]['complete_login_id']);
                unset($result[$key]['complete_at']);
            }
        }

        return [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                    "content" => ['data_list' => $result]
                ];
    }
    
    /**
     * get my all reserve by service type
     * @param  string $serviceType seervice type
     * @param  string $empNo       my emp_no
     * @param  timestamp $startDate start date
     * @param  timestamp $endDate   end date
     * @return Array
     */
    public function getMyReserveByServiceType($serviceType, $empNo, $startDate, $endDate){

        $serviceList = [];
        $recordList = [];
        $tmpArray = [];

        $result =  $this->serviceReserveRepository->getMyReserveByServiceType($serviceType, $empNo, $startDate, $endDate);

        foreach ($result as $index => $service) {
           
             $tmpArray[$service->service_id][] = ['target_id'=>$service->target_id,
                                                'target_id_row_id'=>$service->target_id_row_id,
                                                'reserve_id'=>$service->reserve_id,
                                                'info_push_title'=>$service->info_push_title,
                                                'info_push_content'=>$service->info_push_content,
                                                'info_data'=>$service->info_data,
                                                'start_date'=>$service->start_date,
                                                'end_date'=>$service->end_date,
                                                'complete'=>$service->complete,
                                                'complete_login_id'=>$service->complete_login_id,
                                                'complete_at'=>strtotime($service->complete_at),
                                                ];
            if($service->complete == 'N'){
                unset($tmpArray[$service->service_id][$index]['complete_login_id']);
                unset($tmpArray[$service->service_id][$index]['complete_at']);
            }
        }

        foreach ($tmpArray as $key => $record) {
            $recordList = ["service_id" => $key, "record_list" => $record];
            $serviceList [] = $recordList;
        }

        return [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                    "content" => $serviceList
                ];

    }

    /**
     * Get my reserve by service id
     * @param  string $serviceId service id
     * @param  string $empNo     my emp_no
     * @param  timestamp $startDate start date
     * @param  timestamp $endDate   end date
     * @return array
     */
    public function getMyReserveByServiceID($serviceId, $empNo, $startDate, $endDate){
        
        $serviceList = [];
        $recordList = [];
        $tmpArray = [];

        $result =  $this->serviceReserveRepository->getMyReserveByServiceID($serviceId, $empNo, $startDate, $endDate);
        foreach ($result as $index => $service) {
           
             $tmpArray[$service->service_id][] = ['target_id'=>$service->target_id,
                                                'target_id_row_id'=>$service->target_id_row_id,
                                                'reserve_id'=>$service->reserve_id,
                                                'info_push_title'=>$service->info_push_title,
                                                'info_push_content'=>$service->info_push_content,
                                                'info_data'=>$service->info_data,
                                                'start_date'=>$service->start_date,
                                                'end_date'=>$service->end_date,
                                                'complete'=>$service->complete,
                                                'complete_login_id'=>$service->complete_login_id,
                                                'complete_at'=>strtotime($service->complete_at),
                                                ];
            if($service->complete == 'N'){
                unset($tmpArray[$service->service_id][$index]['complete_login_id']);
                unset($tmpArray[$service->service_id][$index]['complete_at']);
            }
        }

        foreach ($tmpArray as $key => $record) {
            $recordList = ["service_id" => $key, "record_list" => $record];
            $serviceList [] = $recordList;
        }
        return [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                    "content" => ['service_list' => $serviceList]
                ];
        
    }

    /**
     * Get reserve data by reserve_record.row_id
     * @param  int $reserveRowId reserve_record.row_id
     * @return mixed
     */
    public function getReserveByRowID($reserveRowId){
        return $this->serviceReserveRepository->getReserveByRowID($reserveRowId);
    }

    public function setReserveComplete($reserveRowId, $loginId, $domain, $empNO, $completeSelf){
        
        $logData = [];
        $data = [];

        $data['complete'] = 'Y';
        $data['complete_self'] = $completeSelf;
        $data['complete_login_id'] = $loginId;
        $data['complete_domain'] = $domain;
        $data['complete_emp_no'] = $empNO;
        $data['complete_at'] = date('Y-m-d H:i:s',time());

        $newReserveRowId = $this->serviceReserveRepository->updateReserveByRowId($reserveRowId, $data);

        $logData = EmpServiceLog::getLogData(self::TABLE, $reserveRowId,
                                             self::ACTION_UPDATE,
                                             $loginId, $domain, $empNO,
                                             $data);

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
            "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
          ];

       return [$result,$logData];
    }
}