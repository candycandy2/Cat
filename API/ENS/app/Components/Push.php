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
            $apiFunction = 'sendPushMessage';
            $signatureTime = time();
            $appKey = CommonUtil::getContextAppKey(Config::get('app.env'), 'ens');
            $queryParam['app_key'] = $appKey;
            $url = Config::get('app.qplay_api_server').$apiFunction.'?'.http_build_query($queryParam);
            $header = array('Content-Type: application/json',
                        'App-Key: '.$appKey,
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getSignature($signatureTime));
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
                        'destination_role_id' => array(
                            )
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
        $callbackApp = CommonUtil::getContextAppKey(Config::get('app.env'), 'qplay');
        $appKey = CommonUtil::getContextAppKey(Config::get('app.env'), 'ens');
        $url = $appKey.'://callbackApp='.$callbackApp.'&action=openevent&eventID='.$event['event_row_id'].'&project='.$project;

        $template['text'] =$event['event_desc'].'<br><a href="'.$url.'">查看事件詳細資料</a>';

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