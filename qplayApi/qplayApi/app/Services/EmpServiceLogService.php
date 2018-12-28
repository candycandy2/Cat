<?php
/**
 * Data Log - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceDataLogRepository;

class EmpServiceLogService
{

    protected $dataLogRepository;

    public function __construct(EmpServiceDataLogRepository $dataLogRepository)
    {
        $this->dataLogRepository = $dataLogRepository;
    }

    /**
     * new data log
     * @param  Array $data  log data to be insert
     * @return boolean
     */
    public function newDataLog($data){
        return $this->dataLogRepository->newDataLog($data);
    }
}