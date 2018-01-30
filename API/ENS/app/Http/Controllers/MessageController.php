<?php

namespace App\Http\Controllers;

use App\lib\ResultCode;
use App\lib\Verify;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\Forum;
use App\lib\Message;

class MessageController extends Controller
{
    /**
     * 獲得留言總數
     */
    public function getMessageCount(){
        
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
             $result = response()->json(['ResultCode'=>$verifyResult["code"],
                'Message'=>$verifyResult["message"],
                'Content'=>'']);
            return $result;
        }
        
        $input = Input::get();
        $xml=simplexml_load_string($input['strXml']);
        $empNo = trim((string)$xml->emp_no[0]);

        $chatRoomList = [];
        $data = [];
        if(!isset($xml->chatroom_list[0])){
            return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
        }
        $chatRoomList = (Array)$xml->chatroom_list[0]->chatroom_id;
        if(count($chatRoomList) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
        }
        
        //check chatroom_id
        foreach ($chatRoomList as $key => $chatroomId) {
            $chatroomIdStr = trim((string)$chatroomId);
            if($chatroomIdStr == ""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
            } 
        }
        
        $qforum = new Forum();
        $getMessageCountRes =  $qforum->getCommentCount($chatRoomList);
        $result = [];
        foreach ($getMessageCountRes as $record) {
            $result[] = array('target_id'=>$record->post_id,
                            'count'=>$record->count);
        }
        return response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                'Content'=>$result]);

    }
}