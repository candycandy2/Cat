@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_STORE_EMPLOYEE";
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
                        <div class="input-group">
                            <select class="form-control" required="required" id="selectPointType">
                                <option value="" selected>{{trans('messages.QPAY_SELECT_POINT_TYPE')}}</option>
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
                        <div class="input-group" >
                            <input class="form-control" type="text" name="" id="tbxDepartment" placeholder="{{trans('messages.QPAY_INPUT_DEPARTMENT_CODE')}}">
                        </div>
                    </div>
                </div>
                <div class='col-md-3'>
                    <div class="form-group">
                        <label for="empNo">{{trans('messages.USER_EMP_NO')}}</label>
                        <div class="input-group">
                            <input class="form-control" type="text" name="" id="txbEmpNo" placeholder="{{trans('messages.QPAY_INPUT_EMP_NO')}}">
                        </div>
                    </div>
                </div>
        </div>
    </div>
    <div class="row form-inline">
        <div class="col-lg-12 col-xs-12">
                <div class="col-md-12">
                    <label for="date">{{trans('messages.QPAY_SELECT_GIVEN_INTERVAL')}}</label>
                </div>
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="datetimepicker1">{{trans('messages.SEARCH_FROM')}}</label>
                        <div class='input-group date' id='datetimepicker1'>
                            <input type='text' class="form-control" />
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="datetimepicker2">~{{trans('messages.SEARCH_TO')}}</label>
                        <div class='input-group date' id='datetimepicker2'>
                            <input type='text' class="form-control" />
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="datetimepicker2">&nbsp;&nbsp;</label>
                        <button type="button" id="searchStoreRecord" class="btn btn-primary">{{trans('messages.SEARCH')}}</button>
                    </div>
                </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <table id="gridEmployeePointRecordList" class="bootstrapTable" data-toggle="table" 
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
                    <th data-field="point_type" data-sortable="true" data-searchable="false" data-formatter="pointTypeFormatter">{{trans('messages.QPAY_POINT_TYPE')}}</th>
                    <th data-field="department" data-sortable="true" data-searchable="false" >{{trans('messages.QPAY_MEMBER_DEPARTMENT_CODE')}}</th>
                    <th data-field="store_time" data-sortable="true" data-searchable="false" data-formatter="storeTimeFormatter">{{trans('messages.QPAY_POINT_STORED_DATE')}}</th>
                    <th data-field="stored_total" data-sortable="false" data-searchable="false">{{trans('messages.STORED_POINT')}}</th>
                    <th data-field="store_id" data-sortable="true" data-searchable="false">{{trans('messages.QPAY_STORED_ID')}}</th>
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

        $(function () {
            var departments = <?=$departments?>;
            var startDate = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0) ;
            var endDate = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

            var $dpFrom = $("#datetimepicker1");
            var $dpTo = $("#datetimepicker2");

            //date picker
            $dpFrom.datetimepicker({
                minView: "month", 
                format: 'yyyy/mm/dd',
                autoclose: true
            }).on("changeDate", function(e) {
                $dpTo.data("datetimepicker").setStartDate(e.date);
                $("#searchStoreRecord").click();
            });

            $dpTo.datetimepicker({
                minView: "month",
                format: 'yyyy/mm/dd',
                autoclose: true,
            }).on("changeDate", function(e) {
                $dpFrom.data("datetimepicker").setEndDate(e.date);
                $("#searchStoreRecord").click();
            });
            
            $dpFrom.data("datetimepicker").setDate(startDate);
            $dpTo.data("datetimepicker").setDate(endDate);
            
            // department autocomplete
            $("#tbxDepartment").autocomplete({
               source:departments
            });
            
            //init grid table
            initRecordList();
            $("#searchStoreRecord").on("click", function(){
                $("#gridEmployeePointRecordList").bootstrapTable("refresh");
            });
            
            $("input").on("keyup",function(event){
                // Cancel the default action, if needed
                event.preventDefault();
                if (event.keyCode === 13) {
                    // Trigger the button element with a click
                    $("#searchStoreRecord").click();
                }
            });

            $("select").change(function() {
               $("#searchStoreRecord").click();
            });

    });

    var initRecordList = function () {
        
        var $table = $('#gridEmployeePointRecordList');
        var defaultPageSize = 10;

        if($.cookie(clID + "___" + location.pathname + "___gridEmployeePointRecordList___S")) {
            defaultPageSize = $.cookie(clID + "___" + location.pathname + "___gridEmployeePointRecordList___S");
        }

        $table.bootstrapTable({
            "url": "getQPayPointGetRecordList",
            "method":"get",
            "dataType": "json",
            "sidePagination": "server",
            "pageSize": defaultPageSize,
            "queryParams": function(params){
                var startDate = $("#datetimepicker1").data("datetimepicker").getDate();
                var endDate = $("#datetimepicker2").data("datetimepicker").getDate();
                    endDate.setHours(23, 59, 59)
                                        
                var pointType = $("#selectPointType").val();
                var department = $("#tbxDepartment").val();
                var empNo = $("#txbEmpNo").val();
                var mydata = {
                            pointType: pointType,
                            startDate:  startDate.getTime()/1000,
                            endDate:    endDate.getTime()/1000,
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
    </script>

@endsection