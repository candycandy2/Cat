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

//API
Route::group(['prefix' => 'v101/QChat','middleware' => ['api','verify.basic','log.api']], function () {
    Route::POST('/getQList','FriendController@getQList');
    Route::POST('/getQFriend','FriendController@getQFriend');
    Route::POST('/setQFriend','FriendController@setQFriend');
    Route::POST('/sendQInvitation','FriendController@sendQInvitation');
    Route::POST('/sendQInstall','FriendController@sendQInstall');
    Route::POST('/removeQFriend','FriendController@removeQFriend');
    Route::POST('/acceptQInvitation','FriendController@acceptQInvitation');
    Route::POST('/rejectQInvitation','FriendController@rejectQInvitation');
    Route::POST('/newQChatroom','ChatRoomController@newQChatroom');
    Route::POST('/setQChatroom','ChatRoomController@setQChatroom');
    Route::POST('/addQMember','ChatRoomController@addQMember');
    Route::POST('/removeQMember','ChatRoomController@removeQMember');
    Route::POST('/getQUserDetail','UserController@getQUserDetail');
    Route::POST('/setQUserDetail','UserController@setQUserDetail');
    Route::POST('/sendPushToken','PushController@sendPushToken');
    Route::POST('/getQGroupHistoryMessage','HistoryController@getQGroupHistoryMessage');
});

//Job
Route::group(['prefix' => 'v101/QChat','middleware' => 'log.api'], function () {
    Route::any('/getQGroupHistoryMessageJob','HistoryJobController@getQGroupHistoryMessageJob');
});