<?php

namespace App\Http\Controllers\QPay;

use App\Http\Controllers\Controller;
use App\Services\QPayTradeService;
use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;

class TradeController extends Controller
{   
    protected $qpayTradeService;

     /**
     * TradeController constructor.
     * @param QPayTradeService $qpayTradeService
     */
    public function __construct(QPayTradeService $qpayTradeService)
    {
        $this->qpayTradeService = $qpayTradeService;
    }

    /**
     * QPay get trade token 
     * @param  Request $request
     * @return json
     */
    public function getTradeToken(Request $request)
    {
        //parameter verify
        $validator = Validator::make($request->all(), [
            'emp_no' => 'required|numeric',
            'price' => 'required|numeric|max:1000',
            'shop_id' => 'required|numeric'
        ], [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'max' => ResultCode::_999001_requestParameterLostOrIncorrect
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result_code' => $validator->errors()->first(),
                'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
            ], 200);
        } else {
            $result = $this->qpayTradeService->getTradeToken($request->uuid, $request->emp_no, $request->price, $request->shop_id);

            $result["token_valid"] = $request->token_valid_date;
            return response()->json($result);
        }
    }

    /**
     * QPay new trade
     * @param  Request $request
     * @return json
     */
    public function newTrade(Request $request)
    {
        $request->merge(['trade_token' => $request->header('trade-token')]);
        $request->merge(['trade_pwd' => $request->header('trade-pwd')]);

        //parameter verify
        $validator = Validator::make($request->all(), [
            'emp_no' => 'required|numeric',
            'price' => 'required|numeric|max:1000',
            'shop_id' => 'required|numeric',
            'trade_token' => 'required|string|size:44',
            'trade_pwd' => 'required|size:4'
        ], [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'string' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'max' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'size' => ResultCode::_999001_requestParameterLostOrIncorrect
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result_code' => $validator->errors()->first(),
                'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
            ], 200);
        } else {
            $result = $this->qpayTradeService->newTrade($request->uuid, $request->header("trade-pwd"), $request->header("trade-token"), 
                                                        $request->emp_no, $request->price, $request->shop_id);
            $result["token_valid"] = $request->token_valid_date;

            return response()->json($result);
        }
    }

    /**
     * QPay get trade record for Emp
     * @param  Request $request
     * @return json
     */
    public function getTradeRecordEmp(Request $request)
    {
        //parameter verify
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|digits:10',
            'end_date' => 'required|digits:10'
        ], [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'digits' => ResultCode::_999001_requestParameterLostOrIncorrect
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result_code' => $validator->errors()->first(),
                'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
            ], 200);
        } else {
            $result = $this->qpayTradeService->getTradeRecordEmp($request->uuid, $request->start_date, $request->end_date);
            $result["token_valid"] = $request->token_valid_date;

            return response()->json($result);
        }
    }

    /**
     * QPay get trade record for Shop
     * @param  Request $request
     * @return json
     */
    public function getTradeRecordShop(Request $request)
    {   

        //parameter verify
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|digits:10',
            'end_date' => 'required|digits:10',
            'point_type_id' => 'numeric'
        ], [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'digits' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'numeric' => ResultCode::_999001_requestParameterLostOrIncorrect,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result_code' => $validator->errors()->first(),
                'message' => CommonUtil::getMessageContentByCode($validator->errors()->first())
            ], 200);
        } else {
            $result = $this->qpayTradeService->getTradeRecordShop($request->uuid, $request->start_date, $request->end_date, $request->point_type_id);
            $result["token_valid"] = $request->token_valid_date;

            return response()->json($result);
        }
    }
}