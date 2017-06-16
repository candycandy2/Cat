<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Services\AppService;
use App\Services\ReportService;
use App\lib\CommonUtil;
use App\lib\FilePath;
use Illuminate\Support\Facades\Input;
use App\Model\MNG_Api_Log;
use Illuminate\Http\Request;

class ReportDetailController extends Controller
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

    public function getSummaryReport(){

    }
    
    public function getRegisterReport(){
        
    }
    
    public function getUserInfoReport(){
        
    }

    /**
     * Api報表詳細頁入口
     */
    public function getApiReport(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        CommonUtil::setLanguage();
        
        $input = Input::get();
        $appId = $input['app_row_id'];
        $appInfo = $this->appService->getAppBasicIfnoByAppId($appId);
        $data = [];
        $data['app_row_id'] =   $appId;
        $data['app_name'] =  $appInfo->app_name;
        $data['icon_url'] =  ($appInfo->icon_url == "")?"":FilePath::getIconUrl($appId, $appInfo->icon_url);
        $data['app_key'] =  $appInfo->app_key;
        $endDate = $this->reportService->getApiLogEndDate($appInfo->app_key);
        $data['reportEndDate'] = (is_null($endDate))?"":$endDate->format('Y-m-d');
       
        return view("report/report_detail")->with('data',$data);

    }
    
    /**
     * 取得呼叫API人數與次數資料
     * @return json
     */
    public function getCallApiReport(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appKey = $jsonContent['app_key'];
            $result = $this->reportService->getApiReport($appKey);
            return json_encode($result);
        }
        
    }

    /**
     * 取得API執行時間資料
     * @return json
     */
    public function getApiOperationTimeReport(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appKey = $jsonContent['app_key'];
            $result = $this->reportService->getApiOperationTimeReport($appKey);
            return json_encode($result);
        }
    }

    /**
     * 取得API執行時間該日期每小時資料
     * @return json
     */
    public function getApiOperationTimeDetailReport(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appKey = $jsonContent['app_key'];
            $date = $jsonContent['date'];
            $actionName = $jsonContent['action'];
            $result = $this->reportService->getApiOperationTimeDetailReport($appKey, $date, $actionName);
            return json_encode($result);
        }
    }
}