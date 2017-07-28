<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EN_Basic_Info extends Model
{
    protected $connection = 'mysql_ens';
    protected $table = 'en_basic_info';
    protected $primaryKey = 'row_id';

     /**
     * 不可以被批量賦值的屬性。
     *
     * @var array
     */
    protected $guarded = ['updated_at'];

}
