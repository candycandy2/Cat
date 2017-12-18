<?php
/**
 * 
 * User: Cleo.W.Chan
 * Date: 16-12-16
 * Time: 下午1:25
 */

namespace App\lib;
use Illuminate\Support\Facades\Input;
use App\Model\QP_User as QP_User;
use App\lib\ResultCode as ResultCode;
use Request;
use DB;

class Verify
{

    /**
     * 1. 確認傳送資料是否為json
     *     Accept: application/json
     *     Content-Type: application/json
     *
     *     這三種方法是用來檢查 request 的 header。
     *     a. Request::isJson() 用來檢查 HTTP_CONTENT_TYPE是否存在 application/json
     *     b. Request::wantsJson用來檢查 HTTP_ACCEPT 是否存在 application/json
     *     c. Request::format 用來檢查 request 要求的回傳格式
     *
     * 2. 確認json格式 
     *     a.最外層一定要包strXml這個參數, 名稱大小寫皆不可更改
     *     {"strXml":"<LayoutHeader><emp_no>0407731</emp_no></LayoutHeader>"}
     *
     * 3. 確認以下必要參數是否傳遞
     *     a. emp_no
     *
     */
    public static function verify()
    {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = $request->header('Content-Type');
        
        if($headerContentType == null || trim($headerContentType) != "application/json") {
            return array("code"=>ResultCode::_025915_ContentTypeParameterInvalid,
                "message"=> "Content-Type錯誤");
        }

        if(count($input) == 0 || !array_key_exists('strXml', $input) || trim($input["strXml"]) == "") {
            return array("code"=>ResultCode::_025917_InputJsonFormatIsInvalid,
                "message"=>"傳入的json格式錯誤, Server端無法解析");
        }
    
        libxml_use_internal_errors(true);
        $xml=simplexml_load_string($input['strXml']);

        if ($xml === false) {
             return array("code"=>ResultCode::_025916_InputXmlFormatIsInvalid,
            "message"=>"傳入的xml格式錯誤, Server端無法解析");
        }
        if(count($xml->emp_no) != 1){
              return array('code'=>ResultCode::_025905_FieldFormatError,
                'message'=>"欄位格式錯誤");
        }
        $empNo = trim((string)$xml->emp_no[0]);
        if($empNo == "" ){
             return array("code"=>ResultCode::_025903_MandatoryFieldLost,
                "message"=>"必填字段缺失");
        }
        if( preg_match("/^[0-9]+$/", $empNo) == 0){
              return array('code'=>ResultCode::_025905_FieldFormatError,
                'message'=>"欄位格式錯誤");
        }
        if(!self::checkUserStatusByUserEmpNo($empNo)) {
            return array("code"=>ResultCode::_025908_AccountNotExist,
                "message"=>"帳號不存在");
        }
        
        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }


    /**
     * 檢查用戶狀態
     * @param  String $empNo 員工編號
     * @return boolean       true:該用戶存在|false:用戶不存在
     */
    public static function checkUserStatusByUserEmpNo($empNo)
    {   
        $result = true;
        $userList = QP_User::where('emp_no', '=', $empNo)
            -> where('status', '<>', 'N')
            -> where('resign', '<>', 'Y')
            -> select('row_id', 'status', 'resign','emp_no')->get();

        if(count($userList) < 1) {
            $result = false; //用户不存在
        }
        return $result;
    }
}