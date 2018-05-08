<?php

namespace App\Repositories;

use App\Model\QP_App_Evaluation;
use DB;
class AppEvaluationRepository
{

    protected $appEvaluation;

    public function __construct(QP_App_Evaluation $appEvaluation)
    {   
        $this->appEvaluation = $appEvaluation;
    }

    /**
     * 更新或建立App評分、評論
     * @param  Array  $data 寫入資料
     * @return int
     */
    public function upsertAppEvaluation($appId, $deviceType, $versionCode, $score, $comment, $userId){
        
        $now = date('Y-m-d H:i:s',time());
        
        $evaulation = $this->getAppEvaluationByUserId($appId, $userId);
        
        if(is_null($evaulation)){
            $evaulation = new QP_App_Evaluation;
            $evaulation->user_row_id = $userId;
            $evaulation->app_row_id = $appId;
            $evaulation->created_user = $userId;
            $evaulation->created_at = $now;
        }else{
            $evaulation->updated_user = $userId;
        }

        if(!is_null($score)){
            $evaulation->score = $score;
        }
        if(!is_null($comment)){
            $evaulation->comment_user = $comment;
        }
        $evaulation->device_type = $deviceType;
        $evaulation->comment_user_time = time();
        $evaulation->version_code = $versionCode;
        $evaulation->save();

        return $evaulation->row_id;
    }

    /**
     * 取得特定使用者對app的評論
     * @param  int $appId     qp_app_head.row_id
     * @param  int $userId    qp_user.row_id
     * @return mixed
     */
    public function getAppEvaluationByUserId($appId, $userId){
        return $this->appEvaluation->where('app_row_id', $appId)
                                   ->where('user_row_id', $userId)
                                   ->select()->first();
    }

}
