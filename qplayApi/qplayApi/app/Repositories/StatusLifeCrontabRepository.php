<?php

namespace App\Repositories;

use App\Model\Status_Life_Crontab;
use DB;

class StatusLifeCrontabRepository
{

    protected $statusLifeCrontab;

    public function __construct(Status_Life_Crontab $statusLifeCrontab)
    {   
        $this->statusLifeCrontab = $statusLifeCrontab;
    }

    /**
     * New a status life crontab and get it's row_id
     * @param  Array $data insert data
     * @return int
     */
    public function newStatusLifeCrontab($data){
        return $this->statusLifeCrontab->insertGetId($data);
    }

    /**
     * Get specific status life crontab by row_id
     * @param  string $statusId status_id
     * @param  int $statusLifeCrontabRowId status_life_crontab.row_id
     * @return mixed
     */
    public function getStatusLifeCrontabByRowId($statusId, $statusLifeCrontabRowId){
        return $this->statusLifeCrontab
                    ->join('status_id','status_id.row_id','=','status_life_crontab.status_id_row_id')
                    ->where('status_id.status_id', $statusId)
                    ->where('status_life_crontab.row_id', $statusLifeCrontabRowId)
                    ->where('status_life_crontab.active','Y')
                    ->where('status_id.active','Y')
                    ->select('status_id', 'type as status_type',
                             'status','life_type','life_start','life_end','crontab')
                    ->get();
    }

    /**
     * Update specific status life crontab by row_id
     * @param  int   $statusLifeCrontabRowId status_life_crontab.row_id
     * @param  Array $data                   update data
     * @return mixed
     */
    public function updateStatusLifeCrontab($statusLifeCrontabRowId, $data){
        return $this->statusLifeCrontab
                    ->where('row_id', $statusLifeCrontabRowId)
                    ->update($data);
    }

    /**
     * get specific id type assiocate life cron tab 
     * @param  string $statusId   status id
     * @return mixed
     */
    public function getLifeCrontabByStatusID($statusId){

        return $this->statusLifeCrontab
                    ->join('status_id', 'status_life_crontab.status_id_row_id', '=', 'status_id.row_id')
                    ->where('status_id.status_id', $statusId)
                    ->where('status_life_crontab.active', 'Y')
                    ->where('status_id.active', 'Y')
                    ->select('status_id as status_id','status_id.row_id as status_id_row_id','status_id.type as status_type', 'status_life_crontab.row_id as life_crontab_row_id',
                            'status', 'life_type', 'life_start', 'life_end', 'crontab')
                    ->get();
    }

    /**
     * get specific status type assiocate life cron tab 
     * @param  string $statusType status type
     * @return mixed
     */
    public function getLifeCrontabByStatusType($statusType){

         return $this->statusLifeCrontab
                    ->join('status_id', 'status_life_crontab.status_id_row_id', '=', 'status_id.row_id')
                    ->where('status_id.type',$statusType)
                    ->where('status_life_crontab.active', 'Y')
                    ->where('status_id.active', 'Y')
                    ->select('status_id as status_id', 'status_id.row_id as status_id_row_id','status_id.type as status_type', 'status_life_crontab.row_id as life_crontab_row_id',
                            'status', 'life_type', 'life_start', 'life_end', 'crontab')
                    ->get();
    }

}