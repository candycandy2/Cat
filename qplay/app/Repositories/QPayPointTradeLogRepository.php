<?php
/**
 * QPay Trade Log Store - Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Trade_Log;
use DB;

class QPayPointTradeLogRepository
{

    protected $qpayTradeLog;

    /**
     * QPayPointTradeLogRepository constructor.
     * @param QPay_Trade_Log $qpayTradeLog
     */
    public function __construct(QPay_Trade_Log $qpayTradeLog)
    {
        $this->qpayTradeLog = $qpayTradeLog;
    }

    /**
     * Ger QPay Purchase Record List
     * @param  int $userRowID qp_user.row_id
     * @param  int $startDate query start date time (unix timestamp)
     * @param  int $endDate   query end date time (unix timestamp)
     * @return mixed
     */
    public function getQPayReimbursePurchaseList($userRowID, $startDate, $endDate){

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

}