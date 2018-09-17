<?php

namespace App\Repositories;

use App\Model\QPAY_Member;
use DB;

class QPayMemberRepository 
{

    protected $qpayMember;

    public function __construct(QPAY_Member $qpayMember)
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
    public function changeTradPassword($QPayMemberId, $newPwd, $updatedUser, $updatedAt = null){
        if(is_null($updatedAt)){
            $nowTimestamp = time();
            $updatedAt = date('Y-m-d H:i:s',$nowTimestamp);
        }
        $user = $this->qpayMember::find($QPayMemberId);
        $user->trade_password = $newPwd;
        $user->updated_at = $updatedAt;
        $user->updated_user = $updatedUser;
        $user->save();
    }
}
