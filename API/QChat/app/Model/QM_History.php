<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QM_History extends Model
{   
    protected $connection = 'mysql_qmessage';
    protected $table = 'qm_history';
    protected $primaryKey = 'msg_id';

    /**
     * 不可被批量赋值的属性。
     *
     * @var array
     */
    protected $guarded = [];
}