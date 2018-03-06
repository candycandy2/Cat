<?php
/**
 * 訊息相關元件
 */
namespace App\lib;

use App\lib\CommonUtil;
use Config;
use App\Model\QP_Comment as QP_Comment;

class Forum
{   
    
    /**
     * 取得貼文資訊
     * @return array
     */
    public function getCommentCount(Array $postIds){
        return QP_Comment::whereIn('post_id',$postIds)
                    ->selectRaw('post_id, count(*) as count')->groupBy('post_id')->get();
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
    public function newPost($project, $empNo, $postId, $refId, $title, $content, $queryParam)
    {       
        $apiFunction = 'newPost';

        $board = CommonUtil::getBoardId($project);
        $xml = new \SimpleXMLElement('<xml/>');
        $layoutHeader = $xml->addChild('LayoutHeader');
        $layoutHeader->addChild('emp_no', $empNo);
        $layoutHeader->addChild('source', CommonUtil::getContextAppKey(\Config('app.env'), 'ens'));
        $layoutHeader->addChild('board_id', $board->board_id);
        $layoutHeader->addChild('post_id', $postId);
        $layoutHeader->addChild('ref_id', $refId);
        $layoutHeader->addChild('post_title', $title);
        $layoutHeader->addChild('content', $content);
        $data = array("strXml"=>$xml->LayoutHeader->asXML());
        
        return $result = $this->callQForumAPI($apiFunction, $queryParam, $data);
    }

    /**
     * 取得貼文uuid
     * @param  String $emoNo   使用者員工編號
     * @return json
     */
    public function getPostId($empNo, $queryParam)
    {
        
        $apiFunction = 'getPostId';

        $xml = new \SimpleXMLElement('<xml/>');
        $layoutHeader = $xml->addChild('LayoutHeader');
        $layoutHeader->addChild('emp_no', $empNo);
        $layoutHeader->addChild('source', CommonUtil::getContextAppKey(\Config('app.env'), 'ens'));
        $data = array("strXml"=>$xml->LayoutHeader->asXML());
        
        return $result = $this->callQForumAPI($apiFunction, $queryParam, $data);
    }

    /**
     * 更新貼文
     * @param  string $empNo      員工編號
     * @param  array  $queryParam 
     * @return json
     */
    public function modifyPost($project, $empNo, $postId, $title, $content, $queryParam){
        
        $apiFunction = 'modifyPost';
        
        $xml = new \SimpleXMLElement('<xml/>');
        $layoutHeader = $xml->addChild('LayoutHeader');
        $layoutHeader->addChild('emp_no', $empNo);
        $layoutHeader->addChild('source', CommonUtil::getContextAppKey(\Config('app.env'), 'ens'));
        $layoutHeader->addChild('post_id', $postId);
        $layoutHeader->addChild('post_title', $title);
        $layoutHeader->addChild('content', $content);
        $data = array("strXml"=>$xml->LayoutHeader->asXML());
        return $result = $this->callQForumAPI($apiFunction, $queryParam, $data);  
    }

    /**
     * 刪除貼文
     * @param  string $empNo      員工編號
     * @param  string $postId     貼文id
     * @param  array  $queryParam url 參數
     * @return json
     */
    public function deletePost($empNo, $postId, $queryParam ){
        $apiFunction = 'deletePost';
        
        $xml = new \SimpleXMLElement('<xml/>');
        $layoutHeader = $xml->addChild('LayoutHeader');
        $layoutHeader->addChild('emp_no', $empNo);
        $layoutHeader->addChild('source', CommonUtil::getContextAppKey(\Config('app.env'), 'ens'));
        $layoutHeader->addChild('post_id', $postId);
        $data = array("strXml"=>$xml->LayoutHeader->asXML());
        return $result = $this->callQForumAPI($apiFunction, $queryParam, $data);
    }

    /**
     * 訂閱貼文
     * @param  string $empNo            員工編號
     * @param  string $postId           貼文id
     * @param  array  $subscribeUser    訂閱者
     * @param  array  $queryParam       url 參數
     * @return json
     */
    public function subscribePost($empNo, $postId, $subscribeUsers, $queryParam){
        $apiFunction = 'subscribePost';
        
        $xml = new \SimpleXMLElement('<xml/>');
        $layoutHeader = $xml->addChild('LayoutHeader');
        $layoutHeader->addChild('emp_no', $empNo);
        $layoutHeader->addChild('source', CommonUtil::getContextAppKey(\Config('app.env'), 'ens'));
        $layoutHeader->addChild('post_id', $postId);
        $subscribeUserList = $layoutHeader->addChild('subscribe_user_list');
        foreach ($subscribeUsers as $user) {
            $subscribeUserList->addChild('subscribe_user',$user);
        }
        $data = array("strXml"=>$xml->LayoutHeader->asXML());
        return $result = $this->callQForumAPI($apiFunction, $queryParam, $data);
    }

    /**
     * 呼叫QForumAPI
     * @param  String $apiFunction 呼叫的function名稱
     * @param  Array $data        傳送的參數
     * @return json
     */
    private function callQForumAPI($apiFunction,  Array $queryParam, $data=null){
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