<?php
namespace App\Services;

use App\Repositories\UserRepository;

class UserService
{   

    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * 取得用戶所屬角色
     * @param  String $empNo 工號
     * @return array         角色列表，一個人可能所屬於多個角色 (admin:機房管理者|supervisor:主管|common:一般用戶)
     */
    public function getUserRoleList($empNo){
        $roleList = [];
        $groups = $this->userRepository->getUserAuth($empNo);
        if(count($groups) > 0){
            foreach ($groups as $group) {
                $roleList [] = $group->usergroup;
            }
        }else{
            $roleList [] ='common';
        }
        return $roleList;
    }
}