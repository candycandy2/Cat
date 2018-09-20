<?php
/**
 * QP_User - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayPointTypeRepository;

class QPayPointService
{
   protected $qpayPointTypeRepository;

    /**
     * QPayPointService constructor.
     * @param QPayPointTypeRepository $qpayPointTypeRepository
     */
    public function __construct(QPayPointTypeRepository $qpayPointTypeRepository)
    {
        $this->qpayPointTypeRepository = $qpayPointTypeRepository;
    }
    
    /**
     * get enable point type list
     * @return mixed
     */
    public function getEnablePointTypeList(){
        
        return $this->qpayPointTypeRepository->getEnablePointTypeList();

    }
}