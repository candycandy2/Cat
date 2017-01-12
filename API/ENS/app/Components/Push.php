<?php
namespace App\Components;

use App\lib\CommonUtil;
use App\Repositories\EventRepository;
use App\Repositories\UserRepository;
use Config;

class Push
{    

    public function sendPushMessage($from, Array $to, $title, $text)
    {
            $signatureTime = time();
            $apiFunction = 'sendPushMessage';
            $queryParam = array(
                'lang' => 'en-us',
                'need_push' => 'N',
                'app_key' => 'appqplaydev'
                );
            $url = Config::get('app.qplay_api_server').$apiFunction.'?'.http_build_query($queryParam);
            $header = array('Content-Type: application/json',
                        'App-Key: appqplaydev',
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getSignature($signatureTime),
                        'token: 585ba4ab27976');
            $data = array(
                        'template_id' =>'1',
                        'message_title' => $title,
                        'message_type' => 'event',
                        'message_text' => $text,
                        'message_html' => '',
                        'message_url' => '',
                        'message_source' => 'Cleo Test ENS',
                        'source_user_id' => $from,
                        'destination_user_id' => $to,
                        'destination_role_id' => array(
                            )
                        );
            $data = json_encode($data);
            $result = CommonUtil::callAPI('POST', $url,  $header, $data);
            return $result;
    }
}