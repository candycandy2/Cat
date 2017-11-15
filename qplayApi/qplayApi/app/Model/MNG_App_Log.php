<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_App_Log extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'qp_app_log';
}
