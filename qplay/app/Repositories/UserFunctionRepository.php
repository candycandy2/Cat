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
     * Delete avaiable users of specific function
     * @param  int $functionId qp_function.row_id
     * @return delete() result
     */
    public function deleteUserFunctionById($functionId){
        return $this->userFunction
                    -> where('function_row_id', $functionId)
                    -> delete();
    }

    /**
     * Save avaiable users of specific function
     * @param  int $functionId  qp_function.row_id
     * @param  Array $userList  availabel user id list
     * @param  Auth $auth       laravel Auth object
     * @return insert() result
     */
    public function saveUserFunction($functionId, $userList, $auth){
        
        $insertArray = array();
        $now = date('Y-m-d H:i:s',time());
        
        foreach ($userList as $userId) {

            $data = array(
                    'function_row_id' => $functionId,
                    'user_row_id'     => $userId,
                    'created_user'    => $auth::user()->row_id,
                    'updated_user'    => $auth::user()->row_id,
                    'created_at'      => $now,
                    'updated_at'      => $now
                );
            $insertArray[]=$data;
        
        }
        
        return $this->userFunction->insert($insertArray);
    }

    /**
     * Get avaiable users of specific function
     * @param  int $functionId qp_function.row_id
     * @return mixed
     */
    public function getUserByFunctionId($functionId){
        return $this->userFunction
                    -> join('qp_user', 'qp_user.row_id','=', 'qp_user_function.user_row_id')
                    -> where('function_row_id', $functionId)
                    -> select('qp_user.login_id','qp_user.row_id','qp_user.emp_name', 'department', 'company')
                    -> get();
    }

}