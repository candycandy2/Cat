<?php

namespace App\Http\Middleware;

use Closure;
use App\lib\Logger;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Routing\TerminableMiddleware;
use Illuminate\Routing\Route;
use App\lib\CommonUtil;

class LogAferRequest
{
    protected $route;

    public function __construct(Route $route)
    {
        $this->route = $route;
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request);
    }

    public function terminate($request, $response)
    {

        $userId = "";
        $uuid = $request->input('uuid');
        $account = $request->header('account');
        $tempUser = CommonUtil::getUserInfoJustByUserEmpNo($account);
        if($account!=null){    
            if($tempUser !=null){
                $userId = $tempUser->row_id;
            }
        }else if($uuid != null){
            $userInfo = CommonUtil::getUserInfoByUUID($uuid);
            if($userInfo !=null){
                $userId = $userInfo->row_id;
            }
        }
        $tmpUrlArr = explode('/', $request->path());
        unset($tmpUrlArr[0]);
        $ACTION = implode('/',$tmpUrlArr);
        Logger::logApi($userId, $ACTION,
        response()->json(apache_response_headers()), json_decode($response->getContent()));
    }
}
