<?php
/**
 * 處理與JMessage相關元件
 */
namespace  App\lib;

use App\lib\CommonUtil;
use Illuminate\Support\Facades\Log;
use App\lib\ResultCode;

class JMessage {

    protected $appKey;
    protected $masterSecret;
    protected $options;


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
     * 呼叫JMessageAPI
     * @param  String $method Http method GET/PUT/POST/DELETE/HEAD/PATCH
     * @param  String $url    API 呼叫網址
     * @param  Array|array $header request header
     * @param  json|boolean     $data   傳遞的參數
     * @return object
     */
    public function exec($method, $url, $data = false){
        $secretKey = base64_encode($this->getAuth());
        $header = array(
                         'Content-Type: application/json',
                         'Authorization: Basic '.$secretKey
                        );
        
        $result = CommonUtil::callAPI($method, $url,  $header, $data);
        if(isset($result->error)){
            if($result->error == 28){ //timeout
                return $result;
            }
            throw new \Exception("Call JMessage API error occur, url:".$url , $result->error);
        }
        $result = json_decode($result);

        return $result;
    }
}