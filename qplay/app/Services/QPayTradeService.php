<?php
/**
 * QPay Trade Service - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\QPayPointTradeLogRepository;

class QPayTradeService
{

    protected $qpayPointTradeLogRepository;
    /**
     * QPayTradeService constructor.
     * @param QPayPointTradeLogRepository $qpayPointTradeLogRepository
     */
    public function __construct(QPayPointTradeLogRepository $qpayPointTradeLogRepository)
    {
        $this->qpayPointTradeLogRepository = $qpayPointTradeLogRepository;
    }

    /**
     * Get QPay Purchase Record List
     * @param  int $userRowID qp_user.row_id
     * @param  int $startDate query start date time (unix timestamp)
     * @param  int $endDate   query end date time (unix timestamp)
     * @return mixed
     */
    public function getQPayReimbursePurchaseList($userRowID, $startDate, $endDate){

        return $this->qpayPointTradeLogRepository->getQPayReimbursePurchaseList($userRowID, $startDate, $endDate);

    }

}