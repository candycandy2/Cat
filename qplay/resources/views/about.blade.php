@include("layouts.lang")
<?php
$menu_name = "ABOUT";
?>
@extends('layouts.admin_template')
@section('content')
    <img src="{{ asset('/css/images/benq_logo.png') }}" style="width: 200px;padding: 20px;" />
    <p>{{trans("messages.SYS_VERSION")}}: 1.0.0</p>
    <p>{{trans("messages.SYS_SUGGEST_BROWSER")}}</p>
@endsection

