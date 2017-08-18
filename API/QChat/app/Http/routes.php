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
Route::group(['prefix' => 'v101/QChat','middleware' => ['api','verify.basic']], function () {
    Route::any('/getQList','FriendController@getQList');
    Route::any('/getQFriend','FriendController@getQFriend');
    Route::any('/setQFriend','FriendController@setQFriend');
    Route::any('/sendQInvitation','FriendController@sendQInvitation');
    Route::any('/sendQInstall','FriendController@sendQInstall');
    Route::any('/getQUserDetail','FriendController@getQUserDetail');
    Route::any('/removeQFriend','FriendController@removeQFriend');
    Route::any('/acceptQInvitation','FriendController@acceptQInvitation');
    Route::any('/rejectQInvitation','FriendController@rejectQInvitation');
    Route::any('/newQChatroom','ChatRoomController@newQChatroom');
    
});

//Job
Route::any('v101/QChat/getQGroupHistoryMessageJob','ChatRoomController@getQGroupHistoryMessageJob');