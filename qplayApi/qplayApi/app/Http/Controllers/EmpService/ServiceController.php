<?php

namespace App\Http\Controllers\EmpService;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\EmpServiceServiceService;
use App\Services\EmpServiceLogService;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;
use DB;

class ServiceController extends Controller
{
    protected $empService;
    protected $empServiceLog;

    private $connection = 'mysql_emp_service';

    public function __construct(EmpServiceServiceService $empService,
                                EmpServiceLogService $empServiceLog)
    {
        $this->empService = $empService;
        $this->empServiceLog = $empServiceLog;
    }

    /**
     * new a EmpService
     * @param  Request $request 
     * @return json
     */
    public function newEmpService(Request $request){

        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'service_id' => 'required',
            'type' => 'required',
            'login_id' =>'required',
            'emp_no' => 'required'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        $serviceId = $request->service_id;
        $type = $request->type;
        $loginId = $request->login_id;
        $domain = $request->domain;
        $empNo = $request->emp_no;

        
        try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();
            
            $newEmpServiceRs = $this->empService->newEmpService($serviceId,
                                                                $type,
                                                                $loginId,
                                                                $domain,
                                                                $empNo);
            
            if($newEmpServiceRs[0]['result_code'] == ResultCode::_1_reponseSuccessful){
                $this->empServiceLog->newDataLog($newEmpServiceRs[1]);
            }else{
                return response()->json($newEmpServiceRs[0]);
            }

            $DBconn->commit();

        } catch (\Exception $e) {
            $DBconn->rollBack();
            throw $e;
        }      
        
        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)];                
        return response()->json($result);
    }


}
