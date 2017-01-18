<?php
namespace App\lib;
use App\Services\EventService;

/**
 * 
 * User: Cleo.W.Chan
 * Date: 16-12-16
 * Time: 下午1:25
 */

use Request;
use Illuminate\Support\Facades\Input;
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
        
        if($headerContentType == null || (trim($headerContentType) != "application/json" && trim($headerContentType) != "application/x-www-form-urlencoded")) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=> "Content-Type錯誤");
        }

        if(count($input) == 0 || !array_key_exists('strXml', $input) || trim($input["strXml"]) == "") {
            return array("code"=>ResultCode::_999007_inputJsonFormatInvalid,
                "message"=>"傳入的json格式錯誤, Server端無法解析");
        }
    
        libxml_use_internal_errors(true);
        $xml=simplexml_load_string($input['strXml']);

        if ($xml === false) {
             return array("code"=>ResultCode::_999007_inputJsonFormatInvalid,
            "message"=>"傳入的xml格式錯誤, Server端無法解析");
        }

        if(!isset($xml->emp_no[0]) || (string)$xml->emp_no[0] == "" ){
             return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=>"傳入參數不足或傳入參數格式錯誤");
        }

        $empNo =  $xml->emp_no[0];
        $userStatus = CommonUtil::getUserStatusByUserEmpNo($empNo);
        if($userStatus == 0) {
            return array("code"=>ResultCode::_014908_accountNotExist,
                "message"=>"帳號不存在");
        }
        if($userStatus == 1) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                "message"=>"員工資訊錯誤");
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                "message"=>"帳號已被停權");
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    /**
     * 檢察關聯事件是否存在或已被關聯
     * @param  int $relatedId event_row_id
     * @param  EventService $eventService
     * @return 
     */
    public function checkRelatedEvent($relatedId, EventService $eventService){
        
        if( preg_match("/^[1-9][0-9]*$/", $relatedId) == 0){
             return array('code'=>ResultCode::_014905_fieldFormatError,
            'message'=>"關聯事件欄位格式錯誤");
        }

        $event = $eventService->getRelatedEventById($relatedId);
        if(is_null($event) || count($event) == 0){
             return array('code'=>ResultCode::_014904_noEventData,
            'message'=>"查無關連事件資料，或事件已被關聯");
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
        "message"=>"");
    } 
    

}