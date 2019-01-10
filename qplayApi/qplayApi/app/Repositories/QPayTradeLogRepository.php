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
     * @param  member row id
     * @param  member_point row id
     * @param  old point now
     * @param  old point used
     * @param  new point now
     * @param  new point used
     * @param  shop id
     * @param  multiple pay
     * @param  multiple row id
     * @param  multiple point
     * @param  price
     * @param  trade success
     * @param  error code
     * @param  cancel
     * @param  cancel pay
     * @param  cancel row id
     * @param  cancel reason
     * @return mixed
     */
    public function newTradeRecord($memberRowID, $memberPointRowID, $oldPointNow, $oldPointUsed, $newPointNow, 
        $newPointUsed, $shopID, $multiplePay, $multipleRowID, $multiplePoint, $price, $tradeSuccess, $errorCode, 
        $cancel, $cancelPay, $cancelRowID, $cancelReason)
    {
        $now = date('Y-m-d H:i:s',time());

        return  DB::table("qpay_trade_log")
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
                    "created_at" => $now,
                    "cancel" => $cancel,
                    "cancel_pay" => $cancelPay,
                    "cancel_row_id" => $cancelRowID,
                    "cancel_reason" => $cancelReason
                ]);
    }

    /**
     * get QPay Trade Record for Emp
     * @param  uuid
     * @param  startDate
     * @param  endDate
     * @return mixed
     */
    public function getTradeRecordEmp($userRowID, $startDate, $endDate)
    {
        $result = $this->qpayTradeLog
                    -> leftJoin("qpay_member", "qpay_member.row_id", "=", "qpay_trade_log.member_row_id")
                    -> leftJoin("qpay_shop", "qpay_shop.row_id", "=", "qpay_trade_log.shop_row_id")
                    -> leftJoin("qp_user", "qp_user.row_id", "=", "qpay_shop.user_row_id")
                    -> select(DB::raw("CONCAT('T', LPAD(qpay_trade_log.row_id, 6, 0)) AS trade_id"),
                              "qpay_trade_log.trade_point",
                              "qpay_trade_log.success AS trade_success",
                              "qpay_trade_log.error_code",
                              DB::raw("UNIX_TIMESTAMP(qpay_trade_log.created_at) AS trade_time"),
                              "qpay_trade_log.cancel",
                              "qpay_trade_log.cancel_pay AS cancel_trade",
                              "qpay_trade_log.cancel_row_id AS cancel_trade_id",
                              "qpay_trade_log.cancel_reason",
                              "qp_user.emp_name AS shop_name")
                    -> where("qpay_member.user_row_id", "=", $userRowID)
                    -> where("qpay_trade_log.multiple_row_id", "=", 0)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'>=', $startDate)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'<=', $endDate)
                    -> orderBy("qpay_trade_log.created_at", "DESC")
                    -> get();

        return $result;
    }

    /**
     * get QPay Trade Record for Shop
     * @param  uuid
     * @param  startDate
     * @param  endDate
     * @param  pointTypeID optional, if null return all type
     * @return mixed
     */
    public function getTradeRecordShop($userRowID, $startDate, $endDate, $pointTypeID=null)
    {
        $query = $this->qpayTradeLog
                    -> leftJoin("qpay_shop", "qpay_shop.row_id", "=", "qpay_trade_log.shop_row_id")
                    -> leftJoin("qpay_member_point", "qpay_member_point.row_id", "=", "qpay_trade_log.member_point_row_id")
                    -> leftJoin("qpay_point_store", "qpay_point_store.row_id", "=", "qpay_member_point.point_store_row_id")
                    -> select(DB::raw("CONCAT('T', LPAD(qpay_trade_log.row_id, 6, 0)) AS trade_id"),
                              "qpay_trade_log.trade_point AS trade_point",
                              "qpay_trade_log.success AS trade_success",
                              "qpay_trade_log.error_code",
                              DB::raw("UNIX_TIMESTAMP(qpay_trade_log.created_at) AS trade_time"),
                              "qpay_trade_log.cancel",
                              "qpay_trade_log.cancel_pay AS cancel_trade",
                              "qpay_trade_log.cancel_row_id AS cancel_trade_id",
                              "qpay_trade_log.cancel_reason")
                    -> where("qpay_shop.user_row_id", "=", $userRowID);

                    if(!is_null($pointTypeID)){
                        $query = $query-> where("qpay_point_store.point_type_row_id", "=", $pointTypeID);
                    }

                    $result = $query-> where("qpay_trade_log.multiple_row_id", "=", 0)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'>=', $startDate)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'<=', $endDate)
                    -> orderBy("qpay_trade_log.created_at", "DESC")
                    -> get();

        return $result;
    }

    /**
     * get QPay Trade ID
     * @param  trade id
     * @return mixed
     */
    public function getTradeID($tradeID)
    {
        $result = $this->qpayTradeLog
                    -> select("qpay_trade_log.row_id",
                              "qpay_trade_log.member_row_id",
                              "qpay_trade_log.member_point_row_id",
                              "qpay_trade_log.shop_row_id",
                              "qpay_trade_log.multiple_pay",
                              "qpay_trade_log.multiple_row_id",
                              "qpay_trade_log.multiple_point",
                              "qpay_trade_log.trade_point AS trade_price",
                              DB::raw("UNIX_TIMESTAMP(qpay_trade_log.created_at) AS trade_time"),
                              "qpay_trade_log.cancel",
                              "qpay_trade_log.cancel_pay")
                    -> where("qpay_trade_log.row_id", "=", intval($tradeID))
                    -> orWhere("qpay_trade_log.multiple_row_id", "=", intval($tradeID))
                    -> orderBy("qpay_trade_log.row_id", "ASC")
                    -> get();

        return $result;
    }

    /**
     * cancel QPay Point Trade Log
     * @param  uuid
     * @param  trade token
     * @param  trade token valid
     * @return mixed
     */
    public function cancelTradeRecord($rowID)
    {
        $result = $this->qpayTradeLog
                    -> where("row_id", "=", $rowID)
                    -> update([
                        "cancel" => "Y"
                    ]);

        return $result;
    }
}