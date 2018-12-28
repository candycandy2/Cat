<?php
/**
 * Status - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\StatusIDRepository;
use App\Repositories\StatusLifeCrontabRepository;
use App\Repositories\StatusLogRepository as StatusLog;
use App\lib\ResultCode;
use App\lib\CommonUtil;

class StatusService
{
    const TABLE_STATUS_ID = 'status_id';
    const TABLE_STATUS_LIFE_CRONTAB = 'status_life_crontab';

    const ACTION_ADD = 'add';
    const ACTION_UPDATE = 'update';
    const ACTION_DELETE = 'delete';

    protected $statusIdRepository;
    protected $statusLifeCrontabRepository;

    public function __construct(StatusIDRepository $statusIdRepository,
                                StatusLifeCrontabRepository $statusLifeCrontabRepository)
    {   
        $this->statusIdRepository = $statusIdRepository;
        $this->statusLifeCrontabRepository = $statusLifeCrontabRepository;
    }

    /**
     * Check if status exist or not by status_id
     * @param  string $statusId status_id
     * @return boolean
     */
    public function checkStatusExist($statusId){
        $data = $this->statusIdRepository->getStatusByStatusId($statusId);
        if(is_null($data)){
            return false;
        }else{
            return true;
        }
    }

    /**
     * check specific status life crontab exist or not
     * @param  string $statusId
     * @param  int $statusLifeCrontabRowId status_life_crontab.row_id
     * @return mixed
     */
    public function checkStatusLifeCrontabExist($statusId, $statusLifeCrontabRowId) {
        $data = $this->statusLifeCrontabRepository
                     ->getStatusLifeCrontabByRowId($statusId, $statusLifeCrontabRowId);
        if(count($data) > 0){
            return true;
        }else{
            return false;
        }
    }

    /**
     * new status and set it's life crontabs 
     * @param  string $loginId user login_id
     * @param  string $domain  user domain
     * @param  string $empNo   user emp_no
     * @param  array  $newData insert data list
     * @return array           result and log data
     */
    public function newStatus($loginId, $domain, $empNo, $newData){
        $logData = [];
        foreach ($newData as $key => $value) {
            $statusData = ['status_id'  => $value['status_id'],
                           'type'       => $value['status_type'],
                           'active'     => 'Y'];
            
            $statusId = $this->statusIdRepository->newStatus($statusData);

            $logData[] = StatusLog::getLogData(self::TABLE_STATUS_ID, $statusId,
                                             self::ACTION_ADD,
                                             $loginId, $domain, $empNo,
                                             $statusData);

            foreach ($value['period_list'] as $pKey => $pValue) {
                $lifeCrontab = [
                                'status_id_row_id'  =>  $statusId,
                                'status'            =>  $pValue['status'],
                                'active'            =>  'Y',
                                'life_type'         =>  $pValue['life_type'],
                                'crontab'           =>  $pValue['crontab']
                               ];
                if($pValue['life_type'] == 1){
                    $lifeCrontab['life_start'] = gmdate("Y-m-d H:i:s", $pValue['life_start']);
                    $lifeCrontab['life_end'] = gmdate("Y-m-d H:i:s", $pValue['life_end']);
                }
                $lifeCrontabId = $this->statusLifeCrontabRepository->newStatusLifeCrontab($lifeCrontab);

                $logData[] = StatusLog::getLogData(self::TABLE_STATUS_LIFE_CRONTAB, $lifeCrontabId,
                                             self::ACTION_ADD,
                                             $loginId, $domain, $empNo,
                                             $lifeCrontab);
            }
        }

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        return [$result,$logData];
    }

    /**
     * update status and set it's life crontabs 
     * @param  string $loginId    user login id
     * @param  string $domain     user domain
     * @param  string $empNo      user emp_no
     * @param  Array $updateData  update data list
     * @return array              result and log data
     */
    public function updateStatus($loginId, $domain, $empNo, $updateData){
        $logData = [];
        foreach ($updateData as $key => $value) {

            $statusData = ['type' => $value['status_type']];
            $statusId = $value['status_id'];

            $statusIdRowId = $this->statusIdRepository->updateStatus($statusId, $statusData);

            $logData[] = StatusLog::getLogData(self::TABLE_STATUS_ID, $statusIdRowId,
                                             self::ACTION_UPDATE,
                                             $loginId, $domain, $empNo,
                                             $statusData);

            foreach ($value['period_list'] as $pKey => $pValue) {
                
                $lifeCrontabId = $pValue['life_crontab_row_id'];

                $lifeCrontab = [
                                'status'            =>  $pValue['status'],
                                'life_type'         =>  $pValue['life_type'],
                                'crontab'           =>  $pValue['crontab']
                               ];
                
                if($pValue['life_type'] == 1){
                    $lifeCrontab['life_start'] = gmdate("Y-m-d H:i:s", $pValue['life_start']);
                    $lifeCrontab['life_end'] = gmdate("Y-m-d H:i:s", $pValue['life_end']);
                }else{
                    $lifeCrontab['life_start'] = null;
                    $lifeCrontab['life_end'] = null;
                }

                $this->statusLifeCrontabRepository->updateStatusLifeCrontab($lifeCrontabId, $lifeCrontab);

                $logData[] = StatusLog::getLogData(self::TABLE_STATUS_LIFE_CRONTAB, $lifeCrontabId,
                                             self::ACTION_UPDATE,
                                             $loginId, $domain, $empNo,
                                             $lifeCrontab);
            }
        }

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        return [$result,$logData];
    }
}