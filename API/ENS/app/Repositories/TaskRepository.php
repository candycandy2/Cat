<?php
/**
 *  任務Task相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Task;
use App\Model\EN_User_Task;
use App\Model\QP_User;
use DB;

class TaskRepository
{
    /** @var task Inject EN_Task model */
    protected $task;
    /** @var userTask Inject EN_User_Task model */
    protected $userTask;
    /** @var userDataBaseName user 資料庫名稱 */
    protected $userDataBaseName;
    /** @var userTableName user 資料表名稱 */
    protected $userTableName;
   
    /*
     * EventRepository constructor.
     * @param EN_Task $task
     * @param EN_User_Task $userTask
     * @param QP_User $user
     */
    public function __construct(EN_Task $task, EN_User_Task $userTask, QP_User $user)
    {     
        $this->task = $task;
        $this->userTask = $userTask;
        $this->userDataBaseName = \Config::get('database.connections.mysql_qplay.database');
        $this->userTableName = $user->getTableName();
    }

    /**
     * 取得事件所屬的任務資料
     * @param  int $eventId event row_id
     * @return mixed
     */
    public function getTaskByEventId($eventId){
         return  $this->task
            ->select('row_id','task_function','task_location')
            ->where('event_row_id','=',$eventId)
            ->orderBy('task_location','asc')
            ->orderBy('task_function','asc')
            ->get();
    }

    /**
     * 取得事件所屬的任務詳細資料
     * @param  int $eventId event row_id
     * @return Array
     */
    public function getTaskDetailByEventId($eventId){
         $result = $this->task
            ->leftJoin( $this->userDataBaseName.'.'. $this->userTableName, $this->userTableName.'.emp_no', '=', 'en_task.close_task_emp_no')
            ->select('en_task.row_id as task_row_id','task_function','task_location','task_status',
                'close_task_emp_no','close_task_date',
                DB::raw("CONCAT(user_domain,'\\\\',login_id) as close_task_user_id"))
            ->where('event_row_id','=',$eventId)
            ->orderBy('task_location','asc')
            ->orderBy('task_function','asc')
            ->get();

        return $result->toArray();
    }

    /**
     * 取得事件負責人
     * @param  int $taskId 事件id
     * @return mixed
     */
    public function getUserByTaskId($taskId){
        return $this->userTask
            ->join( $this->userDataBaseName.'.'.$this->userTableName, $this->userTableName.'.emp_no', '=', 'en_user_task.emp_no')
            ->where('task_row_id',$taskId)
            ->select(
                'en_user_task.emp_no as emp_no',
                'read_time',
                DB::raw("CONCAT(user_domain,'\\\\',login_id) as login_id")
                )
            ->orderBy('user_domain')
            ->orderBy('login_id')
            ->get();
    }

    /**
     * 儲存任務資料
     * @param  Array  $data 儲存的欄位值及資料對照
     * @return bool
     */
    public function saveTask(Array $data){
        return $this->task->insertGetId($data);
    }

    /**
     * 儲存使用者對應任務表(en_user_task)
     * @param  Array  $data 儲存的欄位值及資料對照
     * @return bool
     */
    public function saveUserTask(Array $data){
        return $this->userTask->insert($data);
    }
    
    /**
     * 依據任務id更新事件
     * @param  String   $empNo      員工編號
     * @param  int      $taskId     事件id,en_task.row_id
     * @param  Array    $updateData 更新的欄位值及資料對照
     * @return int                  更新的資料筆數
     */
    public function updateTaskById($empNo, $taskId, Array $updateData){
       $updateData['updated_user'] = $empNo;
       return $this->task->where('row_id', $taskId)
        ->update($updateData);
    }

    /**
     * 取得任務資料
     * @param  string $project project
     * @param  int $taskId    任務id,en_task.row_id
     * @return mixed
     */
    public function getTaskById($project, $taskId){
        return $this->task
                ->join('en_event', 'en_task.event_row_id', '=', 'en_event.row_id')
                ->where('en_task.row_id', '=', $taskId)
                ->where('en_event.project', '=', $project)
                ->first();
    }

    /**
     * 檢查任務是否有此參與者
     * @param  int $taskId en_task.row_id
     * @param  string $empNo  emp_no
     * @return mixed
     */
    public function getIsTaskOwner($taskId, $empNo){
        return $this->userTask
            ->where('task_row_id', '=', $taskId)
            ->where('emp_no', '=', $empNo)
            ->get();
    }

    /**
     * 取得事件已完成的任務數量
     * @param  int $eventId 事件id event.row_id
     * @return int             已完成的任務數
     */
    public function getCloseTaskCntByEventId($eventId){
        return $this->task
            ->where('event_row_id',$eventId)
            ->where('task_status', '=', 1)
            ->count();
    }

    /**
     * 取得事件未完成的任務
     * @param  int      $eventId 事件id event.row_id
     * @return mixed             未完成的任務數
     */
    public function getOpenTaskByEventId($eventId){
        return $this->task
            ->where('event_row_id',$eventId)
            ->where('task_status', '=', 0)
            ->select('row_id')
            ->get();
    }

    /**
     * 取得事件所有任務數量
     * @return int 所有任務數量
     */
    public function getAllTaskByEventId($eventId){
        return $this->task
            ->where('event_row_id',$eventId)
            ->select('row_id')
            ->count();
    }
}