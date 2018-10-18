@include("layouts.lang")
<?php
    use App\lib\ResultCode;

    $menu_name = "QPAY_STORE_RECORD";
?>
@extends('layouts.admin_template')
@section('content')
    <h1></h1>
    <div class="row form-inline">
        <div class="col-lg-12 col-xs-12">
                <div class="col-md-12">
                    <label for="date">{{trans('messages.QPAY_SELECT_STORE_INTERVAL')}}</label>
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
            <table id="gridStoreRecordList" class="bootstrapTable" data-toggle="table" 
                   data-sort-name="store_time" data-sort-order="desc" data-toolbar="#toolbar"
                   data-height="" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="false"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="store_time" data-sortable="true" data-search-formatter="true" data-formatter="storeTimeFormatter">{{trans('messages.QPAY_POINT_STORED_DATE')}}</th>
                    <th data-field="stored_user" data-sortable="true" data-searchable="true" >{{trans('messages.QPAY_POINT_STORED_USER')}}</th>
                    <th data-field="point_type" data-sortable="true" data-searchable="true" data-formatter="pointTypeFormatter">{{trans('messages.QPAY_POINT_TYPE')}}</th>
                    <th data-field="member_count" data-sortable="true" data-searchable="true" >{{trans('messages.QPAY_STORED_MEMBER_COUNT')}}</th>
                    <th data-field="stored_total" data-sortable="true" data-searchable="true" >{{trans('messages.QPAY_STORED_POINT')}}</th>
                    <th data-field="store_id" data-sortable="true" data-searchable="true" >{{trans('messages.QPAY_STORED_ID')}}</th>
                    <th data-field="file_saved" data-sortable="false" data-searchable="false" data-formatter="downloadFormatter"></th>
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

        function downloadFormatter(value, row){
            var fileUrl = 'downloadPointExcel?point_saved_id=' + row.point_saved_id;
            return '<a href="' + fileUrl + '"' + '" title="'+ row.file_original +'"><span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span></a>';
        }

        $(function () {
        
            var startDate = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0) ;
            var endDate = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

            var $dpFrom = $("#datetimepicker1");
            var $dpTo = $("#datetimepicker2");
            var $table = $("#gridStoreRecordList");

            $dpFrom.datetimepicker({
                minView: "month", 
                format: 'yyyy/mm/dd',
                autoclose: true
            }).on("changeDate", function(e) {
                $dpTo.data("datetimepicker").setStartDate(e.date);
            });

            $dpTo.datetimepicker({
                minView: "month",
                format: 'yyyy/mm/dd',
                autoclose: true,
            }).on("changeDate", function(e) {
                $dpFrom.data("datetimepicker").setEndDate(e.date);
            });
            
            $dpFrom.data("datetimepicker").setDate(startDate);
            $dpTo.data("datetimepicker").setDate(endDate);
            
            getStoreRecord();

            $("#searchStoreRecord").on("click", function(){
                getStoreRecord();
            });
        });

        var getStoreRecord = function(){
            
            var startDate = $("#datetimepicker1").data("datetimepicker").getDate();
           
            var endDate = $("#datetimepicker2").data("datetimepicker").getDate();
                endDate.setHours(23, 59, 59)

            var mydata = {
                        startDate:  startDate.getTime()/1000,
                        endDate:    endDate.getTime()/1000,
                    };

            $.ajax({
                url: "getQPayStoreRecordList",
                dataType: "json",
                type: "GET",
                data: mydata,
                success: function (d, status, xhr) {
                    $("#gridStoreRecordList").bootstrapTable('load', d);
                },
                error: function (e) {

                    if (handleAJAXError(this,e)) {
                        return false;
                    }
                }
            });
        }
    </script>

@endsection