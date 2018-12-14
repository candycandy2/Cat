<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EmpService_Target_ID extends Model
{
    protected $connection = 'mysql_emp_service';
    protected $table = 'target_id';
    protected $primaryKey = 'row_id';

    public $timestamps = false;
}
