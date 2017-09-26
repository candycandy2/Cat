<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Friend_Matrix extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_friend_matrix';
    protected $primaryKey = 'row_id';

     /**
     * 取得此交友狀況的使用者。
     */
    public function user()
    {
        return $this->belongsTo('App\Model\QP_User', 'from_emp_no');
    }
}