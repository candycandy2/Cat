<?php
/**
 * Register的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Register;
use Carbon\Carbon;
use App\lib\CommonUtil;

class RegisterRepository
{

    protected $register;

     /*
     * RegisterRepository constructor.
     * @param QP_Register $register
     */
    public function __construct(QP_Register $register)
    {     
        $this->register = $register;
    }

    /**
     * 取得向QPlay註冊總用戶數
     * @return int
     */
    public function getRegisterUserCount(){
        return $this->register::distinct('user_row_id')->count('user_row_id');
    }

    /**
     * 取得向QPlay註冊的總設備數
     * @return int
     */
    public function getRegisterDeviceCount(){
        return $this->register::distinct('uuid')->count('uuid');
    }   

     /**
     * 取得每日註冊設備用戶數
     * @param  String $timeZone 時區  ex:"Asia/Shanghai"
     * @return mixed
     */
    public function getRegisterDataEachDay($timeZone){

        $timeOffset = $this->getDateTimeOffset($timeZone);
        return $this->register
        ->join('qp_user', 'qp_register.user_row_id', '=', 'qp_user.row_id')
        ->where('qp_register.register_date','<>',null)
        ->select(\DB::raw("COUNT(DISTINCT uuid) as count"),
                 \DB::raw("DATE_FORMAT(register_date, '%Y-%m-%d') as register_date"),
                 'device_type','company','site_code','department','user_row_id')
        ->orderBy('register_date','asc')
        ->groupBy(\DB::raw("DATE_FORMAT((CONVERT_TZ(register_date,'+00:00','".$timeZone."')), '%Y-%m-%d')"),'device_type','company','site_code','department')
        ->get();
    }

    /**
     * 取得每日註冊設備用戶數
     * @param  String $timeZone 時區 ex:"Asia/Shanghai"
     * @return mixed
     */
    public function getRegisterDetail($timeZone){

        $timeOffset = $this->getDateTimeOffset($timeZone);
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
     * 依時區取得時分格式的時差
     * @param  String $timeZone 時區 ex:"Asia/Shanghai"
     * @return string  ex: +08:00 /08:00
     */
    private function getDateTimeOffset($timeZone){
        $timeOffset = CommonUtil::getTimeOffset($timeZone);
        $symbol = '+';
        if((int)$timeOffset < 0){
            $symbol = '-';
        }
        $timeOffset =  $symbol.date("H:i",abs($timeOffset));
        return $timeOffset;
    }
}

