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
     * Get the user belong roles
     * @param  String $empNo employee No.
     * @return Array
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