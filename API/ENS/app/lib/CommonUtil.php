<?php
/**
 * 通用元件庫
 */
namespace App\lib;

class CommonUtil
{
    /**
     * 預先處理json格式
     * @param  [type] $input [description]
     * @return [type]        [description]
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
        $userList = \DB::table('en_user')
            -> where('en_user.emp_no', '=', $empNo)
            -> where('en_user.status', '<>', 'N')
            -> where('en_user.resign', '<>', 'Y')
            -> select('en_user.row_id', 'en_user.status', 'en_user.resign','en_user.emp_no')->get();

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
     * 依欲更新欄位取得資料結構
     * @param  String $xml         requestData
     * @param  Array  $dataField   資料欄位
     * @return Array
     */
    public static function arrangeUpdateDataFromXml($xml, $dataField){
         $data = array('updated_user'=>(string)$xml->emp_no[0]);
         foreach ( $dataField as $column) {
             if(isset($xml->$column[0])){
                $data[$column] = (string)$xml->$column[0];
             }
         }
         return $data;
    }

    /**
     * 依欲新增欄位取得資料結構
     * @param  String $xml         requestData
     * @param  Array  $dataField   資料欄位
     * @return Array
     */
    public static function arrangeInsertDataFromXml($xml, $dataField){
        $data = array('created_user'=>(string)$xml->emp_no[0]);
        foreach ( $dataField as $column) {
             if(isset($xml->$column[0])){
                $data[$column] = (string)$xml->$column[0];
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
    public static function getSignature($signatureTime)
        {
            $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, 'swexuc453refebraXecujeruBraqAc4e', true));
            return $ServerSignature;
        }

}