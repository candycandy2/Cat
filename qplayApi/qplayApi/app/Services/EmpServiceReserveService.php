<?php
/**
 * Emp Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceReserveRepository;
use App\Repositories\EmpServiceDataLogRepository as EmpServiceLog;
use App\Repositories\EmpServicePushRepository;
use App\Repositories\EmpServiceServiceIDRepository;
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
    protected $servicePushRepository;
    protected $serviceIDRepository;

    public function __construct(EmpServiceReserveRepository $serviceReserveRepository,
                                EmpServicePushRepository $servicePushRepository,
                                EmpServiceServiceIDRepository $serviceIDRepository)
    {
        $this->serviceReserveRepository = $serviceReserveRepository;
        $this->servicePushRepository = $servicePushRepository;
        $this->serviceIDRepository = $serviceIDRepository;
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
        $push = $data['push'];
        
        $serviceIdRowId = $managerInfo['service_id_row_id'];
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
        
        // //Push Message To Admin
        if(substr($push, 0, 1)){
            
            $pushAdminTitle = $data['info_push_admin_title'];
            $pushAdminContent = $data['info_push_admin_content'];
            $adminPushFrom = $domain . "\\" . $loginId;
            $adminPushTo = [];
            $pushUser = $this->servicePushRepository->getEmpServicePush($serviceIdRowId);
            foreach ($pushUser as $user) {
                $adminPushTo[] = $user->domain . "\\" . $user->login_id;
            }

            if(count($adminPushTo) > 0){
                PushUtil::sendPushMessageWithContent($adminPushFrom,
                                                 $adminPushTo,
                                                 $pushAdminTitle,
                                                 $pushAdminContent,
                                                 [],
                                                 array('lang' => $lang));    
            }
        }

        //Push Mssage To Employee
        if(substr($push, 1, 1)){

            $pushEmpTitle = $data['info_push_emp_title'];
            $pushEmpContent = $data['info_push_emp_content'];
            $empPushFrom = $managerDomain . "\\" . $managerLoginId;
            $empPushTo = [$domain . "\\" . $loginId];

            PushUtil::sendPushMessageWithContent($empPushFrom,
                                                 $empPushTo,
                                                 $pushEmpTitle,
                                                 $pushEmpContent,
                                                 [],
                                                 array('lang' => $lang));
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
                    "content" => ['record_list' => $result]
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
        
        $services = $this->serviceIDRepository->getServiceByServiceType($serviceType);
       
        foreach ($services as $service) {
            $recordList = $this->getMyReserveRecord($service->service_id, $empNo, $startDate, $endDate);
            $serviceList[] = ["service_id" => $service->service_id, "record_list" => $recordList];
        }
        return [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                    "content" =>  ['service_list' => $serviceList]
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

        $recordList = $this->getMyReserveRecord($serviceId, $empNo, $startDate, $endDate);
        //var_dump($recordList);exit();
        $serviceList = [["service_id" => $serviceId, "record_list" => $recordList]];

        return [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                    "content" => ['service_list' => $serviceList]
                ];
        
    }

    private function getMyReserveRecord($serviceId, $empNo, $startDate, $endDate){

        $recordList = [];
        $result =  $this->serviceReserveRepository->getMyReserveByServiceID($serviceId, $empNo, $startDate, $endDate);

        foreach ($result as $index => $reserve) {
            $tmpRecord =['target_id'=>$reserve->target_id,
                            'target_id_row_id'=>$reserve->target_id_row_id,
                            'reserve_id'=>$reserve->reserve_id,
                            'info_push_title'=>$reserve->info_push_emp_title,
                            'info_push_content'=>$reserve->info_push_emp_content,
                            'info_data'=>$reserve->info_data,
                            'start_date'=>$reserve->start_date,
                            'end_date'=>$reserve->end_date,
                            'complete'=>$reserve->complete,
                            'complete_login_id'=>$reserve->complete_login_id,
                            'complete_at'=>strtotime($reserve->complete_at),
                            ];
            if($reserve->complete == 'N'){
                unset($tmpRecord['complete_login_id']);
                unset($tmpRecord['complete_at']);
            }
            $recordList[] = $tmpRecord;
        }

        return $recordList;
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

    /**
     * Edit Reserve data
     * @param int   $reserveRowId reserve_record.row_id
     * @param Array $data  update data
     * @param Array $managerInfo
     * @param String $lang
     * @return mixed
     */
    public function editReserve($reserveRowId, Array $data, $managerInfo, $lang){

        $logData = [];
        
        $editRs = $this->serviceReserveRepository->editReserve($reserveRowId, $data);

        $loginId = $data['login_id'];
        $domain = $data['domain'];
        $empNO = $data['emp_no'];
        $push = $data['push'];
        
        $serviceIdRowId = $managerInfo['service_id_row_id'];
        $managerLoginId = $managerInfo['manager_login_id'];
        $managerDomain = $managerInfo['manager_domain'];
        $managerEmpNo = $managerInfo['manager_emp_no'];


        $logData = EmpServiceLog::getLogData(self::TABLE, $reserveRowId,
                                             self::ACTION_UPDATE,
                                             $loginId, $domain, $empNO,
                                             $data);

        //Push Message To Admin
        if(substr($push, 0, 1)){
            
            $pushAdminTitle = $data['info_push_admin_title'];
            $pushAdminContent = $data['info_push_admin_content'];
            $adminPushFrom = $domain . "\\" . $loginId;
            $adminPushTo = [];
            $pushUser = $this->servicePushRepository->getEmpServicePush($serviceIdRowId);
            foreach ($pushUser as $user) {
                $adminPushTo[] = $user->domain . "\\" . $user->login_id;
            }

            if(count($adminPushTo) > 0){
                PushUtil::sendPushMessageWithContent($adminPushFrom,
                                                 $adminPushTo,
                                                 $pushAdminTitle,
                                                 $pushAdminContent,
                                                 [],
                                                 array('lang' => $lang));    
            }
        }

        //Push Mssage To Employee
        if(substr($push, 1, 1)){

            $pushEmpTitle = $data['info_push_emp_title'];
            $pushEmpContent = $data['info_push_emp_content'];
            $empPushFrom = $managerDomain . "\\" . $managerLoginId;
            $empPushTo = [$domain . "\\" . $loginId];

            PushUtil::sendPushMessageWithContent($empPushFrom,
                                                 $empPushTo,
                                                 $pushEmpTitle,
                                                 $pushEmpContent,
                                                 [],
                                                 array('lang' => $lang));
        }

        $result = [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        return [$result,$logData];
        
    }

    /**
     * Delete Reserve data
     * @param int   $reserveRowId reserve_record.row_id
     * @param Array $data  update data
     * @param Array $managerInfo
     * @param String $lang
     * @return mixed
     */
    public function deleteReserve($reserveRowId, Array $data, $managerInfo, $lang){

        $logData = [];
        
        $editRs = $this->serviceReserveRepository->editReserve($reserveRowId, $data);

        $loginId = $data['login_id'];
        $domain = $data['domain'];
        $empNO = $data['emp_no'];
        $push = $data['push'];
        
        $serviceIdRowId = $managerInfo['service_id_row_id'];
        $managerLoginId = $managerInfo['manager_login_id'];
        $managerDomain = $managerInfo['manager_domain'];
        $managerEmpNo = $managerInfo['manager_emp_no'];


        $logData = EmpServiceLog::getLogData(self::TABLE, $reserveRowId,
                                             self::ACTION_DELETE,
                                             $loginId, $domain, $empNO,
                                             $data);

        //Push Message To Admin
        if(substr($push, 0, 1)){
            
            $pushAdminTitle = $data['info_push_admin_title'];
            $pushAdminContent = $data['info_push_admin_content'];
            $adminPushFrom = $domain . "\\" . $loginId;
            $adminPushTo = [];
            $pushUser = $this->servicePushRepository->getEmpServicePush($serviceIdRowId);
            foreach ($pushUser as $user) {
                $adminPushTo[] = $user->domain . "\\" . $user->login_id;
            }

            if(count($adminPushTo) > 0){
                PushUtil::sendPushMessageWithContent($adminPushFrom,
                                                 $adminPushTo,
                                                 $pushAdminTitle,
                                                 $pushAdminContent,
                                                 [],
                                                 array('lang' => $lang));    
            }
        }

        //Push Mssage To Employee
        if(substr($push, 1, 1)){

            $pushEmpTitle = $data['info_push_emp_title'];
            $pushEmpContent = $data['info_push_emp_content'];
            $empPushFrom = $managerDomain . "\\" . $managerLoginId;
            $empPushTo = [$domain . "\\" . $loginId];

            PushUtil::sendPushMessageWithContent($empPushFrom,
                                                 $empPushTo,
                                                 $pushEmpTitle,
                                                 $pushEmpContent,
                                                 [],
                                                 array('lang' => $lang));
        }

        $result = [ "result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        return [$result,$logData];
        
    }

}