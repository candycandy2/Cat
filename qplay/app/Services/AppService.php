<?php
/**
 * 處理App相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\AppRepository;

class AppService
{   

    protected $appRepository;

    public function __construct(AppRepository $appRepository)
    {
        $this->appRepository = $appRepository;
    }

    /**
     * 新增App
     * @param  String $db          datasource
     * @param  int $projectId      qp_project.row_id
     * @param  String $appKey      app_key
     * @param  Strgin $createdUser 創建者
     * @param  Strgin $createdAt   創建時間
     * @return Int                 新建立的app_row_id
     */
    public function newApp($db, $projectId, $appKey, $createdAt, $createdUser){
        
        $appRowId = $this->appRepository->insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser);
        $this->appRepository->insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser);
        return $appRowId;
    }

    /**
     * 使用appKey 取得App資訊
     * @param  String $appKey app key
     * @return mixed  
     */
    public function getAppInfoByAppKey($appKey){
        $appInfo = $this->appRepository->getAppInfoByAppKey($appKey);
        return $appInfo;
    }
}