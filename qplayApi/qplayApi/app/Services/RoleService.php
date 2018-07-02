<?php
namespace App\Services;

use App\Repositories\RoleRepository;

class RoleService
{
    protected $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    
    /**
     * Add default role if find new company in qp_user
     * @param Array $data company role data
     */
    public function addNewCompany(){
        $companyRole =  $this->roleRepository->getNewCompany()->toArray();
        $this->roleRepository->addRole($companyRole);
    }
}