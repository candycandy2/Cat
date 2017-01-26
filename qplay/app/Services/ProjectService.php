<?php
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

    public function newProject($db, $appKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt){

        $projectId = $this->projectRepository->insertProject($db, $appKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt);
        $appRowId = $this->appRepository->insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser);
        $this->appRepository->insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser);
        return $projectId;
    }

    public function getProjectCode($db){
        $newProjectCode = 0;
        $maxProjectCode = $db->table("qp_project")->max('project_code');
        if(!is_null($maxProjectCode)){
            $newProjectCode = (int)$maxProjectCode + 1;
        }
        return trim(sprintf("%'.03d\n", $newProjectCode));
    }

}