<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QM_History_File extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_history_file';
    protected $primaryKey = 'msg_id';

    /**
     * 不可被批量赋值的属性。
     *
     * @var array
     */
    protected $guarded = [];
}