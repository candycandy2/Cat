<?php
/**
 * QPay Trade Log - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Trade_Log;
use DB;

class QPayTradeLogRepository
{
    protected $qpayTradeLog;

    /**
     * QPayTradeLogRepository constructor.
     * @param QPay_Trade_Log $qpayTradeLog
     */
    public function __construct(QPay_Trade_Log $qpayTradeLog)
    {
        $this->qpayTradeLog = $qpayTradeLog;
    }

    /**
     * new QPay Point Trade Log
     * @param  uuid
     * @param  trade token
     * @param  trade token valid
     * @return mixed
     */
    public function newTradeRecord( $memberRowID, $memberPointRowID, $oldPointNow, $oldPointUsed, $newPointNow, 
        $newPointUsed, $shopID, $multiplePay, $multipleRowID, $multiplePoint, $price, $tradeSuccess, $errorCode)
    {
        $now = date('Y-m-d H:i:s',time());

        return  DB::table("qpay_point_trade_log")
                -> insertGetId([
                    "member_row_id" => $memberRowID,
                    "member_point_row_id" => $memberPointRowID,
                    "shop_row_id" => $shopID,
                    "multiple_pay" => $multiplePay,
                    "multiple_row_id" => $multipleRowID,
                    "multiple_point" => $multiplePoint,
                    "trade_point" => $price,
                    "old_point_now" => $oldPointNow,
                    "old_point_used" => $oldPointUsed,
                    "new_point_now" => $newPointNow,
                    "new_point_used" => $newPointUsed,
                    "success" => $tradeSuccess,
                    "error_code" => $errorCode,
                    "created_at" => $now
                ]);
    }
}