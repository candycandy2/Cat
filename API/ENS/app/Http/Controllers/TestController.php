<?php
/**
 * 測試用Controller
 */
namespace App\Http\Controllers;

use App\Components\Push;
use App\Components\Message;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use Request;
use App\Services\EventService;
use Illuminate\Support\Facades\Input;

class testController extends Controller
{

    protected $push;
    protected $eventService;

    const EVENT_TYPE = 'event_type';
    const STATUS_FINISHED = '1';
    const STATUS_UNFINISHED = '0';

    public function __construct(Push $push, eventService $eventService)
    {

        $this->push = $push;
        $this->eventService = $eventService;
    }

    public function getAuthority(){

        $url = "http://localhost/EnterpriseAPPPlatform/API/ENS/public/v101/ens/getAuthority";
                $args = array('strXml' =>'<LayoutHeader><emp_no>1607279</emp_no></LayoutHeader>');
                $data["strXml"] = json_encode($args);
                
                $result = $this->doPost($url, $data);
                var_dump($result);

    }   

    private  function doPost($url, $data){//file_get_content
        $postdata = http_build_query($data);

        $opts = array('https' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-Type:application/json',
                'content' => $postdata
            )
        );
        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        return $result;
    }

    /**
     * 將字串做javascript escape
     * @param  string $str Utf-8字串
     * @return string      javascript escape 後的字串
     */
    public function jsEscape($str){
        $ret = '';
        $len = mb_strlen($str);
        for ($i = 0; $i < $len; $i++)
        {
            $oriStr = mb_substr( $str,$i,1,"utf-8");
            $uniStr = $this->utf8_str_to_unicode($oriStr);
            if($oriStr == $uniStr){
                $ret .= rawurlencode($oriStr);
            }else{
                $ret .= $uniStr; 
            }
         }
        return $ret;
    }

    /**
     * utf8字符轉換成Unicode字符 (%uxxxx)
     * @param  string $utf8_str Utf-8字符
     * @return string           Unicode字符
     */
    public static function utf8_str_to_unicode($utf8_str) {
        $conv = json_encode($utf8_str);
        $cov = preg_replace_callback("/(\\\u[0-9a-cf]{4})/i",function($conv){
            return '%'.$conv[0];
        },$conv); //emoji的unicode留下，其他改為%uXXXX
        return  json_decode($conv);
    }


    public function jsUnescape($str){
        $ret = '';
        $len = strlen($str);
        for ($i = 0; $i < $len; $i++)
        {
            if ($str[$i] == '%' && $str[$i+1] == 'u')
            {
                $val = hexdec(substr($str, $i+2, 4));
                if ($val < 0x7f) $ret .= chr($val);
                else if($val < 0x800) $ret .= chr(0xc0|($val>>6)).chr(0x80|($val&0x3f));
                else $ret .= chr(0xe0|($val>>12)).chr(0x80|(($val>>6)&0x3f)).chr(0x80|($val&0x3f));
                $i += 5;
            }
            else if ($str[$i] == '%')
            {
                $ret .= urldecode(substr($str, $i, 3));
                $i += 2;
            }
            else $ret .= $str[$i];
        }
        return $ret;
    }

    /**
    * 發送推播訊息給事件參與者
    * @param  int       $eventId    事件id en_event.row_id
    * @param  Array    $queryParam  呼叫pushAPI時的必要參數，EX :array('lang' => 'en_us','need_push' => 'Y','project' => 'appens')
    * @return json
    */
   public function sendPushMessageToUser(){

       $result = null;
       $queryParam =  array(
                'lang'      => 'zh-tw',
                'need_push' => 'Y',
                'project'   => 'appensdev'
                );
       $to = array("BenQ\\Cleo.W.Chan");
       $from = "BenQ\\Cleo.W.Chan";
       $title_str = "中文CLEO TEST\ud83d\udc7f";
       $text_str = "test";
       $title = base64_encode(CommonUtil::jsEscape(html_entity_decode($title_str)));
       $text = base64_encode(CommonUtil::jsEscape(html_entity_decode($text_str)));
        var_dump($this->jsUnescape(base64_decode($title)));
       //TODO append ENS event link
       $pushResult = $this->push->sendPushMessage($from, $to, $title, $text, $queryParam);
       
       //$result = json_encode($pushResult);
       return $pushResult;
   }

   public function createChatRoom(){
        
       
        $owner = "Cleo.W.Chan";
        $members = array("Steven.Yan","Sammi.Yao");
        $desc = "cleo test create chatRoom";
        $project = "appensdev";
        //var_dump($messageGroupInfo);exit();
        $qMessage = new Message();
        $res = json_decode($qMessage->createChatRoom($owner, $members, $desc));
        if($res->ResultCode != 1){
            if($res->ResultCode == '998002'){

                return $result = response()->json(['ResultCode'=>ResultCode::_014918_memberNotRegistered,
                'Message'=>"新增聊天室失敗, 成員未註冊",
                'Content'=>""]);

            }else if($res->ResultCode== '998003' ||
                    $res->ResultCode == '998004'){

                return $result = response()->json(['ResultCode'=>ResultCode::_014919_chatroomMemberInvalid,
                'Message'=>"聊天室成員不存在",
                'Content'=>""]);
            }else{
                 return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
                 'Content'=>""]);
            }
        }
   }


    public static function replace_unicode_escape_sequence($match) {
        return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');

    }

    public static function unicodeDecode($data) {
        return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', 'self::replace_unicode_escape_sequence', $data);
    }

   public function testlog(){
        $rs = \DB::connection('mysql_qplay')->table("qp_api_log")->where('row_id','138897')->get();
        var_dump($rs);
   }

   /**
    * 取得事件聊天室清單
    * @return
    */
   public function getChatRoomList(){
        $userName = 'Cleo.W.Chan';
        $qMessage = new Message();
       $res = json_decode($qMessage->getChatRoomList($userName));
       var_dump($res);
   }

   /**
    * 刪除聊天室
    * @return
    */
   public function deleteChatRoom(){
       $gid = '22957935';
       $qMessage = new Message();
       $res = json_decode($qMessage->deleteChatRoom($gid));
       var_dump($res);
   }

   public function testEns(){
     $input = Input::get();
     $data = [];
     $project = $input['project'];
     $empNo = '1607279';
     $eventType = '';
     $eventStatus = '';
     $eventList = $this->eventService->getEventList($project, $empNo, $eventType, $eventStatus);
     $data['eventList'] = $eventList;
     $data['project'] = $project;
     return \View::make('test.event_list')->with("data", $data);
   }
}

