<?php
/**
 * App Category的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_App_Category;
use DB;
use App\lib\CommonUtil;

class AppCategoryRepository
{   
    protected $appCategory;

     /*
     * AppCategoryRepository constructor.
     * @param QP_App_Category $appCategory
     */
    public function __construct(QP_App_Category $appCategory)
    {     
        $this->appCategory = $appCategory;
    }

    /**
     * 取得所有App分類
     * @return mixed
     */
    public function getCategoryList(){
        return  $this->appCategory
            -> select('row_id', 'app_category')
            -> orderBy('app_category')
            -> get();

    }

    /**
     * 依條件取得App分類資料
     * @param  Array|array $whereCondi [
     *                                     field=>'找查欄位',
     *                                     op=>'條件式',
     *                                     value=>'值',
     *                                  ]
     * @return mixed
     */
    public function selAppCategory(Array $whereCondi){
       $query = $this->appCategory;
            foreach ($whereCondi as $condi) {
               $query = $query->where( $condi['field'], $condi['op'], $condi['value']);
            }
       $res = $query->select('row_id', 'app_category')->get();
        return  $res;
    }

    /**
     * 寫入App類別表
     * @param  Array  $data 遇新增資料
     * 
     */
    public function insCategoryApps(Array $data){
        $this->appCategory
             -> insert($data);
    }


    /**
     * 依條件更新分類中App
     * @param  Array|array $whereCondi [
     *                                     field=>'找查欄位',
     *                                     op=>'條件式',
     *                                     value=>'值',
     *                                  ]
     * @param  Array       $data       更新資料
     */
    public function updateCategoryApps(Array $whereCondi=[], Array $data){
        $query = $this->appCategory;
            foreach ($whereCondi as $condi) {
               $query = $query->where( $condi['field'],$condi['op'],$condi['value']);
            }
           $query->update($data);
    }

    /**
     * 依條件刪除分類項目
     * @param  Array|array $whereCondi [
     *                                     field=>'找查欄位',
     *                                     op=>'條件式',
     *                                     value=>'值',
     *                                  ]
     * 
     */
    public function delCategory(Array $whereCondi=[]){
        $query = $this->appCategory;
        foreach ($whereCondi as $condi) {
            $query = $query->where( $condi['field'],$condi['op'],$condi['value']);
        }
        $query->delete();
    }


}