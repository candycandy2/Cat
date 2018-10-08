<?php
/**
 * Info controller
 * basic Info for app
 */
namespace App\Http\Controllers\QPay;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\QPayPointService;
use App\Services\QPayShopService;
use App\Services\QPayMemberService;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;
use App\Model\QP_User;

class InfoController extends Controller
{   
    protected $qpayPointService;
    protected $qpayShopService;
    protected $qpayMemberService;

    /**
     * QPayPointTypeService constructor.
     * @param QPayPointTypeService $qpayPointTypeService
     */
    public function __construct(QPayPointService $qpayPointService,
                                QPayShopService $qpayShopService,
                                QPayMemberService $qpayMemberService)
    {
        $this->qpayPointService = $qpayPointService;
        $this->qpayShopService = $qpayShopService;
        $this->qpayMemberService = $qpayMemberService;
    }

    /**
     * get user side qpay app basic information
     * cintain point now,shop list
     * @return json
     */
    public function getQPayInfoEmp(Request $request)
    {

        $uuid = $request->uuid;
        $user = CommonUtil::getUserInfoByUUID($uuid);
        //取得剩餘點數,店家列表
        $retunData = ['point_now'=>0,
                  'shop_list'=>[]
                  ];
        $retunData['point_now']  = $this->qpayMemberService->getPointNow($user->row_id);
        $retunData['shop_list'] = $this->qpayShopService->getEnableShopList();

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'content'=>$retunData,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'token_valid'=>$request->token_valid_date
            ];
        return response()->json($result);
    }

    /**
     * get shop side qpay app basic information
     * conatin shop id and qpay point type list
     * @param  Request $request 
     * @return json
     */
    public function getQPayInfoShop(Request $request)
    {

        $uuid = $request->uuid;
        $user = CommonUtil::getUserInfoByUUID($uuid);

        $retunData = ['shop_id'=>null,
                    'point_type_list'=>[]
                  ];
        
        $shop = $this->qpayShopService->getShopInfoByUserId($user->row_id);
        if(is_null($shop)){
            $resultCode = ResultCode::_000932_shopNotExistError;
            return response()->json(['result_code'=>$resultCode ,
                                    'message'=>CommonUtil::getMessageContentByCode($resultCode ),
                                    'content'=>'']);
        }
        $retunData['shop_id'] = $shop->row_id;
        $retunData['shop_name'] = $shop->emp_name;

        $pointTypeList =  $this->qpayPointService->getEnablePointTypeList();

        foreach ($pointTypeList as $pointType) {
            $retunData['point_type_list'][] = array('point_type_id' => $pointType->row_id,
                'point_type_name' => $pointType->name);
        }

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'content'=>$retunData,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'token_valid'=>$request->token_valid_date
            ];
        return response()->json($result);
    }

    /**
     * get point now by emp_no
     * @param  Request $request
     * @return json
     */
    public function getEmpInfoForShop(Request $request)
    {
        
        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'emp_no' => 'required'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );

        $empNo = $request->emp_no;
        $user = CommonUtil::getUserInfoJustByUserEmpNo($empNo);
        if(is_null($user)){
            $resultCode = ResultCode::_000901_userNotExistError;
            return response()->json(['result_code'=>$resultCode ,
                                    'message'=>CommonUtil::getMessageContentByCode($resultCode ),
                                    'content'=>'']);
        }

        $retunData['point_now']  = $this->qpayMemberService->getPointNow($user->row_id);
        $retunData['login_id']  = $user->login_id;

        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'content'=>$retunData,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'token_valid'=>$request->token_valid_date
            ];
        return response()->json($result);
    }
}