<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_API_Log extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_qchat_api_log';
    protected $primaryKey = 'row_id';
}