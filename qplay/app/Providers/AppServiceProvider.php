<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Validator;
use DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {   
        Validator::extend('is_user_exist', function($attribute, $value, $parameters, $validator) {
            $pmList = \DB::table("qp_user") -> where('login_id', '=', $value) ->select('row_id') ->get();
            if(count($pmList) > 0) {
                return true;
            }
            return false;
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
