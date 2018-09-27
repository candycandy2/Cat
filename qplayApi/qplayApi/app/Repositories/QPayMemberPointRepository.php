<?php

namespace App\Repositories;

use App\Model\QPay_Member_Point;
use DB;

class QPayMemberPointRepository 
{
    protected $qpayMemberPoint;

    public function __construct(QPay_Member_Point $qpayMemberPoint)
    {   
        $this->qpayMemberPoint = $qpayMemberPoint;
    }
    
    /**
     * get enable point type list
     * @param  int $userId qp_user.row_id
     * @return mixed
     */
    public function getStoreRecord($memberId, $startDate, $endDate){

        $storeRecord = $this->qpayMemberPoint
             ->join('qpay_point_store',
                'qpay_point_store.row_id','=','qpay_member_point.point_store_row_id')
             ->join('qpay_point_type',
                    'qpay_point_store.point_type_row_id','=','qpay_point_type.row_id')
             ->select(DB::raw('CONCAT("S", LPAD(qpay_point_store.row_id, 6, 0)) AS store_id'),
                      'qpay_point_type.name as poiny_type',
                      'qpay_member_point.stored_total',
                      'qpay_member_point.created_at as store_time')
             ->where('qpay_member_point.member_row_id', $memberId)
             ->where(DB::raw('UNIX_TIMESTAMP(qpay_member_point.created_at)'),'>=', $startDate)
             ->where(DB::raw('UNIX_TIMESTAMP(qpay_member_point.created_at)'),'<=', $endDate)
             ->orderby('qpay_member_point.created_at','desc')
             ->get();
        return $storeRecord;

    }

    /**
     * get Member Point Now (only this year)
     * @param  user_row_id
     * @return mixed
     */
    public function getPointNow($userRowID)
    {
        $result = $this->qpayMemberPoint
                    -> leftJoin("qpay_member", "qpay_member.row_id", "=", "qpay_member_point.member_row_id")
                    -> where("qpay_member.user_row_id", "=", $userRowID)
                    -> whereYear("qpay_member_point.created_at", "=", date("Y"))
                    -> sum("qpay_member_point.stored_now");

        return $result;
    }

    /**
     * get Member Point Data (only this year)
     * @param  user_row_id
     * @return mixed
     */
    public function getPointData($userRowID)
    {
        $result = $this->qpayMemberPoint
                    -> leftJoin("qpay_member", "qpay_member.row_id", "=", "qpay_member_point.member_row_id")
                    -> select("qpay_member_point.*")
                    -> where("qpay_member.user_row_id", "=", $userRowID)
                    -> whereYear("qpay_member_point.created_at", "=", date("Y"))
                    -> orderBy("qpay_member_point.created_at")
                    -> get();

        return $result;
    }

    /**
     * update Member Point Data
     * @param  user_row_id
     * @return mixed
     */
    public function updatePointData($memberPointRowID, $newStoredNow,  $newStoredUsed)
    {
        $result = $this->qpayMemberPoint
                    -> where("row_id", "=", $memberPointRowID)
                    -> update([
                        "stored_now" => $newStoredNow,
                        "stored_used" => $newStoredUsed
                    ]);

        return $result;
    }
}
