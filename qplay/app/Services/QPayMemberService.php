<?php
/**
 * QP_User - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayMemberPointRepository;

class QPayMemberService
{
    protected $qpayMemberPointRepository;

    /**
     * QPayMemberService constructor.
     * @param UserRepository $UserRepository
     */
    public function __construct(QPayMemberPointRepository $qpayMemberPointRepository)
    {
        $this->qpayMemberPointRepository = $qpayMemberPointRepository;
    }

    /**
     * get Member Point Now (only this year)
     * @param  user_row_id
     * @return mixed
     */
    public function getPointNow($userRowId){

        $pointNow = $this->qpayMemberPointRepository->getPointNow($userRowId);
        if(is_null($pointNow)){
            return 0;
        }else{
            return $pointNow;
        }
    }
}