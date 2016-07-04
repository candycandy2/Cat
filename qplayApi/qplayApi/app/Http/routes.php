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

//for Test
Route::any('/test', function() {
    return view("test");
});
