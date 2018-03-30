<?php
/**
 * 推播相關元件
 */
namespace App\lib;

use App\lib\CommonUtil;
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
    public function sendPushMessage($from, Array $to, $title, $text, $extra, Array $queryParam)
    {       
            $apiFunction = 'sendPushMessage';
            $signatureTime = time();
            $queryParam['qplay_message_list'] = 'N';
            $url = Config::get('app.qplay_api_server').$apiFunction.'?'.http_build_query($queryParam);
            $appKey = $queryParam['app_key'];
            $header = array('Content-Type: application/json',
                        'App-Key: '.$appKey,
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getCustomSignature($signatureTime, $appKey));
            $data = array(
                        'template_id' =>'0',
                        'message_title' => $title,
                        'message_type' => 'event',
                        'message_text' => $text,
                        'message_html' => '',
                        'message_url' => '',
                        'message_source' => CommonUtil::getProjectName($appKey),
                        'source_user_id' => $from,
                        'destination_user_id' => $to,
                        'destination_role_id' => array(),
                        'extra' => $extra
                        );
            $data = json_encode($data);
            $result = CommonUtil::callAPI('POST', $url,  $header, $data);
            return $result;
    }
}