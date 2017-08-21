<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_History_File extends Eloquent
{
    protected $connection = 'mongodb_qmessage';
    protected $collection = 'qm_history_file';
    protected $primaryKey = 'msg_id';

    /**
     * 不可被批量赋值的属性。
     *
     * @var array
     */
    protected $guarded = [];
}
