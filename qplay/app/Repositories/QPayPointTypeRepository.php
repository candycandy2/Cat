<?php
/**
 * QPay Point Type - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Point_Type;
use DB;

class QPayPointTypeRepository
{

    protected $qpayPointType;

    /**
     * QPayPointTypeRepository constructor.
     * @param QPay_Point_Type $qpayPointType
     */
    public function __construct(QPay_Point_Type $qpayPointType)
    {
        $this->qpayPointType = $qpayPointType;
    }

    /**
     * Get all Enable Point Type data
     * @return mixed all Enable Ppint Type data 
     */
    public function getQPayPointTypeList()
    {
        return  $this->qpayPointType
            -> select('row_id', 'name', 'color')
            -> where('status', '=', "Y")
            -> get();
    }

}