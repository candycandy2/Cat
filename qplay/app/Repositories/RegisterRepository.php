<?php
/**
 * Register的Resository
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Register;

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

    
}