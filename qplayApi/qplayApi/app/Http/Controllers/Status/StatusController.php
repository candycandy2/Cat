<?php

namespace App\Http\Controllers\Status;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\Services\StatusService;
use App\Services\StatusLogService;
use Validator;
use DB;

class StatusController extends Controller
{

    protected $statusService;
    protected $statusLogService;

     private $connection = 'mysql';

    public function __construct(StatusService $statusService,
                                StatusLogService $statusLogService)
    {   
        $this->statusService = $statusService;
        $this->statusLogService = $statusLogService;
    }

    /**
     * New status and update status
     * @param Request $request
     * @return json
     */
    public function setStatus(Request $request)
    {
    
        $rule = [
            'status_new' => 'required_without:status_update|array',
            'status_update' => 'required_without:status_new|array',
            'login_id' => 'required',
            'domain' => 'required',
            'emp_no' => 'required'
            ];
        if(isset($request->status_new)){
            foreach ($request->status_new as $key => $status) {
                
                $root = 'status_new.'.$key;

                $rule[$root.'.status_id']     = 'required';
                $rule[$root.'.status_type']     = 'required';
                $rule[$root.'.period_list']    = ['required','array'];
                
                if(isset($status['period_list'])){
                   
                   foreach ($status['period_list'] as $pkey => $period) {
                        
                        $subRoot = $root.'.period_list.'.$pkey;      
                        
                        $rule[$subRoot.'.status']     = ['required','numeric'];
                        $rule[$subRoot.'.life_type']  = ['required','in:0,1'];
                        $rule[$subRoot.'.life_start'] = 'required_if:'.$subRoot.'.life_type,1';
                        $rule[$subRoot.'.life_end']   = 'required_if:'.$subRoot.'.life_type,1';
                        $rule[$subRoot.'.crontab']    = 'required';
                   }
                }
            }
        }
        //set orignal new and update status
        $newSuccess = 0;
        $updateSuccess = 0;

        if(isset($request->status_update)){
            foreach ($request->status_update as $key => $status) {
                
                $root = 'status_update.'.$key;

                $rule[$root.'.status_id']     = 'required';
                $rule[$root.'.status_type']     = 'required';
                $rule[$root.'.period_list']    = ['required','array'];
                
                if(isset($status['period_list'])){
                   
                   foreach ($status['period_list'] as $pkey => $period) {
                        
                        $subRoot = $root.'.period_list.'.$pkey;      
                        
                        $rule[$subRoot.'.life_crontab_row_id']     = ['required','numeric'];
                        $rule[$subRoot.'.status']     = 'required';
                        $rule[$subRoot.'.life_type']  = ['required','in:0,1'];
                        $rule[$subRoot.'.life_start'] = 'required_if:'.$subRoot.'.life_type,1';
                        $rule[$subRoot.'.life_end']   = 'required_if:'.$subRoot.'.life_type,1';
                        $rule[$subRoot.'.crontab']    = 'required';
                   }
                }
            }
        }

        $errorMsg = [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'required_without' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'array' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'in' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'required_if'=>ResultCode::_999001_requestParameterLostOrIncorrect,
            ];

        $validator = Validator::make($request->all(), $rule, $errorMsg );

        if ($validator->fails()) {
                return response()->json(['result_code'=>$validator->errors()->first(),
                                          'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }
        try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();

            //new status
            if(isset($request->status_new)){
                $newResult = $this->newStatus($request->login_id, $request->domain, $request->emp_no, $request->status_new);

                if($newResult[0]['result_code'] == ResultCode::_1_reponseSuccessful){

                    $this->statusLogService->newStatusLog($newResult[1]);
                    $newSuccess = 1;

                }else{
                    return response()->json($newResult[0], 200);
                }
               
                
            }
            
            //update status
            if(isset($request->status_update)){

                $updateResult = $this->updateStatus($request->login_id, $request->domain, $request->emp_no, $request->status_update);

                if($updateResult[0]['result_code'] == ResultCode::_1_reponseSuccessful){

                    $this->statusLogService->newStatusLog($updateResult[1]);
                    $updateSuccess = 1;

                }else{
                    return response()->json($updateResult[0], 200);
                }

            }

            //new & update all success
            if( $newSuccess + $updateSuccess > 0){
                
                $DBconn->commit();

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                     'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS")],200);
                
                
            }

        } catch (\Exception $e) {
            $DBconn->rollBack();
            throw $e;
        }
    }

    /**
     * Batch new Status
     * @param  string $loginId user login_id
     * @param  string $domain  user domain
     * @param  string $empNo   user emp_no
     * @param  Array  $newData insert Data List
     * @return Array
     */
    private function newStatus($loginId, $domain, $empNo, $newData){

        $result = [];

        foreach ($newData as $key => $value) {
            $statusExist = $this->statusService->checkStatusExist($value['status_id']);
            //check status already exist or not
            if($statusExist){
                $result[0] = ["result_code" => ResultCode::_000933_statusStatusIDExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_000933_statusStatusIDExist)];
                return $result;

            }
            //validate life start date,life end date
            foreach ($value['period_list'] as $pKey => $pValue) {
                if($pValue['life_type'] == 1){
                    if($pValue['life_start'] > $pValue['life_end']){
                        
                        $result[0] = ["result_code" => ResultCode::_000936_statusStatusDateRangeInvalid, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_000936_statusStatusDateRangeInvalid)];

                        return $result;
                    }
                }

            }
            
        }
        
        return $this->statusService->newStatus($loginId, $domain, $empNo, $newData);
        
    }


    /**
     * Batch update status
     * @param  string $loginId    user login_id
     * @param  string $domain     user domain
     * @param  string $empNo      user emp_no
     * @param  Array  $updateData update Data List
     * @return Array
     */
    private function updateStatus($loginId, $domain, $empNo, $updateData){

        $result = [];

        foreach ($updateData as $key => $value) {
            $statusExist = $this->statusService->checkStatusExist($value['status_id']);
            //check status already exist or not
            if(!$statusExist){

                $result[0] =  ["result_code" => ResultCode::_000934_statusStatusIDNotExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_000934_statusStatusIDNotExist)];
                return $result;

            }
            //validate life start date,life end date
            foreach ($value['period_list'] as $pKey => $pValue) {
                
                $crontabExist = $this->statusService
                                     ->checkStatusLifeCrontabExist($value['status_id'], $pValue['life_crontab_row_id']);
                if(!$crontabExist){

                    $result[0] = ["result_code" => ResultCode::_000937_statusStatusLifeCrontabNotExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_000937_statusStatusLifeCrontabNotExist)];
                    return $result;

                }
                
                if($pValue['life_type'] == 1){

                    if($pValue['life_start'] > $pValue['life_end']){
                        
                        $result[0] = ["result_code" => ResultCode::_000936_statusStatusDateRangeInvalid, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_000936_statusStatusDateRangeInvalid)];
                        return $result;

                    }
                    
                }
            }
        }

        return $this->statusService->updateStatus($loginId, $domain, $empNo, $updateData);
    }

}
