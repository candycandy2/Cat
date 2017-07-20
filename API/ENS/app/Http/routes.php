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

Route::any('/v101/ens/getAuthority', 'UserController@getAuthority');
Route::any('/v101/ens/getBasicInfo', 'BasicInfoController@getBasicInfo');
Route::any('/v101/ens/newEvent', 'EventController@newEvent');
Route::any('/v101/ens/getEventList', 'EventController@getEventList');
Route::any('/v101/ens/getUnrelatedEventList', 'EventController@getUnrelatedEventList');
Route::any('/v101/ens/getEventDetail', 'EventController@getEventDetail');
Route::any('/v101/ens/updateEvent', 'EventController@updateEvent');
Route::any('/v101/ens/updateEventStatus', 'EventController@updateEventStatus');
Route::any('/v101/ens/updateTaskStatus', 'TaskController@updateTaskStatus');
Route::any('/v101/ens/getMessageCount', 'MessageController@getMessageCount');

Route::any('v101/ens/uploaBasicInfo','BasicInfoController@uploaBasicInfo');
//Route::any('v101/ens/basicInfoMaintain','BasicInfoController@basicInfoMaintain');
//Route::any('v101/ens/registerSuperUserToMessage','BasicInfoController@registerSuperUserToMessage');

//for developer test
Route::any('v101/ens/testEns','testController@testEns');
Route::any('v101/ens/sendPushMessageToUser','testController@sendPushMessageToUser');
