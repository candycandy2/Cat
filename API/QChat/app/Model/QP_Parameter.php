<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Parameter extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_parameter';
    protected $primaryKey = 'row_id';

     public function parameterType()
    {
        return $this->belongsTo('App\Model\QP_Parameter_Type');
    }
}