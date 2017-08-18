<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_History extends Eloquent
{
    protected $connection = 'mongodb_qmessage';
    protected $collection = 'qm_history';
}
