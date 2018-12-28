<?php
/**
 * Status Log - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\StatusLogRepository;

class StatusLogService
{

    protected $statusLogRepository;

    public function __construct(StatusLogRepository $statusLogRepository)
    {
        $this->statusLogRepository = $statusLogRepository;
    }

    /**
     * new status log
     * @param  Array $data  log data to be insert
     * @return boolean
     */
    public function newStatusLog($data){
        return $this->statusLogRepository->newStatusLog($data);
    }
}