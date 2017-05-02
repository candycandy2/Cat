<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Services\BasicInfoService;
use App\Services\UserService;
use App\Services\EventService;
use App\Repositories\EventRepository;
use App\Repositories\TaskRepository;
use Illuminate\Support\Facades\Input;
use DB;

class EventController extends Controller
{

    protected $eventService;
    protected $basicInfoService;
    protected $userService;
    protected $eventRepository;

    /**
     * 建構子，初始化引入相關服務
     * @param EventRepository  $eventRepository  事件Repository
     * @param EventService     $eventService     事件相關服務
     * @param BasicInfoService $basicInfoService 地點基本資訊服務
     * @param UserService      $userService      用戶服務
     * @param TaskRepository   $taskRepository   處理Repository
     */
    public function __construct(EventRepository $eventRepository, EventService $eventService, BasicInfoService $basicInfoService, UserService $userService)
    {
        $this->eventRepository = $eventRepository;
        $this->eventService = $eventService;
        $this->basicInfoService = $basicInfoService;
        $this->userService = $userService;
    }

    /**
     * 新增事件
     * @return json
     */
    public function newEvent(){

         $allow_user = "admin";

         \DB::beginTransaction();
         try{

            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                 $result = response()->json(['ResultCode'=>$verifyResult["code"],
                    'Message'=>$verifyResult["message"],
                    'Content'=>'']);
                return $result;
            }
            $input = Input::get();
            $xml=simplexml_load_string($input['strXml']);
            $empNo = trim((string)$xml->emp_no[0]);
            $data = $this->getInsertEventData($xml);
            $updateData = [];

            $userAuthList = $this->userService->getUserRoleList($empNo);
            if(!in_array($allow_user, $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }

            if(!isset($data['lang'])        || $data['lang']=="" || 
               !isset($data['need_push'])   || $data['need_push']=="" || 
               !isset($data['app_key'])     || $data['app_key']=="" || 
               !isset($data['event_title']) || $data['event_title']=="" ||
               !isset($data['event_type_parameter_value']) || $data['event_type_parameter_value'] =="" || 
               !isset($data['estimated_complete_date'])     || $data['estimated_complete_date'] == "" ||
               !isset($data['basicList'])   || $data['basicList']==""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            $parameterMap =  CommonUtil::getParameterMapByType($this->eventService::EVENT_TYPE);
            if(!in_array($data['event_type_parameter_value'],array_keys($parameterMap))){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014912_eventTypeError,
                    'Message'=>"事件類型錯誤",
                    'Content'=>""]);
            }

            if(!is_array($data['basicList'])){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }

            if(!$Verify->checkTimeStemp($data['estimated_complete_date'])){
                return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                'Message'=>"欄位格式錯誤",
                'Content'=>""]);
            }
            

            //has related
            if(isset($data['related_event_row_id']) && $data['related_event_row_id'] != ""){

                $verifyResult = $Verify->checkRelatedEvent($data['related_event_row_id'], $this->eventService);
                if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                     $result = response()->json(['ResultCode'=>$verifyResult["code"],
                        'Message'=>$verifyResult["message"],
                        'Content'=>'']);
                    return $result;
                }

            }            
            //check task
            foreach ($data['basicList'] as $key => $basicInfo) {
                if(trim($basicInfo['location']) == "" || trim($basicInfo['function']) == ""){
                    return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
                }

                if(!$this->basicInfoService->checkBasicInfo($basicInfo['location'],$basicInfo['function'])){
                      return $result = response()->json(['ResultCode'=>ResultCode::_014902_locationOrFunctionNotFound,
                    'Message'=>"Location或是Function錯誤",
                    'Content'=>""]);
                }
            }

            $queryParam =  array(
                'lang' => $data['lang'],
                'need_push' =>  $data['need_push'],
                'app_key' =>  $data['app_key']
                );
            //create event
            $eventId = $this->eventService->newEvent($empNo, $data, $queryParam);
            //send push
            $sendPushMessageRes = $this->eventService->sendPushMessageToEventUser($eventId, $queryParam, $empNo, 'new');
            if($sendPushMessageRes->result_code != 1){
                //新增事件時會發送推播，如遇到有人員離職或停權，則擋下提示修改BasicInfo
                if($sendPushMessageRes->result_code == '000914' || $sendPushMessageRes->result_code == '000912'){
                    \DB::rollBack();
                    return $result = response()->json(['ResultCode'=>ResultCode::_014921_pushUserError,
                    'Message'=>'成員資訊有誤，請修改成員資訊',
                    'Content'=>'']);
                }
                
            }
            //create chat room
            $createChatRoomRes =  json_decode($this->eventService->createChatRoomByEvent($empNo, $eventId, $data['event_title']));
            if($createChatRoomRes->ResultCode != 1){
                \DB::rollBack();
                if($createChatRoomRes->ResultCode == '998002'){
                    return $result = response()->json(['ResultCode'=>ResultCode::_014918_memberNotRegistered,
                    'Message'=>"新增聊天室失敗，成員未註冊",
                    'Content'=>""]);

                }else if($createChatRoomRes->ResultCode== '998003' ||
                        $createChatRoomRes->ResultCode == '998004'){
                    return $result = response()->json(['ResultCode'=>ResultCode::_014919_chatroomMemberInvalid,
                    'Message'=>"聊天室成員不存在",
                    'Content'=>""]);
                }else{
                     return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
                     'Content'=>""]);
                }
            }
            $updateData['chatroom_id'] =  $createChatRoomRes->Content->gid;
            $this->eventRepository->updateEventById($eventId, $updateData);
           
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                    'Content'=>$createChatRoomRes->Content]);
        } catch (Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
        }
    }

    /**
     * 獲取事件列表
     * @return json
     */
    public function getEventList(){
        
        try{
            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                 $result = response()->json(['ResultCode'=>$verifyResult["code"],
                    'Message'=>$verifyResult["message"],
                    'Content'=>'']);
                return $result;
            }
            $input = Input::get();
            $xml=simplexml_load_string($input['strXml']);
            
            $empNo = trim((string)$xml->emp_no[0]);
            $eventType = trim((string)$xml->event_type_parameter_value[0]);
            $eventStatus = trim((string)$xml->event_status[0]);

            if($eventType!=""){
                $parameterMap = CommonUtil::getParameterMapByType($this->eventService::EVENT_TYPE);
                if(!in_array($eventType,array_keys($parameterMap))){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014912_eventTypeError,
                    'Message'=>'事件類型錯誤',
                    'Content'=>'']);
                }
            }
            if($eventStatus!=""){
                $validStatusArr = array(EventService::STATUS_FINISHED,EventService::STATUS_UNFINISHED);
                if(!in_array($eventStatus,$validStatusArr)){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014913_eventStatusCodeError,
                    'Message'=>"事件狀態碼錯誤",
                    'Content'=>""]);
                }
            }

            $eventList = $this->eventService->getEventList($empNo, $eventType, $eventStatus);
            if(count($eventList) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                'Message'=>'查無事件資料',
                'Content'=>'']);
            }
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Content'=>$eventList]);
        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
        }

    }
    /**
     * 獲取事件詳細資訊
     * @return json
     */
    public function getEventDetail(){
    
         try{
            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                 $result = response()->json(['ResultCode'=>$verifyResult["code"],
                    'Message'=>$verifyResult["message"],
                    'Content'=>'']);
                return $result;
            }
            $input = Input::get();
            $xml=simplexml_load_string($input['strXml']);
            
            $empNo      = trim((string)$xml->emp_no[0]);
            $eventId    = trim((string)$xml->event_row_id[0]);

            if($eventId==""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if(preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }

            $eventList = $this->eventService->getEventDetail($eventId, $empNo);
            if(count($eventList) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                'Message'=>'查無事件資料',
                'Content'=>'']);
            }

            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Content'=>$eventList]);
        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
        }


    }

    /**
     * 更新事件 
     * @return json
     */
    public function updateEvent(){

        $allow_user = "admin";
        \DB::beginTransaction();
        try{
            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                 $result = response()->json(['ResultCode'=>$verifyResult["code"],
                    'Message'=>$verifyResult["message"],
                    'Content'=>'']);
                return $result;
            }
            $input = Input::get();
            $xml=simplexml_load_string($input['strXml']);

            $empNo          = trim((string)$xml->emp_no[0]);
            $eventId        = trim((string)$xml->event_row_id[0]);
            $lang           = trim((string)$xml->lang[0]);
            $needPush       = trim((string)$xml->need_push[0]);
            $appKey         = trim((string)$xml->app_key[0]);
            $relatedId      = trim((string) $xml->related_event_row_id[0]);
            $completeDate   = trim((string) $xml->estimated_complete_date[0]);
            $eventTypeParameterValue   = trim((string) $xml->event_type_parameter_value[0]);

            $queryParam =  array(
                'lang'      => $lang,
                'need_push' => $needPush,
                'app_key'   => $appKey
                );

            $userAuthList = $this->userService->getUserRoleList($empNo);
            if(!in_array($allow_user, $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }

            if($lang == "" || $needPush == "" || $appKey =="" || $eventId == ""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if(preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            
            $eventList = $this->eventService->getEventDetail($eventId, $empNo);
            if(count($eventList) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                'Message'=>'查無事件資料',
                'Content'=>'']);
            }

            if($eventTypeParameterValue != ""){
             $parameterMap =  CommonUtil::getParameterMapByType($this->eventService::EVENT_TYPE);
                if(!in_array($eventTypeParameterValue, array_keys($parameterMap))){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014912_eventTypeError,
                        'Message'=>"事件類型錯誤",
                        'Content'=>""]);
                }
            }

            if($Verify->isEventClosed($eventId, $this->eventRepository)){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014910_eventClosed,
                'Message'=>"無法編輯已完成事件",
                'Content'=>""]);
            }

            if($completeDate!=""){
                if(!$Verify->checkTimeStemp($completeDate)){
                    return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
                }
            }
            //更新關聯事件
            if($relatedId!=""){
                $verifyResult = $Verify->checkRelatedEvent($relatedId, $this->eventService, $eventId);
                if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                     $result = response()->json(['ResultCode'=>$verifyResult["code"],
                        'Message'=>$verifyResult["message"],
                        'Content'=>'']);
                    return $result;
                }
            }
            
           $updateField = array('event_type_parameter_value',
                                  'event_title','event_desc',
                                  'estimated_complete_date',
                                  'related_event_row_id');

           $data = CommonUtil::arrangeDataFromXml($xml, $updateField);
           
           //不可update為空白，若為空則不更新
           $requireField = array('event_title',
                                'event_type_parameter_value',
                                'estimated_complete_date');
           foreach ($requireField as $field) {
               if(isset($xml->$field[0]) && trim($xml->$field[0]) == ""){
                    unset( $data[$field]);
                }
           }

           //若無資料就跳過不更新
            $updateResult = $this->eventService->updateEvent($empNo, $eventId, $data, $queryParam);
           \DB::commit();
           return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                    'Content'=>""]);

        } catch (Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);           
        }
   
    }

    /**
     * 更新Event狀態
     * @return json
     */
    public function updateEventStatus(){
        
        $allow_user = "admin";
        \DB::beginTransaction();
        try{
            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                 $result = response()->json(['ResultCode'=>$verifyResult["code"],
                    'Message'=>$verifyResult["message"],
                    'Content'=>'']);
                return $result;
            }
            $input = Input::get();
            $xml=simplexml_load_string($input['strXml']);
            $data = CommonUtil::arrangeDataFromXml($xml, array('emp_no', 'event_row_id', 'read_time','event_status',
                                                               'lang', 'need_push', 'app_key'));
            $empNo = $data['emp_no'];
            $eventId = $data['event_row_id'];

            if(!isset($eventId) || trim($eventId) == "" || 
               !isset($data['lang'])|| $data['lang']=="" || 
               !isset($data['need_push'])   || $data['need_push']=="" || 
               !isset($data['app_key'])     || $data['app_key']==""){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
            }

            $queryParam =  array(
                    'lang'      => $data['lang'],
                    'need_push' => $data['need_push'],
                    'app_key'   => $data['app_key']
                    );

            if(preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            
            $eventList = $this->eventRepository->getEventById($eventId);
            if(count($eventList) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                'Message'=>'查無事件資料',
                'Content'=>'']);
            }
            
            if($Verify->isEventClosed($eventId, $this->eventRepository)){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014910_eventClosed,
                'Message'=>"無法編輯已完成事件",
                'Content'=>""]);
            }

            //update Event Status
            if(isset($data['event_status']) && $data['event_status']!=""){

               if(!isset($data['lang'])        || $data['lang']=="" || 
               !isset($data['need_push'])   || $data['need_push']=="" || 
               !isset($data['app_key'])     || $data['app_key']==""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
                }
                $eventStatus = $data['event_status'];
               
                $userAuthList = $this->userService->getUserRoleList($empNo);
                if(!in_array($allow_user, $userAuthList)){
                      return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                        'Message'=>"權限不足",
                        'Content'=>""]);
                }

                $validStatusArr = array(EventService::STATUS_FINISHED,EventService::STATUS_UNFINISHED);
                if(!in_array($eventStatus,$validStatusArr)){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014913_eventStatusCodeError,
                    'Message'=>"事件狀態碼錯誤",
                    'Content'=>""]);
                }

                //update qp_event
                $data = CommonUtil::arrangeDataFromXml($xml, array('event_status'));
                $updateResult = $this->eventService->updateEvent($empNo, $eventId, $data, $queryParam);
            }

            //update Event Read Time
            if(isset($data['read_time']) && $data['read_time']!=""){
                
                $readTime = $data['read_time'];

                if(!$this->eventService->checkUpdateEventAuth($eventId, $empNo)){
                    return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                        'Message'=>"權限不足",
                        'Content'=>""]);
                }
                if(!$Verify->checkTimeStemp($readTime)){
                    return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
                }
                //update qp_user_event
                $data = CommonUtil::arrangeDataFromXml($xml,array('read_time'));
                $this->eventRepository->updateUserEvent($empNo, $eventId,  $data);
            }
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                        'Content'=>""]);

        } catch (Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
           
        }
    }

    
    /**
     * 取得未關聯事件列表
     * @return json
     */
    public function getUnrelatedEventList(){
        
        $allow_user = "admin";

         try{
            $Verify = new Verify();
            $verifyResult = $Verify->verify();
            if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                 $result = response()->json(['ResultCode'=>$verifyResult["code"],
                    'Message'=>$verifyResult["message"],
                    'Content'=>'']);
                return $result;
            }
            $input = Input::get();
            $xml=simplexml_load_string($input['strXml']);
            
            $empNo = trim((string)$xml->emp_no[0]);
            $eventId = trim((string)$xml->event_row_id[0]);

            $userAuthList = $this->userService->getUserRoleList($empNo);
            if(!in_array($allow_user, $userAuthList)){
                return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }
            
            if( $eventId != "" && preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            
            $eventList = $this->eventService->getUnrelatedEventList($eventId);
            //have no Unrelated Event
            if(count($eventList) == 0){
                return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                    'Message'=>'查無事件資料',
                    'Content'=>'']);
            }
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Content'=>$eventList]);
        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_014999_unknownError,
            'Content'=>""]);
        }

    }

    /**
     * 整理新增事件時的資料
     * @param  String $xml request data
     * @return Array
     */
    private function getInsertEventData($xml){
        $insertfieldAry = ['lang','need_push','app_key','event_type_parameter_value',
                            'estimated_complete_date','related_event_row_id','emp_no','event_title'
                            ];

        $data = CommonUtil::arrangeDataFromXml($xml, $insertfieldAry);
        $data['event_desc'] = (string)$xml->event_desc[0];
 
        foreach ($xml->basic_list as $key => $value) {
             $tmp['location'] = trim((string)$value->location[0]);
             $tmp['function'] = trim((string)$value->function[0]);
             $data['basicList'][] = $tmp;
        }
        return $data;
    }

}


