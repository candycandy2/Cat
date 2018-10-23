@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_REIMBURSE_PURCHASE_RECORD";
?>
@extends('layouts.admin_template')
@section('content')

<style>
.panel-title{
    float: left;
    font-size: 20px
}
.panel-row-title{
    margin-right: 20px
}
</style>

    <h1></h1>
    <div class="row">
        <div class="col-lg-6 col-xs-6">
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
                    <label for="date">{{trans('messages.QPAY_SELECT_TRADE_INTERVAL')}}</label>
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

    <h1></h1>
    <div id="importDataInfo" class="panel panel-default">
        <div class="panel-body">
            <div class="container col-lg-12 col-xs-12 panel-title">
                <div class="row">
                    <div class="col-lg-3 col-xs-12 col-sm-12">
                        <label class="panel-row-title">{{trans('messages.USER_EMP_NAME')}}</label><label class="text-primary" id="empName"></label>
                    </div>
                    <div class="col-lg-3 col-xs-12 col-sm-12">
                        <label class="panel-row-title">{{trans('messages.USER_LOGIN_ID')}}</label><label class="text-primary" id="loginId"></label>
                    </div>
                    <div class="col-lg-3 col-xs-12 col-sm-12">
                        <label class="panel-row-title">{{trans('messages.USER_EMP_NO')}}</label><label class="text-primary" id="empNo"></label>
                    </div>
                    <div class="col-lg-3 col-xs-12 col-sm-12">
                        <label class="panel-row-title">{{trans('messages.QPAY_POINT_NOW')}}</label><label class="text-primary" id="pointNow"></label>
                    </div>
                </div>
            </div>
            <table id="gridQPayReimbursePurchaseList" class="bootstrapTable" data-toggle="table" 
                    data-sort-name="trade_time" data-sort-order="desc"
                    data-toolbar="#toolbar"
                    data-url="" data-height="" data-pagination="true" data-show-refresh="false" data-row-style="rowStyle" 
                    data-search="false" data-show-toggle="false"  data-sortable="true" data-striped="true" data-page-size="10" 
                    data-page-list="[5,10,20]" data-click-to-select="false" data-single-select="false">
                <thead>
                    <tr>
                        <th data-field="trade_time" data-sortable="true" data-formatter="tradeTimeFormatter">{{trans('messages.QPAY_TRAD_DATE')}}</th>
                        <th data-field="shop_name"  data-sortable="true">{{trans('messages.QPAY_TRADE_LOCATION')}}</th>
                        <th data-field="trade_point" data-sortable="true">{{trans('messages.QPAY_TRADE_POINT')}}</th>
                        <th data-field="trade_id" data-sortable="true">{{trans('messages.QPAY_TRADE_ID')}}</th>
                        <th data-field="trade_success" data-sortable="true" data-formatter="tradeStatusFormatter">{{trans('messages.QPAY_TRADE_STATUS')}}</th>
                        <th data-field="error_code" data-sortable="true">{{trans('messages.ERROR_CODE')}}</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>

 <script type="text/javascript">

    function tradeTimeFormatter(value, row) {
        return convertUTCToLocalDateTime(value);
    };

    function tradeStatusFormatter(value, row) {
        var tradeStr = '<span class="glyphicon glyphicon-remove text-danger"> Failed</span>';
        if(value == 'Y'){
            tradeStr = '<span class="glyphicon glyphicon-ok text-success"> Success</span>';
        }
        
        return tradeStr;
    };

    $(function () {
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
        
        initRecordList();
        getRecordList();
        $("#searchStoreRecord").on("click", function(){
            getRecordList();
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

var getRecordList = function () {

    var startDate = $("#datetimepicker1").data("datetimepicker").getDate();
    var endDate = $("#datetimepicker2").data("datetimepicker").getDate();
        endDate.setHours(23, 59, 59);
    var empNo = $("#txbEmpNo").val();

    $('#empName').text("");
    $('#loginId').text("");
    $('#empNo').text("");
    $('#pointNow').text("");

    var mydata = {
                startDate:  startDate.getTime()/1000,
                endDate:    endDate.getTime()/1000,
                empNo: empNo,
            };

    $.ajax({
        url: "getQPayReimbursePurchaseList",
        dataType: "json",
        type: "GET",
        data: mydata,
        success: function (d, status, xhr) {
            if(d.userInfo!=null){
               $('#empName').text(d.userInfo.emp_name);
               $('#loginId').text(d.userInfo.login_id);
               $('#empNo').text(d.userInfo.emp_no);
            }
            $('#pointNow').text(d.pointNow);
            $("#gridQPayReimbursePurchaseList").bootstrapTable('load', d.purchaseList);
        },
        error: function (e) {

            if (handleAJAXError(this,e)) {
                return false;
            }
        }
    });
};

var initRecordList = function () {
     var $table = $('#gridQPayReimbursePurchaseList');
    $table.bootstrapTable({
        "url": "getQPayReimbursePurchaseList",
        "dataType": "json"
    });
};
</script>
@endsection