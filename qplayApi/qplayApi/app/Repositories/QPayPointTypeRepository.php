<?php

namespace App\Repositories;

use App\Model\QPay_Point_Type;
use DB;

class QPayPointTypeRepository 
{

    protected $qpayPointType;

    public function __construct(QPay_Point_Type $qpayPointType)
    {   
        $this->qpayPointType = $qpayPointType;
    }
    
    /**
     * get enable point type list
     * @return mixed
     */
    public function getEnablePointTypeList(){
        
        $enablePointType = $this->qpayPointType
             ->where('status','Y')
             ->select('row_id', 'name', 'color')
             ->get();
        return $enablePointType;
    }

}
