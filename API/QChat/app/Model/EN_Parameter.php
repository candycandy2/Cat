<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EN_Parameter extends Model
{   
    protected $connection = 'mysql_ens';
    protected $table = 'en_parameter';
    protected $primaryKey = 'row_id';

     public function parameterType()
    {
        return $this->belongsTo('App\Model\EN_Parameter_Type');
    }
}