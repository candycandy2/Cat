<?php
namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\FilePath;
use App\lib\VerifyApp;
use App\Http\Controllers\Config;
use App\Http\Requests;
use Illuminate\Contracts\Validation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Model\QP_App_Head;
use App\Model\QP_App_Line;
use App\Model\QP_App_Pic;
use App\Model\QP_App_Custom_Api;
use App\Model\QP_Role_App;
use App\Model\QP_User_App;
use App\Model\QP_White_List;
use App\Services\AppVersionService;
use App\Services\AppService;
use DB;
use File;

class AppMaintainController extends Controller
{   

    protected $appService;
    protected $appVersionService;
    /**
     * 建構子，初始化引入相關服務
     * @param AppVersionService $appVersionService 地點基本資訊服務
     */
    public function __construct(AppService $appService, AppVersionService $appVersionService)
    {
        $this->appService = $appService;
        $this->appVersionService = $appVersionService;
    }

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
            $whereCondi = array(array('field'=>'app_category_row_id','op'=>'=','value'=>$category->row_id));
            $appList = $this->getAppList($whereCondi);
            $category->app_count = count(json_decode($appList));
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
        $whereCondi = array(array('field'=>'app_category_row_id','op'=>'=','value'=>$categoryId));
        $categoryAppsList = $this->getAppList($whereCondi);
        return $categoryAppsList;
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
        $whereCondi = array(array('field'=>'app_category_row_id','op'=>'<>','value'=>$categoryId));
        $otherAppsList = $this->getAppList($whereCondi);
        return $otherAppsList;
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
            \DB::table("qp_app_head")
                -> whereIn('row_id', $appIdList)
                -> update(
                    ['app_category_row_id'=>$categoryId,
                        'updated_at'=>$now,
                        'updated_user'=>\Auth::user()->row_id]);
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

    /**
     * App管理,App列表頁
     * @return view
     */
    public function appList(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $data = array();
        $data['projectInfo'] = CommonUtil::getNonUsedProjectList();
        $data['langList']    = CommonUtil::getLangList();
        return view("app_maintain/app_list")->with('data',$data);
    }

    /**
     * 取得App列表(管理清單)
     * @return json
     */
    public function getMaintainAppList(){
         if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $data = array();

        $appList = $this->getAppList();
        return $appList;
    }

    /**
     * App管理,詳細頁
     * @return view
     */
    public function appDetail(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        if( !isset($input["app_row_id"]) || !is_numeric($input["app_row_id"])){
            abort(404);
        }

        $data = array();
        $appRowId = $input["app_row_id"];
        $appMain = \DB::table("qp_app_head as h")
                -> join('qp_project as p', 'h.project_row_id', '=', 'p.row_id')
                -> where('h.row_id', '=', $appRowId)
                -> select('p.app_key','p.project_code','p.created_user','p.project_pm',
                         'h.package_name','h.project_row_id', 'h.default_lang_row_id', 'h.app_category_row_id',
                        'h.security_level','h.icon_url','h.company_label')
                ->first();
        
        if($appMain == null){
            abort(404);
        }

        if(!\Auth::user()->isAppAdmin()){
            if($appMain->created_user!=\Auth::user()->row_id &&
             strtolower($appMain->project_pm)!=strtolower(\Auth::user()->login_id)){
                abort(404); 
            }
        }

        $appLine = \DB::table("qp_app_line as l")
                -> join('qp_language as lang', 'l.lang_row_id', '=', 'lang.row_id')
                -> where('l.app_row_id', '=', $appRowId)
                -> select('l.row_id','l.app_description' ,'l.app_name' ,'l.lang_row_id', 'l.app_summary',
                        'lang.lang_desc' ,'lang.lang_code')
                ->get();

        $picData=[];
        $appPic = \DB::table("qp_app_pic as pic")
                -> join('qp_app_head as h', 'h.row_id', '=', 'pic.app_row_id')
                -> join('qp_project as p', 'h.project_row_id', '=', 'p.row_id')
                -> join('qp_language as lang', 'pic.lang_row_id', '=', 'lang.row_id')
                -> where('pic.app_row_id', '=', $appRowId)
                -> select('pic.row_id','pic.pic_url','pic.lang_row_id','pic.pic_type')
                -> get();

        foreach ($appPic  as $value) {
             $picData[$value->lang_row_id][$value->pic_type][$value->row_id]=$value->pic_url;
        }
        $data['picData']        = $picData;
        $data['appMain']        = $appMain;
        $data['appLine']        = $appLine;
        $data['langList']       = CommonUtil::getLangList();
        $data['categoryList']   = CommonUtil::getAllCategoryList();
        $data['errorCode']      = $this->getErrorCode($appMain->project_row_id,$appRowId);
        $data['company_label']  = ($appMain->company_label == "")?null:explode(';',$appMain->company_label);

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
                                    'package_name'=>\Config::get('app.app_package').'.'.$request->input('hidAppKey'),
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

                return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,'message'=>trans("messages.MSG_SAVE_APP_SUCCESS"),
                    'new_app_row_id'=>$newAppRowId]
                    );

            }catch(\Exception $e){
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>trans("messages.MSG_SAVE_APP_ERROR"),
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
                -> select('row_id', 'api_version', 'api_action', 'api_url','app_key')
                -> get();

        return response()->json($customApiList);

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
                -> where('status', '=', 'cancel')
                -> where('ready_date', '!=', null)
                -> select('row_id','device_type', 'version_code', 'version_name', 'url', 'external_app', 'version_log', 'size', 'status','ready_date', 'created_at')
                -> get();
        foreach ($appVersionList as $appVersion) {
            if($appVersion->external_app == 1){
                $appVersion->download_url = $appVersion->url;
            }else{
                $appVersion->download_url = FilePath::getApkDownloadUrl($appRowId,$deviceType,
                $appVersion->version_code,$appVersion->url);
            }
           
        }
        return response()->json($appVersionList);
    }

    public function saveAppDetail(Request $request){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $this->setLanguage();

       \DB::beginTransaction();
       try{
            $input = $request->all();
            $rules = array('icon' => 'mimes:png,jpeg'); 
            $validateArr = array();
            if(isset($input['fileIconUpload'])){
                $validateArr['icon'] = $input['fileIconUpload'];
            }
            $validator = \Validator::make( $validateArr, $rules);
            if(!$validator->passes()){
                return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>$validator->messages()
                ]);
            }
            $appId = $input['appId'];
            $appkey = $input['appKey'];
            parse_str($input['mainInfoForm'],$mainInfoData);
            $this->saveAppMainInfo($appId, $mainInfoData);

            if(isset($input['fileIconUpload'])){
                $icon = $input['fileIconUpload'];
                $this->uploadIcon($appId, $icon);
            }elseif($input['icon']=="undefined"){
                $this->deleteIcon($appId); 
            }
            $ori = QP_App_Head::where('row_id', $appId)
                            ->first(['security_level']);

            $chkCompany = (isset($input['chkCompany']))?implode(";",$input['chkCompany']):null;
            $dataArr = array(
                'default_lang_row_id'=>$input['defaultLang'],
                'app_category_row_id'=>$input['categoryId'],
                'security_level'=>$input['securityLevel'],
                'company_label'=> $chkCompany,
                'updated_user'=>\Auth::user()->row_id,
                );
            if($ori->security_level != $input['securityLevel']){
                $dataArr['security_updated_at'] = time(); 
            }
            $this->updateAppHeadById($appId, $dataArr);
                
            $this->saveAppScreenShot($appId, $input);

            $aooRoleList = (isset($input['appRoleList']))?$input['appRoleList']:array();
            $this->saveAppRole($appId,$aooRoleList);

            $appUserList = (isset($input['appUserList']))?$input['appUserList']:array();
            $this->saveAppUser($appId,$appUserList);

            if(isset($input['errorCodeFile'])){
                $result = $this->saveErrorCode($appId,$appkey,$input['errorCodeFile']);
                if($result['result_code']!= ResultCode::_1_reponseSuccessful){
                    return response()->json($result);
                }
            }else{
                if(isset($input['deleteErrorCode']) && $input['deleteErrorCode'] == 'true'){
                    $this->deleteErrorCode($appId);
                }
            }
            if(isset($input['delVersionArr'])){
                $this->appVersionService->deleteAppVersion($appId,explode(',',$input['delVersionArr']));
            }
            
            $versionList = array();
            if(isset($input['versionList']) && is_array($input['versionList'])){
                $versionList = $input['versionList'];
            }
            $this->appVersionService->saveAppVersionList($appkey, $appId, $versionList);
            
            $customApiList = array();
            if(isset($input['customApiList']) && is_array($input['customApiList'])){
                $customApiList = $input['customApiList'];
            }
            $this->saveCustomApi($appkey, $appId, $customApiList);
           
            $whiteList = array();
            if(isset($input['whiteList']) && is_array($input['whiteList'])){
                $whiteList = $input['whiteList'];
            }
            $this->saveWhiteList($appId, $whiteList);

           \DB::commit();
           
           return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }catch(\Exception $e){
            return response()->json(['result_code'=>ResultCode::_999999_unknownError,
                'message'=>trans("messages.MSG_OPERATION_FAILED".$e->getMessage()),
                'content'=>''
            ]);
           \DB::rollBack();
        }
    }
    
    private function setLanguage() {
        \App::setLocale("en-us");
        if(\Session::has('lang') && \Session::get("lang") != "") {
            \App::setLocale(\Session::get("lang"));
        }
    } 
    private function uploadIcon($appId,$icon){
        $iconUploadPath =  FilePath::getIconUploadPath($appId);

        if (!file_exists($iconUploadPath)) {
            mkdir($iconUploadPath, 0755, true);
        }
        $icon->move($iconUploadPath,$icon->getClientOriginalName());

        $qpAppHead = QP_App_Head::find($appId);
        $qpAppHead->icon_url=$icon->getClientOriginalName();
        $qpAppHead->save();
    }

    private function deleteIcon($appId){
        $oriIcon = QP_App_Head::where('row_id', $appId)
                        ->first(['icon_url']);
        $oriIconFile = FilePath::getIconUploadPath($appId).$oriIcon->icon_url;
        if($oriIcon->icon_url!="" && file_exists($oriIconFile)){
            unlink($oriIconFile);
        }
        $qpAppHead = QP_App_Head::find($appId);
        $qpAppHead->icon_url="";
        $qpAppHead->save();
    }

    /**
     * save App Screenshot
     * @param  int    $appId     qpp id
     * @param  Array  $input     form post data
     */
    private function saveAppScreenShot($appId, $input){
      
            $delPic = (isset($input['delPic']))?$input['delPic']:"";
            $insPic  =(isset($input['insPic']))?$input['insPic']:array() ;
            $objGetPattern = array(
                            'android'=>"/^androidScreenUpload_/",
                            'ios'=>"/^iosScreenUpload_/"
                            );
            $sreenShot = null;
            foreach ($objGetPattern as $deviceType => $regx) {
                $fileList = $this->getArrayByKeyRegex($regx, $input);
                foreach($fileList as $filesKey => $files) { 
                    foreach ($files as $file) {
                        $sreenShot[$deviceType]=$fileList;
                    }
                }
            }

            $delPicArr = explode(',',$delPic);
            foreach($delPicArr as $picId){
                $appPic = QP_App_Pic::find($picId);
                if(isset($appPic)){
                    $picName = $appPic->pic_url;
                    $langRowId = $appPic->lang_row_id;
                    $deviceType = explode('_',$appPic->pic_type)[0];
                    $screenshotFile = FilePath::getScreenShotUploadPath($appId,$langRowId,$deviceType).$picName;
                    if (file_exists($screenshotFile)){
                        unlink($screenshotFile);
                    }
                }
            }

            //2.Upload new svreenshot image file
            if(isset($sreenShot)){
                foreach ($sreenShot as $deviceType =>$languagePic) {
                    foreach ($languagePic as $langPic => $picArr) {
                        $langId = explode('_',$langPic)[1];  
                        foreach ( $picArr as  $pic) {
                            $picName = $pic->getClientOriginalName();
                            $screenshotUploadPath =  FilePath::getScreenShotUploadPath($appId,$langId,$deviceType);
                            $pic->move($screenshotUploadPath,$picName);
                        }
                    }
                }
            }

            //3.Modify database
            $deletePicRows = QP_App_Pic::where('app_row_id', $appId)
                    ->delete();
            $insertArray = array();
            $now = date('Y-m-d H:i:s',time());
            foreach ($insPic as $seq => $item) {
                $picItem = explode('-',$item);
                $data = array(
                        'app_row_id'=>$appId,
                        'lang_row_id'=>$picItem[0],
                        'pic_type'=>$picItem[1].'_screenshot',
                        'sequence_by_type'=>$seq+1,
                        'pic_url'=>$picItem[2],
                        'created_user'=>\Auth::user()->row_id,
                        'updated_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                        'updated_at'=>$now
                    );
                $insertArray[]=$data;
            }
            QP_App_Pic::insert($insertArray);
        
    }

    /**
     * To save  app name, app summary ,app description by language
     * @param  int      $appId          app unique id
     * @param  Array    $data           Form Data Array
     */
    private function saveAppMainInfo($appId, $data){

        //1.Create or Update the record
        $operateLanAry = [];
        $inputLanAry = [];
        foreach ($data as $key => $value) {
           $keyArr = explode('_',$key);
           $lanId = null;
           if(isset($keyArr[1])){
                $lanId = $keyArr[1];
                $inputLanAry[] = $lanId;
           }
           if(!in_array($lanId,$operateLanAry)){
                if(isset($lanId) && !in_array($lanId, $operateLanAry )){
                    $line = QP_App_Line::firstOrNew(['app_row_id'=>$appId,'lang_row_id'=>$lanId]);
                    $line->app_name =  $data['txbAppName_'. $lanId];
                    $line->app_summary =  $data['txbAppSummary_'. $lanId];
                    $line->app_description =  $data['txbAppDescription_'. $lanId];
                    if(!$line->exists) {
                        $line->created_user = \Auth::user()->row_id;
                    } 
                    $line->updated_user = \Auth::user()->row_id;
                    $line->save();
                    $operateLanAry[] = $lanId ;
                }
            }
        }

        //3. test if need delete or not
        $oriLangAry = QP_App_Line::where('app_row_id', $appId)
                 ->pluck('lang_row_id')->toArray();
        $diffLangAry = array_diff($oriLangAry,array_unique($inputLanAry));
        
        if(count($diffLangAry) > 0){
            //3.1 Find the defferent to delete
            $deletedRows = QP_App_Line::where('app_row_id',$appId)
                                        ->whereIn('lang_row_id',$diffLangAry)
                                        ->delete(); 
            //3.2 Delete screenshot use same langId
            $deletePicRows = QP_App_Pic::where('app_row_id', $appId)
                        ->whereIn('lang_row_id',$diffLangAry)
                        ->delete(); 
        }


    }

    /**
     * Test Error Code Exist, if exist return downloadUrl else return null
     * @param  int    $projectRowId project_row_id that blones
     * @param  int    $appRowId     app_row_id that blones
     * @return mixed                If exist return downloadUrl else return null
     */
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

    /**
     * Create nessary ManiFest Content form parameter for IOS ipa download
     * @param  int    $appRowId    qp_app_head.row_id
     * @param  string $appKey      qp_project.app_key
     * @param  string $deviceType  device type string ,ios|android
     * @param  string $versionCode cersion code
     * @param  string $fileName    ipa fileName 
     * @return string              manifest file content
     * @author Cleo.W.Chan
     */
    private function getManifest($appRowId, $appKey, $deviceType, $versionCode, $fileName){
    
        $MANIFEST_TEMPLETE_PATH = base_path('resources'. DIRECTORY_SEPARATOR .'templete'. DIRECTORY_SEPARATOR .'manifest.plist');
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

    /**
     * 取得App列表
     * (預設檢查權限，當沒有App管理權限者，僅能維護自己申請或為PM的App)
     * @param  Array $whereCondi  查詢條件清單array(array('field'=>'欄位',
     *                                                    'op'=>'比對方式(=|<>)',
     *                                                    'value'=>'比對值'
     *                                                    ))
     * @param  String $auth       是否檢查權限
     * @return json
     */
    private function getAppList($whereCondi=[],$auth=true){

        $appList = $this->appService->getAppList($whereCondi, $auth);
        return json_encode( $appList );
    }

    /**
     * Find array by key match the pattern
     * @param  String  $pattern The pattern to search for, as a string.
     * @param  Array  $input   The input array.
     * @param  integer $flags   If set to PREG_GREP_INVERT, this function returns the elements of the input array that do
     *                          not match the given pattern.
     * @return Array           Returns an array indexed using the keys from the input array.
     * @author Cleo.W.Chan
     */
    private function getArrayByKeyRegex( $pattern, $input, $flags = 0 )
    {
        $keys = preg_grep( $pattern, array_keys( $input ), $flags );
        $vals = array();
        foreach ( $keys as $key )
        {
            $vals[$key] = $input[$key];
        }
        return $vals;
    }

    /**
     * update qp_apphead by row_id 
     * @param  Int    $appId   app row_id
     * @param  Array  $dataArr update data
     * @return bool|int        If update success,return the record updated;if fail, return false
     */
    private function updateAppHeadById(Int $appId, Array $dataArr){
        return QP_App_Head::where('row_id', $appId)
                     ->update($dataArr);
    }

    /**
     * To save enable role by app role id 
     * @param  int $appId       qp_app.row_d
     * @param  Array $appRoleList enable role array list
     */
    private function saveAppRole($appId, Array $appRoleList){
            $deletedRows = QP_Role_App::where('app_row_id',$appId)
                                ->delete(); 
            $insertArray = array();
            $now = date('Y-m-d H:i:s',time());
            foreach ($appRoleList as $role) {
                $data = array(
                        'app_row_id'=>$appId,
                        'role_row_id'=>$role,
                        'created_user'=>\Auth::user()->row_id,
                        'updated_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                        'updated_at'=>$now
                    );
                $insertArray[]=$data;
            }
            QP_Role_App::insert($insertArray);
    }

    /**
     * To save enable user by app row id
     * @param  int $appId           qp_qpp.row_id
     * @param  Array $appUserList   enable user array list
     */
    private function saveAppUser($appId, Array $appUserList){
            $deletedRows = QP_User_App::where('app_row_id',$appId)
                                ->delete(); 
            $insertArray = array();
            $now = date('Y-m-d H:i:s',time());
            foreach ($appUserList as $role) {
                $data = array(
                        'app_row_id'=>$appId,
                        'user_row_id'=>$role,
                        'created_user'=>\Auth::user()->row_id,
                        'updated_user'=>\Auth::user()->row_id,
                        'created_at'=>$now,
                        'updated_at'=>$now
                    );
                $insertArray[]=$data;
            }
            QP_User_App::insert($insertArray);
    }

    /**
     * To Save Error By AppId,AppKey
     * @param  int          $appId         app_row_id
     * @param  String       $appKey        app_key
     * @param  FileObject   $errorCodeFile The file want to upload
     * 
     */
    private function saveErrorCode($appId, $appkey, $errorCodeFile){

        $ERROR_CODE_FILE_NAME =  'Error.json';
   
        $destinationPath   =  FilePath::getErrorCodeUploadPath($appId);

        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        $errorCodeFile->move($destinationPath,$ERROR_CODE_FILE_NAME);
        $errorCodeJson = file_get_contents(FilePath::getErrorCodeUploadPath($appId).$ERROR_CODE_FILE_NAME);
        $encoding = mb_detect_encoding($errorCodeJson, array('ASCII','EUC-CN','BIG-5','UTF-8'));
        if ($encoding != false) {
         $errorCodeJson = iconv($encoding, 'UTF-8', $errorCodeJson);
        } else {
         $errorCodeJson = mb_convert_encoding($errorCodeJson, 'UTF-8','Unicode');
        }
        $errorCodeArray = json_decode(CommonUtil::removeBOM($errorCodeJson));
        if(is_null($errorCodeArray)){
            return ['result_code'=>ResultCode::_999007_inputJsonFormatInvalid,
                    //'message'=>trans("messages.ERR_JSON_PARSING_ERROR")
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999007_inputJsonFormatInvalid)
                ];
        }
        if(!isset($errorCodeArray->error_list->appkey) || !isset($errorCodeArray->error_list->code_list)){
            return ['result_code'=>ResultCode::_999007_inputJsonFormatInvalid,
                    //'message'=>trans("messages.ERR_JSON_PARSING_ERROR")
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999007_inputJsonFormatInvalid)
                ];
        }
        if($errorCodeArray->error_list->appkey != $appkey){
              return ['result_code'=>ResultCode::_999010_appKeyIncorrect,
                        //'message'=>trans("messages.ERR_APP_KEY_INCORRECT_ERROR")
                        'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect)
                ];
        }
        $appProjectId = CommonUtil::getProjectIdByAppId($appId);
        $langList =  CommonUtil::getLangList();
        $now = date('Y-m-d H:i:s',time());
        $langMap = [];
        foreach ( $langList  as $langItem) {
            $langMap[$langItem->lang_code] = $langItem->row_id;
        }
        $insertArray = [];
        
        foreach ($errorCodeArray->error_list->code_list  as  $value) {
            foreach ($value->language_list as $langList) {
                $insertArray[] = array('project_row_id'=>  $appProjectId,
                                    'lang_row_id'=>$langMap[$langList->language],
                                    'error_code'=>$value->error_code,
                                    'error_desc'=>$langList->error_description,
                                    'created_at'=>$now,
                                    'created_user'=>\Auth::user()->row_id,
                                    'updated_at'=>$now
                                    );
            }
        }

       \DB::table("qp_error_code")
                -> where('project_row_id', '=', $appProjectId)
                -> delete();
       \DB::table("qp_error_code")->insert($insertArray);
          
       return ['result_code'=>ResultCode::_1_reponseSuccessful,];
    }

    /**
     * Delete Error Code by appId
     * @param  int $appId    qpp_row_id
     */
    private function deleteErrorCode($appId){

        $ERROR_CPDE_FILE_NAME =  'Error.json';
        $errorCodeFile = FilePath::getErrorCodeUploadPath($appId).$ERROR_CPDE_FILE_NAME;
        try {
            $appHead = \DB::table("qp_app_head")
                    -> where('row_id', '=', $appId)
                    -> select('project_row_id')
                    -> first();

            \DB::table("qp_error_code")
                        -> where('project_row_id', '=', $appHead->project_row_id)
                        -> delete();

            if (file_exists($errorCodeFile)){
                unlink($errorCodeFile);
            }
        } catch (\Exception $e) {
            throw new \Exception($e); 
        }
    }

    /**
     * To save CustomApi
     * @param  Int    $appkey        target app key
     * @param  Int    $appId         target app id
     * @param  Array  $customApiList custom api object array
     */
    private function saveCustomApi( String $appkey, Int $appId, Array $customApiList){

        $insertArray = [];
        $updateArray = [];
        $saveId = [];
        $now = date('Y-m-d H:i:s',time());
        foreach($customApiList as $customApi){
            $data = array(
                'app_row_id'=>$appId,
                'app_key'=>$appkey,
                'api_version'=>$customApi['api_version'],
                'api_action'=>$customApi['api_action'],
                'api_url'=>$customApi['api_url'],
                );
            if(isset($customApi['row_id'])){
                $data['row_id'] = $customApi['row_id'];
                $data['updated_user'] = \Auth::user()->row_id;
                $data['updated_at'] = $now;
                $updateArray[] = $data;
                $saveId[] = $customApi['row_id'];
            }else{   
                $data['created_user'] = \Auth::user()->row_id;
                $data['created_at'] = $now;
                $insertArray[] = $data;
            }
        }
        $deleteApiRows = QP_App_Custom_Api::where('app_row_id','=',$appId)
                            ->whereNotIn('row_id',$saveId)
                            ->delete();
        
        foreach($updateArray as $value){
            $updatedRow = QP_App_Custom_Api::find($value['row_id']);
            $updatedRow->api_version = $value['api_version'];
            $updatedRow->api_action = $value['api_action'];
            $updatedRow->api_url = $value['api_url'];
            $updatedRow->updated_user = $value['updated_user'];
            $updatedRow->save();
        }
        QP_App_Custom_Api::insert($insertArray);

    }

    /**
     * save App White List 
     * @param  Int    $appId     target app_row_id
     * @param  Array  $whiteList white list api object array
     */
    private function saveWhiteList(Int $appId, Array $whiteList){
        $insertArray = [];
        $updateArray = [];
        $saveId = [];
        $now = date('Y-m-d H:i:s',time());
        foreach($whiteList as $item){
            $data = array(
                'app_row_id'=>$appId,
                'allow_url'=>$item['allow_url']
                );
            if(isset($item['row_id'])){
                $data['row_id'] = $item['row_id'];
                $data['updated_user'] = \Auth::user()->row_id;
                $data['updated_at'] = $now;
                $updateArray[] = $data;
                $saveId[] = $item['row_id'];
            }else{   
                $data['created_user'] = \Auth::user()->row_id;
                $data['created_at'] = $now;
                $insertArray[] = $data;
            }
        }
        $deleteWhiteList = QP_White_List::where('app_row_id','=',$appId)
                            ->whereNotIn('row_id',$saveId)
                            ->where('deleted_at','=','0000-00-00')
                            ->update(['deleted_at' => $now,
                                    'updated_user' =>\Auth::user()->row_id]);

        foreach($updateArray as $value){
            $updatedRow = QP_White_List::find($value['row_id']);
            $updatedRow->allow_url = $value['allow_url'];
            $updatedRow->updated_user = $value['updated_user'];
            $updatedRow->save();
        }
        QP_White_List::insert($insertArray);
    }
}

?>