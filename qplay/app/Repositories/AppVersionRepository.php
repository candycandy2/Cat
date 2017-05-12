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
        \App::setLocale("en-us");
        if(\Session::has('lang') && \Session::get("lang") != "") {
            \App::setLocale(\Session::get("lang"));
        }
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
                        ->select('url','external_app','version_code','version_name')
                        ->first();
    }

    /**
     * 取得新上傳的App版本(上傳後未曾上架的版本)
     * @param  int      $appId      qp_app_head.row_id
     * @param  String   $deviceType 裝置類型(ios|android)
     * @return mixed                
     */
    public function getNewAppVersion($appId, $deviceType){
         return QP_App_Version::where('app_row_id','=',$appId)
                        -> where('device_type', '=', $deviceType)
                        -> where('ready_date', '=', null)
                        -> where('status', '=', 'cancel')
                        -> select('row_id','device_type', 'version_code', 'version_name', 'url', 'external_app', 'version_log', 'size', 'status','ready_date', 'created_at')
                        -> orderBy('version_code','desc')
                        -> get();
    }


    /**
     * 新增app version,支援批量賦值
     * @param  Array $insertArray  慾寫入的資料 [["欄位名稱"=>"欄位值"]]
     */
    public function newAppVersion($insertArray){
         return QP_App_Version::insert($insertArray);
    }

    /**
     * 依qp_version.row_id更新app version
     * @param  Array $updateArray  慾更新的資料 [["欄位名稱"=>"欄位值"]]
     */
    public function updateAppVersionById($updateArray){
        foreach($updateArray as $value){
            $updatedRow = QP_App_Version::find($value['row_id']);
            $updatedRow->version_name = $value['version_name'];
            $updatedRow->version_code = $value['version_code'];
            $updatedRow->version_log = $value['version_log'];
            $updatedRow->url = $value['url'];
            $updatedRow->status = $value['status'];
            $updatedRow->updated_user = $value['updated_user'];
            if(isset($value['ready_date'])){
                if($value['ready_date'] == 'null'){
                    $updatedRow->ready_date = NULL;
                }else{
                    $updatedRow->ready_date = $value['ready_date'];
                }
            }
            $updatedRow->save();
        }
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

    /**
     * 依條件查詢qp_app_version表
     * @param  int    $appId      qp_qpp_head.row_id
     * @param  String $deviceType 裝置類型(ios|android)
     * @param  Array  $whereCondi 查詢條件([["field"=>"欄位","op"=>"運算子","value"=>"值"]])
     * @param  Array  $selectData 欲查詢的欄位
     * @param   int   $offset     從第幾筆開始
     * @param   int   $limit      每次最多查詢筆數
     * @param  String $sort       排序的欄位
     * @param  String $order      排序方式(asc|desc)
     * @param  String $search     查詢字串
     * @return mixed
     */
    public function getAppVersion($appId, $deviceType, Array $whereCondi, Array $selectData, $offset=null, $limit=null, $sort='version_code', $order='desc', $search=null){

         $query =  QP_App_Version::select($selectData)
                        ->where('app_row_id','=',$appId)
                        ->where('device_type','=',$deviceType);
                        foreach ($whereCondi as $condi) {
                          $query->where($condi['field'], $condi['op'], $condi['value']);
                        }
                        if(!is_null($search)){
                               $query->where(function ($query) use ($search) {
                                    $query->where("version_code", "LIKE","%$search%")
                                        ->orWhere("version_name", "LIKE", "%$search%")
                                        ->orWhere("url", "LIKE", "%$search%")
                                        ->orWhere("version_log", "LIKE", "%$search%");
                                });   
                        }
                  $query-> orderBy($sort, $order);
                  if(is_null($offset) || is_null($limit)){
                    $version = $query->get();
                  }else{
                    $version = $query->Paginate($limit,['*'],null,($offset/$limit)+1);
                  }
        return $version;

    }

    /**
     * 依row_id取得version資料
     * @param  int $versionId    qp_version.row_id
     * @return mixed
     */
    public function getAppVersionById($versionId){
        return QP_App_Version::where('row_id','=',$versionId)
                        ->first(['version_code','url','device_type']);

    }

    /**
     *利用version_id刪除version資料
     * @param  int $versionIdArr qp_version.row_id
     * @return 
     */
    public function deleteAppVersionById(Array $versionIdArr){
        return QP_App_Version::whereIn('row_id',$versionIdArr)
                            ->delete();
    }


}