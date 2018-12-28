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

    /**
     * Get service info and it's assoicate target list by service type
     * @param  String $serviceType service type
     * @return mixed
     */
    public function getTargetByServiceType($serviceType){

        return $this->targetId
                    ->RightJoin('service_id','target_id.service_id_row_id','=', 'service_id.row_id')
                    ->where('service_id.type', $serviceType)
                    ->where('service_id.active', 'Y')
                    ->where(function($q) {
                        $q->where('target_id.active', 'Y')
                          ->orWhere('target_id.active',null);
                    })
                    ->select('service_id',
                             'service_id.type as service_type',
                             'target_id',
                             'target_id.row_id as target_id_row_id',
                             'life_type',
                             'life_start',
                             'life_end',
                             'reserve_count',
                             'reserve_limit')
                    ->get();
    }

    /**
     *  Get service info and it's assoicate target list by service id
     * @param  String $serviceId service id
     * @return mixed
     */
    public function getTargetByServiceId($serviceId){

        return $this->targetId
                    ->RightJoin('service_id','target_id.service_id_row_id','=', 'service_id.row_id')
                    ->where('service_id.service_id', $serviceId)
                    ->where('service_id.active', 'Y')
                    ->where(function($q) {
                        $q->where('target_id.active', 'Y')
                          ->orWhere('target_id.active',null);
                    })
                    ->select('service_id',
                             'service_id.type as service_type',
                             'target_id',
                             'target_id.row_id as target_id_row_id',
                             'life_type',
                             'life_start',
                             'life_end',
                             'reserve_count',
                             'reserve_limit')
                    ->get();
    }

    /**
     * Get specific target by row_id
     * @param  int $targetRowId target row_id
     * @return mixed
     */
    public function getTargetByRowId($targetRowId){
            
        return $this->targetId
                ->where('row_id',$targetRowId)
                ->first();
    }

    /**
     * Delete target by row_id and get deleted row_id 
     * @return mixed
     */
    public function deleteTarget($targetRowId){

        $target = $this->targetId::find($targetRowId);
        
        if(is_null($target)){
            return null;
        }else{
            $target->active = 'N';
            $target->save();
            return $target->row_id;
        }
    }
}