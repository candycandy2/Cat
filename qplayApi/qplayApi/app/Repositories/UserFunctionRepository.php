<?php
/**
 * User Function Maintain - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_User_Function;
use DB;

class UserFunctionRepository
{
    /** @var userFunction Inject QP_User_Function model */
    protected $userFunction;

    /**
     * UserRepository constructor.
     * @param QP_User_Function $userFunction
     */
    public function __construct(QP_User_Function $userFunction)
    {
        $this->userFunction = $userFunction;
    }

    /**
     * Get avaiable users of specific function
     * @param  int $functionId qp_function.row_id
     * @return array
     */
    public function getAllowUser($functionId){
        return $this->userFunction
                    -> join('qp_user', 'qp_user.row_id','=', 'qp_user_function.user_row_id')
                    -> where('function_row_id', $functionId)
                    -> lists('qp_user.row_id')
                    -> toArray();
    }

}