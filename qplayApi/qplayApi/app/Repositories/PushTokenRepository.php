<?php

namespace App\Repositories;

use App\Model\QP_Push_Token;

class PushTokenRepository
{

    protected $pushToken;

    public function __construct(QP_Push_Token $pushToken)
    {   
        $this->pushToken = $pushToken;
    }

    /**
     * delete user session by qp_user.row_id
     * @param Array $RegisterIds 
     */
    function deletePushTokenByUserIds(Array $RegisterIds){
        $this->pushToken->whereIn('register_row_id', $RegisterIds)->delete();
    }
}
