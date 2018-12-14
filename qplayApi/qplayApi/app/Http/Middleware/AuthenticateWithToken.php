<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Support\Facades\Auth;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;

class AuthenticateWithToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        //common verify
        $Verify = new Verify();
        $verifyResult = $Verify->verify();

        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            $result = ['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>''];
            return response()->json($result);
        }
    
        //verify token
        $token = $request->header('token');
        $verifyTokenResult = $Verify->verifyToken($request->uuid, $token);
        
        if($verifyTokenResult["code"] != ResultCode::_1_reponseSuccessful)
        {
            $result = ['result_code'=>$verifyTokenResult["code"],
                       'message'=>CommonUtil::getMessageContentByCode($verifyTokenResult["code"]),
                       'content'=>''];
                return response()->json($result);
        }

        $request->merge(['token_valid_date' => $verifyTokenResult["token_valid_date"]]);
        return $next($request);
    }
}
