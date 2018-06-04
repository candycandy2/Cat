<?php
/**
 * Company Maintain - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QP_Company;
use App\Model\QP_Company_Log;
use DB;

class CompanyRepository
{
    protected $company;
    protected $companyLog;

    /**
     * CompanyRepository constructor.
     * @param QP_Company $company
     * @param QP_Company_Log $companyLog
     */
    public function __construct(QP_Company $company, QP_Company_Log $companyLog)
    {     
        $this->company = $company;
        $this->companyLog = $companyLog;
    }

    /**
     * Get all Company data
     * @return mixed all Company data 
     */
    public function getCompanyList()
    {
        return  $this->company
            -> select('row_id', 'user_domain', 'name', 'login_type', 'server_ip', 'server_port', 'status')
            -> get();
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
            -> where($column, '=', $rowID)
            -> get();
    }

    /**
    * Check if Company has exist
    * @return true / false
    */
    public function checkCompanyExist($companyName)
    {
        return  $this->company
            -> where('name', '=', $companyName)
            -> get()
            -> count();
    }

    /**
    * Create Company
    * @return save() result
    */
    public function createCompany($request, $auth)
    {
        $this->company->user_domain = $request->input('companyDomain');
        $this->company->name = $request->input('companyName');
        $this->company->login_type = $request->input('loginType');
        $this->company->server_ip = $request->input('serverIP');
        $this->company->server_port = $request->input('serverPort');
        $this->company->created_user = $auth::user()->row_id;
        $this->company->created_at = date('Y-m-d H:i:s',time());

        return $this->company->save();
    }

    /**
    * Update Company
    * @return save() result
    */
    public function updateCompany($request, $auth)
    {
        $company = $this->company::find($request->input('rowID'));
        $company->user_domain = $request->input('companyDomain');
        $company->name = $request->input('companyName');
        $company->login_type = $request->input('loginType');
        $company->server_ip = $request->input('serverIP');
        $company->server_port = $request->input('serverPort');
        $company->status = $request->input('status');
        $company->updated_user = $auth::user()->row_id;
        $company->updated_at = date('Y-m-d H:i:s',time());

        return $company->save();
    }

    /**
    * Create Log
    */
    public function createLog($rowID, $auth, $column, $old, $new)
    {
        //For for-loop SQL Command, need to New Class Object,
        //otherwise only the last SQL Command will succeed.
        $this->companyLog = New QP_Company_Log;
        $this->companyLog->company_row_id = $rowID;
        $this->companyLog->user_row_id = $auth::user()->row_id;
        $this->companyLog->change_action = $column;
        $this->companyLog->old_data = $old;
        $this->companyLog->new_data = $new;
        $this->companyLog->created_at = date('Y-m-d H:i:s',time());

        return $this->companyLog->save();
    }

}