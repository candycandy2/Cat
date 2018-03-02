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

Route::group(['prefix' => 'v101/QForum','middleware' => ['api','verify.basic']], function () {
    Route::POST('/getPostId','PostController@getPostId');
    Route::POST('/newPost','PostController@newPost');
    Route::POST('/deletePost','PostController@deletePost');
    Route::POST('/getPostList','PostController@getPostList');
    Route::POST('/modifyPost','PostController@modifyPost');
    Route::POST('/getPostDetails','PostController@getPostDetails');
    Route::POST('/subscribePost','SubscribeController@subscribePost');
    Route::POST('/newComment','CommentController@newComment');
    Route::POST('/modifyComment','CommentController@modifyComment');
    Route::POST('/deleteComment','CommentController@deleteComment');
    Route::POST('/getBoardTypeList','BoardController@getBoardTypeList');
    Route::POST('/getBoardList','BoardController@getBoardList');
    Route::POST('/editBoard','BoardController@editBoard');
});