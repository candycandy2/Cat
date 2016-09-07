<?php

namespace App\Http\Controllers;

use App\Model\QP_User;
use Illuminate\Http\Request;

use App\Http\Requests;

class testController extends Controller
{
    public function test()
    {
        echo QP_User::find(2)->login_id;
    }
}
