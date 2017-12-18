<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use Illuminate\Support\Facades\Input;
use Config;

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
            $data = CommonUtil::arrangeDataFromXml($xml, array('emp_no', 'task_status', 'task_row_id',
                                                               'lang', 'need_push', 'project'));
            if(!isset($data['lang'])        || $data['lang']=="" || 
               !isset($data['need_push'])   || $data['need_push']=="" || 
               !isset($data['project'])     || $data['project']=="" || 
               !isset($data['task_status']) || $data['task_status']=="" ||
               !isset($data['task_row_id']) || $data['task_row_id'] =="" ){
                return $result = response()->json(['ResultCode'=>ResultCode::_014903_mandatoryFieldLost,
                    'Message'=>"必填欄位缺失",
                    'Content'=>""]);
            }

            if(!in_array($data['project'], Config::get('app.ens_project'))){
                return $result = response()->json(['ResultCode'=>ResultCode::_014922_projectInvalid,
                    'Message'=>"project參數不存在",
                    'Content'=>""]);
            }

            $empNo = $data['emp_no'];
            $taskStatus = $data['task_status'];
            $taskId = $data['task_row_id'];
            $queryParam =  array(
                'lang' => $data['lang'],
                'need_push' =>  $data['need_push'],
                'project' =>  $data['project']
            );

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

            
            $taskData = $this->eventService->getTaskById($data['project'], $taskId);
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
            $userAuthList = $this->userService->getUserRoleListByProject($data['project'], $empNo);
            if(!$checkRes && (is_null($userAuthList) || !in_array($allow_user, $userAuthList))){
                  return $result = response()->json(['ResultCode'=>ResultCode::_014907_noAuthority,
                'Message'=>"權限不足",
                'Content'=>""]);
            }
            
            if($taskStatus == $this->eventService::STATUS_FINISHED){
                $this->eventService->closeTask($empNo, $taskData->event_row_id, $taskId, $queryParam);
            }else{
                $this->eventService->reopenTask($empNo, $taskId);
            }
            \DB::commit();
            return $result = response()->json(['ResultCode'=>ResultCode::_014901_reponseSuccessful,
                        'Content'=>""]);
        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }

    }
}
