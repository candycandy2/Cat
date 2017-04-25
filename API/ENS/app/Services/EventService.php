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
    public function newEvent($empNo, Array $data, Array $queryParam){

       $eventId = $this->eventRepository->saveEvent($empNo, $data);

       $nowTimestamp = time();
       $now = date('Y-m-d H:i:s',$nowTimestamp);

       $uniqueTask = $this->getUniqueTask($data['basicList']);
       $this->insertTask($eventId, $uniqueTask, $empNo, $now);
       if(isset($data['related_event_row_id']) && $data['related_event_row_id'] !="" ){
            $this->eventRepository->bindRelatedEvent($eventId, $data['related_event_row_id'], $data['emp_no']);
       }

       $taskInfo = $this->taskRepository->getTaskByEventId($eventId);
       $this->insertUserTask($taskInfo, $empNo, $now);
               

       $eventUsers =  $this->findEventUser($eventId);
       $this->insertUserEvent($eventId, $eventUsers, $empNo, $now);


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
           $this->eventRepository->updateEventById($empNo, $eventId, $data);
           
           if(isset($data['related_event_row_id'])){
                $this->eventRepository->unBindRelatedEvent($eventId, $empNo);
                if($data['related_event_row_id'] != ""){
                    $this->eventRepository->bindRelatedEvent($eventId, $data['related_event_row_id'], $empNo);
                }
           }
           //事件完成
           if(isset($data['event_status']) && $data['event_status'] == self::STATUS_FINISHED){
                $action = 'close';
           }

           $result = $this->sendPushMessageToEventUser($eventId, $queryParam, $empNo, $action);
           
           return $result;
   }

  /**
   * 取得事件列表
   * @param  String $empNo       員工編號
   * @param  String $eventType   1:緊急通報 | 2:一般通報 (非必填，不需要篩選時傳入空字串)
   * @param  int $eventStatus 事件狀態 1:已完成 | 0:未完成 (非必填，不需要篩選時傳入空字串)
   * @return Array              事件列表包含參與人數(user_count),seen_count(已讀人數),task_finish_count(任務完成數)
   */
   public function getEventList($empNo, $eventType, $eventStatus){
        $oraEventList = $this->eventRepository->getEventList($empNo, $eventType, $eventStatus);
        $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
       
        $eventList = [];
        foreach ($oraEventList as $event) {
            $eventId = $event->event_row_id;
            $item = $this->arrangeEventList($event);
            $item['user_count'] = $this->eventRepository->getUserCountByEventId($eventId);
            $item['seen_count'] = $this->eventRepository->getSeenCountByEventId($eventId);
            $item['task_finish_count'] = $this->taskRepository->getCloseTaskCntByEventId($eventId);
            $eventList[] = $item;                
        }
          return $eventList;
   }

   /**
    * 取得尚未被關聯的事件，並格式化部分資料
    * @param  int $currentEventId 目前的事件row_id
    * @return Array
    */
   public function getUnrelatedEventList($currentEventId){
    
        $oraEventList = $this->eventRepository->getUnrelatedEventList($currentEventId);
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
    * @param  int $eventId  事件row_id
    * @param  String $empNo 員工編號
    * @return Array
    */
   public function getEventDetail($eventId, $empNo){
        
         $eventDetail = [];
         $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
         $eventDetail = $this->eventRepository->getEventDetail($eventId, $empNo);
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
    * @param  string $action    呼叫推播時的場景 (new:新增事件|update:更新事件|close:事件已完成)
    * @return Array|array  array('Domain\\LoginId')
    */
   public function getPushUserListByEvent($eventId, $action){
         $eventUserDetail = [];
         //新增事件的時候，不過濾掉離職或沒有權限的用戶，若有失敗則提示用戶錯誤，提醒修改Basic Info
         if(strtolower($action) == 'new'){
            $eventUserDetail = $this->eventRepository->getUserByEventId($eventId);
         }else{
            $eventUserDetail = $this->eventRepository->getUserByEventIdWithRight($eventId);
         }

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
    * 找出不重複的事件參與者(被指派任務的人、主管以及機房管理者)
    * @param  int $eventId 事件id en_event.row_id
    * @return Array
    */
   public function findEventUser($eventId){
        $eventUser = [];
        $taskUser = $this->taskRepository->getAllUserFromTaskbyEventId($eventId);
        foreach ($taskUser as $tu) {
            $eventUser[] = (string)$tu->emp_no;
        }
        $superUser = $this->userRepository->getSuperUser();
        
        foreach ($superUser as $su) {
            $eventUser[] = (string)$su->emp_no;
        }

        return array_unique($eventUser);
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
    * @param  int $taskId 任務id
    * @return mixed
    */
   public function getTaskById($taskId){
        return $this->taskRepository->getTaskById($taskId);
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
    * 根據Event產生聊天室
    * @param  string    $empNo   員工編號
    * @param  int       $eventId en_event.row_id
    * @param  array     $desc    聊天室簡述
    * @return json
    */
   public function createChatRoomByEvent($empNo, $eventId, $desc){
        
        $owner = $this->userRepository->getUserInfoByEmpNo(array($empNo))[0]->login_id;
        $members = array();
        $eventUsersEmpNo = $this->findEventUser($eventId);
        $eventUsers = $this->userRepository->getUserInfoByEmpNo($eventUsersEmpNo);
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
    * 取得不重複的任務清單(function-location)
    * @param  Array|array    $basicList 地點等資訊列表
    * @return Array|array    不重複的任務清單
    */
   private function getUniqueTask($basicList){
        
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
    * @param  Array  $tasks       所屬該事件的任務列表
    * @param  string $createdUser 建立者員工編號
    * @param  date   $createdDate 建立日期
    * @return bool
    */
   private function insertTask($eventId, $tasks, $createdUser, $createdDate){
        $TaskData = [];
         foreach ($tasks as $location => $functions) {
            foreach ($functions as $function) {
             $TaskData[] = array(
                'event_row_id'=>$eventId,
                'task_location'=>$location,
                'task_function'=>$function,
                'created_user'=>$createdUser,
                'created_at'=>$createdDate
                );
            }
        }
        return $this->taskRepository->saveTask($TaskData);
   }

   /**
    * 寫入任務包含哪些成員
    * @param  Array  $taskInfo    task 資料
    * @param  string $createdUser 建立者員工編號
    * @param  date   $createdDate 建立日期
    * @return bool
    */
   private function insertUserTask($taskInfo, $createdUser, $createdDate){
        $UserTaskData = [];
        foreach ($taskInfo as $task) {
           
            $res = $this->basicInfoRepository->getUserByLocationFunction($task->task_location, $task->task_function);
           
              foreach ($res as $user) {
                   $UserTaskData[] = array(
                    'emp_no'=>$user->emp_no,
                    'task_row_id'=>$task->row_id,
                    'created_user'=>$createdUser,
                    'created_at'=>$createdDate
                    );
              }
        }
        return $this->taskRepository->saveUserTask($UserTaskData);
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
        $userInfo = $this->userRepository->getUserInfoByEmpNo(array($event->created_user));
        $item['created_user_ext_no'] = $userInfo[0]['ext_no'];
        $item['created_user'] = $userInfo[0]['login_id'];
        $item['created_at'] = $event->created_at->format('Y-m-d H:i:s');

        return $item;
   }

   /**
    * 發送推播訊息給事件參與者
    * @param  int      $eventId    事件id en_event.row_id
    * @param  Array    $queryParam 呼叫pushAPI時的必要參數，EX :array('lang' => 'en_us','need_push' => 'Y','app_key' => 'appens')
    * @param  string   $empNo
    * @param  string   $action     推播時的情境(new:新增事件|update:更新 事件|close:事件已完成)
    * @return json
    */
   public function sendPushMessageToEventUser($eventId, Array $queryParam, $empNo, $action){
       
       $result = null;
       $to = $this->getPushUserListByEvent($eventId, $action);

       $from = $this->getPushUserListByEmpNoArr(array($empNo))[0];
       $event = $this->getEventDetail($eventId, $empNo);
       
       $template = $this->push->getPushMessageTemplate($action, $event, $queryParam);
       $title = base64_encode(CommonUtil::jsEscape(html_entity_decode($template['title'])));
       $text = base64_encode(CommonUtil::jsEscape(html_entity_decode($template['text'])));
      
       $pushResult = $this->push->sendPushMessage($from, $to,$title, $text, $queryParam);

       $result = json_decode($pushResult);
       return $result;
    }

}