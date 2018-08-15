<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ComposerServiceProvider extends ServiceProvider
{
    /**
     * register all binds to container
     * @return void
     */
    public function boot()
    {
        // use object type view composer
        view()->composer(
            ['wideget.company_selection', 'wideget.role_selection'], 'App\Http\ViewComposers\CompanyRoleComposer'
        );
    }

    /**
     * register service provider
     *
     * @return void
     */
    public function register()
    {
        //
    }
}