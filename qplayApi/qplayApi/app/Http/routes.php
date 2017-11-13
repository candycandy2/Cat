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
/*
 * change locale for every request
 * */
if (array_key_exists('lang',$_GET)){
    App::setLocale($_GET["lang"]);
}

Route::any('/v101/qplay/getIpInfo', 'qplayController@getIpInfo');

//QPlay Api
Route::any('/v101/qplay/getSecurityList', 'qplayController@getSecurityList');
Route::any('/v101/qplay/register', 'qplayController@register');
Route::any('/v101/qplay/unregister', 'qplayController@unregister');
Route::any('/v101/qplay/isRegister', 'qplayController@isRegister');
Route::any('/v101/qplay/login', 'qplayController@login');
Route::any('/v101/qplay/logout', 'qplayController@logout');
Route::any('/v101/qplay/checkAppVersionIntra', 'qplayController@checkAppVersionIntra');
Route::any('/v101/qplay/checkAppVersion', 'qplayController@checkAppVersion');
Route::any('/v101/qplay/getAppList', 'qplayController@getAppList');
Route::any('/v101/qplay/getMessageList', 'qplayController@getMessageList');
Route::any('/v101/qplay/getMessageDetail', 'qplayController@getMessageDetail');
Route::any('/v101/qplay/updateMessage', 'qplayController@updateMessage');
Route::any('/v101/qplay/sendPushToken', 'qplayController@sendPushToken');
Route::any('/v101/qplay/renewToken', 'qplayController@renewToken');
Route::any('/v101/qplay/updateLastMessageTime', 'qplayController@updateLastMessageTime');
Route::any('/v101/qplay/addDownloadHit', 'qplayController@addDownloadHit');
Route::post('/v101/qplay/sendPushMessage', 'qplayController@sendPushMessage');

Route::group(['prefix' => 'v101/qplay','middleware' => ['log.api']], function () {
    Route::post('/addAppLog', 'appLogController@addAppLog');
});

//Smart Factory
Route::any('/v101/qplay/isLogin', 'qplayController@isLogin');
Route::any('/v101/qplay/logoutSmartFactory', 'qplayController@logoutSmartFactory');

//Login Page
Route::any('/qplayauth_register', function() {
    return view("login");
});

//Custom
Route::any('/{api_version}/custom/{app_key}/{function}', 'customController@processRequest');

//MongoTest
Route::any('/mongo', 'mongoController@Test');

//OTA
Route::any('/v101/qplay/deleteAppFile', 'appVersionController@deleteAppFile');
Route::any('/v101/qplay/deleteAppFileFromPublish', 'appVersionController@deleteAppFileFromPublish');
Route::any('/v101/qplay/uploadAppFile', 'appVersionController@uploadAppFile');
Route::any('/v101/qplay/copyAppFileToPublish', 'appVersionController@copyAppFileToPublish');

//YellowPage
/*Route::any('/v101/yellowpage/QueryEmployeeData', 'yellowpageController@QueryEmployeeData');
Route::any('/v101/yellowpage/QueryEmployeeDataDetail', 'yellowpageController@QueryEmployeeDataDetail');
Route::any('/v101/yellowpage/AddMyPhoneBook', 'yellowpageController@AddMyPhoneBook');
Route::any('/v101/yellowpage/DeleteMyPhoneBook', 'yellowpageController@DeleteMyPhoneBook');
Route::any('/v101/yellowpage/QueryMyPhoneBook', 'yellowpageController@QueryMyPhoneBook');
Route::any('/v101/yellowpage/QueryCompanyData', 'yellowpageController@QueryCompanyData');*/



//RRS
/*Route::any('/v101/rrs/ListAllManager', 'rrsController@ListAllManager');
Route::any('/v101/rrs/ListAllMeetingRoom', 'rrsController@ListAllMeetingRoom');
Route::any('/v101/rrs/ListAllTime', 'rrsController@ListAllTime');
Route::any('/v101/rrs/QueryMyReserve', 'rrsController@QueryMyReserve');
Route::any('/v101/rrs/QueryReserveDetail', 'rrsController@QueryReserveDetail');
Route::any('/v101/rrs/QuickReserve', 'rrsController@QuickReserve');
Route::any('/v101/rrs/ReserveCancel', 'rrsController@ReserveCancel');
Route::any('/v101/rrs/ReserveMeetingRoom', 'rrsController@ReserveMeetingRoom');*/

//for Test
Route::any('/test', function() {
    return view("test");
});
Route::any('/testYellowpage', function() {
    return view("testyellowpage");
});
