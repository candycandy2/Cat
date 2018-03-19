<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Subscribe_Post_User extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_subscribe_post_user';
    protected $primaryKey = 'row_id';
}