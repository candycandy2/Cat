<?php
/**
 * QPay Point Store - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Point_Store;
use App\Model\QPay_Member_Point;
use DB;
use Auth;
use Session;

class QPayPointStoreRepository
{

    protected $qpayPointStore;

    /**
     * QPayPointStoreRepository constructor.
     * @param QPay_Point_Store $qpayPointStore
     */
    public function __construct(QPay_Point_Store $qpayPointStore,
                                QPay_Member_Point $qpayMemberPoint)
    {
        $this->qpayPointStore = $qpayPointStore;
        $this->qpayMemberPoint = $qpayMemberPoint;
    }

    /**
     * New Point Store
     * @return latest row_id
     */
    public function newPointStore()
    {
        $now = date('Y-m-d H:i:s',time());

        return  DB::table("qpay_point_store")
                -> insertGetId([
                    'point_type_row_id' => Session::get("pointTypeID"),
                    'file_original' => Session::get("excelFileOriginalName"),
                    'file_saved' => Session::get("excelFileSavedName"),
                    'member_count' => intval(str_replace(',', '', Session::get("excelDataInfo")["empCount"])),
                    'stored_total' => intval(str_replace(',', '', Session::get("excelDataInfo")["pointCount"])),
                    'created_at' => $now,
                    'created_user' => Auth::user()->row_id
                ]);
    }

    /**
     * New Member Point
     * @return latest row_id
     */
    public function newMemberPoint($memberID, $pointStoreID, $points)
    {
        $now = date('Y-m-d H:i:s',time());

        return  DB::table("qpay_member_point")
                -> insertGetId([
                    'member_row_id' => $memberID,
                    'point_store_row_id' => $pointStoreID,
                    'stored_total' => $points,
                    'stored_now' => $points,
                    'stored_used' => 0,
                    'created_at' => $now
                ]);
    }

    /**
     * Get QPay Point Store Record
     * @return mixed
     */
    public function getQPayStoreRecordList($startDate, $endDate){

         return $this->qpayPointStore
                -> join('qp_user', 'qp_user.row_id', '=', 'qpay_point_store.created_user')
                -> join('qpay_point_type', 'qpay_point_type.row_id', '=', 'qpay_point_store.point_type_row_id')
                -> where(DB::raw('UNIX_TIMESTAMP(qpay_point_store.created_at)'),'>=', $startDate)
                -> where(DB::raw('UNIX_TIMESTAMP(qpay_point_store.created_at)'),'<=', $endDate)
                -> select(DB::raw('CONCAT("S", LPAD(qpay_point_store.row_id, 6, 0)) AS store_id'),
                      'qpay_point_type.name as point_type',
                      'qpay_point_store.stored_total as stored_total',
                      'qp_user.login_id as stored_user',
                      'color',
                      'file_saved',
                      'file_original',
                      'member_count',
                      'qpay_point_store.row_id as point_saved_id',
                      'qpay_point_store.created_at as store_time')
                -> get();
    }

    /**
     * Get point store information
     * @param  int $pointStoreId qp_pont_store.row_id
     * @return mixed
     */
    public function getPonintStoreById($pointStoreId){
        return $this->qpayPointStore::find($pointStoreId);
    }

    /**
     * Get QPay Point Stored For Each Employee Record List 
     * @param  int      $pointType  query point type , allow nill
     * @param  int      $startDate  query start date , unix timestamp required
     * @param  int      $endDate    query end date, unix timestamp required
     * @param  string   $department query user department, allow null
     * @param  string   $empNo      query user employee no, allow null
     * @param  int      $limit      the record count limit of one page
     * @param  int      $offset     page offset
     * @param  string   $sort       sort by field
     * @param  string   $order      order
     * @return mixed
     */
    public function getQPayPointGetRecordList($pointType, $startDate, $endDate, $department, $empNo, $limit, $offset, $sort, $order){

        $query = $this->qpayMemberPoint
                ->join('qpay_member','qpay_member.row_id', '=' ,'qpay_member_point.member_row_id')
                ->join('qp_user','qp_user.row_id', '=', 'qpay_member.user_row_id')
                ->join('qpay_point_store','qpay_point_store.row_id', '=', 'qpay_member_point.point_store_row_id')
                ->join('qpay_point_type', 'qpay_point_type.row_id','=', 'qpay_point_store.point_type_row_id')
                -> where(DB::raw('UNIX_TIMESTAMP(qpay_member_point.created_at)'),'>=', $startDate)
                -> where(DB::raw('UNIX_TIMESTAMP(qpay_member_point.created_at)'),'<=', $endDate);
                
                if(!is_null($pointType)){
                    $query = $query->where('qpay_point_store.point_type_row_id',$pointType);
                }

                if(!is_null($department)){
                    $query = $query->where('qp_user.department',$department);
                }

                if(!is_null($empNo)){
                    $query = $query->where('qp_user.emp_no',$empNo);
                }

        $query = $query->orderBy($sort, $order);
        $query = $query->select(DB::raw('CONCAT("S", LPAD(qpay_point_store.row_id, 6, 0)) AS store_id'),
                      'qpay_point_type.name as point_type',
                      'qpay_member_point.stored_total',
                      'qp_user.login_id as stored_user',
                      'qp_user.emp_no as emp_no',
                      'qp_user.emp_name as emp_name',
                      'qp_user.department as department',
                      'qpay_point_type.color as color',
                      'qpay_member_point.created_at as store_time')
                ->Paginate($limit,['*'],null,($offset/$limit)+1);//paginate(rowCount, ['*'], page, current])

        return $query;
    }
}