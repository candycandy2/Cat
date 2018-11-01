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

    /**
     * Get all Point Type data include enable and disable
     * @return mixed
     */
    public function getAllQPayPointTypeList()
    {
        return  $this->qpayPointType
            -> select('row_id', 'name', 'color', 'status')
            -> get();   
    }

    /**
     * Add New Point Type　
     * @param  string $name        point type name
     * @param  string $color       point type color
     * @param  int $createdUser    created user row_id
     * @return boolean insert result
     */
    public function newPointType($name, $color, $createdUser)
    {
        return  $this->qpayPointType->insert(['name'=>$name,
                                             'color'=>$color,
                                             'status'=>'Y',
                                             'created_user'=>$createdUser
                                            ]);
    }

    /**
     * Edit Point Type
     * @param  int    $rowId       the point type row_id which will been update
     * @param  string $name        update point type name
     * @param  string $color       update point type color
     * @param  string $status      update point type status (Y|N)
     * @param  int    $createdUser created user row_id
     * @return int                 updated result
     */
    public function editPointType($rowId, $name, $color, $status, $createdUser)
    {
        return  $this->qpayPointType
                ->where('row_id',$rowId)
                ->update(['name'=>$name,
                         'color'=>$color,
                         'status'=>$status,
                         'updated_user'=>$createdUser
                        ]);
    }

}