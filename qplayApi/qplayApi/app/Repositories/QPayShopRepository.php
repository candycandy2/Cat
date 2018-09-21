<?php

namespace App\Repositories;

use App\Model\QPAY_Shop;
use DB;

class QPayShopRepository 
{

    protected $qpayShop;

    public function __construct(QPAY_Shop $qpayShop)
    {   
        $this->qpayShop = $qpayShop;
    }
    
    /**
     * get enable point type list
     * @param  int $userId qp_user.row_id
     * @return mixed
     */
    public function getShopInfoByUserId($userId){
        
       return $this->qpayShop
             ->where('user_row_id',$userId)
             ->select('row_id')
             ->first();
    }

    /**
     * get enable shop list
     * @return mixed
     */
    public function getEnableShopList(){

        return $this->qpayShop
            ->join('qp_user','qp_user.row_id','=','qpay_shop.user_row_id')
            ->where('qpay_shop.trade_status','Y')
            ->select('qp_user.emp_name as shop_name', 'qpay_shop.row_id as shop_id')
            ->get();
    }

    /**
     * get Shop Status
     * @param  shop id
     * @return mixed
     */
    public function getShopStatus($shopID)
    {
        return $this->qpayShop
                -> leftJoin("qp_user", "qp_user.row_id", "=", "qpay_shop.user_row_id")
                -> select("status", "trade_status")
                -> where("qpay_shop.row_id", "=", $shopID)
                -> get();

    }
}
