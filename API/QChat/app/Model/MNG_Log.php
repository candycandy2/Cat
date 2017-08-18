<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_Log extends Eloquent
{
    protected $connection = 'mongodb_qplay';
    protected $collection = 'qp_qchat_api_log';
}