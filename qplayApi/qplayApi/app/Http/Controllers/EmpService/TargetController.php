<?php

namespace App\Http\Controllers\EmpService;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\EmpServiceServiceService;
use App\Services\EmpServiceTargetService;
use App\Services\EmpServiceLogService;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;
use DB;

class TargetController extends Controller
{
    protected $empService;
    protected $targetService;
    protected $empServiceLog;

    private $connection = 'mysql_emp_service';

    public function __construct(EmpServiceServiceService $empService,
                                EmpServiceTargetService $targetService,
                                EmpServiceLogService $empServiceLog)
    {
        $this->empService = $empService;
        $this->targetService = $targetService;
        $this->empServiceLog = $empServiceLog;
    }

    /**
     * add or delete an association with service and target
     * 
     * @param  Request $request 
     * @return json
     */
    public function setEmpServiceTarget(Request $request){

        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'service_id' => 'required',
            'login_id' =>'required',
            'domain' => 'required',
            'emp_no' => 'required',
            'new' => 'required_without:delete|array',
            'delete' => 'required_without:new|array'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'required_without' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'array' => ResultCode::_999001_requestParameterLostOrIncorrect,
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        $serviceRs = $this->empService->getServiceRowId($request->service_id);
        
        if(is_null($serviceRs)){
              return ["result_code" => ResultCode::_052002_empServiceNotExist, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052002_empServiceNotExist)];
        }

        $serviceRowId = $serviceRs->row_id;
        $loginId = $request->login_id;
        $domain = $request->domain;
        $empNo = $request->emp_no;
        $new = is_null(($request->new))?[]:$request->new;
        $delete = is_null(($request->delete))?[]:$request->delete;

         try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();
            
            $result = $this->targetService->setEmpServiceTarget($serviceRowId, $loginId, $domain, $empNo, $new, $delete);

            if($result[0]['result_code'] == ResultCode::_1_reponseSuccessful){
                foreach ($result[1] as $value) {
                   $this->empServiceLog->newDataLog($value);
                }
            }

            $DBconn->commit();
            return response()->json($result[0]);

        } catch (\Exception $e) {
            $DBconn->rollBack();
            throw $e;
        } 
    }

    /**
     * Get EmpService and it's associate target list
     * @param  Request $request
     * @return json
     */
    public function getEmpServiceTargetList(Request $request){
        
        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'service_id' => 'required_without:servuce_type',
            'servuce_type' =>'required_without:service_id',
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        //between service_type and service_id chooese one to query.

        if(isset($request->service_type)){

            $serviceRs = $this->empService->getServiceListByType($request->service_type);

            if(count($serviceRs) == 0){
                  return ["result_code" => ResultCode::_052003_empServiceTypeNotExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_052003_empServiceTypeNotExist)];
            }

            $serviceListRs = $this->targetService->getTargetByServiceType($request->service_type);
            
            return response()->json($serviceListRs);
            
        }else if(isset($request->service_id)){

            $serviceRs = $this->empService->getServiceRowId($request->service_id);
            if(is_null($serviceRs)){
                  return ["result_code" => ResultCode::_052002_empServiceNotExist, 
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_052002_empServiceNotExist)];
            }

            $serviceListRs = $this->targetService->getTargetByServiceId($request->service_id);
            
            return response()->json($serviceListRs);
        }
    }

}
