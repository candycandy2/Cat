@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_STORE_POINT";

    if (!isset($pointTypeList)) {
        $pointTypeList = [];
    }
?>
@extends('layouts.admin_template')
@section('content')

<style>
#storeStatus {
    max-width: 42rem;
    height: 400px;
    margin: auto;
    left: 40%;
}
#storeStatus td{
    vertical-align: middle !important;
    text-align: center;
}
#selectPointType {
    width: 200px
}
#importPage .btn-toolbar{
    float: right;
}
.panel-title{
    float: left;
    font-size: 20px
}
.float-right-btn{
    float: right;
}
#importQPayMember {
    margin-left: 10px;
}
#uploadExcel {
    display: none;
}
.file-name {
    margin-left: 10px;
}
#dialogErrorEmpNo .modal-dialog {
    width: 30%;
}
#dialogErrorEmpNo .modal-dialog .modal-content .modal-body {
    text-align: center;
}
#preViewPage .table-bordered td {
    width: 50%;
}
#preViewPage .table-bordered .data-column {
    text-align: center;
    border-left: 2px solid #000000;
}
#dialogStoreConfirm .modal-dialog {
    width: 30%;
}
#dialogStoreConfirm .modal-dialog .modal-content .modal-body {
    text-align: center;
    font-size: 24px;
}
</style>

<!--********************************** Import QPayMember member *************************************-->

<div id="importPage">
    <h1></h1>
    <div class="row">
        <div class="col-lg-8 col-xs-6">
            <form class="form-inline" role="form">
                <div class="col-md-12">
                    <label for="selectPointType">{{trans('messages.QPAY_POINT_TYPE')}}</label>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <select class="form-control" required="required" id="selectPointType">
                            @foreach ($pointTypeList as $pointType)
                                <option value="{{ $pointType['row_id'] }}">{{ $pointType['name'] }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div class="form-group">
                     <button type="button" id="importQPayMember" class="btn btn-primary">{{trans('messages.QPAY_IMPORT_MEMBER_LIST')}}</button>
                     <input type="file" name="uploadExcel" id="uploadExcel" style="display:none;">
                </div>

                <div class="form-group file-name" id="fileName"></div>
            </form>
        </div>

        <div class="col-lg-4 col-xs-6" >
            <div class="btn-toolbar float-right-btn" role="toolbar">
                <button type="button" class="btn btn-warning" id="nextBtn">
                    {{trans("messages.NEXT")}}
                </button>
                <button type="button" class="btn btn-warning" id="nextPreviewBtn" style="display:none;">
                    {{trans("messages.NEXT")}}
                </button>
            </div>
        </div>
    </div>
    <h1></h1>
    <div id="importDataInfo" class="panel panel-default" style="display:none;">
        <div class="panel-body">
            <div class="container panel-title">
                <div class="row">
                    <div class="col-lg-4 col-xs-12 col-sm-12">
                        <div>{{trans('messages.QPAY_EXPECT_MEMBER_COUNT')}} <label class="text-primary" id="empCount">500</label></div>
                    </div>
                    <div class="col-lg-4 col-xs-12 col-sm-12">
                        <div>{{trans('messages.QPAY_EXPECT_STORED_POINT')}} <label class="text-primary" id="pointCount">250,000</label></div>
                    </div>
                    <div class="col-lg-4 col-xs-12 col-sm-12">
                        <div>{{trans('messages.QPAY_POINT_TYPE')}} <label class="text-primary" id="pointType"></label></div>
                    </div>
                </div>
            </div>
            <table id="gridQPayMemberList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                    data-url="" data-height="" data-pagination="true" data-show-refresh="false" data-row-style="rowStyle" 
                    data-search="false" data-show-toggle="false"  data-sortable="true" data-striped="true" data-page-size="10" 
                    data-page-list="[5,10,20]" data-click-to-select="false" data-single-select="false">
                <thead>
                    <tr>
                        <th data-field="empno" data-sortable="true">{{trans('messages.QPAY_MEMBER_EMP_NO')}}</th>
                        <th data-field="namech">{{trans('messages.QPAY_MEMBER_EMP_NAME_CH')}}</th>
                        <th data-field="nameen">{{trans('messages.QPAY_MEMBER_EMP_NAME_EN')}}</th>
                        <th data-field="company" data-sortable="true">{{trans('messages.QPAY_MEMBER_COMPANY')}}</th>
                        <th data-field="department" data-sortable="true">{{trans('messages.QPAY_MEMBER_DEPARTMENT_CODE')}}</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>

<!--********************************** Preview QPayMember Import *************************************-->

<div id="preViewPage" style="display:none;">
    <h1></h1>
    <div class="row">
        <div class="col-lg-6 col-xs-6"></div>
        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar float-right-btn" role="toolbar" id="previewToolbar">
                <button type="button" class="btn btn-warning" id="backBtn">
                    {{trans('messages.BACK')}}
                </button>
                <button type="button" class="btn btn-primary" id="storePoint">
                    {{trans('messages.QPAY_CONFIRM_TO_STORED')}}
                </button>
            </div>
            <div class="btn-toolbar float-right-btn finish-review" role="toolbar" id="finishToolbar">
                <button type="button" class="btn btn-primary" id="storedRecord">
                    {{trans('messages.QPAY_CHECK_STORE_RECORD')}}
                </button>
            </div>
        </div>
    </div>
    <h1></h1>
    <div class="table-responsive">
        <table class="table table-striped table-bordered">
            <tbody>
                <tr class="finish-review">
                    <td>{{trans('messages.QPAY_TRAD_STATUS')}}</td>
                    <td class="data-column" id="tradeStatus"></td>
                </tr>
                <tr>
                    <td>{{trans('messages.QPAY_TRAD_DATE')}}</td>
                    <td class="data-column" id="previewTradeDate"></td>
                </tr>
                <tr>
                    <td>{{trans('messages.QPAY_ADMIN')}}</td>
                    <td class="data-column" id="previewManager"></td>
                </tr>
                <tr>
                    <td>{{trans('messages.QPAY_POINT_TYPE')}}</td>
                    <td class="data-column" id="previewPointType"></td>
                </tr>
                <tr>
                    <td>{{trans('messages.QPAY_IMPORT_EACH_MEMBER')}}</td>
                    <td class="data-column" id="previewPointSingle"></td>
                </tr>
                <tr>
                    <td>{{trans('messages.QPAY_IMPORT_TOTAL_MEMBER')}}</td>
                    <td class="data-column" id="previewEmpCount"></td>
                </tr>
                <tr>
                    <td>{{trans('messages.QPAY_IMPORT_TOTAL_POINT')}}</td>
                    <td class="data-column" id="previewPointAll"></td>
                </tr>
            </tbody>
      </table>
    </div>
</div>

<!--********************************** Import QPayMember Dialog *************************************-->

<div class="modal fade" id="dialogErrorEmpNo">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">{{trans('messages.QPAY_MEMBER_EMP_NO_ERROR')}}</h4>
            </div>
            <div class="modal-body">
                1234466
            </div>
            <div class="modal-footer"></div>
        </div>
    </div>
</div>

<div class="modal fade" id="dialogStoreConfirm">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">{{trans('messages.QPAY_CONFIRM_STORE_DIALOG')}}</h4>
            </div>
            <div class="modal-body">
                1234466
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" id="storeCancel">{{trans('messages.CANCEL')}}</button>
                <button type="button" class="btn btn-primary" id="storeConfirm" >{{trans('messages.CONFIRM')}}</button>
            </div>
        </div>
    </div>
</div>


<script type="text/javascript">
$(function() {

    var managerID = "{{Auth::user()->login_id}}";
    var excelDataInfo;

    //Initial Page
    $("#importPage").show();
    $("#nextBtn").prop("disabled", true);

    //Upload File
    $('#importQPayMember').on("click", function() {
        $("#uploadExcel").trigger("click");
    });

    $("#uploadExcel").on("change", function() {
        if ($('#uploadExcel').get(0).files.length >= 0) {
            $("#fileName").html($('#uploadExcel').get(0).files[0].name);
            $("#nextBtn").prop("disabled", false);
        } else {
            $("#nextBtn").prop("disabled", true);
        }
    });

    $("#nextBtn").on("click", function() {

        var formData = new FormData();
        formData.append('pointTypeID', $("#selectPointType").val());
        formData.append('excelFile', $('#uploadExcel')[0].files[0]);

        $.ajax({
            url: "uploadPointExcel",
            type: "POST",
            contentType: false,
            data: formData,
            processData: false,
            success: function (r) {
                var response = JSON.parse(r);

                if (response.result_code == 1) {

                    excelDataInfo = response.excel_data_info;

                    $("#gridQPayMemberList").bootstrapTable('load', response.all_empno);
                    $("#empCount").html(excelDataInfo.empCount);
                    $("#pointCount").html(excelDataInfo.pointCount);
                    $("#pointType").html($("#selectPointType option:selected").text());

                    $("#importDataInfo").show();
                    $("#nextBtn").hide();
                    $("#nextPreviewBtn").show();

                } else {
                    var errorString = "";

                    $.each(response.error_empno, function(key, val) {
                        errorString =  errorString + val.toString() + "<br>";
                    });

                    $("#dialogErrorEmpNo .modal-content .modal-body").html(errorString);
                    $('#dialogErrorEmpNo').modal('show');
                    $("#uploadExcel").val("");
                    $("#fileName").html("");
                }
            },
            error: function (e) {}
        });

    });

    //Preview Page
    $("#nextPreviewBtn").on("click", function() {

        $("#importPage").hide();
        $("#preViewPage").show();
        $("#preViewPage #previewToolbar").show();
        $("#preViewPage .finish-review").hide();

        var date = new Date();
        var dateStr = date.getFullYear() + "/" + parseInt(date.getMonth() + 1, 10) + "/" + date.getDate();

        $("#previewTradeDate").html(dateStr);
        $("#previewManager").html(managerID);
        $("#previewPointType").html($("#selectPointType option:selected").text());
        $("#previewPointSingle").html(excelDataInfo.point);
        $("#previewEmpCount").html(excelDataInfo.empCount);
        $("#previewPointAll").html(excelDataInfo.pointCount);

    });

    $("#backBtn").on("click", function() {

        //Initital Page
        $("#importPage").show();
        $("#importDataInfo").hide();
        $("#selectPointType").val("1");
        $("#uploadExcel").val("");
        $("#fileName").html("");
        $("#nextBtn").prop("disabled", true);
        $("#nextBtn").show();
        $("#nextPreviewBtn").hide();

        $("#preViewPage").hide();

    });

    //Store Confirm
    $('#storePoint').on("click", function() {
        $("#dialogStoreConfirm .modal-content .modal-body").html(excelDataInfo.pointCount);
        $("#dialogStoreConfirm").modal("show");
    });

    $("#storeCancel").on("click", function() {
        $("#dialogStoreConfirm").modal("hide");
    });

    $("#storeConfirm").on("click", function() {
        $("#dialogStoreConfirm").modal("hide");
        storePoint();
    });

    //Store Point
    function storePoint() {

        $.ajax({
            url: "newPointStore",
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            success: function (r) {
                if (r.result_code == 1) {
                    $("#tradeStatus").html("{{trans('messages.MSG_OPERATION_SUCCESS')}}");
                    $("#preViewPage #previewToolbar").hide();
                    $("#preViewPage .finish-review").show();
                }
            },
            error: function (e) {}
        });

    }
});
</script>

@endsection

@section('dialog_content')
   
@endsection