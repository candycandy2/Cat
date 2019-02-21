<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EmpService_Service_Push extends Model
{
    protected $connection = 'mysql_emp_service';
    protected $table = 'service_push';
    protected $primaryKey = 'row_id';

    public $timestamps = false;
}
