<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Comment extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_comment';
    protected $primaryKey = 'row_id';
}
