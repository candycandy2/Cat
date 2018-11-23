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
                    <label for="ddlMonth">{{trans('messages.QPAY_TRADE_MONTH')}}</label>
                    <select class="form-control" required="required" id="ddlMonth">
                        <option value=""  selected disabled>{{trans('messages.QPAY_SELECT_TRADE_MONTH')}}</option>
                    @foreach ($months as $month)
                        <option value="{{ $month }}">{{ $month }}</option>
                    @endforeach
                    </select>
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
                            <th data-field="trade_time" data-sortable="true" data-formatter="tradeTimeFormatter">{{trans('messages.QPAY_TRAD_DATE')}}</th>
                            <th data-field="trade_point" data-sortable="true">{{trans('messages.QPAY_TRADE_AMOUNT')}}({{trans('messages.QPAY_COUNT')}})</th>
                            <th data-field="trade_id" data-sortable="true">{{trans('messages.QPAY_TRADE_ID')}}</th>
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
                                            
                    var pointType = $("#ddlPointType").val();
                    var shopId = $("#ddlShopId").val();
                    var month = FormatNumberLength($("#ddlMonth").val(),2);
                    var mydata = {
                                pointType: pointType,
                                shopId: shopId,
                                month: month,
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

            var pointType = $("#ddlPointType").val();
            var shopId = $("#ddlShopId").val();
            var date = new Date();
            var month = FormatNumberLength($("#ddlMonth").val(),2);
            var year = FormatNumberLength(date.getFullYear(),2);

            var mydata = {
                            pointType: pointType,
                            shopId: shopId,
                            month: month
                        };
            $.ajax({
                url: "getQPayTradeTotal",
                dataType: "json",
                type: "GET",
                data: mydata,
                success: function (d, status, xhr) {
                    if( $("#ddlShopId").find('option:selected').val() != 0 && 
                        $("#ddlPointType").find('option:selected').val() !=0 &&
                        $("#ddlMonth").find('option:selected').val() !=0)
                    {
                        $("#shopName").html($("#ddlShopId").find('option:selected').html().split(" ")[0]);
                        $("#tradeAmount").html(numberWithCommas(d.tradeTotal));
                        $("#tradeDate").html(year + '/' + month);
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
            var month = FormatNumberLength($("#ddlMonth").val(),2);
            var year = FormatNumberLength(date.getFullYear(),2);
            var dlLink = 'downloadReimburseFinanceExcel?pointType=' + pointType + '&shopId=' + shopId + '&month=' + month;
            location.href = dlLink;
        } 

        $(function () {
            
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
                if($("#ddlPointType").val() !=null && $("#ddlShopId").val() !=null && $("#ddlMonth").val() !=null){
                   $("#searchTradeRecord").prop('disabled',false);
                }else{
                   $("#searchTradeRecord").prop('disabled',true); 
                }
            })
        });

    
    </script>

@endsection