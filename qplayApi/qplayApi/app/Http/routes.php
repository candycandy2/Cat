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

//Route::get('/', function () {
//    return view('welcome');
//});

//QPlay Api
Route::any('/v101/qplay/getSecurityList', 'qplayController@getSecurityList');
Route::any('/v101/qplay/register', 'qplayController@register');
Route::any('/v101/qplay/unregister', 'qplayController@unregister');
Route::any('/v101/qplay/isRegister', 'qplayController@isRegister');
Route::any('/v101/qplay/login', 'qplayController@login');
Route::any('/v101/qplay/logout', 'qplayController@logout');
Route::any('/v101/qplay/checkAppVersion', 'qplayController@checkAppVersion');
Route::any('/v101/qplay/getAppList', 'qplayController@getAppList');
Route::any('/v101/qplay/getMessageList', 'qplayController@getMessageList');
Route::any('/v101/qplay/getMessageDetail', 'qplayController@getMessageDetail');
Route::any('/v101/qplay/updateMessage', 'qplayController@updateMessage');
Route::any('/v101/qplay/sendPushToken', 'qplayController@sendPushToken');
Route::any('/v101/qplay/renewToken', 'qplayController@renewToken');
Route::any('/v101/qplay/updateLastMessageTime', 'qplayController@updateLastMessageTime');
Route::post('/v101/qplay/sendPushMessage', 'qplayController@sendPushMessage');

Route::any('/v101/qplay/isLogin', 'qplayController@isLogin');
Route::any('/v101/qplay/logoutSmartFactory', 'qplayController@logoutSmartFactory');

//Login Page
Route::any('/qplayauth_register', function() {
    return view("login");
});

//YellowPage
Route::any('/v101/yellowpage/QueryEmployeeData', 'yellowpageController@QueryEmployeeData');
Route::any('/v101/yellowpage/QueryEmployeeDataDetail', 'yellowpageController@QueryEmployeeDataDetail');
Route::any('/v101/yellowpage/AddMyPhoneBook', 'yellowpageController@AddMyPhoneBook');
Route::any('/v101/yellowpage/DeleteMyPhoneBook', 'yellowpageController@DeleteMyPhoneBook');
Route::any('/v101/yellowpage/QueryMyPhoneBook', 'yellowpageController@QueryMyPhoneBook');
Route::any('/v101/yellowpage/QueryCompanyData', 'yellowpageController@QueryCompanyData');


//for Test
Route::any('/test', function() {
    return view("test");
});
Route::any('/testYellowpage', function() {
    return view("testyellowpage");
});
