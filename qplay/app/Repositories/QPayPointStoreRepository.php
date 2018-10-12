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
    public function __construct(QPay_Point_Store $qpayPointStore)
    {
        $this->qpayPointStore = $qpayPointStore;
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
     * get point store information
     * @param  int $pointStoreId qp_pont_store.row_id
     * @return mixed
     */
    public function getPonintStoreById($pointStoreId){
        return $this->qpayPointStore::find($pointStoreId);
    }

}