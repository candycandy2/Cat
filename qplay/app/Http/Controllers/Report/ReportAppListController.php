<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Services\AppService;
use App\Services\ReportService;


class ReportAppListController extends Controller
{

    protected $appService;
    protected $reportService;
    /**
     * 建構子，初始化引入相關服務
     * @param AppService $appService app相關資訊服務
     * @param ReportService $ReportService 統計報表相關資訊服務
     */
    public function __construct(AppService $appService, ReportService $reportService)
    {
        $this->appService = $appService;
        $this->reportService = $reportService;
    }

    /**
     * 取得報表App列表
     * @return json
     */
    public function getReportAppList(){
        $whereCondi = [];
        $orderCondi = array(array('field'=>'project_code','seq'=>'asc'));
        $reportAppList = $this->appService->getAppList($whereCondi, $orderCondi);
        foreach ($reportAppList as $index=>&$app) {
            $app['register_rate'] = $this->reportService->getRegisterRate();
        }
        return json_encode( $reportAppList );
    }

}