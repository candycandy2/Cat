<?php
namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\Services\AppService;
use App\Services\AppCategoryService;
use DB;

class AppCategoryController extends Controller
{

    protected $appService;

     /**
     * 建構子，初始化引入相關服務
     * @param AppService $appService
     * @param AppCategoryService $appCategoryService
     */
    public function __construct(AppService $appService, AppCategoryService $appCategoryService)
    {
        $this->appService = $appService;
        $this->appCategoryService = $appCategoryService;
    }

    /**
     * 取得分類下所有app列表
     * @return json
     */
    public function getCategoryList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $appCategoryList =  $this->appCategoryService->getCategoryList();
        foreach ($appCategoryList as $category) {
            $whereCondi = array(array('field'=>'app_category_row_id','op'=>'=','value'=>$category->row_id));
            $appList = $this->appService->getAppList($whereCondi);
            $category->app_count = count($appList);
        }
         return response()->json($appCategoryList);
    }

    /**
     * 新增或更新分類項目
     * @return json
     */
    public function saveCategory(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $categoryName = $jsonContent['categoryName'];
            $categoryId = $jsonContent['categoryId'];
            
            $isNew = $jsonContent['isNew'];
            if($isNew == 'Y') {
                $res = $this->appCategoryService->selAppCategoryByName($categoryName);
                if(count($res) > 0) {
                    return response()->json(['result_code'=>ResultCode::_000918_AppCategoryNameExist,]);
                }
                $this->appCategoryService->newAppCategory($categoryName);
            } else {
                $this->appCategoryService->renameCategoryById($categoryId, $categoryName);
            }

            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    /**
     * 刪除分類項目
     */
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
            foreach ($categoryIdList as $categoryId) {
                $this->appCategoryService->delAppCatecoryById($categoryId);
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }

    /**
     * 取得分類下所有App列表
     * @return Array
     */
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
        $categoryAppsList = $this->appService->getAppList($whereCondi);
        return $categoryAppsList;
    }

    /**
     * 取得不再此分類的App
     * @return Array
     */
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
        $otherAppsList =  $this->appService->getAppList($whereCondi);
        return $otherAppsList;
    }

    /**
     * 將App存入分類
     * @return json
     */
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
            foreach ($appIdList as $id => $sequence) {
                $this->appService->updateAppInfoById( $id,
                                                ['app_category_row_id'=>$categoryId,
                                                'sequence'=>$sequence,
                                                'updated_at'=>$now,
                                                'updated_user'=>\Auth::user()->row_id]
                                                );
            }
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,]);
        }

        return null;
    }
}