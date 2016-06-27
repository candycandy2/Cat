<?php

namespace App\Http\Controllers;

use Request;
use App\Http\Requests;
use App\lib\ResultCode;
use App\lib\Verify;
use DB;


class qplayController extends Controller
{
    public function getSecturityList()
    {
        $status_code = ResultCode::_999999_unknownError;
        $Verify = new Verify();
        $status_code = $Verify->json();

        $request = Request::instance();
        $appKey = $request->header('App-Key');
        if ($status_code == ResultCode::_1_reponseSuccessful) {
            $app_row_id = \DB::table("qp_app_head")->join("qp_project","project_row_id",  "=", "qp_project.row_id")
                -> where('qp_project.app_key', "=", $appKey)
                ->select('qp_app_head.row_id')->lists('qp_app_head.row_id');

//            select * from qp_white_list where app_row_id = (
//                select row_id from qp_app_head where project_row_id = (
//                    select row_id from qp_project where app_key = 'qplay'
//            ))
            $whitelist = \DB::table("qp_white_list")
                -> whereNull('deleted_at')
                -> where('app_row_id', "=", $app_row_id)
                -> select('allow_url')->get();

//            select security_level from qp_app_head where project_row_id = (
//                select row_id from qp_project where app_key = 'qplay')
            $level = \DB::table("qp_app_head")->join("qp_project","project_row_id",  "=", "qp_project.row_id")
                -> where('qp_project.app_key', "=", $appKey)
                ->select('security_level')->lists('security_level');


            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>'Call Service Successed',
                'content'=>json_encode($whitelist),
                'security_level'=>$level[0],
            ]);
//            ->header("version", "1.0.1")
//            ->header("name", "qplay")
//            ->header("action", "getSecturityList");
        } else {
            return response()->json(['result_code'=>$status_code,
                'message'=>'Call Service Failed',
                'content'=>'']);
        }

    }
}
