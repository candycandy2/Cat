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

    /**
     * Get QPay enable shop list
     * @return mixed
     */
    public function getQPayShopList(){
        return $this->user
                ->LeftJoin('qpay_shop','qp_user.row_id','=','qpay_shop.user_row_id')
                ->where('source_from','shop')
                ->where('qpay_shop.deleted_at','1970-01-01 23:23:59')
                ->where('qp_user.deleted_at','0000-00-00 00:00:00')
                ->select('qpay_shop.row_id as shop_id',
                        'qp_user.row_id as user_id',
                        'qpay_shop.created_at as created_at',
                        'password',
                        'address',
                        'status',
                        'login_id',
                        'trade_status',
                        'ext_no',
                        'emp_name')
                ->orderBy('qpay_shop.created_at','desc')
                ->get();
    }

    /**
     * Add a new QPay Shop
     * @param  Array $data shop infomation
     * @return boolean insert() result
     */
    public function newShop($data){

        return $this->qpayShop->insert($data);

    }
    
    /**
     * Update QPay trade status
     * @param  int    $shopId qpay_shop.row_id as shop id
     * @param  string $status N|Y
     * @return boolean save() result
     */
    public function updateTradeStatus($shopId, $status){

        $shop =  $this->qpayShop::find($shopId);
        $shop->trade_status = $status;

        return $shop->save();
    }

    /**
     * Get specific shop user data
     * @param  int $shopId qpay_shop.row_id as shop id
     * @return mixed
     */
    public function getShopUserByShopId($shopId){
        return $this->qpayShop
             ->where('row_id', $shopId)
             ->select('user_row_id')
             ->first();
    }

    /**
     * Update shop information
     * @param  int   $shopId qpay_shop.row_id as shop id
     * @param  Array $data   update data
     * @return boolean update() result
     */
    public function updateShop($shopId, $data){

        return $this->qpayShop::find($shopId)
                    ->update($data);

    }

    /**
     * Get all QPay shop list
     * @return mixed
     */
    public function getAllShopList(){
        return $this->user
                ->LeftJoin('qpay_shop','qp_user.row_id','=','qpay_shop.user_row_id')
                ->where('source_from','shop')
                ->select('qpay_shop.row_id as shop_id',
                        'qp_user.row_id as user_id',
                        'qpay_shop.created_at as created_at',
                        'qp_user.deleted_at as user_delete_at',
                        'qpay_shop.deleted_at as shop_delete_at',
                        'password',
                        'address',
                        'status',
                        'login_id',
                        'trade_status',
                        'ext_no',
                        'emp_name')
                ->orderBy('status','desc')
                ->orderBy('user_delete_at','asc')
                ->orderBy('shop_delete_at','desc')
                ->get();
    }

    /**
     * Get QPay shop infomation by shop row_id
     * @param  int  $shopId shop row_id
     * @return mixed
     */
    public function getShopInfoByShopId($shopId){
        return $this->qpayShop
                ->join('qp_user','qp_user.row_id','=','qpay_shop.user_row_id')
                ->where('source_from','shop')
                ->where('qpay_shop.row_id',$shopId)
                ->select('qpay_shop.row_id as shop_id',
                        'qp_user.row_id as user_id',
                        'qpay_shop.created_at as created_at',
                        'qp_user.deleted_at as user_delete_at',
                        'qpay_shop.deleted_at as shop_delete_at',
                        'password',
                        'address',
                        'status',
                        'login_id',
                        'trade_status',
                        'ext_no',
                        'emp_name as shop_name')
                ->first();
    }

}