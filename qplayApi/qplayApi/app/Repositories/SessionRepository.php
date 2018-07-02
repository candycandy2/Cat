<?php

namespace App\Repositories;

use App\Model\QP_Session;

class SessionRepository
{

    protected $session;

    public function __construct(QP_Session $session)
    {   
        $this->session = $session;
    }

    /**
     * delete user session by qp_user.row_id
     * @return int
     */
    function deleteSessionByUserIds(Array $Users){
        return $this->session->whereIn('user_row_id', $Users)->delete();
    }
}
