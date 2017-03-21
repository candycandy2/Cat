<?php
/**
 * 訊息相關元件
 */
namespace App\Components;

use App\lib\CommonUtil;
use Config;

class Message
{   
    /**
     * 聊天室群組資訊
     * @var array
     */
    protected $messageGroupInfo;

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
     * @return json            成功回傳ex:
     *                         {
     *                            "ResultCode": 1,
     *                             "Message": "Success",
     *                             "Content": {
     *                               "gid": 22256873,
     *                               "owner_username": "Moses.zhu",
     *                               "name": "E9931A1A-159A-AC85-B7AB-CD7EE62D94A5",
     *                               "desc": "$desc",
     *                               "members_username": [
     *                                 "Steven.Yan",
     *                                 "Sammi.Yao"
     *                               ],
     *                               "max_member_count": 500
     *                             }
     *                           }
     *
     */
    public function createChatRoom($owner, Array $members, $desc)
    {       

            $this->messageGroupInfo = array(
            "owner"=>$owner,
            "members"=>$members,
            "desc"=>$desc);

            $signatureTime = time();
            $apiFunction = 'group/add';
            $url = Config::get('app.qmessage_api_server').$apiFunction;
            $header = array('Content-Type: application/json',
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getSignature($signatureTime));
            $data = $this->messageGroupInfo;
            $data = json_encode($data);
            $result = CommonUtil::callAPI('POST', $url,  $header, $data);
            return $result;
    }
}