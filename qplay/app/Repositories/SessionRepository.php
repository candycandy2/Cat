<?php
/**
 * Session的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Session;
use App\lib\CommonUtil;

class SessionRepository
{
    protected $session;

     /*
     * SessionRepository constructor.
     * @param QP_Session $session
     */
    public function __construct(QP_Session $session)
    {     
        $this->session = $session;
    }

    public function getSessionDetail(){
        return $this->session
        ->join('qp_user', 'qp_session.user_row_id', '=', 'qp_user.row_id')
        ->join('qp_register', 'qp_session.uuid', '=', 'qp_register.uuid')
        ->where('qp_session.token_valid_date','>',time())
        ->select(\DB::raw("COUNT(DISTINCT qp_session.uuid) as count"),
            'device_type','company','site_code','department',
            'qp_session.user_row_id as user_row_id')
        ->groupBy('qp_session.user_row_id')
        ->get();
    }
}