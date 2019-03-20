@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_REIMBURSE_CANCELTRADE";
?>
@extends('layouts.admin_template')
@section('content')

<style>
.panel-title {
    float: left;
    font-size: 18px
}
.panel-row-title {
    margin-right: 20px
}
#step1 .btn-toolbar {
    float: right;
}
#errorContainer .panel-row-title {
    margin-right: 0px
}
#tradeError {
    color: red;
}
.loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.4;
    z-index: 2000;
    width: 100%;
    height: 100%;
    display: none;
}
.loading-mask-icon {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 50%;
    top: 45%;
}
.loading-mask-str {
    position: absolute;
    left: 45%;
    top: 55%;
    color: #FFF;
}
</style>

<div id="step1">
    <h1></h1>
    <div class="row">
        <div class="col-lg-8 col-xs-6">
            <div class='col-md-3'>
                <div class="form-group">
                    <label for="tradeID">{{trans('messages.QPAY_TRADE_ID')}}</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="" id="tradeIDText" maxlength="6">
                    </div>
                </div>
            </div>
            <div class="row form-inline">
                <div class="col-lg-6 col-xs-6">
                        <div class="col-md-12">
                            <label for="date">{{trans('messages.QPAY_CANCEL_REASON')}}</label>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <div class="input-group" style="width:100%">
                                    <select class="form-control" required="required" id="cancelReason">
                                        <option value="reason_1">{{trans('messages.QPAY_CANCEL_REASON_OPTION_1')}}</option>
                                        <option value="reason_2">{{trans('messages.QPAY_CANCEL_REASON_OPTION_2')}}</option>
                                        <option value="reason_3">{{trans('messages.QPAY_CANCEL_REASON_OPTION_3')}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="input-group">
                                <input class="form-control" type="text" name="" id="textReason">
                            </div>
                        </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-xs-6" >
            <div class="btn-toolbar float-right-btn" role="toolbar">
                <button type="button" class="btn btn-primary" id="nextBtn">
                    {{trans("messages.NEXT")}}
                </button>
                <button type="button" class="btn btn-primary" id="backBtn" style="display:none;">
                    {{trans("messages.BACK")}}
                </button>
                <button type="button" class="btn btn-warning" id="cancelTradeBtn" style="display:none;">
                    {{trans("messages.QPAY_CANCEL_TRADE")}}
                </button>
            </div>
        </div>
    </div>
</div>

<div id="step2" class="panel panel-default" style="display:none;">
    <div class="panel-body">
        <div class="container col-lg-12 col-xs-12 panel-title">
            <div class="row">
                <div class="col-lg-3 col-xs-12 col-sm-12">
                    <label class="panel-row-title">{{trans('messages.USER_EMP_NO')}}</label><label class="text-primary" id="empNo"></label>
                </div>
                <div class="col-lg-3 col-xs-12 col-sm-12">
                    <label class="panel-row-title">{{trans('messages.USER_LOGIN_ID')}}</label><label class="text-primary" id="loginId"></label>
                </div>
                <div class="col-lg-3 col-xs-12 col-sm-12">
                    <label class="panel-row-title">{{trans('messages.QPAY_TRADE_ID')}}</label><label class="text-primary" id="tradeID"></label>
                </div>
                <div class="col-lg-3 col-xs-12 col-sm-12">
                    <label class="panel-row-title">{{trans('messages.QPAY_TRADE_AMOUNT')}}</label><label class="text-primary" id="tradePrice"></label>
                </div>
            </div>
        </div>
        <div class="container col-lg-12 col-xs-12 panel-title">
            <div class="row">
                <div class="col-lg-3 col-xs-12 col-sm-12">
                    <label class="panel-row-title">{{trans('messages.QPAY_TRAD_DATE')}}</label><label class="text-primary" id="tradeTime"></label>
                </div>
                <div class="col-lg-3 col-xs-12 col-sm-12">
                    <label class="panel-row-title">{{trans('messages.QPAY_TRADE_LOCATION')}}</label><label class="text-primary" id="tradeShop"></label>
                </div>
            </div>
        </div>
        <div class="container col-lg-12 col-xs-12 panel-title" id="errorContainer">
            <div class="row">
                <div class="col-lg-9 col-xs-12 col-sm-12">
                    <label class="panel-row-title"></label><label class="text-primary" id="tradeError"></label>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="dialogMsg">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body">
                
            </div>
            <div class="modal-footer"></div>
        </div>
    </div>
</div>

<div class="modal fade" id="dialogCancelConfirm">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">{{trans('messages.QPAY_CANCEL_TRADE_CONFIRM')}}</h4>
            </div>
            <div class="modal-body">
                1234466
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" id="cancelCancel">{{trans('messages.CANCEL')}}</button>
                <button type="button" class="btn btn-primary" id="cancelConfirm" >{{trans('messages.CONFIRM')}}</button>
            </div>
        </div>
    </div>
</div>

<div class="loading-mask">
    <img class="loading-mask-icon" src="{{asset('/css/images/loading.gif')}}">
    <div class="loading-mask-str">處理中, 請勿關閉或是重整視窗</div>
</div>

<script type="text/javascript">

$(function () {
    var tradeID;
    var tradePrice;
    var shopID;
    var cancelReason;
    var textReason;
    var adminLoginID;

    function padLeft(str, length) {
        str = str.toString();

        if (str.length >= length) {
            return str;
        } else {
            return padLeft("0" + str, length);
        }
    }

    function timeZoneConvert(dateTime) {
        var timeZoneOffset = new Date(dateTime).getTimezoneOffset();
        var timeZoneFixHour = timeZoneOffset / -60;
        var timeZoneFixSecond = timeZoneFixHour * 60 * 60;

        var dateStrTimestamp = new Date(dateTime).getTime() / 1000;
        var fixedDateStrTimestamp = dateStrTimestamp + timeZoneFixSecond;
        var fixedDateStr = new Date(fixedDateStrTimestamp * 1000);

        return fixedDateStr.getFullYear() + "-" + padLeft(parseInt(fixedDateStr.getMonth() + 1, 10), 2) + "-" + padLeft(fixedDateStr.getUTCDate(), 2) + " " +
            padLeft(fixedDateStr.getHours(), 2) + ":" + padLeft(fixedDateStr.getMinutes(), 2) + ":" + padLeft(fixedDateStr.getSeconds(), 2);
    };

    //Step 1
    $("#textReason").hide();

    $("#cancelReason").on("change", function() {
        if ($(this).val() == "reason_3") {
            $("#textReason").show();
        } else {
            $("#textReason").hide();
        }
    });

    $("#nextBtn").on("click", function() {
        $("#step2").hide();

        tradeID = $("#tradeIDText").val();
        cancelReason = $("#cancelReason").val();
        textReason = $("#textReason").val();
        var checkOK = true;

        if (tradeID.length != 6) {
            checkOK = false;
            $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_1')}}");
            $('#dialogMsg').modal('show');
        } else if (cancelReason == "reason_3" && textReason.length == 0) {
            checkOK = false;
            $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_2')}}");
            $('#dialogMsg').modal('show');
        }

        if (checkOK) {
            var formData = new FormData();
            formData.append('tradeID', tradeID);

            $.ajax({
                url: "checkTradeID",
                type: "POST",
                contentType: false,
                data: formData,
                processData: false,
                success: function (r) {
                    var response = JSON.parse(r);

                    tradePrice = response.trade_price;
                    shopID = response.shop_row_id;
                    adminLoginID = response.admin_login_id;

                    $("#empNo").html(response.emp_no);
                    $("#loginId").html(response.login_id);
                    $("#tradeID").html(response.trade_id);
                    $("#tradePrice").html(response.trade_price);
                    $("#tradeTime").html(timeZoneConvert(response.trade_time.date).substring(0,16));
                    $("#tradeShop").html(response.shop_name);

                    if (response.result_code == 1) {
                        $("#nextBtn").hide();
                        $("#backBtn").show();
                        $("#cancelTradeBtn").show();
                    } else if (response.result_code == "000925") {
                        $("#tradeError").html("{{trans('messages.QPAY_CANCEL_ERROR_3')}}");
                    } else if (response.result_code == "000926") {
                        $("#tradeError").html("{{trans('messages.QPAY_CANCEL_ERROR_4')}}");
                    } else if (response.result_code == "000927") {
                        $("#tradeError").html("{{trans('messages.QPAY_CANCEL_ERROR_5')}}");
                    }

                    $("#step2").show();
                },
                error: function (e) {}
            });
        }
    });

    //Step 2
    $("#backBtn").on("click", function() {
        $("#step2").hide();
        $("#tradeIDText").val("");
        $("#cancelReason").val("reason_1");
        $("#textReason").val("");
        $("#tradeError").html("");

        $("#nextBtn").show();
        $("#backBtn").hide();
        $("#cancelTradeBtn").hide();
    });

    $("#cancelTradeBtn").on("click", function() {
        $("#dialogCancelConfirm .modal-content .modal-body").html(tradeID);
        $("#dialogCancelConfirm").modal("show");
    });

    $("#cancelCancel").on("click", function() {
        $("#dialogCancelConfirm").modal("hide");
    });

    $("#cancelConfirm").on("click", function() {
        $("#dialogCancelConfirm").modal("hide");
        cancelTrade();
    });

    //Cancel Trade
    function cancelTrade() {

        $(".loading-mask").show();

        var formData = new FormData();
        formData.append('tradeID', tradeID);
        formData.append('tradePrice', tradePrice);
        formData.append('shopID', shopID);

        if (cancelReason == "reason_1") {
            formData.append('cancelReason', "{{trans('messages.QPAY_CANCEL_REASON_OPTION_1')}}" + "(" + adminLoginID + ")");
        } else if (cancelReason == "reason_2") {
            formData.append('cancelReason', "{{trans('messages.QPAY_CANCEL_REASON_OPTION_2')}}" + "(" + adminLoginID + ")");
        } else if (cancelReason == "reason_3") {
            formData.append('cancelReason', textReason + "(" + adminLoginID + ")");
        }

        $.ajax({
            url: "cancelTrade",
            type: "POST",
            contentType: false,
            data: formData,
            processData: false,
            success: function (r) {
                var response = JSON.parse(r);

                if (response.result_code == 1) {
                    $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.MSG_OPERATION_SUCCESS')}}"); 
                } else if (response.result_code == "000923") {
                    $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_6')}}");
                } else if (response.result_code == "000940") {
                    $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_7')}}");
                } else if (response.result_code == "000942") {
                    $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_4')}}");
                } else if (response.result_code == "000943") {
                    $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_5')}}");
                } else if (response.result_code == "000944") {
                    $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_5')}}");
                } else if (response.result_code == "000945") {
                    $("#dialogMsg .modal-content .modal-body").html("{{trans('messages.QPAY_CANCEL_ERROR_3')}}");
                }

                $(".loading-mask").hide();
                $('#dialogMsg').modal('show');
            },
            error: function (e) {}
        });

    }
});

</script>
@endsection