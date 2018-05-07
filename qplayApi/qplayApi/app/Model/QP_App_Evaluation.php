<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Evaluation extends Model
{   
    protected $connection = 'mysql';
    protected $table = 'qp_app_evaluation';
    protected $primaryKey = 'row_id';
}