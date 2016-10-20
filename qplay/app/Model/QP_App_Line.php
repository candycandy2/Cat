<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Line extends Model
{
    protected $table = 'qp_app_line';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_row_id','lang_row_id','app_name','app_summary','app_description'];
}
