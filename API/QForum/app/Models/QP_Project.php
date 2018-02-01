<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Project extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_project';
    protected $primaryKey = 'row_id';
}
