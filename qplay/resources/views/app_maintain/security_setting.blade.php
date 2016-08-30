@include("layouts.lang")
<?php
$menu_name = "APP_SECURITY_SETTING";
?>
@extends('layouts.admin_template')
@section('content')

	<div class="row">
    	<div class="col-lg-6 col-xs-6">
	        <table>
	            <tr>
	                <td class="text-bold" style="padding: 10px;">{{trans('messages.BLOCK_LIST')}}</td>
	                <td class="text-muted" style="padding: 10px;"><small>{{trans('messages.BLOCK_HINT')}}</small></td>
	            </tr>
	        </table>
	    </div>      
	</div>

	<div class="row">
		<div class="col-lg-12 col-xs-12">
			<div id="blackToolbar">
			 	<button id="btnDeleteBlock" type="button" class="btn btn-danger" onclick="deleteBlock()">
		          {{trans("messages.DELETE")}}
		        </button> 
				<button id="btnNewBlock" type="button" class="btn btn-primary" onclick="newBlock()">
		          {{trans("messages.NEW")}}
		        </button>
		    </div>
		    <table id="gridBlockList" data-toggle="table" data-sort-name="row_id" data-toolbar="#blackToolbar"
		           data-url="AppMaintain/getBlockList" data-height="398" data-pagination="true"
		           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
		           data-show-toggle="false"  data-sortable="true"
		           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
		           data-click-to-select="false" data-single-select="false">
		        <thead>
		        <tr>
		            <th data-field="state" data-checkbox="true"></th>
		            <th data-field="ip" data-sortable="true" data-formatter="urlFormatter">{{trans('messages.BLOCK_IP')}}</th>
		            <th data-field="description" data-sortable="false" data-formatter="">{{trans('messages.BLOCK_DESCRIPT')}}</th>
		        </tr>
		        </thead>
		    </table>
	    </div>
    </div>
    <script>
    	function urlFormatter(value, row){
    		return '<a href="#" onclick="updateBlock(' + row.row_id + ')">' + value + '</a>';
    	}

    	var deleteBlock = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_BLOCK")}}", "", function () {
                hideConfirmDialog();
                var selectedBlocks = $("#gridBlockList").bootstrapTable('getSelections');
                var check = true;
                var blockIdList = new Array();
                $.each(selectedBlocks, function(i, block) {
                    blockIdList.push(block.row_id);
                });
                var mydata = {blockIdList:blockIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "AppMaintain/deleteBlockList",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_DELETE_BLOCK_FAILED")}}");
                        }  else {
                            $("#gridBlockList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_DELETE_BLOCK_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        var currentBlockId = null;
        var isNew = false;
        var newBlock = function() {
            $("#tbxIp").val("");
            $("#tbxDescription").val("");
            $("#blockListDialogTitle").text("{{trans("messages.MSG_NEW_BLOCK")}}");
            $("#blockListDialog").modal('show');
            currentBlockId = null;
            isNew = true;
        };

        var updateBlock = function(blockRowId) {
            var allBlockList = $("#gridBlockList").bootstrapTable('getData');
            $.each(allBlockList, function(i, block) {
                if(block.row_id == blockRowId) {
                    $("#tbxIp").val(block.ip);
                    $("#tbxDescription").val(block.description);
                    return false;
                }
            });

            $("#blockListDialogTitle").text("{{trans("messages.MSG_EDIT_BLOCK")}}");
            $("#blockListDialog").modal('show');
            currentBlockId = blockRowId;
            isNew = false;
        };

        var saveBlockList = function() {
            var ip = $("#tbxIp").val();
            var description = $("#tbxDescription").val();
            if(ip == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var mydata = {
                    isNew:'Y',
                    blockRowId:-1,
                    blockIp:ip,
                    description:description
                };
                if(!isNew) {
                    mydata.isNew = 'N';
                    mydata.blockRowId = currentBlockId;
                }
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "AppMaintain/saveBlockList",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_BLOCK_FAILED")}}");
                        }  else {
                            $("#gridBlockList").bootstrapTable('refresh');
                            $("#blockListDialog").modal('hide');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_BLOCK_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        $(function() {
            $("#btnDeleteBlock").hide();
            $('#gridBlockList').on('check.bs.table', selectedChanged);
            $('#gridBlockList').on('uncheck.bs.table', selectedChanged);
            $('#gridBlockList').on('check-all.bs.table', selectedChanged);
            $('#gridBlockList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridBlockList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedUsers = $("#gridBlockList").bootstrapTable('getSelections');
            if(selectedUsers.length > 0) {
                $("#btnDeleteBlock").show();
                $("#btnNewBlock").hide();
            } else {
                $("#btnDeleteBlock").hide();
                $("#btnNewBlock").show();
            }
        }

    </script>
@endsection


@section('dialog_content')
    <div id="blockListDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="blockListDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td>{{trans('messages.BLOCK_IP')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxIp"
                                       id="tbxIp" value=""/>
                            </td>
                        </tr>
                        <tr>
                        	<td>{{trans('messages.BLOCK_DESCRIPT')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxDescription"
                                       id="tbxDescription" value=""/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveBlockList()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

