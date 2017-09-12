<?php
use App\lib\ResultCode;
$menu_name = "BASIC_INFO_MAINTAIN";
$ensProjects = \Config('app.ens_project');
?>
@include("layouts.lang")
@extends('layouts.admin_template')
@section('content')

<div class="container">
    <h1></h1>
    <div id="toolbarbasicInfo" class="form-group" class="pull-right">
        <form class="form-inline " role="form">
            <div class="form-group">
                <div class="input-group">
                    <select class="form-control" style="width: 200px" id="selectProject">
                    @foreach ($ensProjects  as $index => $project)
                         <option value="{{$project}}" @if($index == 0) selected="selected" @endif>{{$project}}</option>
                    @endforeach
                    </select>
                </div>
            </div>
      
            <div class="form-group">
                 <button type="button" id="importBasicIfo" class="btn btn-primary openDialog" data-loading-text="Processing...">{{trans('messages.IMPORT_BASIC_INFO')}}</button>
                 <button type="button" id="registerSuperUser" class="btn btn-warning" data-loading-text="Processing...">{{trans('messages.NEW_ADMIN_REGISTER_TO_MESSAGE')}}</button>
            </div>
         </form>
    </div>
    <table id="basicInfoTable" 
           data-toggle="table" data-pagination="true"  
           data-striped="true" data-page-size="20" data-page-list="[10,20,50]"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-click-edit="false"
           data-unique-id="row_id"
           data-url="">
        <thead>
        <tr>
            <th data-field="row_number" data-sortable="true">#</th>
            <th data-field="location" data-sortable="true" data-editable="input">Location</th>
            <th data-field="function" data-sortable="true" data-editable="input">Function</th>
            <th data-field="login_id" data-sortable="true" data-editable="input">PIC</th>
            <th data-field="emp_no"   data-sortable="true" data-editable="input">EmpNo</th>
            <th data-field="master"   data-sortable="true" data-editable="input">Master</th>
            <th data-field="status" data-sortable="true" data-formatter="statusFormatter" data-search-formatter="false">{{trans('messages.AUTH')}}</th>
            <th data-field="resign" data-sortable="true" data-formatter="resignFormatter" data-search-formatter="false">{{trans('messages.RESIGN')}}</th>
            <th data-field="register_user_id" data-sortable="true" data-formatter="registerFormatter" data-search-formatter="false">{{trans('messages.REGISTED_QPLAY')}}</th>
        </tr>
        </thead>
    </table>
</div>


<div class="modal fade" id="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 class="modal-title">{{trans('messages.IMPORT_DATA')}}</h4>
      </div>
      <div class="modal-body">
            {{-- <div class="col-md-6">.col-md-6</div> --}}
                <div class="input-group">
                    <input id="uploadBasicInfo" name="uploadBasicInfo" type="file" style="display:none"> 
                    <input id="pathCover" type="text" class="form-control" readonly="readonly" style="background-color:#fff">
                    <span class="input-group-addon btn">
                        <span class="" onclick="$('input[id=uploadBasicInfo]').click();"><span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span> Browse</span> 
                    </span>
                </div><!-- /input-group -->
            <!--</div> col-md-4 -->
            <small id="uploadBasicInfo-error" class="errors"></small>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">{{trans('messages.CANCEL')}}</button>
        <button type="button" class="btn btn-primary" id="save" >{{trans('messages.IMPORT')}}</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<script>
    function statusFormatter(value, row) {
    
        if(value == 'Y'){
            return '<span class="glyphicon glyphicon-ok text-success" aria-hidden="true">';
        }else{
            return '<span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" title="{{trans('messages.ERR_ACCOUNT_HAS_NO_AUTH')}}"></span>';
        }
    };

    function resignFormatter(value, row) {
    
        if(value == 'Y'){
            return '<span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" title="{{trans('messages.ERR_EMPLOYEE_RESIGNED')}}"></span>';
        }else{
            return '<span class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>';
        }
    };

    function registerFormatter(value, row) {
        if($.isNumeric(value)){
            return '<span class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>';
        }else{
            return '<span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" title="{{trans('messages.ERR_USER_NOT_REGISTERED')}}"></span>';
        }
    };

    $(function () {

        $('#importBasicIfo').click(function(){
            $('#uploadBasicInfo-error').text('');
            $('#pathCover').val('');
            $('#uploadBasicInfo').val('');
            $('#dialog').modal('show');
        });

        $('input[id=uploadBasicInfo]').change(function() { 
            $('#pathCover').val($('#uploadBasicInfo')[0].files[0].name); 
        });

        if($.trim("{{app('request')->input('app_key')}}")!=""){
            $("#selectProject option[value={{app('request')->input('app_key')}}]").attr('selected', true);
        }
        var project = $('#selectProject option:selected').val();
        $('#basicInfoTable').bootstrapTable({ url: 'ENSMaintain/getBasicInfo?app_key=' + project});
        $('#selectProject').on('change', function() {
            window.location="{{asset('basicInfo')}}?app_key=" + this.value;
        })

         $('#save').click(function(){
            $('#dialog').modal('hide');
            $('#importBasicIfo').button('loading');
            var formData = new FormData();
            formData.append('basicInfoFile',$('#uploadBasicInfo')[0].files[0]);
            formData.append('project',$('#selectProject option:selected').val());
            $.ajax({
                url: "ENSMaintain/uploadBasicInfo",
                type: "POST",
                data:formData,
                contentType: false,
                processData: false,
                success: function (d, status, xhr) {
                    if(d.ResultCode == 1) {
                       showMessageDialog("{{trans('messages.MSG_OPERATION_SUCCESS')}}","{{trans('messages.IMPORT_DATA_SUCCESS')}}","",true);
                       $('#basicInfoTable').bootstrapTable('refresh');
                    }else if(d.ResultCode == {{ResultCode::_000919_validateError}}){
                        showMessageDialog("{{trans('messages.ERROR')}}","{{trans('messages.ERR_FILE_UPLOAD')}}",d.Content);
                    }else if(d.ResultCode == {{ResultCode::_000901_userNotExistError}}){
                        showMessageDialog("{{trans('messages.ERROR')}}","{{trans('messages.IMPORT_DATA_FAILED')}}" + "," +  "{{trans('messages.ERR_PLEASE_FIX_ALL_TO_UPLOAD')}}",d.Content);
                    }else{
                        showMessageDialog("{{trans('messages.ERROR')}}","{{trans('messages.IMPORT_DATA_FAILED')}}" + "," +  "{{trans('messages.ERR_PLEASE_CONACT_ADMIN')}}");
                    }
                    $('#importBasicIfo').button('reset');
                },
                error: function (e) {
                    alert(e.responseText);
                    $('#importBasicIfo').button('reset');
                }
            });
        });

        $('#registerSuperUser').click(function(){
            $('#registerSuperUser').button('loading');
            var mydata = {project:$('#selectProject option:selected').val()};
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "ENSMaintain/registerSuperUser",
                type: "POST",
                data: mydataStr,
                contentType: "application/json",
                success: function (d, status, xhr) {
                    if(d.ResultCode == 1) {
                       showMessageDialog("{{trans('messages.MSG_OPERATION_SUCCESS')}}",d.Message,d.Content.replace(/,/g,"</br>"),true);
                    }else{
                        showMessageDialog("{{trans('messages.ERROR')}}" + "," + "{{trans('message.ERR_REGISTER_FAILED')}}" + "," + "{{trans('messages.ERR_PLEASE_CONACT_ADMIN')}}");
                    }
                    $('#registerSuperUser').button('reset');
                },
                error: function (e) {
                    alert(e.responseText);
                    $('#registerSuperUser').button('reset');
                }
            });
        });

      $(window).resize(function () {
          $('#table').bootstrapTable('resetView');
      });
    });
</script>
@endsection