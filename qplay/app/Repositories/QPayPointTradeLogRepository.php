<?php
/**
 * QPay Trade Log - Resository
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

    /**
     * Get trade log in wich sepcific shop and point type by interval
     * @param  int      $shopID         shop row_id
     * @param  string   $startDate      formated start date yyyy/mm/dd
     * @param  string   $endDate        formated end date yyyy/mm/dd
     * @param  int      $pointTypeID    point type row_id
     * @param  int      $limit          limit
     * @param  int      $offset         offset
     * @param  string   $sort           sort field
     * @param  string   $order          order asc|desc
     * @return mixed                    query result
     */
    public function getTradeRecord($shopID, $startDate, $endDate, $pointTypeID, $limit, $offset, $sort, $order)
    {
        $startDate = strtotime($startDate);
        $endDate = strtotime($endDate);

        $query = $this->qpayTradeLog
                    -> leftJoin("qpay_shop", "qpay_shop.row_id", "=", "qpay_trade_log.shop_row_id")
                    -> leftJoin("qpay_member_point", "qpay_member_point.row_id", "=", "qpay_trade_log.member_point_row_id")
                    -> leftJoin("qpay_point_store", "qpay_point_store.row_id", "=", "qpay_member_point.point_store_row_id")
                    -> where("qpay_trade_log.multiple_row_id", "=", 0)
                    -> where("qpay_trade_log.shop_row_id", "=", $shopID)
                    -> where("qpay_point_store.point_type_row_id", "=", $pointTypeID)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'>=', $startDate)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'<=', $endDate)
                    -> select(DB::raw("CONCAT('T', LPAD(qpay_trade_log.row_id, 6, 0)) AS trade_id"),
                              "qpay_trade_log.trade_point AS trade_point",
                              "qpay_trade_log.success AS trade_success",
                              "qpay_trade_log.error_code",
                              DB::raw("UNIX_TIMESTAMP(qpay_trade_log.created_at) AS trade_time"));
                    $query = $query->orderBy($sort, $order);
                    $result = $query-> Paginate($limit,['*'],null,($offset/$limit)+1);

        return $result;
    }

    /**
     * Get sum of trade in wich sepcific shop and point type by interval
     * @param  int      $shopID         shop row_id
     * @param  string   $startDate      formated start date yyyy/mm/dd
     * @param  string   $endDate        formated end date yyyy/mm/dd
     * @param  int      $pointTypeID    point type row_id
     * @return mixed                    query result
     */
    public function getTradeTotal($shopID, $startDate, $endDate, $pointTypeID){
        
        $startDate = strtotime($startDate);
        $endDate = strtotime($endDate);

        $result = $this->qpayTradeLog
                    -> leftJoin("qpay_shop", "qpay_shop.row_id", "=", "qpay_trade_log.shop_row_id")
                    -> leftJoin("qpay_member_point", "qpay_member_point.row_id", "=", "qpay_trade_log.member_point_row_id")
                    -> leftJoin("qpay_point_store", "qpay_point_store.row_id", "=", "qpay_member_point.point_store_row_id")
                    -> where("qpay_trade_log.multiple_row_id", "=", 0)
                    -> where("qpay_trade_log.shop_row_id", "=", $shopID)
                    -> where("qpay_point_store.point_type_row_id", "=", $pointTypeID)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'>=', $startDate)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'<=', $endDate)
                    -> sum("qpay_trade_log.trade_point");

        return $result;
    }

    /**
     * Get sum of trade by each day in wich sepcific shop and point type duing interval
     * @param  int      $shopID         shop row_id
     * @param  string   $startDate      formated start date yyyy/mm/dd
     * @param  string   $endDate        formated end date yyyy/mm/dd
     * @param  int      $pointTypeID    point type row_id
     * @return mixed                    query result
     */
    public function getTradeTotalByEachDay($shopID, $startDate, $endDate, $pointTypeID){
        
        $startDate = strtotime($startDate);
        $endDate = strtotime($endDate);

        $result = $this->qpayTradeLog
                    -> Join("qpay_member_point", "qpay_member_point.row_id", "=", "qpay_trade_log.member_point_row_id")
                    -> Join("qpay_point_store", "qpay_point_store.row_id", "=", "qpay_member_point.point_store_row_id")
                    -> where("qpay_trade_log.multiple_row_id", "=", 0)
                    -> where("qpay_trade_log.shop_row_id", "=", $shopID)
                    -> where("qpay_point_store.point_type_row_id", "=", $pointTypeID)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'>=', $startDate)
                    -> where(DB::raw('UNIX_TIMESTAMP(qpay_trade_log.created_at)'),'<=', $endDate)
                    -> groupBy(DB::raw('ndate'))
                    -> select(DB::raw("FROM_UNIXTIME(UNIX_TIMESTAMP(qpay_trade_log.created_at), '%Y/%m/%d') as ndate,sum(qpay_trade_log.trade_point) as sum"))
                    -> get();
    
        return $result;

    }
}