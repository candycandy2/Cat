<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Attach extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_attach';
    protected $primaryKey = 'row_id';
}
