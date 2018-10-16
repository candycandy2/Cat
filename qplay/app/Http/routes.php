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

/*
 * change locale for every request from url or session
 * */
if (array_key_exists('lang',$_GET)){
    App::setLocale($_GET["lang"]);
}else if(!empty(session('lang'))){
    App::setLocale(session('lang'));
}

Route::any('/platform/getUserList', ['middleware' => 'auth','uses'=>'platformController@getUserList']);
Route::any('/platform/getUserListWithoutGroup', ['middleware' => 'auth','uses'=>'platformController@getUserListWithoutGroup']);
Route::any('/platform/getRoleList', ['middleware' => 'auth','uses'=>'platformController@getRoleList']);
Route::any('/platform/removeUserRight', ['middleware' => 'auth','uses'=>'platformController@removeUserRight']);
Route::any('/platform/saveUser', ['middleware' => 'auth','uses'=>'platformController@saveUser']);
Route::any('/platform/deleteRole', ['middleware' => 'auth','uses'=>'platformController@deleteRole']);
Route::any('/platform/saveRole', ['middleware' => 'auth','uses'=>'platformController@saveRole']);
Route::any('/platform/getRoleUsers', ['middleware' => 'auth','uses'=>'platformController@getRoleUsers']);
Route::any('/platform/saveRoleUsers', ['middleware' => 'auth','uses'=>'platformController@saveRoleUsers']);
Route::any('/platform/getRootMenuList', ['middleware' => 'auth','uses'=>'platformController@getRootMenuList']);
Route::any('/platform/deleteMenu', ['middleware' => 'auth','uses'=>'platformController@deleteMenu']);
Route::any('/platform/newMenu', ['middleware' => 'auth','uses'=>'platformController@newMenu']);
Route::any('/platform/saveMenuSequence', ['middleware' => 'auth','uses'=>'platformController@saveMenuSequence']);
Route::any('/platform/getSubMenuList', ['middleware' => 'auth','uses'=>'platformController@getSubMenuList']);
Route::any('/platform/saveRootMenu', ['middleware' => 'auth','uses'=>'platformController@saveRootMenu']);
Route::any('/platform/getGroupList', ['middleware' => 'auth','uses'=>'platformController@getGroupList']);
Route::any('/platform/deleteGroup', ['middleware' => 'auth','uses'=>'platformController@deleteGroup']);
Route::any('/platform/saveGroup', ['middleware' => 'auth','uses'=>'platformController@saveGroup']);
Route::any('/platform/getGroupUsers', ['middleware' => 'auth','uses'=>'platformController@getGroupUsers']);
Route::any('/platform/saveGroupUsers', ['middleware' => 'auth','uses'=>'platformController@saveGroupUsers']);
Route::any('/platform/getParameterTypeList', ['middleware' => 'auth','uses'=>'platformController@getParameterTypeList']);
Route::any('/platform/deleteParameterType', ['middleware' => 'auth','uses'=>'platformController@deleteParameterType']);
Route::any('/platform/saveParameterType', ['middleware' => 'auth','uses'=>'platformController@saveParameterType']);
Route::any('/platform/getParameterList', ['middleware' => 'auth','uses'=>'platformController@getParameterList']);
Route::any('/platform/deleteParameter', ['middleware' => 'auth','uses'=>'platformController@deleteParameter']);
Route::any('/platform/saveParameter', ['middleware' => 'auth','uses'=>'platformController@saveParameter']);

//push
Route::any('/push/getMessageList', ['middleware' => 'auth','uses'=>'pushController@getMessageList']);
Route::any('/push/saveNewMessage', ['middleware' => 'auth','uses'=>'pushController@saveNewMessage']);
Route::any('/push/getMessageSendList', ['middleware' => 'auth','uses'=>'pushController@getMessageSendList']);
Route::any('/push/saveMessageVisible', ['middleware' => 'auth','uses'=>'pushController@saveMessageVisible']);
Route::any('/push/pushMessageImmediatelyAgain', ['middleware' => 'auth','uses'=>'pushController@pushMessageImmediatelyAgain']);
Route::any('/push/saveUpdateMessage', ['middleware' => 'auth','uses'=>'pushController@saveUpdateMessage']);
Route::any('/push/saveUpdateAndPushMessage',['middleware' => 'auth','uses'=> 'pushController@saveUpdateAndPushMessage']);
Route::any('/push/getSingleEventMessageReceiver', ['middleware' => 'auth','uses'=>'pushController@getSingleEventMessageReceiver']);
Route::any('/push/getSecretaryMessageList', ['middleware' => 'auth','uses'=>'pushController@getSecretaryMessageList']);
Route::any('/push/pushSecretaryMessage', ['middleware' => 'auth','uses'=>'pushController@pushSecretaryMessage']);

Route::any('/platform/getProjectList', ['middleware' => 'auth','uses'=>'platformController@getProjectList']);
Route::any('/platform/deleteProject', ['middleware' => 'auth','uses'=>'platformController@deleteProject']);
Route::any('/platform/newProject', ['middleware' => 'auth','uses'=>'platformController@newProject']);
Route::any('/platform/updateProject', ['middleware' => 'auth','uses'=>'platformController@updateProject']);
Route::any('/platform/sendProjectInformation', ['middleware' => 'auth','uses'=>'platformController@sendProjectInformation']);

//appMaintain
Route::any('/AppMaintain/getBlockList', ['middleware' => 'auth','uses'=>'AppMaintainController@getBlockList']);
Route::any('/AppMaintain/saveBlockList', ['middleware' => 'auth','uses'=>'AppMaintainController@saveBlockList']);
Route::any('/AppMaintain/deleteBlockList', ['middleware' => 'auth','uses'=>'AppMaintainController@deleteBlockList']);
Route::any('/AppMaintain/saveAppMainData', ['middleware' => 'auth','uses'=>'AppMaintainController@saveAppMainData']);
Route::any('/AppMaintain/getWhiteList', ['middleware' => 'auth','uses'=>'AppMaintainController@getWhiteList']);
Route::any('/AppMaintain/getCustomApi', ['middleware' => 'auth','uses'=>'AppMaintainController@getCustomApi']);
Route::any('/AppMaintain/getAppUser', ['middleware' => 'auth','uses'=>'AppMaintainController@getAppUser']);
Route::any('/AppMaintain/getAppVersionList', ['middleware' => 'auth','uses'=>'AppMaintainController@getAppVersionList']);
Route::any('/AppMaintain/saveAppDetail', ['middleware' => 'auth','uses'=>'AppMaintainController@saveAppDetail']);
Route::any('/AppMaintain/getMaintainAppList', ['middleware' => 'auth','uses'=>'AppMaintainController@getMaintainAppList']);
Route::any('/AppVersion/getAppOnlineVersion', ['middleware' => 'auth','uses'=>'AppVersionController@getAppOnlineVersion']);
Route::any('/AppVersion/getAppNewVersion', ['middleware' => 'auth','uses'=>'AppVersionController@getAppNewVersion']);
Route::any('/AppVersion/getAppHistoryVersion', ['middleware' => 'auth','uses'=>'AppVersionController@getAppHistoryVersion']);
Route::any('/AppVersion/ajxValidVersion', ['middleware' => 'auth','uses'=>'AppVersionController@ajxValidVersion']);

//App Category
Route::any('categoryAppsMaintain', ['middleware' => 'auth','uses'=>'App\AppCategoryController@categoryAppsMaintain']);
Route::any('app/category/getCategoryList', ['middleware' => 'auth','uses'=>'App\AppCategoryController@getCategoryList']);
Route::any('app/category/saveCategory', ['middleware' => 'auth','uses'=>'App\AppCategoryController@saveCategory']);
Route::any('app/category/deleteCategory', ['middleware' => 'auth','uses'=>'App\AppCategoryController@deleteCategory']);
Route::any('app/category/getCategoryAppsList', ['middleware' => 'auth','uses'=>'App\AppCategoryController@getCategoryAppsList']);
Route::any('app/category/saveCategoryApps', ['middleware' => 'auth','uses'=>'App\AppCategoryController@saveCategoryApps']);
Route::any('app/category/getOtherAppList', ['middleware' => 'auth','uses'=>'App\AppCategoryController@getOtherAppList']);



//Report
Route::any('report/reportAppList/getReportAppList', ['middleware' => 'auth','uses'=>'Report\ReportAppListController@getReportAppList']);
Route::any('report/reportDetail', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getApiReport']);
Route::any('report/reportDetail/getCallApiReport', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getCallApiReport']);
Route::any('report/reportDetail/getApiOperationTimeReport', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getApiOperationTimeReport']);
Route::any('report/reportDetail/getApiOperationTimeDetailReport', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getApiOperationTimeDetailReport']);
Route::any('report/reportDetail/getRegisterDailyReport', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getRegisterDailyReport']);
Route::any('report/reportDetail/getRegisterCumulativeReport', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getRegisterCumulativeReport']);
Route::any('report/reportDetail/getActiveRegisterReport', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getActiveRegisterReport']);
Route::any('report/reportDetail/getPushServiceRank', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getPushServiceRank']);
Route::any('report/reportDetail/getPushServicReportEndDate', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getPushServicReportEndDate']);
Route::any('report/reportDetail/getMessageReadReport', ['middleware' => 'auth','uses'=>'Report\ReportDetailController@getMessageReadReport']);

//ENS Maintain
Route::any('ENSMaintain/getBasicInfo', ['middleware' => 'auth','uses'=>'ENSMaintain\BasicInfoController@getBasicInfo']);
Route::any('ENSMaintain/getUserGroupInfo', ['middleware' => 'auth','uses'=>'ENSMaintain\BasicInfoController@getUserGroupInfo']);
Route::any('ENSMaintain/uploadBasicInfo', ['middleware' => 'auth','uses'=>'ENSMaintain\BasicInfoController@uploadBasicInfo']);

//Login Page
Route::any('auth/login', 'AuthController@loginView');

Route::any('404', function() {
    return view("404");
});

Route::any('/', 'AuthController@checkLogin');
Route::any('auth/checkLogin', 'AuthController@checkLogin');
Route::any('auth/login_process', 'AuthController@authenticate');
Route::any('auth/logout', 'AuthController@logout');

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

//push views
Route::any('push', ['middleware' => 'auth', function() {
    return view("push/push");
}]);
Route::any('newMessage', ['middleware' => 'auth', function() {
    return view("push/push_new_message");
}]);
Route::any('messagePushHistory', ['middleware' => 'auth', function() {
    return view("push/push_history");
}]);
Route::any('pushSendDetail', ['middleware' => 'auth', function() {
    return view("push/push_send_detail_message");
}]);
Route::any('updateMessage', ['middleware' => 'auth', function() {
    return view("push/push_update_message");
}]);

//secretary push views
Route::any('secretaryPush', ['middleware' => 'auth', function() {
    return view("push/secretary_push");
}]);
Route::any('secretaryPushNew', ['middleware' => 'auth', function() {
    return view("push/secretary_push_new");
}]);

Route::any('androidAppMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/android");
}]);
Route::any('iosAppMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/ios");
}]);

Route::any('AppMaintain', ['middleware' => 'auth', 'uses' => 'AppMaintainController@appList']);
Route::any('appDetailMaintain', ['middleware' => 'auth', 'uses' => 'AppMaintainController@appDetail']);

Route::any('categoryMaintain', ['middleware' => 'auth', function() {
    return view("app_maintain/category_maintain");
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
Route::any('projectDetailMaintain', ['middleware' => 'auth', function() {
    return view("sys_maintain/project_detail_maintain");
}]);
Route::any('report', ['middleware' => 'auth', function() {
    return view("report/report_app_list");
}]);
Route::any('basicInfo', ['middleware' => 'auth', function() {
    return view("ens_maintain/basic_info");
}]);

//companyMaintain
Route::any('companyMaintain', ['middleware' => 'auth','uses'=>'CompanyController@companyList']);
Route::any('companyMaintain/getCompanyList', ['middleware' => 'auth','uses'=>'CompanyController@getCompanyList']);
Route::any('companyMaintain/newCompany', ['middleware' => 'auth','uses'=>'CompanyController@newCompany']);
Route::any('companyMaintain/updateCompany', ['middleware' => 'auth','uses'=>'CompanyController@updateCompany']);

//Function Mantain
Route::any('functionMaintain', ['middleware' => 'auth','uses'=>'FunctionController@functionList']);
Route::any('functionMaintain/getFunctionList', ['middleware' => 'auth','uses'=>'FunctionController@getFunctionList']);
Route::any('functionMaintain/newFunction', ['middleware' => 'auth','uses'=>'FunctionController@newFunction']);
Route::any('functionMaintain/editFunction', ['middleware' => 'auth','uses'=>'FunctionController@editFunction']);
Route::any('functionMaintain/updateFunction', ['middleware' => 'auth','uses'=>'FunctionController@updateFunction']);
Route::any('functionMaintain/getUserFunctionList', ['middleware' => 'auth','uses'=>'FunctionController@getUserFunctionList']);

//QPay Maintain
Route::group(['prefix' => 'QPayStoreMaintain'], function () {
    Route::any('QPayStorePoint', ['middleware' => 'auth','uses'=>'qpayController@QPayStorePoint']);
    Route::any('uploadPointExcel', ['middleware' => 'auth','uses'=>'qpayController@uploadPointExcel']);
    Route::any('newPointStore', ['middleware' => 'auth','uses'=>'qpayController@newPointStore']);
    Route::any('QPayStoreRecord', ['middleware' => 'auth','uses'=>'qpayController@QPayStoreRecord']);
    Route::any('getQPayStoreRecordList', ['middleware' => 'auth','uses'=>'qpayController@getQPayStoreRecordList']);
    Route::any('downloadPointExcel', ['middleware' => 'auth','uses'=>'qpayController@downloadPointExcel']);
    Route::any('QPayStoreEmployee', ['middleware' => 'auth','uses'=>'qpayController@QPayStoreEmployee']);
    Route::any('getQPayPointGetRecordList', ['middleware' => 'auth','uses'=>'qpayController@getQPayPointGetRecordList']);
});

Route::any('/lang/{lang}/{uri}', function($lang, $uri){
  Session::set('lang', $lang);
  return redirect()->to(urldecode($uri));
})->where('uri','.*');

Route::any('testJpush', ['middleware' => 'auth', function() {
    return view("test/jpush_test");
}]);
//Route::any('test/jpushTest', 'testController@jpushTest');
Route::any('test/jpushTest', ['middleware' => 'auth','uses'=>'testController@jpushTest']);

Route::any('toolSyncJpushTags', ['middleware' => 'auth', function() {
    return view("tool/sync_jpush_tags_tool");
}]);
//Route::any('tool/syncJpushTags', 'toolController@syncJpushTags');
Route::any('tool/syncJpushTags', ['middleware' => 'auth','uses'=>'toolController@syncJpushTags']);
Route::any('tool/getRegisterList', ['middleware' => 'auth','uses'=>'toolController@getRegisterList']);
Route::any('tool/removeDeviceRegistedData', ['middleware' => 'auth','uses'=>'toolController@removeDeviceRegistedData']);
Route::any('registerMaintain', ['middleware' => 'auth', function() {
    return view("tool/register_maintain_tool");
}]);

//AutoDeplay
Route::post('auto/uploadAppVersion', 'AppVersionController@uploadAppVersion');

//Pushservice
Route::any('/pushBatchService'          ,'pushController@pushBatchService');
Route::any('/getPushBatchServiceList'   ,'pushController@getPushBatchServiceList');
Route::any('/getdata'                   ,'pushController@newPushBatchData');

