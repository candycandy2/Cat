<?php

namespace App\Http\Controllers;

use App\Services\FunctionService;
use Illuminate\Http\Request;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;

class appFunctionController extends Controller
{       

    protected $functionService;
    protected $appService;

    /**
     * FunctionController constructor.
     * @param FunctionService $functionService
     */
    public function __construct(FunctionService $functionService)
    {
        $this->functionService = $functionService;
    }
    
    public function getFunctionList(Request $request)
    {    
    
        //api common verify 
        $Verify = new Verify();
        $verifyResult = $Verify->verifyWithCustomerAppKey();

        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            return response()->json($result);
        }

        foreach ($request->all() as $k=>$v) {
           $request->merge([strtolower($k) => strtolower($v)]);
        }
        //parameter verify
        $validator = Validator::make(
            $request->all(),
            [
            'uuid'=>'required',
            'device_type' => 'required|in:ios,android'
        ],
        [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'in' => ResultCode::_999001_requestParameterLostOrIncorrect
        ]
        );
        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }
       
        //verify uuid
        $uuid = $request->uuid;
        if(!$Verify->chkUuidExist($uuid)) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
                'content'=>''];
            return response()->json($result);
        }

        //verify token
        $token = $request->header('token');
        $verifyTokenResult = $Verify->verifyToken($uuid, $token);
        if($verifyTokenResult["code"] != ResultCode::_1_reponseSuccessful)
        {
            $result = ['result_code'=>$verifyTokenResult["code"],
                    'message'=>CommonUtil::getMessageContentByCode($verifyTokenResult["code"]),
                    'content'=>''];
                return response()->json($result);
        }

        //verify app key
        $appKey = $request->header('app_key');
        if(!$Verify->chkAppKeyExist($appKey)) {
            $result = ['result_code'=>ResultCode::_000909_appKeyNotExist,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000909_appKeyNotExist),
                'content'=>''];
            return response()->json($result);
        }

        //if user illegal (contain resign=Y, status=N, qp_register.status != 'A')
         $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if(is_null($userInfo))
        {   
            // if user exist but no right to use
            $userId = CommonUtil::getUserIdByUUID($uuid);
            if(!is_null($userId)) {
    
                $userStatus = CommonUtil::getUserStatusByUserRowID($userId);
                
                if($userStatus == 2) {
                    $message = CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight);
                    $result = ["result_code"=>ResultCode::_000914_userWithoutRight,
                        "message"=> $message];
                }
            }

            $message = CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError);
            $result = ["result_code"=>ResultCode::_000901_userNotExistError,
                "message"=> $message];
            return response()->json($result);
           
        }
        
        $appInfo = CommonUtil::getAppHeaderInfo();
        $userIdentify = array(
                           'adFlag' => CommonUtil::ADFlag($uuid),
                           'userRole' => CommonUtil::getUserRole($userInfo->row_id),
                           'userId' => $userInfo->row_id,
                           'company'=> $userInfo->company
                        );

        $functionList = $this->functionService->getFunctionListByAppId($userIdentify, $appInfo->row_id, $request->lang, $request->device_type);
        
        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'token_valid'=>$verifyTokenResult["token_valid_date"],
                'content'=>array("function_list"=>$functionList)
            ];
            return response()->json($result);
 
    }
}