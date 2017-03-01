<?php
/**
 * 推播相關元件
 */
namespace App\Components;

use App\lib\CommonUtil;
use App\Repositories\EventRepository;
use App\Repositories\UserRepository;
use Config;

class Push
{    

    /**
     * 發送推播訊息
     * @param  String $from       發訊人
     * @param  Array  $to         收訊人
     * @param  String $title      訊息標題
     * @param  String $text       訊息內容
     * @param  Array  $queryParam 
     * @return json               訊息推播結果
     */
    public function sendPushMessage($from, Array $to, $title, $text, Array $queryParam)
    {
            $signatureTime = time();
            $apiFunction = 'sendPushMessage';
            $url = Config::get('app.qplay_api_server').$apiFunction.'?'.http_build_query($queryParam);
            $header = array('Content-Type: application/json',
                        'App-Key: appqplaydev',
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getSignature($signatureTime));
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