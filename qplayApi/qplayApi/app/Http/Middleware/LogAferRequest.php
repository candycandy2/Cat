<?php

namespace App\Http\Middleware;

use Closure;
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
        $domain = $request->header('domain');
        $loginid = $request->header('loginid');
        
        $tempUser = CommonUtil::getUserInfoJustByUserID($loginid, $domain);
        if($domain!=null && $loginid!=null){    
            if($tempUser !=null){
                $userId = $tempUser->row_id;
            }
        }else if($uuid != null){
            $userInfo = CommonUtil::getUserInfoByUUID($uuid);
            if($userInfo !=null){
                $userId = $userInfo->row_id;
            }
        }

        $ACTION = explode('@',$this->route->getActionName())[1];
        CommonUtil::logApi($userId, $ACTION,
        response()->json(apache_response_headers()), json_decode($response->getContent()));
    }
}