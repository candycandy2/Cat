<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Repositories\TaskRepository;
use Illuminate\Support\Facades\Input;

class TaskController extends Controller
{

    protected  $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function updateTaskStatus(){
        
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

            if(!isset($xml->task_row_id[0]) || $xml->task_row_id[0] == "" ){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
            }

            if(!isset($xml->task_status[0]) || $xml->task_status[0] == "" ){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
            }

            $empNo = (string)$xml->emp_no[0];
            $taskId = $xml->task_row_id[0];

            $taskData = $this->taskRepository->getTaskById($taskId);
            if(count($taskData) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014909_noTaskData,
                'Message'=>"查無Task資料",
                'Content'=>""]);
            }

            $res = $this->taskRepository->getUserByTaskId($taskId);
            if(count($res) == 0){
                return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                'Message'=>"權限不足",
                'Content'=>""]);
            }

            $data = CommonUtil::arrangeUpdateDataFromXml($xml, array('task_status'));
            $resutlt = $this->taskRepository->updateTaskById($taskId,$data);

            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                        'Content'=>""]);
        } catch (Exception $e){
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
           
        }

    }
}
