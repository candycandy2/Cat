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
                    ->where('service_id', $serviceId)
                    ->where('target_id.active', 'Y')
                    ->where('service_id.active', 'Y')
                    ->where('reserve_record.active', 'Y')
                    ->where(DB::raw('UNIX_TIMESTAMP(reserve_record.start_date)'),'>=', $startDate)
                    ->where(DB::raw('UNIX_TIMESTAMP(reserve_record.end_date)'),'<=', $endDate)
                    ->select('target_id', 'target_id_row_id', 'reserve_record.row_id as reserve_id',
                             'reserve_record.login_id as reserve_login_id','reserve_record.domain as reserve_domain', 
                             'reserve_record.emp_no as reserve_emp_no',
                             'info_push_admin_title as info_push_title', 'info_push_admin_content as info_push_content', 'info_data', DB::raw("unix_timestamp(start_date) as start_date"),
                              DB::raw("unix_timestamp(end_date) as end_date"), DB::raw("IF(complete IS NULL,'N','Y') AS complete"),
                              'complete_login_id','complete_at')
                    ->orderby('complete','asc')
                    ->orderby('complete_at','desc')
                    ->orderby('start_date','desc')
                    ->get();
    }

    /**
     * Get target reserve data by target row_id
     * @param  int $targetIdRowId target_id.row_id
     * @param  timestamp $startDate     start date
     * @param  timestamp $endDate       end date
     * @return mixed
     */
    public function getTargetReserveData($targetIdRowId, $startDate, $endDate){
        return $this->reserveRecord
            ->join('target_id','reserve_record.target_id_row_id','=','target_id.row_id')
            ->join('service_id','target_id.service_id_row_id','=','service_id.row_id')
            ->where('target_id.row_id', $targetIdRowId)
            ->where('target_id.active', 'Y')
            ->where('service_id.active', 'Y')
            ->where('reserve_record.active', 'Y')
            ->where(DB::raw('UNIX_TIMESTAMP(reserve_record.start_date)'),'>=', $startDate)
            ->where(DB::raw('UNIX_TIMESTAMP(reserve_record.start_date)'),'<', $endDate)
            ->select('reserve_record.row_id as reserve_id',
                     'reserve_record.login_id as reserve_login_id','reserve_record.domain as reserve_domain', 
                     'reserve_record.emp_no as reserve_emp_no',
                     'info_push_admin_title as info_push_title', 'info_push_admin_content as info_push_content', 'info_data', DB::raw("unix_timestamp(start_date) as start_date"),
                      DB::raw("unix_timestamp(end_date) as end_date"), DB::raw("IF(complete IS NULL,'N','Y') AS complete"),
                      'complete_login_id','complete_at')
            ->orderby('complete','asc')
            ->orderby('complete_at','desc')
            ->orderby('start_date','desc')
            ->get();
    }

    /**
     * Get my reserve by service id
     * @param  string $serviceId service_id.service_id
     * @param  string $empNo     emp_no
     * @param  timestamp $startDate start date
     * @param  timestamp $endDate   end date
     * @return mixed
     */
    public function getMyReserveByServiceID($serviceId, $empNo, $startDate, $endDate){
        return $this->reserveRecord
            ->join('target_id','reserve_record.target_id_row_id','=','target_id.row_id')
            ->join('service_id','target_id.service_id_row_id','=','service_id.row_id')
            ->where('service_id.service_id', $serviceId)
            ->where('reserve_record.emp_no', $empNo)
            ->where('target_id.active', 'Y')
            ->where('service_id.active', 'Y')
            ->where('reserve_record.active', 'Y')
            ->where(DB::raw('UNIX_TIMESTAMP(reserve_record.start_date)'),'>=', $startDate)
            ->where(DB::raw('UNIX_TIMESTAMP(reserve_record.end_date)'),'<=', $endDate)
            ->select('service_id','target_id', 'target_id_row_id', 'reserve_record.row_id as reserve_id',
                     'reserve_record.login_id as reserve_login_id','reserve_record.domain as reserve_domain', 
                     'reserve_record.emp_no as reserve_emp_no',
                     'info_push_emp_title', 'info_push_emp_content', 'info_data', DB::raw("unix_timestamp(start_date) as start_date"),
                      DB::raw("unix_timestamp(end_date) as end_date"), DB::raw("IF(complete IS NULL,'N','Y') AS complete"),
                      'complete_login_id','complete_at')
            ->orderby('start_date','asc')
            ->get();
    }

    /**
     * Get reserve data by reserve row_id
     * @param  int $reserveRowId reserve_record.row_id
     * @return mixed
     */
    public function getReserveByRowID($reserveRowId){
        return $this->reserveRecord::find($reserveRowId);
    }

    /**
     * update reserve by reserve row_id
     * @param  int $reserveRowId reserve_record.row_id
     * @param  Array  $data      update data
     * @return int
     */
    public function updateReserveByRowId($reserveRowId, Array $data){
        return $this->reserveRecord
                    ->where('row_id', $reserveRowId)
                    ->update($data);
    }
    
    /**
     * public reserve
     * @param  Array  $data update data
     * @return mixed
     */
    public function editReserve($reserveRowId, Array $data){

        $reserve = $this->reserveRecord::find($reserveRowId);
        if(is_null($reserve)){
            return null;
        }else{
            return $reserve->update($data);    
        }

    }
}
