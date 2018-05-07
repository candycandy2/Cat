<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Head extends Model
{   
    protected $connection = 'mysql';
    protected $table = 'qp_app_head';
    protected $primaryKey = 'row_id';
}