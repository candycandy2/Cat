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
                if(isset($pValue['note'])){
                    $lifeCrontab['note'] =  $pValue['note'];
                }
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
                if(isset($pValue['note'])){
                     $lifeCrontab['note'] =  $pValue['note'];
                }
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

    /**
     * Check status type exist
     * @param  string $statusType status type
     * @return boolean
     */
    public function checkStatusTypeExist($statusType){
        $statusTypeCount =  $this->statusIdRepository->getStatusTypeCount($statusType);
        if($statusTypeCount > 0){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Get life crontab by status id
     * @param  string $statusId status_id
     * @return array
     */
    public function getLifeCrontabByStatusID($statusId){

        $lifeCrontabList = $this->statusLifeCrontabRepository->getLifeCrontabByStatusID($statusId);

        return $this->arrangeLifeCrontab($lifeCrontabList);
 
    }

    /**
     * Get life crontab by status type
     * @param  string $statusType status type
     * @return array
     */
    public function getLifeCrontabByStatusType($statusType){

        $lifeCrontabList = $this->statusLifeCrontabRepository->getLifeCrontabByStatusType($statusType);
        
        return $this->arrangeLifeCrontab($lifeCrontabList);

    }

    /**
     * Get arranged life
     * @param  Array $lifeCrontabList life crontab list data
     * @return Array
     */
    private function arrangeLifeCrontab($lifeCrontabList){

         $statusList = ["status_list" => []];

         $statusTypeArr = [];

        foreach ($lifeCrontabList as $crontab) {

            $updatedUser = StatusLog::getLastUpdatedUser(self::TABLE_STATUS_LIFE_CRONTAB,$crontab->life_crontab_row_id);
            if(!is_null($updatedUser)){
                
                $statusTypeArr[$crontab->status_type][$crontab->status_id][] = [
                                                     "status" => $crontab->status,
                                                     "note" => $crontab->note,
                                                     "life_crontab_row_id" => $crontab->life_crontab_row_id,
                                                     "life_type" => $crontab->life_type,
                                                     "crontab" => $crontab->crontab,  
                                                     "owner_login_id" => $updatedUser->login_id,
                                                     "owner_domain" => $updatedUser->domain,
                                                     "owner_emp_no" => $updatedUser->emp_no];
            }
        }

        foreach ($statusTypeArr as $statusType => $statusIdArr) {
            foreach ($statusIdArr as $statusId => $periodList) {
              array_push($statusList["status_list"],
                                  ["status_type" => $statusType,
                                   "status_id" => $statusId,
                                   "period_list" => $periodList]);
            }

        }

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                   "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
                   "content" => $statusList
                  ];

        return $result;
    }
    
    /**
     * delete status and set it's life crontabs by status_id
     * @param  string $loginId  user login id
     * @param  string $domain   user domain
     * @param  string $empNo    user emp no
     * @param  string $statusId delete status id
     * @return array
     */
    public function deleteStatusById($loginId, $domain, $empNo, $statusId){

        $lifeCrontabList = $this->statusLifeCrontabRepository->getLifeCrontabByStatusID($statusId);
        return $this->deleteStatus($loginId, $domain, $empNo, $lifeCrontabList);
    }

    /**
     * delete status and set it's life crontabs by status_type
     * @param  string $loginId    user login id
     * @param  string $domain     user domain
     * @param  string $empNo      user emp no
     * @param  string $statusType status_type
     * @return array
     */
    public function deleteStatusByType($loginId, $domain, $empNo, $statusType){

        $lifeCrontabList = $this->statusLifeCrontabRepository->getLifeCrontabByStatusType($statusType);
        return $this->deleteStatus($loginId, $domain, $empNo, $lifeCrontabList);
    }

    /**
     * delete status
     * @param  string $loginId         user login id
     * @param  string $domain          user domain
     * @param  string $empNo           user emp no
     * @param  mixed  $lifeCrontabList query result of status infomation and lifecrontab
     * @return array
     */
    private function deleteStatus($loginId, $domain, $empNo, $lifeCrontabList){
        
        $statusCotrntabList = [];
        $logData = [];
        $updateData = ['active' => 'N'];

        foreach ($lifeCrontabList as $crontab) {
            $statusCotrntabList[$crontab->status_id][] = $crontab->life_crontab_row_id;
        }

        foreach ($statusCotrntabList as $statusId => $crontabList) {

            //delete life crontab
            foreach ($crontabList as $crontabId) {
                 $deleteCrontabRowId = $this->statusLifeCrontabRepository->updateStatusLifeCrontab($crontabId,$updateData);

                  $logData[] = StatusLog::getLogData(self::TABLE_STATUS_LIFE_CRONTAB, $deleteCrontabRowId,
                                             self::ACTION_DELETE,
                                             $loginId, $domain, $empNo,
                                             $updateData);
            }

            //delete status id
            $deletedStatusRowId = $this->statusIdRepository->updateStatus($statusId, $updateData);

            $logData[] = StatusLog::getLogData(self::TABLE_STATUS_ID, $deletedStatusRowId,
                                     self::ACTION_DELETE,
                                     $loginId, $domain, $empNo,
                                     $updateData);
        }

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        return [$result,$logData];

    }
    

}