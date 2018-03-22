<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\Http\Requests;
use App\Services\SubscribeService;
use App\Services\UserService;
use App\lib\Verify;
use Validator;


class SubscribeController extends Controller
{

     protected $subscribeService;
     protected $userService;

    public function __construct(SubscribeService $subscribeService,
                                UserService $userService)
    {
        $this->subscribeService = $subscribeService;
        $this->userService = $userService;
    }

    /**
     * 透過此API可以訂閱貼文
     * @param  Request $request 
     * @return json
     */
    public function subscribePost(Request $request){

        $data = parent::getData($request);
        $validator = Validator::make($data , [
            'post_id' => 'required|string',
            'subscribe_user_list' => 'required|array',
        ]);
        if($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }
        
        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], null, $data['post_id'], null);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], null, $data['post_id'], null);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        $empNo = $data['emp_no'];
        $userData = $this->userService->getUserData($empNo);
        $this->subscribeService->subscribePost($data, $userData);
        
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>""]);
    }

}