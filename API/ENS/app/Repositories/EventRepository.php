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

    /**
     * 更新事件資料
     * @param  Array  $data 更新事件內容
     * @return int          被更新的事件id
     */
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

    /**
     * 新增事件資料
     * @param  Array  $data 新增事件內容
     * @return int          新增成功的事件id
     */
    public function saveUserEvent(Array $data){
        return $this->userEvent-> insertGetId($data);
    }

    /**
     * 更新事件讀取時間
     * @param  int    $eventId 事件id en_event.row_id
     * @param  String $empNo   員工編號
     * @return int             已更新資料筆數
     */
    public function updateReadTime($eventId, $empNo){
        $this->userEvent::where('event_row_id',$eventId)
            ->where('emp_no','=',(string)$empNo)
            ->update(['read_time' => time()]);
    }

    /**
     * 綁定關聯事件
     * @param  int $eventId         欲關聯的事件id
     * @param  int $bindEventId     被綁定的事件
     * @return int                  已綁定資料筆數
     */
    public function bindRelatedEvent($eventId, $bindEventId){
        $this->event::where('row_id', $bindEventId)
            ->where('related_event_row_id',0)
            ->update(['related_event_row_id' => $eventId]);
    }

    /**
     * 取得事件關聯性，檢查欲關聯的事件是否真的為被關聯
     * @param  int $relatedId 關聯事件id
     * @return mixed
     */
    public function getRelatedStatusById($relatedId){
       return $this->event::where('row_id', $relatedId)
            ->where('related_event_row_id', 0)
            ->select('row_id')
            ->get();
    }

    /**
     * 取得事件列表
     * @param  String $empNo       員工編號
     * @param  int    $eventType   1:緊急通報 | 2:一般通報 (非必填，不需要篩選時傳入空字串)
     * @param  int $eventStatus 事件狀態 1:已完成 | 0:未完成 (非必填，不需要篩選時傳入空字串)
     * @return mixed
     */
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
     * @param  int $eventId en_event.row_id
     * @return mix
     */
    public function getEventDetail($eventId){
       
        return $this->event
            ->where('row_id', '=', $eventId)
            ->select($this->eventField)
            ->first();
    }

    /**
     * 依事件取得餐與者
     * @param  int $eventId  事件id en_event.row_id
     * @return mix
     */
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

    /**
     * 依事件取得參與人數
     * @param  int $eventId  事件id en_event.row_id
     * @return int              事件參與人數
     */
    public function getUserCountByEventId($eventId){
        return $this->userEvent
            ->where('event_row_id',$eventId)
            ->count();
    }

    /**
     * 取得事件已讀人數
     * @param  int $eventId 事件id en_event.row_id
     * @return int          事件已讀取人數
     */
    public function getSeenCountByEventId($eventId){
        return $this->userEvent
            ->where('event_row_id',$eventId)
            ->where('read_time','>',0)
            ->count();
    }

    /**
     * 更新事件表
     * @param  int      $eventId  事件id en_event.row_id
     * @param  Array    $updateData 更新的資料欄位對應
     * @return int                已更新的資料筆數
     */
    public function updateEventById($eventId, Array $updateData){
        $this->event->where('row_id', $eventId)
        ->update($updateData);
    }

    /**
     * 更新使用者對應事件表
     * @param  int      $eventId    事件id en_event.row_id
     * @param  String   $empNo      員工編號
     * @param  Array    $updateData 更新的資料欄位對應
     * @return int                  已更新的資料筆數
     */
    public function updateUserEvent($eventId, $empNo, Array $updateData){
        $this->userEvent
        ->where('event_row_id', $eventId)
        ->where('emp_no', $empNo)
        ->update($updateData);
    }

    /**
     * 檢查事件是否有此參與者
     * @param  [type] $taskId en_task.row_id
     * @param  [type] $empNo  emp_no
     * @return mix
     */
    public function getIsEventOwner($eventId, $empNo){
        return $this->userEvent
            ->where('event_row_id', '=', $eventId)
            ->where('emp_no', '=', $empNo)
            ->get();
    }
}