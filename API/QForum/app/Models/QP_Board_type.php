<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Board_type extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_board_type';
    protected $primaryKey = 'row_id';
}
