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

Route::group(['middleware' => ['api','locale','verify.basic','log.api']], function () {
    Route::group(['prefix' => 'v101/picture'], function () {
       Route::POST('/upload','PictureController@uploadPicture');
    });
    Route::group(['prefix' => 'v101/sastoken'], function () {
       Route::GET('/{resource}','AccessController@getSASToken');
    });
    Route::group([], function () {
        Route::POST('v101/portrait','PortraitController@uploadPortrait');
        Route::DELETE('v101/portrait','PortraitController@deletePortrait');
    });
});

Route::group(['middleware' => ['api','log.api']], function () {
    Route::POST('v101/picture/delete','PictureController@deleteFile');
 });