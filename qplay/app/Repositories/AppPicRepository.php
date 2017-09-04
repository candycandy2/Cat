<?php
/**
 * App 的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use DB;
use App\Model\QP_App_Pic;

class AppPicRepository
{
    
    protected $appPic;
    
    /*
     * AppRepository constructor.
     * @param QP_App_Line $appHead
     */
    public function __construct(QP_App_Pic $appPic)
    {     
        $this->appPic = $appPic;
    }

    /**
     * 根據pic row_id 取得資料
     * @param  int $picId qp_app_pic.row_id
     * @return mixed
     */
    public function getPicById($picId){
        return $this->appPic->find($picId);
    }

    /**
     * 刪除App所有圖片
     * @return boolean
     */
    public function delPicByAppId($appId){
         return $this->appPic->where('app_row_id', $appId)->delete();
    }

    /**
     * 寫入App Pic
     * @param  Array $insertDara 欲寫入DB的資料
     * @return boolean
     */
    public function insertPic($insertDara){
        return $this->appPic->insert($insertDara);
    }

    /**
     * 刪除app_pic下同語言所有資料
     * @param  int $appId   qp_app.row_id
     * @param  Array $langAry 欲刪除那些語言的資料
     * @return int 
     */
    public function delAllPicByLangId($appId, $langAry){
        return $this->appPic->where('app_row_id', $appId)
                        ->whereIn('lang_row_id',$langAry)
                        ->delete(); 
    }
} 