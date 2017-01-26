<?php
namespace App\lib;

class CommonUtil
{
    
    public static function prepareJSON($input){
        $input = mb_convert_encoding($input,'UTF-8','ASCII,UTF-8,ISO-8859-1');
        if(substr($input,0,3) == pack("CCC",0xEF,0xBB,0xBF)) $input = substr($input,3);
        return $input;
    }

    public static function getUserStatusByUserEmpNo($empNo)
    {   

        $userList = \DB::table('en_user')
            -> where('en_user.emp_no', '=', $empNo)
            -> select('en_user.row_id', 'en_user.status', 'en_user.resign','en_user.emp_no')->get();
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


    public static function getParameterMapByType($parameterTyp){
       
       $res = \DB::table('en_parameter')
             ->where('en_parameter_type.parameter_type_name', $parameterTyp)
             ->select('parameter_name','parameter_value')
             ->join('en_parameter_type','en_parameter.parameter_type_row_id','=','en_parameter_type.row_id')
             ->get();
      
       $parameterMap = [];
       foreach ($res as  $value) {
            $parameterMap[$value->parameter_value] = $value->parameter_name;
       }
       return $parameterMap;
    }

    public static function getParameterTypeInfoById($parameterTypeId){

        return \DB::table('en_parameter_type')
             ->where('row_id', $parameterTypeId)
             ->select('parameter_type_name','parameter_type_desc')
             ->get();
    }


    public static function arrangeUpdateDataFromXml($xml, $updateField){
         $data = array('updated_user'=>(string)$xml->emp_no[0]);
         foreach ( $updateField as $column) {
             if(isset($xml->$column[0]) && $xml->$column[0]!=""){
                $data[$column] = (string)$xml->$column[0];
             }
         }
         return $data;
    }

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
            // //設定header
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
            curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

            //$result = curl_exec($curl);
            //
            if( ! $result = curl_exec($curl)) 
            { 
                trigger_error(curl_error($curl)); 
            } 

            curl_close($curl);

            return $result;
        }

     public static function getSignature($signatureTime)
        {
            $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, 'swexuc453refebraXecujeruBraqAc4e', true));
            return $ServerSignature;

        }

}