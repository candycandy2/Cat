<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Board extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_board';
    protected $primaryKey = 'row_id';

}
