<?php
/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 2016/8/15
 * Time: 17:09
 */
$oriMenuList = Auth::user()->getMenuList();
$menuList = array();
$breadList = ['Home'];
foreach ($oriMenuList as $menu) {
    if($menu->pId == 0) {
        $menu->subMenuList = array();
        if($menu->Name == $menu_name) {
            $menu->Active = true;
            array_push($breadList, trans('messages.TITLE_'.$menu->Name));
        } else {
            $menu->Active = false;
        }
        array_push($menuList, $menu);
        foreach ($oriMenuList as $submenu) {
            if($submenu->pId == $menu->Id) {
                array_push($menu->subMenuList, $submenu);
                if($submenu->Name == $menu_name) {
                    $submenu->Active = true;
                    $menu->Active = true;
                    if(!in_array(trans('messages.TITLE_'.$menu->Name), $breadList)) {
                        array_push($breadList, trans('messages.TITLE_'.$menu->Name));
                    }
                    array_push($breadList, trans('messages.TITLE_'.$submenu->Name));
                } else {
                    $submenu->Active = false;
                }
            }
        }
    }
}

$title = trans('messages.TITLE_'.$menu_name);

?>

        <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>QPlay - {{$title}}</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.6 -->
    <link href="{{ asset('/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/bootstrap/css/bootstrap-table.min.css') }}" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="{{ asset('/bootstrap/css/font-awesome.min.css') }}" rel="stylesheet">
    {{--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">--}}
    <!-- Ionicons -->
    <link href="{{ asset('/bootstrap/css/ionicons.min.css') }}" rel="stylesheet">
    {{--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">--}}
    <!-- Theme style -->
    <link href="{{ asset('/dist/css/AdminLTE.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/dist/css/skins/_all-skins.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/bootstrap/css/style.css') }}" rel="stylesheet">
    {{--<link rel="stylesheet" href="style.css">--}}
    <script src="{{ asset('/plugins/jQuery/jquery-2.2.3.min.js') }}"></script>
    <script src="{{ asset('/js/jquery.json.js') }}"></script>
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="{{ asset('/oss/html5shiv.min.js') }}"></script>
    <script src="{{ asset('/oss/respond.min.js') }}"></script>
    <![endif]-->
</head>
<body class="skin-blue fixed" data-spy="scroll" data-target="#scrollspy">
<div class="wrapper">

    <header class="main-header">
        <!-- Logo -->
        <!-- Logo -->
        <a href="#" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            {{--<span class="logo-mini"><b>A</b>LT</span>--}}
            <!-- logo for regular state and mobile devices -->
            Hello, {{Auth::user()->login_id}}
        </a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
            <!-- Navbar Right Menu -->
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            @if(App::getLocale() == 'zh-cn')
                                中文简体
                            @elseif(App::getLocale() == 'zh-tw')
                                中文繁體
                            @else
                                English
                            @endif
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="lang/en-us/{{urlencode(Route::current()->getUri())}}">English</a></li>
                            <li><a href="lang/zh-cn/{{urlencode(Route::current()->getUri())}}">简体中文</a></li>
                            <li><a href="lang/zh-tw/{{urlencode(Route::current()->getUri())}}">繁體中文</a></li>
                        </ul>
                    </li>
                    <li><a href="auth/logout">{{trans('messages.LOGOUT' )}}</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <div class="sidebar" id="scrollspy">

            <!-- sidebar menu: : style can be found in sidebar.less -->
            <ul class="nav sidebar-menu">
                <li class="header">{{trans('messages.MENU')}}</li>

                @foreach ($menuList as $menu)
                    <li class="treeview
                        @if($menu->Active)
                            active
                        @endif" id="scrollspy-components">
                        <a href="{{$menu->Url}}"><i class="fa fa-circle-o"></i> {{$menu->sName}}</a>
                        @if(count($menu->subMenuList) > 0)
                            <ul class="nav treeview-menu">
                                @foreach ($menu->subMenuList as $submenu)
                                    <li
                                            @if($submenu->Active)
                                                class="active"
                                            @endif><a href="{{$submenu->Url}}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$submenu->sName}}</a></li>
                                @endforeach
                            </ul>
                        @endif
                    <li>
                @endforeach

                {{--<li class="treeview active" id="scrollspy-components" >--}}
                    {{--<a href="javascript:void(0)"><i class="fa fa-circle-o"></i> 用戶管理</a>--}}
                    {{--<ul class="nav treeview-menu">--}}
                        {{--<li class="active"><a href="accountMaintain">賬號管理</a></li>--}}
                        {{--<li><a href="roleMaintain">企業角色管理</a></li>--}}
                    {{--</ul>--}}
                {{--</li>--}}
            </ul>
        </div>
        <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <div class="content-header">
            <h1>
                {{$title}}
            </h1>
            <ol class="breadcrumb">
                <i class="fa fa-dashboard"></i>&nbsp;
                @foreach ($breadList as $bread)
                    <li> {{$bread}}</li>
                @endforeach
            </ol>
        </div>

        <!-- Main content -->
        <div class="content body">

            @yield('content')

        </div><!-- /.content -->
    </div><!-- /.content-wrapper -->



    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark">
        <!-- Create the tabs -->
        <div class="pad">
            This is an example of the control sidebar.
        </div>
    </aside><!-- /.control-sidebar -->
    <!-- Add the sidebar's background. This div must be placed
         immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>

    @include("layouts.message")
    @include("layouts.confirm")
</div><!-- ./wrapper -->

<!-- jQuery 2.2.3 -->
{{--<script src="../plugins/jQuery/jquery-2.2.3.min.js"></script>--}}
<!-- Bootstrap 3.3.6 -->
<script src="{{ asset('/bootstrap/js/bootstrap.min.js') }}"></script>
{{--<script src="../bootstrap/js/bootstrap.min.js"></script>--}}
<script src="{{ asset('/bootstrap/js/bootstrap-table.js') }}"></script>
<!-- FastClick -->
<script src="{{ asset('/plugins/fastclick/fastclick.min.js') }}"></script>
{{--<script src="../plugins/fastclick/fastclick.min.js"></script>--}}
<!-- AdminLTE App -->
<script src="{{ asset('/dist/js/app.min.js') }}"></script>
{{--<script src="../dist/js/app.min.js"></script>--}}
<!-- SlimScroll 1.3.0 -->
<script src="{{ asset('/plugins/slimScroll/jquery.slimscroll.min.js') }}"></script>
{{--<script src="../plugins/slimScroll/jquery.slimscroll.min.js"></script>--}}
{{--<script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js"></script>--}}
{{--<script src="docs.js"></script>--}}
</body>
</html>

