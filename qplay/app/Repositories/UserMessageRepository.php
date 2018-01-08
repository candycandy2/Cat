<?php
/**
 * Register的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_User_Message;
use App\lib\CommonUtil;

class UserMessageRepository
{

    protected $userMessage;

     /*
     * UserMessageRepository constructor.
     * @param QP_User_Message $userMessage
     */
    public function __construct(QP_User_Message $userMessage)
    {     
        $this->userMessage = $userMessage;
    }



    /**
     * 取得每日註冊設備用戶數
     * @param  String $timeOffset 時差
     * @return mixed
     */
    public function getRegisterDetail($timeOffset){

        $timeOffset = $this->getDateTimeOffset($timeOffset);
        return $this->register
        ->join('qp_user', 'qp_register.user_row_id', '=', 'qp_user.row_id')
        ->where('qp_register.register_date','<>',null)
        ->select(\DB::raw("uuid"),
                 \DB::raw("DATE_FORMAT((CONVERT_TZ(qp_register.register_date,'+00:00','".$timeOffset."')), '%Y-%m-%d') as register_date"),
                 'device_type','company','site_code','department','user_row_id')
        ->orderBy('register_date','asc')
        ->get();
    }     

    /**
     * 取得每日發送給各site訊息資訊
     * @param  String $timeOffset 時差
     * @return mixed
     */
    public function getSendMessage($timeOffset){
        $timeOffset = $this->getDateTimeOffset($timeOffset);
        $query = $this->userMessage
        ->join('qp_message_send', 'qp_user_message.message_send_row_id', '=', 'qp_message_send.row_id')
        ->join('qp_message', 'qp_message_send.message_row_id', '=', 'qp_message.row_id')
        ->join('qp_user','qp_user_message.user_row_id','=','qp_user.row_id')
        ->where('message_source','<>',null)
        ->where('company','<>',null)
        ->where('site_code','<>',null);
        return $query->select(\DB::raw("DATE_FORMAT(qp_user_message.created_at, '%Y-%m-%d') AS message_send_date"),
                 'message_source',\DB::raw("CONCAT(company,'_',site_code) AS company_site"),'user_row_id',
                 \DB::raw("count(*) AS total"),
                 \DB::raw("SUM(!ISNULL(read_time)) AS is_read"),
                 \DB::raw(" SUM(ISNULL(read_time)) AS not_read")
                )
        ->orderBy('message_send_date','asc')
        ->orderBy('message_source','asc')
        ->groupBy(\DB::raw("DATE_FORMAT((CONVERT_TZ(message_send_date,'+00:00','".$timeOffset."')), '%Y-%m-%d')"),
                            'message_source','company','site_code')
        ->get();
    }

    /**
     * 依時區取得時分格式的時差
     * @param  String $timeOffset 時差
     * @return string  ex: +08:00 /08:00
     */
    private function getDateTimeOffset($timeOffset){
        
        $symbol = '+';
        if((int)$timeOffset < 0){
            $symbol = '-';
        }
        $timeOffset =  $symbol.date("H:i",abs($timeOffset));
        return $timeOffset;
    }
}

