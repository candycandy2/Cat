<?php
namespace App\Services;

use App\lib\JMessage;
use Illuminate\Support\Facades\Log;
use App\Repositories\HistoryRepository;
use App\Repositories\MngHistoryRepository;
use App\lib\CommonUtil;
use Config;

class HistoryService
{   
    protected $dateTimeUrl;
    protected $cursorUrl;
    protected $jmessage;
    protected $historyData=[];
    protected $historyFileData=[];

    protected $retry=0;


    protected $userRepository;

    public function __construct( HistoryRepository $historyRepository,
                                MngHistoryRepository $mngHistoryRepository)
    {
        $this->historyRepository = $historyRepository;
        $this->mngHistoryRepository = $mngHistoryRepository;
        $this->jmessage = new JMessage(Config::get("app.app_key"),Config::get("app.master_secret"));
    }

    /**
     * 依據時間區間取得訊息
     * @param  String $beginTime 開始時間 Y-m-d H:i:s
     * @param  String $endTime   結束時間 Y-m-d H:i:s
     * @param  int    $count     每次抓取的訊息筆數
     * @return json
     */
    public function getMessageWithDateTime($beginTime, $endTime, $count){
        
        $method = 'messages';
        $parameter = '?count='.$count.'&begin_time='.$beginTime.'&end_time='.$endTime;

        $this->dateTimeUrl = JMessage::API_V2_URL.$method.$parameter;
        return $this->jmessage->exec('GET', $this->dateTimeUrl);
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

        $method = 'messages';
        $parameter = '?count='.$count.'&cursor='.$result->cursor;

        $this->cursorUrl =JMessage::API_V2_URL.$method.$parameter;

        $res = $this->jmessage->exec('GET', $this->cursorUrl );
        if(isset($res->error)){
                //使用cursor取資料時發生錯誤,回到使用datetime呼叫API
                Log::info('cursor time out ,back to retry datetime');
                $this->getMessageAndFile($beginTime, $endTime, $count);
        }else{
             //整理使用dateime呼叫的資料
            $this->arrangeMessageData($res);
            if(isset($res->cursor)){
                $this->jmessage->getMessageWithCursor($res, $count, $beginTime, $endTime);
            }else{
                 Log::info('cursor end 2:'.json_encode($res));
                return;
            }
        }
    }


    /**
     * 透過MediaId取得檔案真實路徑
     * @param  String $mediaId JMessage回傳的json格式中包含的media_id
     * @return String 檔案的真實路徑 
     */
    private function getMedia($mediaId){
        $method = 'resource';
        $parameter = '?mediaId='.$mediaId;
        $url = JMessage::API_V1_URL.$method. $parameter;
        return $this->jmessage->exec('GET', $url);
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
     * 歷史消息寫入MySql
     * @param  array $historyData     歷史消息(訊息)
     * @param  array $historyFileData 歷史消息(圖片)
     */
    public function newMySQLHistory($historyData, $historyFileData){
        $this->historyRepository->insertHistory($historyData);
        Log::info('History預計寫入，共'.count($historyData).'筆');
        $this->historyRepository->insertHistoryFile($historyFileData);
        Log::info('HistoryFile，預計寫入，共'.count($historyFileData)."筆");
    }

    /**
     * 歷史消息寫入MongoDB
     * @param  array $historyData     歷史消息(訊息)
     * @param  array $historyFileData 歷史消息(圖片)
     */
    public  function newMongoHistory($historyData, $historyFileData){
        $this->mngHistoryRepository->insertHistory($historyData);
        $this->mngHistoryRepository->insertHistoryFile($historyFileData);
    }

    /**
     * 依取時間得歷史訊息
     * @param  int $groupId      聊天室id
     * @param  int $start        開始時間 timestamp
     * @param  int $end          結束時間 timestamp
     * @param  int $sort         0:asc | 1:desc
     * @return mixed    
     */
    public function getHistoryByTime($groupId, $start, $end, $sort){
        return $this->historyRepository->getHistoryByTime($groupId, $start, $end, $sort);
    }

    /**
     * 依指標取得歷史訊息
     * @param  int $groupId    聊天室id
     * @param  string $cursor  指標
     * @param  int $sort         0:asc | 1:desc
     * @return mixed
     */
    public function getHistoryByCursor($groupId, $cursor, $sort){
        return $this->historyRepository->getHistoryByCursor($groupId, $cursor, $sort);
    }

    /**
     * 取得欲寫入DB的歷史資訊
     * @return Array
     */
    private function getData(){
       return array('historyData'=> $this->historyData, 'historyFileData'=> $this->historyFileData);
    }

    /**
     * 清空訊息資料
     */
    private function clearData(){
        $this->historyData = [];
        $this->historyFileData =[];
    }

    /**
     * 整理history,historyFile的寫入資訊
     * @param  object 從JMessage取得回來的訊息資料
     */
    private function arrangeMessageData($result){
        
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
            $history['create_time']= $message->create_time;
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
    private function downloadFile($url){
        $targetPath = './'.Config::get('app.file_path');
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
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
        curl_setopt($curl, CURLOPT_PROXY,'proxyt2.benq.corp.com:3128');
        curl_setopt($curl, CURLOPT_PROXYUSERPWD,'Cleo.W.Chan:1234qwe:2');

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