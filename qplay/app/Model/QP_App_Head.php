<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Head extends Model
{
    protected $table = 'qp_app_head';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_category_row_id','updated_user'];
}
