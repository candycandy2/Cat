<?php
/**
 * 測試用Controller
 */
namespace App\Http\Controllers;

use App\Components\Push;
use App\lib\CommonUtil;
use Request;

class testController extends Controller
{

    protected $push;

    const EVENT_TYPE = 'event_type';
    const STATUS_FINISHED = '1';
    const STATUS_UNFINISHED = '0';

    public function __construct(Push $push)
    {

        $this->push = $push;
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
    public function utf8_str_to_unicode($utf8_str) {
        $conv = json_encode($utf8_str);
        $conv = preg_replace('/\\\u/', '%u', $conv);
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
    * @param  Array    $queryParam  呼叫pushAPI時的必要參數，EX :array('lang' => 'en_us','need_push' => 'Y','app_key' => 'appens')
    * @return json
    */
   public function sendPushMessageToUser(){

       $result = null;
       $queryParam =  array(
                'lang'      => 'zh-tw',
                'need_push' => 'Y',
                'app_key'   => 'appensdev'
                );
       $to = array("BenQ\\Cleo.W.Chan");
       $from = "BenQ\\Cleo.W.Chan";
       $title_str = "CLEO TEST";
       $text_str = "test";
       $title = base64_encode(CommonUtil::jsEscape(html_entity_decode($title_str)));
       $text = base64_encode(CommonUtil::jsEscape(html_entity_decode($text_str)));
     
       //TODO append ENS event link
       $pushResult = $this->push->sendPushMessage($from, $to, $title, $text, $queryParam);
       
       $result = json_encode($pushResult);
       return $result;
   }

}

