<?php

namespace App\Repositories;

use App\Model\QP_User_Sync;
use App\Model\QP_EHR_User;
use DB;
use Config;

class UserSyncRepository
{

    protected $userSync;

    public function __construct(QP_User_Sync $userSync)
    {   
        $this->userSync = $userSync;
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
    public function insertUser(Array $data){
        $this->userSync->insert($data);
    }

    /**
     * get user list from qp_user_sync which is not exist qp_user
     * @param string $sourceFrom source from, ex:flower|qcsflower|ehr|partner
     * @param  boolean $first  is first time execute 
     * @return Array
     */
    public function getNewUser($sourceFrom, $first=false){
        
         $select =  $this->userSync->whereNotIn('emp_no', function($query) use ($sourceFrom, $first) {
                        $query = $query->select('emp_no')->from('qp_user');
                        if(!$first){
                            $query = $query->where('source_from',$sourceFrom);
                        }
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
                                  'ad_flag as ad_flag',
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
        $result = DB::connection('mysql_dev')
                    -> table('qp_ehr_user')
                    -> where('active', '=', 'Y')
                    -> get();
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
        $result = DB::connection('mysql_dev')
                    -> table('qp_ehr_user')
                    -> get();
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
        $result = DB::connection('mysql_'.Config::get('app.env'))
                    -> table('qp_user')
                    -> select('emp_no')
                    -> get();
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
        return DB::connection('mysql_'.Config::get('app.env'))
                 -> table("qp_user")
                 -> insertGetId($data);
    }

    /**
     * Update Data in `qp_user` from `qp_ehr_user`
     */
    public function updateUserFromEHR($empNO, $data)
    {
        DB::connection('mysql_'.Config::get('app.env'))
          -> table("qp_user")
          -> where("emp_no", "=", $empNO)
          -> update($data);
    }

    /**
     * Get data from `qp_user` by emp_no array
     * @return array
     */
    public function getUserByEmpNO($empNOArray)
    {
        $result = DB::connection('mysql_'.Config::get('app.env'))
                    -> table('qp_user')
                    -> whereIn('emp_no', $empNOArray)
                    -> get();
        $result = array_map(function ($value) {
            return (array) $value;
        }, $result);

        return $result;
    }

}

