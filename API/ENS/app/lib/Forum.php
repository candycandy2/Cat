<?php
/**
 * 訊息相關元件
 */
namespace App\lib;

use App\lib\CommonUtil;
use Config;
use App\Model\QP_Board;

class Forum
{   
     const _998002_userAlreadyExist = "998002";  //用戶已註冊
    /**
     * 貼文資訊
     * @var array
     */
    protected $postDetails;


    /**
     * 取得貼文資訊
     * @return array
     */
    public static function getPostDetails(){
        return $this->postDetails;
    }

    /**
     * 建立貼文
     * @param  String $project 專案名稱ex:RM,ITS
     * @param  String $empNo   員工編號 
     * @param  String $postId  貼文row_id
     * @param  String $title   事件標題
     * @param  String $content 事件內容
     * @param  String $queryParam 從customApi 帶過來的urlparam
     * @return json
     */
    public function newPost($project, $empNo, $postId, $title, $content, $queryParam)
    {       
        $board = CommonUtil::getBoardId($project);
        $xml = new \SimpleXMLElement('<xml/>');
        $layoutHeader = $xml->addChild('LayoutHeader');
        $layoutHeader->addChild('emp_no', $empNo);
        $layoutHeader->addChild('board_id', $board->board_id);
        $layoutHeader->addChild('post_id', $postId);
        $layoutHeader->addChild('post_title', $title);
        $layoutHeader->addChild('content', $content);
        $data = array("strXml"=>$xml->LayoutHeader->asXML());
        $apiFunction = 'newPost';
        return $result = $this->callQmessageAPI($apiFunction, $queryParam, $data);
    }

    /**
     * 取得貼文uuid
     * @param  String $emoNo   使用者員工編號
     * @return json
     */
    public function getPostId($empNo, $queryParam)
    {
        $xml = new \SimpleXMLElement('<xml/>');
        $layoutHeader = $xml->addChild('LayoutHeader');
        $layoutHeader->addChild('emp_no', $empNo);
        $data = array("strXml"=>$xml->LayoutHeader->asXML());
        $apiFunction = 'getPostId';
        return $result = $this->callQmessageAPI($apiFunction, $queryParam, $data);
    }

    /**
     * 呼叫QForumAPI
     * @param  String $apiFunction 呼叫的function名稱
     * @param  Array $data        傳送的參數
     * @return json
     */
    private function callQmessageAPI($apiFunction,  Array $queryParam, $data=null){
         $signatureTime = time();
         $data = json_encode($data);
         $url = Config::get('app.qforum_api_server').$apiFunction.'?'.http_build_query($queryParam);
         $appKey = CommonUtil::getContextAppKey(Config::get('app.env'),'qforum');
         $header = array('Content-Type: application/json',
                        'App-Key: '.$appKey,
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getSignature($signatureTime, Config::get('app.qforum_secret_key')));
         return CommonUtil::callAPI('POST', $url, $header, $data);
    }

}