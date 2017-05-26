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
     * Api報表入口
     */
    public function getApiReport(){
        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $input = Input::get();
        $appId = $input['app_row_id'];
        $appInfo = $this->appService->getAppBasicIfnoByAppId($appId);
        $data = [];
         $data['app_row_id'] =   $appId;
        $data['app_name'] =  $appInfo->app_name;
        $data['icon_url'] =  ($appInfo->icon_url == "")?"":FilePath::getIconUrl($appId, $appInfo->icon_url);
        $data['app_key'] =  $appInfo->app_key;
       // $data['api_report'] = $this->reportService->getApiReport($appKey)->toArray;
        return view("report/report_detail")->with('data',$data);
       //return json_encode($data);
    }

    public function getCallApiReport(){
        // if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        // {
        //     return null;
        // }
        
        // CommonUtil::setLanguage();
        // 
        // 
        
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);

        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $appKey = $jsonContent['app_key'];

            // $input = Input::get();
        //$appKey = $input['app_key'];
       // $appKey = 'appqplaydev';

        // $cursor = $this->reportService->getApiReport($appKey);
        // return json_encode($cursor->toArray());
        // json_encode($result, JSON_PRETTY_PRINT);
        $retArr = [];
            $res = '[
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTT","department":"BI30"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTT","department":"BI40"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTT","department":"BI50"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTT","department":"BI60"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTT","department":"BI70"},"totalCount":2,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTT","department":"BI80"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTA","department":"BI80"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QTA","department":"BI80"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getAppList","company_site":"BenQ_QQQQ","department":"BI80"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getUser","company_site":"BenQ_QTC","department":"BI80"},"totalCount":20,"distinctCount":1},
                        {"_id":{"action":"getSecurityList","company_site":"BenQ_QTA","department":"BI80"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getSecurityList","company_site":"BenQ_QTB","department":"BI80"},"totalCount":1,"distinctCount":1},
                         {"_id":{"action":"getSecurityList","company_site":"BenQ_QTAss","department":"BI80"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getSecurityList","company_site":"BenQ_QTBaa","department":"BI80"},"totalCount":1,"distinctCount":1},
                        {"_id":{"action":"getSecurityList","company_site":"BenQ_QTC","department":"BI80"},"totalCount":1,"distinctCount":1},
                         {"_id":{"action":"isRegister","company_site":"Qisda_QTT","department":"BI10"},"totalCount":10,"distinctCount":5}
                    ]';
            $res = json_decode($res);
            foreach ($res as $key => $value) {
                if(!isset($retArr[$value->_id->action])){
                    $retArr[$value->_id->action]=array();
                    if(!isset( $retArr[$value->_id->action][$value->_id->company_site])){
                        $retArr[$value->_id->action][$value->_id->company_site]=array();
                        if(!isset($retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount'])){
                            $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount']=array();
                        }
                        if(!isset($retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount'])){
                            $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount']=array();
                        }
                    }
                }
                $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['totalCount'][]=$value->totalCount;
                 $retArr[$value->_id->action][$value->_id->company_site][$value->_id->department]['distinctCount'][]=$value->distinctCount;
            }
            return json_encode($retArr);
        }
    
    }
}