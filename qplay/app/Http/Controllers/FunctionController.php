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
     * CompanyController constructor.
     * @param FunctionService $companyService
     */
    public function __construct(FunctionService $functionService,
                                AppService $appService)
    {
        $this->functionService = $functionService;
        $this->appService = $appService;
    }

   /**
     * Function List View
     * @return view
     */
    function functionList(){
        $whereCondi = [];
        $orderCondi = array(array('field'=>'created_at','seq'=>'desc'));
        $appList =  $this->appService->getAppList($whereCondi, $orderCondi);
        return view("function_maintain/function_list")->with('appList',$appList);
    }

    /**
     * Return Function List
     * @return mixed All Function Data 
     */
    function getFunctionList(){
       return $this->functionService->getFunctionList();
    }

    /**
     * New Function
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
        //Check Parameter
        if ($validator->fails()) {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                     'message'=>trans("messages.MSG_REQUIRED_FIELD_MISSING")], 200);
        }
        //Check if Function has exist
        $funVariableExist = $this->functionService->checkFunctionVariableExist($request->input('tbxFunctionVariable'));
        if($funVariableExist){
            return response()->json(['result_code'=>ResultCode::_000921_functionVariableExist,
                                     'message'=>trans("messages.ERR_FUNCTION_VARIABLE_EXIST")], 200);
        }
    
        //Create New Function
        $this->functionService->createFunction(array_filter($request->all()), $auth);
        return response()->json(['result_code' => ResultCode::_1_reponseSuccessful]);
    }

    /**
     * Edit function view
     * @param  Request $request
     * @return json
     */
    function editFunction(Request $request){
        $validator = Validator::make($request->all(), [
            'function_id' => 'required|numeric'
        ]);
        //Check Parameter
        if ($validator->fails()) {
            App::abort(404);
        }
        //function id not exist
        $functionData = $this->functionService->getFunctionDetail($request->query('function_id'));
        if(is_null($functionData)){
            App::abort(404);
        }
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
        //Check Parameter
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
        //Check Parameter
        if ($validator->fails()) {
             App::abort(404);
        }
        return $this->functionService->getUserFunctionList($request['function_id']);
    }

}
