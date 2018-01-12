<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Post extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_post';
    protected $primaryKey = 'row_id';

}
