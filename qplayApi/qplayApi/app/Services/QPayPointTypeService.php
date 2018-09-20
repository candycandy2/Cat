<?php
/**
 * QP_User - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayPointTypeRepository;



class QPayPointTypeService
{
    protected $qpayPointTypeRepository;
    /**
     * QPayPointTypeService constructor.
     * @param QPayPointTypeRepository $qpayPointTypeRepository
     */
    public function __construct(QPayPointTypeRepository $qpayPointTypeRepository)
    {
        $this->qpayPointTypeRepository = $qpayPointTypeRepository;
    }

   
    public function getQPayInfoShop(){
        
        $result = $this->qpayPointTypeRepository->getEnablePointTypeList();
        return $result;
    }
}