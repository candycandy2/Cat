<?php
/**
 * 用戶User相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\QP_User;
use App\Model\EN_Usergroup;
use DB;

class UserRepository
{
    /** @var User Inject QP_User model */
    protected $user;
    protected $userGroup;
    /**
     * UserRepository constructor.
     * @param User $user
     */
    public function __construct(QP_User $user, EN_Usergroup $userGroup)
    {
        $this->user = $user;
        $this->userGroup = $userGroup;
    }

    /**
     * 取得使用者所屬角色
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getUserAuth($empNo){
        
        $ensDataBaseName = \Config::get('database.connections.mysql.database');
        $userTableName = $this->user->getTableName();

        return $this->user
            ->where('en_usergroup.emp_no', '=', (string)$empNo)
            ->join( $ensDataBaseName . '.en_usergroup as en_usergroup', $userTableName . '.emp_no', '=', 'en_usergroup.emp_no')
            ->select('usergroup')
            ->get();

    }

    /**
     * 依員工編號取得使用者資訊
     * @param  Array  $empNoArr 員工編號清單
     * @return mixed
     */
    public function getUserInfoByEmpNo(Array $empNoArr){

         return $this->user
         ->whereIn('emp_no', $empNoArr)
         ->select('row_id','login_id','ext_no','email','emp_no','user_domain')
         ->orderBy('login_id','asc')
         ->get();
    }

    /**
     * 依員工帳號取得使用者資訊
     * @param  String  $loginId 員工帳號
     * @return mixed
     */
    public function getUserInfoByLoginId($loginId){
         return $this->user
         ->where('login_id','=', $loginId)
         ->select('row_id','login_id','ext_no','email','emp_no','user_domain','register_message')
         ->orderBy('login_id','asc')
         ->first();
    }

    /**
     * 查找en_user_group表，若存在此表有特殊權限
     * @return mixed
     */
    public function getSuperUser(){
        return $this->userGroup
         ->select('emp_no')
         ->get();
    }

    public function updateUserByLoginId($loginId ,$updateData){
        return $this->user
        ->where('login_id','=', $loginId)
        ->update($updateData);
    }

    public function getSuperUserLoginId(){

        $ensDataBaseName = \Config::get('database.connections.mysql.database');
        $userTableName = $this->user->getTableName();

        return $this->user
            ->where($userTableName . '.register_message', '=', 'N')
            ->join( $ensDataBaseName . '.en_usergroup as en_usergroup', $userTableName . '.emp_no', '=', 'en_usergroup.emp_no')
            ->distinct('login_id')->select('login_id')
            ->get();

    }
}