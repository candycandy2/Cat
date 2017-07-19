<?php
$menu_name = "BASIC_INFO_MAINTAIN";
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
                      <option value="ens">ens</option>
                      <option value="rmcirs">rmcirs</option>
                    </select>
                </div>
            </div>
      
            <div class="form-group">
                 <button id="importBasicIfo" class="btn btn-primary openDialog" data-loading-text="Processing...">匯入成員資訊</button>
                 <button id="registerSuperUser" class="btn btn-warning" data-loading-text="Processing...">新管理者註冊QMessage</button>
            </div>
         </form>
    </div>
    <table id="basicInfoTable"
           data-toggle="table"
           data-click-edit="true"
           data-unique-id="treeId"
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
        $('#basicInfoTable').bootstrapTable({ url: 'ENSMaintain/getBasicInfo?app_key=ens'});
        $('#selectProject').on('change', function() {
            console.log(this.value);
            $('#basicInfoTable').bootstrapTable('refresh', {
                url: 'ENSMaintain/getBasicInfo?app_key=' + this.value
            });
        })

      $(window).resize(function () {
          $('#table').bootstrapTable('resetView');
      });
    });
</script>
@endsection