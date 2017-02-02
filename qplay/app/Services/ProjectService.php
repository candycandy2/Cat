<?php
/**
 * 處理Project相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\ProjectRepository;
use App\Repositories\AppRepository;


class ProjectService
{   

    protected $projectRepository;
    protected $appRepository;

    public function __construct(ProjectRepository $projectRepository, AppRepository $appRepository)
    {
        $this->projectRepository = $projectRepository;
        $this->appRepository = $appRepository;
    }

    /**
     * 新增專案
     * @param  String $db                 datasource
     * @param  String $appKey             app_key
     * @param  String $projectCode        專案代碼(三位數代碼 ex: 000,001,002)
     * @param  String $projectDescription 專案描述
     * @param  String $projectPm          專案PM
     * @param  Strgin $createdUser        創建者
     * @param  Strgin $createdAt          創建時間
     * @return Int                        新增的project_row_id
     */
    public function newProject($db, $appKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt){

        $projectId = $this->projectRepository->insertProject($db, $appKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt);
        $appRowId = $this->appRepository->insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser);
        $this->appRepository->insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser);
        return $projectId;
    }

    /**
     * 更新專案
     * @param  String $db                 datasource
     * @param  String $projectCode        專案代碼(三位數代碼 ex: 000,001,002)
     * @param  String $projectDescription 專案描述
     * @param  String $projectMemo        專案Memo
     * @param  String $projectPm          專案PM
     * @param  Strgin $createdUser        創建者
     * @param  Strgin $createdAt          創建時間
     */
    public function updateProject($db, $projectCode, $projectDescription, $projectMemo, $projectPm, $updatedUser, $updatedAt){
        $this->projectRepository->updateProject($db, $projectCode, $projectDescription, $projectMemo, $projectPm, $updatedUser, $updatedAt);
    }

    /**
     * 取得專案代碼
     * @param  String $db datasource
     * @return String     不重複專案代碼(三位數代碼 ex: 000,001,002)
     */
    public function getProjectCode($db){
        $newProjectCode = 0;
        $maxProjectCode = $db->table("qp_project")->max('project_code');
        if(!is_null($maxProjectCode)){
            $newProjectCode = (int)$maxProjectCode + 1;
        }
        return trim(sprintf("%'.03d\n", $newProjectCode));
    }

}