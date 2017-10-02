<?php
/**
 * 處理事件相關商業邏輯
 */
namespace App\Services;

use App\Repositories\EventRepository;
use App\Repositories\BasicInfoRepository;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use App\lib\CommonUtil;
use App\Components\Push;
use App\Components\Message;
use DB;

class EventService
{
    protected $eventRepository;
    protected $basicInfoRepository;
    protected $taskRepository;
    protected $userRepository;
    protected $push;

    const EVENT_TYPE = 'event_type';
    const STATUS_FINISHED = '1';
    const STATUS_UNFINISHED = '0';

    public function __construct(EventRepository $eventRepository, BasicInfoRepository $basicInfoRepository, TaskRepository $taskRepository, UserRepository $userRepository, Push $push)
    {
        $this->eventRepository = $eventRepository;
        $this->basicInfoRepository = $basicInfoRepository;
        $this->taskRepository = $taskRepository;
        $this->userRepository = $userRepository;
        $this->push = $push;
    }

    /**
     * 新增事件流程
     * @param  String $empNo      使用者員工編號
     * @param  Array  $data       新增事件內容
     * @param  Array  $queryParam 推播必要參數
     * @return int                新增成功的事件Id
     */
    public function newEvent($empNo, Array $data, Array $taskUserList, Array $eventUserList, Array $queryParam){

       $eventId = $this->eventRepository->saveEvent($empNo, $data);

       $nowTimestamp = time();
       $now = date('Y-m-d H:i:s',$nowTimestamp);

       $this->insertTask($eventId, $taskUserList, $empNo, $now);

       if(isset($data['related_event_row_id']) && $data['related_event_row_id'] !="" ){
            $this->eventRepository->bindRelatedEvent($eventId, $data['related_event_row_id'], $data['emp_no']);
       }
       $this->insertUserEvent($eventId, $eventUserList, $empNo, $now);

       $this->eventRepository->updateReadTime($eventId, $empNo);

       return $eventId;
   }

   /**
    * 更新事件流程
    * @param  String $empNo      員工編號
    * @param  int    $eventId    事件row_id
    * @param  Array  $data       更新資料
    * @param  Array  $queryParam 推播必要參數
    * @return json               更新結果
    */
   public function updateEvent($empNo, $eventId, $data, $queryParam){
           $action = 'update';
            //事件完成
           if(isset($data['event_status']) && $data['event_status'] == self::STATUS_FINISHED){
                $action = 'close';
           }
           if($action == 'update'){
                $data['updated_user'] = $empNo;
           }
           $this->eventRepository->updateEventById($eventId, $data);
           
           if(isset($data['related_event_row_id'])){
                $this->eventRepository->unBindRelatedEvent($eventId, $empNo);
                if($data['related_event_row_id'] != ""){
                    $this->eventRepository->bindRelatedEvent($eventId, $data['related_event_row_id'], $empNo);
                }
           }
          
           $result = $this->sendPushMessageToEventUser($eventId, $queryParam, $empNo, $action);
           
           return $result;
   }

  /**
   * 取得事件列表
   * @param  String $project      project
   * @param  String $empNo       員工編號
   * @param  String $eventType   1:緊急通報 | 2:一般通報 (非必填，不需要篩選時傳入空字串)
   * @param  int $eventStatus 事件狀態 1:已完成 | 0:未完成 (非必填，不需要篩選時傳入空字串)
   * @return Array              事件列表包含參與人數(user_count),seen_count(已讀人數),
   *                            task_finish_count(任務完成數),task_count(總任務數)
   */
   public function getEventList($project, $empNo, $eventType, $eventStatus){
        $oraEventList = $this->eventRepository->getEventList($project, $empNo, $eventType, $eventStatus);
        $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
       
        $eventList = [];
        foreach ($oraEventList as $event) {
            $eventId = $event->event_row_id;
            $item = $this->arrangeEventList($event);
            $item['user_count'] = $this->eventRepository->getUserCountByEventId($eventId);
            $item['seen_count'] = $this->eventRepository->getSeenCountByEventId($eventId);
            $item['task_finish_count'] = $this->taskRepository->getCloseTaskCntByEventId($eventId);
            $item['task_count'] = $this->taskRepository->getAllTaskByEventId($eventId);
            $eventList[] = $item;                
        }
          return $eventList;
   }

   /**
    * 取得尚未被關聯的事件，並格式化部分資料
    * @param  String $project      project
    * @param  int $currentEventId 目前的事件row_id
    * @return Array
    */
   public function getUnrelatedEventList($project, $currentEventId){
    
        $oraEventList = $this->eventRepository->getUnrelatedEventList($project, $currentEventId);
        $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
        $eventList = [];
        foreach ($oraEventList as $event) {
           $item = $this->arrangeEventList($event);
           $eventList[] = $item;                
        }
        return $eventList;
   }
   /**
    * 取得事件詳細資料
    * @param  String $project project
    * @param  int $eventId   事件row_id
    * @param  String $empNo  員工編號
    * @return Array
    */
   public function getEventDetail($project, $eventId, $empNo){
        
         $eventDetail = [];
         $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
         $eventDetail = $this->eventRepository->getEventDetail($project, $eventId, $empNo);
         if(isset($eventDetail)){
            $eventDetail  = $this->arrangeEventList($eventDetail);
         }
         if(count($eventDetail) > 0 ){
             $eventDetail['user_count'] = $this->eventRepository->getUserCountByEventId($eventId);
             $eventDetail['seen_count'] = $this->eventRepository->getSeenCountByEventId($eventId);
             $eventDetail['task_finish_count'] = $this->taskRepository->getCloseTaskCntByEventId($eventId);
             $eventDetail['user_event'] = $this->getEventUserDetail($eventId);
             $eventDetail['task_detail'] = $this->getTaskDetailByEventId($eventId);
         }

         return $eventDetail;
   }

   /**
    * 依據事件id取得任務詳細資料
    * @param  int $eventId 事件row_id
    * @return Array
    */
   public function getTaskDetailByEventId($eventId){
        
        $result = $this->taskRepository->getTaskDetailByEventId($eventId);
        foreach ($result as $key => &$task) {
            $task['task_status'] = ($task['task_status']==0)?'未完成':'完成';
            $task['user_task'] =  $this->getTaskUserDetail($task['task_row_id']);
        }

        return $result;
   }

   /**
    * 取得任務參與者的詳細資料
    * @param  int $taskId 任務id en_task
    * @return Array
    */
   public function getTaskUserDetail($taskId){
         $tsakUserDetail = $this->taskRepository->getUserByTaskId($taskId);
          $userList = [];
         foreach ($tsakUserDetail as $key => $user) {
            $userData['emp_no'] = $user->emp_no;
            $userData['login_id'] = $user->login_id;
            $userList[] = $userData;
         }
         return $userList;
   }

   /**
    * 取得事件參與者當作推播接收訊者清單
    * @param  int $eventId      事件id en_event.row_id
    * @return Array|array  array('Domain\\LoginId')
    */
   public function getPushUserListByEvent($eventId){
        $eventUserDetail = [];
        $eventUserDetail = $this->eventRepository->getUserByEventIdWithRight($eventId);
        $userList = [];
         foreach ($eventUserDetail as $user) {
            $userList[] = $user->user_domain."\\".$user->login_id;
         }
        return $userList;
   }

   /**
    * 根據員工編號產生收件者清單
    * @param  Array  $empNoArr 員工編號列表
    * @return Array|array      array('Domain\\LoginId')
    */
   public function getPushUserListByEmpNoArr(Array $empNoArr){
        $userInfo = $this->userRepository->getUserInfoByEmpNo($empNoArr);
        $userList = [];
        foreach ($userInfo as $user) {
            $userList[] = $user['user_domain']."\\".$user['login_id'];
        }
        return $userList;
   }

   /**
    * 取得任務參與者詳細資料
    * @param  int $eventId 事件row_id
    * @return Array
    */
   public function getEventUserDetail($eventId){
         $eventUserDetail = $this->eventRepository->getUserByEventId($eventId);
         $userList = [];
         foreach ($eventUserDetail as $key => $user) {
            $userData['emp_no'] = $user->emp_no;
            $userData['login_id'] = $user->user_domain."\\".$user->login_id;
            $userData['read_time'] = $user->read_time;
            $userList[] = $userData;
         }
         return $userList;
   }
   
   /**
    * 取得事件關聯到的事件id
    * @param  int $eventId    事件id
    * @return mixed
    */
   public function getRelatedStatusById($eventId){
        return $this->eventRepository->getRelatedStatusById($eventId);
   }

   /**
    * 更新當前任務
    * @param  String $empNo  員工編號
    * @param  int    $taskId 任務id en_task.row_id
    * @param  Array  $data   更新資料
    * @return int            更新成功筆數
    */
   public function updateTaskById($empNo, $taskId, Array $data){
        return $this->taskRepository->updateTaskById($empNo, $taskId, $data);
   }

   /**
    * 設定為已完成任務，當最後一筆任務時完成時，同時更新事件為已完成
    * @param  string    $empNo   員工編號
    * @param  int       $eventId 事件id en_event.row_id
    * @param  int       $taskId  任務id en_task.row_id
    * @return int       更新狀態為完成的筆數
    */
   public function closeTask($empNo, $eventId, $taskId, $queryParam){
        $data = array(
                    "close_task_emp_no" => $empNo,
                    "close_task_date" => time(),
                    "task_status" => self::STATUS_FINISHED
                );
        $this->taskRepository->updateTaskById($empNo, $taskId, $data);
        //已無開啟中task,將事件關閉
        $openedTask = $this->taskRepository->getOpenTaskByEventId($eventId);
        if(count($openedTask) == 0){
            $updateResult = $this->updateEvent($empNo, $eventId, array("event_status"=>self::STATUS_FINISHED), $queryParam);
        }
   }

   /**
    * 重啟任務，將任務狀態改為未完成
    * @param  string    $empNo   員工編號
    * @param  int       $taskId  任務id en_task.row_id
    * @return int                還原狀態為完成的筆數
    */
   public function reopenTask($empNo, $taskId){
        $data = array(
                    "close_task_emp_no" => "",
                    "close_task_date" => 0,
                    "task_status" => self::STATUS_UNFINISHED
                );
        return $this->taskRepository->updateTaskById($empNo, $taskId, $data);
   }

   /**
    * 取得任務參與者
    * @param  int $taskId    任務id en_task.row_id
    * @return mixed         
    */
   public function getUserByTaskId($taskId){
        return $this->taskRepository->getUserByTaskId($taskId);
   }

   /**
    * 依任務id取得任務資料
    * @param  String $project project
    * @param  int $taskId 任務id
    * @return mixed
    */
   public function getTaskById($project, $taskId){
        return $this->taskRepository->getTaskById($project, $taskId);
   }
   
   /**
    * 檢查人員是否有更新任務狀態的權限
    * @param  int    $taskId    en_task.row_id
    * @param  String $empNo     員工編號
    * @return boolean
    */
   public function checkUpdateTaskAuth($taskId, $empNo){
        $res = count($this->taskRepository->getIsTaskOwner($taskId, $empNo));
        if($res > 0){
            return true;
        }else{
            return false;
        }
        return true;
   }

   /**
    * 檢查人員是否有更新事件狀態的權限
    * @param  int    $taskId    en_task.row_id
    * @param  String $empNo     員工編號
    * @return boolean
    */
   public function checkUpdateEventAuth($taskId, $empNo){
        $res = count($this->eventRepository->getIsEventOwner($taskId, $empNo));
        if($res > 0){
            return true;
        }else{
            return false;
        }
   }
    
    /**
     * 建立事件聊天室
     * @param  Array  $eventUsers 事件參與人資訊清單
     * @param  String $desc       聊天室描述(事件標題)
     * @return json               聊天室建立結果
     */
   public function createChatRoom($owner, $eventUsers, $desc){
        $members = array();
        foreach ($eventUsers as $user) {
            //加入不與owner重複的用戶
           if($user->login_id != $owner){
             array_push($members, $user->login_id);
           }
        }
        $qMessage = new Message();
        return $qMessage->createChatRoom($owner, $members, $desc);
   }

   /**
    * 刪除聊天室
    * @param  int $chatRoomId 聊天室gid
    * @return json            刪除結果
    */
   public function deleteChatRoom($chatRoomId){
        $qMessage = new Message();
        return $qMessage->deleteChatRoom($chatRoomId);
   }

   /**
    * 取得不重複的任務清單(function-location)
    * @param  Array|array    $basicList 地點等資訊列表
    * @return Array|array    不重複的任務清單
    */
   public function getUniqueTask($basicList){
        
        $uniqueTask = [];
         foreach ($basicList as $value) {
           if(!isset($uniqueTask[$value['location']])){
                $uniqueTask[$value['location']][] = $value['function'];
           }else{
                if(!in_array($value['function'],$uniqueTask[$value['location']])){
                     $uniqueTask[$value['location']][] = $value['function'];
                }
           }
        }

        return $uniqueTask;
   }

   /**
    * 寫入task 資料
    * @param  int    $eventId     event_row_id
    * @param  Array  $taskUserList       所屬該事件的任務列表
    * @param  string $createdUser 建立者員工編號
    * @param  date   $createdDate 建立日期
    * @return bool
    */
   private function insertTask($eventId, $taskUserList, $createdUser, $createdDate){
        $taskData = [];
        $userTaskData = [];
         foreach ($taskUserList as $location => $function) {
            
            foreach ($function as $functionName => $user) {
                $taskData = array(
                'event_row_id'=>$eventId,
                'task_location'=>$location,
                'task_function'=>$functionName,
                'created_user'=>$createdUser,
                'created_at'=>$createdDate
                );
                $taskId = $this->taskRepository->saveTask($taskData);
                foreach ($user as $empNo) {
                   $userTaskData[] = array(
                    'emp_no'=>$empNo,
                    'task_row_id'=>$taskId,
                    'created_user'=>$createdUser,
                    'created_at'=>$createdDate
                    );
                }

            }
           
        }
        return $this->taskRepository->saveUserTask($userTaskData);
   }

   /**
    * 寫入事件所參與人
    * @param  int    $eventId     event_row_id
    * @param  Array  $eventUser   事見相關人員
    * @param  string $createdUser 建立者員工編號
    * @param  date   $createdDate 建立日期
    * @return bool
    */
   private function insertUserEvent($eventId, Array $eventUser, $createdUser, $createdDate){
        $userEventData = [];
        foreach ($eventUser as $user) {
            $userEventData[] = [
                'event_row_id'=>$eventId,
                'emp_no'=>(string)$user,
                'created_user'=>$createdUser,
                'updated_user'=>$createdUser,
                'created_at'=>$createdDate
                ];
        }
        return $this->eventRepository->saveUserEvent($userEventData);
   }

   /**
    * 格式化事件相關資料，並組合創建人資訊
    * @param  Object $event        event object
    * @return Array
    */
   private function arrangeEventList($event){


        $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
        $item = [];
        $item['event_row_id'] = $event->event_row_id;
        $item['event_type'] = (isset($event->event_type)&& $event->event_type!="")?$parameterMap[$event->event_type]:"";
        $item['event_title'] = $event->event_title;
        $item['event_desc'] = $event->event_desc;
        $item['estimated_complete_date'] = $event->estimated_complete_date;
        $item['related_event_row_id'] = $event->related_event_row_id;
        $item['event_status'] = ($event->event_status == 0)?'未完成':'完成';
        $item['chatroom_id'] = $event->chatroom_id;
        $createdUserInfo = $this->userRepository->getUserInfoByEmpNo(array($event->created_user));
        $updatedUserInfo = $this->userRepository->getUserInfoByEmpNo(array($event->updated_user));
        $item['created_at'] = $event->created_at->format('Y-m-d H:i:s');
        $item['created_user_ext_no'] = null;
        $item['created_user'] = null;
        if(count($createdUserInfo) > 0 ){
            $item['created_user_ext_no'] = $createdUserInfo[0]['ext_no'];
            $item['created_user'] = $createdUserInfo[0]['login_id'];
        }
        $item['updated_at'] = $event->updated_at->format('Y-m-d H:i:s');
        $item['updated_user_ext_no'] = null;
        $item['updated_user'] = null;
        if(count($updatedUserInfo) > 0 ){
            $item['updated_user_ext_no'] = $updatedUserInfo[0]['ext_no'];
            $item['updated_user'] = $updatedUserInfo[0]['login_id'];
        }
        
        return $item;
   }

   /**
    * 發送推播訊息給事件參與者
    * @param  int      $eventId    事件id en_event.row_id
    * @param  Array    $queryParam 呼叫pushAPI時的必要參數，EX :array('lang' => 'en_us','need_push' => 'Y','project' => 'appens')
    * @param  string   $empNo
    * @param  string   $action     推播時的情境(new:新增事件|update:更新 事件|close:事件已完成)
    * @return json
    */
   public function sendPushMessageToEventUser($eventId, Array $queryParam, $empNo, $action){
       
       $result = null;
       $to = $this->getPushUserListByEvent($eventId);

       $from = $this->getPushUserListByEmpNoArr(array($empNo))[0];
       $event = $this->getEventDetail($queryParam['project'], $eventId, $empNo);
       
       $template = $this->push->getPushMessageTemplate($action, $event, $queryParam);
       $title = base64_encode(CommonUtil::jsEscape(html_entity_decode($template['title'])));
       $text = base64_encode(CommonUtil::jsEscape(html_entity_decode($template['text'])));
       $pushResult = $this->push->sendPushMessage($from, $to,$title, $text, $queryParam);

       $result = json_decode($pushResult);
       return $result;
    }

    /**
     * 根據事件id取得事件資料
     * @param  String $project  project
     * @param  int    $eventId 事件id
     * @return mixed
     */
    public function getEventById($project, $eventId){
        return $this->eventRepository->getEventById($project, $eventId);
    }

}