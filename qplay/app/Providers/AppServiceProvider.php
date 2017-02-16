<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Validator;
use DB;
use App\lib\CommonUtil;

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

        Validator::extend('is_app_key_unique', function($attribute, $value, $parameters, $validator) {
            $existList = \DB::connection('mysql_production')->table("qp_project")->where("app_key", '=', CommonUtil::getContextAppKey('production',$value))->select()->get();
            if(count($existList) > 0) {
                return false;
            }
            return true;
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
