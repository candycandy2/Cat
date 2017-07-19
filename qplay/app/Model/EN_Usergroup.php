<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class EN_Usergroup extends Model
{
    protected $connection = 'mysql_ens';
    protected $table = 'en_usergroup';
    protected $primaryKey = 'row_id';
}
