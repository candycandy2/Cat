<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_User_App extends Model
{
    protected $table = 'qp_user_app';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_row_id','user_row_id','created_user','updated_user'];
}
