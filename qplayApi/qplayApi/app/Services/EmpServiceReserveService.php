<?php
/**
 * Emp Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceReserveRepository;
use App\Repositories\EmpServiceDataLogRepository as EmpServiceLog;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\PushUtil;


class EmpServiceReserveService
{

    const TABLE = 'reserve_record';

    const ACTION_ADD = 'add';
    const ACTION_UPDATE = 'update';
    const ACTION_DELETE = 'delete';

    protected $serviceReserveRepository;

    public function __construct(EmpServiceReserveRepository $serviceReserveRepository)
    {
        $this->serviceReserveRepository = $serviceReserveRepository;
    }


    public function newReserve($data){
        
        $newReserveRowId = $this->serviceReserveRepository->newReserve($data);
        $logData = [];
        
        $loginId = $data['login_id'];
        $domain = $data['domain'];
        $empNO = $data['emp_no'];
        $pushTitle = $data['info_push_title'];
        $pushContent = $data['info_push_content'];
        $push = $data['push'];

        $logData = EmpServiceLog::getLogData(self::TABLE, $newReserveRowId,
                                             self::ACTION_ADD,
                                             $loginId, $domain, $empNO,
                                             $data);

        $result = ["result_code" => ResultCode::_1_reponseSuccessful, 
                    "message" => CommonUtil::getMessageContentByCode(ResultCode::_1_reponseSuccessful)
                  ];
        // Cleo - Todo sendPushMessage
        /*
        //Push reserve message
        $title = $pushTitle;
        $text  = $pushContent;
        $extra = [];
        $queryParam =  array(
                        'lang' => $lang
                        );

        $pushList = [];
        //add to push to admin
        if(substr($push, 0, 1)){
            array_push($pushList,['from'=>$domain . "\\" . $loginId,
                                'to'=>$domain . "\\" . $loginId]);
        }
        //add to push to user
        if(substr($push, 1, 1)){
            array_push($pushList,['from'=>$domain . "\\" . $loginId,
                                'to'=>$domain . "\\" . $loginId]);
        }

        foreach ($pushList as $item) {
            $from = $item['from'];
            $to = $item['to'];
            PushUtil::sendPushMessage($from, $to, $title, $text, $extra, $queryParam);
        }
        */

        return [$result,$logData];
    }
}