@include("layouts.lang")
<?php
use App\lib\ResultCode;

$menu_name = "APP_CATEGORY_MAINTAIN";

?>
@extends('layouts.admin_template')
@section('content')
	<div id="toolbar">
	 	<button id="btnDelete" type="button" class="btn btn-danger" onclick="deleteCategory()">
          {{trans("messages.DELETE")}}
        </button> 
		<button id="btnNew" type="button" class="btn btn-primary" onclick="newCategory()">
          {{trans("messages.NEW")}}
        </button>
    </div>
    <table id="gridCategoryList" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="AppMaintain/getCategoryList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="app_category" data-sortable="true" data-formatter="categoryNameFormatter" data-search-formatter="false">{{trans("messages.CATEGORY_NAME")}}</th>
            <th data-field="app_count" data-sortable="false" data-searchable="false" data-formatter="appCountFormatter">{{trans("messages.CATEGORY_APP_COUNT")}}</th>
        </tr>
        </thead>
    </table>

    <script>

    	function categoryNameFormatter(value, row) {
            return '<a href="#" onclick="updateCategory(' + row.row_id + ')">' + value + '</a>';
        };

        function appCountFormatter(value, row) {
            return '<a href="categoryAppsMaintain?category_id=' + row.row_id + '">' + value + '</a>';
        };

        var deleteCategory = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_CATEGORY")}}", "", function () {
                hideConfirmDialog();
                var selectedCategories = $("#gridCategoryList").bootstrapTable('getSelections');
                var check = true;
                $.each(selectedCategories, function (i, category) {
                    if(category.app_count > 0) {
                        check = false;
                        return false;
                    }
                });
                if(!check) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_CATEGORY_EXIST_APPS")}}");
                    return false;
                }
                
                var categoryIdList = new Array();
                $.each(selectedCategories, function(i, category) {
                    categoryIdList.push(category.row_id);
                });
                var mydata = {category_id_list:categoryIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "AppMaintain/deleteCategory",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_DELETE_CATEGORY_FAILED")}}");
                        }  else {
                            $("#gridCategoryList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_DELETE_CATEGORY_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        var currentMaintainCategoryId = null;
        var isNewCategory = false;
    	var newCategory = function() {
            $("#tbxCategoryName").val("");
            $("#categoryDetailMaintainDialogTitle").text("{{trans("messages.MSG_NEW_CATEGORY")}}");
            $("#appCategoryDetailMaintainDialog").modal('show');
            currentMaintainCategoryId = null;
            isNewCategory = true;
        };

        var updateCategory = function(categoryId) {
            var allCategoryList = $gridList.bootstrapTable('getData'),
             $radios = $('input:radio[name=optRadio]'),
             $tbxCategoryName =  $("#tbxCategoryName"),
             $dialog_title = $("#categoryDetailMaintainDialogTitle"),
             $dialog = $("#appCategoryDetailMaintainDialog");

            $.each(allCategoryList, function(i, category) {
                if(category.row_id == categoryId) {
                    $tbxCategoryName.val(category.app_category);
				    $radios.filter('[value=' + category.status + ']').prop('checked', true);     
                    return false;
                }
            });

            $dialog_title.text("{{trans("messages.MSG_EDIT_CATEGORY")}}");
            $dialog.modal('show');
            currentMaintainCategoryId = categoryId;
            isNewCategory = false;
        };


        var SaveCategoryMaintain = function() {
            var categoryName = $( "#tbxCategoryName" ).val();
            var status = $( "input[name=optRadio]:checked" ).val();
            if(categoryName == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var mydata = {
                    isNew:'Y',
                    categoryId:-1,
                    categoryName:categoryName,
                };
                if(!isNewCategory) {
                    mydata.isNew = 'N';
                    mydata.categoryId = currentMaintainCategoryId;
                }
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "AppMaintain/saveCategory",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            if(d.result_code == {{ResultCode::_000918_AppCategoryNameExist}}){
                                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_APP_CATEGORY_EXIST")}}");
                                return false;
                            }
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_CATEGORY_FAILED")}}");
                        }  else {
                            $("#gridCategoryList").bootstrapTable('refresh');
                            $("#appCategoryDetailMaintainDialog").modal('hide');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_CATEGORY_FAILED")}}", e.responseText);
                    }
                });
            });
        }

    	$(function() {
    		$delBtn = $("#btnDelete");
    		$newBtn = $("#btnNew");
    		$gridList = $('#gridCategoryList');
            $delBtn.hide();
            $gridList.on('check.bs.table', selectedChanged);
            $gridList.on('uncheck.bs.table', selectedChanged);
            $gridList.on('check-all.bs.table', selectedChanged);
            $gridList.on('uncheck-all.bs.table', selectedChanged);
            $gridList.on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedUsers = $gridList.bootstrapTable('getSelections');
            if(selectedUsers.length > 0) {
            	$delBtn.show();
            	$newBtn.hide();
            } else {
            	$delBtn.hide();
            	$newBtn.show();
            }
        }
    </script>
@endsection

@section('dialog_content')
    <div id="appCategoryDetailMaintainDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="categoryDetailMaintainDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table  width="100%">
                        <tr>
                            <td>{{trans("messages.CATEGORY_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxCategoryName"
                                       id="tbxCategoryName" value=""/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SaveCategoryMaintain()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
