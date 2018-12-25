<?php

namespace App\Http\Controllers\EmpService;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Services\EmpServiceReserveService;
use App\Services\EmpServiceLogService;
use App\Services\EmpServiceTargetService;
use App\Services\EmpServiceServiceService;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;
use DB;

class ReserveController extends Controller
{
    protected $reserveService;
    protected $empService;
    protected $targetService;
    protected $empServiceLog;

    private $connection = 'mysql_emp_service';

    public function __construct(EmpServiceReserveService $reserveService,
                                EmpServiceServiceService $empService,
                                EmpServiceTargetService $targetService,
                                EmpServiceLogService $empServiceLog)
    {
        $this->reserveService = $reserveService;
        $this->empService = $empService;
        $this->targetService = $targetService;
        $this->empServiceLog = $empServiceLog;
    }

    /**
     * New a reserve
     * You can determine who will received the push message by setting parameter push 00/01/10/11
     * @param  Request $request
     * @return json
     */
    public function newReserve(Request $request){
        
        //parameter verify
        $validator = Validator::make($request->all(),[ 
                'target_id_row_id'  =>['required', 'numeric'],
                'login_id'          =>'required',
                'domain'            =>'required',
                'emp_no'            =>'required',
                'start_date'        =>['required', 'numeric', 'digits:10'],
                'end_date'          =>['required', 'numeric', 'digits:10'],
                'info_push_title'   =>'required',
                'info_push_content' =>'required',
                'info_data'         =>'required',
                'push'              =>'required'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'size' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }
        
        $target = $this->targetService->getTargetByRowId($request->target_id_row_id);

        if(is_null($target)){
            return response()->json(["result_code" => ResultCode::_052004_empServiceTargetNotExist, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052004_empServiceTargetNotExist)], 200);
        }

        if($request->start_date < $request->end_date){
            return response()->json(["result_code" => ResultCode::_052005_empServiceDateRangeInvalid, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052005_empServiceDateRangeInvalid)], 200);
        }

        $pushSetting = [ '00', '01', '10', '11' ];
        if(!in_array($request->push, $pushSetting)){
            return response()->json(["result_code" => ResultCode::_052006_empServicePushDataInvalid, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052006_empServicePushDataInvalid)], 200);
        }

        $manager = $this->empService->getServiceManager($target->service_id_row_id);

        $data = [
                'target_id_row_id' => $request->target_id_row_id,
                'login_id' => $request->login_id,
                'domain' => $request->domain,
                'emp_no' => $request->emp_no,
                'start_date'       => gmdate("Y-m-d H:i:s", $request->start_date),
                'end_date'         => gmdate("Y-m-d H:i:s", $request->end_date),
                'info_push_title'  => $request->info_push_title,
                'info_push_content'=> $request->info_push_content,
                'info_data'        => $request->info_data,
                'push'             => $request->push
            ];

        $managerInfo = [
                'manager_login_id' => $manager->login_id,
                'manager_domain'   => $manager->domain,
                'manager_emp_no'   => $manager->emp_no
            ];

        try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();

            $result = $this->reserveService->newReserve($data, $managerInfo, $request->lang);

            if($result[0]['result_code'] == ResultCode::_1_reponseSuccessful){

                $this->empServiceLog->newDataLog($result[1]);

            }

            $DBconn->commit();
            return response()->json($result[0]);
        
        } catch (\Exception $e) {
            $DBconn->rollBack();
            throw $e;
        }
    }

    /**
     * Get reserve record
     * @param  Request $request 
     * @return json
     */
    public function getReserveRecord(Request $request){

        //parameter verify
        $validator = Validator::make($request->all(),[ 
                'service_id'        =>'required',
                'start_date'        =>['required', 'numeric', 'digits:10'],
                'end_date'          =>['required', 'numeric', 'digits:10'],
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        if(is_null($this->empService->getServiceRowId($request->service_id))){
            return response()->json(["result_code" => ResultCode::_052002_empServiceNotExist, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052002_empServiceNotExist)], 200);
        }

        if($request->start_date > $request->end_date){
            return response()->json(["result_code" => ResultCode::_052005_empServiceDateRangeInvalid, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052005_empServiceDateRangeInvalid)], 200);
        }

        $result = $this->reserveService->getReserveRecord($request->service_id, $request->start_date, $request->end_date);
        return response()->json($result);

    }

    /**
     * Get reserve data by target_id_row_id
     * @param  Request $request
     * @return json
     */
    public function getTargetReserveData(Request $request){

        //parameter verify
        $validator = Validator::make($request->all(),[ 
                'target_id_row_id'  =>['required', 'numeric'],
                'start_date'        =>['required', 'numeric', 'digits:10'],
                'end_date'          =>['required', 'numeric', 'digits:10'],
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        $target = $this->targetService->getTargetByRowId($request->target_id_row_id);

        if(is_null($target)){
            return response()->json(["result_code" => ResultCode::_052004_empServiceTargetNotExist, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052004_empServiceTargetNotExist)], 200);
        }

        if($request->start_date > $request->end_date){
            return response()->json(["result_code" => ResultCode::_052005_empServiceDateRangeInvalid, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052005_empServiceDateRangeInvalid)], 200);
        }

        $result = $this->reserveService->getTargetReserveData($request->target_id_row_id, $request->start_date, $request->end_date);
        return response()->json($result);
    }

    /**
     * get　my reserve data by service type or service id
     * @param  Request $request
     * @return json
     */
    public function getMyReserve(Request $request){

        //parameter verify
        $validator = Validator::make($request->all(),[ 
                'service_id' => 'required_without:service_type',
                'service_type' => 'required_without:service_id',
                'login_id' =>'required',
                'domain' => 'required',
                'emp_no' => 'required',
                'start_date'        =>['required', 'numeric', 'digits:10'],
                'end_date'          =>['required', 'numeric', 'digits:10'],
                ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        //between service_type and service_id chooese one to query.

        if(isset($request->service_type)){

            $serviceRs = $this->empService->getServiceListByType($request->service_type);

            if(count($serviceRs) == 0){
                  return ["result_code" => ResultCode::_052003_empServiceTypeNotExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_052003_empServiceTypeNotExist)];
            }

            $serviceListRs = $this->reserveService->getMyReserveByServiceType($request->service_type, $request->emp_no, $request->start_date, $request->end_date);
            
            return response()->json($serviceListRs);
            
        }else if(isset($request->service_id)){

            $serviceRs = $this->empService->getServiceRowId($request->service_id);
            if(is_null($serviceRs)){
                  return ["result_code" => ResultCode::_052002_empServiceNotExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_052002_empServiceNotExist)];
            }

            $serviceListRs = $this->reserveService->getMyReserveByServiceID($request->service_id, $request->emp_no, $request->start_date, $request->end_date);
            
            return response()->json($serviceListRs);
        }
    }

    /**
     * Set reserve to complete
     * @param Request $request
     * @return json
     */
    public function setReserveComplete(Request $request){

        //parameter verify
        $validator = Validator::make($request->all(),[ 
                'reserve_id' => ['required', 'numeric'],
                'login_id' => 'required',
                'domain' =>'required',
                'emp_no' => 'required'
                ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }


        $reserve = $this->reserveService->getReserveByRowID($request->reserve_id);
        if(is_null($reserve)){
            return ["result_code" => ResultCode::_052007_empServiceReserveNotExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_052007_empServiceReserveNotExist)];
        }

        if(strtolower($reserve->complete) == 'y'){
            return ["result_code" => ResultCode::_052008_empServiceReserveHasCompleted, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_052008_empServiceReserveHasCompleted)];
        }
        
        $reserveRowId = $request->reserve_id;
        $loginId = $request->login_id;
        $domain = $request->domain;
        $empNO = $request->emp_no;
        $completeSelf = 'N'; 

        if($request->emp_no == $reserve->emp_no){
            $completeSelf = 'Y';
        }

    
        try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();

            $result = $this->reserveService->setReserveComplete($reserveRowId, $loginId, $domain, $empNO, $completeSelf);

            if($result[0]['result_code'] == ResultCode::_1_reponseSuccessful){

                $this->empServiceLog->newDataLog($result[1]);

            }

            $DBconn->commit();
            return response()->json($result[0]);
        
        } catch (\Exception $e) {
            $DBconn->rollBack();
            throw $e;
        }

    }
}