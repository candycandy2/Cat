<?php
/**
 * App 的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use DB;
use App\Model\QP_App_Line;

class AppLineRepository
{
    
    protected $appLine;
    
    /*
     * AppRepository constructor.
     * @param QP_App_Line $appHead
     */
    public function __construct(QP_App_Line $appLine)
    {     
        $this->appLine = $appLine;
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
        $this->appLine
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
     * 取得AppLine資訊
     * @return mixed
     */
    public function getAppLineInfo($appId, Array $select, $whereCondi=[]){
       $query =  $this->appLine
            ->where('app_row_id','=',$appId);
            foreach ($whereCondi as $condi) {
              $query ->where( $condi['field'], $condi['op'],  $condi['value']);
            }
             $query ->select($select);
        $appLineInfo =  $query ->first();
        return $appLineInfo;
    }
} 