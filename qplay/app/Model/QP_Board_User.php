<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_Board_User extends Model
{
    protected $table = 'qp_board_user';
    protected $primaryKey = 'row_id';

    /**
     * 不可以被批量賦值的屬性。
     *
     * @var array
     */
    protected $guarded = ['updated_at'];
}