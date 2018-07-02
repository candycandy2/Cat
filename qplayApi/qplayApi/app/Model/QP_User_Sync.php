<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_User_Sync extends Model
{
    protected $table = 'qp_user_sync';
    protected $primaryKey = 'row_id';

    public $timestamps = false;
}
