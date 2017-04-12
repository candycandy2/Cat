<?php

namespace App\Http\Controllers;

use App\Model\APILog;
use App\Model\Log;
use DB;
use Illuminate\Http\Request;
use App\Http\Requests;

class mongoController extends Controller
{
    //MongoDB Test
    public static function Test(){
        $log = new Log();
        $log->pro1 = "Test1";
        $log->pro2 = "Test2";
        $log->save();
    }
}
