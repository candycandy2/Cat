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


Route::any('/platform/getUserList', 'platformController@getUserList');
Route::any('/platform/removeUserRight', 'platformController@removeUserRight');
Route::any('/platform/saveUser', 'platformController@saveUser');

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
Route::any('accountDetailMaintain', ['middleware' => 'auth', function() {
    return view("user_maintain/account_detail_maintain");
}]);
Route::any('roleMaintain', ['middleware' => 'auth', function() {
    return view("user_maintain/role_maintain");
}]);
Route::any('about', ['middleware' => 'auth', function() {
    return view("about");
}]);
Route::any('push', ['middleware' => 'auth', function() {
    return view("push");
}]);
Route::any('androidAppMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/android");
}]);
Route::any('iosAppMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/ios");
}]);
Route::any('categoryMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/category_maintain");
}]);
Route::any('securitySetting', ['middleware' => 'auth', function() {
    return view("app_maintain/security_setting");
}]);
Route::any('menuMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/menu_maintain");
}]);
Route::any('groupMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/group_maintain");
}]);
Route::any('parameterMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/parameter_setting");
}]);
Route::any('projectMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/project_maintain");
}]);


Route::any('lang/{lang}/{uri}', function($lang, $uri) {
    //App::setLocale($lang);
    Session::set('lang', $lang);
    return redirect()->to(urldecode($uri));
});

