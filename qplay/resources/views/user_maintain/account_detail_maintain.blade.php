@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "USER_ACCOUNT_MAINTAIN";
$input = Input::get();
$userLoginId = $input["login_id"];
?>
@extends('layouts.admin_template')
@section('content')
    {{$userLoginId}}
@endsection

