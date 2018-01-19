<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Register extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_register';
    protected $primaryKey = 'row_id';

    /**
     * 取得此註冊資訊的使用者。
     */
    public function user()
    {
        return $this->belongsTo('App\Model\QP_User', 'user_row_id');
    }
}