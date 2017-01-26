<?php
namespace App\Services;

use App\Repositories\AppRepository;

class AppService
{   

    protected $appRepository;

    public function __construct(AppRepository $appRepository)
    {
        $this->appRepository = $appRepository;
    }

    public function newApp($db, $projectId, $appKey, $createdAt, $createdUser){
        
        $appRowId = $this->appRepository->insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser);
        $this->appRepository->insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser);

    }
}