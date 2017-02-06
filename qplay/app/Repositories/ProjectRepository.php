<?php
/**
 * Project 的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use DB;
use App\lib\CommonUtil;

class ProjectRepository
{
    
    /**
     * 寫入qplay 專案表 qp_project
     * @param  String $db                 datasource
     * @param  String $appKey             appKey
     * @param  String $secretKey          secretKey 0-9A-za-z 32位元亂數
     * @param  String $projectCode        專案代碼
     * @param  String $projectDescription 專案描述
     * @param  String $projectPm          專案PM
     * @param  Strgin $createdUser        創建者
     * @param  Strgin $createdAt          創建時間
     * @return int                        the app_row_id that you inserted
     */
    public function insertProject($db, $appKey, $secretKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt){
        
        $newProjectId = \DB::connection($db)->table("qp_project")
        -> insertGetId([
            'project_code'=>$projectCode,
            'secret_key'=>$secretKey,
            'app_key' => $appKey,
            'project_description' => $projectDescription,
            'project_pm' => $projectPm,
            'created_user'=>$createdUser,
            'created_at'=>$createdAt,
        ]);
        return $newProjectId;
    }

    /**
     * 更新qplay 專案表 qp_project
     * @param  String $db                 datasource
     * @param  String $projectCode        專案代碼
     * @param  String $projectDescription 專案描述
     * @param  String $projectPm          專案PM
     * @param  String $updatedUser        更新者
     * @param  String $updatedAt          更新時間
     */
    public function updateProject($db, $projectCode, $projectDescription, $projectMemo, $projectPm, $updatedUser, $updatedAt){
        \DB::connection($db)->table("qp_project")
        ->where("project_code", "=", $projectCode)
        -> update([
            'project_description' => $projectDescription,
            'project_memo' => $projectMemo,
            'project_pm' => $projectPm,
            'updated_user'=>$updatedUser,
            'updated_at'=>$updatedAt,
        ]);
    }

    /**
     * 用appKey取得專案資訊
     * @param  String $appKey appKey
     * @return mixed          取得資料回傳Data Object,若查無資料則回傳null
     */
    public static function getProjectInfoByAppKey($appKey)
    {
        $projectList = \DB::table('qp_project')
            -> where('app_key', '=', $appKey)
            -> select('row_id',
                    'secret_key',
                    'project_code',
                    'project_pm',
                    'project_memo',
                    'project_description')->get();
        if(count($projectList) < 1) {
            return null;
        }

        return $projectList[0];
    }
} 