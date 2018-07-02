<?php

namespace App\Repositories;

use App\Model\QP_Register;

class RegisterRepository
{

    protected $register;

    public function __construct(QP_Register $register)
    {   
        $this->register = $register;
    }

    /**
     * get registerIds and UUids by user_row_id
     * @param  Array $UserIds qp_user row_id
     * @return Array ['registerIds'=>[], 'UUIDs'=>[]]
     */
    public function getRegisterInfoByUserIds(Array $UserIds){
        $result = ['registerIds'=>[], 'UUIDs'=>[]];
        
        $registerInfo =  $this->register->whereIn('user_row_id',$UserIds)->select('row_id','uuid');
        $result['registerIds'] = $registerInfo->lists('row_id')->toArray();
        $result['UUIDs'] = $registerInfo->lists('uuid')->toArray();
        
        return $result;
    }

    /**
     * delete qp_register by multi user_row_id
     * @param Array $User
     */
    public function deleteRegisterByUserIds($UserIds){
        $this->register->whereIn('user_row_id', $UserIds)->delete();
    }
}
