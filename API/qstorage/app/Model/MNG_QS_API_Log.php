<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_QS_API_Log extends Eloquent
{
    protected $connection = 'mongodb_qstorage';
    protected $collection = 'qs_api_log';
}