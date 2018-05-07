<?php

namespace App\Repositories;

use App\Model\QP_App_Version;
use DB;
class AppVersionRepository
{

    protected $appVersion;

    public function __construct(QP_App_Version $appVersion)
    {   
        $this->appVersion = $appVersion;
    }

    /**
     * 取得最新N筆版本備註
     * @param  int $appId         qp_app_head.row_id
     * @param  string $deviceType 裝置類型(ios|android)
     * @param  int $cnt           欲取得的筆數
     * @return array
     */
    public function getVersionLog($appId, $deviceType, $cnt){
        return $this->appVersion
               ->select('version_code', 'version_name', 'version_log', 'version_log', 'ready_date as online_date')
               ->where('app_row_id', $appId)
               ->where('device_type', $deviceType)
               ->whereNotNull('ready_date')
               ->limit($cnt)
               ->orderBy('version_code','desc')
               ->get();
    }


    /**
     * 取得目前發佈中的App版本資訊
     * @param  int      $appId      qp_app_head.row_id
     * @param  String   $deviceType 裝置類型(ios|android)
     * @return mixed                
     */
    public function getPublishedVersion($appId, $deviceType){
         return $this->appVersion
                        ->where('app_row_id','=',$appId)
                        ->where('device_type','=',$deviceType)
                        ->where('status','=','ready')
                        ->select('url','external_app','version_code','version_name')
                        ->first();
    }

}
