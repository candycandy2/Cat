<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_Message_Send_Pushonly extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'qp_message_send_pushonly';

    protected $fillable = [
        'jpush_error_code',
        'updated_user',
        'updated_at'
    ];
}