<!DOCTYPE html>
<html>
    <head>
        <title>ENS</title>
        <!-- Bootstrap 3.3.1 -->
        <link href="{{ asset('/bootstrap/3.3.1/css/bootstrap.min.css') }}" rel="stylesheet">
        <!-- JQuery 1.12.3-->
        <script src="{{ asset('/js/jquery-1.12.3.min.js') }}"></script>
        <script src="{{ asset('/bootstrap/3.3.1/js/bootstrap.min.js') }}"></script>
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="{{ asset('/oss/html5shiv.min.js') }}"></script>
        <script src="{{ asset('/oss/respond.min.js') }}"></script>
        <![endif]-->
    </head>
    <body>
       <nav class="navbar navbar-inverse navbar-static-top">
        <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand" href="#">EventNotificationSystem</a>
            </div>
        </div>
       </nav>
       <div class="container-fluid">
            @yield('content')
       </div>
       @include('layouts.message')
    </body>
</html>