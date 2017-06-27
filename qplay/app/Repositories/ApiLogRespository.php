<?php
/**
 * Api Log的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Api_Log;
use DB;
use DateTime;
use App\lib\CommonUtil;

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
     * 依App Key取得當天該user呼叫Api幾次
     * @param  String $appKey app_key
     * @param  int    $timeZone 時區
     * @return cursor
     */
    public function getApiLogCountEachUserByAppKey($appKey, $timeZone){
    
        $timeOffset = CommonUtil::getTimeOffset($timeZone);

        return $this->apiLog::raw()->aggregate([
            ['$match'=>
                ['app_key'=>$appKey,
                 'action'=>[ '$exists'=>true, '$ne'=>null ],
                 'company'=>[ '$exists'=>true, '$ne'=>null ],
                 'site_code'=>[ '$exists'=>true, '$ne'=>null ],
                 'department'=>[ '$exists'=>true, '$ne'=>null ],
                 'user_row_id'=>[ '$exists'=>true, '$ne'=>null ]
                ]
            ],
            ['$project'=>
                ['action'=>1,
                 'operation_time'=>1,
                 'company'=>1,
                 'site_code'=>1,
                 'department'=>1,
                 'created_at'=>['$add'=>['$created_at',$timeOffset]
                 ]
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

    /**
     * 依App Key 取得API執行最大時間、最小時間、平均時間
     * @param  String $appKey app_key
     * @param   @param  int    $timeZone 時區
     * @return cursor
     */
    public function getApiOperationTimeByAppKey($appKey, $timeZone){
        
        $timeOffset = CommonUtil::getTimeOffset($timeZone);

        return $this->apiLog::raw()->aggregate([
            ['$match'=>
                ['app_key'=>$appKey,
                 'action'=>[ '$exists'=>true, '$ne'=>null ],
                ]
            ],
            ['$project'=>
                ['action'=>1,
                 'operation_time'=>1,
                 'created_at'=>['$add'=>['$created_at',$timeOffset]
                 ]
                ]
            ],
            ['$sort'=>['created_at' => -1]
            ],
            ['$group' =>
                ['_id' => ['created_at'=>['$dateToString'=>['format'=>'%Y-%m-%d','date'=>'$created_at']],
                           'action'=>'$action'
                           ],
                 'count' => ['$sum' => 1],
                 'min' => ['$min' => '$operation_time'],
                 'max' => ['$max' => '$operation_time'],
                 'avg' => ['$avg' => '$operation_time'],
                ]
            ]
        ]);
    }
    
    /**
     * 取得該日期每小時API執行時間(最大、最小、平均)
     * @param  String $appKey     app_key
     * @param  String $date       查詢的日期
     * @param   @param  int    $timeZone 時區
     * @param  String $actionName 查詢的API名稱
     * @return cursor
     */
    public function getApiOperationTimeDetail($appKey, $date, $timeZone, $actionName){
        
        $timeOffset = CommonUtil::getTimeOffset($timeZone);
        $date = explode(' ',$date)[0];
        
        return $this->apiLog::raw()->aggregate([
            ['$project'=>
                ['action'=>1,
                 'app_key'=>1,
                 'operation_time'=>1,
                 'created_at'=>['$add'=>['$created_at',$timeOffset]
                 ]
                ]
            ],
            ['$match'=>
                ['app_key'=>$appKey,
                 'action'=>$actionName,
                 'created_at'=>['$gte'=> new \MongoDB\BSON\UTCDateTime(new DateTime($date . " 00:00:00")),
                                '$lt'=> new \MongoDB\BSON\UTCDateTime(new DateTime($date . " 23:59:59"))
                                ]
                ]
            ],
            ['$sort'=>['created_at' => -1]
            ],
            ['$group' =>
                ['_id' => ['interval'=>['$dateToString'=>['format'=>'%Y-%m-%d %H:00:00','date'=>'$created_at']],
                           'action'=>'$action'
                           ],
                 'count' => ['$sum' => 1],
                 'min' => ['$min' => '$operation_time'],
                 'max' => ['$max' => '$operation_time'],
                 'avg' => ['$avg' => '$operation_time'],
                ]
            ]
        ]);
    }
}