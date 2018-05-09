<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Version extends Model
{   
    protected $connection = 'mysql';
    protected $table = 'qp_app_version';
    protected $primaryKey = 'row_id';
}