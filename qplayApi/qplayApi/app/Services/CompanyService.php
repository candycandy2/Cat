<?php
/**
 * Company Maintain - Service
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Services;

use App\Repositories\CompanyRepository;

class CompanyService
{
    protected $CompanyRepository;

    /**
     * CompanyService constructor.
     * @param CompanyRepository $CompanyRepository
     */
    public function __construct(CompanyRepository $CompanyRepository)
    {
        $this->CompanyRepository = $CompanyRepository;
    }

    /**
    * Get all Enable Company data
    * @return mixed all Enable Company data
    */
    public function getEnableCompanyList()
    {
        return $this->CompanyRepository->getEnableCompanyList();
    }

    /**
    * Get one Company data
    * @return one Company data
    */
    public function getCompanyData($column, $domain)
    {
        return $this->CompanyRepository->getCompanyData($column, $domain);
    }
}