<?php
/**
 * 事件Event相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Event;
use App\Model\EN_User_Event;
use App\Model\QP_User;
use DB;

class EventRepository
{
    /** @var event Inject EN_Event model */
    protected $event;
    /** @var userDataBaseName user 資料庫名稱 */
    protected $userDataBaseName;
    /** @var userTableName user 資料表名稱 */
    protected $userTableName;

    private $eventField = array('en_event.row_id as event_row_id','event_type_parameter_value as event_type',
                'event_title','event_desc',
                'estimated_complete_date','related_event_row_id','en_event.event_status','chatroom_id',
                'en_event.created_user as created_user','en_event.created_at as created_at',
                'en_event.updated_user as updated_user','en_event.updated_at as updated_at');
   
    /*
     * EventRepository constructor.
     * @param EN_Event $event
     * @param EN_User_Event $userEvent
     * @param QP_User $user
     */
    public function __construct(EN_Event $event, EN_User_Event $userEvent, QP_User $user)
    {     
        $this->event = $event;
        $this->userEvent = $userEvent;
        $this->userDataBaseName = \Config::get('database.connections.mysql_qplay.database');
        $this->userTableName = $user->getTableName();
    }

    /**
     * 更新事件資料
     * @param  String  $empNo  使用者員工編號 
     * @param  Array   $data   更新事件內容
     * @return int             被更新的事件id
     */
    public function saveEvent($empNo, Array $data){

        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        $this->event->event_type_parameter_value = $data['event_type_parameter_value'];
        $this->event->event_title = $data['event_title'];
        $this->event->event_desc = $data['event_desc'];
        $this->event->estimated_complete_date = $data['estimated_complete_date'];
        $this->event->related_event_row_id = $data['related_event_row_id'];
        $this->event->event_status = 0;
        $this->event->created_user = $empNo;
        $this->event->created_at = $now;
        $this->event->updated_user = $empNo;
        $this->event->updated_at = $now;
        $this->event->chatroom_id = $data['chatroom_id'];
        $this->event->save();
        $queries = DB::getQueryLog();

        return $this->event->row_id;
    }

    /**
     * 新增事件資料
     * @param  Array  $data 新增事件內容
     * @return bool
     */
    public function saveUserEvent(Array $data){
        return $this->userEvent-> insert($data);
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
    public function bindRelatedEvent($eventId, $bindEventId, $empNo){
        
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
                
        $this->event::where('row_id', $bindEventId)
             ->where('related_event_row_id',0)
             ->update(['related_event_row_id' => $eventId,
                       'en_event.updated_user'=>$empNo,
                       'en_event.updated_at'=>$now,]);
        
        $this->event::where('row_id', $eventId)
             ->where('related_event_row_id',0)
             ->update(['related_event_row_id' => $bindEventId,
                       'en_event.updated_user'=>$empNo,
                       'en_event.updated_at'=>$now,]);
    }

    public function unBindRelatedEvent($eventId,  $empNo){
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        $res = \DB::table("en_event")
        ->join('en_event as rel','en_event.related_event_row_id','=','rel.row_id')
        ->where('en_event.related_event_row_id','=',$eventId)
        ->update(['en_event.related_event_row_id' => 0,
                  'rel.related_event_row_id'=>0,
                  'en_event.updated_user'=>$empNo,
                  'en_event.updated_at'=>$now,
                  ]);

    }

    /**
     * 取得事件關聯到的事件id
     * @param  int $eventId 關聯事件id
     * @return mixed
     */
    public function getRelatedStatusById($eventId){
       return $this->event::where('row_id', $eventId)
            ->select('related_event_row_id')
            ->first();
    }

    /**
     * 取得事件列表
     * @param  String $empNo       員工編號
     * @param  int    $eventType   1:緊急通報 | 2:一般通報 (非必填，不需要篩選時傳入空字串)
     * @param  int    $eventStatus    事件狀態 1:已完成 | 0:未完成 (非必填，不需要篩選時傳入空字串)
     * @return mixed
     */
    public function getEventList($empNo, $eventType, $eventStatus){
        
        $order = "en_event.updated_at desc, en_event.created_at desc";

        $result = $this->event->where('en_user_event.emp_no', '=', (string)$empNo)
                 ->join( 'en_user_event', 'en_event.row_id', '=', 'en_user_event.event_row_id');
        if($eventType!=""){
            $result->where('event_type_parameter_value', '=', $eventType);
        }
        if($eventStatus!=""){
            $result->where('event_status', '=', $eventStatus);
             $order = "en_event.event_status asc, event_type asc, en_event.updated_at desc, en_event.created_at desc";
        }
        
        return $result->orderByRaw(DB::raw($order))
             ->select($this->eventField)
             ->get();
    }

    /**
     * 取回不包含自己且尚未被關聯的事件
     * @param  int $currentEventId 目前事件
     * @return mixed
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
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getEventDetail($eventId, $empNo){
        return $this->event
            ->join('en_user_event','en_user_event.event_row_id','=','en_event.row_id')
            ->join($this->userDataBaseName.'.'.$this->userTableName,$this->userTableName.'.emp_no','=','en_event.created_user')
            ->where('en_event.row_id', '=', $eventId)
            ->where('en_user_event.emp_no' ,'=', $empNo)
            ->select($this->eventField)
            ->first();
    }

    /**
     * 依事件取得參與者
     * @param  int $eventId  事件id en_event.row_id
     * @return mixed
     */
    public function getUserByEventId($eventId){
        
        return $this->userEvent
            ->join( $this->userDataBaseName.'.'.$this->userTableName, $this->userTableName.'.emp_no', '=', 'en_user_event.emp_no')
            ->where('event_row_id',$eventId)
            ->select(
                'en_user_event.emp_no as emp_no',
                'read_time',
                'login_id',
                'user_domain'
                )
            ->orderBy('user_domain')
            ->orderBy('login_id')
            ->get();
    }

     /**
     * 依事件取得參與者並過濾掉離職或停權人員
     * @param  int $eventId  事件id en_event.row_id
     * @return mixed
     */
    public function getUserByEventIdWithRight($eventId){
        
        return $this->userEvent
            ->join( $this->userDataBaseName.'.'.$this->userTableName, $this->userTableName.'.emp_no', '=', 'en_user_event.emp_no')
            ->where('event_row_id',$eventId)
            ->where($this->userTableName.'.status','<>','N')
            ->where($this->userTableName.'.resign','<>','Y')
            ->select(
                'en_user_event.emp_no as emp_no',
                'read_time',
                'login_id',
                'user_domain'
                )
            ->orderBy('user_domain')
            ->orderBy('login_id')
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
     * @param  int      $eventId     事件id en_event.row_id
     * @param  Array    $updateData  更新的資料欄位對應
     * @return int                   已更新的資料筆數
     */
    public function updateEventById($eventId, Array $updateData){

        if(count($updateData) > 0){
            $this->event->where('row_id', $eventId)
            ->update($updateData);
        }
    }

    /**
     * 更新使用者對應事件表
     * @param  String   $empNo      員工編號
     * @param  int      $eventId    事件id en_event.row_id
     * @param  Array    $updateData 更新的資料欄位對應
     * @return int                  已更新的資料筆數
     */
    public function updateUserEvent($empNo, $eventId,  Array $updateData){
        $updateData['updated_user'] = $empNo;
        $this->userEvent
        ->where('event_row_id', $eventId)
        ->where('emp_no', $empNo)
        ->update($updateData);
    }

    /**
     * 檢查事件是否有此參與者
     * @param  int    $eventId en_event.row_id
     * @param  String $empNo  員工編號
     * @return mixed
     */
    public function getIsEventOwner($eventId, $empNo){
        return $this->userEvent
            ->where('event_row_id', '=', $eventId)
            ->where('emp_no', '=', $empNo)
            ->get();
    }

    /**
     * 取得事件狀態
     * @param  int $eventId     事件id en_event.row_id
     * @return mixed
     */
    public function getEventStatus($eventId){
         return $this->event
            ->where('row_id', '=', $eventId)
            ->select('row_id','event_status')
            ->first();
    }

    /**
     * 依據事件Id取得事件資料
     * @param  int $eventId 事件id en_event.row_id
     * @return mixed
     */
    public function getEventById($eventId){
        return $this->event
            ->where('row_id', '=', $eventId)
            ->select('row_id','event_status')
            ->first();
    }
}