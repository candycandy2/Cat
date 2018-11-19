<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
//use App\Services\QPayManagerService;
use App\Services\QPayShopService;
use App\Services\QPayPointService;
use App\Services\QPayMemberService;
use App\Services\QPayTradeService;
use App\Services\LogService;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use DB;
use Validator;
use Auth;


class qpayController extends Controller
{

    //protected $qpayManagerService;
    protected $qpayShopService;
    protected $qpayPointService;
    protected $qpayMemberService;
    protected $qpayTradeService;
    protected $logService;

    /**
     * FunctionController constructor.
     * @param QPayPointService $qpayPointService
     * @param QPayTradeService      $qpayTradeService
     * @param QPayMemberService      $qpayMemberService
     */
    public function __construct(QPayPointService $qpayPointService,
                                QPayTradeService $qpayTradeService,
                                QPayMemberService $qpayMemberService,
                                QPayShopService $qpayShopService,
                                LogService $logService
                                /*QPayManagerService $qpayManagerService,
                                QPayMemberService $qpayMemberService*/)
    {
        //$this->qpayManagerService = $qpayManagerService;
        //$this->qpayShopService = $qpayShopService;
        $this->qpayPointService = $qpayPointService;
        $this->qpayMemberService = $qpayMemberService;
        $this->qpayTradeService = $qpayTradeService;
        $this->qpayShopService = $qpayShopService;
        $this->logService = $logService;
    }

    /**
     * QPay Store Point - View
     * @return view
     */
    public function QPayStorePoint()
    {
        $pointTypeList =  $this->qpayPointService->getQPayPointTypeList();

        return view("qpay_maintain/qpay_store_maintain/point_store")->with('pointTypeList', $pointTypeList);
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
        return view("qpay_maintain/qpay_store_maintain/store_record");
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

        return view("qpay_maintain/qpay_store_maintain/point_get_record")->with(['pointTypeList'=>$pointTypeList,
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

    /**
     * QPay Reimburse Purchase - view
     * @param  Request $request
     * @return view
     */
    public function QPayReimbursePurchase(){

        return view("qpay_maintain/qpay_reimburse_maintain/reimburse_purchase");

    }

    /**
     * Get Reimburse Purchase
     * @param  Request $request
     * @return json
     */
    public function getQPayReimbursePurchaseList(Request $request){
        
        $startDate = $request->startDate;
        $endDate = $request->endDate;
        $empNo = (trim($request->empNo) == "")?null:trim($request->empNo);
        
        //1. get user info
        $userInfo = CommonUtil::getUserInfoJustByUserEmpNo($empNo);

        if(is_null($userInfo)){
           return response()->json(["purchaseList"=>[],"userInfo"=>null]);
        }
        //2. get point now
        $pointNow = $this->qpayMemberService->getPointNow($userInfo->row_id);
        //3. get trade record
        $purchaseList = $this->qpayTradeService->getQPayReimbursePurchaseList($userInfo->row_id, $startDate, $endDate);

        return response()->json(["purchaseList"=>$purchaseList,
                                 "userInfo"=>$userInfo,
                                 "pointNow"=>$pointNow]);
    }

    /**
     * QPay Point Type List - view
     */
    public function QPayUserPointType(){            
        return view("qpay_maintain/qpay_user_maintain/point_type");
    }

    /**
     * Get QPay User Point Type List
     * @param  Request $request
     * @return mixed
     */
    public function getQPayUserPointTypeList(Request $request){
        return $this->qpayPointService->getQPayUserPointTypeList();
    }

    /**
     * Add New Point Type
     * @param  Request $request
     * @return json
     */
    public function newPointType(Request $request){
        $name =  (trim($request->name) == "")?null:trim($request->name);
        $color = $request->color;
        $insertRs = $this->qpayPointService->newPointType($name, $color);

        if ($insertRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);
    }

    /**
     * Edit Point Type
     * @param  Request $request
     * @return json
     */
    public function editPointType(Request $request){

        $rowId = $request->rowId;
        $color = $request->color;
        $status = $request->status;
        $name =  (trim($request->name) == "")?null:trim($request->name);
        
        $updateRs = $this->qpayPointService->editPointType($rowId, $name, $color, $status);
        
        if ($updateRs == 1) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }
        return json_encode($result);
        
    }

    /**
     * QPay shop list - view
     */
    public function QPayUserShop(){
        return view("qpay_maintain/qpay_user_maintain/shop");
    }

    /**
     * Get enable QPay shop list
     * @return array
     */
    public function getQPayShopList(){
        return $this->qpayShopService->getQPayShopList();
    }

    /**
     * Add a new QPay shop
     * @param  Request $request
     * @return json
     */
    public function newQPayShop(Request $request){
        
        $name = ($request->name == "")?null:$request->name;
        $address = (trim($request->address) == "")?null:trim($request->address);
        $tel = (trim($request->tel) == "")?null:trim($request->tel);
        $loginId = (trim($request->loginId) == "")?null:trim($request->loginId);
        $pwd = (trim($request->pwd) == "")?null:trim($request->pwd);


        $existLoginId = CommonUtil::getUserInfoJustByUserID($loginId,'shop');
        if(!is_null($existLoginId)){
            $result["result_code"] = ResultCode::_000922_qpayShopAlreadyExist;
            return json_encode($result);
        }
        $newShopRs = $this->qpayShopService->newQPayShop($name, $address, $tel, $loginId, $pwd);

        if ($newShopRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }
        return json_encode($result);
        
    }

    /**
     * Update QAccount user status
     * if set requset parameter action = 'close', user will be blocked,and can't use QPlay;
     * else set request parameter action = 'open', user can use QPlay
     * @param  Request $request 
     * @return json
     */
    public function updateUserStatus(Request $request){
        
        $userId = trim($request->userId);
        $action = trim($request->action);
        
        $status = ( strtolower($action) == 'open')?'Y':'N';

        $updateRs = $this->qpayShopService->updateUserStatus($userId, $status);
        
        if ($updateRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);
    } 

    /**
     * Update QPay Trade Status
     * if set requset parameter action = 'close', user will be blocked,and can't have a Transaction;
     * else set request parameter action = 'open', user can use have a Transcation with QPay
     * @param  Request $request 
     * @return json
     */
    public function updateTradeStatus(Request $request){
        
        $shopId = trim($request->shopId);
        $action = trim($request->action);
        
        $status = ( strtolower($action) == 'open')?'Y':'N';

        $updateRs = $this->qpayShopService->updateTradeStatus($shopId, $status);
        
        if ($updateRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);
    }

    /**
     * Reset QAccount Password
     * if passed request parameter restPwd, it will be updated to new password,
     * else if resetPwd is null,it will be updated to original password
     * @param  Request $request
     * @return json
     */
    public function resetQAccountPwd(Request $request){

        $userId = trim($request->userId);
        $resetPwd = (isset($request->resetPwd))?$request->resetPwd:null;

        DB::beginTransaction();
        try {

            $nowTimestamp = time();
            $now = date('Y-m-d H:i:s',$nowTimestamp);

            $updateRs = $this->qpayShopService->resetQAccountPwd($userId, $resetPwd,$now);
            $this->logService->writePasswordLog($userId,
                                            LogService::PWD_TYPE_QACCOUNT,
                                            LogService::PWD_ACTION_RESET,
                                            Auth::user()->row_id,
                                            $now);
         DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        if(is_null($updateRs)){
            $result["result_code"] = ResultCode::_000901_userNotExistError;
        } else if ($updateRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);
    }

    /**
     * Update shop infomation
     * @param  Request $request 
     * @return json
     */
    public function updateShop(Request $request){

        $shopId = trim($request->shopId);
        $name = trim($request->name);
        $address = (trim($request->address) == "")?null:trim($request->address);
        $tel = (trim($request->tel) == "")?null:trim($request->tel);
        $loginId = trim($request->loginId);
        
        $existLoginId = CommonUtil::getUserInfoJustByUserID($loginId,'shop');
        
        //if has changed and login and duplicated return error
        if(!is_null($existLoginId)){
            
            $shopUserResult = $this->qpayShopService->getShopUserByShopId($shopId);
            if($shopUserResult->user_row_id != $existLoginId->row_id) {
                $result["result_code"] = ResultCode::_000922_qpayShopAlreadyExist;
                return json_encode($result);
            }

        }

        $updateRs = $this->qpayShopService->updateShop($shopId, $name, $address, $tel, $loginId);

        if ($updateRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);

    }

    /**
     * Soft delete shop, and close the trade status
     * @param  Request $request
     * @return json
     */
    public function deleteShop(Request $request){
        
        $shopIdList = $request->shopIdList;
        $deleteRs = $this->qpayShopService->deleteShop($shopIdList);

        if ($deleteRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);
    }

    /**
     * QPay user maintain - view
     */
    public function QPayUserMaintain(){
        //get all departments
        $departments = Auth::user()->getAllDepartment();

        //get point type list
        $pointTypeList =  $this->qpayPointService->getQPayPointTypeList();

        return view("qpay_maintain/qpay_user_maintain/member")->with(['pointTypeList'=>$pointTypeList,
                                                            'departments'=>$departments]);
    }

    /**
     * get QPay member list
     * @param  Request $request
     * @return json
     */
    public function getQPayMemberList(Request $request){

        $pointType = ($request->pointType == "")?null:$request->pointType;
        $department = ($request->department == "")?null:$request->department;
        $empNo = (trim($request->empNo) == "")?null:trim($request->empNo);
        $limit = (trim($request->limit) == "")?null:trim($request->limit);
        $offset = (trim($request->offset) == "")?null:trim($request->offset);
        $sort = (trim($request->sort) == "")?null:trim($request->sort);
        $order = (trim($request->order) == "")?null:trim($request->order);

        $memberList = $this->qpayMemberService->getQPayMemberList($pointType, $department, $empNo, $limit, $offset, $sort, $order);

        return response()->json(["total"=>$memberList->total(),"rows"=>$memberList->items()]);
    }

    /**
     * Reset QPay member transaction password
     * @param  Request $request
     * @return json
     */
    public function resetQPayMemberTradPwd(Request $request){
        
        $userId = trim($request->userId);
        
        DB::beginTransaction();
        try {

                $nowTimestamp = time(); 
                $now = date('Y-m-d H:i:s',$nowTimestamp);
                $updateRs = $this->qpayMemberService->resetTradPassword($userId);

                $this->logService
                     ->writePasswordLog($userId,
                                        LogService::PWD_TYPE_QPAY,
                                        LogService::PWD_ACTION_RESET,
                                        Auth::user()->row_id,
                                        $now);
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        if(is_null($updateRs)){
            $result["result_code"] = ResultCode::_000901_userNotExistError;
        } else if ($updateRs) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);
    }
}
