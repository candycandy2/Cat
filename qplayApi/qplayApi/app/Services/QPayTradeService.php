<?php
/**
 * QPay Trade - Service
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Services;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\Repositories\QPayTradeTokenRepository;
use App\Repositories\QPayMemberPointRepository;
use App\Repositories\QPayMemberRepository;
use App\Repositories\QPayShopRepository;
use App\Repositories\QPayTradeLogRepository;

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
    public function getTradeToken($uuid, $empNO, $price, $shopID)
    {
        $resultCode = ResultCode::_1_reponseSuccessful;
        $cerateTradeToken = false;
        $tradeTokenData = $this->qpayTradeTokenRepository->getTradeToken($uuid);

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
            $newTradeToken = base64_encode(md5($uuid . $empNO . $price . $shopID . $newTradeTokenValid));

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

        return $result;
    }

    /**
    * New Trade
    * @return trade result
    */
    public function newTrade($uuid, $tradePWD, $tradeToken, $empNO, $price, $shopID)
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
            $allPointData = $this->qpayMemberPointRepository->getPointData($user->row_id);

            if ($allPointData[0]->stored_now > $price) {
                //Not a Multiple Point Trade
                $multiplePay = "N";
                $multipleRowID = "";
                $multiplePoint = "";
                $tradeSuccess = "Y";
                $newStoredNow = $allPointData[0]->stored_now - $price;
                $newStoredUsed = $allPointData[0]->stored_used + $price;

                $updatePointDataResult = $this->qpayMemberPointRepository->updatePointData($allPointData[0]->row_id, $newStoredNow,  $newStoredUsed);


                if ($updatePointDataResult != 1) {
                    $tradeSuccess = "N";
                }

                $tradeID = $this->qpayTradeLogRepository->newTradeRecord(
                    $allPointData[0]->member_row_id,
                    $allPointData[0]->row_id,
                    $allPointData[0]->stored_now,
                    $allPointData[0]->stored_used,
                    $newStoredNow,
                    $newStoredUsed,
                    $shopID,
                    $multiplePay,
                    $multipleRowID,
                    $multiplePoint,
                    $price,
                    $tradeSuccess,
                    $resultCode
                );

                $newTradeID = $tradeID;
            } else {
                //Multiple Point Trade
                $multiplePay = "Y";
                $multipleRowID = "";
                $multiplePoint = "";
                $tradeSuccess = "Y";
                $dataProcessNumber = 1;
                $tradePriceLeft = $price;

                foreach ($allPointData as $pointData) {
                    if ($dataProcessNumber == 1) {
                        $newStoredNow = 0;
                        $newStoredUsed = $pointData["stored_used"] + $pointData["stored_now"];
                        $multiplePoint = $pointData["stored_now"];
                        $tradePriceLeft = $price - $pointData["stored_now"];
                    } else if ($dataProcessNumber == 2) {
                        $newStoredNow = $pointData["stored_now"] - $tradePriceLeft;
                        $newStoredUsed = $pointData["stored_used"] + $tradePriceLeft;
                        $multiplePoint = $tradePriceLeft;
                    }

                    $updatePointDataResult = $this->qpayMemberPointRepository->updatePointData($pointData["row_id"], $newStoredNow,  $newStoredUsed);

                    if ($updatePointDataResult != 1) {
                        $tradeSuccess = "N";
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
                        $resultCode
                    );

                    if ($dataProcessNumber == 1) {
                        $multipleRowID = $latestPointTradeLogID;
                        $dataProcessNumber++;
                    }
                }

                $newTradeID = $multipleRowID;
            }

            if ($tradeSuccess) {
                $resultCode = ResultCode::_1_reponseSuccessful;
            }

        } else {
            //Step 6. Create Trade Fail Log
            $tradeSuccess = "N";

            $tradeID = $this->qpayTradeLogRepository->newTradeRecord(
                $qpayMemberData["row_id"],
                0,
                0,
                0,
                0,
                0,
                $shopID,
                "N",
                "",
                "",
                $price,
                "N",
                $resultCode
            );

            $newTradeID = $tradeID;
        }

        //Step Final. Return Result
        $tradeSerialID = "T".str_pad($newTradeID, 6, "0", STR_PAD_LEFT);

        $result = [
            "result_code" => $resultCode,
            "message" => CommonUtil::getMessageContentByCode($resultCode),
            "content" => [
                "trade_success" => $tradeSuccess,
                "trade_ID" => $tradeSerialID
            ]
        ];

        return $result;
    }

}