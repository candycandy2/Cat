<?php
/**
 * EmpService ServiceId - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\EmpService_Service_ID;
use DB;

class EmpServiceServiceIDRepository
{

    protected $serviceId;

    public function __construct(EmpService_Service_ID $serviceId)
    {
        $this->serviceId = $serviceId;
    }

    /**
     * get service row_id by service_id and type
     * @param  string $serviceId service_id
     * @return mixed
     */
    public function getServiceRowId($serviceId){
        return $this->serviceId->where('service_id', $serviceId)
                        ->where('active', 'Y')
                        ->first();
    }

    /**
     * insert new emp service
     * @param  Array $data data to be insert
     * @return int
     */
    public function newEmpService($data){
        return $this->serviceId->insertGetId($data);
    }


    /**
     * Get enable service list info by service type, id serviceType is All, 
     * it will return all type of service
     * @param  String $serviceType service type name
     * @return mixed
     */
    public function getServiceByServiceType($serviceType){
        $query =  $this->serviceId->where('active','Y');
        if(strtolower($serviceType) == 'all'){
            $query = $query->orderby('type');
        }else{
            $query = $query->where('type',$serviceType);
        }
        return $query->select('row_id', 'service_id', 'type', 'active')->get();
    }

    /**
     * Get enable service list by service type
     * @param  String $serviceType service type
     * @return mixed
     */
    public function getServiceListByType($serviceType){
        return $this->serviceId
             ->where('type', $serviceType)
             ->where('active','Y')
             ->get();
    }

    /**
     * Delete emp service and get deleted row_id
     * @param  string $serviceId service_id
     * @return mixed
     */
    public function deleteEmpService($serviceId){
        
        $service =  $this->serviceId
                ->where('service_id',$serviceId)
                ->where('active','Y')->first();
        
        if(is_null($service)){
            return null;
        }else{
            $service->active = 'N';
            $service->save();  
            return $service->row_id;
        }

    }
}