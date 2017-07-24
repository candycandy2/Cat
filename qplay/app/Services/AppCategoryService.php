<?php
/**
 * 處理App相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\AppCategoryRepository;

use \DB;

class AppCategoryService
{   

    protected $appCategoryRepository;

    public function __construct(AppCategoryRepository $appCategoryRepository)
    {
        $this->appCategoryRepository = $appCategoryRepository;
    }
    
    /**
    * 取得所有App分類
    * @return mixed
    */
    public function getCategoryList(){
        return $this->appCategoryRepository->getCategoryList();
    }

    /**
     * 新增App分類項目
     * @param  String $categoryName 分類名稱
     */
    public function newAppCategory($categoryName){
        $now = date('Y-m-d H:i:s',time());
        $this->appCategoryRepository->insCategoryApps([ 'app_category'=>$categoryName,
                                                'created_at'=>$now,
                                                'created_user'=>\Auth::user()->row_id]);
    }

    /**
     * 重新命名分類名稱
     * @param  int    $categoryId   qp_app_category.row_id
     * @param  String $categoryName 新分類名稱
     */
    public function renameCategoryById($categoryId, $categoryName){
        $now = date('Y-m-d H:i:s',time());
        $whereCondi = array(array('field'=>'row_id','op'=>'=','value'=> $categoryId));
        $this->appCategoryRepository
            ->updateCategoryApps( $whereCondi,[ 'app_category'=>$categoryName,
                            'updated_at'=>$now,
                            'updated_user'=>\Auth::user()->row_id]);
    }

    /**
     * 依類名稱查詢App分類
     * @return mixed
     */
    public function selAppCategoryByName($categoryName){
        $whereCondi = array(array('field' => 'app_category', 'op' => '=', 'value' => $categoryName));
        return $this->appCategoryRepository->selAppCategory($whereCondi);
    }

    /**
     * 刪除App類別項目
     * @param  int   $categoryId  ap_app_category.row_id
     */
    public function delAppCatecoryById($categoryId){
        $whereCondi = array(array('field' => 'row_id', 'op' => '=', 'value' => $categoryId));
        $this->appCategoryRepository->delCategory($whereCondi);
    }
}