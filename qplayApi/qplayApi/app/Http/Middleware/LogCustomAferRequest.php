<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Routing\TerminableMiddleware;
use Illuminate\Routing\Route;
use App\lib\CommonUtil;

class LogCustomAferRequest
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
        $api_version = $request->route('api_version');
        $app_key = $request->route('app_key');
        $action = $request->route('function');
        CommonUtil::logCustomApi($api_version,$app_key,$action,
            response()->json(apache_response_headers()), json_decode($response->getContent()));
    }
}