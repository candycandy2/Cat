<?php
/**
 * 訊息相關元件
 */
namespace App\Components;

use App\lib\CommonUtil;
use Config;

class Message
{   
     const _998002_userAlreadyExist = "998002";  //用戶已註冊
    /**
     * 聊天室群組資訊
     * @var array
     */
    protected $messageGroupInfo;


    public function register($loginId){
        $data['username'] = $loginId;
        $apiFunction = 'register';
        $result = $this->callQmessageAPI($apiFunction, $data);
        return $result;
    }

    /**
     * 取得聊天群組資訊
     * @return array
     */
    public static function messageGroupInfo(){
        return $this->messageGroupInfo;
    }

    /**
     * 建立群組聊天室
     * @param  String $owner   發起人login_id
     * @param  Array  $members 聊天室成員 ex:["Steven.Yan","Sammi.Yao"]
     * @param  String $desc    聊天室title
     * @return json
     */
    public function createChatRoom($owner, Array $members, $desc)
    {       

        $this->messageGroupInfo = array(
        "owner"=>$owner,
        "members"=>$members,
        "desc"=>$desc);

        $apiFunction = 'group/add';
        $data = $this->messageGroupInfo;
        $result = $this->callQmessageAPI($apiFunction, $data);
        return $result;
    }


    /**
     * 刪除聊天室
     * @param  int  $chatRoomId 欲刪除的聊天室id
     * @return json
     */
    public function deleteChatRoom($chatRoomId){
        
        $data['gid'] = $chatRoomId;
        $apiFunction = 'group/delete';
        $result = $this->callQmessageAPI($apiFunction, $data);
        return $result;

    }

    /**
     * 獲得留言總數
     * @param  Array  $targetId 欲取得的target_id Array ( array('target_id'=>array('123456','456789') )
     * @return json
     */
    public function getMessageCount(Array $targetId){
        
        $data['target_id'] = $targetId;
        $apiFunction = 'history/count';
        $result = $this->callQmessageAPI($apiFunction, $data);
        return $result;

    }

    /**
     * 呼叫QMessageAPI
     * @param  String $apiFunction 呼叫的function名稱
     * @param  Array $data        傳送的參數
     * @return json
     */
    private function callQmessageAPI($apiFunction, $data){
         $signatureTime = time();
         $data = json_encode($data);
         $url = Config::get('app.qmessage_api_server').$apiFunction;
         $headers = array('Content-Type: application/json');
         return CommonUtil::callAPI('POST', $url, $headers, $data);
    }

}