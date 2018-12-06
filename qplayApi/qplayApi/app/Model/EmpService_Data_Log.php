<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EmpService_Data_Log extends Model
{
    protected $connection = 'mysql_emp_service';
    protected $table = 'data_log';
    protected $primaryKey = 'row_id';
}
