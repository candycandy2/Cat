<?php
/**
 * 處理App相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\AppRepository;
use App\Repositories\AppLineRepository;
use App\Repositories\AppVersionRepository;

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
    public function getAppList($whereCondi=[], $auth=false){
        
        $appsList = $this->appRepository->getAppList($whereCondi)->toArray();

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

    public function getNewAppSequence($categoryId){
        return $this->appRepository->getMaxAppSequenceByCategory($categoryId) + 1;
    }

}