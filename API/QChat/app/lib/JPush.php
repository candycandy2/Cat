<?php
/**
 * 處理與JMessage相關元件
 */
namespace  App\lib;

use App\lib\CommonUtil;
use Illuminate\Support\Facades\Log;
use App\lib\ResultCode;
use Config;

class JPush
{    

    protected $appKey;
    protected $masterSecret;
    protected $options;

    public $pushData;

    const API_V3_URL = 'https://api.jpush.cn/v3/push';


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
        $this->initPushData();
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
            throw new \Exception("Call JPush API error occur, url:".$url , $result->error);
        }
        $result = json_decode($result);

        return $result;
    }


    public function initPushData(){

        $this->pushData = array(
            "platform"=>array("ios","android"),
            "audience"=>array(
                    "registration_id"=>array()
                ),
            "notification"=>array(
                    "android" =>array(
                            "alert"=> "",
                            "title"=> "",
                            "builder_id"=>1,
                            "extras" => array(
                                "Parameter"=> ""
                            )
                        ),
                    "ios"=>array(
                            "alert"=> array(
                                "title"=>"",
                                "body"=>""
                            ),
                            "sound"=> "default",
                            "badge"=> "0",
                            "extras" => array(
                                "Parameter"=> ""
                            )

                        )
                ),
            "options"=>array(
                    "time_to_live"=>Config::get('app.time_to_live'),
                    "apns_production"=> Config::get('app.apns_flag')
                )
        );

    }

    public function setReceiver(Array $to){
        $this->pushData["audience"]["registration_id"] = $to;
        return $this;
    }

    public function setTitle($title){
        $this->pushData["notification"]["android"]["alert"] = $title;
        $this->pushData["notification"]["ios"]["alert"]['title'] = $title;
        return $this;
    }

    public function setDesc($desc){
        $this->pushData["notification"]["android"]["alert"]['body'] = $desc;
        $this->pushData["notification"]["ios"]["alert"]['body'] = $desc;
        return $this;
    }

    public function send(){
        //var_dump( base64_encode($this->getAuth()));
        //var_dump(json_encode($this->pushData));exit();
        return $this->exec("POST", self::API_V3_URL, json_encode($this->pushData));
    }
}