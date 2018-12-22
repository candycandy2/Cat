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
            return ["result_code" => ResultCode::_052004_empServiceTargetNotExist, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052004_empServiceTargetNotExist)];
        }

        if($request->start_date < $request->end_date){
            return ["result_code" => ResultCode::_052005_empServiceDateRangeInvalid, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052005_empServiceDateRangeInvalid)];
        }

        $pushSetting = [ '00', '01', '10', '11' ];
        if(!in_array($request->push, $pushSetting)){
            return ["result_code" => ResultCode::_052006_empServicePushDataInvalid, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_052006_empServicePushDataInvalid)];
        }

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

        try {
            
            $DBconn = DB::connection($this->connection);
            $DBconn->beginTransaction();

            $result = $this->reserveService->newReserve($data);

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