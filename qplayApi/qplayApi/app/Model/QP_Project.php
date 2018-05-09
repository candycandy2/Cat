<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Project extends Model
{   
    protected $connection = 'mysql';
    protected $table = 'qp_project';
    protected $primaryKey = 'row_id';
}

