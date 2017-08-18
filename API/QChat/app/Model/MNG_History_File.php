<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_History_File extends Eloquent
{
    protected $connection = 'mongodb_qplay';
    protected $collection = 'qp_qchat_history_file';
}
