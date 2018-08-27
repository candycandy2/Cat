<?php
/**
 * Role Function Maintain - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Role_Function;
use DB;

class RoleFunctionRepository
{
    /** @var rolefunction Inject QP_Role_Function model */
    protected $rolefunction;

    /**
     * UserRepository constructor.
     * @param QP_Role_Function $rolefunction
     */
    public function __construct(QP_Role_Function $rolefunction)
    {
        $this->rolefunction = $rolefunction;
    }

    /**
     * Get available role list by function row_id 
     * @param  int $functionId qp_function.row_id
     * @return array
     */
    public function getAllowRole($functionId){
        return $this->rolefunction
                    -> where('function_row_id', $functionId)
                    -> lists('role_row_id')
                    -> toArray();
    }
}