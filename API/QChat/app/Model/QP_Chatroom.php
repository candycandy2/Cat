<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Chatroom extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_chatroom';
    protected $primaryKey = 'row_id';

    /**
     * 不可被批量赋值的属性。
     *
     * @var array
     */
    protected $guarded = [];
}