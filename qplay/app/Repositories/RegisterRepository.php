<?php
/**
 * Register的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Register;
use Carbon\Carbon;

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
     * @return mixed
     */
    public function getRegisterDataEachDay(){
        return $data = $this->register
        ->join('qp_user', 'qp_register.user_row_id', '=', 'qp_user.row_id')
        ->select(\DB::raw("COUNT(DISTINCT uuid) as count"),
                 \DB::raw("DATE_FORMAT(register_date, '%Y-%m-%d') as register_date"),
                 'device_type','company','site_code','department','user_row_id')
        ->orderBy('register_date','asc')
        ->groupBy(\DB::raw("DATE_FORMAT(register_date, '%Y-%m-%d')"),'device_type','company','site_code','department')
        ->get();
    }
}