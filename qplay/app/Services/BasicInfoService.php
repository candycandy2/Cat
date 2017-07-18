<?php
/**
 * 地點(location)-分類(function)相關商業邏輯處理
 * @author Cleo.W.Chan
 */
namespace App\Services;

use App\Repositories\BasicInfoRepository;

class BasicInfoService
{   

    protected $basicInfoRepository;

    public function __construct(BasicInfoRepository $basicInfoRepository)
    {
        $this->basicInfoRepository = $basicInfoRepository;
    }

    /**
     * 取得location-function及所屬成員
     * @param  String    appKey
     * @return Array    成員分類列表
     */
    public function getBasicInfo($appKey){

        return $this->basicInfoRepository->getAllBasicInfoRawData($appKey);
    }
}