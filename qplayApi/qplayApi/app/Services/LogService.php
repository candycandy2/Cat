<?php
/**
 * Log - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\PasswordLogRepository;

class LogService
{
    
    const PWD_TYPE_QACCOUNT = 'qaccount';
    const PWD_TYPE_QPAY = 'qpay';
    const PWD_ACTION_CHANGE = 'change';
    const PWD_ACTION_RESET = 'reset';
    
    protected $passwordLogRepository;

    /**
     * LogService constructor.
     * @param FunctionRepository $passwordLogRepository
     */
    public function __construct(PasswordLogRepository $passwordLogRepository)
    {
        $this->passwordLogRepository = $passwordLogRepository;
    }

    /**
     * write password log
     * @param  int $userId          to be updated qp_user.row_id
     * @param  string $type         password type : qaccount | qpay
     * @param  string $action       change | reset
     * @param  int $createdUser     created user_row_id
     * @param  int $createdAt       created time, default now
     */
    public function writePasswordLog($userId, $type, $action, $createdUser, $createdAt = null){
        $this->passwordLogRepository->writePasswordLog($userId, $type, $action, $createdUser, $createdAt);
    }
}