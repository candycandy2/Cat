<?php
/**
 * EmpService Data Log - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\EmpService_Data_Log;
use DB;

class EmpServiceDataLogRepository
{

    protected $dataLog;

    public function __construct(EmpService_Data_Log $dataLog)
    {
        $this->dataLog = $dataLog;
    }

    /**
     * new data log
     * @param  Array $value data
     * @return boolean
     */
    public function newDataLog($data)
    {
        return $this->dataLog
                    ->insert($data);
    }
    
}