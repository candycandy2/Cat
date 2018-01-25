<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesResources;

class Controller extends BaseController
{
    use AuthorizesRequests, AuthorizesResources, DispatchesJobs, ValidatesRequests;

    protected function getData($request){
        $xml=simplexml_load_string($request['strXml']);
        $data = json_decode(json_encode($xml),TRUE);
        $data = array_map(array($this, 'arrange'), $data);
        return $data;
    }

    private function arrange($v){
        return (is_array($v) && isset($v[0]))?$v[0]:$v;
    }
}
