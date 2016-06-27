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

//for Test
Route::any('/test', function() {
//    $csrf_token = csrf_token();
//    $form = <<<FORM
//        <form action="v101/qplay/getSecturityList" method="POST">
//            <input type="hidden" name="_token" value="{$csrf_token}">
//            <input type="submit" value="Test">
//        </form>
//FORM;
//    return $form;
    return view("test");
});
