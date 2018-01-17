<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QS_API_Log extends Model
{   
    protected $connection = 'mysql_qstorage';
    protected $table = 'qs_api_log';
    protected $primaryKey = 'row_id';
}