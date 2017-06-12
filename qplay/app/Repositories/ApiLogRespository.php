<?php
/**
 * Api Log的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Api_Log;
use DB;

class ApiLogRespository
{

    protected $apiLog;

     /*
     * ApiLogRespository constructor.
     * @param QP_Api_Log $apiLog
     */
    public function __construct(QP_Api_Log $apiLog)
    {     
        $this->apiLog = $apiLog;
    }

    /**
     * 取得該app最後的log日期
     * @param  String $appKey app key
     * @return mixed
     */
    public function getApiLogLastRecord($appKey){

          return $this->apiLog
                      ->where('app_key','=',$appKey)
                      ->orderBy('created_at','desc')
                      ->first();

    }

    /**
     * 取得當天該user呼叫Api幾次
     * @param  String $appKey app_key
     * @return cursor
     */
    public function getApiLogCountEachUserByDate($appKey){

        return $this->apiLog::raw()->aggregate([
            ['$match'=>
                ['app_key'=>$appKey,
                 'action'=>[ '$exists'=>true, '$ne'=>null ],
                 'company'=>[ '$exists'=>true, '$ne'=>null ],
                 'site_code'=>[ '$exists'=>true, '$ne'=>null ],
                 'department'=>[ '$exists'=>true, '$ne'=>null ]
                ]
            ],
            ['$sort'=>['created_at' => -1]
            ],
            ['$group' =>
                ['_id' => ['created_at'=>['$dateToString'=>['format'=>'%Y-%m-%d','date'=>'$created_at']],
                           'action'=>'$action',
                           'company_site'=>['$concat'=>['$company','_','$site_code']],
                           'department'=>'$department',
                           'user_row_id'=>'$user_row_id'
                           ],
                 'count' => ['$sum' => 1]
                ]
            ]
        ]);
    }
    
}