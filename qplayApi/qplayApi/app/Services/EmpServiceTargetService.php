<?php
/**
 * Target Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceTargetIDRepository;
use App\Repositories\EmpServiceDataLogRepository as EmpServiceLog;
use App\lib\ResultCode;
use App\lib\CommonUtil;


class EmpServiceTargetService
{

    const TABLE = 'target_id';

    const ACTION_ADD = 'add';
    const ACTION_UPDATE = 'update';
    const ACTION_DELETE = 'delete';
    
    protected $targetIDRepository;

    private  $logData = [];

    public function __construct(EmpServiceTargetIDRepository $targetIDRepository)
    {
        $this->targetIDRepository = $targetIDRepository;
    }

    /**
     * To new,delete, or reopen target 
     * @param int $serviceRowId specific service_id.row_id
     * @param string $loginId      user login id
     * @param string $domain       user domain
     * @param string $empNo        user empNo
     * @param Array  $new          the data array to be new
     * @param Array  $delete       the target_id array to be delete
     */
    public function setEmpServiceTarget($serviceRowId, $loginId, $domain, $empNo, Array $new, Array $delete){

        $newDataList    = [];
        $updateDataList = [];
        $deleteIdList   = [];
       
        
        $result = ["result_code" => ResultCode::_1_reponseSuccessful, "message"
                                 => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];

        foreach ($new as $index => $data) {

            if(!isset($data['target_id']) || !isset($data['life_type']) || !isset($data['reserve_limit'])){
                
                $result = ["result_code" => ResultCode::_999001_requestParameterLostOrIncorrect, 
                "message" => CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect)];
                break;

            }else{
                
                $targetId       = $data['target_id'];
                $lifeType       = $data['life_type'];
                $reserveLimit   = $data['reserve_limit'];
                
                $this->addEmpServiceTarget($serviceRowId, $loginId, $domain, $empNo, $targetId, $lifeType, $reserveLimit);  

            }

        }

        foreach ($delete as $index => $data) {
            
            if(!isset($data['target_id'])){

                $result = ["result_code" => ResultCode::_999001_requestParameterLostOrIncorrect, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect)];
                break;

            }else{
                $targetId = $data['target_id'];
                $logData = $this->deleteEmpServiceTarget($serviceRowId, $loginId, $domain, $empNo, $targetId);
            }
        
        }

        return [$result,$this->logData];
    }

    /**
     * Add a new target to specific service_id, and set data to be log
     * @param int $serviceRowId service_id.row_id
     * @param string $loginId      user login id
     * @param string $domain       user domain
     * @param string $empNo        user emp no
     * @param string $targetId     target_id
     * @param int    $lifeType     target life type allow 0/1
     * @param int    $reserveLimit target reservelimit
     */
    private function addEmpServiceTarget($serviceRowId, $loginId, $domain, $empNo, $targetId, $lifeType, $reserveLimit){
           
            // if target already exist, will update to active=Y
            if($this->targetIDRepository->checkTargetExist($serviceRowId, $targetId)){
                
                $updateRowId = $this->targetIDRepository->openEmpServiceTarget($serviceRowId, $targetId);

                // if targetRowId = null means there is no data updated
                if(!is_null($updateRowId)){
                    $this->logData [] = EmpServiceLog::getLogData(self::TABLE,
                                                            $updateRowId,
                                                            self::ACTION_UPDATE,
                                                            $loginId,
                                                            $domain,$empNo,
                                                            ['active'=>'Y']);
                }
            
            }else{
                
                //add a new target to service id
                $newData = [
                    'service_id_row_id' => $serviceRowId,
                    'target_id'         => $targetId,
                    'life_type'         => $lifeType,
                    'reserve_limit'     => $reserveLimit
                ];
                
                $newRowId = $this->targetIDRepository->addEmpServiceTarget($newData);

                $this->logData [] = EmpServiceLog::getLogData(self::TABLE,
                                                            $newRowId,
                                                            self::ACTION_ADD,
                                                            $loginId,
                                                            $domain,
                                                            $empNo,
                                                            $newData);

            }
    }

    /**
     * Delete a target from specific service, and set data to be log
     * @param  [type] $serviceRowId service_id.row_id
     * @param  [type] $loginId      user login id
     * @param  [type] $domain       user domain
     * @param  [type] $empNo        user emp no
     * @param  [type] $targetId     target_id
     */
    private function deleteEmpServiceTarget($serviceRowId, $loginId, $domain, $empNo, $targetId){

        $deleteRowId = $this->targetIDRepository->deleteEmpServiceTarget($serviceRowId, $targetId);

        // if targetRowId = null means there is no data deleted
        if(!is_null($deleteRowId)){
            $this->logData [] = EmpServiceLog::getLogData(self::TABLE,
                                                        $deleteRowId,
                                                        self::ACTION_UPDATE,
                                                        $loginId,
                                                        $domain,
                                                        $empNo,
                                                        ['active'=>'N']);
        }
    }
}