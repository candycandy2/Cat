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
     * Get all Function data
     * @return mixed all Function data 
    */
    public function getFunctionList(){
        return  $this->function
            -> select('row_id', 'owner_app_row_id', 'app_row_id', 'type', 'name', 'status', 'variable_name')
            -> get();
    }

    /**
     * Get Specific function detail
     * @param  int $functionId qp_function.row_id
     * @return mixed
     */
    public function getFunctionDetail($functionId){
        return  $this->function
            -> select()
            -> where('row_id', $functionId)
            -> first();
    }

    /**
     * Update data to qp_function
     * @return save() result
     */
    public function updateFunction($request,  $auth){

        //get the function by id,then set the value to update
        $function = $this->function->find($request['function_id']);

        $function->name = $request['tbxFunctionName'];
        $function->description = $request['tbxFunctionDescription'];
        $function->owner_app_row_id = $request['ddlOwnerApp'];
        
        //if request contains QAccount right level, then set the right level data
        $function->qaccount_use = $request['ddlQAccountUse'];
        if(isset($request['ddlQAccountRightLevel']) && $request['ddlQAccountUse'] == "Y"){
            $function->qaccount_right_level = $request['ddlQAccountRightLevel'];
        }else{
             $function->qaccount_right_level = null;
        }
        
        //if request contains app name, then set the app_row_id
        $function->type = $request['ddlFunctionType'];
        if(isset($request['ddlApp'])){
            
            $function->app_row_id = $request['ddlApp'];
        
        }

        // if is set company label, update the value, else update to null
        $companyLabel = null;
        if(isset($request['companyList'])){
            $companyLabel = implode(';', $request['companyList']);
        }
        $function->company_label = $companyLabel;
        $function->status = $request['ddlFunctionStatus'];
        $function->updated_user = $auth::user()->row_id;
        $function->updated_at = date('Y-m-d H:i:s',time());

        return $function->save();
    }

    /**
    * Check if qp_function variable_name already exist
    * @param  $funVariable function variable name
    * @return mixed
    */
    public function getFunctionByVariable($funVariable)
    {
        return  $this->function
            -> where('variable_name', '=', $funVariable)
            -> first();
    }

    /**
    * Insert data to qp_function
    * @return save() result
    */
    public function createFunction($request,  $auth)
    {   

        $this->function->name = $request['tbxFunctionName'];
        $this->function->variable_name = $request['tbxFunctionVariable'];
        $this->function->description = $request['tbxFunctionDescription'];
        $this->function->owner_app_row_id = $request['ddlOwnerApp'];
        $this->function->type = $request['ddlFunctionType'];
        if(isset($request['ddlApp']) && $request['ddlApp']!=""){
            $this->function->app_row_id = $request['ddlApp'];
        }
        $this->function->status = $request['ddlFunctionStatus'];
        $this->function->created_user = $auth::user()->row_id;
        $this->function->created_at = date('Y-m-d H:i:s',time());
        $this->function->timestamps = false;
        return $this->function->save();
    }

    /**
     * Remove company_label from qp_function
     * @return save() result
     */
    public function clearCompanyLabel($functionId){
        $function = $this->function->find($functionId);
        $function->company_label = null;
        return $function->save();
    }
}