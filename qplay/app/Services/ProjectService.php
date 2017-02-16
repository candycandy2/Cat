<?php
/**
 * 處理Project相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\ProjectRepository;
use App\Repositories\AppRepository;
use Mail;
use Config;

class ProjectService
{   

    protected $projectRepository;
    protected $appRepository;

    public function __construct(ProjectRepository $projectRepository, AppRepository $appRepository)
    {
        $this->projectRepository = $projectRepository;
        $this->appRepository = $appRepository;
    }

    /**
     * 新增專案
     * @param  String $db                 datasource
     * @param  String $appKey             app_key
     * @param  String $secretKey          secretKey 0-9A-za-z 32位元亂數
     * @param  String $projectCode        專案代碼(三位數代碼 ex: 000,001,002)
     * @param  String $projectDescription 專案描述
     * @param  String $projectPm          專案PM
     * @param  Strgin $createdUser        創建者
     * @param  Strgin $createdAt          創建時間
     * @return Int                        新增的project_row_id
     */
    public function newProject($db, $appKey, $secretKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt){

        $projectId = $this->projectRepository->insertProject($db, $appKey, $secretKey, $projectCode, $projectDescription, $projectPm, $createdUser, $createdAt);
        $appRowId = $this->appRepository->insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser);
        $this->appRepository->insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser);
        return $projectId;
    }

    /**
     * 更新專案
     * @param  String $db                 datasource
     * @param  String $projectCode        專案代碼(三位數代碼 ex: 000,001,002)
     * @param  String $projectDescription 專案描述
     * @param  String $projectMemo        專案Memo
     * @param  String $projectPm          專案PM
     * @param  Strgin $createdUser        創建者
     * @param  Strgin $createdAt          創建時間
     */
    public function updateProject($db, $projectCode, $projectDescription, $projectMemo, $projectPm, $updatedUser, $updatedAt){
        $this->projectRepository->updateProject($db, $projectCode, $projectDescription, $projectMemo, $projectPm, $updatedUser, $updatedAt);
    }

    /**
     * 取得專案代碼
     * @param  String $db datasource
     * @return mix     不重複專案代碼(三位數代碼 ex: 000,001,002);失敗回傳null
     */
    public function getProjectCode($db){
        $newProjectCode = 0;
        $maxProjectCode = $db->table("qp_project")->max('project_code');
        $pattern = '/\d{3}/';
        
        if(!is_null($maxProjectCode)){
            
            if(!(preg_match($pattern, $maxProjectCode))){
                return null;
            }

            $newProjectCode = (int)$maxProjectCode + 1;
        }
        return trim(sprintf("%'.03d\n", $newProjectCode));
    }

    /**
     * 寄送專案資訊
     * @param  Array  $mailTo  收件人
     * @param  String $appKey  AppKey
     * @param  String $secretKey SecretKey
     * @param  String $projectCode  App Code 專案代碼
     */
    public function sendProjectInformation(Array $mailTo, $appKey, $secretKey, $projectCode){
        $data = array(
                    'appKey'        =>$appKey,
                    'secretKey'     =>$secretKey,
                    'projectCode'   =>$projectCode,
                    'mailTo'        =>$mailTo,
                    'mailFrom'      =>array('name' =>Config::get('app.mail_name'),
                                            'address'  =>Config::get('app.mail_address'))
                );

        Mail::send('emails.appkey_information', $data, function ($message) use ($data){
            $message->from($data['mailFrom']['address'], $data['mailFrom']['name']);
            $message->to($data['mailTo']);
            $message->subject("[QPlay] ".$data['appKey']." Information");
            $message->getSwiftMessage();
        });
    }
}