<?php
/**
 * QPay Member - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Member;
use DB;
use Auth;
use Session;

class QPayMemberRepository
{

    protected $qpayMember;

    /**
     * QPayMemberRepository constructor.
     * @param QPay_Member $qpayMember
     */
    public function __construct(QPay_Member $qpayMember)
    {
        $this->qpayMember = $qpayMember;
    }

    /**
     * Check Member Exist
     * @return Exist qpay_member row_id
     */
    public function checkMemberExist($excelEmpNoArray)
    {
        $result = DB::table('qpay_member')
                    -> leftJoin("qp_user", "qp_user.row_id", "=", "qpay_member.user_row_id")
                    -> select('qpay_member.row_id', 'qp_user.emp_no')
                    -> whereIn('qp_user.emp_no', $excelEmpNoArray)
                    -> get();

        $result = array_map(function ($value) {
            return (array) $value;
        }, $result);

        return $result;
    }

    /**
     * New Member
     * @return latest row_id
     */
    public function newMember($userRowID, $tradePWD)
    {
        $now = date('Y-m-d H:i:s',time());

        return  DB::table("qpay_member")
                -> insertGetId([
                    'user_row_id' => $userRowID,
                    'trade_password' => $tradePWD,
                    'created_at' => $now,
                    'created_user' => Auth::user()->row_id
                ]);
    }

}