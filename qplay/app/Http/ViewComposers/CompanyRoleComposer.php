<?php
namespace App\Http\ViewComposers;

use Illuminate\View\View;
use App\lib\CommonUtil;

class CompanyRoleComposer
{
    /**
     * 將資料綁定到視圖。
     *
     * @param  View  $view
     * @return void
     */
    public function compose(View $view)
    {
       $view->with('allCompanyRoleList', CommonUtil::getAllCompanyRoleList());
    }
}