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
     * 取得Api Log
     * @param  String $appKey app key
     * @return cursor
     */
    public function getApiLog($appKey){

        //Perform an aggregate function and get a cursor
        return $this->apiLog::raw()->aggregate([
            ['$match'=>
                ['app_key'=>$appKey,
                 'action'=>[ '$exists'=>true, '$ne'=>null ],
                 'company'=>[ '$exists'=>true, '$ne'=>null ],
                 'site_code'=>[ '$exists'=>true, '$ne'=>null ],
                 'department'=>[ '$exists'=>true, '$ne'=>null ]
                ]
            ],
            ['$group' =>
                ['_id' => ['action'=>'$action',
                           'company'=>'$company',
                           'site_code'=>'$site_code',
                           'department'=>'$department'
                           ],
                 'count' => ['$sum' => 1]
                ]
            ],
            ['$group' =>
                ['_id' => ['action'=>'$_id.action',
                           'company_site'=>['$concat'=>['$_id.company','_','$_id.site_code']],
                           'department'=>'$_id.department',
                           'user_row_id'=>'$_id.user_row_id'
                           ],
                 'totalCount' => ['$sum'=>'$count'],
                 'distinctCount' => ['$sum' => 1]
                ]
            ]
        ]);

    }

    /**
     * 依時間區間取得所有呼叫數 group by created_at,user_row_id
     * @param  String $appKey app key
     * @return cursor
     */
    public function getApiLogByTimeInteval($appKey){

        //Perform an aggregate function and get a cursor
          return $this->apiLog::raw()->aggregate([
            ['$match'=>
                ['app_key'=>$appKey,
                 'action'=>[ '$exists'=>true, '$ne'=>null ],
                 'company'=>[ '$exists'=>true, '$ne'=>null ],
                 'site_code'=>[ '$exists'=>true, '$ne'=>null ],
                 'department'=>[ '$exists'=>true, '$ne'=>null ]
                ]
            ],
            ['$group' =>
                ['_id' => [
                           'created_at'=>'$created_at',
                           'user_row_id'=>'$user_row_id'
                           ],
                 'count' => ['$sum' => 1]
                ]
            ]
        ]);
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
    
}