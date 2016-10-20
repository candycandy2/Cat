<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Role_App extends Model
{
    protected $table = 'qp_role_app';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_row_id','role_row_id','created_user','updated_user'];
}
