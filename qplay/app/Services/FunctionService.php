<?php
/**
 * Company Maintain - Service
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Services;

use App\Repositories\FunctionRepository;
use App\Repositories\RoleFunctionRepository;
use App\Repositories\UserFunctionRepository;
use App\Repositories\AppRepository;
use DB;

class FunctionService
{

    protected $functionRepository;
    protected $roleFunctionRepository;
    protected $userFunctionRepository;
    protected $appRepository;

    /**
     * FunctionService constructor.
     * @param FunctionRepository $functionRepository
     * @param RoleFunctionRepository $RoleFunctionRepository
     * @param UserFunctionRepository $UserFunctionRepository
     * @param AppRepository $appRepository
     */
    public function __construct(FunctionRepository $functionRepository,
                                RoleFunctionRepository $roleFunctionRepository,
                                UserFunctionRepository $userFunctionRepository,
                                AppRepository $appRepository)
    {
        $this->functionRepository = $functionRepository;
        $this->roleFunctionRepository = $roleFunctionRepository;
        $this->userFunctionRepository = $userFunctionRepository;
        $this->appRepository = $appRepository;
    }

    /**
    * Get all Function data
    * @return mixed all Function data
    */
    public function getFunctionList()
    {
        $dataList = [];
        $functionList = $this->functionRepository->getFunctionList();
        foreach ($functionList as $function) {
             $data['row_id'] = $function->row_id;
             $data['fun_name'] = $function->name;
             $data['fun_type'] = $function->type;
             $data['fun_status'] = $function->status;
             $data['fun_variable'] = $function->variable_name;
             $ownerAppData = $this->appRepository->getAppBasicIfnoByAppId($function->owner_app_row_id);
             $data['owner_app_name'] = $ownerAppData->app_name;
             $data['fun_app'] = null;
             if(!is_null($function->app_row_id)){
                $funAppData = $this->appRepository->getAppBasicIfnoByAppId($function->app_row_id);
                $data['fun_app'] = $funAppData->app_name;
             }
             $dataList[] = $data;
        }
        return $dataList;
    }

    /**
    * Check if Company has exist
    * @return true / false
    */
    public function checkFunctionVariableExist($funVariable){
        $result = $this->functionRepository->getFunctionByVariable($funVariable);
        if(is_null($result)){
            return false;
        }else{
            return true;
        }
    }

    /**
    * Create Function
    * @return save() result
    */
    public function createFunction($request,  $auth)
    {   
        return $this->functionRepository->createFunction($request,  $auth);
    }

    /**
     * Update Function
     * @return 
     */
    public function updateFunction($request,  $auth){
        
        \DB::beginTransaction();
        try {

            $functionId = $request['function_id'];
            $this->functionRepository->updateFunction($request,  $auth);
            
            if(!isset($request['companyList']) || count($request['companyList']) == 0){
                //by User Role
                $this->functionRepository->clearCompanyLabel($functionId);

                if(isset($request['roleList'])){
                $this->roleFunctionRepository->deleteRoleFunctionById($functionId);
                $this->roleFunctionRepository->saveRoleFunction($functionId, $request['roleList'],  $auth);
                }
                if(isset($request['userList'])){
                    $this->userFunctionRepository->deleteUserFunctionById($functionId);
                    $this->userFunctionRepository->saveUserFunction($functionId, $request['userList'],  $auth);   
                }
            }else{
                //by Company
                $this->roleFunctionRepository->deleteRoleFunctionById($functionId);
                $this->userFunctionRepository->deleteUserFunctionById($functionId);
            }

        \DB::commit();
        } catch (\Exception $e) {

            \DB::rollBack();
            throw $e;
        }
        
    }

    /**
     * Get Function detail information
     * @param  int $functionId [description]
     * @return array
     */
    public function getFunctionDetail($functionId){
        $data = $this->functionRepository->getFunctionDetail($functionId)->toArray();
        $ownerAppData = $this->appRepository->getAppBasicIfnoByAppId($data['owner_app_row_id']);
        $data['owner_app_name'] = $ownerAppData->app_name;
        $data['fun_app'] = null;
        if(!is_null($data['app_row_id'])){
            $funAppData = $this->appRepository->getAppBasicIfnoByAppId($data['app_row_id']);
            $data['fun_app'] = $funAppData->app_name;
        }

        $roles = $this->roleFunctionRepository->getRoleByFunctionId($functionId);
        $roleArr = [];
        foreach ($roles as $role) {
            $roleArr[] = $role->role_row_id;
        }
        $data['roleList'] = implode(";" , $roleArr);

        $users = $this->userFunctionRepository->getUserByFunctionId($functionId);
        foreach ($users as $user) {
            $userArr[] = $user->user_row_id;
        }
        $data['userList'] = implode(";" , $roleArr);
        return $data;
    }

    /**
     * Get availabel users of specific function
     * @param  int $functionId qp_function.row_id
     * @return mixed
     */
    public function getUserFunctionList($functionId){
        return $this->userFunctionRepository->getUserByFunctionId($functionId);
    }
}