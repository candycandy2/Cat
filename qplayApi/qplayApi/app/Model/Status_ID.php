<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Status_ID extends Model
{
    protected $table = 'status_id';
    protected $primaryKey = 'row_id';

    public $timestamp = false;
}
