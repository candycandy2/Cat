<?php

namespace App\Model;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Auth\UserInterface;
use DB;

class QP_User extends Model implements  Authenticatable
{
    protected $table = 'qp_user';
    protected $primaryKey = 'row_id';
}
