<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use Illuminate\Http\Request;

use App\Http\Requests;

class rrsController extends Controller
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

    public function ReserveMeetingRoom()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("ReserveMeetingRoom");//"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/ReserveMeetingRoom";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"], 
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function ReserveCancel()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("ReserveCancel");//"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/ReserveCancel";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function QuickReserve()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("QuickReserve");//"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/QuickReserve";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function QueryReserveDetail()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("QueryReserveDetail");//"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/QueryReserveDetail";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function QueryMyReserve()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("QueryMyReserve"); //"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/QueryMyReserve";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function ListAllManager()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("ListAllManager"); //"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/ListAllManager";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"], 
                "Content"=>""));
        }
    }

    public function ListAllMeetingRoom()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("ListAllMeetingRoom"); //"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/ListAllMeetingRoom";
            return $this->GetData($url, $verifyResult["token_valid_date"]);
        } else {
            return response()->json(array("ResultCode"=>$verifyResult["code"],
                "Message"=>$verifyResult["message"],
                "Content"=>""));
        }
    }

    public function ListAllTime()
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyRRS();

        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $url = CommonUtil::getApiCustomerUrl("ListAllTime"); //"http://ip-web01.qgroup.corp.com/RRS/RRSForQPlayAPI.asmx/ListAllTime";
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
