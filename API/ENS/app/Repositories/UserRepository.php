<?php
/**
 * 用戶User相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_User;
use App\Model\EN_Usergroup;
use DB;

class UserRepository
{
    /** @var User Inject En_User model */
    protected $user;
    protected $userGroup;
    /**
     * UserRepository constructor.
     * @param User $user
     */
    public function __construct(EN_User $user, EN_Usergroup $userGroup)
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

        return $this->user
            ->where('en_usergroup.emp_no', '=', (string)$empNo)
            ->join( 'en_usergroup', 'en_user.emp_no', '=', 'en_usergroup.emp_no')
            ->select('usergroup')
            ->get();

    }

    /**
     * 依員工編號取得使用者資訊
     * @param  Array  $empNoArr 員工編號清單
     * @return mixed
     */
    public function getUserInfoByEmpNO(Array $empNoArr){
         return $this->user
         ->whereIn('emp_no', $empNoArr)
         ->select('row_id','login_id','ext_no','email','emp_no','user_domain')
         ->get();
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
}