<?php

namespace App\Repositories;

use App\Model\QPAY_Member_Point;
use DB;

class QPayMemberPointRepository 
{

    protected $qpayMemberPoint;

    public function __construct(QPAY_Member_Point $qpayMemberPoint)
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
             ->select('qpay_point_store.row_id as store_id',
                      'qpay_point_type.name as poiny_type',
                      'qpay_member_point.stored_total',
                      'qpay_member_point.created_at as store_time')
             ->where('qpay_member_point.member_row_id', $memberId)
             ->where(DB::raw('UNIX_TIMESTAMP(qpay_member_point.created_at)'),'>=', $startDate)
             ->where(DB::raw('UNIX_TIMESTAMP(qpay_member_point.created_at)'),'<=', $endDate)
             ->get();
        return $storeRecord;

    }
}
