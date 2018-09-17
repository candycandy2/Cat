<?php
/**
 * QPay Point Store - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Point_Store;
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

}