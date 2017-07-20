<?php
/**
 * 用戶User相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\QP_User;
use DB;

class UserRepository
{
    /** @var User Inject QP_User model */
    protected $user;
    /**
     * UserRepository constructor.
     * @param User $user
     */
    public function __construct(QP_User $user)
    {
        $this->user = $user;
    }

    
    /**
     * 根據login_id修改qp_user表
     * @param  String $loginId    帳號(login_id)
     * @param  Array  $updateData 修改的資料
     */
    public function updateUserByLoginId($loginId ,$updateData){
        return $this->user
        ->where('login_id','=', $loginId)
        ->update($updateData);
    }
    
}