<?php
/**
 * QPay Trade - Service
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Services;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\PushUtil;
use App\Repositories\QPayTradeTokenRepository;
use App\Repositories\QPayMemberPointRepository;
use App\Repositories\QPayMemberRepository;
use App\Repositories\QPayShopRepository;
use App\Repositories\QPayTradeLogRepository;
use DB;

class QPayTradeService
{

    protected $qpayTradeTokenRepository;
    protected $qpayMemberPointRepository;
    protected $qpayMemberRepository;
    protected $qpayShopRepository;
    protected $qpayTradeLogRepository;

    /**
     * QPayTradeService constructor.
     * @param QPayTradeTokenRepository $qpayTradeTokenRepository
     * @param QPayMemberPointRepository $qpayMemberPointRepository
     * @param QPayMemberRepository $qpayMemberRepository
     * @param QPayShopRepository $qpayShopRepository
     * @param QPayTradeLogRepository $qpayTradeLogRepository
     */
    public function __construct(QPayTradeTokenRepository $qpayTradeTokenRepository,
                                QPayMemberPointRepository $qpayMemberPointRepository,
                                QPayMemberRepository $qpayMemberRepository,
                                QPayShopRepository $qpayShopRepository,
                                QPayTradeLogRepository $qpayTradeLogRepository)
    {
        $this->qpayTradeTokenRepository = $qpayTradeTokenRepository;
        $this->qpayMemberPointRepository = $qpayMemberPointRepository;
        $this->qpayMemberRepository = $qpayMemberRepository;
        $this->qpayShopRepository = $qpayShopRepository;
        $this->qpayTradeLogRepository = $qpayTradeLogRepository;
    }


    /**
    * Get Trade Token
    * @return trade token
    */
    public function getTradeToken($uuid, $empNO, $tradePWD, $price, $shopID, $action)
    {
        $resultCode = ResultCode::_1_reponseSuccessful;
        $cerateTradeToken = false;

        $user = CommonUtil::getUserInfoJustByUserEmpNo($empNO);
        $tradeTokenData = $this->qpayTradeTokenRepository->getTradeToken($uuid);

        if ($action == "new") {
            $qpayMemberData = $this->qpayMemberRepository->getQPayMemberInfo($user->row_id);
            $tradePasswordData = $qpayMemberData["trade_password"];
        } else if ($action == "cancel") {
            $qpayShopData = $this->qpayShopRepository->getShopInfoByUserId($user->row_id);
            $tradePasswordData = $qpayShopData["trade_password"];
        }

        if (password_verify($tradePWD, $tradePasswordData)) {
            //Trade Password Valid
            //No Trade Token exist
            if (count($tradeTokenData) == 0) {
                $cerateTradeToken = true;
            } else {
                //Check Trade Token Valid
                if (intval($tradeTokenData[0]->trade_token_valid) > time()) {
                    //Valid
                    $newTradeToken = $tradeTokenData[0]->trade_token;
                    $newTradeTokenValid = $tradeTokenData[0]->trade_token_valid;
                } else {
                    //Invalid
                    $cerateTradeToken = true;
                    $this->qpayTradeTokenRepository->deleteTradeToken($uuid, $tradeTokenData[0]->trade_token);
                }
            }

            if ($cerateTradeToken) {
                $newTradeTokenValid = intval(time() + 30);
                $newTradeToken = base64_encode(md5($uuid . $empNO . $tradePWD . $price . $shopID . $newTradeTokenValid));

                $this->qpayTradeTokenRepository->newTradeToken($uuid, $newTradeToken, $newTradeTokenValid);
            }

            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode),
                "content" => [
                    "trade_token" => $newTradeToken,
                    "trade_token_valid" => $newTradeTokenValid
                ]
            ];
        } else {
            //Trade Password Invalid
            $resultCode = ResultCode::_000929_tradePasswordIncorrect;

            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode)
            ];
        }

        return $result;
    }

    /**
    * New Trade
    * @return trade result
    */
    public function newTrade($uuid, $tradePWD, $tradeToken, $empNO, $price, $shopID, $lang)
    {
        $newTradeID = "";
        $checkSuccess = true;
        $resultCode = "";
        $tradeSuccess = "";

        $user = CommonUtil::getUserInfoJustByUserEmpNo($empNO);
        $qpayMemberData = $this->qpayMemberRepository->getQPayMemberInfo($user->row_id);

        //Step 1. Check Trade Token
        $tradeTokenData = $this->qpayTradeTokenRepository->getTradeToken($uuid);

        if (count($tradeTokenData) == 0) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000927_tradeTokenIncorrect;
        }

        if ($checkSuccess && $tradeToken != $tradeTokenData[0]->trade_token) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000927_tradeTokenIncorrect;
        }

        if ($checkSuccess && intval($tradeTokenData[0]->trade_token_valid) <= time()) {
            //Trade Token Invalid
            $checkSuccess = false;
            $resultCode = ResultCode::_000928_tradeTokenInvalid;
        } else {
            //Trade Token Valid
        }

        if ($checkSuccess) {
            $this->qpayTradeTokenRepository->deleteTradeToken($uuid, $tradeToken);
        }

        //Step 2. Check Trade Password
        if ($checkSuccess) {
            if (password_verify($tradePWD, $qpayMemberData["trade_password"])) {
                //Trade Password Valid
            } else {
                //Trade Password Invalid
                $checkSuccess = false;
                $resultCode = ResultCode::_000929_tradePasswordIncorrect;
            }
        }

        //Step 3. Check Status of Shop (QPlay Account Status / Shop Trade Status)
        if ($checkSuccess) {
            $shopStatus = $this->qpayShopRepository->getShopStatus($shopID);

            if ($shopStatus[0]->status === "Y" && $shopStatus[0]->trade_status === "Y"){
                //All Status Valid
            } else {
                //Some Status Invalid
                $checkSuccess = false;
                $resultCode = ResultCode::_000923_shopTradeStatusDisabled;
            }
        }

        //Step 4. Check Points of Member > Trade Price
        if ($checkSuccess) {
            $pointNow = $this->qpayMemberPointRepository->getPointNow($user->row_id);

            if (is_null($pointNow)) {
                $checkSuccess = false;
                $resultCode = ResultCode::_000924_tradePointInsufficientqplay;
            }

            if ($checkSuccess && $pointNow < $price) {
                $checkSuccess = false;
                $resultCode = ResultCode::_000924_tradePointInsufficientqplay;
            }
        }

        //Step 5. New Trade
        if ($checkSuccess) {
            DB::beginTransaction();

            try {
                $allPointData = $this->qpayMemberPointRepository->getPointData($user->row_id);

                //Check count of datas & Check if there has a Negative value data
                $positiveValueTotal = 0;
                $startProcessAtPointsNumber = 0;

                foreach ($allPointData as $index => $pointData) {
                    if ($pointData["stored_now"] < 0) {
                        //Negative point
                        if (($pointData["stored_now"] + $positiveValueTotal) == 0) {
                            $startProcessAtPointsNumber = $index + 1;
                            $positiveValueTotal = 0;
                        }
                    } else {
                        //Positive point
                        $positiveValueTotal += $pointData["stored_now"];
                    }
                }

                if ($allPointData[$startProcessAtPointsNumber]->stored_now >= $price) {
                    //Not a Multiple Point Trade
                    $multiplePay = "N";
                    $multipleRowID = 0;
                    $multiplePoint = 0;
                    $tradeSuccess = "Y";
                    $newStoredNow = $allPointData[$startProcessAtPointsNumber]->stored_now - $price;
                    $newStoredUsed = $allPointData[$startProcessAtPointsNumber]->stored_used + $price;

                    $updatePointDataResult = $this->qpayMemberPointRepository->updatePointData($allPointData[$startProcessAtPointsNumber]->row_id, $newStoredNow,  $newStoredUsed);

                    if ($updatePointDataResult != 1) {
                        $tradeSuccess = "N";
                    }

                    $newTradeID = $this->qpayTradeLogRepository->newTradeRecord(
                        $allPointData[$startProcessAtPointsNumber]->member_row_id,
                        $allPointData[$startProcessAtPointsNumber]->row_id,
                        $allPointData[$startProcessAtPointsNumber]->stored_now,
                        $allPointData[$startProcessAtPointsNumber]->stored_used,
                        $newStoredNow,
                        $newStoredUsed,
                        $shopID,
                        $multiplePay,
                        $multipleRowID,
                        $multiplePoint,
                        $price,
                        $tradeSuccess,
                        $resultCode,
                        "N",
                        "N",
                        "",
                        ""
                    );
                } else {
                    //Multiple Point Trade
                    $multiplePay = "Y";
                    $multipleRowID = 0;
                    $multiplePoint = 0;
                    $tradeSuccess = "Y";
                    $tradePriceLeft = $price;

                    foreach ($allPointData as $index => $pointData) {

                        if ($index != $startProcessAtPointsNumber) {
                            continue;
                        }

                        //Check if the Member Point's stored_now = 0, If true, ignore it,
                        if (intval($pointData["stored_now"]) == 0) {
                            $startProcessAtPointsNumber++;
                            $multiplePay = "N";
                            continue;
                        } else {
                            //$multiplePay = "Y";
                        }

                        if ($pointData["stored_now"] >= 0) {
                            if ($pointData["stored_now"] >= $tradePriceLeft) {
                                $newStoredNow = $pointData["stored_now"] - $tradePriceLeft;
                                $newStoredUsed = $pointData["stored_used"] + $tradePriceLeft;
                                $multiplePoint = $tradePriceLeft;
                                $tradePriceLeft = 0;
                            } else {
                                $newStoredNow = 0;
                                $newStoredUsed = $pointData["stored_used"] + $pointData["stored_now"];
                                $multiplePoint = $pointData["stored_now"];
                                $tradePriceLeft = $tradePriceLeft - $pointData["stored_now"];

                                $multiplePay = "Y";
                            }
                        } else {
                            $startProcessAtPointsNumber++;
                            continue;
                        }

                        $updatePointDataResult = $this->qpayMemberPointRepository->updatePointData($pointData["row_id"], $newStoredNow,  $newStoredUsed);

                        if ($updatePointDataResult != 1) {
                            $tradeSuccess = "N";
                            $resultCode = ResultCode::_999999_unknownError;
                            DB::rollBack();
                            throw $e;
                            break;
                        }

                        if ($multiplePay == "N") {
                            $multiplePoint = 0;
                        }

                        $latestPointTradeLogID = $this->qpayTradeLogRepository->newTradeRecord(
                            $pointData["member_row_id"],
                            $pointData["row_id"],
                            $pointData["stored_now"],
                            $pointData["stored_used"],
                            $newStoredNow,
                            $newStoredUsed,
                            $shopID,
                            $multiplePay,
                            $multipleRowID,
                            $multiplePoint,
                            $price,
                            $tradeSuccess,
                            $resultCode,
                            "N",
                            "N",
                            "",
                            ""
                        );

                        if ($multiplePay == "Y" && $multipleRowID == 0) {
                            $multipleRowID = $latestPointTradeLogID;
                        } else if ($multiplePay == "N") {
                            $multipleRowID = $latestPointTradeLogID;
                        }

                        if ($tradePriceLeft != 0) {
                            $startProcessAtPointsNumber++;
                        }
                    }

                    $newTradeID = $multipleRowID;
                }

                if ($tradeSuccess) {
                    $resultCode = ResultCode::_1_reponseSuccessful;

                    //Send Push Message
                    $shopData = $this->qpayShopRepository->getShopInfoByShopID($shopID);
                    $successTradeID = "T".str_pad($newTradeID, 6, "0", STR_PAD_LEFT);

                    $queryParam =  array(
                        'lang' => $lang
                    );
                    $form = $shopData[0]->user_domain . "\\" . $shopData[0]->login_id;
                    //$form = PushUtil::getPushUserByEmpNo($empNO);

                    //Push for Shop
                    $to = array(
                        $shopData[0]->user_domain . "\\" . $shopData[0]->login_id
                    );
                    $title = trans("messages.MSG_QPAY_1");
                    $text = str_replace("%0", date("m/d H:i", time() + 8*3600), trans("messages.MSG_QPAY_2"));
                    $text = str_replace("%1", $price, $text);
                    $text = str_replace("%2", $successTradeID, $text);
                    $extra = [];

                    PushUtil::sendPushMessageWithContent($form, $to, $title, $text, $extra, $queryParam);

                    //Push for Emp
                    $to = array(
                        PushUtil::getPushUserByEmpNo($empNO)
                    );
                    $title = trans("messages.MSG_QPAY_1");
                    $text = str_replace("%0", date("m/d H:i", time() + 8*3600), trans("messages.MSG_QPAY_3"));
                    $text = str_replace("%1", $price, $text);
                    $text = str_replace("%2", $shopData[0]->emp_name, $text);
                    $text = str_replace("%3", $successTradeID, $text);
                    $extra = [];

                    PushUtil::sendPushMessageWithContent($form, $to, $title, $text, $extra, $queryParam);
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } else {
            $tradeSuccess = "N";
        }

        //Step 6. Create Trade Fail Log
        if ($tradeSuccess == "N") {
            $newTradeID = $this->qpayTradeLogRepository->newTradeRecord(
                $qpayMemberData["row_id"],
                0,
                0,
                0,
                0,
                0,
                $shopID,
                "N",
                0,
                0,
                $price,
                $tradeSuccess,
                $resultCode,
                "N",
                "N",
                "",
                ""
            );
        }

        //Step Final. Return Result
        $tradeSerialID = "T".str_pad($newTradeID, 6, "0", STR_PAD_LEFT);

        $pointNow = $this->qpayMemberPointRepository->getPointNow($user->row_id);

        if (is_null($pointNow)) {
            $pointNow = 0;
        }

        $result = [
            "result_code" => $resultCode,
            "message" => CommonUtil::getMessageContentByCode($resultCode),
            "content" => [
                "trade_id" => $tradeSerialID,
                "point_now" => $pointNow,
                "trade_time" => time()
            ]
        ];

        return $result;
    }

    /**
    * Get Trade Record for Emp
    * @return trade record
    */
    public function getTradeRecordEmp($uuid, $startDate, $endDate)
    {
        $userRowID = CommonUtil::getUserIdByUUID($uuid);

        $resultData = $this->qpayTradeLogRepository->getTradeRecordEmp($userRowID, $startDate, $endDate);

        $result = [
            "result_code" => ResultCode::_1_reponseSuccessful,
            "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
            "content" => [
                "trade_record" => $resultData
            ]
        ];

        return $result;
    }

    /**
    * Get Trade Record for Shop
    * @param  uuid
    * @param  startDate
    * @param  endDate
    * @param  pointTypeID optional, if null return all type
    * @return array
    */
    public function getTradeRecordShop($uuid, $startDate, $endDate, $pointTypeID=null)
    {
        $userRowID = CommonUtil::getUserIdByUUID($uuid);

        $resultData = $this->qpayTradeLogRepository->getTradeRecordShop($userRowID, $startDate, $endDate, $pointTypeID);

        $tradePointTotal = 0;

        foreach ($resultData as $data) {
            if ($data->cancel_trade == "N") {
                $tradePointTotal += $data->trade_point;
            } else if ($data->cancel_trade == "Y") {
                $tradePointTotal -= $data->trade_point;
            }
            unset($data["point_type_name"]);
        }

        $result = [
            "result_code" => ResultCode::_1_reponseSuccessful,
            "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful),
            "content" => [
                "sum_trade_point" => $tradePointTotal,
                "trade_record" => $resultData
            ]
        ];

        return $result;
    }

    /**
    * Get Trade Record-Store for QPay Web APP
    * @param  userId
    * @param  startDate
    * @param  endDate
    * @return array
    */
    public function tradeRecordQPayWeb($userId, $startDate, $endDate)
    {
        $qpayMember = $this->qpayMemberRepository->getQPayMemberInfo($userId);

        $storeData = $this->qpayMemberPointRepository->getStoreRecord($qpayMember->row_id, $startDate, $endDate);
        $tradeData = $this->qpayTradeLogRepository->getTradeRecordEmp($userId, $startDate, $endDate);

        //Merge 2 data
        $recordData = [];

        foreach ($storeData as $data) {
            $recordData[$data->store_time] = $data;
        }

        foreach ($tradeData as $data) {
            $recordData[$data->trade_time] = $data;
        }

        //Create result content
        $resultContent = [];

        foreach ($recordData as $time => $data) {
            $data = $data->toArray();

            $tempArray = [];
            $tradeSuccess = "";

            foreach ($data as $key => $val) {
                //Store Data
                if ($key == "store_id") {
                    $tempArray["trade_id"] = $val;
                    $tempArray["trade_type"] = "store";
                }
                if ($key == "store_total") {
                    $tempArray["trade_point"] = $val;
                }
                if ($key == "store_time") {
                    $tempArray["trade_time"] = $val;
                }
                if ($key == "point_type") {
                    $tempArray["point_type_name"] = $val;
                }

                //Trade Data
                if ($key == "trade_id") {
                    $tempArray["trade_id"] = $val;
                    $tempArray["trade_type"] = "trade";
                }
                if ($key == "trade_point") {
                    $tempArray["trade_point"] = $val;
                }
                if ($key == "trade_time") {
                    $tempArray["trade_time"] = $val;
                }
                if ($key == "trade_success") {
                    $tradeSuccess = $val;
                }
                if ($key == "shop_name") {
                    $tempArray["shop_name"] = $val;
                }
                if ($key == "cancel") {
                    $tempArray["cancel"] = $val;
                }
                if ($key == "cancel_trade") {
                    $tempArray["cancel_trade"] = $val;
                }
                if ($key == "cancel_trade_id") {
                    $tempArray["cancel_trade_id"] = $val;
                }
                if ($key == "cancel_reason") {
                    $tempArray["cancel_reason"] = $val;
                }
            }

            $tempArray["trade_success"] = $tradeSuccess;
            $resultContent[] = $tempArray;
        }

        $result = [
            "trade_record" => $resultContent
        ];

        return $result;
    }

    /**
    * check QPay Trade ID
    * @return trade data
    */
    public function checkTradeID($shopID, $tradeID)
    {
        $resultCode = ResultCode::_1_reponseSuccessful;
        $cerateTradeToken = false;
        $checkSuccess = true;

        $tradeData = $this->qpayTradeLogRepository->getTradeID($tradeID);

        if (count($tradeData) == 0) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000939_tradeIDNotExist;
        }

        if ($checkSuccess && (trim($tradeData[0]->shop_row_id) != trim($shopID))) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000940_tradeIDNotMatchStore;
        }

        //Check Status of Shop (QPlay Account Status / Shop Trade Status)
        if ($checkSuccess) {
            $shopStatus = $this->qpayShopRepository->getShopStatus($shopID);

            if ($shopStatus[0]->status === "Y" && $shopStatus[0]->trade_status === "Y"){
                //All Status Valid
            } else {
                //Some Status Invalid
                $checkSuccess = false;
                $resultCode = ResultCode::_000923_shopTradeStatusDisabled;
            }
        }

        if ($checkSuccess) {
            $nowDate = date("Y/m/d", time() + 8*3600);
            $tradeDate = date("Y/m/d", $tradeData[0]->trade_time + 8*3600);

            if ($nowDate != $tradeDate) {
                $checkSuccess = false;
                $resultCode = ResultCode::_000941_tradeIDCandelDateOverdue;
            }
        }

        if ($checkSuccess && ($tradeData[0]->cancel == "Y")) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000942_tradeIDHadCanceled;
        }

        if ($checkSuccess && ($tradeData[0]->cancel_pay == "Y")) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000943_tradeIDCannotCancel;
        }

        if ($checkSuccess && ($tradeData[0]->success == "N")) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000945_tradeIDIsFailTradeCannotCancel;
        }

        if ($checkSuccess) {
            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode),
                "content" => [
                    "trade_id" => "T".$tradeID,
                    "trade_price" => $tradeData[0]->trade_price,
                    "trade_time" => $tradeData[0]->trade_time
                ]
            ];
        } else if (!$checkSuccess) {
            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode)
            ];
        }

        return $result;
    }

    /**
    * Cancel Trade
    * According to $backend <= decide the API Request is for QPlay Backend
    * @return trade result
    */
    public function cancelTrade($uuid, $tradePWD, $tradeToken, $empNO, $price, $shopID, $tradeID, $reason, $lang, $backend)
    {
        $newTradeID = "";
        $checkSuccess = true;
        $resultCode = "";
        $tradeSuccess = "";

        if ($backend == "N") {
            $userShop = CommonUtil::getUserInfoJustByUserEmpNo($empNO);
            $qpayShopData = $this->qpayShopRepository->getShopInfoByUserId($userShop->row_id);
        } else if ($backend == "Y") {
            $backendAdmin = CommonUtil::getUserInfoJustByUserEmpNo($empNO);
        }

        $tradeData = $this->qpayTradeLogRepository->getTradeID($tradeID);

        //Step 1. Check Trade Token
        if ($backend == "N") {
            //For APP
            $tradeTokenData = $this->qpayTradeTokenRepository->getTradeToken($uuid);

            if (count($tradeTokenData) == 0) {
                $checkSuccess = false;
                $resultCode = ResultCode::_000927_tradeTokenIncorrect;
            }

            if ($checkSuccess && $tradeToken != $tradeTokenData[0]->trade_token) {
                $checkSuccess = false;
                $resultCode = ResultCode::_000927_tradeTokenIncorrect;
            }

            if ($checkSuccess && intval($tradeTokenData[0]->trade_token_valid) <= time()) {
                //Trade Token Invalid
                $checkSuccess = false;
                $resultCode = ResultCode::_000928_tradeTokenInvalid;
            } else {
                //Trade Token Valid
            }

            if ($checkSuccess) {
                $this->qpayTradeTokenRepository->deleteTradeToken($uuid, $tradeToken);
            }
        } else if ($backend == "Y") {
            //For QPlay Backend
            $backendAdminToken = base64_encode(md5($backendAdmin->company . $backendAdmin->user_domain . $backendAdmin->emp_no . 
                $backendAdmin->login_id . $backendAdmin->department));

            if ($backendAdminToken != $tradeToken) {
                $checkSuccess = false;
                $resultCode = ResultCode::_000927_tradeTokenIncorrect;
            }
        }

        //Step 2. Check Trade Password
        //(Backend ignore this Step)
        if ($backend == "N") {
            if ($checkSuccess) {
                if (password_verify($tradePWD, $qpayShopData["trade_password"])) {
                    //Trade Password Valid
                } else {
                    //Trade Password Invalid
                    $checkSuccess = false;
                    $resultCode = ResultCode::_000929_tradePasswordIncorrect;
                }
            }
        }

        //Step 3. Check Status of Shop (QPlay Account Status / Shop Trade Status)
        if ($checkSuccess) {
            $shopStatus = $this->qpayShopRepository->getShopStatus($shopID);

            if ($shopStatus[0]->status === "Y" && $shopStatus[0]->trade_status === "Y"){
                //All Status Valid
            } else {
                //Some Status Invalid
                $checkSuccess = false;
                $resultCode = ResultCode::_000923_shopTradeStatusDisabled;
            }
        }

        //Step 4. Check Trade ID
        if ($checkSuccess && (trim($tradeData[0]->shop_row_id) != trim($shopID))) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000940_tradeIDNotMatchStore;
        }

        //Check if this Trade ID is overdue 1 day
        //(Backend ignore this Step)
        if ($backend == "N") {
            if ($checkSuccess) {
                $nowDate = date("Y/m/d", time() + 8*3600);
                $tradeDate = date("Y/m/d", $tradeData[0]->trade_time + 8*3600);

                if ($nowDate != $tradeDate) {
                    $checkSuccess = false;
                    $resultCode = ResultCode::_000941_tradeIDCandelDateOverdue;
                }
            }
        }

        if ($checkSuccess && ($tradeData[0]->cancel == "Y")) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000942_tradeIDHadCanceled;
        }

        if ($checkSuccess && ($tradeData[0]->cancel_pay == "Y")) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000943_tradeIDCannotCancel;
        }

        if ($checkSuccess && ($tradeData[0]->trade_price != $price)) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000944_tradePriceIncorrect;
        }

        if ($checkSuccess && ($tradeData[0]->success == "N")) {
            $checkSuccess = false;
            $resultCode = ResultCode::_000945_tradeIDIsFailTradeCannotCancel;
        }

        //Step 5. Cancel Trade
        if ($checkSuccess) {
            DB::beginTransaction();

            try {
                $pointData = $this->qpayMemberPointRepository->getPointDataByRowID($tradeData[0]->member_point_row_id);

                $tradeSuccess = "Y";

                if ($tradeData[0]->multiple_pay == "N") {
                    //Not a Multiple Point Trade
                    $newStoredNow = $pointData[0]->stored_now + $price;
                    $newStoredUsed = $pointData[0]->stored_used - $price;
                } else {
                    //Multiple Point Trade
                    $newStoredNow = $pointData[0]->stored_now + $tradeData[0]->multiple_point;
                    $newStoredUsed = $pointData[0]->stored_used - $tradeData[0]->multiple_point;
                }

                $updatePointDataResult = $this->qpayMemberPointRepository->updatePointData($pointData[0]->row_id, $newStoredNow, $newStoredUsed);

                if ($updatePointDataResult != 1) {
                    $tradeSuccess = "N";
                }

                $newTradeID = $this->qpayTradeLogRepository->newTradeRecord(
                    $pointData[0]->member_row_id,
                    $pointData[0]->row_id,
                    $pointData[0]->stored_now,
                    $pointData[0]->stored_used,
                    $newStoredNow,
                    $newStoredUsed,
                    $shopID,
                    $tradeData[0]->multiple_pay,
                    0,
                    $tradeData[0]->multiple_point,
                    $price,
                    $tradeSuccess,
                    $resultCode,
                    "N",
                    "Y",
                    intval($tradeID),
                    $reason
                );

                if ($tradeSuccess == "Y") {
                    $this->qpayTradeLogRepository->cancelTradeRecord(intval($tradeID));
                }

                if ($tradeData[0]->multiple_pay == "Y") {
                    //Multiple Point Trade - Start process at Second Data
                    foreach ($tradeData as $index => $data) {
                        if ($index == 0) {
                            continue;
                        }

                        $pointData = $this->qpayMemberPointRepository->getPointDataByRowID($data["member_point_row_id"]);

                        $tradeSuccess = "Y";
                        $newStoredNow = $pointData[0]->stored_now + $data["multiple_point"];
                        $newStoredUsed = $pointData[0]->stored_used - $data["multiple_point"];

                        $updatePointDataResult = $this->qpayMemberPointRepository->updatePointData($pointData[0]->row_id, $newStoredNow, $newStoredUsed);

                        if ($updatePointDataResult != 1) {
                            $tradeSuccess = "N";
                            $resultCode = ResultCode::_999999_unknownError;
                            DB::rollBack();
                            throw $e;
                            break;
                        }

                        $this->qpayTradeLogRepository->newTradeRecord(
                            $pointData[0]->member_row_id,
                            $pointData[0]->row_id,
                            $pointData[0]->stored_now,
                            $pointData[0]->stored_used,
                            $newStoredNow,
                            $newStoredUsed,
                            $shopID,
                            $data["multiple_pay"],
                            $newTradeID,
                            $data["multiple_point"],
                            $price,
                            $tradeSuccess,
                            $resultCode,
                            "N",
                            "Y",
                            intval($data->row_id),
                            $reason
                        );

                        if ($tradeSuccess == "Y") {
                            $this->qpayTradeLogRepository->cancelTradeRecord(intval($data["row_id"]));
                        }
                    }
                }

                if ($tradeSuccess == "Y") {
                    $resultCode = ResultCode::_1_reponseSuccessful;

                    //Send Push Message
                    $shopData = $this->qpayShopRepository->getShopInfoByShopID($shopID);
                    $successTradeID = "T".str_pad($newTradeID, 6, "0", STR_PAD_LEFT);

                    $queryParam =  array(
                        'lang' => $lang
                    );
                    $form = $shopData[0]->user_domain . "\\" . $shopData[0]->login_id;

                    //Push for Shop
                    $to = array(
                        $shopData[0]->user_domain . "\\" . $shopData[0]->login_id
                    );
                    $title = trans("messages.MSG_QPAY_1");
                    $text = str_replace("%0", date("m/d H:i", time() + 8*3600), trans("messages.MSG_QPAY_4"));
                    $text = str_replace("%1", $price, $text);
                    $text = str_replace("%2", $successTradeID, $text);
                    $extra = [];

                    PushUtil::sendPushMessageWithContent($form, $to, $title, $text, $extra, $queryParam);

                    //Push for Emp
                    $userEmp = CommonUtil::getUserInfoByRowID($pointData[0]->user_row_id);

                    $to = array(
                        $userEmp->user_domain."\\".$userEmp->login_id
                    );
                    $title = trans("messages.MSG_QPAY_1");
                    $text = str_replace("%0", date("m/d H:i", time() + 8*3600), trans("messages.MSG_QPAY_5"));
                    $text = str_replace("%1", $price, $text);
                    $text = str_replace("%2", $shopData[0]->emp_name, $text);
                    $text = str_replace("%3", $successTradeID, $text);
                    $extra = [];

                    PushUtil::sendPushMessageWithContent($form, $to, $title, $text, $extra, $queryParam);
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } else {
            $tradeSuccess = "N";
        }

        //Step 6. Create Trade Fail Log
        if ($tradeSuccess == "N") {
            $newTradeID = $this->qpayTradeLogRepository->newTradeRecord(
                $tradeData[0]->member_row_id,
                0,
                0,
                0,
                0,
                0,
                $shopID,
                "N",
                0,
                0,
                $price,
                $tradeSuccess,
                $resultCode,
                "N",
                "Y",
                "",
                ""
            );
        }

        //Step Final. Return Result
        $tradeSerialID = "T".str_pad($newTradeID, 6, "0", STR_PAD_LEFT);

        if (!$checkSuccess || $tradeSuccess == "N") {
            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode)
            ];
        } else {
            $result = [
                "result_code" => $resultCode,
                "message" => CommonUtil::getMessageContentByCode($resultCode),
                "content" => [
                    "cancel_trade_id" => $tradeSerialID,
                    "cancel_price" => $price,
                    "cancel_time" => time()
                ]
            ];
        }

        return $result;
    }
}