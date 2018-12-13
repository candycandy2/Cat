<?php
/**
 * EmpService TargetId - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\EmpService_Target_ID;
use DB;

class EmpServiceTargetIDRepository
{

    protected $targetId;

    public function __construct(EmpService_Target_ID $targetId)
    {
        $this->targetId = $targetId;
    }

    /**
     * New a target to specific service
     * @param int new data row_id
     */
    public function addEmpServiceTarget($data){

        return $this->targetId->insertGetId($data);
    }

    /**
     * Delete a target from specific service
     * @param  int $serviceRowId service_id.row_id
     * @param  string $targetId     target_id.target_id
     * @return mixed             return the modified target_id.row_id,
     *                           if no date to delete, return null
     */
    public function deleteEmpServiceTarget($serviceRowId, $targetId){
        $target =  $this->targetId->where('target_id',$targetId)
                       ->where('service_id_row_id',$serviceRowId)
                       ->where('active','Y')
                       ->first();
        
        if(!is_null($target)){
            $updateId = $target->row_id;
            $target->active = 'N';
            $target->save();
        }else{
            $updateId = null;
        }
        return $updateId;
        
    }

    /**
     * Enable the target of specific service
     * @param  int $serviceRowId service_id.row_id
     * @param  string $targetId     target_id.target_id
     * @return mixed             return the modified target_id.row_id,
     *                           if no date to delete, return null
     */
    public function openEmpServiceTarget($serviceRowId, $targetId){
        $target = $this->targetId->where('target_id',$targetId)
                       ->where('service_id_row_id',$serviceRowId)
                       ->where('active','N')
                       ->first();
        if(!is_null($target)){
            $updateId = $target->row_id;
            $target->active = 'Y';
            $target->save();
        }else{
            $updateId = null;
        }

        return $updateId;
    }

    /**
     * Check specific target exist or not
     * @param  int $serviceRowId service_id.row_id
     * @param  string $targetId     target_id.target_id
     * @return boolean
     */
    public function checkTargetExist($serviceRowId, $targetId){
        
        $target = $this->targetId->where('service_id_row_id', $serviceRowId)
                    ->where('target_id', $targetId)
                    ->get();
        if(count($target) > 0 ){
            return true;
        }
        return false;
    }

}