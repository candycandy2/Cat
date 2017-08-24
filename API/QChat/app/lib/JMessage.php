<?php
/**
 * 處理與JMessage相關元件
 */
namespace  App\lib;

use App\lib\CommonUtil;
use Config;
use Illuminate\Support\Facades\Log;

class JMessage {

    private $appKey;
    private $masterSecret;
    private $options;

    const API_V1_URL = 'https://api.im.jpush.cn/v1/';
    const API_V2_URL = 'https://report.im.jpush.cn/v2/';


    /**
     * JMessage constructor.
     * @param String $appKey env.APP_ID 跟JMessage註冊時的app key
     * @param String $masterSecret env.SECRET_KEY 跟JMessage註冊時的 masterSecret
     * @param Array  $options 其他設定
     */
    public function __construct($appKey, $masterSecret, array $options = []) {
        $this->appKey = $appKey;
        $this->masterSecret = $masterSecret;
        $this->options = $options;
    }

    /**
     * 取得權限認證 (appkey:masterSecret)
     * @return String 權限認證字串
     */
    public function getAuth() {
        return $this->appKey . ':' . $this->masterSecret;
    }

    /**
     * 透過MediaId取得檔案真實路徑
     * @param  String $mediaId JMessage回傳的json格式中包含的media_id
     * @return String 檔案的真實路徑 
     */
    public function getMedia($mediaId){
        $url = self::API_V1_URL.'resource?mediaId='.$mediaId;
        return $this->callJmessageAPI('GET', $url);
    }

    /**
     * 取得歷史訊息(寫入DB的資料)
     * @param  String $beginTime 開始時間 Y-m-d H:i:s
     * @param  String $endTime   結束時間 Y-m-d H:i:s
     * @param  int    $count     每次抓取的訊息筆數
     * @return mixed             成功 : array('historyData'=>$this->historyData,
     *                                 'historyFileData'=>$this->historyFileData);
     *                           失敗 : return JMessageAPI error
     */
    public function getMessageAndFile($beginTime, $endTime, $count){
        $dataContainer = array('historyData'=>[], 'historyFileData'=>[]);
        $result =  $this->getMessageWithDateTime($beginTime, $endTime, $count);
        if(isset($result->error)){
            return $result;
        }
        $this->arrangeMessageData($result, $dataContainer);
        if(isset($result->cursor)){
            $cursorRes = $this->getMessageWithCursor($result, $count, $dataContainer);
            if(isset($cursorRes->error)){
                return $cursorRes;
            }
        }
        return $dataContainer;
    }

    /**
     * 依據時間區間取得訊息
     * @param  String $beginTime 開始時間 Y-m-d H:i:s
     * @param  String $endTime   結束時間 Y-m-d H:i:s
     * @param  int    $count     每次抓取的訊息筆數
     * @return json
     */
    private function getMessageWithDateTime($beginTime, $endTime, $count){ 
        $url = self::API_V2_URL.'messages?count='.$count.'&begin_time='.$beginTime.'&end_time='.$endTime;
        return $this->callJmessageAPI('GET', $url);
    }

    /**
     * 依cursor取得訊息
     * @param  json  $result  Jmessage回傳的訊息資料
     * @param  int   $count     每次抓取的訊息筆數
     * @param  array &$dataContainer 本次執行準備要寫入的資料陣列
     * @return json
     */
    private function getMessageWithCursor($result, $count, &$dataContainer ){
        if(!isset($result->cursor)){
            return  $result;
        }
        $url = self::API_V2_URL.'messages?count='.$count.'&cursor='.$result->cursor;
        
        $res = $this->callJmessageAPI('GET', $url);
        
        $this->arrangeMessageData($res, $dataContainer);
        $this->getMessageWithCursor($res, $count, $dataContainer);
    }

    /**
     * 呼叫JMessageAPI
     * @param  String $method Http method GET/PUT/POST/DELETE/HEAD/PATCH
     * @param  String $url    API 呼叫網址
     * @param  Array|array $header request header
     * @param  boolean     $data   傳遞的參數
     * @return object
     */
    public function callJmessageAPI($method, $url, $data = false){
        $secretKey = base64_encode($this->getAuth());
        $header = array(
                         'Content-Type: application/json',
                         'Authorization: Basic '.$secretKey
                        );
        Log::info('JMessage API Url: '.$url);
        $result = CommonUtil::callAPI($method, $url,  $header, $data);
        $rs = json_decode($result);
        $rs->requestUrl=$url;
        Log::info('Result get!');
        return $rs;
    }

    /**
     * 整理history,historyFile的寫入資訊
     * @param  object 從JMessage取得回來的訊息資料
     * @param  array &$dataContainer 本次執行準備要寫入的資料陣列
     */
    private function arrangeMessageData($result, &$dataContainer ){
        if(isset($result->error)){
            return $result;
        }
        foreach ($result->messages as $message) {
            $history = [];
            $history['msg_id'] = $message->msgid;
            $history['msg_type'] = $message->msg_type;
            $history['from_id'] = $message->from_id;
            $history['from_type'] = $message->from_type;
            $history['target_id'] = $message->target_id;
            $history['target_name'] = $message->target_name;
            $history['target_type'] = $message->target_type;
            $history['ctime']= $message->msg_ctime;
            $history['content']= json_encode($message->msg_body);
            $dataContainer['historyData'][]=$history;
            //檔案類型寫入 qm_message_file
            if($message->msg_type == 'image'){
                $media = $this->getMedia($message->msg_body->media_id);
                $file = $this->downloadFile($media->url);
                $historyFile = [];
                $historyFile['msg_id'] = $message->msgid;
                $historyFile['fname'] =  $file['fname'];
                $historyFile['fsize'] =  $message->msg_body->fsize;
                $historyFile['format'] = $file['format'];
                $historyFile['npath'] = $message->msg_body->media_id;
                $historyFile['lpath'] = $file['lpath'];
                $historyFile['spath'] = $file['spath'];
                $dataContainer['historyFileData'][]=$historyFile;
            }

        }
    }

    /**
     * 透過網址下載圖片到本地端
     * @param  String $url 下載網址
     */
    private function downloadFile($url){
        $targetPath = './'.Config::get('app.filePath');
        $imagePath = $targetPath .'/image/';
        $sImagePath = $targetPath .'/simage/';
        $filename = $imagePath. 'tmpfile';
        
        if (!file_exists($targetPath)) {
            mkdir($targetPath, 0755, true);
        }
        if (!file_exists($imagePath)) {
            mkdir($imagePath, 0755, true);
        }
        if (!file_exists($sImagePath)) {
            mkdir($sImagePath, 0755, true);
        }

        $headerBuff = fopen($targetPath.'/headers.txt', 'w+');
        $fileTarget = fopen($filename, 'w');
        $result = array('lpath'=>'',
                        'spath'=>'',
                        'fname'=>'',
                        'format'=>'');
        $ch = curl_init($url);

         //add for Develop
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,0);
        curl_setopt($ch, CURLOPT_PROXY,'proxyt2.benq.corp.com:3128');
        curl_setopt($ch, CURLOPT_PROXYUSERPWD,'Cleo.W.Chan:1234qwe:1');
        curl_setopt($ch, CURLOPT_WRITEHEADER, $headerBuff);
        curl_setopt($ch, CURLOPT_FILE, $fileTarget);
        curl_exec($ch);

        if(!curl_errno($ch)) {
          rewind($headerBuff);
          $headers = stream_get_contents($headerBuff);
          if(preg_match('/Content-Type:.\\s*([^ ]+)\n/', $headers, $matches)) {
            $fileType = array_search(trim($matches[1]),CommonUtil::getMineTypeMap());
            if(preg_match('/Content-Disposition: .*filename="([^ ]+)";/', $headers, $matches)) {
                fclose($fileTarget);
                $result['lpath'] = $imagePath.$matches[1].'.'.$fileType;
                $result['spath'] = $sImagePath.$matches[1].'.'.$fileType;
                $result['fname'] = $matches[1];
                $result['format'] = $fileType;
                rename($filename,$result['lpath']);
                CommonUtil::compressImage($result['lpath'],$result['spath'],10);

            }
          }
        }
        curl_close($ch);
        fclose($headerBuff);
        Log::info('檔案下載完成: '.$result['fname'].'.'.$result['format']);
        return $result;
    }
}