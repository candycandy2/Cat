@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_REIMBURSE_FINANCE";
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
#datetimepicker1 .form-control {
    padding: 6px 6px;
}
</style>

    <h1></h1>
    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <div class='col-md-3'>
                 <div class="form-group">
                    <label for="ddlPointType">{{trans('messages.QPAY_POINT_TYPE')}}</label>
                    <div class="input-group" style="width:100%">
                        <select class="form-control" required="required" id="ddlPointType">
                            <option value="" selected disabled >{{trans('messages.QPAY_SELECT_POINT_TYPE')}}</option>                    
                        @foreach ($pointTypeList as $pointType)
                            @if ($pointType['status'] === 'Y')
                                <option value="{{ $pointType['row_id'] }}">{{ $pointType['name'] }}</option>
                            @else
                                <option value="{{ $pointType['row_id'] }}">{{ $pointType['name'] }} ({{trans('messages.DISABLED')}})</option>
                            @endif
                        @endforeach
                        </select>
                    </div>
                </div>
            </div>
            <div class='col-md-3'>
                <div class="form-group">
                    <label for="ddlShopId">{{trans('messages.QPAY_SHOP_NAME')}}</label>
                    <div class="input-group" style="width:100%">
                         <select class="form-control" required="required" id="ddlShopId">
                            <option value=""  selected disabled>{{trans('messages.QPAY_SELECT_SHOP_NAME')}}</option>
                            @foreach ($shopList as $shop)
                                @if ($shop['user_delete_at'] != '0000-00-00 00:00:00' || $shop['shop_delete_at'] != '1970-01-01 23:23:59')
                                    <option value="{{ $shop['shop_id'] }}">{{ $shop['emp_name'] }} ({{trans('messages.DELETED')}})</option>
                                @elseif($shop['status'] == 'N')
                                    <option value="{{ $shop['shop_id'] }}">{{ $shop['emp_name'] }} ({{trans('messages.DISABLED')}})</option>
                                @else
                                    <option value="{{ $shop['shop_id'] }}">{{ $shop['emp_name'] }}</option>
                                @endif
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>
            <div class='col-md-3'>
               <div class="form-group">
                    <label for="datetimepicker1">{{trans('messages.QPAY_TRADE_MONTH')}}</label>
                    <div class='input-group date' id='datetimepicker1'>
                        <input type='text' class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
                <div class="form-group" style="display: none">
                    <label for="datetimepicker2">~{{trans('messages.SEARCH_TO')}}</label>
                    <div class='input-group date' id='datetimepicker2'>
                        <input type='text' class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
            </div>
            <div class='col-md-3'>
                <div class="form-group">
                    <label for="searchTradeRecord">&nbsp;&nbsp;</label>
                    <div class="input-group">
                        <button type="button" id="searchTradeRecord" class="btn btn-primary">{{trans('messages.SEARCH')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <h1></h1>
    <div id="tradeRecordPannel" class="panel panel-default">
        <div class="panel-body">
            <div class="container col-lg-12 col-xs-12 panel-title">
                    <div class="row">
                        <div class="col-lg-6 col-xs-12 col-sm-12">
                            <label class="panel-row-title">{{trans('messages.QPAY_SHOP_NAME')}}</label>
                            <label class="text-primary" id="shopName"></label>
                        </div>
                        <div class="col-lg-6 col-xs-12 col-sm-12">
                            <button type="button" id="export" class="btn btn-primary pull-right">{{trans('messages.EXPORT')}}</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4 col-xs-12 col-sm-12">
                            <label class="panel-row-title">{{trans('messages.QPAY_TRAD_DATE')}}</label>
                            <label class="text-primary" id="tradeDate"></label>
                        </div>
                        <div class="col-lg-4 col-xs-12 col-sm-12">
                            <label class="panel-row-title">{{trans('messages.QPAY_TRADE_TOTAL')}}({{trans('messages.QPAY_MONTH')}})</label>
                            <label class="text-primary" id="tradeAmount"></label>
                        </div>
                        <div class="col-lg-4 col-xs-12 col-sm-12">
                            <label class="panel-row-title">{{trans('messages.QPAY_POINT_TYPE')}}</label>
                            <label class="text-primary" id="pointType"></label>
                        </div>
                    </div>
            </div>
                <table id="gridTradeRecordList" class="bootstrapTable" data-toggle="table" 
                       data-sort-name="trade_time" data-sort-order="desc" data-toolbar="#toolbar"
                       data-height="" data-pagination="true"
                       data-show-refresh="false" data-row-style="rowStyle" data-search="false"
                       data-show-toggle="false"  data-sortable="true"
                       data-striped="true" data-page-list="[5,10,20]"
                       data-click-to-select="false" data-single-select="false">
                    <thead>
                        <tr>
                            <th data-field="trade_time" data-width="25%" data-sortable="true" data-formatter="tradeTimeFormatter">{{trans('messages.QPAY_TRAD_DATE')}}</th>
                            <th data-field="trade_point" data-width="25%" data-sortable="true">{{trans('messages.QPAY_TRADE_AMOUNT')}}({{trans('messages.QPAY_COUNT')}})</th>
                            <th data-field="trade_id" data-width="25%" data-sortable="true">{{trans('messages.QPAY_TRADE_ID')}}</th>
                            <th data-field="cancel_reason" data-width="25%" data-sortable="true">{{trans('messages.PROJECT_MEMO')}}</th>
                        </tr>
                    </thead>
                </table>
        </div>
    </div>

    <script type="text/javascript">

        function tradeTimeFormatter(value, row) {
            var date = new Date(value * 1000);
            return getDateTime(date);
        };

        var initRecordList = function() {

            var $table = $('#gridTradeRecordList');
            var defaultPageSize = 10;

            if($.cookie(clID + "___" + location.pathname + "___gridTradeRecordList___S")) {
                defaultPageSize = $.cookie(clID + "___" + location.pathname + "___gridTradeRecordList___S");
            }

            $table.bootstrapTable({
                "url": "getQPayReimburseFinanceList",
                "method":"get",
                "dataType": "json",
                "sidePagination": "server",
                "pageSize": defaultPageSize,
                "queryParams": function(params){
                    var startDate = $("#datetimepicker1").data("datetimepicker").getDate();
                    var endDate = $("#datetimepicker2").data("datetimepicker").getDate();
                    var pointType = $("#ddlPointType").val();
                    var shopId = $("#ddlShopId").val();
                    var mydata = {
                                pointType: pointType,
                                shopId: shopId,
                                startDate: startDate.getTime()/1000,
                                endDate: endDate.getTime()/1000,
                                offset:params.offset,
                                limit:params.limit,
                                sort:params.sort,
                                order:params.order
                            };

                    return mydata;
                }
            });
        };

        var showTradeInfo = function(){
            
            $("#export").prop('disabled',false);

            var startDate = $("#datetimepicker1").data("datetimepicker").getDate();
            var endDate = $("#datetimepicker2").data("datetimepicker").getDate();

            var pointType = $("#ddlPointType").val();
            var shopId = $("#ddlShopId").val();

            var mydata = {
                            pointType: pointType,
                            shopId: shopId,
                            startDate: startDate.getTime()/1000,
                            endDate: endDate.getTime()/1000,
                        };
            $.ajax({
                url: "getQPayTradeTotal",
                dataType: "json",
                type: "GET",
                data: mydata,
                success: function (d, status, xhr) {
                    if( $("#ddlShopId").find('option:selected').val() != 0 && 
                        $("#ddlPointType").find('option:selected').val() !=0)
                    {
                        $("#shopName").html($("#ddlShopId").find('option:selected').html().split(" ")[0]);
                        $("#tradeAmount").html(numberWithCommas(d.tradeTotal));
                        $("#tradeDate").html(startDate.getFullYear() + '/' + FormatNumberLength(startDate.getMonth()+1, 2));
                        $("#pointType").html($("#ddlPointType").find('option:selected').html().split(" ")[0]);
                    }
                },
                error: function (e) {

                    if (handleAJAXError(this,e,"../")) {
                        return false;
                    }
                }
            });
        }

        var downloadReimburseFinanceExcel = function(){

            var pointType = $("#ddlPointType").val();
            var shopId = $("#ddlShopId").val();
            var date = new Date();
            var startDate = $("#datetimepicker1").data("datetimepicker").getDate().getTime()/1000;
            var endDate = $("#datetimepicker2").data("datetimepicker").getDate().getTime()/1000;
            var timeOffset = date.getTimezoneOffset();
            var dlLink = 'downloadReimburseFinanceExcel?pointType=' + pointType + '&shopId=' + shopId + '&startDate=' + startDate+ '&endDate=' + endDate + '&timeOffset=' + timeOffset;

            location.href = dlLink;
        }

        var getEndDate = function(startDate){
            var nextMonth = new Date(new Date(startDate).setMonth(startDate.getMonth()+1));
            var thisMonthLastDate = new Date(nextMonth.setDate(nextMonth.getDate()-1));
            var endDate = new Date(new Date(thisMonthLastDate).getTime() + 24*60*60*1000-1000);//23:59:59
            return endDate;
        }

        var getStartDate = function(endDate){
            var startDate = new Date(new Date(endDate).setMonth(endDate.getMonth()));
            return startDate;
        }

        $(function () {

            var startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
            var $dpFrom = $("#datetimepicker1");
            var $dpTo = $("#datetimepicker2");

            //date picker
            $dpFrom.datetimepicker({
                minView: "year",
                startView: "year",
                format: 'yyyy/mm',
                autoclose: true
            }).on("changeDate", function(e) {
                $dpTo.data("datetimepicker").setDate(getEndDate(e.date));
            });

            $dpTo.datetimepicker({
                minView: "year",
                startView: "year",
                format: 'yyyy/mm/',
                autoclose: true,
            }).on("changeDate", function(e) {
                $dpTo.data("datetimepicker").setDate(getEndDate(e.date));
                $dpFrom.data("datetimepicker").setDate(getStartDate(e.date));
            });
            
            $dpFrom.data("datetimepicker").setDate(startDate);
            $dpTo.data("datetimepicker").setDate(getEndDate(startDate));


            //init grid table
            initRecordList();
            $("#searchTradeRecord").prop('disabled',true);
            $("#export").prop('disabled',true);

            $("#searchTradeRecord").on("click", function(){
                showTradeInfo();
                $("#gridTradeRecordList").bootstrapTable("refresh");
            });
            
            $("#export").on("click", function(){
                downloadReimburseFinanceExcel();
            })

            $('select').on("change", function(){
                if($("#ddlPointType").val() !=null && $("#ddlShopId").val() !=null){
                   $("#searchTradeRecord").prop('disabled',false);
                }else{
                   $("#searchTradeRecord").prop('disabled',true); 
                }
            })
        });

    
    </script>

@endsection