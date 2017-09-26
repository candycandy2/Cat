<?php
namespace App\Services;

use App\lib\JMessage;
use App\lib\JPush;
use App\Repositories\UserRepository;
use App\Repositories\ChatRoomRepository;
use App\lib\CommonUtil;
use Config;

class ChatRoomService
{   

    protected $userRepository;

    protected $jmessage;
    protected $jpush;

    public function __construct(UserRepository $userRepository, ChatRoomRepository $chatRoomRepository)
    {
        $this->userRepository = $userRepository;
        $this->chatRoomRepository = $chatRoomRepository;
        $this->jmessage = new JMessage(Config::get("app.app_key"),Config::get("app.master_secret"));
        $this->jpush = new JPush(Config::get("app.app_key"),Config::get("app.master_secret"));
    }

    /**
     * 新增聊天室群組。
     * @param  array $owner  聊天室owner
     * @param  array $members  欲加入聊天室的人員
     */
    public function newChatRoom( $owner, $chatroomName, Array $members, $chatroomDesc=""){
        $method = 'groups';
        $data =json_encode([
                    'owner_username' => $owner,
                    'name' => $chatroomName,
                    'members' => $members,
                    'desc' => $chatroomDesc
                ]);
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('POST', $url, $data);
    }

    public function saveChatRoom($gid, $chatroomName, $chatroomDesc, $userId){
        $this->chatRoomRepository->saveChatRoom($gid, $chatroomName, $chatroomDesc, $userId);
    }

    /**
    * 發送推播訊息給事件參與者
    * @param  int      $eventId    事件id en_event.row_id
    * @param  Array    $queryParam 呼叫pushAPI時的必要參數，EX :array('lang' => 'en_us','need_push' => 'Y','project' => 'appens')
    * @param  string   $empNo
    * @return json
    */
   public function sendPushMessage($to, Array $queryParam, $from){
       
       
       return $result;
    }
}