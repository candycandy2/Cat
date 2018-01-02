<?php

namespace App\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MNG_App_Log extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'qp_app_log';

    /**
     * 取得寫入App Log資料
     * @param  int    $appHeadInfo app資訊  
     * @param  int    $userInfo    使用者資訊
     * @param  string $uuid    手機的uuid
     * @param  array  $logList log 訊息列表
     * @return array
     */
    public function getInsertData($appKey, $appHeadInfo, $userInfo, $uuid, $logList, $ip){
        $dataList = [];
        $now = date('Y-m-d H:i:s',time());       
        foreach ($logList as $log) {
            $data = new MNGAppLog();
            $data->user_row_id = $userInfo->row_id;
            $data->app_row_id = $appHeadInfo->row_id;
            $data->uuid = $uuid;
            $data->created_at = $now;
            $data->ip = $ip;
            $data->login_id = $userInfo->login_id;
            $data->emp_no = $userInfo->emp_no;
            $data->company = $userInfo->company;
            $data->site_code = $userInfo->site_code;
            $data->department = $userInfo->department;
            $data->appkey = $appKey;
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

class MNGAppLog{
    public $user_row_id = "";
    public $app_row_id = "";
    public $uuid = "";
    public $login_id = "";
    public $company = "";
    public $site_code = "";
    public $department = "";
    public $emp_no = "";
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
    public $created_at= "";//server端寫入此筆資料的時間
}