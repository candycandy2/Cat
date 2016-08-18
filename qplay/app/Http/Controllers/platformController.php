<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class platformController extends Controller
{
    public function process()
    {
        
    }

    public function getUserList()
    {
        $userList = \DB::table("qp_user")
            -> select()
            -> get();
        return response()->json($userList);
    }
}
