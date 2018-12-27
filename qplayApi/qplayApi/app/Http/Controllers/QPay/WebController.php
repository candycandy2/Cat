<?php

namespace App\Http\Controllers\QPay;

use App\Http\Controllers\Controller;
use App\Services\QPayMemberService;
use App\Services\QPayTradeService;
use App\Services\LogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\Verify;
use Validator;
use Session;
use DB;

class WebController extends Controller
{   
    protected $qpayMemberService;
    protected $qpayTradeService;
    protected $logService;

    /**
     * WebController constructor.
     * @param QPayMemberService $qpayMemberService
     * @param QPayTradeService $qpayTradeService
     */
    public function __construct(QPayMemberService $qpayMemberService,
                                QPayTradeService $qpayTradeService,
                                LogService $logService)
    {
        $this->qpayMemberService = $qpayMemberService;
        $this->qpayTradeService = $qpayTradeService;
        $this->logService = $logService;
    }

    /**
     * QPay Web APP login 
     * @param  Request $request
     * @return json
     */
    public function loginQPayWeb(Request $request)
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyWeb();

        if ($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $request->merge(['emp_no' => $request->header('emp-no')]);
            $request->merge(['trade_pwd' => $request->header('trade-pwd')]);

            //parameter verify
            $validator = Validator::make($request->all(), [
                'emp_no' => 'required',
                'trade_pwd' => 'required|digits:4'
            ], [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'result_code' => $validator->errors()->first(),
                    'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
                ], 200);
            } else {
                $user = CommonUtil::getUserInfoJustByUserEmpNo($request->header("emp-no"));

                if (is_null($user)) {
                    $result = [
                        "result_code" => ResultCode::_000901_userNotExistError,
                        "message" => CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
                    ];
                } else {
                    $result = $this->qpayMemberService->loginQPayWeb($user->row_id, $request->header("trade-pwd"));

                    if ($result["result_code"] == 1) {
                        $webAuthData = $Verify->setWebAuthData();
                        Cache::put(trim(strval($request->header("emp-no"))), $webAuthData, 5);

                        $result["signature"] = $webAuthData["signature"];
                        $result["signature_time"] = $webAuthData["signature_time"];
                        $result["token"] = $webAuthData["token"];
                        $result["token_valid"] = $webAuthData["token_valid"];
                    }
                }
                return response()->json($result);
            }
        } else {
            return response()->json([
                "result_code" => $verifyResult["code"],
                "message" => CommonUtil::getMessageContentByCode($verifyResult["code"]),
                "content" => ""
            ]);
        }
    }

    /**
     * QPay Web APP change trade pwd 
     * @param  Request $request
     * @return json
     */
    public function changeTradePwdForWeb(Request $request)
    {
        $Verify = new Verify();
        $verifyWebResult = $Verify->verifyWeb();

        if ($verifyWebResult["code"] == ResultCode::_1_reponseSuccessful) {
            $request->merge(['signature_time' => $request->header('signature-time')]);
            $request->merge(['signature' => $request->header('signature')]);
            $request->merge(['token' => $request->header('token')]);
            $request->merge(['token_valid' => $request->header('token-valid')]);
            $request->merge(['emp_no' => $request->header('emp-no')]);
            $request->merge(['old_trade_pwd' => $request->header('old-trade-pwd')]);
            $request->merge(['new_trade_pwd' => $request->header('new-trade-pwd')]);

            //parameter verify
            $validator = Validator::make($request->all(), [
                'signature_time' => 'required|numeric',
                'signature' => 'required',
                'token' => 'required',
                'token_valid' => 'required|numeric',
                'emp_no' => 'required',
                'old_trade_pwd' => 'required|digits:4',
                'new_trade_pwd' => 'required|digits:4'
            ], [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'result_code' => $validator->errors()->first(),
                    'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
                ], 200);
            } else {
                $resultCode = "";
                $user = CommonUtil::getUserInfoJustByUserEmpNo($request->header("emp-no"));

                if (is_null($user)) {
                    $resultCode = ResultCode::_000901_userNotExistError;
                } else {
                    $webAuthData = [
                        'signature_time' => $request->header("signature-time"),
                        'signature' => $request->header("signature"),
                        'token' => $request->header("token"),
                        'token_valid' => $request->header("token-valid")
                    ];
                    $verifyWebAuthResult = $Verify->chkWebAuthData($webAuthData, Cache::get(trim(strval($request->header("emp-no")))));

                    if ($verifyWebAuthResult["code"] == ResultCode::_1_reponseSuccessful) {
                        DB::beginTransaction();
                        try {
                            $nowTimestamp = time(); 
                            $now = date('Y-m-d H:i:s',$nowTimestamp);

                            $changeResult = $this->qpayMemberService->changeTradPassword($user->row_id, $request->header('old-trade-pwd'), 
                                                                                         $request->header('new-trade-pwd'));

                            $this->logService->writePasswordLog($user->row_id, LogService::PWD_TYPE_QPAY, LogService::PWD_ACTION_CHANGE,
                                                                $user->row_id, $now);
                            DB::commit();
                        } catch (\Exception $e) {
                            DB::rollBack();
                            throw $e;
                        }

                        $resultCode = $changeResult;
                    } else {
                        $resultCode = $verifyWebAuthResult["code"];
                    }
                }

                return response()->json([
                    "result_code" => $resultCode,
                    "message" => CommonUtil::getMessageContentByCode($resultCode),
                    "signature" => $request->header("signature"),
                    "signature_time" => $request->header("signature-time"),
                    "token" => $request->header("token"),
                    "token_valid" => $request->header("token-valid")
                ]);
            }
        } else {
            return response()->json([
                "result_code" => $verifyWebResult["code"],
                "message" => CommonUtil::getMessageContentByCode($verifyWebResult["code"])
            ]);
        }
    }

    /**
     * QPay Web APP logout 
     * @param  Request $request
     * @return json
     */
    public function logoutQPayWeb(Request $request)
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyWeb();

        if ($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $request->merge(['signature_time' => $request->header('signature-time')]);
            $request->merge(['signature' => $request->header('signature')]);
            $request->merge(['token' => $request->header('token')]);
            $request->merge(['token_valid' => $request->header('token-valid')]);
            $request->merge(['emp_no' => $request->header('emp-no')]);

            //parameter verify
            $validator = Validator::make($request->all(), [
                'signature_time' => 'required|numeric',
                'signature' => 'required',
                'token' => 'required',
                'token_valid' => 'required|numeric',
                'emp_no' => 'required'
            ], [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'result_code' => $validator->errors()->first(),
                    'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
                ], 200);
            } else {
                $resultCode = "";
                $user = CommonUtil::getUserInfoJustByUserEmpNo($request->header("emp-no"));

                if (is_null($user)) {
                    $resultCode = ResultCode::_000901_userNotExistError;
                } else {
                    $webAuthData = [
                        'signature_time' => $request->header("signature-time"),
                        'signature' => $request->header("signature"),
                        'token' => $request->header("token"),
                        'token_valid' => $request->header("token-valid"),
                    ];
                    $verifyWebAuthResult = $Verify->chkWebAuthData($webAuthData, Cache::get(trim(strval($request->header("emp-no")))));

                    if ($verifyWebAuthResult["code"] == ResultCode::_1_reponseSuccessful) {
                        Cache::forget(trim(strval($request->header("emp-no"))));
                        Cache::pull(trim(strval($request->header("emp-no"))));
                    }

                    $resultCode = $verifyWebAuthResult["code"];
                }

                return response()->json([
                    "result_code" => $resultCode,
                    "message" => CommonUtil::getMessageContentByCode($resultCode)
                ]);
            }
        } else {
            $result = [
                "result_code" => $verifyResult["code"],
                "message" => CommonUtil::getMessageContentByCode($verifyResult["code"]),
                "content" => ""
            ];
            return response()->json($result);
        }
    }

    /**
     * QPay Web APP trade-store record
     * @param  Request $request
     * @return json
     */
    public function tradeRecordQPayWeb(Request $request)
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verifyWeb();

        if ($verifyResult["code"] == ResultCode::_1_reponseSuccessful) {
            $request->merge(['signature_time' => $request->header('signature-time')]);
            $request->merge(['signature' => $request->header('signature')]);
            $request->merge(['token' => $request->header('token')]);
            $request->merge(['token_valid' => $request->header('token-valid')]);
            $request->merge(['emp_no' => $request->header('emp-no')]);

            //parameter verify
            $validator = Validator::make($request->all(), [
                'signature_time' => 'required|numeric',
                'signature' => 'required',
                'token' => 'required',
                'token_valid' => 'required|numeric',
                'emp_no' => 'required',
                'start_date' => 'required|digits:10',
                'end_date' => 'required|digits:10'
            ], [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'digits' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'result_code' => $validator->errors()->first(),
                    'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
                ], 200);
            } else {
                $resultCode = "";
                $user = CommonUtil::getUserInfoJustByUserEmpNo($request->header("emp-no"));

                if (is_null($user)) {
                    $resultCode = ResultCode::_000901_userNotExistError;
                } else {
                    $webAuthData = [
                        'signature_time' => $request->header("signature-time"),
                        'signature' => $request->header("signature"),
                        'token' => $request->header("token"),
                        'token_valid' => $request->header("token-valid")
                    ];
                    $verifyWebAuthResult = $Verify->chkWebAuthData($webAuthData, Cache::get(trim(strval($request->header("emp-no")))));

                    if ($verifyWebAuthResult["code"] == ResultCode::_1_reponseSuccessful) {
                        $recordResult = $this->qpayTradeService->tradeRecordQPayWeb($user->row_id, $request->start_date, $request->end_date);
                    }

                    $resultCode = $verifyWebAuthResult["code"];
                }

                $result = [
                    "result_code" => $resultCode,
                    "message" => CommonUtil::getMessageContentByCode($resultCode),
                    "signature" => $request->header("signature"),
                    "signature_time" => $request->header("signature-time"),
                    "token" => $request->header("token"),
                    "token_valid" => $request->header("token-valid")
                ];

                if ($resultCode == ResultCode::_1_reponseSuccessful) {
                    $result["content"] = $recordResult;
                }

                return response()->json($result);
            }
        } else {
            $result = [
                "result_code" => $verifyResult["code"],
                "message" => CommonUtil::getMessageContentByCode($verifyResult["code"]),
                "content" => ""
            ];
            return response()->json($result);
        }
    }
}