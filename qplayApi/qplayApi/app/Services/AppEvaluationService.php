<?php
namespace App\Services;

use App\Repositories\AppEvaluationRepository;

class AppEvaluationService
{
    protected $appEvaluationRepository;

    public function __construct(AppEvaluationRepository $appEvaluationRepository)
    {
        $this->appEvaluationRepository = $appEvaluationRepository;
    }

    /**
     * 更新或修改評論
     * @param  int $appId       APP id，qp_app.row_id
     * @param  string $deviceType  裝置類型(ios|android)
     * @param  int $versionCode 目前上架中版本
     * @param  int $score       評分
     * @param  string $comment  評論內容
     * @param  int $userId      使用者id，qp_user.row_id
     * @return int              新增的qp_evaulation.row_id或是更新的qp_evaulation.row_id
     */
    public function upsertAppEvaluation($appId, $deviceType, $versionCode, $score, $comment, $userId){
        return $evaulationId = $this->appEvaluationRepository->upsertAppEvaluation($appId, $deviceType, $versionCode, $score, $comment, $userId);
    }
}