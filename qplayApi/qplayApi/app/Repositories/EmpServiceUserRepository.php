<?php
/**
 * EmpService User - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\EmpService_User;
use DB;

class EmpServiceUserRepository
{

    protected $empUser;

    public function __construct(EmpService_User $empUser)
    {
        $this->empUser = $empUser;
    }

    /**
     * get Emp User Status
     * @param  stinrg $loginId login_id
     * @param  string $domain  domain
     * @param  string $empNo   emp_no
     * @return int             0:not exist|1:resign|2:block|3:ok
     */
    public function getEmpServiceUserStatus($loginId, $domain, $empNo){
        
        $userList = $this->empUser
            -> where('login_id', '=', $loginId)
            -> where('user_domain', '=', $domain)
            -> where('emp_no','=', $empNo)
            -> select('row_id', 'status', 'resign')
            ->get();

        if(count($userList) < 1) {
            return 0; //用户不存在
        }

        if(count($userList) == 1) {
            $empUser = $userList[0];
            if($empUser->resign != "N") {
                return 1; //用户已离职
            }

            if($empUser->status != "Y") {
                return 2; //用户已停权
            }
        } else {
            foreach ($userList as $empUser)
            {
                if($empUser->resign == "N") {
                    if($empUser->status == "Y") {
                        return 3; //正常
                    } else {
                        return 2; //停权
                    }
                }
            }
            return 1;  //离职
        }

        return 3; //正常

    }
}