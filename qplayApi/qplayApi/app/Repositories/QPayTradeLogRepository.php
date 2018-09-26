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
                    "created_at" => $now
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
                              "qpay_trade_log.created_at AS trade_time",
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
                    -> leftJoin("qpay_point_type", "qpay_point_type.row_id", "=", "qpay_point_store.point_type_row_id")
                    -> select(DB::raw("CONCAT('T', LPAD(qpay_trade_log.row_id, 6, 0)) AS trade_id"),
                              "qpay_trade_log.trade_point AS trade_point",
                              "qpay_trade_log.success AS trade_success",
                              "qpay_trade_log.error_code",
                              "qpay_trade_log.created_at AS trade_time",
                              "qpay_point_type.name AS point_type_name")
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
}