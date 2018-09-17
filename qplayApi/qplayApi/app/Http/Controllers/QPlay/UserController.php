<?php

namespace App\Http\Controllers\QPlay;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Services\LogService;
use Illuminate\Http\Request;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;

class UserController extends Controller
{   
    protected $userService;
    protected $logService;

     /**
     * qpalyAccountController constructor.
     * @param UserService $userService
     * @param LogService $logService
     */
    public function __construct(UserService $userService,
                                LogService $logService)
    {
        $this->userService = $userService;
        $this->logService = $logService;
    }

    /**
     * to call this api ,user can change their own qaccount password 
     * @param  Request $request
     * @return json
     */
    public function changeQAccountPwd(Request $request){
        
        //parameter verify
        $request->merge(['old_qaccount_pwd' => $request->header('old-qaccount-pwd')]);
        $request->merge(['new_qaccount_pwd' => $request->header('new-qaccount-pwd')]);
        
        $validator = Validator::make($request->all(),
            [
            'old_qaccount_pwd' => 'required',
            'new_qaccount_pwd' =>  [
                                    'required',
                                    'min:6',
                                    'max:60',
                                    'regex:/(^(?!.*[^\x21-\x7e])(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$)|(^(?!.*[^\x21-\x7e])(?=.{6,})(?=.*[\W])(?=.*[A-Z])(?=.*\d).*$)|(^(?!.*[^\x21-\x7e])(?=.{6,})(?=.*[\W])(?=.*[a-z])(?=.*[A-Z]).*$)|(^(?!.*[^\x21-\x7e])(?=.{6,})(?=.*[\W])(?=.*[a-z])(?=.*\d).*$)/',
                                ]
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'min' =>ResultCode::_000931_newLoginPasswordIncorrect,
                'max' =>ResultCode::_000931_newLoginPasswordIncorrect,
                'regex' =>ResultCode::_000931_newLoginPasswordIncorrect
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }

        $oldPwd = $request->old_qaccount_pwd;
        $newPwd =  $request->new_qaccount_pwd;
        $uuid = $request->uuid;
        $userInfo = CommonUtil::getUserInfoByUUID($uuid);     
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        
        $updateRs = $this->userService->changeQAccountPassword($userInfo->row_id,
                                                               $oldPwd,
                                                               $newPwd,
                                                               $userInfo->row_id,
                                                               $now);
        // old login password does not match
        if( $updateRs  != ResultCode::_1_reponseSuccessful){
            $result = ['result_code'=>$updateRs,
                'message'=>CommonUtil::getMessageContentByCode($updateRs),
                'content'=>''];
            return response()->json($result); 
        }

        $this->logService->writePasswordLog($userInfo->row_id,
                                            LogService::PWD_TYPE_QACCOUNT,
                                            LogService::PWD_ACTION_CHANGE,
                                            $userInfo->row_id,
                                            $now);
        
        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'token_valid'=>$request->token_valid_date
            ];
            return response()->json($result);
    }
}