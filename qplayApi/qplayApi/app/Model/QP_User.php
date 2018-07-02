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

     public function getAuthIdentifierName()
    {

    }

    public function getAuthIdentifier()
    {
        return $this->row_id;
    }

    public function getAuthPassword()
    {

    }

    public function getRememberToken()
    {

    }

    public function setRememberToken($value)
    {

    }

    public function getRememberTokenName()
    {

    }

}
