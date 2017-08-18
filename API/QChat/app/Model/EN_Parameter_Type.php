<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EN_Parameter_Type extends Model
{   
    protected $connection = 'mysql_ens';
    protected $table = 'en_parameter_type';
    protected $primaryKey = 'row_id';

    public function  parameters() {
        return $this->hasMany('App\Model\EN_Parameter','parameter_type_row_id','row_id');
    }
}