<?php
/**
 * Function Maintain - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Function;
use DB;

class FunctionRepository
{
    /** @var User Inject QP_User model */
    protected $function;
    /**
     * UserRepository constructor.
     * @param QP_Function $function
     */
    public function __construct(QP_Function $function)
    {
        $this->function = $function;
    }

    /**
     * Get all Function data by specific qp_app_head.row_id
     * @return mixed all Function data 
    */
    public function getFunctionListByAppId($appId){
        return  $this->function
            -> select('row_id', 'owner_app_row_id',
                      'app_row_id', 'type', 'name',
                      'status', 'variable_name',
                      'company_label', 'qaccount_right_level',
                      'qaccount_use')
            -> where('owner_app_row_id', $appId)
            -> where('status', 'Y')
            -> get();
    }
    
}