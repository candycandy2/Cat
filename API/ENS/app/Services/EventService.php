<?php
namespace App\Services;

use App\Repositories\EventRepository;
use App\Repositories\BasicInfoRepository;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use App\lib\CommonUtil;
use App\Components\Push;
use DB;

class EventService
{
    protected $eventRepository;
    protected $basicInfoRepository;
    protected $taskRepository;
    protected $userRepository;
    protected $push;

    const EVENT_TYPE = 'event_type';
    //private $empNo;

    public function __construct(EventRepository $eventRepository, BasicInfoRepository $basicInfoRepository, TaskRepository $taskRepository, UserRepository $userRepository, Push $push)
    {
        $this->eventRepository = $eventRepository;
        $this->basicInfoRepository = $basicInfoRepository;
        $this->taskRepository = $taskRepository;
        $this->userRepository = $userRepository;
        $this->push = $push;
    }


    public function newEvent(Array $data, Array $queryParam){

       $eventId = $this->eventRepository->saveEvent($data);

       $nowTimestamp = time();
       $now = date('Y-m-d H:i:s',$nowTimestamp);

       $uniqueTask = $this->getUniqueTask($data['basicList']);       
       $this->insertTask($eventId, $uniqueTask, $data['created_user'], $now);

       if(isset($data['related_event_row_id'])){
            $this->eventRepository->bindRelatedEvent($eventId,$data['related_event_row_id']);
       }

       $taskInfo = $this->taskRepository->getTaskByEventId($eventId);
       $this->insertUserTask($taskInfo, $data['created_user'], $now);
               

       $eventUsers =  $this->findEventUser($eventId);
       $this->insertUserEvent($eventId, $eventUsers, $data['created_user'], $now);


       $this->eventRepository->updateReadTime($eventId, $data['created_user']);

       $this->sendPushMessageToEventUser($eventId, $data, $queryParam, 'new');

       return $eventId;
   }

   public function updateEvent($xml){
           $eventId = $xml->event_row_id[0];
           $updateField = array('event_type_parameter_value',
                                  'event_title','event_desc',
                                  'estimated_complete_date',
                                  'related_event_row_id');
           $data = CommonUtil::arrangeUpdateDataFromXml($xml, $updateField);
           $queryParam =  array(
                'lang' => (string)$xml->lang[0],
                'need_push' => (string)$xml->need_push[0],
                'app_key' => (string)$xml->app_key[0]
                );
           
           $this->eventRepository->updateEventById($eventId,$data);
           
           if(isset($xml->related_event_row_id[0]) && $xml->related_event_row_id[0]!=""){
                $this->eventRepository->bindRelatedEvent($eventId,$xml->related_event_row_id[0]);
           }
           $result = $this->sendPushMessageToEventUser($eventId, $data, $queryParam, 'update');
           
           return $result;
   }

   public function getEventList($empNo, $eventType, $eventStatus){
        $oraEventList = $this->eventRepository->getEventList($empNo, $eventType, $eventStatus);
        $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
       
        $eventList = [];
        foreach ($oraEventList as $event) {
            $eventId = $event->event_row_id;
            $item = $this->arrangeEventList($event, $parameterMap);
            $item['user_count'] = $this->eventRepository->getUserCountByEventId($eventId);
            $item['seen_count'] = $this->eventRepository->getSeenCountByEventId($eventId);

           $eventList[] = $item;                
        }
          return $eventList;
   }

   public function getUnrelatedEventList($empNo){
    
        $oraEventList = $this->eventRepository->getUnrelatedEventList($empNo);
        $parameterMap = CommonUtil::getParameterMapByType(self::EVENT_TYPE);
       
        $eventList = [];
        foreach ($oraEventList as $event) {
           $item = $this->arrangeEventList($event, $parameterMap);
           $eventList[] = $item;                
        }
          return $eventList;
   }

   public function getEventDetail($eventId){
        
         $evenDetail = [];

         if(count($this->eventRepository->getEventDetail($eventId)) > 0 ){
             $evenDetail = $this->eventRepository->getEventDetail($eventId)[0];
             $evenDetail['user_count'] = $this->eventRepository->getUserCountByEventId($eventId);
             $evenDetail['seen_count'] = $this->eventRepository->getSeenCountByEventId($eventId);
             $evenDetail['user_event'] = $this->getEventUserDetail($eventId);
             $evenDetail['task_detail'] = $this->getTaskDetailByEventId($eventId);
         }

         return $evenDetail;
   }

   public function getTaskDetailByEventId($eventId){
        
        $result = $this->taskRepository->getTaskDetailByEventId($eventId);
        foreach ($result as $key => &$task) {
            $task['user_task'] =  $this->getTaskUserDetail($task['task_row_id']);
        }

        return $result;
   }

   public function getTaskUserDetail($taskId){
         $tsakUserDetail = $this->taskRepository->getUserByTaskId($taskId);
          $userList = [];
         foreach ($tsakUserDetail as $key => $user) {
            $userData['emp_no'] = $user->emp_no;
            $userData['login_id'] = $user->login_id;
            $userData['read_time'] = $user->read_time;
            $userList[] = $userData;
         }
         return $userList;
   }

   public function getPushUserListByEvent($eventId){
         $eventUserDetail = $this->eventRepository->getUserByEventId($eventId);
         $userList = [];
         foreach ($eventUserDetail as $user) {
            $userList[] = $user->user_domain.'\\'.$user->login_id;
         }
         return $userList;
   }

   public function getPushUserListByEmpNoArr(Array $empNoArr){
        $userInfo = $this->userRepository->getUserInfoByEmpNO($empNoArr);
        $userList = [];
        foreach ($userInfo as $user) {
            $userList[] = $user['user_domain'].'\\'.$user['login_id'];
        }
        return $userList;
   }

   public function getEventUserDetail($eventId){
         $eventUserDetail = $this->eventRepository->getUserByEventId($eventId);
         $userList = [];
         foreach ($eventUserDetail as $key => $user) {
            $userData['emp_no'] = $user->emp_no;
            $userData['login_id'] = $user->user_domain.'\\'.$user->login_id;
            $userData['read_time'] = $user->read_time;
            $userList[] = $userData;
         }
         return $userList;
   }

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

   public function getRelatedEventById($eventId){
        return $this->eventRepository->getRelatedEventById($eventId);
   }

   public function updateTaskById($taskId){
        return $this->taskRepository->updateTaskById($taskId);
   }

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
        $this->taskRepository->saveTask($TaskData);
   }

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
        $this->taskRepository->saveUserTask($UserTaskData);
   }

   private function insertUserEvent($eventId, Array $eventUser, $createdUser, $createdDate){
        $userEventData = [];
        foreach ($eventUser as $user) {
            $userEventData[] = array(
                'event_row_id'=>$eventId,
                'emp_no'=>(string)$user,
                'created_user'=>$createdUser,
                'created_at'=>$createdDate
                );
        }
        $this->eventRepository->saveUserEvent($userEventData);
   }

   private function arrangeEventList($event,  $parameterMap){
        $item = [];
        $item['event_row_id'] = $event->event_row_id;
        $item['event_type'] = $parameterMap[$event->event_type_parameter_value];
        $item['event_title'] = $event->event_title;
        $item['event_desc'] = $event->event_desc;
        $item['estimated_complete_date'] = $event->estimated_complete_date;
        $item['related_event_row_id'] = $event->related_event_row_id;
        $item['event_status'] = ($event->event_status == 0)?'未完成':'完成';
        $userInfo = $this->userRepository->getUserInfoByEmpNO(array($event->created_user));
        $item['created_user_ext_no'] = $userInfo[0]['ext_no'];
        $item['created_user'] = $userInfo[0]['login_id'];
        $item['created_at'] = $event->created_at->format('Y-m-d H:i:s');

        return $item;
   }

   private function sendPushMessageToEventUser($eventId, $data, $queryParam, $scenario = 'new'){
       $empNo = ($scenario == 'new')?$data['created_user']:$data['updated_user'];
       $to = $this->getPushUserListByEvent($eventId);
       $from = $this->getPushUserListByEmpNoArr(array( $empNo))[0];
       $title = base64_encode($data['event_title']);
       $text = base64_encode($data['event_desc']);
       //TODO append ENS event link
       $pushResult = $this->push->sendPushMessage($from, $to, $title, $text, $queryParam);
       $result = json_decode($pushResult);
       return $result;
   }

}