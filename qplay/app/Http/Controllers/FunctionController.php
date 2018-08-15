<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\FunctionService;
use App\Services\AppService;
use App\lib\ResultCode;
use DB;
use Validator;
use Auth;
use App;

class FunctionController extends Controller
{

    protected $functionService;
    protected $appService;

    /**
     * FunctionController constructor.
     * @param FunctionService $functionService
     * @param AppService      $appService
     */
    public function __construct(FunctionService $functionService,
                                AppService $appService)
    {
        $this->functionService = $functionService;
        $this->appService = $appService;
    }

   /**
     * Function list view
     * @return view
     */
    function functionList(){

        $whereCondi = [];
        $orderCondi = array(array('field'=>'created_at','seq'=>'desc'));
        $appList =  $this->appService->getAppList($whereCondi, $orderCondi);

        return view("function_maintain/function_list")->with('appList',$appList);
    }

    /**
     * Return function list data
     * @return mixed All Function Data 
     */
    function getFunctionList(){
       return $this->functionService->getFunctionList();
    }

    /**
     * New function
     * @return json new function result 
     */
    function newFunction(Request $request, Auth $auth){

        $validator = Validator::make($request->all(), [
            'tbxFunctionName' => 'required',
            'tbxFunctionVariable' => 'required',
            'tbxFunctionDescription' => 'required',
            'ddlOwnerApp' => 'required|numeric',
            'ddlFunctionType' => 'required|in:FUN,APP',
            'ddlApp'=>'required_if:ddlFunctionType,APP|numeric',
            'ddlFunctionStatus' => 'required|in:Y,N',
        ]);

        //check parameter lost or incorrect 
        if ($validator->fails()) {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                     'message'=>trans("messages.MSG_REQUIRED_FIELD_MISSING")], 200);
        }
        //check function variable duplicate
        $funVariableExist = $this->functionService->checkFunctionVariableExist($request->input('tbxFunctionVariable'));
        if($funVariableExist){
            return response()->json(['result_code'=>ResultCode::_000921_functionVariableExist,
                                     'message'=>trans("messages.ERR_FUNCTION_VARIABLE_EXIST")], 200);
        }
        
        $this->functionService->createFunction($request->all(), $auth);
        
        return response()->json(['result_code' => ResultCode::_1_reponseSuccessful]);
    }

    /**
     * Edit function view
     * @param  Request $request
     * @return json
     */
    function editFunction(Request $request){

        //if request function row_id not exist, redirect to 404
        $validator = Validator::make($request->all(), [
            'function_id' => 'required|numeric'
        ]);
        if ($validator->fails()) {
            App::abort(404);
        }
        $functionData = $this->functionService->getFunctionDetail($request->query('function_id'));
        if(is_null($functionData)){
            App::abort(404);
        }
        //get function data to show
        $whereCondi = [];
        $orderCondi = array(array('field'=>'created_at','seq'=>'desc'));
        $appList =  $this->appService->getAppList($whereCondi, $orderCondi);
        return view("function_maintain/function_detail")->with(['functionData'=>$functionData,
                                                                'appList'=>$appList
                                                               ]);
    }

    /**
     * update function info to DB
     * @param  Request $request 
     * @param  Auth    $auth    
     * @return json
     */
    function updateFunction(Request $request, Auth $auth){

        $validator = Validator::make($request->all(), [
            'function_id' => 'required|numeric',
            'tbxFunctionVariable' => 'required',
            'tbxFunctionDescription' => 'required',
            'ddlOwnerApp' => 'required|numeric',
            'ddlFunctionType' => 'required|in:FUN,APP',
            'ddlApp'=>'required_if:ddlFunctionType,APP|numeric',
            'ddlQAccountUse'=>'required|in:Y,N',
            'ddlQAccountRightLevel'=>'required_if:ddlQAccountUse,Y|numeric',
            'ddlFunctionStatus' => 'required|in:Y,N',
        ]);

         //check parameter lost or incorrect 
        if ($validator->fails()) {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                     'message'=>trans("messages.MSG_REQUIRED_FIELD_MISSING")], 200);
        }
       
       $this->functionService->updateFunction($request, $auth);
       
       return response()->json(['result_code' => ResultCode::_1_reponseSuccessful]);
    }

    /**
     * Get available user function user list
     * @param  Request $request 
     * @return json
     */
    function getUserFunctionList(Request $request){
        
        $validator = Validator::make($request->all(), [
            'function_id' => 'required|numeric'
        ]);
        
        //if request function row_id not exist, redirect to 404
        if ($validator->fails()) {
             App::abort(404);
        }
        
        return $this->functionService->getUserFunctionList($request['function_id']);
    }

}
