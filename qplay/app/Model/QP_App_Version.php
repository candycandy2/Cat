<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_App_Version extends Model
{
    protected $table = 'qp_app_version';
    protected $primaryKey = 'row_id';
    protected $fillable = ['app_row_id','version_code','version_name','url','ready_date','status','device_type'];
}