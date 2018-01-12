<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Board_User extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_board_user';
    protected $primaryKey = 'row_id';
   
}
