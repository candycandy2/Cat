<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Pic extends Model
{
    protected $table = 'qp_app_pic';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_row_id','lang_row_id','pic_type','sequence_by_type','pic_url','created_user','updated_user'];

     
}
