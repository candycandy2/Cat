<?php
/**
 * Emp Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceServiceIDRepository;
use App\lib\ResultCode;
use App\lib\CommonUtil;


class EmpServiceServiceService
{

    const TABLE_SERVICE_ID = 'service_id';
    const TABLE_TARGET_ID = 'target_id';
    const TABLE_SERVICE_RECORD = 'reserve_record';

    const ACTION_ADD = 'add';
    const ACTION_UPDATE = 'update';
    const ACTION_DELETE = 'delete';
    
    protected $serviceIDRepository;

    public function __construct(EmpServiceServiceIDRepository $serviceIDRepository)
    {
        $this->serviceIDRepository = $serviceIDRepository;
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

        if(count($serviceRs) > 0){
            $result = ["result_code" => ResultCode::_052001_empServiceExist, "message"
                                 => CommonUtil::getMessageContentByCode(ResultCode::_052001_empServiceExist)
                  ];
        }else{
            
            $data = [
                        'service_id' => $serviceId,
                        'type' => $type
                    ];

            $newServiceRowId = $this->serviceIDRepository->newEmpService($data);


            $logData = [
                    "table_name" => self::TABLE_SERVICE_ID,
                    "table_row_id" => $newServiceRowId,
                    "action" => self::ACTION_ADD,
                    "login_id" => $loginId,
                    "domain" => $domain,
                    "emp_no" => $empNo,
                    "content" =>"service_id:=>".$serviceId.",type:=>".$type
                ];


            $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                       "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                      ];

        }

        return [$result,$logData];
    }
}