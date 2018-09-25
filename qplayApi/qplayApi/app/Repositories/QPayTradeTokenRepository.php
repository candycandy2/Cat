<?php
/**
 * QPay Trade Token - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Trade_Token;
use DB;

class QPayTradeTokenRepository
{
    protected $qpayTradeToken;

    /**
     * QPayTradeTokenRepository constructor.
     * @param QPay_Trade_Token $qpayTradeToken
     */
    public function __construct(QPay_Trade_Token $qpayTradeToken)
    {
        $this->qpayTradeToken = $qpayTradeToken;
    }

    /**
     * get QPay Trade Token
     * @param  uuid
     * @return mixed
     */
    public function getTradeToken($uuid)
    {
        $result = $this->qpayTradeToken
                    -> select("trade_token", "trade_token_valid")
                    -> where("uuid", "=", $uuid)
                    -> get();

        return $result;
    }

    /**
     * new QPay Trade Token
     * @param  uuid
     * @param  trade token
     * @param  trade token valid
     * @return mixed
     */
    public function newTradeToken($uuid, $tradeToken, $tradeTokenValid)
    {
        return  DB::table("qpay_trade_token")
                -> insertGetId([
                    "uuid" => $uuid,
                    "trade_token" => $tradeToken,
                    "trade_token_valid" => $tradeTokenValid
                ]);
    }

    /**
     * delete QPay Trade Token
     * @param  uuid
     * @param  trade token
     * @return mixed
     */
    public function deleteTradeToken($uuid, $tradeToken)
    {
        $result = $this->qpayTradeToken
                    -> where("uuid", "=", $uuid)
                    -> where("trade_token", "=", $tradeToken)
                    -> delete();

        return $result;
    }

}