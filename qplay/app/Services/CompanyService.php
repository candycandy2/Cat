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
    protected $dataChanged = false;
    protected $dataChangedArray = [];

    /**
     * CompanyService constructor.
     * @param CompanyRepository $CompanyRepository
     */
    public function __construct(CompanyRepository $CompanyRepository)
    {
        $this->CompanyRepository = $CompanyRepository;
    }

    /**
    * Get all Company data
    * @return mixed all Company data
    */
    public function getCompanyList()
    {
        return $this->CompanyRepository->getCompanyList();
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
    public function getCompanyData($column, $value)
    {
        return $this->CompanyRepository->getCompanyData($column, $value);
    }

    /**
    * Check if Company has exist
    * @return true / false
    */
    public function checkCompanyExist($companyName)
    {
        if ($this->CompanyRepository->checkCompanyExist($companyName) > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
    * Create Company data
    * @return true / false
    */
    public function createCompany($request, $auth)
    {
        return $this->CompanyRepository->createCompany($request, $auth);
    }

    /**
    * Update Company data
    * @return true / false
    */
    public function updateCompany($request, $auth)
    {
        $oldData = $this->CompanyRepository->getCompanyData("row_id", $request->input('rowID'));

        //Check which data has changed
        $this->dataChanged = false;
        $this->dataChangedArray = [];

        foreach ($oldData as $company) {
            $this->checkChanged("user_domain", $company->user_domain, $request->input('companyDomain'));
            $this->checkChanged("name", $company->name, $request->input('companyName'));
            $this->checkChanged("login_type", $company->login_type, $request->input('loginType'));
            $this->checkChanged("server_ip", $company->server_ip, $request->input('serverIP'));
            $this->checkChanged("server_port", $company->server_port, $request->input('serverPort'));
            $this->checkChanged("status", $company->status, $request->input('status'));
        }

        if ($this->dataChanged) {
            if ($this->CompanyRepository->updateCompany($request, $auth)) {

                //Success, write Log
                foreach ($this->dataChangedArray as $key => $value) {
                    $column = $key;

                    foreach ($value as $type => $val) {
                        if ($type == "old") {
                            $old = $val;
                        } else if ($type == "new") {
                            $new = $val;
                        }
                    }

                    $this->CompanyRepository->createLog($request->input('rowID'), $auth, $column, $old, $new);
                }

                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    /**
    * Check Company data changed
    */
    private function checkChanged($columnName, $oldData, $newData)
    {
        if ($oldData != $newData) {
            $this->dataChanged = true;
            $this->dataChangedArray[$columnName] = [
                "old" => $oldData,
                "new" => $newData
            ];
        }
    }
}