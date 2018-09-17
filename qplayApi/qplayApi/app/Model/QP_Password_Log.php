<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Password_Log extends Model
{   
    protected $connection = 'mysql';
    protected $table = 'qp_password_log';
    protected $primaryKey = 'row_id';
}