<?php
/**
 * QP_User - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayMemberRepository;
use App\Repositories\QPayMemberPointRepository;
use App\Repositories\PasswordLogRepository;

class QPayMemberService
{
    protected $qpayMemberRepository;
    protected $qpayMemberPointRepository;
    protected $passwordLogRepository;

    const PWD_TYPE_QPAY = 'qpay';
    const PWD_ACTION_CHANGE = 'change';

    /**
     * QPayMemberService constructor.
     * @param UserRepository $UserRepository
     */
    public function __construct(QPayMemberRepository $qpayMemberRepository,
                                QPayMemberPointRepository $qpayMemberPointRepository,
                                PasswordLogRepository $passwordLogRepository)
    {
        $this->qpayMemberRepository = $qpayMemberRepository;
        $this->qpayMemberPointRepository = $qpayMemberPointRepository;
        $this->passwordLogRepository = $passwordLogRepository;
    }

    /**
     * change QPay trad password
     * @param  int $userId qp_user.row_id
     * @param  string $oldPwd old password
     * @param  string $newPwd new password
     * @return string  ResultCode    
     */
    public function changeTradPassword($userId, $oldPwd, $newPwd){
        
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);

        $qpayMember = $this->qpayMemberRepository->getQPayMemberInfo($userId);
        if(is_null($qpayMember)){
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

        $this->qpayMemberRepository->changeTradPassword($qpayMember->row_id, $pwd);

        $this->passwordLogRepository->writePasswordLog($userId, self::PWD_TYPE_QPAY, self::PWD_ACTION_CHANGE, $userId, $now);
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
}