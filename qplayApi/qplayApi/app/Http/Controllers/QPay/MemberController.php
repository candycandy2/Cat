<?php

namespace App\Http\Controllers\QPay;

use App\Http\Controllers\Controller;
use App\Services\QPayMemberService;
use App\Services\LogService;
use Illuminate\Http\Request;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;

class MemberController extends Controller
{   
    protected $qpayMemberService;
    protected $logService;

     /**
     * qpalyAccountController constructor.
     * @param UserService $qpayMemberService
     * @param LogService $logService
     */
    public function __construct(QPayMemberService $qpayMemberService,
                                LogService $logService)
    {
        $this->qpayMemberService = $qpayMemberService;
        $this->logService = $logService;
    }

    /**
     * qpay App user can change their own QPay trad password 
     * @param  Request $request
     * @return json
     */
    public function changeTradePwdForAPP(Request $request)
    {

        $request->merge(['old_trade_pwd' => $request->header('old-trade-pwd')]);
        $request->merge(['new_trade_pwd' => $request->header('new-trade-pwd')]);
        
        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'old_trade_pwd' => 'required',
            'new_trade_pwd' =>  ['required', 'digits:4|numeric']
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' =>ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        $oldPwd = $request->old_trade_pwd;
        $newPwd =  $request->new_trade_pwd;
        $uuid = $request->uuid;
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);

        $updateRs = $this->qpayMemberService->changeTradPassword($userInfo->row_id,
                                                           $oldPwd,
                                                           $newPwd,
                                                           $userInfo->row_id,
                                                           $now);
        // old trad password does not match
        if( $updateRs  != ResultCode::_1_reponseSuccessful){
            $result = ['result_code'=>$updateRs,
                       'message'=>CommonUtil::getMessageContentByCode($updateRs),
                        'content'=>''];
            return response()->json($result); 
        }

        $this->logService->writePasswordLog($userInfo->row_id,
                                            LogService::PWD_TYPE_QPAY,
                                            LogService::PWD_ACTION_CHANGE,
                                            $userInfo->row_id,
                                            $now);
        
        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'token_valid'=>$request->token_valid_date
            ];
        return response()->json($result);
    }

    /**
     * get stored record by user
     * @param  Request $request 
     * @return json
     */
    public function getStoreRecord(Request $request)
    {   
        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'start_date' =>  ['required', 'digits:10|numeric'],
            'end_date' =>  ['required', 'digits:10|numeric']
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' =>ResultCode::_000930_newTradePasswordIncorrect
            ]
        );
        
        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        $uuid = $request->uuid;
        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        $returnData = $this->qpayMemberService->getStoreRecord($userInfo->row_id, $request->start_date, $request->end_date);
       

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
            'content'=>["store_record" => $returnData],
            'token_valid'=>$request->token_valid_date
        ];
        return response()->json($result);
    } 
}



