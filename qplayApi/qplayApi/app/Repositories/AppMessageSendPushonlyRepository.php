<?php

namespace App\Repositories;

use App\Model\MNG_Message_Send_Pushonly;
use DB;
class AppMessageSendPushonlyRepository
{

    protected $messageSendPushonly;

    public function __construct(MNG_Message_Send_Pushonly $messageSendPushonly)
    {   
        $this->messageSendPushonly = $messageSendPushonly;
    }

    public function insertAppPushMessage(Array $data){
        return $this->messageSendPushonly->insertGetId($data);
    }

    public function updateAppPushMessage($messageId, $data){
        return $this->messageSendPushonly::find($messageId)->update($data);
    }
}
