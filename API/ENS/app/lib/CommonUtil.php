<?php
/**
 * 通用元件庫
 */
namespace App\lib;
use Config;

class CommonUtil
{
    /**
     * 預先處理json格式
     * @param  String $input 傳入的json格式字串
     * @return String
     */
    public static function prepareJSON($input){
        $input = mb_convert_encoding($input,'UTF-8','ASCII,UTF-8,ISO-8859-1');
        if(substr($input,0,3) == pack("CCC",0xEF,0xBB,0xBF)) $input = substr($input,3);
        return $input;
    }

    /**
     * 檢查用戶狀態
     * @param  String $empNo 員工編號
     * @return boolean       true:該用戶存在|false:用戶不存在
     */
    public static function checkUserStatusByUserEmpNo($empNo)
    {   
        $result = true;
        $userList = \DB::connection('mysql_qplay')->table('qp_user')
            -> where('emp_no', '=', $empNo)
            -> where('status', '<>', 'N')
            -> where('resign', '<>', 'Y')
            -> select('row_id', 'status', 'resign','emp_no')->get();

        if(count($userList) < 1) {
            $result = false; //用户不存在
        }
        return $result;
    }

    /**
     * 依參數類型取得事件類型對應表
     * @param  String $parameterType 參數類型 en_parameter_type.parameter_type_name (ex : event_type 表事件類型參數)
     * @return Array  array(parameter_value=>parameter_name)
     */
    public static function getParameterMapByType($parameterType){
       
       $res = \DB::table('en_parameter')
             ->where('en_parameter_type.parameter_type_name', $parameterType)
             ->select('parameter_name','parameter_value')
             ->join('en_parameter_type','en_parameter.parameter_type_row_id','=','en_parameter_type.row_id')
             ->get();
      
       $parameterMap = [];
       foreach ($res as  $value) {
            $parameterMap[$value->parameter_value] = $value->parameter_name;
       }
       return $parameterMap;
    }

    /**
     * 從xml中找出要更新的資料並回傳資料
     * @param  String $xml         requestData
     * @param  Array  $dataField   資料欄位
     * @return Array
     */
    public static function arrangeDataFromXml($xml, $dataField){
        
         $data = [];
         foreach ( $dataField as $column) {
             if(isset($xml->$column[0])){
                $data[$column] = trim((string)$xml->$column[0]);
             }
         }
         return $data;
    }

    /**
     * 呼叫API
     * @param  String      $method 呼叫方式(POST|GET)
     * @param  String      $url    API網址
     * @param  Array|array $header request header
     * @param  boolean     $data   傳遞的參數
     * @return mixed               API result
     */
    public static function callAPI($method, $url, Array $header = array(), $data = false)
        {
            $curl = curl_init();

            switch ($method)
            {
                case "POST":
                    curl_setopt($curl, CURLOPT_POST, 1);

                    if ($data)
                        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                    break;
                case "PUT":
                    curl_setopt($curl, CURLOPT_PUT, 1);
                    break;
                default:
                    if ($data)
                        $url = sprintf("%s?%s", $url, http_build_query($data));
            }

            // Optional Authentication:
            //設定header
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
            curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            if( ! $result = curl_exec($curl)) 
            { 
                trigger_error(curl_error($curl)); 
            } 

            curl_close($curl);

            return $result;
        }

    /**
     * 取得與QPlay Api 溝通的Signature
     * Base64( HMAC-SHA256( SignatureTime , AppSecretKey ) )
     * @param  timestamp $signatureTime 時間戳記
     * @return String    加密後的字串
     */
    public static function getSignature($signatureTime, $appKey)
        {
            $appKey = self::getProjectName($appKey);
            $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, Config::get('app.secret_key.'.$appKey), true));
            return $ServerSignature;
        }


    /**
     * 將字串做javascript escape
     * @param  string $str Utf-8字串
     * @return string      javascript escape 後的字串
     */
    public static function jsEscape($str){
        $ret = '';
        $len = mb_strlen($str);
        for ($i = 0; $i < $len; $i++)
        {
            $oriStr = mb_substr( $str,$i,1,"utf-8");
            $uniStr = self::utf8_str_to_unicode($oriStr);
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


    /**
     * 根據輸入環境取得appkey
     * @return String 
     */
    public static function getContextAppKey($env,$key){
        $env = strtolower($env);
        $key = "app".$key;
        switch ($env)
        {
            case  "dev":
                $key = $key."dev";
                break;
            case  "test":
                $key = $key."test";
                break;
            case  "production":
                break;
            default :
                break;
        }
        return $key;
    }

    /**
     * 過濾掉環境便數，取得原始app專案名稱
     * @param  String $appKey 加上環境變數後的appKey
     * @return String                ex : appqplaydev，處理後會回傳qplqy
     */
    public static function getProjectName($appKey){
        $projectName = preg_replace("/^app/", '',$appKey);
        if(Config::get('app.env')!= 'production' ){
            $projectName = preg_replace("/".Config::get('app.env')."$/", '',trim($projectName));
        }
        return trim($projectName);
    }

    /**
     * 檢查用戶狀態
     * @param  String $loginId 使用者帳號
     * @return int             使用這狀態(0:用戶不存在|1:已離職|2:已停權|3.正常)
     */
    public static function getUserStatusJustByUserID($loginId)
    {
        $userList = \DB::connection('mysql_qplay')->table('qp_user')
            -> where('qp_user.login_id', '=', $loginId)
            -> select('qp_user.row_id', 'qp_user.status', 'qp_user.resign')->get();
        if(count($userList) < 1) {
            return 0; //用户不存在
        }

        if(count($userList) == 1) {
            $user = $userList[0];
            if($user->resign != "N") {
                return 1; //用户已离职
            }

            if($user->status != "Y") {
                return 2; //用户已停权
            }
        } else {
            foreach ($userList as $user)
            {
                if($user->resign == "N") {
                    if($user->status == "Y") {
                        return 3; //正常
                    } else {
                        return 2; //停权
                    }
                }
            }
            return 1;  //离职
        }

        return 3; //正常
    }
}