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
        if(is_array($v)){
            if(isset($v['file'])){
                return (is_array($v['file']))?$v['file']:(array)$v['file'];
            }else if(isset($v['subscribe_user'])){
                return (is_array($v['subscribe_user']))?$v['subscribe_user']:(array)$v['subscribe_user'];
            }
            else if(isset($v[0])){
                return $v[0];
            }
        }
        return $v;
    }
}
