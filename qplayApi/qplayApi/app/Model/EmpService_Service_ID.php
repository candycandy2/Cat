<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EmpService_Service_ID extends Model
{
    protected $connection = 'mysql_emp_service';
    protected $table = 'service_id';
    protected $primaryKey = 'row_id';

    public $timestamp = false;
}
