<?php
namespace App\Services;

use App\Repositories\ProjectRepository;

class ProjectService
{
    protected $projectRepository;

    public function __construct(ProjectRepository $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    /**
     * 依據app key 取得app基本資訊
     * @param  string $appKey qp_project.app_key
     * @return mixed
     */
    public function getAppInfoByAppKey($appKey){
        return $this->projectRepository->getAppInfoByAppKey($appKey);
    }
}