<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QM_History extends Model
{   
    protected $connection = 'mysql_qmessage';
    protected $table = 'qm_history';
    protected $primaryKey = 'row_id';
}