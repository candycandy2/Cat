<?php
/**
 * Emp User Service- Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\EmpServiceUserRepository;
use App\lib\ResultCode;
use App\lib\CommonUtil;


class EmpServiceUserService
{

    protected $empUserRepository;

    private  $logData = [];

    public function __construct(EmpServiceUserRepository $empUserRepository)
    {
        $this->empUserRepository = $empUserRepository;
    }

    /**
     * get Emp User Status
     * @param  stinrg $loginId login_id
     * @param  string $domain  domain
     * @param  string $empNo   emp_no
     * @return int             0:not exist|1:resign|2:block|3:ok
     */
    public function getEmpServiceUserStatus($loginId, $domain, $empNo){
        return $this->empUserRepository->getEmpServiceUserStatus($loginId, $domain, $empNo);
    }
}