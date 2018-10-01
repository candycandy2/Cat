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
use DB;

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
                                    'min:8',
                                    'max:20',
                                    'regex:/(^(?!.*[^\x21-\x7e])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$)|(^(?!.*[^\x21-\x7e])(?=.*[\W])(?=.*[A-Z])(?=.*\d).*$)|(^(?!.*[^\x21-\x7e])(?=.*[\W])(?=.*[a-z])(?=.*[A-Z]).*$)|(^(?!.*[^\x21-\x7e])(?=.*[\W])(?=.*[a-z])(?=.*\d).*$)/',
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
       
        
        DB::beginTransaction();
        try {

                $nowTimestamp = time();
                $now = date('Y-m-d H:i:s',$nowTimestamp);
                $updateRs = $this->userService->changeQAccountPassword($userInfo->row_id,
                                                                   $oldPwd,
                                                                   $newPwd,
                                                                   $userInfo->row_id,
                                                                   $now);

                $this->logService->writePasswordLog($userInfo->row_id,
                                            LogService::PWD_TYPE_QACCOUNT,
                                            LogService::PWD_ACTION_CHANGE,
                                            $userInfo->row_id,
                                            $now);

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        if( $updateRs  != ResultCode::_1_reponseSuccessful){
            return response()->json(['result_code'=>$updateRs,
                                     'message'=>CommonUtil::getMessageContentByCode($updateRs)], 200);
         
        }

        return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                     'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                     'token_valid'=>$request->token_valid_date
                    ],200);

    }
}