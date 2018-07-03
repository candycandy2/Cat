<?php

namespace App\Repositories;

use App\Model\QP_User;
use App\Model\QP_User_Sync;
use App\Model\QP_Resign;
use DB;

class UserRepository
{

    protected $user;

    public function __construct(QP_User $user)
    {   
        $this->user = $user;
    }

    /**
     * Join update qp_user from qp_user sync 
     * @param   string $sourceFrom 
     * @param   string $first  is first time execute
     * @return  mixed
     */
    public function syncActiveUser($sourceFrom, $first = false){
        $query = QP_User::where('qp_user_sync.active','Y')
                ->join('qp_user_sync','qp_user.emp_no', "=", 'qp_user_sync.emp_no');
        if(!$first){
            $query = $query-> where('qp_user.source_from',$sourceFrom);
        }  
        return $query->update([
                'qp_user.login_id' => DB::raw('qp_user_sync.login_name'),
                'qp_user.emp_name' => DB::raw('qp_user_sync.emp_name'),
                'qp_user.email' => DB::raw('qp_user_sync.mail_account'),
                'qp_user.ext_no' => DB::raw('qp_user_sync.ext_no'),
                'qp_user.user_domain' => DB::raw('qp_user_sync.domain'),
                'qp_user.company' => DB::raw('qp_user_sync.company'),
                'qp_user.department' => DB::raw('qp_user_sync.dept_code'),
                'qp_user.site_code' => DB::raw('qp_user_sync.site_code'),
                'qp_user.deleted_at' => DB::raw('qp_user_sync.dimission_date'),
                'qp_user.status' => DB::raw('qp_user_sync.active'),
                'qp_user.resign' => DB::raw('IF(qp_user_sync.active="N", "Y","N")'),
                'qp_user.source_from' => DB::raw('qp_user_sync.source_from')
              ]);
        
    }

    /**
     * Join update qp_user from qp_user sync 
     * @param   string $sourceFrom 
     * @param   string $first  is first time execute
     * @return  mixed
     */
    public function syncInactiveUser($sourceFrom, $first = false){
        $query = QP_User::where('qp_user_sync.active','N')
                ->join('qp_user_sync','qp_user.emp_no', "=", 'qp_user_sync.emp_no');
        if(!$first){
            $query = $query-> where('qp_user.source_from',$sourceFrom);
        }  
        return $query->update([
                'qp_user.login_id' => DB::raw('qp_user_sync.login_name'),
                'qp_user.emp_name' => DB::raw('qp_user_sync.emp_name'),
                'qp_user.email' => DB::raw('qp_user_sync.mail_account'),
                'qp_user.ext_no' => DB::raw('qp_user_sync.ext_no'),
                'qp_user.user_domain' => DB::raw('qp_user_sync.domain'),
                'qp_user.company' => DB::raw('qp_user_sync.company'),
                'qp_user.department' => DB::raw('qp_user_sync.dept_code'),
                'qp_user.site_code' => DB::raw('qp_user_sync.site_code'),
                'qp_user.deleted_at' => DB::raw('qp_user_sync.dimission_date'),
                'qp_user.status' => DB::raw('qp_user_sync.active'),
                'qp_user.resign' => DB::raw('IF(qp_user_sync.active="N", "Y","N")'),
                'qp_user.source_from' => DB::raw('qp_user_sync.source_from')
              ]);
        
    }

    /**
     * get same emp_no and not resign user from qp_user
     * @return mixed
     */
    public function getDuplicatedUser(){
        return QP_User::whereIn('emp_no', function($query){
                                            $query->groupBy('emp_no')
                                            ->having(DB::raw('count(emp_no)') , '>', 1)
                                            ->where('resign','N')
                                            ->select('emp_no')
                                            ->from('qp_user');
                                        })->orderBy('emp_no')->get();
    }

    /**
     * insert mulitple data in to qp_user table
     */
    public function insertUser(Array $data){
        $this->user->insert($data);
    }
}
