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

}
