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
    public function sendPushMessage($from, Array $to, $title, $text, $extra, Array $queryParam=[])
    {       
            $apiFunction = 'sendPushMessage';
            $signatureTime = time();
            $appKey = CommonUtil::getContextAppKey(Config::get('app.env'), 'qchat');
            $queryParam['app_key'] = $appKey;
            $queryParam['need_push'] = 'Y';
            $queryParam['qplay_message_list'] = 'N';
            $url = Config::get('app.qplay_api_server').$apiFunction.'?'.http_build_query($queryParam);
            $header = array('Content-Type: application/json',
                        'App-Key: '.$appKey,
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getCustomSignature($signatureTime));
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

    /**
     * 取得推播訊息樣板
     * @param  string $action      呼叫場景(new|update|close)
     * @param  Array  $event       事件資訊
     * @param  Array  $queryParam  推播時的必要參數
     * @return Array               array('title'=>'','text'=>'');
     */
    public function getPushMessageTemplate($action, Array $event, $queryParam){
        
        $template = array('title'=>'','text'=>'');
        $project = $queryParam['project'];
        $template['text'] =$event['event_desc'];
        switch ($action) {
            case 'new':
            case 'update':
                $template['title'] = '['.$project.']'.'['.$event['event_title'].']';
                break;
            case 'close':
                $template['title'] = '['.$project.']'.$event['event_row_id'].$event['event_type'].'，已完成作業';
                break;
        }
        return $template;
   }

}