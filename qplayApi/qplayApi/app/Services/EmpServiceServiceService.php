<?php
/**
 * Emp Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceServiceIDRepository;
use App\Repositories\EmpServiceDataLogRepository as EmpServiceLog;
use App\lib\ResultCode;
use App\lib\CommonUtil;


class EmpServiceServiceService
{

    const TABLE = 'service_id';

    const ACTION_ADD = 'add';
    const ACTION_UPDATE = 'update';
    const ACTION_DELETE = 'delete';
    
    protected $serviceIDRepository;

    public function __construct(EmpServiceServiceIDRepository $serviceIDRepository)
    {
        $this->serviceIDRepository = $serviceIDRepository;
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

        $serviceRs = $this->serviceIDRepository->getServiceRowId($serviceId);
        $logData = [];

        if(!is_null($serviceRs)){
            $result = ["result_code" => ResultCode::_052001_empServiceExist, "message"
                                 => CommonUtil::getMessageContentByCode(ResultCode::_052001_empServiceExist)
                  ];
        }else{
            
            $data = [
                        'service_id' => $serviceId,
                        'type' => $type
                    ];

            $newServiceRowId = $this->serviceIDRepository->newEmpService($data);

            $logData = EmpServiceLog::getLogData(self::TABLE,$newServiceRowId,
                                                 self::ACTION_ADD,$loginId,
                                                 $domain,$empNo,
                                                 $data);


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
            $tmpServiceIdList = [];
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

}