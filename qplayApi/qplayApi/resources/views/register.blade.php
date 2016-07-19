@extends('app')

@section('content')
    <?php
    $csrf_token = csrf_token();

    ?>
    <div data-role="page">
        <div role="main" class="ui-content" style="text-align: center;">
            <img src="{{asset('/css/images/benq_logo.png')}}" style="width:25%; margin:20px;" />
            <h3>Your device has been verified</h3>
            <div style="width:60%; margin: 0 auto; margin-top:40px;">
                <img src="{{asset('/css/images/icon_ok.png')}}" style="200px; margin:20px;" />
                <h4>The cancellation of the device,
                    please contact with BenQ ITS</h4>
                <button class="ui-btn ui-btn-corner-all" style="color:white;background-color: #3c3c75;font-family: Arial;"
                        onclick="start()">OK, I Know</button>
            </div>
        </div>
        <div data-role="popup" id="dlgMessage"
             data-overlay-theme="b" data-theme="b" data-dismissible="true" style="max-width:400px;">
            <div data-role="header" data-theme="a">
                <h1>Error</h1>
            </div>
            <div role="main" class="ui-content">
                <p id="messageContainer"></p>
            </div>
        </div>
    </div>
    <script>
        var showMessage = function (msg) {
            $("#messageContainer").text(msg);
            $("#dlgMessage").popup('open');
        }

        var getQueryString =function (name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        }

        var start = function() {

        }

        var browser = {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                };
            }(),
        }
    </script>
@endsection


