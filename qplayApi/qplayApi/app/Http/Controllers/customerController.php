<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use Illuminate\Http\Request;

use App\Http\Requests;

class yellowpageController extends Controller
{
    public function GetData($url, $tokenValid) {
        $content = file_get_contents('php://input');
        $data["strXml"] = $content;
        $result = $this->post2($url, $data);

        $xml = simplexml_load_string($result);
        $json = json_decode($xml);

        $resultCode = $json->ResultCode;
        $resultContent = "";
        if(property_exists($json, 'Content')) {
            $resultContent = $json->Content;
        }
        $message = CommonUtil::getMessageContentByCode($resultCode); //TODO
        return response()->json(array("ResultCode"=>$resultCode,
            "token_valid"=>$tokenValid,
            "Message"=>$message,
            "Content"=>$resultContent));
    }

    public function process()
    {
        $app_key = "";
        $function_Name = "";
        
        $Verify = new Verify();
        $verifyResult = $Verify->verifyCustomer();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl($app_key, $function_Name);//"http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryEmployeeData";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"], 
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function QueryEmployeeDataDetail()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyYellowPage();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("QueryEmployeeDataDetail");//"http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryEmployeeDataDetail";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function AddMyPhoneBook()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyYellowPage();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("AddMyPhoneBook");//"http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/AddMyPhoneBook";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function DeleteMyPhoneBook()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyYellowPage();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("DeleteMyPhoneBook");//"http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/DeleteMyPhoneBook";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function QueryMyPhoneBook()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyYellowPage();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("QueryMyPhoneBook"); //"http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryMyPhoneBook";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function QueryCompanyData()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyYellowPage();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("QueryCompanyData"); //"http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryCompanyData";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function do_post_request($url, $data, $optional_headers = null)
    {
        $params = array('http' => array(
            'method' => 'POST',
            'content' => $data
        ));
        if ($optional_headers !== null) {
            $params['http']['header'] = $optional_headers;
        }
        $ctx = stream_context_create($params);
        $fp = @fopen($url, 'rb', false, $ctx);
        if (!$fp) {
            //throw new Exception("Problem with $url, $php_errormsg");
        }
        $response = @stream_get_contents($fp);
        if ($response === false) {
            //throw new Exception("Problem reading data from $url, $php_errormsg");
        }
        return $response;
    }

    public function post($url, $post_data = '', $timeout = 5){//curl
        $ch = curl_init();
        curl_setopt ($ch, CURLOPT_URL, $url);
        curl_setopt ($ch, CURLOPT_POST, 1);
        if($post_data != ''){
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        }
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_HEADER, false);
        $file_contents = curl_exec($ch);
        curl_close($ch);
        return $file_contents;
    }

    public function post2($url, $data){//file_get_content
        $postdata = http_build_query($data);

        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata
            )
        );
        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        return $result;
    }
}
