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

Route::group(['prefix' => 'v101/picture','middleware' => ['api','locale','verify.basic','log.api']], function () {
    Route::POST('/upload','PictureController@uploadPicture');
});

Route::group(['prefix' => 'v101/sastoken','middleware' => ['api','locale','verify.basic','log.api']], function () {
    Route::GET('/{resource}','AccessController@getSASToken');
});

// Route::GET('v101/sastoken/{resource}','AccessController@getSASToken');