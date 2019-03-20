<?php
/**
 * QPay Trade Service - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\QPayPointTradeLogRepository;
use App\Repositories\QPayShopRepository;
use App\Repositories\QPayPointTypeRepository;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Auth;
use Excel;
use App;
use Session;
use Config;

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

    /**
     * QPay check Trade ID
     * @return mixed
     */
    public function checkTradeID($request)
    {
        if (Auth::user() == null || Auth::user()->login_id == null || Auth::user()->login_id == "") {
            return null;
        }

        $input = $request->all();
        $result = [];

        $tradeData = $this->qpayPointTradeLogRepository->getTradeData($input["tradeID"]);
        $shopInfo = $this->qpayShopRepository->getShopInfoByShopId($tradeData[0]->shop_row_id);

        if ($tradeData[0]->success == "N") {
            $result["result_code"] = ResultCode::_000925_tradeIDIsFailTradeCannotCancel;
        } else if ($tradeData[0]->cancel == "Y") {
            $result["result_code"] = ResultCode::_000926_tradeIDHadCanceled;
        } else if ($tradeData[0]->cancel_pay == "Y") {
            $result["result_code"] = ResultCode::_000927_tradeIDCannotCancel;
        } else {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        }

        $result["trade_id"] = $tradeData[0]->trade_id;
        $result["trade_time"] = $tradeData[0]->created_at;
        $result["trade_price"] = $tradeData[0]->trade_price;
        $result["login_id"] = $tradeData[0]->login_id;
        $result["emp_no"] = $tradeData[0]->emp_no;
        $result["shop_name"] = $shopInfo->shop_name;
        $result["shop_row_id"] = $tradeData[0]->shop_row_id;
        $result["admin_login_id"] = Auth::user()->login_id;

        return json_encode($result);
    }

    /**
     * QPay Cancel Trade
     * @return mixed
     */
    public function cancelTrade($request)
    {
        if (Auth::user() == null || Auth::user()->login_id == null || Auth::user()->login_id == "") {
            return null;
        }
        $input = $request->all();

        $apiFunction = 'cancelTradeBackend';
        $signatureTime = time();
        $appKey = CommonUtil::getContextAppKey(Config::get('app.env'), 'qplay');

        $queryParam['emp_no'] = Auth::user()->emp_no;
        $queryParam['shop_id'] = $input["shopID"];
        $queryParam['price'] = $input["tradePrice"];
        $queryParam['trade_id'] = $input["tradeID"];
        $queryParam['reason'] = $input["cancelReason"];
        $queryParam['lang'] = "zh-tw";
        $url = Config::get('app.qplay_api_server') . $apiFunction . '?' . http_build_query($queryParam);

        $tradeToken = base64_encode(md5(Auth::user()->company . Auth::user()->user_domain . Auth::user()->emp_no . Auth::user()->login_id . 
        Auth::user()->department));

        $header = array (
            'Content-Type: application/json',
            'App-Key: ' . $appKey,
            'Signature-Time: ' . $signatureTime,
            'Signature: ' . CommonUtil::getCustomSignature($signatureTime),
            'trade-token: ' . $tradeToken,
            'trade-pwd: 0000',
            'backend: Y'
        );

        $result = CommonUtil::callAPI('GET', $url, $header);

        return $result;
    }
}