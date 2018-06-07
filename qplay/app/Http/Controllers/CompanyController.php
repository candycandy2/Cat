<?php
/**
 * Company Maintain - Controller
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\Services\CompanyService;
use Auth;

class CompanyController extends Controller
{

    protected $companyService;

    /**
     * CompanyController constructor.
     * @param CompanyService $companyService
     */
    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    /**
     * Company List View
     * @return view
     */
    public function companyList()
    {
        return view("company_maintain/company_list");
    }

    /**
     * Return Company List
     * @return mixed All Company Data 
     */
    public function getCompanyList()
    {
        $companyList = $this->companyService->getCompanyList();

        return response()->json($companyList);
    }

    /**
     * Create Company Data
     * @return json
     */
    public function newCompany(Request $request, Auth $auth)
    {
        //Check if Data has exist
        if ($this->companyService->checkCompanyExist($request->input('companyName'))) {
            return response()->json(['result_code' => ResultCode::_000920_companyExist]);
        } else {
            //Create New Company Data
            if ($this->companyService->createCompany($request, $auth)) {
                //Create Success
                return response()->json(['result_code' => ResultCode::_1_reponseSuccessful]);
            } else {
                //Create Fail
                return response()->json(['result_code' => "Fail"]);
            }
        }
    }

    /**
     * Update Company Data
     * @return json
     */
    public function updateCompany(Request $request, Auth $auth)
    {
        //Update Company Data
        if ($this->companyService->updateCompany($request, $auth)) {
            //Update Success
            return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful]);
        } else {
            //Update Fail
            return response()->json(['result_code'=>"Fail"]);
        }
    }

}

?>