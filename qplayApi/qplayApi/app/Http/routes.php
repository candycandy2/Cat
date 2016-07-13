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

Route::any('/v101/qplay/getSecturityList', 'qplayController@getSecturityList');
Route::any('/v101/qplay/register', 'qplayController@register');
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
Route::post('/v101/qplay/sendPushMessage', 'qplayController@sendPushMessage');

//for Test
Route::any('/test', function() {
    return view("test");
});
