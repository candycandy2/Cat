<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EmpService_User extends Model
{
    protected $connection = 'mysql';
    protected $table = 'qp_user';
    protected $primaryKey = 'row_id';
}
