<?php
namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use DB;

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
        $categoryId = $input["category_id"];
        
        $categoryAppsList = \DB::table("qp_app_head as h")
        -> join('qp_app_line as l','h.row_id', '=', 'l.app_row_id')
        -> where('h.app_category_row_id', '=', $categoryId)
        -> where('l.lang_row_id', '=', \DB::raw('h.default_lang_row_id'))
        -> select('h.row_id','h.package_name','h.icon_url','l.app_name',\DB::raw('DATE_FORMAT(l.updated_at , \'%Y-%m-%d\') as updated_at'))
        -> get();

        foreach ($categoryAppsList as $app) {
            $ready_count = \DB::table('qp_app_version')
                ->where('app_row_id', '=', $app->row_id)
                ->where('status', '=', 'ready')
                ->count();
            $app->released = ($ready_count > 0)?'Y':'N';
        }
        return response()->json($categoryAppsList);
    }


    public function getOtherAppList(){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        
        $input = Input::get();
        $categoryId = $input["category_id"];

        $otherAppsList = \DB::table("qp_app_head as h")
        -> join('qp_app_line as l','h.row_id', '=', 'l.app_row_id')
        -> where('h.app_category_row_id', '<>', $categoryId)
        -> where('l.lang_row_id', '=', \DB::raw('h.default_lang_row_id'))
         -> select('h.row_id','h.package_name','h.icon_url','l.app_name',\DB::raw('DATE_FORMAT(l.updated_at , \'%Y-%m-%d\') as updated_at'))
        -> get();

        foreach ($otherAppsList as $app) {
            $ready_count = \DB::table('qp_app_version')
                ->where('app_row_id', '=', $app->row_id)
                ->where('status', '=', 'ready')
                ->count();
            $app->released = ($ready_count > 0)?'Y':'N';
        }

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
            $categoryIdId = $jsonContent['category_id'];
            $appIdList = $jsonContent['app_id_list'];
            \DB::beginTransaction();
            \DB::table("qp_app_head")
                    -> where('app_category_row_id', "=", $categoryIdId)
                    -> update(
                        ['app_category_row_id'=>0,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
            foreach ($appIdList as $aId) {
               \DB::table("qp_app_head")
                    -> where('row_id', '=', $aId)
                    -> update(
                        ['app_category_row_id'=>$categoryIdId,
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
}

?>