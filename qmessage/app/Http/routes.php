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

//QMessage API
Route::any('/v101/qmessage/register', 'qmessageController@register');

Route::post('/v101/qmessage/group/add','qmessageController@addGroup');
Route::any('/v101/qmessage/group/delete','qmessageController@deleteGroup');
Route::any('/v101/qmessage/group/list','qmessageController@getGroupList');
Route::any('/v101/qmessage/group/members/add','qmessageController@addGroupMember');
Route::any('/v101/qmessage/group/members/delete','qmessageController@deleteGroupMember');
Route::any('/v101/qmessage/group/members/list','qmessageController@getGroupMemberList');

Route::any('/v101/qmessage/history/list','qmessageController@getMessageHistory');
//Private API
Route::post('/v101/qmessage/history/text','qmessageController@storeHistoryText');
Route::get('/v101/qmessage/history/pic/downloadfile','qmessageController@downloadFile');
Route::post('/v101/qmessage/history/pic','qmessageController@storeHistoryPic');

/**/

//Private API
Route::any('/v101/qmessage/pwd', 'qmessageController@getPasswordByUsername'); //根据usr获取pwd供client登录

//Page
Route::any('/test', function() {
    return view("test");
});
Route::get('/qmessage', function () {
    return view('qmessage');
});
Route::get('/testfunction', function () {
    return view('testFunction');
});


