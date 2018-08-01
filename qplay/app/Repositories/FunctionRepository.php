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

    public function getFunctionDatal(){
        
    }

    public function newFunctionData(){
        
    }

    public function editFunctionData(){
        
    }

    /**
    * Check if Function has exist
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
    * Create Function
    * @return save() result
    */
    public function createFunction($request,  $auth)
    {   

        $this->function->name = $request->input('funName');
        $this->function->variable_name = $request->input('funVariable');
        $this->function->description = $request->input('funDescription');
        $this->function->owner_app_row_id = $request->input('ownerApp');
        $this->function->type = $request->input('funType');
        $this->function->app_row_id = $request->input('app');
        $this->function->status = $request->input('funStatus');
        $this->function->created_user = $auth::user()->row_id;
        $this->function->created_at = date('Y-m-d H:i:s',time());

        return $this->function->save();
    }


}