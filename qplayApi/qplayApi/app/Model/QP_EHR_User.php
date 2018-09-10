<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_EHR_User extends Model
{
    protected $table = 'qp_ehr_user';
    protected $primaryKey = 'row_id';

    public $timestamps = false;
}
