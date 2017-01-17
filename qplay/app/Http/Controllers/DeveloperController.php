<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use Illuminate\Support\Facades\Input;
use App\lib\ResultCode;


class DeveloperController extends Controller
{
    public function getProjectList()
    {
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        CommonUtil::setLanguage();

        $projectList = \DB::connection('mysql_test')->table("qp_project as p")
            -> join('qp_app_head as h','h.project_row_id','=','p.row_id')
            -> select('p.project_code','p.app_key','p.secret_key','p.created_user as created_user',
                'h.row_id as app_row_id')
            -> where('p.created_user','=',\Auth::user()->row_id)
            -> orwhere('project_pm','=',\Auth::user()->login_id)
            -> orderBy("project_code")
            -> get();
        return response()->json($projectList);
    }

     public function getCustomApiList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        
        CommonUtil::setLanguage();

        $input = Input::get();
         if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $appRowId = $input["app_row_id"];
        $customApiList = \DB::connection('mysql_test')->table("qp_app_custom_api")
                -> where('app_row_id', '=', $appRowId)
                -> select('row_id', 'api_version', 'api_action', 'api_url')
                -> get();

        return response()->json($customApiList);

    }

    public function saveNewProject(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

    }


    private function createProject(){

    }

    private function insertAppHead(){

    }

    private function sendSecretKey(){
        
    }
}