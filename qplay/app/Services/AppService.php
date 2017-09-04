<?php
/**
 * 處理App相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\AppRepository;
use App\Repositories\AppLineRepository;
use App\Repositories\AppVersionRepository;
use App\lib\FilePath;
use \DB;

class AppService
{   

    protected $appRepository;
    protected $appLineRepository;
    protected $appVersionRepository;

    public function __construct(AppRepository $appRepository, 
                                AppLineRepository $appLineRepository,
                                AppVersionRepository $appVersionRepository)
    {
        $this->appRepository = $appRepository;
        $this->appLineRepository = $appLineRepository;
        $this->appVersionRepository = $appVersionRepository;
    }

    /**
     * 新增App
     * @param  String $db          datasource
     * @param  int $projectId      qp_project.row_id
     * @param  String $appKey      app_key
     * @param  Strgin $createdUser 創建者
     * @param  Strgin $createdAt   創建時間
     * @return Int                 新建立的app_row_id
     */
    public function newApp($db, $projectId, $appKey, $createdAt, $createdUser){
        
        $appRowId = $this->appRepository->insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser);
        $this->appRepository->insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser);
        return $appRowId;
    }

    /**
     * 使用appKey 取得App資訊
     * @param  String $appKey app key
     * @return mixed  
     */
    public function getAppInfoByAppKey($appKey){
        $appInfo = $this->appRepository->getAppInfoByAppKey($appKey);
        return $appInfo;
    }

    /**
     * 依據qp_app_head.row_id更新事件資料
     * @param  int    $appId      qp_app_head.row_id
     * @param  Array  $updateData 欲更新的資料
     * @return mixed
     */
    public function updateAppInfoById($appId, Array $updateData){
        return $this->appRepository->updateAppInfoById($appId, $updateData);
    }

    /**
     * 依據qp_app_head.row_id更新事件資料
     * @param  Array    $appIdList      qp_app_head.row_id 列表
     * @param  Array  $updateData 欲更新的資料
     * @return mixed
     */
    public function updateAppInfoByIdList($appIdList, Array $updateData){
        return $this->appRepository->updateAppInfoByIdList($appIdList, $updateData);
    }

    /**
     * 取得App列表
     * @param  array   $whereCondi 查詢條件
     * @param  boolean $auth       是否過濾權限
     * @return mixed
     */
    public function getAppList($whereCondi=[],$orderCondi=[], $auth=false){
        
        $appsList = $this->appRepository->getAppList($whereCondi, $orderCondi)->toArray();

        foreach ($appsList as $index => &$app) {
                if($auth){
                    if(!\Auth::user()->isAppAdmin()){
                        if($app->p_created_user!=\Auth::user()->row_id && $app->pm!=\Auth::user()->login_id){
                                unset($appsList[$index]);
                        }
                    }
                }
                $selLine = ['app_row_id', 'app_name', 'updated_at'];
                $selLineCondi =array(array(
                        'field'=>'lang_row_id',
                        'op'=>'=',
                        'value'=> $app['default_lang_row_id']
                    ));

                $appLineInfo = $this->appLineRepository->getAppLineInfo($app['row_id'],$selLine,$selLineCondi);

                $app['app_name'] = "-";
                $app['updated_at'] = ($app['updated_at'] == '-0001-11-30 00:00:00')?$app['created_at']:$app['updated_at'];
                if($app['updated_at'] == '-0001-11-30 00:00:00'){
                    $app['updated_at'] = '0000-00-00 00:00:00';
                }
                $app['app_name'] = $appLineInfo['app_name'];
                
                $selVersionCondi = array(array(
                                    'field'=>'status',
                                    'op'=>'=',
                                    'value'=>'ready'
                                    ));

                $appPublishedVersionInfo = $this->appVersionRepository->getAppVersionByAppId($app['row_id'],$selVersionCondi);                
                $app['android_release'] = 'Unpublish';
                $app['ios_release'] = 'Unpublish';
                $app['release_status'] = '0';

                foreach ( $appPublishedVersionInfo as $version) {
                    $app['release_status'] = '1';
                    $deviceTypeRelease = $version['device_type'].'_release';
                    $app[$deviceTypeRelease] = $version['version_name'];
                }
            }
        return $appsList;
    }

    /**
     * 依app.row_id取得基本資訊
     * @param  int $appId qp_qpp_head.row_id
     * @return mixed
     */
    public function getAppBasicIfnoByAppId($appId){
        return $this->appRepository->getAppBasicIfnoByAppId($appId);
    }

    /**
     * 取得App排序
     * @param  int $categoryId qp_app_category.row_id
     * @return int
     */
    public function getNewAppSequence($categoryId){
        return $this->appRepository->getMaxAppSequenceByCategory($categoryId) + 1;
    }

    /**
     * 上傳icon檔案
     * @param  int  $appId qp_app.row_id
     * @param  file $icon  icon 圖片檔案
     */
    public function uploadIcon($appId,$icon){
        
        //delete icon file
        $this->deleteIconFile($appId);
        //upload file
        $fileName = $this->uploadIconFie($appId, $icon);
        //update DB
        $this->appRepository->updateAppInfoById($appId, ['icon_url'=>$fileName]);
    }

    /**
     * 刪除icon檔案
     * @param  int $appId qp_app.row_id
     */
    public function deleteIcon($appId){
        // delete file
        $this->deleteIconFile($appId);
        // delete DB
        $this->appRepository->updateAppInfoById($appId, ['icon_url'=>'']);
    }

    /**
     * 上傳icon檔案
     * @param  int    $appId qp_app.row_id
     * @param  file   $icon  icon file
     * @return String        上傳後的實體檔案名稱
     */
    public function uploadIconFie($appId, $icon){
        $iconUploadPath =  FilePath::getIconUploadPath($appId);

        if (!file_exists($iconUploadPath)) {
            mkdir($iconUploadPath, 0755, true);
        }
        $fileName = time();
        $icon->move($iconUploadPath,$fileName);
        return $fileName;
    }

    /**
     * 刪除icon 檔案
     * @param  int      $appId    qp_app.row_id
     * @return mixed             成功:刪除的檔案名稱 | 失敗:null
     */
    public function deleteIconFile($appId){
        $deleteRes = null;
        $oriIcon = $this->appRepository->getAppBasicIfnoByAppId($appId);              
        $oriIconFile = FilePath::getIconUploadPath($appId).$oriIcon->icon_url;
        if($oriIcon->icon_url!="" && file_exists($oriIconFile)){
            unlink($oriIconFile);
            $deleteRes  = $oriIcon->icon_url;
        }
        return $deleteRes;
    }

}