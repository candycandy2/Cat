<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ComposerServiceProvider extends ServiceProvider
{
    /**
     * 在容器內註冊所有綁定。
     *
     * @return void
     */
    public function boot()
    {
        // 使用物件型態的視圖組件
        view()->composer(
            ['wideget.company_selection', 'wideget.role_selection'], 'App\Http\ViewComposers\CompanyRoleComposer'
        );
    }

    /**
     * 註冊服務提供者。
     *
     * @return void
     */
    public function register()
    {
        //
    }
}