<?php
/**
 * Company Maintain - Service
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Services;

use App\Repositories\FunctionRepository;
use App\Repositories\AppRepository;

class FunctionService
{

    protected $functionRepository;
    protected $appRepository;

    /**
     * FunctionService constructor.
     * @param FunctionRepository $functionRepository
     */
    public function __construct(FunctionRepository $functionRepository,
                                AppRepository $appRepository)
    {
        $this->functionRepository = $functionRepository;
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
             $data['fun_name'] = $function->name;
             $data['fun_type'] = $function->type;
             $data['fun_status'] = $function->status;
             $data['fun_variable'] = $function->variable_name;
             $ownerAppData = $this->appRepository->getAppBasicIfnoByAppId($function->owner_app_row_id);
             $data['owner_app_name'] = $ownerAppData->app_name;
             $data['fun_app_name'] = null;
             if(!is_null($function->app_row_id)){
                $funAppData = $this->appRepository->getAppBasicIfnoByAppId($function->app_row_id);
                $data['fun_app_name'] = $funAppData->app_name;
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



}