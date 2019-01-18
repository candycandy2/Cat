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
     * Login for QAccount
     * @return mixed
     */
    public function QAccountLogin($account)
    {
        $result = DB::table("qp_user")
                    -> where('emp_no', "=", $account)
                    -> select()
                    -> get();

        return $result;
    }

    /**
     * get  user's QAccount password by user_ow_id
     * @param  int $userId qp_user.row_id
     * @return mixed
     */
    public function getUserQAccountPwd($userId){
        $res =  $this->user
                ->where('row_id',$userId)
                ->select('password')
                ->first();
        return $res->password;
    }

    /**
     * update user's QAccount password
     * @param  int $userId qp_user.row_id
     * @param  string $newPwd new pass word
     */
    public function changeQAccountPassword($userId, $newPwd, $updatedUser, $updatedAt = null){
        if(is_null($updatedAt)){
            $nowTimestamp = time();
            $updatedAt = date('Y-m-d H:i:s',$nowTimestamp);
        }
        $user = $this->user::find($userId);
        $user->password = $newPwd;
        $user->change_pwd = 'Y';
        $user->updated_at = $updatedAt;
        $user->updated_user = $updatedUser;
        $user->save();
    }
}
