<?php
namespace App\lib;
use App\Services\EventService;
use App\Repositories\EventRepository;
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
        
        if($headerContentType == null || trim($headerContentType) != "application/json") {
            return array("code"=>ResultCode::_014915_contentTypeParameterInvalid,
                "message"=> "Content-Type錯誤");
        }

        if(count($input) == 0 || !array_key_exists('strXml', $input) || trim($input["strXml"]) == "") {
            return array("code"=>ResultCode::_014917_inputJsonFormatInvalid,
                "message"=>"傳入的json格式錯誤, Server端無法解析");
        }
    
        libxml_use_internal_errors(true);
        $xml=simplexml_load_string($input['strXml']);

        if ($xml === false) {
             return array("code"=>ResultCode::_014916_inputXmlFormatInvalid,
            "message"=>"傳入的xml格式錯誤, Server端無法解析");
        }
        $empNo = trim((string)$xml->emp_no[0]);
        if($empNo == "" ){
             return array("code"=>ResultCode::_014903_mandatoryFieldLost,
                "message"=>"必填欄位缺失");
        }
        if( preg_match("/^[0-9]*$/", $empNo) == 0){
              return array('code'=>ResultCode::_014905_fieldFormatError,
                'message'=>"欄位格式錯誤");
        }
        if(!CommonUtil::checkUserStatusByUserEmpNo($empNo)) {
            return array("code"=>ResultCode::_014908_accountNotExist,
                "message"=>"帳號不存在");
        }
        
        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    /**
     * 檢察關聯事件是否存在或已被關聯
     * @param  String         $project       project
     * @param  int            $relatedId    qp_event.row_id
     * @param  EventService   $eventService 傳入eventService物件
     * @param  int            $eventId      qp_event.row_id (非必填)
     * @return 
     */
    public function checkRelatedEvent($project, $relatedId, EventService $eventService, $eventId=null){
        
        if( preg_match("/^[1-9][0-9]*$/", $relatedId) == 0){
             return array('code'=>ResultCode::_014905_fieldFormatError,
            'message'=>"欄位格式錯誤");
        }
        //關聯自己
        if($eventId == $relatedId ){
             return array('code'=>ResultCode::_014911_relatedEventStatusError,
            'message'=>"關聯事件狀態異常");
        }
        //檢查事件所屬app
        $eventData = $eventService->getEventById($project, $relatedId);
        if(count($eventData) == 0){
            return array('code'=>ResultCode::_014911_relatedEventStatusError,
            'message'=>"關聯事件狀態異常");
        }
        //事件已被關聯
        $eventRet = $eventService->getRelatedStatusById($relatedId);
        if(is_null($eventRet) || ($eventRet->related_event_row_id != 0 && $eventRet->related_event_row_id != $eventId)){
             return array('code'=>ResultCode::_014911_relatedEventStatusError,
            'message'=>"關聯事件狀態異常");
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
        "message"=>"");
    } 
    
    /**
     * 檢查事件是否已完成
     * @param  int          $eventId            en_event.row_id
     * @param  EventRepository $eventRepository eventRepository
     * @return boolean                          true:已完成|false:未完成
     */
    public function isEventClosed($eventId, EventRepository $eventRepository){
        $event = $eventRepository->getEventStatus($eventId);
        if($event->event_status == 1){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 檢查時間戳記是否合法
     * @param  String             $timpStemp  時間戳記
     * @return boolean            true:合法|false:不合法
     */
    public function checkTimeStemp($timpStemp){
        if( preg_match("/^[0-9]{10}$/", $timpStemp) == 0){
           return false;         
        }
        return true;
    }
}