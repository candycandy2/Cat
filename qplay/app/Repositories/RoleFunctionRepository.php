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
    /** @var User Inject QP_User model */
    protected $function;
    /**
     * UserRepository constructor.
     * @param QP_Role_Function $rolefunction
     */
    public function __construct(QP_Role_Function $rolefunction)
    {
        $this->rolefunction = $rolefunction;
    }

    /**
     * Delete specific function available roles by function row_id
     * @param  int $functionId qp_function.row_id
     * @return delete() result
     */
    public function deleteRoleFunctionById($functionId){
       return $this->rolefunction->where('function_row_id', $functionId)->delete();
    }

    /**
     * Save data to qp_role_funcyion
     * @param  int   $functionId qp_function.row_id
     * @param  Array $roleList   available role list
     * @param  Auth $auth        laravel Auth object
     * @return insert() result
     */
    public function saveRoleFunction($functionId, $roleList, $auth){
        $insertArray = array();
        $now = date('Y-m-d H:i:s',time());
        foreach ($roleList as $role) {
            $data = array(
                    'function_row_id'=>$functionId,
                    'role_row_id'=>$role,
                    'created_user'=>$auth::user()->row_id,
                    'updated_user'=>$auth::user()->row_id,
                    'created_at'=>$now,
                    'updated_at'=>$now
                );
            $insertArray[]=$data;
        }
        return $this->rolefunction->insert($insertArray);
    }

    /**
     * Get available role list by function row_id 
     * @param  int $functionId qp_function.row_id
     * @return mixed
     */
    public function getRoleByFunctionId($functionId){
        return $this->rolefunction->where('function_row_id', $functionId)->select('role_row_id')->get();
    }
}