<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\Model\MNG_App_Log;
use App\Model\QP_App_Log;
use Config;
use Request;
use Exception;

class appLogController extends Controller
{   
    public function addAppLog(){
        $Verify = new Verify();
        $verifyResult = $Verify->verifyCustom(false);

        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            $result = ['result_code'=>$verifyResult["code"],
            'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
            'content'=>''];
            return response()->json($result);
        }

        $input = Input::get();
        foreach ($input as $k=>$v) {
            $input[strtolower($k)] = $v;
        }
        $request = Request::instance();
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            try{
                $jsonContent = json_decode($content, true);
                $userInfo = CommonUtil::getUserInfoJustByUserID($jsonContent['login_id']);
                if(is_null($userInfo)){
                    $result = ['result_code'=>ResultCode::_000901_userNotExistError,
                    'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError),
                    'content'=>''];
                    return response()->json($result);
                }

                $appKey = $request->header('App-Key');
                $projectInfo = CommonUtil::getProjectInfoAppKey($appKey);
                $logMode = Config::get('app.log_mode');
                $ip = CommonUtil::getIP();
                $now = date('Y-m-d H:i:s',time());
                //Mysql
                if ($logMode == 'ALL' || $logMode == 'MYSQL') {
                    $mysqlLog = new QP_App_Log();
                     $mysqlLog-> insert([
                        'user_row_id'=> $userInfo->row_id,
                        'app_row_id'=> $projectInfo->row_id,
                        'page_name'=>$jsonContent['page_name'],
                        'page_action'=>$jsonContent['page_action'],
                        'period'=>$jsonContent['period'],
                        'device_type'=>$jsonContent['device_type'],
                        'latitude'=>$jsonContent['latitude'],
                        'longitude'=>$jsonContent['longitude'],
                        'ip'=>$ip,
                        'attribute1'=>$jsonContent['attribute1'],
                        'attribute2'=>$jsonContent['attribute2'],
                        'attribute3'=>$jsonContent['attribute3'],
                        'attribute4'=>$jsonContent['attribute4'],
                        'attribute5'=>$jsonContent['attribute5'],
                        'created_at'=>$now
                    ]);
                }

                //MongoDB
                if ($logMode == 'ALL' || $logMode == 'MONGODB'){
                    $mongoDBlog = new MNG_App_Log();
                    $mongoDBlog->user_row_id = $userInfo->row_id;
                    $mongoDBlog->app_row_id = $projectInfo->row_id;
                    $mongoDBlog->page_name = $jsonContent['page_name'];
                    $mongoDBlog->page_action = $jsonContent['page_action'];
                    $mongoDBlog->period = $jsonContent['period'];
                    $mongoDBlog->device_type = $jsonContent['device_type'];
                    $mongoDBlog->latitude = $jsonContent['latitude'];
                    $mongoDBlog->longitude = $jsonContent['longitude'];
                    $mongoDBlog->ip = $ip;
                    $mongoDBlog->attribute1 = $jsonContent['attribute1'];
                    $mongoDBlog->attribute2 = $jsonContent['attribute2'];
                    $mongoDBlog->attribute3= $jsonContent['attribute3'];
                    $mongoDBlog->attribute4= $jsonContent['attribute4'];
                    $mongoDBlog->attribute5= $jsonContent['attribute5'];
                    $mongoDBlog->save();
                }

                 $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                        'content'=>""];
                    return response()->json($result);

            }
            catch (\Exception $e)
            {
                $result = ['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>trans('messages.MSG_CALL_SERVICE_ERROR'),
                    'content'=>""];
                $result = response()->json($result);
                return $result;
            }
        }
    }
}