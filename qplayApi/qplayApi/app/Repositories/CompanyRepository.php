<?php
/**
 * Company Maintain - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Company;
use DB;

class CompanyRepository
{
    protected $company;

    /**
     * CompanyRepository constructor.
     * @param QP_Company $company
     * @param QP_Company_Log $companyLog
     */
    public function __construct(QP_Company $company)
    {     
        $this->company = $company;
    }

    /**
     * Get all Enable Company data
     * @return mixed all Enable Company data 
     */
    public function getEnableCompanyList()
    {
        return  $this->company
            -> select('row_id', 'user_domain', 'name', 'login_type', 'server_ip', 'server_port', 'status')
            -> where('status', '=', "Y")
            -> get();
    }

    /**
     * Get one Company data
     * @return one Company data
     */
    public function getCompanyData($column, $value)
    {
        return  $this->company
            -> select('row_id', 'user_domain', 'name', 'login_type', 'server_ip', 'server_port', 'status')
            -> where($column, '=', $value)
            -> get();
    }
}