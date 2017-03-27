<?php
/**
 * 地點(location)-分類(function)相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\QP_App_Version;
use DB;

class AppVersionRepository
{
    /** @var User Inject QP_App_Version model */
    protected $appVersion;
   
    /*
     * AppVersionRepository constructor.
     * @param QP_App_Version $appVersion
     */
    public function __construct(QP_App_Version $appVersion)
    {     
        $this->appVersion = $appVersion;
    }

    /**
     * 取得目前發佈中的App
     * @param  int      $appId      qp_app_head.row_id
     * @param  String   $deviceType 裝置類型(ios|android)
     * @return mixed                
     */
    public function getPublishedApp($appId, $deviceType){
         return QP_App_Version::where('app_row_id','=',$appId)
                        ->where('device_type','=',$deviceType)
                        ->where('status','=','ready')
                        ->select('url','external_app')
                        ->first();
    }

    /**
     * 新增app version,支援批量賦值
     * @param  Array $insertArray  慾寫入的資料 [["欄位名稱"=>"欄位值"]]
     */
    public function newAppVersion($insertArray){
         return QP_App_Version::insert($insertArray);
    }

    /**
     * 更新app version 相關資訊
     * @param  int    $appId      qp_qpp_head.row_id
     * @param  String $deviceType 裝置類型(ios|android)
     * @param  Array  $whereCondi 查詢條件([["field"=>"欄位","op"=>"運算子","value"=>"值"]])
     * @param  Array  $updateData 更新項目["field1"=>"value1","field2"=>"value2"]
     */
    public function updateAppVersion($appId, $deviceType, Array $whereCondi, Array $updateData){
        $version =  QP_App_Version::where('app_row_id','=',$appId)
                        ->where('device_type','=',$deviceType);
                        foreach ($whereCondi as $condi) {
                          $version ->where($condi['field'], $condi['op'], $condi['value']);
                        }
                        $version ->update($updateData);
    }

    public function getAppVersion($appId, $deviceType, Array $whereCondi, Array $selectData){

         $query =  QP_App_Version::select($selectData)
                        ->where('app_row_id','=',$appId)
                        ->where('device_type','=',$deviceType);
                        foreach ($whereCondi as $condi) {
                          $query ->where($condi['field'], $condi['op'], $condi['value']);
                        }
                   $version =  $query->get();     
        return $version;
    }

    public function deleteAppVersion(){

    }


}