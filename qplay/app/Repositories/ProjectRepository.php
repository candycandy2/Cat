<?php
namespace App\Repositories;

use DB;
use App\lib\CommonUtil;

class ProjectRepository
{
    

    public function insertProject($db, $appKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt){
        $secretKey = hash('md5', CommonUtil::generateRandomString());
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

} 