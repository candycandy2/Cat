@include("layouts.lang")
<?php
$menu_name = "APP_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
	<div id="toolbar">
		<button id="btnNew" type="button" class="btn btn-primary" onclick="newApp()">
          {{trans("messages.NEW_APP")}}
        </button>
    </div>
     <table id="gridAppList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="" data-height="600" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="row_id" data-sortable="false" data-visible="false">ID</th>
            <th data-field="icon_url" data-sortable="false" data-formatter="iconFormatter">{{trans("messages.ICON")}}</th>
            <th data-field="app_name" data-sortable="true" data-formatter="appEditFormatter">{{trans("messages.APP_NAME")}}</th>
            <th data-field="package_name" data-sortable="true">{{trans("messages.APP_PACKAGE_NAME")}}</th>
            <th data-field="updated_at" data-sortable="true">{{trans("messages.LAST_UPDATED_DATE")}}</th>
            <th data-field="released" data-sortable="true">{{trans("messages.RELEASED")}}</th>
        </tr>
        </thead>
    </table>

<script>
	function iconFormatter(value, row) {
	    return '<img src="' + row.icon_url + '" class="img-rounded"  width="90" height="90">';
	};

    function appEditFormatter(value, row){
        var path = '{{asset('appDetailMaintain?id=')}}' + row.row_id;
        return '<a href="' + path + '" </a>' + value;
    }

	var newApp = function(){
		 $("#newAppDialog").find('.modal-title').text('{{trans('messages.NEW_APP')}}');
		 $("#newAppDialog").modal('show');
	}


	var sendMainInfo = function() {
        var appKey = $("#ddlAppkey").val();
        var appName = $("#tbxAppName").val();
        var lang = $("#ddlLang").val();
        if(appKey == "" || appName == "" || lang =="") {
            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
            return false;
        }

        window.location='{{asset('appDetailMaintain')}}';
    };

	$(function () {
	    $('#gridAppList').bootstrapTable({
	        data: {!!$data['appList']!!}
	    });
	});
</script>
@endsection


@section('dialog_content')
<div id="newAppDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="newAppDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <form id="newAppForm">
                        <table style="width:100%">
                            <tr>
                                <td>{{trans("messages.APP_KEY")}}:</td>
                                <td style="padding: 10px;">
                                    <select name="ddlAppKey" id="ddlAppKey" class="form-control">
                                        <option value="" disabled selected>{{trans("messages.SELECT_APP_KEY")}}</option>
                                        @foreach($data['projectInfo'] as $pInfo)
                                            <option value="{{$pInfo->row_id}}">{{$pInfo->app_key}}</option>
                                        @endforeach
                                    </select>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td>{{trans("messages.APP_NAME")}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" data-clear-btn="true" class="form-control" name="tbxAppName"
                                           id="tbxAppName" value="" required="required"/>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td>{{trans("messages.DEFAULT_LANG")}}:</td>
                                <td style="padding: 10px;">
                                    <select name="ddlLang" id="ddlLang" onchange="" class="form-control" required="required">
                                        @foreach($data['langList'] as $lList)
                                            <option value="{{$lList->row_id}}">{{$lList->lang_desc}}</option>
                                        @endforeach
                                    </select>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                        </table>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="sendMainInfo()">{{trans("messages.NEW")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CANCEL")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
