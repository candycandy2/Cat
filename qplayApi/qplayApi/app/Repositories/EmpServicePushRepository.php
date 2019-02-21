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
     * insert new service push
     * @param  Array $data data to be insert
     * @return int
     */
    public function addServicePush($data){
        return $this->servicePush->insertGetId($data);
    }
    
}