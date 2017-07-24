@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "APP_CATEGORY_MAINTAIN";
// var_dump($data);exit();
// $input = Input::get();
// $categoryId = $input["category_id"];
// $categoryInfo = \App\lib\CommonUtil::getCategoryInfoByRowId($categoryId);
?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <table>
                <tr>
                    <td>{{trans("messages.CATEGORY_NAME")}}:</td>
                    <td  id="tdCategoryName" class="text-bold" style="padding: 10px;">{{$data['categoryInfo']->app_category}}</td>
                </tr>
            </table>
        </div>

        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveCategoryApps()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="categoryMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            <div id="toolbar">
                <button type="button" class="btn btn-primary" onclick="AddApp()" id="btnAdd">
                    {{trans("messages.ADD_APP")}}
                </button>
            </div>

            <table id="gridAppList" class="bootstrapTable" data-toggle="table" 
                   data-sort-name="sequence" data-sort-order="desc" data-toolbar="#toolbar"
                   data-url="app/category/getCategoryAppsList?category_id={{$data['categoryId']}}" data-height="600" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="false" 
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="row_id" data-sortable="false" data-visible="false">ID</th>
                    <th data-field="sequence" data-sortable="false" data-visible="true" data-width="10px" data-formatter="seqFormatter">排序</th>
                    <th data-field="icon_url" data-sortable="false" data-formatter="iconFormatter">{{trans("messages.ICON")}}</th>
                    <th data-field="app_name" data-sortable="true" data-formatter="appNameFormatter">{{trans("messages.APP_NAME")}}</th>
                    <th data-field="updated_at" data-formatter="updateDateFormatter" data-sortable="true">{{trans("messages.LAST_UPDATED_DATE")}}</th>
                    <th data-field="released" data-sortable="false" data-formatter="releasedFormatter">{{trans("messages.RELEASED")}}</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
    <style type="text/css">
        .myDragClass {
            background-color: #7fb4e2;
            color: white;
        }
    </style>
    <script src="{{ asset('/js/jquery.tablednd.js') }}"></script>
    <script>
        var i=1;
        function seqFormatter(value, row){
            return i++;
            var currentData =  $('#gridAppList').bootstrapTable('getData');
            return currentData.length - i;
        }

        function iconFormatter(value, row) {
            if(row.icon_url == ""){
                return "";
            }
            return '<img src="' +'app/'+row.row_id+'/icon/'+row.icon_url + '" class="img-rounded"  width="90" height="90">';
        };

        function updateDateFormatter(value, row){
            return convertUTCToLocalDateTime(value);
        }

        function releasedFormatter(value, row){
            return 'Android - ' + row.android_release + '<br>' + 'IOS - ' + row.ios_release;
        }

        function appNameFormatter(value, row){
            return '<span data-id='+row.row_id+' data-sequence='+row.sequence+'>'+value+'</span>';
        }

        $(function () {
            $delBtn = $("#btnDelete");
            $addBtn = $("#btnAdd");
            $gridList = $('#gridAppList');
            $gridDialogList = $("#gridAllAppList");
            $selectAppDialog = $("#selectAppDialog");
            $delBtn.hide();
            $gridList.on('reset-view.bs.table', selectedChanged);
            
        });
        
        var selectedChanged = function (row, $element) {
            i=1;
            $('#gridAppList').tableDnD({
                onDragStop: function (table, row) {
                    SortSequence(row);
                },
                onDragClass: "myDragClass",
            });
        };

        var SortSequence  = function(row){
             var sequenceIndex = 2;
             var currentData = $('#gridAppList').bootstrapTable('getData');
             var mapping = {};

            $("#gridAppList tbody").find("tr").each(function(i,row){
                var rowId = Number($($(row).find("td")[sequenceIndex]).find("span").data('id'));
                console.log(rowId);
                // var rowId = Number($($(row).find("td")[0]).text());
                mapping[rowId] = $("#gridAppList tbody").find("tr").length - i;
            });
             $.each(currentData, function(i, app) {
                app.sequence = mapping[app.row_id];
             });
             $gridList.bootstrapTable('load', currentData);
        }

        var AddApp = function(){
            $selectAppDialog.modal('show');
            $gridDialogList.bootstrapTable('uncheckAll');
            $gridDialogList.bootstrapTable('refresh');
        }

        var SelectApp = function() {
            var currentData =  $('#gridAppList').bootstrapTable('getData');
            var selectedApps = $gridDialogList.bootstrapTable('getSelections');
            var addAppsList = new Array();
            $.each(selectedApps, function(i, app) {
                addAppsList.push(app.app_name);
            });
            var categoryNameStr = '<span class="text-warning">' + htmlEscape($('#tdCategoryName').text()) + '</span>';
            var AppStr = '<span class="text-warning">' + addAppsList.join('、') + '</span>';
            showConfirmDialog("{{trans("messages.MSG_CONFIRM_ADD")}}", "{{trans("messages.MSG_CONFIRM_ADD_APPS_TO_CATEGORY")}}".replace("%s",AppStr).replace("%l",categoryNameStr),"", function () {
                hideConfirmDialog();
                $.each(selectedApps, function(i, newApp) {
                    newApp.state = false;
                    newApp.sequence = currentData.length + 1;
                    var exist = false;
                    $.each(currentData, function(j, cApp) {
                        if(cApp.row_id == newApp.row_id) {
                            exist = true;
                            return false;
                        }
                    });
                    if(!exist) {
                        currentData.push(newApp);
                    }
                });
                $gridList.bootstrapTable('load', currentData);
                $selectAppDialog.modal('hide');
            });
        }

        var SaveCategoryApps = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var selectedApps = $gridList.bootstrapTable('getData');
                var appIdList = {};
                $.each(selectedApps, function(i, app) {
                    appIdList[app.row_id] = app.sequence;
                });
                var mydata = { app_id_list:appIdList,
                               category_id:{{$data['categoryId']}}
                             };
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "app/category/saveCategoryApps",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                            $gridList.bootstrapTable('refresh');
                        }
                    },
                    error: function (e) {
                        if(handleAJAXError(this,e)){
                            return false;
                        }
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        }
    </script>
@endsection

@section('dialog_content')
    <div id="selectAppDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="roleDetailMaintainDialogTitle">{{trans("messages.SELECT_APP")}}</h1>
                </div>
                <div class="modal-body">
                    <table id="gridAllAppList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id"
                           data-url="app/category/getOtherAppList?category_id={{$data['categoryId']}}" data-height="298" data-pagination="true"
                           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                           data-show-toggle="true"  data-sortable="true"
                           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                           data-click-to-select="false" data-single-select="false">
                        <thead>
                        <tr>
                            <th data-field="state" data-checkbox="true"></th>
                            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                            <th data-field="app_name" data-sortable="true">{{trans("messages.APP_NAME")}}</th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SelectApp()">{{trans("messages.SELECT")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection