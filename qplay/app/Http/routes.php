<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::any('auth/login', function() {
    return view("auth/login");
});

Route::any('auth/login_process', 'AuthController@authenticate');
Route::any('auth/logout', 'AuthController@logout');

Route::any('/', ['middleware' => 'auth', function() {
    return view("user_maintain/account_maintain");
}]);

Route::any('accountMaintain', ['middleware' => 'auth', function() {
    return view("user_maintain/account_maintain");
}]);
Route::any('roleMaintain', ['middleware' => 'auth', function() {
    return view("user_maintain/role_maintain");
}]);
Route::any('about', ['middleware' => 'auth', function() {
    return view("about");
}]);

Route::any('lang/{lang}/{uri}', function($lang, $uri) {
    //App::setLocale($lang);
    Session::set('lang', $lang);
    return redirect()->to(urldecode($uri));
});

