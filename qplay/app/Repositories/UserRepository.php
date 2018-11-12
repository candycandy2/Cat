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

    /**
     * Add new QPlay user
     * @param  Array $userData user data
     * @return int   
     */
    public function newUser($userData){
        return $this->user->insertGetId($userData);
    }
    
    /**
     * update specific user status
     * @param  int    $userId qp_user.row_id
     * @param  string $status N|Y
     * @return boolean
     */
    public function updateUserStatus($userId, $status){
        
        $user =  $this->user::find($userId);
        $user->status = $status;

        return $user->save();

    }

    /**
     * Get QPlay user information 
     * @param  int  $userId qp_user.row_id
     * @return mixed
     */
    public function getUserInfo($userId){
        return $this->user
             ->where('row_id', $userId )
             ->select( 'row_id',
                       'login_id',
                       'company',
                       'site_code',
                       'ext_no',
                       'emp_no',
                       'emp_name',
                       'user_domain',
                       'department',
                       'emp_id',
                       'email')
             ->first();
    }

    /**
     * Reset user's QAccount password
     * @param  int $userId qp_user.row_id
     * @param  string $newPwd new pass word
     */
    public function resetQAccountPassword($userId, $newPwd, $updatedUser, $updatedAt = null){
        if(is_null($updatedAt)){
            $nowTimestamp = time();
            $updatedAt = date('Y-m-d H:i:s',$nowTimestamp);
        }
        $user = $this->user::find($userId);
        $user->password = $newPwd;
        $user->change_pwd = 'N';
        $user->updated_at = $updatedAt;
        $user->updated_user = $updatedUser;
        return $user->save();
    }

    /**
     * Update qplay user data
     * @param  int $userId   qp_user.row_id
     * @param  Array $data   user data to be updated
     * @return boolean  update() result
     */
    public function updateUser($userId, $data){

         return $this->user::find($userId)
                     ->update($data);

    }
}