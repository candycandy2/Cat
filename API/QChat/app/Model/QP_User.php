<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_User extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_user';
    protected $primaryKey = 'row_id';

    /**
     * 取得與指定使用者的註冊紀錄。
    */
    public function register()
    {
       return $this->hasMany('App\Model\QP_Register', 'user_row_id', 'row_id');
    }

    /**
     * 取得與指定使用者的詳細資料。
     */
    public function qchatUserDetail()
    {
        return $this->hasOne('App\Model\QP_QChat_User_Detail', 'emp_no', 'row_id');
    }

    /**
     * 取得與指定使用者的保護資訊。
     */
    public function protect()
    {
        return $this->hasOne('App\Model\QP_Protect_User', 'emp_no');
    }

    /**
     * 取得與指定使用者的交友狀況。
    */
    public function friendMatrix()
    {
       return $this->hasMany('App\Model\QP_Friend_Matrix', 'target_emp_no', 'row_id');
    }
}