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
    protected $pushService;

    public function __construct(EventRepository $eventRepository, EventService $eventService, BasicInfoService $basicInfoService, UserService $userService, TaskRepository $taskRepository)
    {
        $this->eventRepository = $eventRepository;
        $this->eventService = $eventService;
        $this->basicInfoService = $basicInfoService;
        $this->userService = $userService;
        $this->taskRepository = $taskRepository;
    }

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
            $data = $this->arrangeInsertData($xml);

            $userAuthList = $this->userService->getUserRoleList($data['created_user']);
            if(!in_array($allow_user, $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }

            if($data['lang']=="" || $data['need_push']=="" || $data['app_key']=="" || $data['event_title']=="" ||
              $data['event_type_parameter_value'] =="" ||  $data['estimated_complete_date'] == "" || $data['basicList']==""){
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
            if($data['related_event_row_id'] != ""){

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

            $eventId = $this->eventService->newEvent($data, $queryParam);
            
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                    'Content'=>""]);
        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
            \DB::rollBack();
        }
    }


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
                $validStatusArr = array('0','1');
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
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
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
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
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

           $data = CommonUtil::arrangeUpdateDataFromXml($xml, $updateField);
           
            $pushResult = $this->eventService->updateEvent($empNo, $eventId, $data, $queryParam);
            \DB::commit();
           return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                    'Content'=>""]);

        } catch (Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
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

            $empNo = (string)$xml->emp_no[0];
            $eventId = (string)$xml->event_row_id[0];
            $readTime =  trim((string)$xml->read_time[0]);
            $eventStetus = trim((string)$xml->event_status[0]);

            if(!isset($eventId) || trim($eventId) == "" ){
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
            
            if( (!isset($xml->read_time[0]) || trim((string)$xml->read_time[0])=="") && 
                (!isset($xml->event_status[0]) || trim((string)$xml->event_status[0])=="") ){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if($Verify->isEventClosed($eventId, $this->eventRepository)){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014910_eventClosed,
                'Message'=>"無法編輯已完成事件",
                'Content'=>""]);
            }
            
            //update Event Status
            if($eventStetus!=""){
                $userAuthList = $this->userService->getUserRoleList($empNo);
                if(!in_array($allow_user, $userAuthList)){
                      return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                        'Message'=>"權限不足",
                        'Content'=>""]);
                }
                if( !in_array($eventStetus,array(0,1))){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
                }
                //update qp_event
                $data = CommonUtil::arrangeUpdateDataFromXml($xml, array('event_status'));
                $this->eventRepository->updateEventById($eventId,$data);
            }

            //update Event Read Time
            if($readTime!=""){
                
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
                $data = CommonUtil::arrangeUpdateDataFromXml($xml,array('read_time'));
                $this->eventRepository->updateUserEvent($eventId,  $empNo, $data);
            }
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                        'Content'=>""]);

        } catch (Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
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
            
            $empNo = (string)$xml->emp_no[0];

            $currentEventId = (string)$xml->event_row_id[0];
            if(!isset($currentEventId) || trim($currentEventId) == ""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }

            $userAuthList = $this->userService->getUserRoleList($empNo);
            if(!in_array($allow_user, $userAuthList)){
                return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }

            $eventList = $this->eventService->getUnrelatedEventList($currentEventId);
            if(count($eventList) == 0){
                return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                    'Message'=>'查無事件資料',
                    'Content'=>'']);
            }
            return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Content'=>$eventList]);
        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
        }

    }

    /**
     * 整理新增事件時的資料
     * @param  String $xml request data
     * @return Array
     */
    private function arrangeInsertData($xml){
        $insertfieldAry = ['lang','need_push','app_key','event_type_parameter_value',
                            'estimated_complete_date','related_event_row_id','emp_no','event_title'
                            ];
        $data = [];
        foreach ($insertfieldAry as $fieldName) {
            $data[ $fieldName ] = trim((string)$xml-> $fieldName[0]);
        }
        
        $data['created_user'] = (string)$xml->emp_no[0];
        $data['event_desc'] = (string)$xml->event_desc[0];

        foreach ($xml->basic_list as $key => $value) {
             $tmp['location'] = (string)$value->location[0];
             $tmp['function'] = (string)$value->function[0];
             $data['basicList'][] = $tmp;
        }
        return $data;
    }

}


