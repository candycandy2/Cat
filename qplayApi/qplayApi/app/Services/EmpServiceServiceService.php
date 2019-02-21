<?php
/**
 * Emp Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceServiceIDRepository;
use App\Repositories\EmpServiceDataLogRepository as EmpServiceLog;
use App\Repositories\EmpServiceTargetIDRepository;
use App\Repositories\EmpServicePushRepository;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use DB;


class EmpServiceServiceService
{

    const TABLE = 'service_id';
    const TABLE_TARGET_ID = 'target_id';
    const TABLE_SERVICE_PUSH = 'service_push';

    const ACTION_ADD = 'add';
    const ACTION_UPDATE = 'update';
    const ACTION_DELETE = 'delete';
    
    protected $serviceIDRepository;
    protected $serviceTargetIDRepository;
    protected $servicePushRepository;

    public function __construct(EmpServiceServiceIDRepository $serviceIDRepository,
                                EmpServiceTargetIDRepository $serviceTargetIDRepository,
                                EmpServicePushRepository $servicePushRepository)
    {
        $this->serviceIDRepository = $serviceIDRepository;
        $this->serviceTargetIDRepository = $serviceTargetIDRepository;
        $this->servicePushRepository = $servicePushRepository;
    }

    public function getServiceRowId($serviceId){
        return $this->serviceIDRepository->getServiceRowId($serviceId);
    }

    /**
     * new a EmpService
     * @param  string $serviceId unique service id
     * @param  string $type      type name
     * @return Array  $result    $result[0] execute result can return to app
     *                           $result[1] log data for EmpServiceLogService to insert into data_log table
     */
    public function newEmpService($serviceId, $type, $loginId, $domain, $empNo){

        $serviceRs = $this->serviceIDRepository->getServiceRowId($serviceId, $type);

        $logData = [];

        if(!is_null($serviceRs)){
            $result = ["result_code" => ResultCode::_052001_empServiceExist, "message"
                                 => CommonUtil::getMessageContentByCode(ResultCode::_052001_empServiceExist)
                  ];
        }else{

            DB::beginTransaction();

            try{
                $data = [
                        'service_id' => $serviceId,
                        'type' => $type
                    ];

                $newServiceRowId = $this->serviceIDRepository->newEmpService($data);

                $pushUserData = [
                            'service_id_row_id' =>  $newServiceRowId,
                            'login_id' => $loginId,
                            'domain' => $domain,
                            'emp_no' => $empNo
                        ];


                $newServicePush = $this->servicePushRepository->addServicePush($pushUserData);

                $serciceLog = EmpServiceLog::getLogData(self::TABLE, $newServiceRowId,
                                                     self::ACTION_ADD, $loginId,
                                                     $domain ,$empNo,
                                                     $data);

                $pushLog = EmpServiceLog::getLogData(self::TABLE_SERVICE_PUSH, $newServicePush,
                                                     self::ACTION_ADD, $loginId,
                                                     $domain, $empNo,
                                                     $pushUserData);

                array_push($logData, $serciceLog, $pushLog); 

                DB::commit();

            }catch (\Exception $e){  

                DB::rollBack();            
                throw $e;
            }

            $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                       "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                      ];

        }

        return [$result,$logData];
    }

    /**
     * Get enable service list result info by service type, id serviceType is All, 
     * it will return all type of service
     * @param  String $serviceType service type
     * @return json
     */
    public function getEmpServiceList($serviceType){
        
        $serviceTypeList = ["service_type_list" => []];

        $serviceList = $this->serviceIDRepository->getServiceByServiceType($serviceType);
        
        $serviceTypeArr = [];
        
        foreach ($serviceList as $service) {

            $updatedUser = EmpServiceLog::getLastUpdatedUser(self::TABLE,$service->row_id);
            if(!is_null($updatedUser)){
                
                $serviceTypeArr[$service->type][] = ["service_id" => $service->service_id,
                                                      "owner_login_id" => $updatedUser->login_id,
                                                      "owner_domain" => $updatedUser->domain,
                                                      "owner_emp_no" => $updatedUser->emp_no];
            }
        }

        foreach ($serviceTypeArr as $key => $value) {
            array_push($serviceTypeList["service_type_list"],
                      ["service_type" => $key,"service_id_list" => $value]);
        }

        if(count($serviceTypeArr) <= 0 ){
            $result = ["result_code" => ResultCode::_052003_empServiceTypeNotExist, "message"
                                 => CommonUtil::getMessageContentByCode(ResultCode::_052003_empServiceTypeNotExist)
                  ];
        }else{
            $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                       "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                       "content" => $serviceTypeList
                      ];
        }

        return $result;

    }

    /**
     * Get service list by type 
     * @param  String $serviceType service type
     * @return mixed
     */
    public function getServiceListByType($serviceType){
        return $this->serviceIDRepository->getServiceListByType($serviceType);
    }

    /**
     * Get service manager by service_id.row_id
     * @param  int $serviceIdRowId service_id_row_id
     * @return max
     */
    public function getServiceManager($serviceIdRowId){
        return EmpServiceLog::getLastCreatedUser('service_id', $serviceIdRowId);
    }

    /**
     * Delete EmpService and associated target and get data to log 
     * @param  string $serviceId service_id
     * @param  string $loginId   user login_id
     * @param  string $domain    user domain
     * @param  string $empNo     user emp_no
     * @return Array
     */
    public function deleteEmpService($serviceId, $loginId, $domain, $empNo){
        $logData = [];
        $serviceTargetList = $this->serviceTargetIDRepository->getTargetByServiceId($serviceId);
        foreach ($serviceTargetList as $key => $value) {

            if(!is_null($value['target_id_row_id'])){
                $targetRowId = $this->serviceTargetIDRepository->deleteTarget($value['target_id_row_id']);
                $logData[] = EmpServiceLog::getLogData(self::TABLE_TARGET_ID,$targetRowId,
                                                 self::ACTION_DELETE,$loginId,
                                                 $domain,$empNo,
                                                 ['active'=>'N']);
            }
        }
        $serviceRowId = $this->serviceIDRepository->deleteEmpService($serviceId);
        $logData[] = EmpServiceLog::getLogData(self::TABLE,$serviceRowId,
                                                 self::ACTION_DELETE,$loginId,
                                                 $domain,$empNo,
                                                 ['active'=>'N']);

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                   "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        return [$result,$logData];
    }
}