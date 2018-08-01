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
            'funName' => 'required',
            'funVariable' => 'required',
            'funDescription' => 'required',
            'ownerApp' => 'required|numeric',
            'funType' => 'required|in:FUN,APP',
            'app'=>'required_if:funType,APP|numeric',
            'funStatus' => 'required|in:Y,N',
        ]);
        //Check Parameter
        if ($validator->fails()) {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                     'message'=>trans("messages.MSG_REQUIRED_FIELD_MISSING")], 200);
        }
        //Check if Function has exist
        $funVariableExist = $this->functionService->checkFunctionVariableExist($request->input('funVariable'));
        if($funVariableExist){
            return response()->json(['result_code'=>ResultCode::_000921_functionVariableExist,
                                     'message'=>trans("messages.ERR_FUNCTION_VARIABLE_EXIST")], 200);
        }
        
        //Create New Function
        $this->functionService->createFunction($request, $auth);
        return response()->json(['result_code' => ResultCode::_1_reponseSuccessful]);
    }

}
