<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Services\BasicInfoService;
use App\Services\UserService;
use App\Services\EventService;
use App\Repositories\EventRepository;
use Illuminate\Support\Facades\Input;
use DB;

class EventController extends Controller
{

    protected $eventService;
    protected $basicInfoService;
    protected $userService;
    protected $eventRepository;
    protected $pushService;

    const EVENT_TYPE = 'event_type';

    public function __construct(EventRepository $eventRepository, EventService $eventService, BasicInfoService $basicInfoService, UserService $userService)
    {
        $this->eventRepository = $eventRepository;
        $this->eventService = $eventService;
        $this->basicInfoService = $basicInfoService;
        $this->userService = $userService;
    }

    public function newEvent(){
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

            if((!isset($data['lang']) || $data['lang']=="")||
                (!isset($data['need_push']) || $data['need_push']=="")||
                (!isset($data['app_key']) || $data['app_key']=="")){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            $parameterMap =  CommonUtil::getParameterMapByType(self::EVENT_TYPE);

            if(!in_array($data['event_type_parameter_value'],array_keys($parameterMap))){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"事件類型不存在",
                    'Content'=>""]);
            }

            if(!isset($data['basicList']) || $data['basicList']=="" || !is_array($data['basicList'])){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            if(isset($data['related_event_row_id']) && trim($data['related_event_row_id'])!=""){
                if(!is_numeric($data['related_event_row_id'])){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"關聯事件欄位格式錯誤",
                    'Content'=>""]);
                }
 
                $event = $this->eventService->getRelatedEventById($data['related_event_row_id']);

                if(is_null($event) || count($event) == 0){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                    'Message'=>"查無關連事件資料，或事件已被關聯",
                    'Content'=>""]);
                }

            }

            $userAuthList = $this->userService->getUserRoleList($data['created_user']);
            if(!in_array("admin", $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }
            
            
            foreach ($data['basicList'] as $key => $basicInfo) {
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
            
            $empNo = (string)$xml->emp_no[0];
            $eventType = (string)$xml->event_type_parameter_value[0];
            $eventStatus = (string)$xml->event_status[0];

            if(isset($eventType) && $eventType!=""){
                $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
                if(!in_array($eventType,array_keys($parameterMap))){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>'事件類型錯誤',
                    'Content'=>'']);
                }
            }
            if(isset($eventStatus) && $eventStatus!=""){
                $validStatusArr = array('0','1');
                if(!in_array($eventStatus,$validStatusArr)){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
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
            
            $empNo = (string)$xml->emp_no[0];
            $eventId = (string)$xml->event_row_id[0];

            if(!isset($eventId) || $eventId == "" || preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            $eventList = $this->eventService->getEventDetail($eventId);
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


    public function updateEvent(){

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
            $lang = (string)$xml->lang[0];
            $needPush = (string)$xml->need_push[0];
            $appKey = (string)$xml->app_key[0];
          
            $userAuthList = $this->userService->getUserRoleList($empNo);
            if(!in_array("admin", $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }

            if((!isset($lang) || $lang=="")||(!isset($needPush ) || $needPush =="")|| (!isset($appKey) || $appKey=="")){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if(!isset($eventId) || trim($eventId) == "" || preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            
            $eventList = $this->eventService->getEventDetail($eventId);
            if(count($eventList) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                'Message'=>'查無事件資料',
                'Content'=>'']);
            }

            if(isset($xml->event_type_parameter_value[0]) && trim((string)$xml->event_type_parameter_value[0])!=""){
             $parameterMap =  CommonUtil::getParameterMapByType(self::EVENT_TYPE);
                if(!in_array($xml->event_type_parameter_value[0],array_keys($parameterMap))){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                        'Message'=>"事件類型不存在",
                        'Content'=>""]);
                }
            }

            if(isset($xml->estimated_complete_date[0]) && trim((string)$xml->estimated_complete_date[0])!=""){
                if( preg_match("/^[1-9][0-9]*$/", $xml->estimated_complete_date[0]) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
                }
            }

            if(isset($xml->related_event_row_id[0]) && trim((string)$xml->related_event_row_id[0])!=""){
                $verifyResult = $Verify->checkRelatedEvent($xml->related_event_row_id[0], $this->eventService);
                if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                     $result = response()->json(['ResultCode'=>$verifyResult["code"],
                        'Message'=>$verifyResult["message"],
                        'Content'=>'']);
                    return $result;
                }
            }
            
            $pushResult = $this->eventService->updateEvent($xml);

           return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                    'Content'=>""]);

        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
           
        }

            
    }

    public function updateEventStatus(){

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
            $eventId = $xml->event_row_id[0];

            if(!isset($eventId) || trim($eventId) == "" || preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }

            $eventList = $this->eventService->getEventDetail($eventId);
            if(count($eventList) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                'Message'=>'查無事件資料',
                'Content'=>'']);
            }
            
            if( (!isset($xml->read_time[0]) || trim((string)$xml->read_time[0])=="") && 
                (!isset($xml->event_status[0]) || trim((string)$xml->event_status[0])=="") ){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }


            if(isset($xml->read_time[0]) && trim((string)$xml->read_time[0])!=""){
                if( preg_match("/^[1-9][0-9]*$/", (string)$xml->read_time[0]) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
                }
                $data = CommonUtil::arrangeUpdateDataFromXml($xml,array('read_time'));
                $this->eventRepository->updateUserEvent($eventId,  $empNo, $data);

            }

            if(isset($xml->event_status[0]) && trim((string)$xml->event_status[0])!=""){
                $userAuthList = $this->userService->getUserRoleList($empNo);
                if(!in_array("admin", $userAuthList)){
                      return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                        'Message'=>"權限不足",
                        'Content'=>""]);
                }

                if( !in_array($xml->event_status[0],array(0,1))){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
                }
                 $data = CommonUtil::arrangeUpdateDataFromXml($xml, array('event_status'));
                 $this->eventRepository->updateEventById($eventId,$data);
            }

            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                        'Content'=>""]);

        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
           
        }
    }

    

    public function getUnrelatedEventList(){

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
            $eventType = (string)$xml->event_type_parameter_value[0];
            $eventStatus = (string)$xml->event_status[0];

            $userAuthList = $this->userService->getUserRoleList($empNo);
            if(!in_array("admin", $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }

            $eventList = $this->eventService->getUnrelatedEventList(self::EVENT_TYPE, $empNo);
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


    private function arrangeInsertData($xml){

        $data = [];
        $data['lang'] = (string)$xml->lang[0];
        $data['need_push'] = (string)$xml->need_push[0];
        $data['app_key'] = (string)$xml->app_key[0];
        $data['event_type_parameter_value'] = (string)$xml->event_type_parameter_value[0];
        $data['event_title'] = (string)$xml->event_title[0];
        $data['event_desc'] = (string)$xml->event_desc[0];
        $data['estimated_complete_date'] = (string)$xml->estimated_complete_date[0];
        $data['related_event_row_id'] = (string)$xml->related_event_row_id[0];
        $data['created_user'] = (string)$xml->emp_no[0];

        foreach ($xml->basic_list as $key => $value) {
             $tmp['location'] = (string)$value->location[0];
             $tmp['function'] = (string)$value->function[0];
             $data['basicList'][] = $tmp;
        }

        return $data;
    }

}


