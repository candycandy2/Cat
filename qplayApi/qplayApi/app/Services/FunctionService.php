<?php
/**
 * Function Maintain - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\FunctionRepository;
use App\Repositories\RoleFunctionRepository;
use App\Repositories\UserFunctionRepository;
use App\Repositories\AppRepository;
use App\Repositories\AppVersionRepository;

class FunctionService
{

    protected $functionRepository;
    protected $roleFunctionRepository;
    protected $userFunctionRepository;
    protected $appRepository;
    protected $appVersionRepository;

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
                                AppRepository $appRepository,
                                AppVersionRepository $appVersionRepository)
    {
        $this->functionRepository = $functionRepository;
        $this->roleFunctionRepository = $roleFunctionRepository;
        $this->userFunctionRepository = $userFunctionRepository;
        $this->appRepository = $appRepository;
        $this->appVersionRepository = $appVersionRepository;
    }


    /**
    * Get all Function data
    * @return mixed all Function data
    */
    public function getFunctionListByAppId($userIdentify, $appId, $lang, $deviceType)
    {

        $resultList = [];
        // get function list from qp_function
        $functionList = $this->functionRepository->getFunctionListByAppId($appId);
        foreach ($functionList as $function) {
           
            $publishedVersion = $this->appVersionRepository->getPublishedVersion($function->app_row_id, $deviceType);
            if($function->type == 'APP' && is_null($publishedVersion)){
                continue;
            }
            $data['function_content'] = [];
            $data['function_variable'] = [];

            $data['function_variable']  = $function->variable_name;
            $data['function_content']['type']  = $function->type;
            $data['function_content']['right']  = "N";
            $data['function_content']['qaccount_use']  = $function->qaccount_use;
            $data['function_content']['qaccount_right_level']  = $function->qaccount_right_level;
            $data['function_content']['company_label']  = $function->company_label;
            $data['function_content']['right'] = $this->getFunctionRight($function, $userIdentify);

            if($function->type == 'APP' && !is_null($function->app_row_id)){
                // get app name 
                $funAppData = $this->appRepository->getAppBasicIfnoByAppId($function->app_row_id, $lang);
                if(!is_null($funAppData)){
                    $data['function_content']['app_name'] = $funAppData->app_name;
                    $data['function_content']['icon'] = $funAppData->icon_url;
                    $data['function_content']['app_summary'] = $funAppData->app_summary;
                    $data['function_content']['app_description'] = $funAppData->app_description;
                }            
            }
            $resultList[] = $data;    
            
        }
        return $resultList;
    }


    /**
     * get user's right of function
     * @param  object $function     query function data
     * @param  array  $userIdentify user information
     * @return string
     */
    public function getFunctionRight($function, $userIdentify){
        $auth = 'N';
        if(!is_null($function->company_label)){
            $allowCompanys = explode(";" , $function->company_label);
            if(in_array($userIdentify['company'],$allowCompanys)){
               $auth = 'Y';
            }
        }else{
            $allowRoles = $this->roleFunctionRepository->getAllowRole($function->row_id);
            if(count($allowRoles) > 0){
                $diff = array_diff($userIdentify['userRole'], $allowRoles);
                if(count($diff) < count($userRole)){
                   $auth = 'Y';
                }
            }else{
                $allowUsers = $this->userFunctionRepository->getAllowUser($function->row_id);
                if(in_array($userIdentify['userId'], $allowUsers)){
                   $auth = 'Y';               
               }
            }
        }

        if($function->qaccount_use == "N"){
            if($userIdentify['adFlag'] == "N"){ //qAccount login
               $auth = 'N';
            }
        }

        if($function->qaccount_use == "Y" && $function->qaccount_right_level == "2"){
            if($userIdentify['adFlag'] == "N"){ //qAccount login
               $auth = 'N';
            }
        }

        return $auth;

    }
}