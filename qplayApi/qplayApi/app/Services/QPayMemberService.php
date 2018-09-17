<?php
/**
 * QP_User - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayMemberRepository;

class QPayMemberService
{
    protected $qpayMemberRepository;

    /**
     * UserService constructor.
     * @param UserRepository $UserRepository
     */
    public function __construct(QPayMemberRepository $qpayMemberRepository)
    {
        $this->qpayMemberRepository = $qpayMemberRepository;
    }

    /**
     * change QPay trad password
     * @param  int $userId qp_user.row_id
     * @param  string $oldPwd old password
     * @param  string $newPwd new password
     * @return string  ResultCode    
     */
    public function changeTradPassword($userId, $oldPwd, $newPwd, $updatedUser, $updatedAt = null){
        
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

        $this->qpayMemberRepository->changeTradPassword($qpayMember->row_id, $pwd, $updatedUser, $updatedAt);

        return ResultCode::_1_reponseSuccessful;
    }

}