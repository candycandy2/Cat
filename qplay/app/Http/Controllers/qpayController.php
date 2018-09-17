<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
//use App\Services\QPayManagerService;
//use App\Services\QPayShopService;
use App\Services\QPayPointService;
//use App\Services\QPayMemberService;
//use App\Services\QPayTradeService;
//use App\Services\LogService;
use App\lib\ResultCode;
use DB;
use Validator;
use Auth;

class qpayController extends Controller
{

    //protected $qpayManagerService;
    //protected $qpayShopService;
    protected $qpayPointService;
    //protected $qpayMemberService;
    //protected $qpayTradeService;
    //protected $logService;

    /**
     * FunctionController constructor.
     * @param FunctionService $functionService
     * @param AppService      $appService
     */
    public function __construct(/*QPayManagerService $qpayManagerService,
                                QPayShopService $qpayShopService,*/
                                QPayPointService $qpayPointService/*,
                                QPayMemberService $qpayMemberService,
                                QPayTradeService $qpayTradeService,
                                LogService $logService*/)
    {
        //$this->qpayManagerService = $qpayManagerService;
        //$this->qpayShopService = $qpayShopService;
        $this->qpayPointService = $qpayPointService;
        //$this->qpayMemberService = $qpayMemberService;
        //$this->qpayTradeService = $qpayTradeService;
        //$this->logService = $logService;
    }

    /**
     * QPay Store Point - View
     * @return view
     */
    public function QPayStorePoint()
    {
        $pointTypeList =  $this->qpayPointService->getQPayPointTypeList();

        return view("qpay_maintain/point_store")->with('pointTypeList', $pointTypeList);
    }

    /**
     * QPay Store Point - upolad excel
     * @return excel data
     */
    public function uploadPointExcel(Request $request)
    {
        return $this->qpayPointService->uploadPointExcel($request);
    }

    /**
     * QPay Store Point - store point
     * @return result
     */
    public function newPointStore()
    {
        return $this->qpayPointService->newPointStore();
    }

}
