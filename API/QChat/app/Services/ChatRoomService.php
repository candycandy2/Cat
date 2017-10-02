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
                    'members_username' => $members,
                    'desc' => $chatroomDesc
                ]);
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('POST', $url, $data);
    }

    /**
     * 儲存聊天室資訊
     * @param  String $isGroup      是否為群聊聊天室(Y:是|N:否)
     * @param  String $gid          聊天室id
     * @param  String $chatroomName 聊天室名稱
     * @param  String $chatroomDesc 聊天室備註
     * @param  String $fromEmpNo    聊天室建立者的員工編號
     * @param  Array  $member       聊天室成員
     * @param  String $userId       聊天室建立者的user_row_id
     */
    public function saveChatRoom($gid, $chatroomName, $chatroomDesc, $userId, $member=""){
        $this->chatRoomRepository->saveChatRoom($gid, $chatroomName, $chatroomDesc, $userId, $member);
    }

    /**
     * 取得私聊聊天室
     * @return mixed
     */
    public function getPrivateGroup($member1, $member2){
        return $this->chatRoomRepository->getPrivateGroup($member1, $member2);
    }

    public function deleteGroup($groupId){
        $method = 'groups';
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('DELETE', $url);
    }
}