@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_USER_MAINTAIN";
    $departments = json_encode($departments);
?>
@extends('layouts.admin_template')
@section('content')
    <h1></h1>
    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <div class='col-md-3'>
                 <div class="form-group">
                    <label for="pointType">{{trans('messages.QPAY_POINT_TYPE')}}</label>
                    <div class="input-group" style="width:100%">
                        <select class="form-control" required="required" id="selectPointType">
                        @foreach ($pointTypeList as $pointType)
                            <option value="{{ $pointType['row_id'] }}">{{ $pointType['name'] }}</option>
                        @endforeach
                        </select>
                    </div>
                </div>
            </div>
            <div class='col-md-3'>
                <div class="form-group">
                    <label for="department">{{trans('messages.QPAY_MEMBER_DEPARTMENT_CODE')}}</label>
                    <div class="input-group" style="width:100%">
                        <input class="form-control" type="text" name="" id="tbxDepartment" placeholder="{{trans('messages.QPAY_INPUT_DEPARTMENT_CODE')}}">
                    </div>
                </div>
            </div>
            <div class='col-md-3'>
                <div class="form-group">
                    <label for="empNo">{{trans('messages.USER_EMP_NO')}}</label>
                    <div class="input-group" style="width:100%">
                        <input class="form-control" type="text" name="" id="txbEmpNo" placeholder="{{trans('messages.QPAY_INPUT_EMP_NO')}}">
                    </div>
                </div>
            </div>
            <div class='col-md-3'>
                <div class="form-group">
                    <label for="searchQPayMember">&nbsp;&nbsp;</label>
                    <div class="input-group">
                        <button type="button" id="searchQPayMember" class="btn btn-primary">{{trans('messages.SEARCH')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <table id="gridQPayMemberList" class="bootstrapTable" data-toggle="table" 
                   data-sort-name="store_time" data-sort-order="desc" data-toolbar="#toolbar"
                   data-height="" data-pagination="true"
                   data-show-refresh="false" data-row-style="rowStyle" data-search="false"
                   data-show-toggle="false"  data-sortable="true"
                   data-striped="true" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="emp_no" data-sortable="true" data-search-formatter="true">{{trans('messages.USER_EMP_NO')}}</th>
                    <th data-field="emp_name" data-sortable="true" data-searchable="false">{{trans('messages.USER_EMP_NAME')}}</th>
                    <th data-field="point_type" data-sortable="false" data-searchable="false" data-formatter="pointTypeFormatter">{{trans('messages.QPAY_POINT_TYPE')}}</th>
                    <th data-field="department" data-sortable="true" data-searchable="false" >{{trans('messages.QPAY_MEMBER_DEPARTMENT_CODE')}}</th>
                    <th data-field="trade_password" data-sortable="false" data-width="5px" data-searchable="false" data-formatter="passwordFormatter">{{trans('messages.QPAY_TRADE_PWD')}}</th>
                    <th data-field="" data-searchable="false" data-width="5px" data-formatter="resetOriginFormatter">{{trans('messages.RESET_PWD')}}</th>
                    <th data-field="user_id" data-searchable="false" data-visible="false"></th>
                </tr>
                </thead>
            </table>
    </div>

    <script type="text/javascript">

        function storeTimeFormatter(value, row) {
            return convertUTCToLocalDateTime(value);
        };

        function pointTypeFormatter(value, row) {
            return '<canvas id="myCanvas" width="10" height="10" style="background-color:'+ row.color +'"></canvas>' 
                    + '<span style="margin-left:10px">' + value + '</span>';
        };

        function resetOriginFormatter(value, row, index){

            if(value!=""){
                return '<div class="reset-ori-block" id="resetOriBlock_' + row.user_id + '" style="text-align: center;"><button type="button" data-index="' + index + '"data-userid="' + row.user_id + '" class="btn btn-light reset-ori" title="{{trans('messages.RESET_TO_ORIGIN')}}">Reset Origin</button></div>';
            }
        }

        function passwordFormatter(value, row, index){
            
            if(value == "" || value == null){
                return '-';
            }
            return '****';

        }

        var resetQPayMemberTradPwd = function(mydata, beforeSend, complete){

            var mydataStr = $.toJSON(mydata);

            $.ajax({
                url: "resetQPayMemberTradPwd",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                beforeSend: beforeSend,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                        $("#gridShopList").bootstrapTable("refresh");
                        return false;
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                },
                complete:complete
            });
        }

        var initRecordList = function() {
            
            var $table = $('#gridQPayMemberList');
            var defaultPageSize = 10;

            if($.cookie(clID + "___" + location.pathname + "___gridQPayMemberList___S")) {
                defaultPageSize = $.cookie(clID + "___" + location.pathname + "___gridQPayMemberList___S");
            }

            $table.bootstrapTable({
                "url": "getQPayMemberList",
                "method":"get",
                "dataType": "json",
                "sidePagination": "server",
                "pageSize": defaultPageSize,
                "queryParams": function(params){
                                            
                    var pointType = $("#selectPointType").val();
                    var department = $("#tbxDepartment").val();
                    var empNo = $("#txbEmpNo").val();
                    var mydata = {
                                pointType: pointType,
                                department: department,
                                empNo: empNo,
                                offset:params.offset,
                                limit:params.limit,
                                sort:params.sort,
                                order:params.order
                            };

                    return mydata;
                }
            });
        };

        $(function () {
            var departments = <?=$departments?>;
            
            // department autocomplete
            $("#tbxDepartment").autocomplete({
               source:departments
            });
            
            //init grid table
            initRecordList();
            $("#searchQPayMember").on("click", function(){
                $("#gridQPayMemberList").bootstrapTable("refresh");
            });
            
            $("input").on("keyup",function(event){
                // Cancel the default action, if needed
                event.preventDefault();
                if (event.keyCode === 13) {
                    // Trigger the button element with a click
                    $("#searchQPayMember").click();
                }
            });

            $("select").change(function() {
               $("#searchQPayMember").click();
            });

            //reset ori QAccount password
            $('body').on('click','.reset-ori', function(){
                var userId = $(this).data('userid');
                console.log(userId);
                var index = $(this).data('index');
                var $block = $("#resetOriBlock_" + userId);
                var currentData = $('#gridQPayMemberList').bootstrapTable('getData');
                var row = currentData[index];

                var mydata =
                        {
                            userId: userId
                        };
                        
                showConfirmDialog( "{{trans('messages.RESET_PWD')}}", "{{trans('messages.QPAY_CONFIRM_TO_RESET_TRADE_PWD')}}".replace("%s", row.emp_name), "", function () { 
                    hideConfirmDialog();
                    resetQPayMemberTradPwd(
                        mydata, 
                        function(){
                            $block.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
                        },
                        function(){
                            $block.html('<button type="button" data-index="' + index + '"data-userid="' + userId + '" class="btn btn-light reset-ori" title="{{trans('messages.RESET_TO_ORIGIN')}}">Reset Origin</button>');
                        }
                    );
                });
            });
        });

    
    </script>

@endsection