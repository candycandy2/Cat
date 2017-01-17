@include("layouts.lang")
<?php
$menu_name = "APP_KEY_MANAGER";
?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="btn-toolbar" role="toolbar" style="float: right;">
            <a type="button" class="btn btn-default" href="appKeyManager">
                {{trans("messages.RETURN")}}
            </a>
        </div>
    </div>
    <div class="row">
        <div id="toolbar">
        <button type="button" class="btn btn-danger" style="display: none;" onclick="deleteCustomApi()" id="btnDeleteCustomApi">
            {{trans("messages.DELETE")}}
        </button>
        <a class="btn btn-primary" id="btnNewCustomApi" onclick="newCustomApi()">
            {{trans("messages.NEW")}}
        </a>
        </div>
        <table id="gridCustomApiList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbar"
               data-url="developer/getCustomApiList?app_row_id={{ app('request')->input('app_row_id') }}" data-height="398" data-pagination="true"
               data-show-refresh="false" data-row-style="rowStyle" data-search="false"
               data-show-toggle="false"  data-sortable="true"
               data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
               data-click-to-select="false" data-single-select="false">
            <thead>
            <tr>
                <th data-field="state" data-checkbox="true"></th>
                <th data-field="row_id" data-visible="false" data-searchable="false">ID</th>
                <th data-field="api_action" data-sortable="true" data-formatter="customApiActionFormatter">API Action</th>
                <th data-field="api_version" data-sortable="false">{{trans('messages.CUSTOM_API_VERSION')}}</th>
                <th data-field="api_url" data-sortable="true">API URL</th>
                <th data-field="api_url" data-sortable="true">QPlay Custom API Url</th>
            </tr>
            </thead>
        </table>
    </div>
    

    <script>
        function customApiActionFormatter(value, row){
            return '<a href="#" class="editCustomApi" data-rowid="'+ row.row_id  +'"> '+ value +'</a>';
        }

        var newCustomApi = function() {
            $("#tbxApiAction").val("");
            $("#tbxApiVersion").val("");
            $("#tbxApiUrl").val("");
            $("#customApiDialog").find('span.error').html("");
            $("#customApiDialogTitle").text("{{trans("messages.MSG_NEW_CUSTOM_API")}}");
            $("#customApiDialog").find('#saveCustomApi').attr('onclick','saveCustomApi("new")');
            $("#customApiDialog").modal('show');
        };

        var updateCustomApi = function(index,customApiRowId) {
            var currentData = $("#gridCustomApiList").bootstrapTable('getData');
            $("#tbxApiAction").val(currentData[index].api_action);
            $("#tbxApiVersion").val(currentData[index].api_version);
            $("#tbxApiUrl").val(currentData[index].api_url);
            $("#customApiDialog").find('span.error').html("");
            $("#customApiDialogTitle").text("{{trans("messages.MSG_EDIT_CUSTOM_API")}}");
            $("#customApiDialog").find('#saveCustomApi').attr('onclick','saveCustomApi("edit",'+index+')');
            $("#customApiDialog").modal('show');
        };

        $(function () {
            $('body').on('click','.editCustomApi',function(e) {  
                 $currentTarget = $(e.currentTarget);
                 var index = $currentTarget.parent().parent().data('index');
                 updateCustomApi(index, $currentTarget.data('rowid'));
            });
        });

    </script>
@endsection

@section('dialog_content')
    <div id="customApiDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="customApiDialogTitle">新增API</h1>
                </div>
                 <div class="modal-body">
                    <table style="width: 100%">
                        <tr>
                            <td>{{trans('messages.CUSTOM_API_ACTION')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiAction"
                                       id="tbxApiAction" value=""/>
                                <span style="color: red;" class="error" for="tbxApiAction"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.CUSTOM_API_VERSION')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiVersion"
                                       id="tbxApiVersion" value=""/>
                                <span style="color: red;" class="error" for="tbxApiVersion"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                            
                        </tr>
                         <tr>
                            <td>{{trans('messages.CUSTOM_API_URL')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiUrl"
                                       id="tbxApiUrl" value=""/>
                                <span style="color: red;" class="error" for="tbxApiUrl"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" id="saveCustomApi" onclick="saveCustomApi()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection