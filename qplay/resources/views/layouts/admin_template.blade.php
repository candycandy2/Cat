<?php
use Illuminate\Support\Facades\Input;
/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 2016/8/15
 * Time: 17:09
 */
//date_default_timezone_set('PRC');
$oriMenuList = Auth::user()->getMenuList();
$menuList = array();
$breadList = ['Home'];
$exist = false;
$showTitle = true;
if($menu_name == 404) {
    $exist = true;
    $showTitle = false;
}
foreach ($oriMenuList as $menu) {
    if($menu->pId == 0) {
        $menu->subMenuList = array();
        if($menu->Name == $menu_name) {
            $exist = true;
            $menu->Active = true;
            array_push($breadList, trans('messages.TITLE_'.$menu->Name));
        } else {
            $menu->Active = false;
        }
        $menuList[$menu->sequence] = $menu;
        foreach ($oriMenuList as $submenu) {
            if($submenu->pId == $menu->Id) {
                $menu->subMenuList[$submenu->sequence] = $submenu;
                if($submenu->Name == $menu_name) {
                    $exist = true;
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
        ksort($menu->subMenuList);
    }
}
ksort($menuList);

$title = trans('messages.TITLE_'.$menu_name);
$withMessage = false;
$withMsgId = -1;
$input = Input::get();
if(array_key_exists('with_msg_id', $input)) {
    $withMessage = true;
    $withMsgId= $input['with_msg_id'];
}

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
    <link href="{{ asset('/bootstrap/css/bootstrap-switch.css') }}" rel="stylesheet">
    <link href="{{ asset('/bootstrap/css/bootstrap-datetimepicker.css') }}" rel="stylesheet">
    <link href="{{ asset('/ui/css/jquery-ui.min.css') }}" rel="stylesheet">
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
    <link href="{{ asset('/css/common.css') }}" rel="stylesheet">
    <!---Highcharts-5.0.11-->
    {{--<link rel="stylesheet" href="style.css">--}}
    <script src="{{ asset('/plugins/jQuery/jquery-2.2.3.min.js') }}"></script>
    <script src="{{ asset('/js/common.js') }}"></script>
    <script src="{{ asset('/js/jquery.validate.min.js') }}"></script>
    <script src="{{ asset('/ui/js/jquery-ui.min.js') }}"></script>
    <script src="{{ asset('/js/jquery.cookie.js') }}"></script>
    <script src="{{ asset('/js/jquery.json.js') }}"></script>
    <script src="{{ asset('/js/jquery.ba-resize.js') }}"></script>
    <script src="{{ asset('/js/lang/'.App::getLocale().'/messages.js') }}"></script>
    <script src="{{ asset('/js/lang/'.App::getLocale().'/validation.js') }}"></script>
    <script src="{{ asset('/js/highstock.js') }}"></script>
    <script src="{{ asset('/js/highcharts-more.js') }}"></script>
    {{-- <script src="{{ asset('/Highcharts-5.0.11/code/js/modules/exporting.js') }}"></script> --}}
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="{{ asset('/oss/html5shiv.min.js') }}"></script>
    <script src="{{ asset('/oss/respond.min.js') }}"></script>
    <![endif]-->
    @section('head')
    @show
</head>
<body class="skin-blue fixed" data-spy="scroll" data-target="#scrollspy">
<div class="wrapper">
    <header class="main-header">
        <!-- Logo -->
        <!-- Logo -->
        <a href="#" class="logo">{{Auth::user()->login_id}}</a>
    {{--{{date_default_timezone_get()}}--}}
    {{--{{date('Y-m-d H:i:s',time())}}--}}
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
            @if(strtolower(\Config::get('app.env')) != 'production')
            <span class="head-version">{{\Config::get('app.version')}} - {{\Config::get('app.env')}}</span>
            @endif
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
                            <li><a href="{{asset('lang/en-us/'.Route::current()->getUri().urlencode('?'.Request::getQueryString()))}}">English</a></li>
                            <li><a href="{{asset('lang/zh-cn/'.Route::current()->getUri().urlencode('?'.Request::getQueryString()))}}">简体中文</a></li>
                            <li><a href="{{asset('lang/zh-tw/'.Route::current()->getUri().urlencode('?'.Request::getQueryString()))}}">繁體中文</a></li>
                        </ul>
                    </li>
                    <li>
                        <a onclick="logout()" href="#">{{trans('messages.LOGOUT' )}}</a>
                    </li>
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
                        <a href="{{asset($menu->Url)}}"><i class="fa fa-circle-o"></i> {{$menu->sName}}</a>
                        @if(count($menu->subMenuList) > 0)
                            <ul class="nav treeview-menu">
                                @foreach ($menu->subMenuList as $submenu)
                                    <li
                                            @if($submenu->Active)
                                                class="active"
                                            @endif><a href="{{asset($submenu->Url)}}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$submenu->sName}}</a></li>
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
                @if($showTitle){{$title}}@endif
            </h1>
            <ol class="breadcrumb">
                <i class="fa fa-dashboard"></i>&nbsp;
                @foreach ($breadList as $bread)
                    <li> {{$bread}}</li>
                @endforeach
            </ol>
        </div>

        <!-- Main content -->
        <div class="content body" id="pageContent">

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

    @yield('dialog_content')
    @include("layouts.message")
    @include("layouts.confirm")

</div><!-- ./wrapper -->

<!-- jQuery 2.2.3 -->
{{--<script src="../plugins/jQuery/jquery-2.2.3.min.js"></script>--}}
<!-- Bootstrap 3.3.6 -->
<script src="{{ asset('/bootstrap/js/bootstrap.min.js') }}"></script>
{{--<script src="../bootstrap/js/bootstrap.min.js"></script>--}}
<script src="{{ asset('/bootstrap/js/bootstrap-table.js') }}"></script>
<script src="{{ asset('/bootstrap/js/bootstrap-switch.js') }}"></script>
<script src="{{ asset('/bootstrap/js/bootstrap-datetimepicker.js') }}"></script>
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
<script>
    var clID = '{{Auth::user()->login_id}}';
    var cLang = "en-us";
    @if(\Session::has('lang') && \Session::get("lang") != "")
        cLang = "{{\Session::get("lang")}}";
    @endif
    var bootstrapTableFormatter_en_US = {
        formatLoadingMessage: function () {
            return 'Loading, please wait...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s <span class="pagging_per_page">rows per page</span>', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatDetailPagination: function (totalRows) {
            return sprintf('Showing %s rows', totalRows);
        },
        formatSearch: function () {
            return 'Search';
        },
        formatNoMatches: function () {
            return 'No matching records found';
        },
        formatPaginationSwitch: function () {
            return 'Hide/Show pagination';
        },
        formatRefresh: function () {
            return 'Refresh';
        },
        formatToggle: function () {
            return 'Toggle';
        },
        formatColumns: function () {
            return 'Columns';
        },
        formatAllRows: function () {
            return 'All';
        }
    };
    var bootstrapTableFormatter_zh_CN = {
        formatLoadingMessage: function () {
            return '加载中, 请稍等...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s <span class="pagging_per_page">笔记录每页</span>', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('显示 %s 到 %s 笔记录, 共 %s 笔记录', pageFrom, pageTo, totalRows);
        },
        formatDetailPagination: function (totalRows) {
            return sprintf('显示 %s 笔记录', totalRows);
        },
        formatSearch: function () {
            return '查询';
        },
        formatNoMatches: function () {
            return '没有匹配的记录';
        },
        formatPaginationSwitch: function () {
            return '显示/隐藏分页';
        },
        formatRefresh: function () {
            return '刷新';
        },
        formatToggle: function () {
            return '切换';
        },
        formatColumns: function () {
            return '列';
        },
        formatAllRows: function () {
            return '全部';
        }
    };
    var bootstrapTableFormatter_zh_TW = {
        formatLoadingMessage: function () {
            return '加載中, 請稍等...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s <span class="pagging_per_page">筆記錄每頁</span>', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('顯示 %s 到 %s 筆記錄, 共 %s 筆記錄', pageFrom, pageTo, totalRows);
        },
        formatDetailPagination: function (totalRows) {
            return sprintf('顯示 %s 筆記錄', totalRows);
        },
        formatSearch: function () {
            return '查詢';
        },
        formatNoMatches: function () {
            return '沒有匹配的記錄';
        },
        formatPaginationSwitch: function () {
            return '顯示/隱藏分頁';
        },
        formatRefresh: function () {
            return '刷新';
        },
        formatToggle: function () {
            return '切換';
        },
        formatColumns: function () {
            return '列';
        },
        formatAllRows: function () {
            return '全部';
        }
    };

    var sprintf = function (str) {
        var args = arguments,
                flag = true,
                i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var changeBootstrapTableFormatter = function (current, target) {
        current.formatLoadingMessage = target.formatLoadingMessage;
        current.formatRecordsPerPage = target.formatRecordsPerPage;
        current.formatShowingRows = target.formatShowingRows;
        current.formatDetailPagination = target.formatDetailPagination;
        current.formatSearch = target.formatSearch;
        current.formatNoMatches = target.formatNoMatches;
        current.formatPaginationSwitch = target.formatPaginationSwitch;
        current.formatRefresh = target.formatRefresh;
        current.formatToggle = target.formatToggle;
        current.formatColumns = target.formatColumns;
        current.formatAllRows = target.formatAllRows;
    };
    $(function() {
        @if(!$exist)
                window.location.href = "404";
        @endif

        @if($withMessage)
        showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.".$withMsgId)}}");
        @endif

        var currentBootstrapTableLang = bootstrapTableFormatter_en_US;
        if(cLang == "zh-cn") {
            currentBootstrapTableLang = bootstrapTableFormatter_zh_CN;
        } else if(cLang == "zh-tw") {
            currentBootstrapTableLang = bootstrapTableFormatter_zh_TW;
        }

        $(".bootstrapTable").each(function(i, table) {
            if($(this).attr("id") != "gridAllUserList") {
                if($.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___S")) {
                    var s = $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___S");
                    $(this).bootstrapTable('getOptions').pageSize = s;
                }
            }

            changeBootstrapTableFormatter($(this).bootstrapTable('getOptions'), currentBootstrapTableLang);
        });

        try {
            if(!tableSelectChangedFunctionList) {
                tableSelectChangedFunctionList = new Array();
            }
        } catch(e){
            tableSelectChangedFunctionList = new Array();
        }
        try {
            tableSelectChangedFunctionList.push(selectedChanged);
        } catch(e){
        }

        $(".content-wrapper").resize(function () {
            $('.bootstrapTable').bootstrapTable('resetView');
        });

        $('.bootstrapTable').on('search.bs.table', function(e, text) {
            $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___ST", text);
        });

        $('.bootstrapTable').on('load-success.bs.table', function() {
            $('.bootstrapTable').off('page-change.bs.table');
            var setDefault = true;
            if($(this).attr("id") == 'gridAllUserList' || $(this).attr("id") =='gridUserList' ||
               $(this).bootstrapTable('getOptions').sidePagination == 'server'){
                setDefault = false;
            }
            if(setDefault) {
                if ($.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___ST")) {
                    var st = $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___ST");
                    $(this).bootstrapTable('resetSearch', st); //resetSearch
                }

                if($.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___P")) {
                    var p = $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___P");
                    $(this).bootstrapTable('selectPage', p);
                    $(this).parent().parent().find(".page-number").each(function(m, liPage) {
                        var $a = $(liPage).first("a");
                        if($a.text() == p) {
                            $(liPage).addClass("active");
                            return false;
                        }
                    });
                    //page-number active
                }
            }

            $('.bootstrapTable').on('page-change.bs.table', function(e ,page, size) {
                try {
                    //selectedChanged();
                    for(var i = 0; i < tableSelectChangedFunctionList.length; i++) {
                        tableSelectChangedFunctionList[i]();
                    }
                } catch (err) {}

                $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___P", page);
                $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___S", size);
            });
        });

        $('.bootstrapTable').on('page-change.bs.table', function(e ,page, size) {
            try {
                //selectedChanged();
                for(var i = 0; i < tableSelectChangedFunctionList.length; i++) {
                    tableSelectChangedFunctionList[i]();
                }
            } catch (err) {}

            $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___P", page);
            $.cookie(clID + "___" + location.pathname + "___" + $(this).attr("id") + "___S", size);
        });


        var extSessionStorage = function(namespace){
            var sessionStorage = window.sessionStorage || {}; //為sessionStorage作向下相容
            if(typeof namespace !== "string") {
                    throw new Error("extSessionStorage: Namespace must be a string");
            }
            var getRealKey = function(key){ //產生正確的sessionStorage key
                    return [namespace,".",key].join('');
            };
            var mainFunction = function(key, value){
                    var realKey = getRealKey(key);
                    if(value === undefined){
                            return sessionStorage[realKey];
                    } else {
                            return sessionStorage[realKey] = value;
                    }
            };
            mainFunction.remove = function(key){
                    var realKey = getRealKey(key);
                    delete sessionStorage[realKey];
            };
            return mainFunction;
        };

        window.ExtSessionStorage = extSessionStorage; //開啟對外入口，此範例會開在window.ExtSessionStorage
    });

    var logout = function () {
        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_LOGOUT")}}", "", function () {
            hideConfirmDialog();

            window.location.href = "{{asset('auth/logout')}}";
        });
    };

    var getByteLength = function (str) {
        return str.replace(/[^\x00-\xff]/g,"aaa").length;
    };     
</script>
</body>
</html>

