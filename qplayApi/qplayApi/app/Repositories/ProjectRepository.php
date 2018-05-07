<?php

namespace App\Repositories;

use App\Model\QP_Project;

class ProjectRepository
{

    protected $project;

    public function __construct(QP_Project $project)
    {   
        $this->project = $project;
    }

    /**
     * 依據app key 取得app基本資訊
     * @param  string $appKey qp_project.app_key
     * @return mixed
     */
    public function getAppInfoByAppKey($appKey){
        return $this->project
             ->where('qp_project.app_key',$appKey)
             ->join('qp_app_head', 'qp_app_head.project_row_id', '=', 'qp_project.row_id')
             ->select('qp_project.row_id as project_id', 'project_code',
                     'secret_key', 'project_description', 'project_memo', 'project_pm',
                     'qp_app_head.row_id as app_id', 'package_name'
                    )
             ->first();
    }

}
