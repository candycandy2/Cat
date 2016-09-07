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
Route::any('/platform/getRoleList', 'platformController@getRoleList');
Route::any('/platform/removeUserRight', 'platformController@removeUserRight');
Route::any('/platform/saveUser', 'platformController@saveUser');
Route::any('/platform/deleteRole', 'platformController@deleteRole');
Route::any('/platform/saveRole', 'platformController@saveRole');
Route::any('/platform/getRoleUsers', 'platformController@getRoleUsers');
Route::any('/platform/saveRoleUsers', 'platformController@saveRoleUsers');
Route::any('/platform/getRootMenuList', 'platformController@getRootMenuList');
Route::any('/platform/deleteMenu', 'platformController@deleteMenu');
Route::any('/platform/newMenu', 'platformController@newMenu');
Route::any('/platform/getSubMenuList', 'platformController@getSubMenuList');
Route::any('/platform/saveRootMenu', 'platformController@saveRootMenu');
Route::any('/platform/getGroupList', 'platformController@getGroupList');
Route::any('/platform/deleteGroup', 'platformController@deleteGroup');
Route::any('/platform/saveGroup', 'platformController@saveGroup');
Route::any('/platform/getGroupUsers', 'platformController@getGroupUsers');
Route::any('/platform/saveGroupUsers', 'platformController@saveGroupUsers');
Route::any('/platform/getParameterTypeList', 'platformController@getParameterTypeList');
Route::any('/platform/deleteParameterType', 'platformController@deleteParameterType');
Route::any('/platform/saveParameterType', 'platformController@saveParameterType');
Route::any('/platform/getParameterList', 'platformController@getParameterList');
Route::any('/platform/deleteParameter', 'platformController@deleteParameter');
Route::any('/platform/saveParameter', 'platformController@saveParameter');
Route::any('/platform/getMessageList', 'platformController@getMessageList');
Route::any('/platform/getMessageSendList', 'platformController@getMessageSendList');
Route::any('/platform/pushMessageImmediately', 'platformController@pushMessageImmediately');
Route::any('/platform/pushMessageImmediatelyAgain', 'platformController@pushMessageImmediatelyAgain');
Route::any('/platform/getSingleEventMessageReceiver', 'platformController@getSingleEventMessageReceiver');
Route::any('/platform/saveMessageVisible', 'platformController@saveMessageVisible');

Route::any('/AppMaintain/getCategoryList', 'AppMaintainController@getCategoryList');
Route::any('/AppMaintain/saveCategory', 'AppMaintainController@saveCategory');
Route::any('/AppMaintain/deleteCategory', 'AppMaintainController@deleteCategory');
Route::any('/AppMaintain/getCategoryAppsList', 'AppMaintainController@getCategoryAppsList');
Route::any('/AppMaintain/getOtherAppList', 'AppMaintainController@getOtherAppList');
Route::any('/AppMaintain/saveCategoryApps', 'AppMaintainController@saveCategoryApps');
Route::any('/AppMaintain/getBlockList', 'AppMaintainController@getBlockList');
Route::any('/AppMaintain/saveBlockList', 'AppMaintainController@saveBlockList');
Route::any('/AppMaintain/deleteBlockList', 'AppMaintainController@deleteBlockList');
Route::any('/AppMaintain/getWhiteList', 'AppMaintainController@getWhiteList');





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
Route::any('roleUsersMaintain', ['middleware' => 'auth', function() {
    return view("user_maintain/role_users_maintain");
}]);

Route::any('about', ['middleware' => 'auth', function() {
    return view("about");
}]);
Route::any('push', ['middleware' => 'auth', function() {
    return view("push");
}]);

Route::any('newMessage', ['middleware' => 'auth', function() {
    return view("push_new_message");
}]);
Route::any('messagePushHistory', ['middleware' => 'auth', function() {
    return view("push_history");
}]);
Route::any('pushSendDetail', ['middleware' => 'auth', function() {
    return view("push_send_detail_message");
}]);
Route::any('androidAppMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/android");
}]);
Route::any('iosAppMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/ios");
}]);


Route::any('AppMaintain', ['middleware' => 'auth', 'uses' => 'AppMaintainController@appList']);
Route::any('AppMaintain/appDetail', ['middleware' => 'auth', 'uses' => 'AppMaintainController@appDetail']);

Route::any('categoryMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/category_maintain");
}]);
Route::any('categoryAppsMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/category_apps_maintain");
}]);
Route::any('securitySetting', ['middleware' => 'auth', function() {
    return view("app_maintain/security_setting");
}]);
Route::any('menuMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/menu_maintain");
}]);
Route::any('rootMenuDetailMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/root_menu_detail_maintain");
}]);
Route::any('groupMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/group_maintain");
}]);
Route::any('groupDetailMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/group_detail_maintain");
}]);
Route::any('groupUsersMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/group_users_maintain");
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

