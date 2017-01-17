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
     * get task info which belong event
     * @param  int $eventId event row_id
     * @return Collaction
     */
    public function getTaskByEventId($eventId){
         return  $this->task
            ->select('row_id','task_function','task_location')
            ->where('event_row_id','=',$eventId)
            ->get();
    }

    public function getTaskDetailByEventId($eventId){
         $result = $this->task
            ->leftJoin( 'en_user', 'en_user.emp_no', '=', 'en_task.close_task_emp_no')
            ->select('en_task.row_id as task_row_id','task_function','task_location','task_status',
                'close_task_emp_no','close_task_date',
                DB::raw("CONCAT(login_id,'\\\\',user_domain) as close_task_date"))
            ->where('event_row_id','=',$eventId)
            ->get();

        return $result->toArray();
    }

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

    
    public function saveTask(Array $data){
        $this->task->insert($data);
    }


    public function saveUserTask(Array $data){
        $this->userTask->insert($data);
    }

    public function getAllUserFromTaskbyEventId($eventId){
       return $this->userTask
            ->join( 'en_task', 'en_task.row_id', '=', 'en_user_task.task_row_id')
            ->where('event_row_id', '=', $eventId)
            ->select('emp_no')
            ->get();
    }

    public function updateTaskById($taskId, Array $updateData){
       return $this->task->where('row_id', $taskId)
        ->update($updateData);
    }

    public function getTaskById($taskId){
         return $this->task
                ->where('row_id',$taskId)
                ->get();
    }
}