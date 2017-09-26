<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_QChat_Push_Token extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_qchat_push_token';
    protected $primaryKey = 'row_id';

    /**
     * 不可被批量赋值的属性。
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * 取得此詳細資料的使用者。
     */
    public function user()
    {
        return $this->belongsTo('App\Model\QP_User', 'emp_no');
    }
}