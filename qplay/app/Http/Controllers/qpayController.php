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

    /**
     * QPay Store Record - View
     * @return view
     */
    public function QPayStoreRecord(){
        return view("qpay_maintain/store_record");
    }

    /**
     * QPay Store Record - get store record list
     * @return result
    */
    public function getQPayStoreRecordList(Request $request){

        return $this->qpayPointService->getQPayStoreRecordList($request->startDate, $request->endDate);
    
    }

    /**
     * Download point store excel by qp_point_store.row_id 
     * @param  Request $request 
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function downloadPointExcel(Request $request){

        return $this->qpayPointService->getDownloadPointExcel($request->point_saved_id);
    
    }

    /**
     * QPay Store Employee - view
     * 
     */
    public function QPayStoreEmployee(){
        
        //get all departments
        $departments = Auth::user()->getAllDepartment();

        //get point type list
        $pointTypeList =  $this->qpayPointService->getQPayPointTypeList();

        return view("qpay_maintain/point_get_record")->with(['pointTypeList'=>$pointTypeList,
                                                            'departments'=>$departments]);
    
    }

    /**
     * QPay Get Stored Recored each Employee
     * @param  Request $request 
     * @return json
     */
    public function getQPayPointGetRecordList(Request $request){
        
        $pointType = ($request->pointType == "")?null:$request->pointType;
        $startDate = $request->startDate;
        $endDate = $request->endDate;
        $department = ($request->department == "")?null:$request->department;
        $empNo = (trim($request->empNo) == "")?null:trim($request->empNo);
        $limit = (trim($request->limit) == "")?null:trim($request->limit);
        $offset = (trim($request->offset) == "")?null:trim($request->offset);
        $sort = (trim($request->sort) == "")?null:trim($request->sort);
        $order = (trim($request->order) == "")?null:trim($request->order);

       $pointGetRecord =  $this->qpayPointService->getQPayPointGetRecordList($pointType, $startDate, $endDate, $department, $empNo, $limit, $offset, $sort, $order);
       return response()->json(["total"=>$pointGetRecord->total(),"rows"=>$pointGetRecord->items()]);
    
    }

}
