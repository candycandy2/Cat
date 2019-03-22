<?php
/**
 * QPay Member - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayMemberPointRepository;
use App\Repositories\QPayMemberRepository;
use App\lib\CommonUtil;

class QPayMemberService
{
    protected $qpayMemberPointRepository;
    protected $qpayMemberRepository;

    /**
     * QPayMemberService constructor.
     * @param QPayMemberPointRepository $qpayMemberPointRepository
     * @param QPayMemberRepository $qpayMemberRepository
     */
    public function __construct(QPayMemberPointRepository $qpayMemberPointRepository,
                                QPayMemberRepository $qpayMemberRepository)
    {
        $this->qpayMemberPointRepository = $qpayMemberPointRepository;
        $this->qpayMemberRepository = $qpayMemberRepository;
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

    /**
     * Get QPay mamber list
     * @param  int    $pointType  qpay_point_type.row_id
     * @param  string $department department
     * @param  string $empNo      employee number
     * @param  int    $limit      limit
     * @param  int    $offset     offset
     * @param  string $sort       sort by field
     * @param  string $order      order by
     * @return mixed
     */
    public function getQPayMemberList($pointType, $department, $empNo, $limit, $offset, $sort, $order){
        return $this->qpayMemberRepository
                ->getQPayMemberList($pointType, $department, $empNo, $limit, $offset, $sort, $order);
    }

    /**
     * reset QPay trad password
     * @param  int    $userId reset target qp_user.row_id
     * @return string  ResultCode    
     */
    public function resetTradPassword($userId){

        $userInfo = CommonUtil::getUserInfoByRowId($userId);

        $qpayMember = $this->qpayMemberRepository->getQPayMemberInfo($userId);
        if(is_null($qpayMember)){
            return null;
        }

        $this->qpayMemberRepository->resetTradPassword($qpayMember->row_id, $userInfo->trade_pwd_original);

        return ResultCode::_1_reponseSuccessful;
    }
}