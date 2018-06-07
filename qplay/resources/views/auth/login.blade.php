<?php
/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 2016/8/15
 * Time: 13:39
 */
?>
        <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>QPLay | Log in</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.6 -->
    <link href="{{ asset('/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <script src="{{ asset('/js/jquery-1.12.3.min.js') }}"></script>

    <link href="{{ asset('/dist/css/AdminLTE.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/plugins/iCheck/square/blue.css') }}" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="{{ asset('/bootstrap/css/font-awesome.min.css') }}" rel="stylesheet">
    {{--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">--}}
    <!-- Ionicons -->
    <link href="{{ asset('/bootstrap/css/ionicons.min.css') }}" rel="stylesheet">
    {{--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">--}}
    <!-- Theme style -->
    <!-- iCheck -->


    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="{{ asset('/oss/html5shiv.min.js') }}"></script>
    <script src="{{ asset('/oss/respond.min.js') }}"></script>
    <![endif]-->
    <style>
        .error{
            color:red;
        }
    </style>
</head>
<body class="hold-transition login-page">
<div class="login-box">
    <div class="login-logo">
        <b>QPlay</b>Playform
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
        <p class="login-box-msg">Sign in to start your session</p>

        <form action="login_process" method="post" id="loginForm">
            <div class="form-group has-feedback">
                <input type="text" class="form-control" placeholder="User Name" id="loginid" name="loginid" value="{{ old('loginid') }}">
                <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div class="form-group has-feedback">
                <input type="password" class="form-control" placeholder="Password" name="password" id="password">
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div class="form-group has-feedback">
                <select class="form-control darren-test" name="domain" id="domain">
                    @foreach($data as $company)
                        <option value="{{$company->user_domain}}">{{$company->name}}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group has-feedback">
                <select class="form-control" name="lang" id="lang">
                    <option value="en-us">English</option>
                    <option value="zh-cn">中文简体</option>
                    <option value="zh-tw" selected>中文繁體</option>
                </select>
            </div>
            <div class="row">
                <div class="col-xs-8">
                    <div class="checkbox icheck">
                        <label>
                            <input type="checkbox" name="remember" id="remember"> Remember Me
                        </label>
                    </div>
                </div>
                <!-- /.col -->
                <div class="col-xs-4">
                    <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
                </div>
                <!-- /.col -->
            </div>
        </form>



    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<!-- jQuery 2.2.3 -->
<script src="{{ asset('/plugins/jQuery/jquery-2.2.3.min.js') }}"></script>
<!-- Bootstrap 3.3.6 -->
<script src="{{ asset('/bootstrap/js/bootstrap.min.js') }}"></script>
<!-- iCheck -->
<script src="{{ asset('/plugins/iCheck/icheck.min.js') }}"></script>
<!---validator-->
<script src="{{ asset('/js/jquery.validate.min.js') }}"></script>

<script>
    $(function () {
        $(document).ajaxComplete(function(event,xhr,options){
            console.log(event);
        });

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });

        $("#loginForm").validate({
          rules:{
            loginid:{
                required:true,
            },
            password:{
                required:true
            },
            domain:{
                required:true
            },
            lang:{
                required:true
            }
          },
          errorPlacement:function(error, element){
                error.appendTo(element.parent('div'));
          }
        });

        //Remember Me
        var remember = "{{ Session::get('remember') }}";

        if (remember == "on") {
            $("#remember").prop("checked", true);
            $("#remember").parent().addClass("checked");
            $("#loginid").val("{{ Session::get('login_id') }}");
            $("#domain").val("{{ Session::get('domain') }}");
            $("#lang").val("{{ Session::get('lang') }}");
        }
    });
</script>
@include('layouts.message')
@include('layouts.message_js')
</body>
</html>

<!-- resources/views/auth/login.blade.php -->

{{--<form method="POST" action="login_process">--}}
{{--{!! csrf_field() !!}--}}

{{--<div>--}}
    {{--User Name--}}
    {{--<input type="text" name="loginid" value="{{ old('loginid') }}">--}}
{{--</div>--}}

{{--<div>--}}
    {{--Password--}}
    {{--<input type="password" name="password" id="password">--}}
{{--</div>--}}

{{--<div>--}}
    {{--<input type="checkbox" name="remember" id="remember"> Remember Me--}}
{{--</div>--}}

{{--<div>--}}
    {{--<button type="submit">Login</button>--}}
{{--</div>--}}
{{--</form>--}}
