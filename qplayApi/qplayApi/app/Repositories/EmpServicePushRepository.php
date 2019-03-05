<?php
/**
 * EmpService Service_Push - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\EmpService_Service_Push;
use DB;

class EmpServicePushRepository
{

    protected $servicePush;

    public function __construct(EmpService_Service_Push $servicePush)
    {
        $this->servicePush = $servicePush;
    }

    /**
     * Insert new service push
     * @param  Array $data data to be insert
     * @return int
     */
    public function addServicePush($data){
        $addRs = $this->servicePush->updateOrCreate($data);
        return $addRs->row_id;
    }

    /**
     * Get Push User by service_id.row_id
     * @param  int $serviceIdRowId service_id.row_id
     * @return mixed
     */
    public function getEmpServicePush($serviceIdRowId){
        return $this->servicePush
                    ->where('service_id_row_id', $serviceIdRowId)
                    ->select()
                    ->get();
    }

    /**
     * Check service_push data bind with employee or not
     * @param  string $serviceIdRowId service_id.row_id
     * @param  string $loginId        user login id
     * @param  string $domain         user domain
     * @param  string $empNo          user emp no
     * @return mixed                 
     */
    public function checkEmpServicePush($serviceIdRowId, $loginId, $domain, $empNo){
        return $this->servicePush
                    ->where('service_id_row_id', $serviceIdRowId)
                    ->where('emp_no', $empNo)
                    ->where('login_id', $loginId)
                    ->where('domain', $domain)
                    ->select()
                    ->get();
    }

    /**
     * Delete user service push
     * @param  string $deleteServiceIdRowId service_id_row_id would be deleted in service push
     * @param  string $loginId        user login id
     * @param  string $domain         user domain
     * @param  string $empNo          user emp no
     * @return boolean
     */
    public function deleteServicePush($deleteServiceIdRowId, $loginId, $domain, $empNo){
        $servicePush =  $this->servicePush
                    ->where('service_id_row_id', $deleteServiceIdRowId)
                    ->where('login_id', $loginId)
                    ->where('domain', $domain)
                    ->where('emp_no', $empNo)
                    ->first();

        if(is_null($servicePush)){

            return null;

        }else{

            $servicePushRowId = $servicePush->row_id;
            $servicePush->delete();
            return $servicePushRowId;
        }
        
    }
    
}