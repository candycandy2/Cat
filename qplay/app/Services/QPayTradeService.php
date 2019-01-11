<?php
/**
 * QPay Trade Service - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\QPayPointTradeLogRepository;
use App\Repositories\QPayShopRepository;
use App\Repositories\QPayPointTypeRepository;

use Excel;
use App;
use Session;

class QPayTradeService
{

    protected $qpayPointTradeLogRepository;
    protected $qpayShopRepository;
    protected $qpayPointTypeRepository;
    
    /**
     * QPayTradeService constructor.
     * @param QPayPointTradeLogRepository $qpayPointTradeLogRepository
     * @param QPayShopRepository $qpayShopRepository
     * @param QPayPointTypeRepository $qpayPointTypeRepository
     */
    public function __construct(QPayPointTradeLogRepository $qpayPointTradeLogRepository,
                                QPayShopRepository $qpayShopRepository,
                                QPayPointTypeRepository $qpayPointTypeRepository)
    {
        $this->qpayPointTradeLogRepository = $qpayPointTradeLogRepository;
        $this->qpayShopRepository = $qpayShopRepository;
        $this->qpayPointTypeRepository = $qpayPointTypeRepository;
    }

    /**
     * Get QPay Purchase Record List
     * @param  int $userRowID qp_user.row_id
     * @param  int $startDate query start date time (unix timestamp)
     * @param  int $endDate   query end date time (unix timestamp)
     * @return mixed
     */
    public function getQPayReimbursePurchaseList($userRowID, $startDate, $endDate)
    {
        $purchaseData = $this->qpayPointTradeLogRepository->getQPayReimbursePurchaseList($userRowID, $startDate, $endDate);

        foreach ($purchaseData as $index => $data) {
            if ($data["cancel_pay"] == "N") {
                $data["trade_point"] = "-".$data["trade_point"];

                if ($data["cancel"] == "Y") {
                    $data["cancel_reason"] = "退款";
                }
            } else if ($data["cancel_pay"] == "Y") {
                if ($data["trade_success"] == "Y") {
                    $data["cancel_reason"] = "T".str_pad($data["cancel_row_id"], 6, "0", STR_PAD_LEFT)." 退款:".$data["cancel_reason"];
                } else {
                    $data["cancel_reason"] = "退款失敗";
                }
            }
        }

        return $purchaseData;
    }

    /**
     * Get trade log in wich sepcific shop and point type by interval
     * @param  int      $shopID         shop row_id
     * @param  int      $startDate      start date timestamp
     * @param  int      $endDate        end date timestamp
     * @param  int      $pointTypeID    point type row_id
     * @param  int      $limit          limit
     * @param  int      $offset         offset
     * @param  string   $sort           sort field
     * @param  string   $order          order asc|desc
     * @return mixed                    query result
     */
    public function getTradeRecord($userRowID, $startDate, $endDate, $pointTypeID, $limit, $offset, $sort, $order)
    {
        $recordData = $this->qpayPointTradeLogRepository
                        ->getTradeRecord($userRowID, $startDate, $endDate, $pointTypeID, $limit, $offset, $sort, $order);

        $cancelTradeData = [];

        foreach ($recordData as $index => $data) {
            if ($data["cancel_pay"] == "Y") {
                $data["trade_point"] = "-".$data["trade_point"];

                if ($data["multiple_row_id"] == 0) {
                    $cancelTradeData[$data["trade_id"]] = $data["cancel_row_id"];
                    $cancledTradeID = $data["cancel_row_id"];
                    $data["cancel_reason"] = "T".str_pad($cancledTradeID, 6, "0", STR_PAD_LEFT)." 退款:".$data["cancel_reason"];
                }
            }

            if ($data["cancel"] == "Y") {
                $data["cancel_reason"] = "退款";
            }
        }

        foreach ($recordData as $index => $data) {
            if ($data["cancel_pay"] == "Y") {
                if ($data["multiple_row_id"] != 0) {
                    $cancledTradeID = $cancelTradeData["T".str_pad($data["multiple_row_id"], 6, "0", STR_PAD_LEFT)];
                    $data["cancel_reason"] = "T".str_pad($cancledTradeID, 6, "0", STR_PAD_LEFT)." 退款:".$data["cancel_reason"];
                }
            }
        }

        return $recordData;
    }

    /**
     * Get sum of trade in wich sepcific shop and point type by interval
     * @param  int      $shopID         shop row_id
     * @param  int      $startDate      start date timestamp
     * @param  int      $endDate        end date timestamp
     * @param  int      $pointTypeID    point type row_id
     * @return mixed                    query result
     */
    public function getTradeTotal($shopId, $startDate, $endDate, $pointType){

        return $this->qpayPointTradeLogRepository->getTradeTotal($shopId, $startDate, $endDate, $pointType);
    }

    /**
     * export and down load reimburse finance report
     * @param  int      $shopID         shop row_id
     * @param  int      $startDate      start date timestamp
     * @param  int      $endDate        end date timestamp
     * @param  int      $timeOffset     localization time offset
     * @param  int      $pointTypeID    point type row_id
     */
    public function downloadReimburseFinanceExcel($shopID, $startDate, $endDate, $timeOffset, $pointTypeID){
        
        App::setLocale(Session::get("lang"));

        $celData = [];
        
        $total = 0;
        $shopName = "";
        $pointTypeName = "";

        $shopInfo = $this->qpayShopRepository->getShopInfoByShopId($shopID);
        if(!is_null($shopInfo)){
            $shopName = $shopInfo->shop_name;
        }

        $pointTypeInfo = $this->qpayPointTypeRepository->getPointTypeById($pointTypeID);
        if(!is_null($pointTypeInfo)){
            $pointTypeName = $pointTypeInfo->name;
        }
        
        $localTime = $startDate - $timeOffset * 60;
        $dateStr = gmdate("Y/m", $localTime);

        //set default title for excel data
        $shopHeadLine = trans('messages.QPAY_SHOP_NAME') . ':' . $shopName;
        $pointHeadLine = trans('messages.QPAY_POINT_TYPE') . ':' . $pointTypeName;
        $tradeDateHeadLine = trans('messages.QPAY_TRAD_DATE') . ':' . $dateStr;
        $tradeTotalHeadLine = "";
        $tradeDate = trans('messages.QPAY_TRAD_DATE');
        $tradeAmount =  trans('messages.QPAY_TRADE_AMOUNT') . '(' . trans('messages.QPAY_DATE') . ')';

        $celData = [
                    [$shopHeadLine, $pointHeadLine],
                    [$tradeDateHeadLine, $tradeTotalHeadLine],
                    ['', ''],
                    [$tradeDate, $tradeAmount]
                ];

        $records = $this->qpayPointTradeLogRepository->getTradeTotalByEachDay($shopID, $startDate, $endDate, $pointTypeID);
        
        //arrange record
        foreach ($records as $record) {
            $recordArr = [];
            $recordArr[] = $record->ndate;
            $recordArr[] = number_format($record->sum);
            $celData[] = $recordArr;
            $total = $total + $record->sum;
        }

        //update export trade total head line
        $celData[1][1] = trans('messages.QPAY_TRADE_TOTAL') .'(' . trans('messages.QPAY_MONTH') . '):' . number_format($total);

        $fileName = $pointTypeName . '-' . $shopName . '-' . str_replace("/","",$dateStr);

        //export and down excel
        Excel::create(rawurlencode($fileName), function($excel) use($celData) {

            $excel->sheet('score', function($sheet) use($celData) {

                $sheet->rows($celData);

            });

        })->download('xls');
    }
}