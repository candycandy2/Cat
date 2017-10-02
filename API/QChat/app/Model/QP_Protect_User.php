<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Protect_User extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_protect_user';
    protected $primaryKey = 'row_id';

    /**
     * 取得此保護資料的使用者。
     */
    public function user()
    {
        return $this->belongsTo('App\Model\QP_User', 'emp_no');
    }
}