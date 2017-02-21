<?php
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Task;
use App\Model\EN_User_Task;
use DB;

class TaskRepository
{
    /** @var task Inject EN_Event model */
    protected $task;
    /** @var userTask Inject EN_Event model */
    protected $userTask;
   
    /*
     * EventRepository constructor.
     * @param EN_Event task
     */
    public function __construct(EN_Task $task, EN_User_Task $userTask)
    {     
        $this->task = $task;
        $this->userTask = $userTask;
    }

    /**
     * 取得事件所屬的任務資料
     * @param  int $eventId event row_id
     * @return mix
     */
    public function getTaskByEventId($eventId){
         return  $this->task
            ->select('row_id','task_function','task_location')
            ->where('event_row_id','=',$eventId)
            ->get();
    }

    /**
     * 取得事件所屬的任務詳細資料
     * @param  int $eventId event row_id
     * @return Array
     */
    public function getTaskDetailByEventId($eventId){
         $result = $this->task
            ->leftJoin( 'en_user', 'en_user.emp_no', '=', 'en_task.close_task_emp_no')
            ->select('en_task.row_id as task_row_id','task_function','task_location','task_status',
                'close_task_emp_no','close_task_date',
                DB::raw("CONCAT(user_domain,'\\\\',login_id) as close_task_user_id"))
            ->where('event_row_id','=',$eventId)
            ->get();

        return $result->toArray();
    }

    /**
     * 取得事件負責人
     * @param  int $taskId 事件id
     * @return mix
     */
    public function getUserByTaskId($taskId){
        return $this->userTask
            ->join( 'en_user', 'en_user.emp_no', '=', 'en_user_task.emp_no')
            ->where('task_row_id',$taskId)
            ->select(
                'en_user_task.emp_no as emp_no',
                'read_time',
                DB::raw("CONCAT(login_id,'\\\\',user_domain) as login_id")
                )
            ->get();
    }

    /**
     * 儲存任務資料
     * @param  Array  $data 儲存的欄位值及資料對照
     */
    public function saveTask(Array $data){
        $this->task->insert($data);
    }

    /**
     * 儲存使用者對應任務表(en_user_task)
     * @param  Array  $data 儲存的欄位值及資料對照
     */
    public function saveUserTask(Array $data){
        $this->userTask->insert($data);
    }

    /**
     * 取得事件相關人
     * @param  int $eventId en_event.row_id 
     * @return mix 
     */
    public function getAllUserFromTaskbyEventId($eventId){
       return $this->userTask
            ->join( 'en_task', 'en_task.row_id', '=', 'en_user_task.task_row_id')
            ->where('event_row_id', '=', $eventId)
            ->select('emp_no')
            ->get();
    }
    /**
     * 依據任務id更新事件
     * @param  int      $taskId     事件id,en_task.row_id
     * @param  Array    $updateData 更新的欄位值及資料對照
     * @return int                  更新的資料筆數
     */
    public function updateTaskById($taskId, Array $updateData){
       return $this->task->where('row_id', $taskId)
        ->update($updateData);
    }

    /**
     * 取得任務資料
     * @param  int $taskId    事件id,en_task.row_id
     * @return mixs
     */
    public function getTaskById($taskId){
         return $this->task
                ->where('row_id',$taskId)
                ->first();
    }

    /**
     * 檢查任務是否有此參與者
     * @param  [type] $taskId en_task.row_id
     * @param  [type] $empNo  emp_no
     * @return mix
     */
    public function getIsTaskOwner($taskId, $empNo){
        return $this->userTask
            ->where('row_id', '=', $taskId)
            ->where('emp_no', '=', $empNo)
            ->get();
    }

}