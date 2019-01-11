<?php

namespace App\Repositories;

use App\Model\QPay_Shop;
use DB;

class QPayShopRepository 
{

    protected $qpayShop;

    public function __construct(QPay_Shop $qpayShop)
    {   
        $this->qpayShop = $qpayShop;
    }
    
    /**
     * get Shop data by qp_user.row_id
     * @param  int $userId qp_user.row_id
     * @return mixed
     */
    public function getShopInfoByUserId($userId){
        
       return $this->qpayShop
             ->join('qp_user','qp_user.row_id','=','qpay_shop.user_row_id')
             ->where('user_row_id',$userId)
             ->select('qpay_shop.row_id', 'qp_user.emp_name', 'qpay_shop.trade_password')
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
     * get Shop Status by qpay_shop.row_id
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

    /**
     * get Shop data by qpay_shop.row_id
     * @param  shop id
     * @return mixed
     */
    public function getShopInfoByShopID($shopID)
    {
        return $this->qpayShop
                -> leftJoin("qp_user", "qp_user.row_id", "=", "qpay_shop.user_row_id")
                -> select("qp_user.login_id", "qp_user.emp_name", "qp_user.user_domain")
                -> where("qpay_shop.row_id", "=", $shopID)
                -> get();

    }
}
