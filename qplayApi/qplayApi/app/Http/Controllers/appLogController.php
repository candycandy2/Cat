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

    /**
     * 新增APP行為Log 
     * 透過此接口, 讓APP可以將log送到後台, 供未來大數據分析
     */
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
        //驗證uuid
        if(!isset($input["uuid"]) || !$Verify->chkUuidExist($input["uuid"])) {
            $result = ['result_code'=>ResultCode::_000911_uuidNotExist,
            'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist),
            'content'=>''];
            return response()->json($result);
        }
             
        $request = Request::instance();
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            if(!isset($jsonContent['login_id']) ||
               !isset($jsonContent['log_list'])){
                $result = ['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect),
                'content'=>''];
                return response()->json($result);
            }
            $userInfo = CommonUtil::getUserInfoJustByUserID($jsonContent['login_id']);
            if(is_null($userInfo)){
                $result = ['result_code'=>ResultCode::_000901_userNotExistError,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError),
                'content'=>''];
                return response()->json($result);
            }
            $appHeadInfo = CommonUtil::getAppHeaderInfo();
            $appKey = CommonUtil::getAppKeyFromHeader();
            $ip = CommonUtil::getIP();
            $logMode = Config::get('app.log_mode');
            $logList = $jsonContent['log_list'];
            $uuid = $input["uuid"];
            

            //Mysql
            if ($logMode == 'ALL' || $logMode == 'MYSQL') {
                $mysqlLog = new QP_App_Log();
                $insertData = $mysqlLog ->getInsertData($appKey, $appHeadInfo, $userInfo, $uuid, $logList, $ip);
                $mysqlLog ->insert($insertData);
            }

           //MongoDB
            if ($logMode == 'ALL' || $logMode == 'MONGODB'){
                $mongoDBlog = new MNG_App_Log();
                $insertData = $mongoDBlog ->getInsertData($appKey, $appHeadInfo, $userInfo, $uuid, $logList, $ip);
                $mongoDBlog ->insert($insertData);
            }

            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'content'=>""];
                return response()->json($result);
        }
    }
}