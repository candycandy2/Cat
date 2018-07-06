<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\Verify;
use Illuminate\Http\Request;
use App\lib\ResultCode;
use Mail;

class mailController extends Controller
{   
    /**
     * This API can send mail to reciver use smtp
     * @param  Request $request post body : {"from":"no-reply@benq.com",
     *                                       "from_name":"QPlay",
     *                                       "to":"cleo.w.chan@benq.com",
     *                                       "subject":"subject",
     *                                       "content":"content"} 
     * @return json
     */
    public function sendMail(Request $request){
        $Verify = new Verify();
        $verifyResult = $Verify->verifyCustom(false);
        if($verifyResult["code"] == ResultCode::_1_reponseSuccessful)
        {   

            if(is_null($request->json('from')) || trim($request->json('from')) == ""
            ||!filter_var($request->json('from'), FILTER_VALIDATE_EMAIL)
            || is_null($request->json('from_name')) || trim($request->json('from_name')) == ""
            || is_null($request->json('to')) || trim($request->json('to')) == ""
            || is_null($request->json('subject')) || trim($request->json('subject')) == ""
            || is_null($request->json('content')))
            {
               
                 $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                    'content'=>''];
                return response()->json($result);
            }
            $revicer = explode(",", $request->json('to'));
            foreach ($revicer as $email) {
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                  $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                    'content'=>''];
                return response()->json($result);
                }
            }

            Mail::raw($request->json('content'), function ($message) use($request) {
                $from = $request->json('from');
                $fromName = $request->json('from_name');
                $to = explode(",", $request->json('to'));
                $subject = $request->json('subject');
                $message->from($from, $fromName);
                $message->to($to)->subject($subject);
            });

            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                        'content'=>''
                    ];
            return response()->json($result);
        }

        $result = ['result_code'=>$verifyResult["code"],
            'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
            'content'=>''];
        return response()->json($result);
    }
}