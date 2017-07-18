<?php
namespace App\Http\Controllers\ENSMaintain;

use App\Http\Controllers\Controller;
use App\Services\BasicInfoService;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;

class BasicInfoController extends Controller
{   
    protected $basicInfoService;

    /**
     * 建構子，初始化引入相關服務
     * @param BasicInfoService $basicInfoService 地點基本資訊服務
     */
    public function __construct(BasicInfoService $basicInfoService)
    {
        $this->basicInfoService = $basicInfoService;
    }

    public function getBasicInfo(){
       $input = Input::get();
       $appKey = CommonUtil::getContextAppKey(\Config('app.env'),$input['app_key']);
       return $this->basicInfoService->getBasicInfo($appKey);
    }
}