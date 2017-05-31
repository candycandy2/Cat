<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class QP_Api_Log extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'qp_api_log';
}
