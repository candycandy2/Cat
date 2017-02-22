<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use Illuminate\Support\Facades\Input;

class TaskController extends EventController
{

    /**
     * 更新Task狀態
     * @return json
     */
    public function updateTaskStatus(){
        
        $allow_user = 'admin';
        \DB::beginTransaction();
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
            $empNo = (string)$xml->emp_no[0];
            $taskStatus = (string)$xml->task_status[0];
            $taskId = (string)$xml->task_row_id[0];

            if(trim($taskId) == "" || trim($taskStatus) == "" ){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                'Message'=>"必填欄位缺失",
                'Content'=>""]);
            }

            if($taskStatus != $this->eventService::STATUS_FINISHED && $taskStatus != $this->eventService::STATUS_UNFINISHED){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014914_taskStatusCodeError,
                'Message'=>"任務狀態碼錯誤",
                'Content'=>""]);
            }

            
            $taskData = $this->eventService->getTaskById($taskId);
            if(count($taskData) == 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014909_noTaskData,
                'Message'=>"查無Task資料",
                'Content'=>""]);
            }

            if($Verify->isEventClosed($taskData->event_row_id, $this->eventRepository)){
                 return $result = response()->json(['ResultCode'=>ResultCode::_014910_eventClosed,
                'Message'=>"無法編輯已完成事件",
                'Content'=>""]);
            }

            $checkRes = $this->eventService->checkUpdateTaskAuth($taskId, $empNo);
            $userAuthList = $this->userService->getUserRoleList($empNo);
            if(!$checkRes && !in_array($allow_user, $userAuthList)){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                'Message'=>"權限不足",
                'Content'=>""]);
            }
           
            $data = $this->getUpdataStatusData($taskStatus, $xml);
            $resutlt = $this->eventService->updateTaskById($taskId,$data);
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                        'Content'=>""]);
        } catch (Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>""]);
           
        }

    }

    /**
     * 取得更新狀態資料
     * @param  int    $taskStatus task狀態 (0:未完成 | 1:已完成)
     * @param  string $xml request data 
     * @return Array       更新資料Array
     */
    private function getUpdataStatusData($taskStatus, $xml){
        $data = [];

        $data = CommonUtil::arrangeUpdateDataFromXml($xml, array('task_status'));
             
        if($taskStatus == $this->eventService::STATUS_UNFINISHED){
                $data['close_task_emp_no'] = "";
                $data['close_task_date'] = 0;
        }else{
                $data['close_task_emp_no'] = (string)$xml->emp_no[0];
                $data['close_task_date'] = time();
        }

        return $data;
    }
}
