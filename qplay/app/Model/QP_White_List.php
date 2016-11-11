<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_White_List extends Model
{
    protected $table = 'qp_white_list';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_row_id','allow_url','deleted_at','created_user','updated_user'];
}