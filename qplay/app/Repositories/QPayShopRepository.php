<?php
/**
 * QPay Shop - Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Shop;
use App\Model\QP_User;
use DB;

class QPayShopRepository
{

    protected $qpayShop;
    protected $user;

    /**
     * QPayShopRepository constructor.
     * @param QPay_Shop $qpayShop
     */
    public function __construct(QPay_Shop $qpayShop, QP_User $user)
    {
        $this->qpayShop = $qpayShop;
        $this->user = $user;
    }

    public function getQPayShopList(){
        return $this->user
                ->LeftJoin('qpay_shop','qp_user.row_id','=','qpay_shop.user_row_id')
                ->where('source_from','shop')
                ->select('qpay_shop.row_id as shop_id',
                        'qp_user.row_id as user_id',
                        'password',
                        'address',
                        'status',
                        'login_id',
                        'trade_status',
                        'emp_name')
                ->get();
    }

    public function newShop($data){

        return $this->qpayShop->insert($data);
    }
}