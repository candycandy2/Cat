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
use Config;

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
            if(!isset($data['lang'])        || $data['lang']=="" || 
               !isset($data['need_push'])   || $data['need_push']=="" || 
               !isset($data['project'])     || $data['project']=="" || 
               !isset($data['event_title']) || $data['event_title']=="" ||
               !isset($data['event_desc'])  || $data['event_desc']=="" ||
               !isset($data['event_type_parameter_value']) || $data['event_type_parameter_value'] =="" || 
               !isset($data['estimated_complete_date'])     || $data['estimated_complete_date'] == "" ||
               !isset($data['basicList'])   || $data['basicList']==""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if(!in_array($data['project'], Config::get('app.ens_project'))){
                return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                    'Message'=>"project參數不存在",
                    'Content'=>""]);
            }

            $userAuthList = $this->userService->getUserRoleListByProject($data['project'], $empNo);

            if(is_null($userAuthList) || !in_array($allow_user, $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
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

                $verifyResult = $Verify->checkRelatedEvent($data['project'], $data['related_event_row_id'], $this->eventService);
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

                if(!$this->basicInfoService->checkBasicInfo($data['project'], $basicInfo['location'], $basicInfo['function'])){
                      return $result = response()->json(['ResultCode'=>ResultCode::_014902_locationOrFunctionNotFound,
                    'Message'=>"Location或是Function錯誤",
                    'Content'=>""]);
                }
            }

            //取得任務參與者
            $eventUser = $this->getEventAndTaskUser($data['project'], $data['basicList'])['eventUser'];
            $taskUserList =  $this->getEventAndTaskUser($data['project'], $data['basicList'])['taskUserList'];

            //檢查設備管理員及主管資訊，有一個錯誤就失敗
            foreach ($eventUser as $preUserEmpNo) {
                $checkUserRegisterMessageRes = CommonUtil::checkUserStatusByUserEmpNo($preUserEmpNo);
                if(!$checkUserRegisterMessageRes ){
                    return $result = response()->json(['ResultCode'=>ResultCode::_014921_pushUserError,
                    'Message'=>'IT Function管理員資料不正確, 請至後台修正',
                    'Content'=>'']);
                }
            }

            $queryParam =  array(
                'lang' => $data['lang'],
                'need_push' =>  $data['need_push'],
                'project' =>  $data['project'],
                'uuid' => (isset($input['uuid']))?$input['uuid']:""
                );
            
            $title = $data['event_title'];
            $content = $data['event_desc'];
            $newPostRs = json_decode($this->eventService->newPost($data['project'], $empNo, $title, $content, $queryParam));

            if($newPostRs->ResultCode != ResultCode::_1_reponseSuccessful){
                 return $result = response()->json(['ResultCode'=>$newPostRs->ResultCode,
                'Message'=>"新增Post失敗",
                'Content'=>""]);
            }

            //Step2. create event
            $chatroomId = $newPostRs->Content->post_id;
            $data['chatroom_id'] = $chatroomId;
            $eventId = $this->eventService->newEvent($empNo, $data, $taskUserList, $eventUser, $queryParam);
            \DB::commit();

            //Step3. send push
            $sendPushMessageRes = $this->eventService->sendPushMessageToEventUser($eventId, $queryParam, $empNo, 'new');
            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                'Content'=>$title]);

        } catch (\Exception $e){
            \DB::rollBack();
            if(isset($chatroomId)){
               $deleteRes =  $this->eventService->deletePost($empNo, $chatroomId, $queryParam);
            }
            throw $e;
        }
    }

    /**
     * 取得事件及任務參與者
     * @param  String $project project
     * @param  array $basicList location-function 列表
     * @return array array('eventUser'=>array(),'taskUserList'=>array());
     */
    private function getEventAndTaskUser($project, $basicList){
        $result = array('eventUser'=>array(),'taskUserList'=>array());

         $UniqueTask = $this->eventService->getUniqueTask($basicList);
            foreach ($UniqueTask as $location => $functionList) {
                foreach ($functionList as $index =>$function) {
                    $result['taskUserList'][$location][$function] = [];
                    $taskUser = $this->basicInfoService->getUserByLocationFunction($project, $location ,$function);
                   
                    if(!is_null($taskUser)){
                        foreach ($taskUser as $user) {
                            $result['taskUserList'][$location][$function][] = $user->emp_no;
                            $result['eventUser'][] = $user->emp_no;
                        } 
                    }
                }
            }
            //取得事件參與者
            $superUser = $this->userService->getSuperUser($project);
            foreach ($superUser as $user) {
                 $result['eventUser'][] = $user->emp_no;
            }
            $result['eventUser'] = array_unique($result['eventUser']);
        return $result;
    }

    /**
     * 獲取事件列表
     * @return json
     */
    public function getEventList(){
        
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
        $project = trim((string)$xml->project[0]);

        if($project ==""){
            return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
        }

        if(!in_array($project, Config::get('app.ens_project'))){
            return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                'Message'=>"project參數不存在",
                'Content'=>""]);
        }

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

        $eventList = $this->eventService->getEventList($project, $empNo, $eventType, $eventStatus);
        if(count($eventList) == 0){
             return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
            'Message'=>'查無事件資料',
            'Content'=>'']);
        }
        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Content'=>$eventList]);

    }
    /**
     * 獲取事件詳細資訊
     * @return json
     */
    public function getEventDetail(){
    
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
        $project    = trim((string)$xml->project[0]);

        if($eventId == "" || $project == ""){
            return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
        }

        if(!in_array($project, Config::get('app.ens_project'))){
            return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                'Message'=>"project參數不存在",
                'Content'=>""]);
        }

        if(preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                'Message'=>"欄位格式錯誤",
                'Content'=>""]);
        }

        $eventList = $this->eventService->getEventDetail($project, $eventId, $empNo);
        if(count($eventList) == 0){
             return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
            'Message'=>'查無事件資料',
            'Content'=>'']);
        }

        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Content'=>$eventList]);
        
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
            $project        = trim((string)$xml->project[0]);
            $eventTitle     = trim((string)$xml->event_title[0]);
            $eventDesc      = trim((string)$xml->event_desc[0]);
            $relatedId      = trim((string) $xml->related_event_row_id[0]);
            $completeDate   = trim((string) $xml->estimated_complete_date[0]);
            $eventTypeParameterValue   = trim((string) $xml->event_type_parameter_value[0]);

            $queryParam =  array(
                'lang'      => $lang,
                'need_push' => $needPush,
                'project'   => $project,
                'uuid' => (isset($input['uuid']))?$input['uuid']:""
                );

            if(!in_array($project, Config::get('app.ens_project'))){
                return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                    'Message'=>"project參數不存在",
                    'Content'=>""]);
            }

            $userAuthList = $this->userService->getUserRoleListByProject($project, $empNo);
            if(is_null($userAuthList) || !in_array($allow_user, $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                    'Message'=>"權限不足",
                    'Content'=>""]);
            }

            if($lang == "" || $needPush == "" || $project =="" || $eventId == "" || $eventTitle == "" || $eventDesc == ""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if(preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            $eventList = $this->eventRepository->getEventDetail($project, $eventId, $empNo);
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
            //檢查關聯事件
            if($relatedId!=""){
                $verifyResult = $Verify->checkRelatedEvent($project, $relatedId, $this->eventService, $eventId);
                if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
                     $result = response()->json(['ResultCode'=>$verifyResult["code"],
                        'Message'=>$verifyResult["message"],
                        'Content'=>'']);
                    return $result;
                }
            }

            //Step 1. modifyPost
            $modifyPostRs = json_decode($this->eventService->modifyPost($project,
                                                         $eventList->created_user,
                                                          $eventList->chatroom_id,
                                                         (string)$xml->event_title[0],
                                                         (string)$xml->event_desc[0],
                                                         $queryParam));
            if($modifyPostRs->ResultCode != ResultCode::_1_reponseSuccessful){
                 return $result = response()->json(['ResultCode'=>$modifyPostRs->ResultCode,
                'Message'=>"更新Post失敗",
                'Content'=>""]);
            }

            //Step2. updateEvent
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

        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;     
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
                                                               'lang', 'need_push', 'project'));
            $empNo = $data['emp_no'];
            $eventId = $data['event_row_id'];

            if(!isset($eventId) || trim($eventId) == "" || 
               !isset($data['lang'])|| $data['lang']=="" || 
               !isset($data['need_push'])   || $data['need_push']=="" || 
               !isset($data['project'])     || $data['project']==""){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
            }

            if(!in_array($data['project'], Config::get('app.ens_project'))){
                return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                    'Message'=>"project參數不存在",
                    'Content'=>""]);
            }

            $queryParam =  array(
                    'lang'      => $data['lang'],
                    'need_push' => $data['need_push'],
                    'project'   => $data['project']
                    );

            if(preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                     return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }
            
            $eventList = $this->eventRepository->getEventById($data['project'], $eventId);

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
               !isset($data['project'])     || $data['project']==""){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
                }
                $eventStatus = $data['event_status'];
               
                $userAuthList = $this->userService->getUserRoleListByProject($data['project'], $empNo);
                if(is_null($userAuthList) || !in_array($allow_user, $userAuthList)){
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

        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }
    }

    
    /**
     * 取得未關聯事件列表
     * @return json
     */
    public function getUnrelatedEventList(){
        
        $allow_user = "admin";

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
        $project = trim((string)$xml->project[0]);

        if($project ==""){
            return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
        }

        if(!in_array($project, Config::get('app.ens_project'))){
            return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                'Message'=>"project參數不存在",
                'Content'=>""]);
        }
        
        $userAuthList = $this->userService->getUserRoleListByProject($project, $empNo);
        if(is_null($userAuthList) || !in_array($allow_user, $userAuthList)){
            return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                'Message'=>"權限不足",
                'Content'=>""]);
        }
        
        if( $eventId != "" && preg_match("/^[1-9][0-9]*$/", $eventId) == 0 ){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014905_fieldFormatError,
                'Message'=>"欄位格式錯誤",
                'Content'=>""]);
        }
        
        $eventList = $this->eventService->getUnrelatedEventList($project, $eventId);
        //have no Unrelated Event
        if(count($eventList) == 0){
            return $result = response()->json(['ResultCode'=>ResultCode::_014904_noEventData,
                'Message'=>'查無事件資料',
                'Content'=>'']);
        }
        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Content'=>$eventList]);
    }

    /**
     * 整理新增事件時的資料
     * @param  String $xml request data
     * @return Array
     */
    private function getInsertEventData($xml){
        $insertfieldAry = ['lang','need_push','project','event_type_parameter_value',
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


