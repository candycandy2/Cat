<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Log extends Eloquent
{
    //
    protected $connection = 'mongodb';
    protected $collection = 'qm_api_log';
}
