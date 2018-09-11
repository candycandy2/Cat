@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_STORE_POINT";
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
</style>

<!--********************************** Import QPayMember member *************************************-->

<div id="importPage" style="display: none">
<h1></h1>
<div class="row">
    <div class="col-lg-6 col-xs-6">
        <form class="form-inline " role="form">
            <div class="form-group">
                <div class="input-group">
                    <select class="form-control" id="selectPointType">
                         <option value="1">BenQ消費券</option>
                         <option value="2">Qisda消費券</option>
                    </select>
                </div>
            </div>
      
            <div class="form-group">
                 <button type="button" id="importQPayMember" class="btn btn-primary openDialog" data-loading-text="Processing...">{{trans('messages.QPAY_IMPORT_MEMBER_LIST')}}</button>
            </div>
        </form>
    </div>

    <div class="col-lg-6 col-xs-6" >
        <div class="btn-toolbar float-right-btn" role="toolbar">
            <button type="button" class="btn btn-warning" id="nextBtn">
                {{trans("messages.NEXT")}}
            </button>
        </div>
    </div>
</div>
<h1></h1>
<div class="panel panel-default">
    <div class="panel-body">
        <div class="container panel-title">
            <div class="row">
                <div class="col-lg-4 col-xs-12 col-sm-12">
                    <div>{{trans('messages.QPAY_EXPECT_MEMBER_COUNT')}} <label class="text-primary">500</label></div>
                </div>
                <div class="col-lg-4 col-xs-12 col-sm-12">
                    <div>{{trans('messages.QPAY_EXPECT_STORED_POINT')}} <label class="text-primary">250,000</label></div>
                </div>
                <div class="col-lg-4 col-xs-12 col-sm-12">
                    <div>{{trans('messages.QPAY_POINT_TYPE')}} <label class="text-primary" id="pointType"></label></div>
                </div>
            </div>
        </div>
        <table id="gridQPayMemberList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"data-url="" data-height="" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="false"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
            <thead>
                <tr>
                    <th data-field="emp_no" data-sortable="true">{{trans('messages.QPAY_MEMBER_EMP_NO')}}</th>
                    <th data-field="emp_name_ch">{{trans('messages.QPAY_MEMBER_EMP_NAME_CH')}}</th>
                    <th data-field="emp_name">{{trans('messages.QPAY_MEMBER_EMP_NAME_EN')}}</th>
                    <th data-field="company" data-sortable="true">{{trans('messages.QPAY_MEMBER_COMPANY')}}</th>
                    <th data-field="department" data-sortable="true">{{trans('messages.QPAY_MEMBER_DEPARTMENT_CODE')}}</th>
                </tr>
            </thead>
        </table>
    </div>
</div>
</div>

<!--********************************** Preview QPayMember Import *************************************-->

<div id="preViewPage" style="display: none;">
    <h1></h1>
    <div class="row">
        <div class="col-lg-6 col-xs-6"></div>
        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar float-right-btn" role="toolbar">
                <button type="button" class="btn btn-warning" id="backBtn">
                    {{trans('messages.BACK')}}
                </button>
                <button type="button" class="btn btn-primary" id="storePoint">
                    {{trans('messages.QPAY_CONFIRM_TO_STORED')}}
                </button>
            </div>
        </div>
    </div>
    <h1></h1>
    <div class="table-responsive">
        <table class="table table-bordered table-striped" id="storeStatus">
          <colgroup>
            <col class="col-xs-6">
            <col class="col-xs-6">
          </colgroup>
          <tbody>
            @for($i = 0 ; $i < 5 ; $i ++)
            <tr>
              <td></td><td></td>
            </tr>
            @endfor
          </tbody>
        </table>
    </div>
</div>

<!--********************************** Import QPayMember Dialog *************************************-->

<div class="modal fade" id="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 class="modal-title">{{trans('messages.IMPORT_DATA')}}</h4>
      </div>
      <div class="modal-body">
                <div class="input-group">
                    <input id="uploadQPayMember" name="uploadQPayMember" type="file" style="display:none"> 
                    <input id="pathCover" type="text" class="form-control" readonly="readonly" style="background-color:#fff">
                    <span class="input-group-addon btn">
                        <span class="" onclick="$('input[id=uploadQPayMember]').click();"><span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span> Browse</span> 
                    </span>
                </div>
            <small id="uploadQPayMember-error" class="errors"></small>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">{{trans('messages.CANCEL')}}</button>
        <button type="button" class="btn btn-primary" id="save" >{{trans('messages.IMPORT')}}</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->


<script type="text/javascript">
$(function() {
    var importPage = $('#importPage');
    var preViewPage = $('#preViewPage');
    var backBtn = $('#backBtn');
    var nextBtn = $('#nextBtn');

    /*init page*/
    importPage.show();
    switchPointType();
    
    /*switch point type*/
    $('#selectPointType').change(function(){
        switchPointType();
    });
    
    /*click next to preview*/
    nextBtn.click(function(){
        importPage.hide();
        backBtn.hide();
        previewStore();
        preViewPage.show();
    });
    
    /*click back to return previous page*/
    backBtn.click(function(){
        importPage.show();
        preViewPage.hide();
    });

    /*store point*/
    $('#storePoint').click(function(){
       storePoint();
       $(this).text("{{trans('messages.QPAY_CHECK_STORE_RECORD')}}");
       $(this).click(function(){
        alert('導向儲值紀錄頁');
       })
    });

    /*upload qpay member*/
    $('#importQPayMember').click(function(){
            $('#uploadQPayMember-error').text('');
            $('#pathCover').val('');
            $('#uploadQPayMember').val('');
            $('#dialog').modal('show');
        });

    $('input[id=uploadQPayMember]').change(function() { 
        $('#pathCover').val($('#uploadQPayMember')[0].files[0].name); 
    });

});

var switchPointType = function(){
    var poinTypeVal = $("#selectPointType").val();
    var poinType = $("#selectPointType option[value="+poinTypeVal+"]").text()
    $('#pointType').html(poinType);
}

var storePoint = function(){
    setStoreResult(0, "{{trans('messages.QPAY_TRAD_STATUS')}}", "交易成功");
    setStoreResult(1, "{{trans('messages.QPAY_TRAD_DATE')}}", "2018/05/16 10:50");
    setStoreResult(2, "{{trans('messages.QPAY_ADMIN')}}", "Cindy.Chan");
    setStoreResult(3, "{{trans('messages.QPAY_IMPORT_TOTAL_MEMBER')}}", "500 ({{trans('messages.PERSON')}})");
    setStoreResult(4, "{{trans('messages.QPAY_IMPORT_TOTAL_POINT')}}", "2,500,000 ({{trans('messages.POINT')}})");
}

var previewStore = function(){
    setStoreResult(0, "{{trans('messages.QPAY_TRAD_DATE')}}", "2018/05/16");
    setStoreResult(1, "{{trans('messages.QPAY_ADMIN')}}", "Cindy.Chan");
    setStoreResult(2, "{{trans('messages.QPAY_IMPORT_EACH_MEMBER')}}", "500({{trans('messages.POINT')}})");
    setStoreResult(3, "{{trans('messages.QPAY_IMPORT_TOTAL_MEMBER')}}", "500 ({{trans('messages.PERSON')}})");
    setStoreResult(4, "{{trans('messages.QPAY_IMPORT_TOTAL_POINT')}}", "2,500,000 ({{trans('messages.POINT')}})");
}

var setStoreResult = function(row, title, value){
     $("#storeStatus tr:eq(" + row + ") td:eq(0)").text(title);
     $("#storeStatus tr:eq(" + row + ") td:eq(1)").text(value);
}
</script>

@endsection

@section('dialog_content')
   
@endsection