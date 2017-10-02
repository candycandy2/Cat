<?php
/**
 * 用戶Parameter相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Model\QP_Chatroom;
use DB;

class ChatRoomRepository
{

    protected $chatroom;
    
    /**
     * ParameterRepository constructor.
     * @param QP_User $user
     * @param QP_Friend_Matrix $friendMatrix
     */
    public function __construct(QP_Chatroom $chatroom)
    {
        $this->chatroom = $chatroom;
    }

   /**
    * 將建立的聊天 是資訊存入DB
    * @param  String $gid          聊天室id ex :23273943
    * @param  String $chatroomName 聊天室名稱
    * @param  String $chatroomDesc 聊天室描述
    * @param  int    $userId       建立聊天室的使用者user_row_id
    * @param  Array  $members      聊天室成員(私聊group_message=N,實記錄聊天室成員)
    */
    public function saveChatroom($gid, $chatroomName, $chatroomDesc, $userId, $member=""){
        $this->chatroom->chatroom_id = $gid;
        $this->chatroom->chatroom_name = $chatroomName;
        $this->chatroom->chatroom_desc = $chatroomDesc;
        if($member!=""){
            $this->chatroom->member = $member;
        }
        $this->chatroom->created_user = $userId;
        $this->chatroom->save();
    }

    /**
     * 取得私聊聊天室
     * @return mixed
     */
    public function getPrivateGroup($member1, $member2){
        return $this->chatroom
        ->whereIn('member' , array($member1.','.$member2, $member2.','.$member1))
        ->select('chatroom_id')
        ->first();
    }
}