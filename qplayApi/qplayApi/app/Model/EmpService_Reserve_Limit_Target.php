<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EmpService_Reserve_Limit_Target extends Model
{
    protected $connection = 'mysql_emp_service';
    protected $table = 'reserve_limit_target';
    protected $primaryKey = 'row_id';
}
