<?php
/**
 * QP_User - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\Repositories\QPayMemberRepository;
use App\Repositories\QPayMemberPointRepository;

class QPayMemberService
{
    protected $qpayMemberRepository;
    protected $qpayMemberPointRepository;

    /**
     * QPayMemberService constructor.
     * @param QPayMemberRepository $qpayMemberRepository
     * @param QPayMemberPointRepository $qpayMemberPointRepository
     */
    public function __construct(QPayMemberRepository $qpayMemberRepository,
                                QPayMemberPointRepository $qpayMemberPointRepository)
    {
        $this->qpayMemberRepository = $qpayMemberRepository;
        $this->qpayMemberPointRepository = $qpayMemberPointRepository;
    }

    /**
     * change QPay trade password For Emp
     * @param  int $userId qp_user.row_id
     * @param  string $oldPwd old password
     * @param  string $newPwd new password
     * @return string  ResultCode    
     */
    public function changeTradePassword($userId, $oldPwd, $newPwd)
    {
        $qpayMember = $this->qpayMemberRepository->getQPayMemberInfo($userId);
        if (is_null($qpayMember)) {
            return ResultCode::_000901_userNotExistError;
        }

        $TradPwd = $qpayMember->trade_password;
        if (!password_verify($oldPwd, $TradPwd)) {
             return ResultCode::_000925_oldTradePasswordIncorrect;
        }
       
        $options = [
            'cost' => '08',
        ];
        $pwd = password_hash($newPwd, PASSWORD_BCRYPT, $options);

        $this->qpayMemberRepository->changeTradePassword($qpayMember->row_id, $pwd);

        return ResultCode::_1_reponseSuccessful;
    }

    /**
     * get point stored record by user
     * @param  int $userId    qp_user.user_id
     * @param  int $startDate start timestamp
     * @param  int $endDate   end timestamp
     * @return array
     */
    public function getStoreRecord($userId, $startDate, $endDate){
        
        $qpayMember = $this->qpayMemberRepository->getQPayMemberInfo($userId);
        if(is_null($qpayMember)){
            return [];
        }

        return $this->qpayMemberPointRepository->getStoreRecord($qpayMember->row_id, $startDate, $endDate);

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
     * login QPay Web
     * @param  emp_no
     * @param  trade_pwd
     * @return mixed
     */
    public function loginQPayWeb($userId, $tradePWD)
    {
        $qpayMemberData = $this->qpayMemberRepository->getQPayMemberInfo($userId);

        if (password_verify($tradePWD, $qpayMemberData["trade_password"])) {
            //Trade Password Valid
            $resultCode = ResultCode::_1_reponseSuccessful;

            $pointNow = $this->qpayMemberPointRepository->getPointNow($userId);
            if (is_null($pointNow)) {
                $pointNow = 0;
            }

            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode),
                "point_now" => $pointNow
            ];
        } else {
            //Trade Password Invalid
            $resultCode = ResultCode::_000929_tradePasswordIncorrect;

            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode)
            ];
        }

        return $result;
    }
}