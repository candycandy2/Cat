<?php
namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\FilePath;
use App\lib\VerifyApp;
use App\Http\Controllers\Config;
use App\Http\Requests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use DB;
use File;

class AppMaintainController extends Controller
{

    public function getCategoryList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $appCategoryList = \DB::table("qp_app_category")
            -> select('row_id', 'app_category')
            -> orderBy('app_category')
            -> get();
        foreach ($appCategoryList as $category) {
            $app_count = \DB::table('qp_app_head')
                ->where('app_category_row_id', '=', $category->row_id)
                ->count();
            $category->app_count = $app_count;
        }

         return response()->json($appCategoryList);
    }

    public function saveCategory(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $categoryName = $jsonContent['categoryName'];
            $isNew = $jsonContent['isNew'];
            if($isNew == 'Y') {
                //check category name already exist or not
                $sql = "select row_id from qp_app_category where app_category = "."'".$categoryName."'";
                $res = DB::select($sql, []);
                if(count($res) > 0) {
                    return response()->json(['result_code'=>ResultCode::_000918_AppCategoryNameExist,]);
                }
                \DB::table("qp_app_category")
                    -> insert(
                        ['app_category'=>$categoryName,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $categoryId = $jsonContent['categoryId'];
                \DB::table("qp_app_category")
                    -> where('row_id', '=', $categoryId)
                    -> update(
                        ['app_category'=>$categoryName,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

     public function deleteCategory() {

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $categoryIdList = $jsonContent['category_id_list'];
            foreach ($categoryIdList as $cId) {
                \DB::table("qp_app_category")
                    -> where('row_id', '=', $cId)
                    -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getCategoryAppsList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        if( !isset($input["category_id"]) || !is_numeric($input["category_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }

        $categoryId = $input["category_id"];
        $categoryAppsList = $this->formatVersionStatus($this->getAppList($categoryId,'='));
        return response()->json($categoryAppsList);
    }


    public function getOtherAppList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        
        $input = Input::get();
        if( !isset($input["category_id"]) || !is_numeric($input["category_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $categoryId = $input["category_id"];
        $otherAppsList = $this->formatVersionStatus($this->getAppList($categoryId,'<>'));
        return response()->json($otherAppsList);
    }


    function saveCategoryApps(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $categoryId = $jsonContent['category_id'];
            $appIdList = $jsonContent['app_id_list'];
            \DB::beginTransaction();
            \DB::table("qp_app_head")
                    -> where('app_category_row_id', "=", $categoryId)
                    -> update(
                        ['app_category_row_id'=>0,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            foreach ($appIdList as $aId) {
               \DB::table("qp_app_head")
                    -> where('row_id', '=', $aId)
                    -> update(
                        ['app_category_row_id'=>$categoryId,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

            }
            \DB::commit();
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function getBlockList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $blockList = \DB::table("qp_block_list")
            -> where('deleted_at','=','0000-00-00 00:00:00')
            -> select('row_id', 'ip', 'description')
            -> orderBy('ip')
            -> get();

         return response()->json($blockList);
    }

    public function saveBlockList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $blockIp = $jsonContent['blockIp'];
            $description = $jsonContent['description'];
            $isNew = $jsonContent['isNew'];
            if($isNew == 'Y') {
                \DB::table("qp_block_list")
                    -> insert(
                        ['ip'=>$blockIp,
                            'description'=>$description,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $blockRowId = $jsonContent['blockRowId'];
                \DB::table("qp_block_list")
                    -> where('row_id', '=', $blockRowId)
                    -> update(
                        ['ip'=>$blockIp,
                            'description'=>$description,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }


    public function deleteBlockList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $blockIdList = $jsonContent['blockIdList'];
            \DB::table("qp_block_list")
                ->whereIn('row_id', $blockIdList)
                -> update(
                    ['deleted_at'=>$now,
                        'updated_at'=>$now,
                        'updated_user'=>\Auth::user()->row_id]);

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function appList(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $data = array();

        $appList = $this->formatVersionStatus($this->getAppList());
        $data['appList']  = json_encode($appList);

        $data['projectInfo'] = CommonUtil::getNonUsedProjectList();
        $data['langList']    = CommonUtil::getLangList();
        return view("app_maintain/app_list")->with('data',$data);
    }

    public function appDetail(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $data = array();
        $appRowId = $input["app_row_id"];

        $appBasic = \DB::table("qp_app_head as h")
                -> join('qp_project as p', 'h.project_row_id', '=', 'p.row_id')
                -> join('qp_app_line as l', 'h.row_id', '=', 'l.app_row_id')
                -> join('qp_language as lang', 'l.lang_row_id', '=', 'lang.row_id')
                -> where('h.row_id', '=', $appRowId)
                -> select('h.package_name','h.project_row_id', 'h.default_lang_row_id', 'h.app_category_row_id',
                            'h.security_level','h.icon_url','company_label','l.app_description' ,'l.app_name' ,
                            'l.lang_row_id','l.app_summary','lang.lang_desc' ,'lang.lang_code',
                            'p.app_key')
                -> get();

         $appPic = \DB::table("qp_app_pic as pic")
                -> join('qp_app_head as h', 'h.row_id', '=', 'pic.app_row_id')
                -> join('qp_project as p', 'h.project_row_id', '=', 'p.row_id')
                -> join('qp_language as lang', 'pic.lang_row_id', '=', 'lang.row_id')
                -> where('pic.app_row_id', '=', $appRowId)
                -> select('pic.pic_url','pic.lang_row_id','pic.pic_type')
                -> get();
        $picData = array();
        foreach ($appPic  as $value) {
             $picData[$value->lang_row_id][$value->pic_type][]=$value->pic_url;
        }
        $data['picData']        = $picData;
        $data['appBasic']       = $appBasic;
        $data['langList']       = CommonUtil::getLangList();
        $data['categoryList']   = CommonUtil::getAllCategoryList();
        $data['errorCode']      = $this->getErrorCode($appBasic[0]->project_row_id,$appRowId);
        $data['company_label']  = ($appBasic[0]->company_label == "")?null:explode(';',$appBasic[0]->company_label);

        return view("app_maintain/app_detail/main")->with('data',$data);
    }

    public function saveAppMainData(Request $request){
        

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
       
        $this->validate( $request, [
            'ddlAppKey'     => 'required',
            'hidAppKey'     => 'required',
            'tbxAppName'    => 'required',
            'ddlLang'       => 'required'
         ]);

        $now = date('Y-m-d H:i:s',time());
        try{

                //check if the project already has app
                $appInfo = \DB::table("qp_project as p")
                    -> join('qp_app_head as h', 'h.project_row_id', '=', 'p.row_id')
                    -> where('p.row_id', '=', $request->input('ddlAppKey'))
                    -> select('h.row_id')
                    -> get();
                
                if(count($appInfo) > 0){
                     return response()->json(['result_code'=>ResultCode::_999999_unknownError,'message'=>trans("messages.ERR_PROJECT_EXIST_APP")]);
                }

                $newAppRowId = \DB::table("qp_app_head")
                            -> insertGetId(
                                [   'project_row_id'=> $request->input('ddlAppKey'),
                                    'package_name'=>'com.qplay.'.$request->input('hidAppKey'),
                                    'default_lang_row_id'=>$request->input('ddlLang'),
                                    'icon_url'=>'',
                                    'security_level'=>3,
                                    'created_at'=>$now,
                                    'created_user'=>\Auth::user()->row_id]);
                if(isset($newAppRowId)){
                 \DB::table("qp_app_line")
                            -> insert(
                                [   'app_row_id'=> $newAppRowId,
                                    'lang_row_id'=>$request->input('ddlLang'),
                                    'app_name'=>$request->input('tbxAppName'),
                                    'app_summary'=>'',
                                    'app_description'=>'',
                                    'created_at'=>$now,
                                    'updated_at'=>$now,
                                    'created_user'=>\Auth::user()->row_id,
                                    'updated_user'=>\Auth::user()->row_id]);

                }

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,'message'=>'Save App Success',
                    'new_app_row_id'=>$newAppRowId]
                    );

            }catch(Exception $e){
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>'Save App Error',
                    'content'=>''
                ]);
            }
            
    }


    public function getWhiteList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
         if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $appRowId = $input["app_row_id"];
        $whiteList = \DB::table("qp_white_list")
                -> where('app_row_id', '=', $appRowId)
                -> where('deleted_at', '=', '0000-00-00 00:00:00')
                -> select('row_id','allow_url','updated_at')
                -> orderBy('updated_at','desc')
                -> get();

        return response()->json($whiteList);

    }

    public function saveWhiteList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $allowUrl = $jsonContent['allowUrl'];
            $appRowId = $jsonContent['appRowId'];
            $isNewWhite = $jsonContent['isNewWhite'];
            if($isNewWhite == 'Y') {
                \DB::table("qp_white_list")
                    -> insert(
                        ['app_row_id'=>$appRowId,
                            'allow_url'=>$allowUrl,
                            'created_at'=>$now,
                            'updated_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $whiteRowId = $jsonContent['whiteRowId'];
                \DB::table("qp_white_list")
                    -> where('row_id', '=', $whiteRowId)
                    -> update(
                        ['allow_url'=>$allowUrl,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;


    }

    public function deleteWhiteList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $whiteIdList = $jsonContent['whiteIdList'];
            \DB::table("qp_white_list")
                ->whereIn('row_id', $whiteIdList)
                -> update(
                    ['deleted_at'=>$now,
                        'updated_at'=>$now,
                        'updated_user'=>\Auth::user()->row_id]);

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;

    }

    public function getCustomApi(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
         if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $appRowId = $input["app_row_id"];
        $customApiList = \DB::table("qp_app_custom_api")
                -> where('app_row_id', '=', $appRowId)
                -> select('row_id', 'api_version', 'api_action', 'api_url')
                -> get();

        return response()->json($customApiList);

    }


    public function saveCustomApi(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());

        if (\Request::isJson($content)) {

            $jsonContent = json_decode($content, true);
            $apiAction = $jsonContent['apiAction'];
            $apiVersion = $jsonContent['apiVersion'];
            $apiUrl = $jsonContent['apiUrl'];
            $appKey = $jsonContent['appKey'];
            $appRowId = $jsonContent["appRowId"];
            $isNewCustomApi = $jsonContent['isNewCustomApi'];
            if($isNewCustomApi == 'Y') {
                \DB::table("qp_app_custom_api")
                    -> insert(
                        ['app_row_id'=>$appRowId,
                            'api_action'=>$apiAction,
                            'api_version'=>$apiVersion,
                            'api_url'=>$apiUrl,
                            'app_key'=>$appKey,
                            'created_at'=>$now,
                            'created_user'=>\Auth::user()->row_id]);
            } else {
                $customApiRowId = $jsonContent['customApiRowId'];
                \DB::table("qp_app_custom_api")
                    -> where('row_id', '=', $customApiRowId)
                    -> update(
                        ['api_action'=>$apiAction,
                            'api_version'=>$apiVersion,
                            'api_url'=>$apiUrl,
                            'app_key'=>$appKey,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;

    } 

    public function deleteCustomApi(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $customApiIdList = $jsonContent['customApiIdList'];
            foreach ($customApiIdList as $apiId) {
                \DB::table("qp_app_custom_api")
                    -> where('row_id', '=', $apiId)
                    -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function saveSecurityLevel(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appRowId = $jsonContent['appRowId'];
            $securityLevel = $jsonContent['securityLevel'];
            
            \DB::table("qp_app_head")
                    -> where('row_id', "=", $appRowId)
                    -> update(
                        ['security_level'=>$securityLevel,
                            'security_updated_at'=>time(),
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }


    public function getAppUser(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
         if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $appRowId = $input["app_row_id"];
        $customApiList = \DB::table("qp_user_app as uapp")
                -> join('qp_user as u','uapp.user_row_id', '=', 'u.row_id')
                -> where('app_row_id', '=', $appRowId)
                -> select('u.row_id', 'u.login_id', 'u.company', 'u.department')
                -> get();

        return response()->json($customApiList);
    }

    public function saveAppUser(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appRowId = $jsonContent["appRowId"];
            $appUserList = $jsonContent["appUserList"];
            $now = date('Y-m-d H:i:s',time());
            //delete same data ,for shure
            \DB::table("qp_user_app")
                -> where('app_row_id', '=', $appRowId)
                -> whereIn('user_row_id', $appUserList)
                -> delete();

            foreach ($appUserList as $userRowId) {
                 \DB::table("qp_user_app")
                -> insert(
                    ['user_row_id'=>$userRowId,
                        'app_row_id'=>$appRowId,
                        'created_at'=>$now,
                        'created_user'=>\Auth::user()->row_id]);
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }
        return null;
    }

    public function deleteAppUser(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
         if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appRowId = $jsonContent["appRowId"];
            $appUserList = $jsonContent["appUserList"];
            \DB::table("qp_user_app")
                -> where('app_row_id', '=', $appRowId)
                -> whereIn('user_row_id', $appUserList)
                -> delete();

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }
        return null;
    }

    public function saveAppRole(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appRowId = $jsonContent["appRowId"];
            $roleRowIdList = $jsonContent["roleRowIdList"];
            $now = date('Y-m-d H:i:s',time());
            //delete same data ,for shure
            \DB::table("qp_role_app")
                -> where('app_row_id', '=', $appRowId)
                -> whereIn('role_row_id', $roleRowIdList)
                -> delete();

            foreach ($roleRowIdList as $roleRowId) {
                 \DB::table("qp_role_app")
                -> insert(
                    ['role_row_id'=>$roleRowId,
                        'app_row_id'=>$appRowId,
                        'created_at'=>$now,
                        'created_user'=>\Auth::user()->row_id]);
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }
        return null;
    }

    public function deleteAppRole(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
         if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appRowId = $jsonContent["appRowId"];
            $roleRowIdList = $jsonContent["roleRowIdList"];
            \DB::table("qp_role_app")
                -> where('app_row_id', '=', $appRowId)
                -> whereIn('role_row_id', $roleRowIdList)
                -> delete();

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }
        return null;
    }
   
    public function getAppVersionList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
         if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        $appRowId = $input["app_row_id"];
        $deviceType = $input["device_type"];
        $appVersionList = \DB::table("qp_app_version")
                -> where('app_row_id', '=', $appRowId)
                -> where('device_type', '=', $deviceType)
                -> select('row_id','device_type', 'version_code', 'version_name', 'url','status','updated_at')
                -> get();
        foreach ($appVersionList as $appVersion) {
            $appVersion->download_url = FilePath::getApkDownloadUrl($appRowId,$deviceType,
                $appVersion->version_code,$appVersion->url);
        }
        return response()->json($appVersionList);
    }

    public function saveAppVersion(Request $request){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $correctAppType = ['android','ios'];
       
        $input = Input::get();
        if( !isset($input["appRowId"]) || !is_numeric($input["appRowId"]) || 
            !isset($input["deviceType"]) || !in_array($input["deviceType"],$correctAppType) || 
            !isset($input["tbxVersionNo"]) || !is_numeric($input["appRowId"])
            || !isset($input["tbxVersionName"]) ){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }

        if(!Input::hasFile('file')){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }

        $appRowId       = $input['appRowId'];
        $appKey         = $input['appKey'];
        $deviceType     = $input['deviceType'];
        $versionCode    = $input['tbxVersionNo'];
        $tbxVersionName = $input['tbxVersionName'];
       
        $destinationPath    =  FilePath::getApkUploadPath($appRowId,$deviceType,$versionCode);
        try{
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            $fileName =  Input::file('file')->getClientOriginalName();
            $request->file('file')->move($destinationPath, $fileName);
            //create manifest.plist
            if($deviceType == 'ios'){
                 $manifestContent = $this->getManifest($appRowId, $appKey, $deviceType, $versionCode, $fileName);
                 if(isset($manifestContent)){
                    $file = fopen($destinationPath."manifest.plist","w"); 
                    fwrite($file,$manifestContent );
                    fclose($file);
                 }
            }
            $now = date('Y-m-d H:i:s',time());

            $version = \DB::table("qp_app_version")
                -> where('app_row_id', '=', $appRowId)
                -> where('version_code', '=',$versionCode)
                -> where('device_type', '=', $deviceType)
                -> select('row_id')
                -> first();

            if(count($version) > 0){
                \DB::table("qp_app_version")
                    -> where('row_id', "=", $version->row_id)
                    -> update(
                        ['version_name'=>$tbxVersionName,
                            'url'=>$fileName,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            }else{
                \DB::table("qp_app_version")
                -> insert(
                    ['app_row_id'=>$appRowId,
                        'version_code'=>$versionCode,
                        'version_name'=>$tbxVersionName,
                        'url'=>$fileName,
                        'status'=>'cancel',
                        'device_type'=>$deviceType,
                        'created_at'=>$now,
                        'created_user'=>\Auth::user()->row_id,
                        'updated_at'=>$now]);
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);

        }catch(Exception $e){
            return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                'message'=>'Save App Version Error',
                'content'=>''
            ]);
        }
        return null;
    }

    public function editAppVersion(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $versionRowId = $jsonContent['versionRowId'];
            $versionName = $jsonContent['versionName'];
            

            \DB::table("qp_app_version")
                    -> where('row_id', "=", $versionRowId)
                    -> update(
                        ['version_name'=> $versionName ,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function deleteAppVersion(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $versionItemList = $jsonContent["versionItemList"];
            $now = date('Y-m-d H:i:s',time());
            foreach ($versionItemList as $versionItem) {

               $destinationPath = FilePath::getApkUploadPath($versionItem['app_row_id'],$versionItem['device_type'],$versionItem['version_code']);
    
                if($versionItem['device_type'] == 'ios'){
                   if (file_exists($destinationPath.'manifest.plist')) {
                        unlink($destinationPath.'manifest.plist');
                    }
                }
                if(file_exists($destinationPath.$versionItem['url'])){
                    $result = unlink($destinationPath.$versionItem['url']);
                    if($result){
                        rmdir($destinationPath);
                    }
                }
                

                $result = \DB::table("qp_app_version")
                -> where('row_id', '=', $versionItem['row_id'])
                -> delete();
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }
        return null;    
    }

    public function publishApp(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
         
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $versionRowId = $jsonContent['versionRowId'];

            $versionInfo = \DB::table("qp_app_version")
                -> where('row_id', '=', $versionRowId)
                -> select('app_row_id', 'device_type')
                -> first();
            
            \DB::table("qp_app_version")
                    -> where('app_row_id', "=", $versionInfo->app_row_id)
                    -> where('device_type', "=", $versionInfo->device_type)
                    -> where('status', "=", "ready")
                    -> update(
                        ['status'=> 'cancel' ,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            
            \DB::table("qp_app_version")
                    -> where('row_id', "=", $versionRowId)
                    -> update(
                        ['status'=> 'ready' ,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    public function unPublishApp(){
        
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        $now = date('Y-m-d H:i:s',time());
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $versionRowId = $jsonContent['versionRowId'];
            
            \DB::table("qp_app_version")
                    -> where('row_id', "=", $versionRowId)
                    -> update(
                        ['status'=> 'cancel' ,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;

    }

    public function saveErrorCode(Request $request){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
        if( !isset($input["appRowId"]) || !is_numeric($input["appRowId"])){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }
        if(!Input::hasFile('errorCodeFile')){
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,]); 
        }   
        $ERROR_CODE_FILE_NAME =  'Error.json';
        $appRowId       = $input['appRowId'];
   
        $destinationPath   =  FilePath::getErrorCodeUploadPath($appRowId);

        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }
        $request->file('errorCodeFile')->move($destinationPath,$ERROR_CODE_FILE_NAME);
        $errorCodeJson = file_get_contents(FilePath::getErrorCodeUploadPath($appRowId).$ERROR_CODE_FILE_NAME);
        $encoding = mb_detect_encoding($errorCodeJson, array('ASCII','EUC-CN','BIG-5','UTF-8'));
        if ($encoding != false) {
         $errorCodeJson = iconv($encoding, 'UTF-8', $errorCodeJson);
        } else {
         $errorCodeJson = mb_convert_encoding($errorCodeJson, 'UTF-8','Unicode');
        }
        $errorCodeArray = json_decode(CommonUtil::removeBOM($errorCodeJson));
        $jsonProjectId = CommonUtil::getProjectInfoAppKey($errorCodeArray->error_list->appkey)->row_id;
        $appProjectId = CommonUtil::getProjectIdByAppId($appRowId);

        if(!isset($jsonProjectId) || $jsonProjectId != $appProjectId){
             return array("result_code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=>"專案不符");
        }

        $langList =  CommonUtil::getLangList();
        $now = date('Y-m-d H:i:s',time());
        $langMap = [];
        foreach ( $langList  as $langItem) {
            $langMap[$langItem->lang_code] = $langItem->row_id;
        }
     
        $insertArray = [];
        foreach ($errorCodeArray->error_list->code_list  as  $value) {
            foreach ($value->language_list as $langList) {
                $insertArray[] = array('project_row_id'=>  $jsonProjectId,
                                    'lang_row_id'=>$langMap[$langList->language],
                                    'error_code'=>$value->error_code,
                                    'error_desc'=>$langList->error_description,
                                    'created_at'=>$now,
                                    'created_user'=>\Auth::user()->row_id,
                                    'updated_at'=>$now
                                    );
            }
        }
        
       \DB::beginTransaction();
       try {
           \DB::table("qp_error_code")
                    -> where('project_row_id', '=', $jsonProjectId)
                    -> delete();
           \DB::table("qp_error_code")->insert($insertArray);
           \DB::commit();
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>'Save Error Success!',
                        'content'=>FilePath::getErrorCodeUrl($appRowId,$ERROR_CODE_FILE_NAME)
                            ]);
        } catch (Exception $e) {
            \DB::rollBack();
            return array("code"=>ResultCode::_999999_unknownError,
                "message"=>"未知错误");
        }

    }

    public function deleteErrorCode(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {

            $jsonContent = json_decode($content, true);
            $appRowId = $jsonContent['appRowId'];

            $ERROR_CPDE_FILE_NAME =  'Error.json';
            $errorCodeFile = FilePath::getErrorCodeUploadPath($appRowId).$ERROR_CPDE_FILE_NAME;
            try {
                $appHead = \DB::table("qp_app_head")
                        -> where('row_id', '=', $appRowId)
                        -> select('project_row_id')
                        -> first();

                \DB::table("qp_error_code")
                            -> where('project_row_id', '=', $appHead->project_row_id)
                            -> delete();

                if (file_exists($errorCodeFile)){
                    unlink($errorCodeFile);
                }
                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);


            } catch (Exception $e) {
                \DB::rollBack();
                return array("code"=>ResultCode::_999999_unknownError,
                    "message"=>"未知错误");
            }

        }

        return null;

       

    }


    public function saveAppDetail(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $input = Input::get();
       
        
    }

    private function getErrorCode($projectRowId,$appRowId){
        
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        $errorCode = \DB::table("qp_error_code")
                -> where('project_row_id', '=', $projectRowId)
                -> select('row_id')
                -> get();
        $ERROR_CPDE_FILE_NAME = 'Error.json';
        $file_path = FilePath::getErrorCodeUploadPath($appRowId);

        if (count($errorCode) > 0 && file_exists($file_path . $ERROR_CPDE_FILE_NAME)) {
            return FilePath::getErrorCodeUrl($appRowId,'Error.json');
        } else {
            return null;
        }
    }

    private function getManifest($appRowId, $appKey, $deviceType, $versionCode, $fileName){
    
        $MANIFEST_TEMPLETE_PATH = base_path('resources\templete\manifest.plist');
        $contents = null;

        if (File::exists($MANIFEST_TEMPLETE_PATH))
        {
            $contents = File::get($MANIFEST_TEMPLETE_PATH);
            $appDownLoadUrl = FilePath:: getApkUrl($appRowId,$deviceType,$versionCode,$fileName);
            $package = \Config::get('app.app_package') .'.'.$appKey;

            $contents = str_replace("{{url}}", $appDownLoadUrl, $contents);
            $contents = str_replace("{{package}}", $package, $contents);
            $contents = str_replace("{{version}}", $versionCode, $contents);
            $contents = str_replace("{{title}}", $appKey, $contents);
        }

        return $contents ;
           
    }

    private function getAppList($categoryId=null,$op=null){
       
       try{
            $appsList = \DB::table("qp_app_head as h")
                -> join('qp_project as p','h.project_row_id', '=', 'p.row_id')
                -> where(function($query) use ($categoryId,$op){
            
            if(isset($categoryId) && is_numeric($categoryId) && isset($op))

                $query->where('h.app_category_row_id', $op, $categoryId);
            })
            -> select('h.row_id','h.package_name','h.icon_url',
                        'h.app_category_row_id','h.default_lang_row_id',
                        'h.updated_at','h.created_at')
            -> get();

            foreach ($appsList as $app) {
               
                $appLineInfo = \DB::table('qp_app_line')
                    ->where('app_row_id', '=', $app->row_id)
                    ->where('lang_row_id', '=', $app->default_lang_row_id)
                    ->select('app_row_id', 'app_name', 'updated_at')
                    ->orderBy('updated_at')
                    ->get();

                $app->app_name = "-";
                $app->updated_at = $app->created_at;
                
                foreach ($appLineInfo as $line) {
                    $app->app_name = $line->app_name;
                    $app->updated_at = $line->updated_at;
                }
               

                $appVersionInfo = \DB::table('qp_app_version')
                    ->where('app_row_id', '=', $app->row_id)
                    ->select('app_row_id','version_name','device_type','status','updated_at')
                    ->orderBy('status','device_type','updated_at')
                    ->get();
                
                $app->released['android'] = 'android-Unpublish';
                $app->released['ios'] = 'ios-Unpublish';
                
                if(count( $appVersionInfo ) > 0) {
                    foreach ( $appVersionInfo  as $value) {
                        $versionArray[$value->device_type][$value->status] = $value->version_name;
                    }
                    foreach ($versionArray as $deviceType => $versionStatus) {
                        if(array_key_exists('ready',$versionStatus)){
                            $app->released[$deviceType] = $deviceType.'-'.$versionStatus['ready'];
                        }
                    }
                }
            }
        }catch(Exception $e){
            return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                'message'=>'Get App List Error',
                'content'=>''
            ]);
        }
        return $appsList;

    }

    private function formatVersionStatus($appList){
        
         foreach($appList as $app){
            $tmpStr = "";
            $tag = 1;
            foreach($app->released as $deviceType => $versionStatus){
                if($tag == 1){ 
                    $tmpStr = $versionStatus;
                }else{
                    $tmpStr = $tmpStr.'<br>'.$versionStatus;
                }
                $tag++;
            }
            $app->released = $tmpStr;
        }
        return $appList;
    }

    private function search($array, $key, $value)
    {
        $results = array();

        if (is_array($array)) {
            if (isset($array[$key]) && $array[$key] == $value) {
                $results[] = $array;
            }

            foreach ($array as $subarray) {
                $results = array_merge($results, search($subarray, $key, $value));
            }
        }

        return $results;
    }
}

?>