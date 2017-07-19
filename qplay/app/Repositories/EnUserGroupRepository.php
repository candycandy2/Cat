<?php
/**
 * 用戶User相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Usergroup;
use DB;

class EnUserGroupRepository
{
    /** @var User Inject QP_User model */
    protected $userGroup;
    /**
     * UserRepository constructor.
     * @param EN_Usergroup $userGroup
     */
    public function __construct(EN_Usergroup $userGroup)
    {
        $this->userGroup = $userGroup;
    }

    /**
     * 取得尚未註冊Qmessage的管理者及主管的帳號(login_id)
     * @return mixed
     */
    public function getSuperUserLoginIdNotRegister($appKey){
        return $this->userGroup
            ->LeftJoin( 'qplay.qp_user as qp_user', 'qp_user.emp_no', '=', 'ens.en_usergroup.emp_no')
            ->where('qp_user.register_message', '=', 'N')
            ->where('ens.en_usergroup.app_key', '=', $appKey)
            ->distinct('login_id')->select('login_id')
            ->get();
    }
}