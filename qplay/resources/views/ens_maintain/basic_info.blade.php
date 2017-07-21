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
                 <button type="button" id="importBasicIfo" class="btn btn-primary openDialog" data-loading-text="Processing...">匯入成員資訊</button>
                 <button type="button" id="registerSuperUser" class="btn btn-warning" data-loading-text="Processing...">新管理者註冊QMessage</button>
            </div>
         </form>
    </div>
    <table id="basicInfoTable"
           data-toggle="table"
           data-click-edit="false"
           data-unique-id="row_id"
           data-url="">
        <thead>
        <tr>
            <th data-field="row_id" data-formatter="idFormatter">#</th>
            <th data-field="location" data-editable="input">Location</th>
            <th data-field="function" data-editable="input">Function</th>
            <th data-field="login_id" data-editable="input">PIC</th>
            <th data-field="emp_no"   data-editable="input">EmpNo</th>
            <th data-field="master"   data-editable="input">Master</th>
            <th data-field="status" data-formatter="statusFormatter">權限</th>
            <th data-field="resign" data-formatter="resignFormatter">在職</th>
        </tr>
        </thead>
    </table>
</div>


<div class="modal fade" id="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 class="modal-title">匯入資料</h4>
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
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" id="save" >匯入</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<script>
    var id = 0;
    function idFormatter(value, row) {
        id ++;
        return id;
    };

    function statusFormatter(value, row) {
    
        if(value == 'Y'){
            return '<span class="glyphicon glyphicon-ok text-success" aria-hidden="true">';
        }else{
            return '<span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" title="帳號已停權"></span>';
        }
    };

    function resignFormatter(value, row) {
    
        if(value == 'Y'){
            return '<span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" title="員工已離職"></span>';
        }else{
            return '<span class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>';
        }
    };

    $(function () {

        $('#importBasicIfo').click(function(){
            $('#uploadBasicInfo-error').text('');
            $('#pathCover').val('');
            $('#uploadBasicInfo').val('');
            $('#dialog').modal('show');
        });

        $('#basicInfoTable').on('refresh.bs.table', function (params) {
           id=0;
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
                       showMessageDialog('操作成功','資料匯入成功','',true);
                       $('#basicInfoTable').bootstrapTable('refresh');
                    }else if(d.ResultCode == {{ResultCode::_000919_validateError}}){
                        showMessageDialog('錯誤','上傳檔案錯誤',d.Content);
                    }else if(d.ResultCode == {{ResultCode::_000901_userNotExistError}}){
                        showMessageDialog('錯誤','匯入失敗, 請修正以下所有錯誤後重新上傳',d.Content);
                    }else{
                        showMessageDialog('錯誤','匯入失敗, 請聯絡系統管理員');
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
                       showMessageDialog('操作成功',d.Message,d.Content.replace(/,/g,"</br>"),true);
                    }else{
                        showMessageDialog('錯誤','註冊失敗, 請聯絡系統管理員');
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