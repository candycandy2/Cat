@include("layouts.lang")
<?php
$menu_name = "APP_MAINTAIN";
$detail_path    = "app_maintain.app_detail";
$pic_path       = $detail_path.'.app_pic';
$version_path   = $detail_path.'.app_version';

?>
@extends('layouts.admin_template')
@section('content')
    <style>
        .tab-content {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            background-color: #fff;
            padding:20px;
        }
        .label-hint {
            color: #fff;
            background-color: #333;
            border-radius: 3px;
            padding: 6px 12px;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            border: 1px solid transparent;
        }
        table.costum-table { 
            border-collapse: separate;
            width: 100%;
            max-width: 100%;
            margin-bottom: 20px;
            text-align: center;
        }
        .icon-preview{
            background: url() no-repeat center 50% #FFFAD9;
            border-width:3px;
            border-style:dashed;
            border-color:#FFAC55;
            cursor: pointer;
            text-align:center;
            padding-top:40px;
            width: 120px; 
            height: 120px;
        }
        .screen-preview{
            background: url() no-repeat center 50% #FFFAD9;
            border-width:3px;
            border-style:dashed;
            border-color:#FFAC55;
            cursor: pointer;
            text-align:center;
            padding-top:140px;
            width: 200px; 
            height: 320px;
        }
        table.costum-table td { border: 1px solid #ddd; padding: 8px; }
        table.costum-table tr:first-child{font-weight:bold;}
        table.costum-table tr:last-child{background-color: #f9f9f9;}
        table.costum-table tr:first-child td:first-child { border-top-left-radius: 3px;}
        table.costum-table tr:first-child td:last-child { border-top-right-radius: 3px;}
        table.costum-table tr:last-child td:first-child { border-bottom-left-radius: 3px;}
        table.costum-table tr:last-child td:last-child { border-bottom-right-radius: 3px; }
        
    </style>
    <div class="col-lg-12 col-xs-12 text-right">
        <span style="padding-right: 8px;  line-height: 50px;"> Android-Unpublish | IOS-Unpublish</span>
        <div class="btn-toolbar" role="toolbar" style="float: right;">
            <button type="button" class="btn btn-primary" onclick="SaveCategoryApps()">
                {{trans("messages.SAVE")}}
            </button>
            <a type="button" class="btn btn-default" href="AppMaintain">
                {{trans("messages.RETURN")}}
            </a>
        </div>
    </div>
    <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#tab_content_info" data-toggle="tab">應用程式資訊</a></li>
        <li role="presentation"><a href="#tab_content_pic" data-toggle="tab">圖示資訊</a></li>
        <li role="presentation"><a href="#tab_content_version" data-toggle="tab">版本控制</a></li>
        <li role="presentation"><a href="#tab_content_white_list" data-toggle="tab">白名單設定</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade in active" id="tab_content_info">
            @include($detail_path .'.info')
        </div> 
        <div class="tab-pane fade" id="tab_content_pic">
            @include($detail_path .'.app_pic.pic_main')
        </div>
        <div class="tab-pane fade" id="tab_content_version">
            @include($detail_path .'.app_version.version_main')
        </div>
        <div class="tab-pane fade" id="tab_content_white_list">
            @include($detail_path .'.white_list')
        </div>
    </div>

<script>
var newApi = function(){
	 $('#newApiDialog').modal('show');
}
var addLang = function(){
	 $('#addLangDialog').modal('show');
}
var delLang = function(){
	 $('#delLangDialog').modal('show');
}

var changDefaultLang = function(){
	 $('#changDefaultLangDialog').modal('show');
}
$('.js-switch-lang').click(function(){
	var editLang = $(this).text();
	var lanId = $(this).data('toggle');
    var source = $(this).parent().data('source');
    var $hintObj = $('#' + source);
	$hintObj.text(editLang);
	$('div.lang:visible').fadeOut('1500',function(){
		$('.js-lang-'+ lanId).fadeIn('1500');
	});	
});

$(function () {
    $('div.lang').hide();
    $('.js-lang-1').show();

    $("#file").change(function(){
         console.log($(this).val());
    });

    $(".js-img-file").click(function(){
        $('#fileIconUpload').trigger('click');
    })

});

</script>


@endsection


