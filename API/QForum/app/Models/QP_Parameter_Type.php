<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Parameter_Type extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_parameter_type';
    protected $primaryKey = 'row_id';

    public function  parameters() {
        return $this->hasMany('App\Models\QP_Parameter','parameter_type_row_id','row_id');
    }
}