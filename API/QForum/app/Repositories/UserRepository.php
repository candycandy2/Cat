<?php
/**
 * 用戶相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Models\QP_User;
use DB;

class UserRepository
{

    protected $user;
    protected $qChatUserDetail;
    
    /**
     * ParameterRepository constructor.
     * @param QP_User $user
     */
    public function __construct(QP_User $user)
    {   
        $this->user = $user;
    }

    /**
     * 依員工編號取得用戶基本資料
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getUserData($empNo){
        return $this->user
                ->where('emp_no',$empNo)
                ->select('row_id', 'emp_no', 'email', 'ext_no', 'site_code','login_id')
                ->first();

    }

    /**
     * 依員工帳號取得用戶基本資料
     * @param  String $loginId 員工帳號
     * @return mixed
     */
    public function getUserDataByLoginId($loginId){
        return $this->user
                ->where('login_id',$loginId)
                ->select('row_id', 'emp_no', 'email', 'ext_no', 'site_code','login_id')
                ->first();
    }
}