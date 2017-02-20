<?php
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Event;
use App\Model\EN_User_Event;
use DB;

class EventRepository
{
    /** @var event Inject EN_Event model */
    protected $event;

    private $eventField = array('en_event.row_id as event_row_id','event_type_parameter_value','event_title','event_desc',
                'estimated_complete_date','related_event_row_id','event_status',
                'en_event.created_user as created_user','en_event.created_at as created_at');
   
    /*
     * EventRepository constructor.
     * @param EN_Event $event
     */
    public function __construct(EN_Event $event, EN_User_Event $userEvent)
    {     
        $this->event = $event;
        $this->userEvent = $userEvent;
    }

    public function saveEvent(Array $data){
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        $this->event->event_type_parameter_value = $data['event_type_parameter_value'];
        $this->event->event_title = $data['event_title'];
        $this->event->event_desc = $data['event_desc'];
        $this->event->estimated_complete_date = $data['estimated_complete_date'];
        $this->event->related_event_row_id = $data['related_event_row_id'];
        $this->event->event_status = 0;
        $this->event->created_user = $data['created_user'];
        $this->event->created_at = $now;
        $this->event->save();
        return $this->event->row_id;
    }


    public function saveUserEvent(Array $data){
         $this->userEvent->insert($data);
    }

    public function updateReadTime($eventId, $empNo){
        $this->userEvent::where('event_row_id',$eventId)
            ->where('emp_no','=',(string)$empNo)
            ->update(['read_time' => time()]);
    }

    public function bindRelatedEvent($eventId, $bindEventId){
        $this->event::where('row_id', $bindEventId)
            ->where('related_event_row_id',0)
            ->update(['related_event_row_id' => $eventId]);
    }

    public function getRelatedEventById($relatedId){
       return $this->event::where('row_id', $relatedId)
            ->where('related_event_row_id', 0)
            ->select('row_id')
            ->get();
    }

    public function getEventList($empNo, $eventType, $eventStatus){
        $result = $this->event->where('en_user_event.emp_no', '=', (string)$empNo)
                 ->where('event_type_parameter_value', '=', $eventType)
                 ->join( 'en_user_event', 'en_event.row_id', '=', 'en_user_event.event_row_id');
        if($eventType!=""){
            $result->where('event_type_parameter_value', '=', $eventType);
        }
        if($eventStatus!=""){
            $result->where('event_status', '=', $eventStatus);
        }
        return $result->orderByRaw(DB::raw("event_status,en_event.updated_at,en_event.created_at desc"))
             ->select($this->eventField)
             ->get();
    }

    /**
     * 取回不包含自己且尚未被關聯的事件
     * @param  int $currentEventId 目前事件
     * @return mix
     */
    public function getUnrelatedEventList($currentEventId){
        return $this->event
            ->where('row_id', '<>', $currentEventId)
            ->where('related_event_row_id', '=', 0)
            ->select($this->eventField)
            ->get();
    }

    /**
     * 取得事件內容
     * @param  int $eventId event_row_id
     * @return mix
     */
    public function getEventDetail($eventId){
       
        return $this->event
            ->where('row_id', '=', $eventId)
            ->select($this->eventField)
            ->first();
    }

    public function getUserByEventId($eventId){
        return $this->userEvent
            ->join( 'en_user', 'en_user.emp_no', '=', 'en_user_event.emp_no')
            ->where('event_row_id',$eventId)
            ->select(
                'en_user_event.emp_no as emp_no',
                'read_time',
                'login_id',
                'user_domain'
                )
            ->get();
    }

    public function getUserCountByEventId($eventId){
        return $this->userEvent
            ->where('event_row_id',$eventId)
            ->count();
    }

    public function getSeenCountByEventId($eventId){
        return $this->userEvent
            ->where('event_row_id',$eventId)
            ->where('read_time','>',0)
            ->count();
    }

    public function updateEventById($eventId, Array $updateData){
        $this->event->where('row_id', $eventId)
        ->update($updateData);
    }

    public function updateUserEvent($eventId, $empNo, Array $updateData){
        $this->userEvent
        ->where('event_row_id', $eventId)
        ->where('emp_no', $empNo)
        ->update($updateData);
    }
}