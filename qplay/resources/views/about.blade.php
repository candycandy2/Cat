<?php
use App\Http\Controllers\Config;
use App\lib\FilePath;

$menu_name = "ABOUT";

$deployJenkinsPath = FilePath::getDeployJenkinsPath();
$contents = "";
$showJenkinsInfo = false;
if(File::exists($deployJenkinsPath)){
    $showJenkinsInfo = true;
    $contents = File::get($deployJenkinsPath);
}
?>
@include("layouts.lang")
@extends('layouts.admin_template')
@section('content')
    <img src="{{ asset('/css/images/benq_logo.png') }}" style="width: 200px;padding: 20px;" />
    <p>{{trans("messages.SYS_VERSION")}}: {{\Config::get('app.version')}}
    @if(strtolower(\Config::get('app.env')) != 'production') - {{\Config::get('app.env')}}@endif</p>
    <p>{{trans("messages.SYS_SUGGEST_BROWSER")}}</p>
    @if($showJenkinsInfo)
    <p>{{trans("messages.JENKINS_DEPLOY_INFORMATION")}}: {{$contents}}</p>
    @endif
@endsection