<?php
/**
 * App 的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use DB;
use App\Model\QP_App_Head;
use App\Model\QP_App_Line;

class AppRepository
{
    
    /** @var User Inject QP_App_Head model */
    protected $appHead;

    /** @var User Inject QP_App_Line model */
    protected $appLine;
    
    /*
     * AppRepository constructor.
     * @param QP_App_Head $appHead
     */
    public function __construct(QP_App_Head $appHead, QP_App_Line $appLine)
    {     
        $this->appHead = $appHead;
        $this->appLine = $appLine;
    }

    /**
     * 寫入qp_app_head 資料表
     * @param  String $db          datasource
     * @param  String $projectId   qp_project.row_id
     * @param  String $appKey      appKey
     * @param  String $createdAt   創建時間
     * @param  String $createdUser 創建人
     * @return Int                 新增資料的row_id
     */
    public function insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser){

         $newAppRowId = \DB::connection($db)->table("qp_app_head")
            -> insertGetId(
                [   'project_row_id'=> $projectId,
                    'package_name'=>\Config::get('app.app_package').'.'.$appKey,
                    'default_lang_row_id'=>3,
                    'icon_url'=>'',
                    'security_level'=>3,
                    'created_at'=>$createdAt,
                    'created_user'=>$createdUser]);
        return $newAppRowId;
    }

    /**
     * 寫入qp_app_lint資料表
     * @param  String $db          datasource
     * @param  Int    $appRowId    qp_app_head.row_id
     * @param  String $appKey      app_key
     * @param  String $createdAt   創建時間
     * @param  String $createdUser 創建人
     */
    public function insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser){
        \DB::connection($db)->table("qp_app_line")
            -> insert(
                [   'app_row_id'=> $appRowId,
                    'lang_row_id'=>3,
                    'app_name'=>$appKey,
                    'app_summary'=>'',
                    'app_description'=>'',
                    'created_at'=>$createdAt,
                    'created_user'=>$createdUser]);
    }


    /**
     * 用appKey取得App資訊
     * @param  String $appKey appKey
     * @return mixed          取得資料回傳Data Object,若查無資料則回傳null
     */
    public function getAppInfoByAppKey($appKey)
    {
        $appInfo = $this->appHead
            -> join('qp_project','qp_project.row_id','=','qp_app_head.project_row_id')
            -> where('qp_project.app_key', '=', $appKey)
            -> select('qp_app_head.row_id')
            -> first();
    
        return $appInfo;
    }

     /**
     * 依據qp_app_head.row_id更新事件資料
     * @param  int    $appId      qp_app_head.row_id
     * @param  Array  $updateData 欲更新的資料
     * @return mixed
     */
    public function updateAppInfoById($appId, Array $updateData){
        $appInfo =  $this->appHead::where('row_id',$appId)->update($updateData);
        return $appInfo;
    }
} 