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
            $logMode = Config::get('app.log_mode');
            $userId = $userInfo->row_id;
            $appId = $appHeadInfo->row_id;
            $logList = $jsonContent['log_list'];
            $uuid = $input["uuid"];
            $insertData = $this->getInsertData($userId, $appId, $uuid, $logList);

            //Mysql
            if ($logMode == 'ALL' || $logMode == 'MYSQL') {
                $mysqlLog = new QP_App_Log();
                $mysqlLog ->insert($insertData);
            }

           //MongoDB
            if ($logMode == 'ALL' || $logMode == 'MONGODB'){
                $mongoDBlog = new MNG_App_Log();
                $mongoDBlog ->insert($insertData);
            }

            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                    'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                    'content'=>""];
                return response()->json($result);
        }
    }

    /**
     * 取得寫入App Log資料
     * @param  int    $userId  qp_user.row_id
     * @param  int    $appId   qp_app_head.row_id
     * @param  string $uuid    手機的uuid
     * @param  array  $logList log 訊息列表
     * @return array
     */
    private function getInsertData($userId, $appId, $uuid, $logList){
        $dataList = [];
        $ip = CommonUtil::getIP();
        $now = date('Y-m-d H:i:s',time());       
        foreach ($logList as $log) {
            $data = new AppLog();
            $data->user_row_id = $userId;
            $data->app_row_id = $appId;
            $data->uuid = $uuid;
            $data->created_at = $now;
            $data->ip = $ip;
            foreach ($log as $key=>$value) {
                if(property_exists($data, $key) && $value!=""){
                    if($key == 'start_time'){
                        $data->$key=substr($value,0,10);
                    }else{
                        $data->$key=$value;
                    }
                }
            }
           $dataList[]=(array)$data;
           unset($data);
        }
        return $dataList;
    }
}

class AppLog{
    public $user_row_id = "";
    public $app_row_id = "";
    public $uuid = "";
    public $created_at= "";//server端寫入此筆資料的時間
    public $page_name = "";
    public $page_action = "";
    public $period = null;//停留區間
    public $start_time = null;//log紀錄開始時間
    public $device_type = "";
    public $latitude = "";
    public $longitude = "";
    public $attribute1 = "";
    public $attribute2 = "";
    public $attribute3 = "";
    public $attribute4 = "";
    public $attribute5 = "";
}