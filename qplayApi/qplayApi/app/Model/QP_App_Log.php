<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_APP_Log extends Model
{   
    protected $connection = 'mysql';
    protected $table = 'qp_app_log';
    protected $primaryKey = 'row_id';
}