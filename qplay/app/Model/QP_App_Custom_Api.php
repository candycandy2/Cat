<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Custom_Api extends Model
{
    protected $table = 'qp_app_custom_api';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_row_id','app_key','api_version','api_action','api_url','created_user','updated_user','created_at','updated_at'];
}
