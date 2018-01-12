<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Board_Company extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_board_company';
    protected $primaryKey = 'row_id';
   
}