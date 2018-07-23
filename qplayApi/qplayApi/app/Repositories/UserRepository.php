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
     * @return  int    sync count
     */
    public function syncActiveUser($sourceFrom, $first = false){
        $total =  QP_User_Sync::where('active','Y')->count();
        $limit =  1000;
        $page = ceil($total / $limit);
        $lastUserId = 0;
        $syncCnt = 0;
        for ($i = 1; $i <= $page; $i++) {
            $query = QP_User::where('tmpUsers.active','Y')
                ->join(
                    DB::raw('(SELECT * FROM `qp_user_sync` where row_id > '.$lastUserId.' order by row_id limit '.$limit.') tmpUsers'),
                    function($join)
                    {
                       $join->on('qp_user.emp_no', '=', 'tmpUsers.emp_no');
                    });
            
            if(!$first){
                $query = $query-> where('qp_user.source_from',$sourceFrom);
            }
            $updatedCnt = $query->update([
                'qp_user.login_id' => DB::raw('tmpUsers.login_name'),
                'qp_user.emp_name' => DB::raw('tmpUsers.emp_name'),
                'qp_user.email' => DB::raw('tmpUsers.mail_account'),
                'qp_user.ext_no' => DB::raw('tmpUsers.ext_no'),
                'qp_user.user_domain' => DB::raw('tmpUsers.domain'),
                'qp_user.company' => DB::raw('tmpUsers.company'),
                'qp_user.department' => DB::raw('tmpUsers.dept_code'),
                'qp_user.site_code' => DB::raw('tmpUsers.site_code'),
                'qp_user.deleted_at' => DB::raw('tmpUsers.dimission_date'),
                'qp_user.status' => DB::raw('tmpUsers.active'),
                'qp_user.resign' => DB::raw('IF(tmpUsers.active="N", "Y","N")'),
                'qp_user.source_from' => DB::raw('tmpUsers.source_from')
              ]);
            $lastUserId = $i * $limit;
            $syncCnt = $syncCnt + $updatedCnt;
        }
        return $syncCnt;
    }

    /**
     * Join update qp_user from qp_user sync 
     * @param   string $sourceFrom 
     * @param   string $first  is first time execute
     * @return  int    sync count
     */
    public function syncInactiveUser($sourceFrom, $first = false){
        
        $total =  QP_User_Sync::where('active','N')->count();
        $limit =  1000;
        $page = ceil($total / $limit);
        $lastUserId = 0;
        $syncCnt = 0;
        for ($i = 1; $i <= $page; $i++) {
            $query = QP_User::where('tmpUsers.active','N')
                ->join(
                    DB::raw('(SELECT * FROM `qp_user_sync` where row_id > '.$lastUserId.' order by row_id limit '.$limit.') tmpUsers'),
                    function($join)
                    {
                       $join->on('qp_user.emp_no', '=', 'tmpUsers.emp_no');
                    });
            
            if(!$first){
                $query = $query-> where('qp_user.source_from',$sourceFrom);
            }
            $updatedCnt = $query->update([
                    'qp_user.login_id' => DB::raw('tmpUsers.login_name'),
                    'qp_user.emp_name' => DB::raw('tmpUsers.emp_name'),
                    'qp_user.email' => DB::raw('tmpUsers.mail_account'),
                    'qp_user.ext_no' => DB::raw('tmpUsers.ext_no'),
                    'qp_user.user_domain' => DB::raw('tmpUsers.domain'),
                    'qp_user.company' => DB::raw('tmpUsers.company'),
                    'qp_user.department' => DB::raw('tmpUsers.dept_code'),
                    'qp_user.site_code' => DB::raw('tmpUsers.site_code'),
                    'qp_user.deleted_at' => DB::raw('tmpUsers.dimission_date'),
                    'qp_user.status' => DB::raw('tmpUsers.active'),
                    'qp_user.resign' => DB::raw('IF(tmpUsers.active="N", "Y","N")'),
                    'qp_user.source_from' => DB::raw('tmpUsers.source_from')
                  ]);
            $lastUserId = $i * $limit;
            $syncCnt = $syncCnt + $updatedCnt;
        }
        return $syncCnt;       
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
