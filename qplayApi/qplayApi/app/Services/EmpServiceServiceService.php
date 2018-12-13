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


}