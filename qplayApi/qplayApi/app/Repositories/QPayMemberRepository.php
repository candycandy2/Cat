<?php

namespace App\Repositories;

use App\Model\QPay_Member;
use DB;

class QPayMemberRepository 
{

    protected $qpayMember;

    public function __construct(QPay_Member $qpayMember)
    {   
        $this->qpayMember = $qpayMember;
    }
    
    /**
     * get QPay member infomation by user_ow_id
     * @param  int $userId qp_user.row_id
     * @return mixed
     */
    public function getQPayMemberInfo($userId){
        $qpayMember =  $this->qpayMember
                ->where('user_row_id',$userId)
                ->select('row_id','trade_password')
                ->first();
        return $qpayMember;
    }

    /**
     * update user's QPay trad password
     * @param  int $QPayMemberId qpay_member.row_id
     * @param  string $newPwd new pass word
     */
    public function changeTradPassword($QPayMemberId, $newPwd){

        $user = $this->qpayMember::find($QPayMemberId);
        $user->trade_password = $newPwd;
        $user->timestamps = false;
        $user->save();

    }
}
