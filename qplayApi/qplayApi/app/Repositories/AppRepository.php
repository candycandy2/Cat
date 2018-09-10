<?php
/**
 * App 的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use DB;
use App\Model\QP_App_Head;
use App\Model\QP_App_Line;

class AppRepository
{
    
    /** @var User Inject QP_App_Head model */
    protected $appHead;

    
    /*
     * AppRepository constructor.
     * @param QP_App_Head $appHead
     */
    public function __construct(QP_App_Head $appHead)
    {     
        $this->appHead = $appHead;
    }


    /**
     * get app information,by qp_app_row.id and language,
     * if no request language setting, return default language
     * @param  int $appId qp_qpp_head.row_id
     * @param  string $lang en-us|zh-tw|zh-ch
     * @return mixed
     */
    public function getAppBasicIfnoByAppId($appId, $lang){
       
        $appInfo = $this->appHead
            -> join('qp_project','qp_project.row_id','=','qp_app_head.project_row_id')
            -> join('qp_app_line','qp_app_line.app_row_id','=','qp_app_head.row_id')
            -> join('qp_language','qp_app_line.lang_row_id','=','qp_language.row_id')
            -> where('qp_language.lang_code',$lang)
            -> where('qp_app_head.row_id','=',$appId)
            -> select('qp_app_head.row_id',
                      'qp_app_head.package_name',
                      'qp_project.app_key',
                      'qp_app_head.icon_url',
                      'qp_project.project_code',
                      'qp_app_line.app_name',
                      'qp_app_line.app_summary',
                      'qp_app_line.app_description'
                      )
            -> first();

        if(is_null($appInfo)){
            $appInfo = $this->appHead
            -> join('qp_project','qp_project.row_id','=','qp_app_head.project_row_id')
            -> join('qp_app_line','qp_app_line.app_row_id','=','qp_app_head.row_id')
            -> join('qp_language','qp_app_line.lang_row_id','=','qp_app_head.default_lang_row_id')
            -> where('qp_app_head.row_id','=',$appId)
            -> select('qp_app_head.row_id',
                      'qp_app_head.package_name',
                      'qp_project.app_key',
                      'qp_app_head.icon_url',
                      'qp_project.project_code',
                      'qp_app_line.app_name',
                      'qp_app_line.app_summary',
                      'qp_app_line.app_description'
                      )
            -> first();
        }

        return $appInfo;
    }
} 