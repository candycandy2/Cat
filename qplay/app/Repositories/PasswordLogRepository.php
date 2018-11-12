<?php

namespace App\Repositories;

use App\Model\QP_Password_Log;

class PasswordLogRepository
{

    protected $passwordLog;

    public function __construct(QP_Password_Log $passwordLog)
    {   
        $this->passwordLog = $passwordLog;
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

        if(is_null($createdAt)){
            $nowTimestamp = time();
            $createdAt = date('Y-m-d H:i:s',$nowTimestamp);
        }

        $log = new QP_Password_Log();
        $log->timestamps = false;
        $log->user_row_id = $userId;
        $log->type = $type;
        $log->action = $action;
        $log->created_user = $createdUser;
        $log->created_at = $createdAt;
        $log->save();

    }    
}
