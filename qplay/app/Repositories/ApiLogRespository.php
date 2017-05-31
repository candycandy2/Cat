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
                           // 'company'=>'$_id.company',
                           // 'site_code'=>'$_id.site_code',
                           'department'=>'$_id.department',
                           'user_row_id'=>'$_id.user_row_id'
                           ],
                 'totalCount' => ['$sum'=>'$count'],
                 'distinctCount' => ['$sum' => 1]
                ]
            ]
        ]);

       
    }
    
}