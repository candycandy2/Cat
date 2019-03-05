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
            
            $result = $this->empService->newEmpService($serviceId,
                                                        $type,
                                                        $loginId,
                                                        $domain,
                                                        $empNo);
    
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
     * Get EmpService list by servicr type,
     * you can set service_type to "All" to get all type of sercive
     * @param  Request $request 
     * @return json
     */
    public function getEmpServiceList(Request $request){
        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'service_type' => 'required',
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }
        $serviceType = $request->service_type;
        $serviceList = $this->empService->getEmpServiceList($serviceType);
        return $serviceList;
    }

    /**
     * Delete EmpService and associated target
     * @param  Request $request
     * @return json
     */
    public function deleteEmpService(Request $request){

        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'service_id' => 'required',
            'login_id'   => 'required',
            'domain'     => 'required',
            'emp_no'     =>'required'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect
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
            
        try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();
            

            $result = $this->empService->deleteEmpService($request->service_id,
                                                $request->login_id,
                                                $request->domain,
                                                $request->emp_no);

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
     * Set user could recive the push of service
     * @param Request $request
     */
    public function setEmpServicePush(Request $request){
        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'login_id'   => 'required',
            'domain'     => 'required',
            'emp_no'     => 'required',
            'new'        => 'sometimes|array',
            'delete'     => 'sometimes|array'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'sometimes' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'array' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );
        
        $loginId = $request->login_id;
        $domain = $request->domain;
        $empNo = $request->emp_no;

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        if(!isset($request->new) && !(isset($request->delete))){
            return response()->json(["result_code" => ResultCode::_999001_requestParameterLostOrIncorrect, 
                                       "message" => CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect)
                                      ]);
        }

        try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();
            
            if(isset($request->new) && count($request->new)> 0){
                $newRes = $this->empService->addEmpServicePush($request->new, $loginId, $domain, $empNo);

                if($newRes[0]['result_code'] == ResultCode::_1_reponseSuccessful){
                    $this->empServiceLog->newDataLog($newRes[1]);
                }else{
                    return response()->json($newRes[0]);    
                }
                
            }

            if(isset($request->delete) && count($request->delete)> 0){
                $delRes = $this->empService->deleteEmpServicePush($request->delete, $loginId, $domain, $empNo);

                if($delRes[0]['result_code'] == ResultCode::_1_reponseSuccessful){
                    $this->empServiceLog->newDataLog($delRes[1]);
                }else{
                    return response()->json($delRes[0]);    
                }
                
            }
            $DBconn->commit();
            return response()->json(["result_code" => ResultCode::_1_reponseSuccessful, 
                                       "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                                      ]);
        } catch (\Exception $e) {
            $DBconn->rollBack();
            throw $e;
        }
    }

}
