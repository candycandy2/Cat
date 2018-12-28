<?php

namespace App\Repositories;

use App\Model\Status_ID;
use DB;

class StatusIDRepository
{

    protected $statusId;

    public function __construct(Status_ID $statusId)
    {   
        $this->statusId = $statusId;
    }

    /**
     * Get status info by status_id.row_id
     * @param  string $statusId status_id.row_id
     * @return mixed
     */
    public function getStatusByStatusId($statusId){
        return $this->statusId
                    ->where('status_id',$statusId)
                    ->where('active','Y')
                    ->first();
    }

    /**
     * New a Status data and get row_id
     * @param  Array $data 
     * @return int
     */
    public function newStatus($data){
        return $this->statusId->insertGetId($data);
    }

    /**
     * Update status by status_id, and get updated status_id.row_id
     * @param  string $statusId status_id
     * @param  Array $data     update data
     * @return int
     */
    public function updateStatus($statusId, $data){
        $status =  $this->statusId
                    ->where('status_id', $statusId)
                    ->where('active','Y')
                    ->first();
        $status->update($data);
        return $status->row_id;
    }
}