<?php
namespace App\Http\ViewComposers;

use Illuminate\View\View;
use App\lib\CommonUtil;

class CompanyRoleComposer
{
    /**
     * bind data to view
     *
     * @param  View  $view
     * @return void
     */
    public function compose(View $view)
    {
       $view->with('allCompanyRoleList', CommonUtil::getAllCompanyRoleList());
    }
}