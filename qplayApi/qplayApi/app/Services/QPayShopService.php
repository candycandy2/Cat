<?php
/**
 * qpay shop - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayShopRepository;

class QPayShopService
{
    protected $QPayShopRepository;
    /**
     * QPayShopService constructor.
     * @param QPayShopRepository $qpayShopRepository
     */
    public function __construct(QPayShopRepository $qpayShopRepository)
    {
        $this->qpayShopRepository = $qpayShopRepository;
    }

    /**
     * get enable point type list
     * @param  int $userId qp_user.row_id
     * @return mixed
     */
    public function getShopInfoByUserId($userId){

        return $this->qpayShopRepository->getShopInfoByUserId($userId);

    }

    /**
     * get enable shop list
     * @return mixed
     */
    public function getEnableShopList(){
        return $this->qpayShopRepository->getEnableShopList()->toArray();
    }
}