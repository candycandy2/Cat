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
     * 取得聊天室資訊
     * @param  int   $groupId 聊天室id
     * @return mixed
     */
    public function getChatroom($groupId){
        $chatroom = $this->chatRoomRepository->getChatroom($groupId);
        if(count($chatroom) > 0 && isset($chatroom->chatroom_desc)){
            $desc = $this->getChatroomExtraData($chatroom->chatroom_desc);
            $chatroom->extraData =  $desc;
        }
        return $chatroom;
    }

    /**
     * 取得私聊聊天室
     * @return mixed
     */
    public function getPrivateGroup($member1, $member2){
        $privateGroupId=null;
        $res = $this->chatRoomRepository->getPrivateGroup($member1, $member2);
        foreach ($res as $chatroom) {
           $desc = $this->getChatroomExtraData(trim($chatroom->chatroom_desc));

           if($desc['group_message'] == 'N'){
                 $privateGroupId = $chatroom->chatroom_id;
           }
        }
        return $privateGroupId;
    }

    /**
     * 呼叫JMessage刪除聊天室
     * @param  int   $groupId 聊天室id
     * @return json
     */
    public function deleteGroup($groupId){
        $method = 'groups';
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('DELETE', $url);
    }

    /**
     * 更新聊天室資訊
     * @param  int    $groupId 聊天室id
     * @param  Array  $data    更新的資料
     * @param  int    $userId  使用者個qp_user.row_id
     * @return int             更新成功的筆數
     */
    public function updateChatroom($groupId, $data, $userId){
        return $this->chatRoomRepository->updateChatroom($groupId, $data, $userId);
    }

    /**
     * 刪除聊天室
     * @param  int    $groupId 聊天室id
     * @return int             刪除成功的筆數
     */
    public function deleteChatroom($groupId){
        return $this->chatRoomRepository->deleteChatroom($groupId);
    }

    /**
     * 取得聊天室備註
     * @param  String $list 逗號隔開的string
     * @return Array
     */
    public function getChatroomExtraData(String $list){
        $array = explode(';',$list);
        $result = [];
        foreach ($array as $item) {
            $result[explode('=',$item)[0]] = explode('=',$item)[1];    
        }
        return $result;
    }

    /**
     * 添加聊天室成員
     * @param int   $groupId    聊天室id
     * @param Array $destArr    添加的特定成員login_id
     */
    public function addGroupMember($groupId, $destArr){
        $method = 'groups/'.$groupId.'/members';
        $data =json_encode([
                     "add" => $destArr
                ]);
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('POST', $url, $data);
    }

    /**
     * 添加聊天室成員
     * @param int   $groupId    聊天室id
     * @param Array $destArr    添加的特定成員login_id
     */
    public function removeGroupMember($groupId, Array $destArr){
        $method = 'groups/'.$groupId.'/members';
        $data =json_encode([
                     "remove" => $destArr
                ]);
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('POST', $url, $data);
    }

    /**
     * 更新聊天群組資訊
     * @param  int    $groupId 聊天室id
     * @param  Array  $dara    要更新的資訊
     */
    public function updateGroup($groupId, Array $data){
        $method = 'groups/'.$groupId;
        $data =json_encode($data);
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('POST', $url, $data);
    }

    /**
     * 取得某用戶群組列表
     * @param  string $userName 用戶名
     * @return json
     */
    public function getUserGroups($userName){
        $method = 'users/'.$userName.'/groups/';
        $url = JMessage::API_V1_URL.$method;
        return $this->jmessage->exec('GET', $url);
    }
}