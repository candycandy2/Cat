<?php
/**
 * EmpService Data Log - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\EmpService_Reserve_Record;
use DB;

class EmpServiceReserveRepository
{

    protected $reserveRecord;

    public function __construct(EmpService_Reserve_Record $reserveRecord)
    {
        $this->reserveRecord = $reserveRecord;
    }

    public function newReserve(Array $data){
       return $this->reserveRecord->insertGetId($data);
    }

    /**
     * Get Reserve Record
     * @param  string $serviceId service id
     * @param  int $startDate query start date
     * @param  inr $endDate   query end date
     * @return array
     */
    public function getReserveRecord($serviceId, $startDate, $endDate){
        return $this->reserveRecord
                    ->join('target_id','reserve_record.target_id_row_id','=','target_id.row_id')
                    ->join('service_id','target_id.service_id_row_id','=','service_id.row_id')
                    ->join('data_log','data_log.table_row_id','=','reserve_record.row_id')
                    ->where('target_id.active', 'Y')
                    ->where('service_id', $serviceId)
                    ->where('service_id.active', 'Y')
                    ->where('data_log.table_name','reserve_record')
                    -> where(DB::raw('UNIX_TIMESTAMP(data_log.created_at)'),'>=', $startDate)
                    -> where(DB::raw('UNIX_TIMESTAMP(data_log.created_at)'),'<=', $endDate)
                    ->select('target_id', 'target_id_row_id', 'reserve_record.row_id as reserve_id',
                             'reserve_record.login_id as reserve_login_id','reserve_record.domain as reserve_domain', 
                             'reserve_record.emp_no as reserve_emp_no',
                             'info_push_title', 'info_push_content', 'info_data', DB::raw("unix_timestamp(start_date) as start_date"),
                              DB::raw("unix_timestamp(end_date) as end_date"), DB::raw("IF(complete IS NULL,'N','Y') AS complete"),
                              'complete_login_id','complete_at')
                    ->get();
    }
}
