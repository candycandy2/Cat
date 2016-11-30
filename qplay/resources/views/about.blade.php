<?php
use App\Http\Controllers\Config;

$menu_name = "ABOUT";
?>
@include("layouts.lang")
@extends('layouts.admin_template')
@section('content')
    <img src="{{ asset('/css/images/benq_logo.png') }}" style="width: 200px;padding: 20px;" />
    <p>{{trans("messages.SYS_VERSION")}}: {{\Config::get('app.version')}}
    @if(strtolower(\Config::get('app.env')) != 'production') - {{\Config::get('app.env')}}@endif</p>
    <p>{{trans("messages.SYS_SUGGEST_BROWSER")}}</p>
@endsection

