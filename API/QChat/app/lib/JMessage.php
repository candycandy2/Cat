<?php
/**
 * 處理與JMessage相關元件
 */
namespace  App\lib;

use App\lib\CommonUtil;
use Config;
use Illuminate\Support\Facades\Log;
use App\lib\ResultCode;

class JMessage {

    protected $appKey;
    protected $masterSecret;
    protected $options;

    public $dateTimeUrl;
    public $cursorUrl;
    public $historyData=[];
    public $historyFileData=[];

    public $retry=0;

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
     * 取得欲寫入DB的歷史資訊
     * @return Array
     */
    public function getData(){
       return array('historyData'=> $this->historyData, 'historyFileData'=> $this->historyFileData);
    }

    /**
     * 清空訊息資料
     */
    public function clearData(){
        $this->historyData = [];
        $this->historyFileData =[];
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
        $this->clearData();
        $result =  $this->getMessageWithDateTime($beginTime, $endTime, $count);
         if(isset($result->error)){
            //首次取得資料時發生time out,重新使用datetime呼叫API，重試三次後斷開
            if($result->error == 28 && $this->retry <3){
                $this->retry ++;
                Log::info('datetime time out,retry: '.$this->retry);
                $this->getMessageAndFile($beginTime, $endTime, $count);
            }else{
                return $result;
            }
         }else{
            $this->retry =0;
            Log::info($beginTime.' ~ '.$endTime.'，共'.$result->total.'筆資料');
             //整理使用dateime呼叫的資料
            $this->arrangeMessageData($result);
            if(isset($result->cursor)){
                $result = $this->getMessageWithCursor($result, $count, $beginTime, $endTime);
            }
         }
        $rs = $this->getData();
        return $rs;
    }

    /**
     * 依據時間區間取得訊息
     * @param  String $beginTime 開始時間 Y-m-d H:i:s
     * @param  String $endTime   結束時間 Y-m-d H:i:s
     * @param  int    $count     每次抓取的訊息筆數
     * @return json
     */
    public function getMessageWithDateTime($beginTime, $endTime, $count){ 
        $this->dateTimeUrl = self::API_V2_URL.'messages?count='.$count.'&begin_time='.$beginTime.'&end_time='.$endTime;
        return $this->callJmessageAPI('GET', $this->dateTimeUrl);
    }

    /**
     * 依cursor取得訊息
     * @param  json  $result    Jmessage回傳的訊息資料
     * @param  int   $count     每次抓取的訊息筆數
     * @param  string $beginTime 本次的開始時間 (重跑用)
     * @param  string $endTime   本次的結束時間 (重跑用)
     * @return json
     */
    public function getMessageWithCursor($result, $count, $beginTime, $endTime){
        if(!isset($result->cursor)){
            Log::info('cursor end 1:'.json_encode($result));
            return;
        }
        $this->cursorUrl = self::API_V2_URL.'messages?count='.$count.'&cursor='.$result->cursor;
        $res = $this->callJmessageAPI('GET', $this->cursorUrl );
        if(isset($res->error)){
                //使用cursor取資料時發生錯誤,回到使用datetime呼叫API
                Log::info('cursor time out ,back to retry datetime');
                $this->getMessageAndFile($beginTime, $endTime, $count);
        }else{
             //整理使用dateime呼叫的資料
            $this->arrangeMessageData($res);
            if(isset($res->cursor)){
                $this->getMessageWithCursor($res, $count, $beginTime, $endTime);
            }else{
                 Log::info('cursor end 2:'.json_encode($res));
                return;
            }
        }
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
        if(isset($result->error)){
            if($result->error == 28){ //timeout
                return $result;
            }
            throw new Exception("Error Call JMessage API", $result->error);
        }
        $result = json_decode($result);
        $result->requestUrl=$url;
        //Log::info('Result get!');
        return $result;
    }

    /**
     * 整理history,historyFile的寫入資訊
     * @param  object 從JMessage取得回來的訊息資料
     */
    public function arrangeMessageData($result){
        
        if(isset($result->error)){
            return $result;
        }
        $retry = 0;
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
            $this->historyData[] = $history;
            //檔案類型寫入 qm_message_file
            if($message->msg_type == 'image'){
                $historyFile = [];
                $media = [];
                $media = $this->getMedia($message->msg_body->media_id);
                if(!isset($media->url) && $retry < 3){
                    $retry ++;
                    Log::info('get image error,retry: '.$retry);
                    Log::info('get image error,content: '.json_encode($media));
                    $media = $this->getMedia($message->msg_body->media_id);
                }
                $file = $this->downloadFile($media->url);
                $historyFile['msg_id'] = $message->msgid;
                $historyFile['fname'] =  $file['fname'];
                $historyFile['fsize'] =  $message->msg_body->fsize;
                $historyFile['format'] = $file['format'];
                $historyFile['npath'] = $message->msg_body->media_id;
                $historyFile['lpath'] = $file['lpath'];
                $historyFile['spath'] = $file['spath'];
                $this->historyFileData[] = $historyFile;
            }
        }
    }

    /**
     * 透過網址下載圖片到本地端
     * @param  String $url 下載網址
     */
    public function downloadFile($url){
        $targetPath = './'.Config::get('app.filePath');
        $imagePath = $targetPath .'/image/';
        $sImagePath = $targetPath .'/simage/';
        $filename = $imagePath. 'tmpfile';
        $api_max_exe_time = 5000; 
        
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
        $curl = curl_init($url);

         //add for Develop
        if(Config::get('app.env') == 'dev'){
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
            curl_setopt($curl, CURLOPT_PROXY,'proxyt2.benq.corp.com:3128');
            curl_setopt($curl, CURLOPT_PROXYUSERPWD,'Cleo.W.Chan:1234qwe:1');
        }
        curl_setopt($curl, CURLOPT_TIMEOUT_MS, $api_max_exe_time);
        curl_setopt($curl, CURLOPT_WRITEHEADER, $headerBuff);
        curl_setopt($curl, CURLOPT_FILE, $fileTarget);
        curl_exec($curl);

        $retry = 1;
        $rs = curl_exec($curl);
        while(curl_errno($curl) == 28 && $retry <= 3){
            Log::info('download image retry times : ' . $retry);
            $rs = curl_exec($curl);
            $retry++;
        }
        if(!curl_errno($curl)) {
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
        curl_close($curl);
        fclose($headerBuff);
        //Log::info('檔案下載完成: '.$result['fname'].'.'.$result['format']);
        return $result;
    }
}