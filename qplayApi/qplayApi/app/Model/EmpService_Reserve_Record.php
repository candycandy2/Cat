<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EmpService_Reserve_Record extends Model
{
    protected $connection = 'mysql_emp_service';
    protected $table = 'reserve_record';
    protected $primaryKey = 'row_id';

    public $timestamps = false;
}
