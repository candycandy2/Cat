<?php
/**
 * EmpService Data Log - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\EmpService_Reserve_Record;
use DB;

class EmpServiceReserveRepository
{

    protected $reserveRecord;

    public function __construct(EmpService_Reserve_Record $reserveRecord)
    {
        $this->reserveRecord = $reserveRecord;
    }

    public function newReserve(Array $data){
       return $this->reserveRecord->insertGetId($data);
    }
}
