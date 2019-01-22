<?php

namespace App\Repositories;
use App\Model\QP_User;
use App\Model\QP_User_Sync;
use DB;
use Config;

class UserSyncRepository
{

    protected $userSync;
    protected $user;

    public function __construct(QP_User_Sync $userSync, QP_User $user)
    {   
        $this->userSync = $userSync;
        $this->user = $user;
    }

    /**
     * truncat qp_user_sync table
     */
    public function truncatUser(){
        $this->userSync->truncate();
    }

     /**
     * insert mulitple data in to qp_user_sync table
     */
    public function insertUserSync(Array $data){
        $this->userSync->insert($data);
    }

    /**
     * get user list from qp_user_sync which is not exist qp_user
     * @param string $sourceFrom source from, ex:flower|qcsflower|ehr|partner
     * @return Array
     */
    public function getNewUser($sourceFrom){
        
         $select =  $this->userSync->whereNotIn('emp_no', function($query) use ($sourceFrom) {
                        $query = $query->select('emp_no')->from('qp_user');
                    })->select(['login_name as login_id',
                                  'emp_no',
                                  'emp_name',
                                  'mail_account as email',
                                  'ext_no',
                                  'domain as user_domain',
                                  'company',
                                  'dept_code as department',
                                  'site_code',
                                  'active as status',
                                  'source_from as source_from',
                                  DB::raw('now() as created_at'),
                                  DB::raw('IF(qp_user_sync.active="N", "Y","N") as resign'),
                                  DB::raw('-1 as created_user')])->get()->toArray();
        return $select;
    }

     /**
     * get all resign user data by this time
     * @return array
     */
    public function getResignUser(){
        return  $this->userSync
                    ->where('qp_user_sync.active','N')
                    ->join('qp_user', 'qp_user_sync.emp_no', '=', 'qp_user.emp_no')
                    ->select('qp_user.row_id as user_row_id')->get();
    }

    /**
     * Get data from `qp_ehr_user` where active=Y
     * @return array
     */
    public function getEHRActiveUser()
    {
        $result = $this->userSync
                    -> where('active', '=', 'Y')
                    -> select()
                    -> get() 
                    -> toArray();
        $result = array_map(function ($value) {
            return (array) $value;
        }, $result);

        return $result;
    }

    /**
     * Get all data from `qp_ehr_user`
     * @return array
     */
    public function getEHRAllUser()
    {
        $result = $this->userSync
                    -> select()
                    -> get()
                    -> toArray();
        $result = array_map(function ($value) {
            return (array) $value;
        }, $result);

        return $result;
    }

    /**
     * Get all emp_no from `qp_user`
     * @return array
     */
    public function getAllEmpNumber()
    {
        $result =$this->user
                    -> select('emp_no')
                    -> get()
                    -> toArray();
        $result = array_map(function ($value) {
            return (array) $value;
        }, $result);

        return $result;
    }

    /**
     * Insert Data Into `qp_user` from `qp_ehr_user`
     * @return Insert row_id
     */
    public function insertUserFromEHR($data)
    {
        return $this->user
                 -> insertGetId($data);
    }

    /**
     * Update Data in `qp_user` from `qp_ehr_user`
     */
    public function updateUserFromEHR($empNO, $data)
    {
        $this->user
          -> where("emp_no", "=", $empNO)
          -> update($data);
    }

    /**
     * Get data from `qp_user` by emp_no array
     * @return array
     */
    public function getUserByEmpNO($empNOArray)
    {
        $result = $this->user
                    -> whereIn('emp_no', $empNOArray)
                    -> select()
                    -> get()
                    -> toArray();
        $result = array_map(function ($value) {
            return (array) $value;
        }, $result);

        return $result;
    }

     /**
     * Join update qp_user from qp_user sync 
     * @param   string $sourceFrom 
     * @return  int    sync count
     */
    public function syncActiveUser($sourceFrom){
        $total =  $this->userSync->count();
        $limit =  1000;
        $page = ceil($total / $limit);
        $lastUserId = 0;
        $syncCnt = 0;
        for ($i = 1; $i <= $page; $i++) {
            $query = $this->user->where('tmpUsers.active','Y')
                ->join(
                    DB::raw('(SELECT * FROM `qp_user_sync` where row_id > '.$lastUserId.' order by row_id limit '.$limit.') tmpUsers'),
                    function($join)
                    {
                       $join->on('qp_user.emp_no', '=', 'tmpUsers.emp_no');
                    });
            
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
                'qp_user.source_from' => DB::raw('tmpUsers.source_from'),
                'qp_user.updated_at' => '-1'
              ]);
            $lastUserId = $i * $limit;
            $syncCnt = $syncCnt + $updatedCnt;
        }
        return $syncCnt;
    }

    /**
     * Join update qp_user from qp_user sync 
     * @param   string $sourceFrom 
     * @return  int    sync count
     */
    public function syncInactiveUser($sourceFrom){
        
        $total =  $this->userSync->count();
        $limit =  1000;
        $page = ceil($total / $limit);
        $lastUserId = 0;
        $syncCnt = 0;
        for ($i = 1; $i <= $page; $i++) {
            $query = $this->user->where('tmpUsers.active','N')
                ->join(
                    DB::raw('(SELECT * FROM `qp_user_sync` where row_id > '.$lastUserId.' order by row_id limit '.$limit.') tmpUsers'),
                    function($join)
                    {
                       $join->on('qp_user.emp_no', '=', 'tmpUsers.emp_no');
                    });
            
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
                    'qp_user.source_from' => DB::raw('tmpUsers.source_from'),
                    'qp_user.updated_at' => '-1'
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
        return $this->user->whereIn('emp_no', function($query){
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

    /**
     * Get user which not been updated today in specific sources
     * @return mixed
     */
    public function getUserNotUpdateToday($sourceAll){
        $today = date('Y-m-d 00:00:00',time());
        return $this->user->where('updated_at', '<', $today)
                   ->where('resign', '=', 'N')
                   ->whereIn('source_from', $sourceAll)
                   ->select('row_id')
                   ->get();

    }

    /**
     * Update `qp_user` with data where in userRowIdList 
     * @param  Array $UserRowIdList [description]
     * @param  Array $data          [description]
     * @return [type]                [description]
     */
    public function updateUserInUserRowIdList($UserRowIdList, $data){
        $this->user->whereIn('row_id',$UserRowIdList)
                    ->update($data);
    }
}

