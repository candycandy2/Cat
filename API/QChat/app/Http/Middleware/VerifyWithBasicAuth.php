<?php

namespace App\Http\Middleware;

use Closure;
use App\lib\Verify;
use App\lib\ResultCode;

class VerifyWithBasicAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        if($verifyResult["code"] != ResultCode::_025901_reponseSuccessful){
            $content = json_encode(array(["ResultCode"=>$verifyResult["code"],
                                        "Message"=> $verifyResult["message"],
                                        "Content"=>""]));
            return response($content, 200);
        }
        return $next($request);
    }
}
