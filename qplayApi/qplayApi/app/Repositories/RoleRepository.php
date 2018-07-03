<?php

namespace App\Repositories;

use App\Model\QP_Role;
use App\Model\QP_User;
use DB;

class RoleRepository
{

    protected $role;
    protected $user;

    public function __construct(QP_Role $role,
                                QP_User $user)
    {   
        $this->role = $role;
        $this->user = $user;
    }

    /**
     * Add new Roles
     * @param Array $data company role data list
     */
    public function addRole(Array $data){
        $this->role->insert($data);
    }

    /**
     * Get new company is not exist qp_user_role
     * @return mixed
     */
    public function getNewCompany(){
        return $this->user->whereNotIn('company', function($query){
                                            $query->select('company')
                                            ->from('qp_role');
                                        })->select([DB::raw('distinct (company) as company'),
                                                    DB::raw('qp_user.company as role_description'),
                                                    DB::raw('now() as created_at'),
                                                    DB::raw('-1 as created_user'),
                                                    DB::raw('-1 as updated_user')])->get();
    }
}
