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

    /**
     * change QPay trade password For Shop
     * @param  int $userId qp_user.row_id
     * @param  string $oldPwd old password
     * @param  string $newPwd new password
     * @return string  ResultCode
     */
    public function changeTradePassword($userId, $oldPwd, $newPwd)
    {
        $qpayShop = $this->qpayShopRepository->getShopInfoByUserId($userId);
        if (is_null($qpayShop)) {
            return ResultCode::_000901_userNotExistError;
        }

        $TradPwd = $qpayShop->trade_password;
        if (!password_verify($oldPwd, $TradPwd)) {
             return ResultCode::_000925_oldTradePasswordIncorrect;
        }

        $options = [
            'cost' => '08',
        ];
        $pwd = password_hash($newPwd, PASSWORD_BCRYPT, $options);

        $this->qpayShopRepository->changeTradePassword($qpayShop->row_id, $pwd, $userId);

        return ResultCode::_1_reponseSuccessful;
    }
}