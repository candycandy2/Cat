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

Route::group(['prefix' => 'v101/qplay','middleware' => ['log.api']], function () {
    Route::any('/getSecurityList', 'qplayController@getSecurityList');
    Route::any('/register', 'qplayController@register');
    Route::any('/unregister', 'qplayController@unregister');
    Route::any('/isRegister', 'qplayController@isRegister');
    Route::any('/login', 'qplayController@login');
    Route::any('/logout', 'qplayController@logout');
    Route::any('/checkAppVersionIntra', 'qplayController@checkAppVersionIntra');
    Route::any('/checkAppVersion', 'qplayController@checkAppVersion');
    Route::any('/getAppList', 'qplayController@getAppList');
    Route::any('/getMessageList', 'qplayController@getMessageList');
    Route::any('/getMessageDetail', 'qplayController@getMessageDetail');
    Route::any('/updateMessage', 'qplayController@updateMessage');
    Route::any('/sendPushToken', 'qplayController@sendPushToken');
    Route::any('/renewToken', 'qplayController@renewToken');
    Route::any('/updateLastMessageTime', 'qplayController@updateLastMessageTime');
    Route::post('/sendPushMessage', 'qplayController@sendPushMessage');
    Route::post('/addAppLog', 'appLogController@addAppLog');
    Route::any('/addDownloadHit', 'qplayController@addDownloadHit');
});

//Smart Factory
Route::any('/v101/qplay/isLogin', 'qplayController@isLogin');
Route::any('/v101/qplay/logoutSmartFactory', 'qplayController@logoutSmartFactory');

//Login Page
Route::any('/qplayauth_register', function() {
    return view("login");
});

//Custom
Route::any('/{api_version}/custom/{app_key}/{function}', ['middleware' => 'log.custom.api',
    'uses'=>'customController@processRequest']);

//MongoTest
Route::any('/mongo', 'mongoController@Test');

//OTA
Route::any('/v101/qplay/deleteAppFile', 'appVersionController@deleteAppFile');
Route::any('/v101/qplay/deleteAppFileFromPublish', 'appVersionController@deleteAppFileFromPublish');
Route::any('/v101/qplay/uploadAppFile', 'appVersionController@uploadAppFile');
Route::any('/v101/qplay/copyAppFileToPublish', 'appVersionController@copyAppFileToPublish');

//for Test
Route::any('/test', function() {
    return view("test");
});
Route::any('/testYellowpage', function() {
    return view("testyellowpage");
});
