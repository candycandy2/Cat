<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Message extends Eloquent
{
    //
    protected $connection = 'mongodb';
    protected $collection = 'qm_history';
}
