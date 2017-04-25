<?php
use App\lib\ResultCode;
?>
@extends('layouts.admin')
@section('content')
    <h1 class="page-header">成員資訊</h1>
    <div class="panel panel-default">
      <div class="panel-body">
        <button id="importBasicIfo" class="btn btn-primary openDialog" data-loading-text="Processing...">匯入成員資訊</button>
        <button id="registerSuperUser" class="btn btn-primary" data-loading-text="Processing...">新管理者註冊QMessage</button>
      </div>
    </div>
   
    @if (count($basicInfo) > 0)
    <div class="table-responsive">
     <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Location</th>
            <th>Function</th>
            <th>PIC</th>
            <th>EmpNo</th>
            <th>Master</th>
            <th>權限</th>
            <th>在職</th>
          </tr>
        </thead>
        <tbody>
        <?php $index = 0?>
        @foreach ($basicInfo as $members)
          <?php $index++ ?>
          <?php
            $class = "";
            if($members['status'] == 'N' || $members['resign'] == 'Y'){
                $class = "danger";
            }
          ?>
          <tr class="{{$class}}">
            <td>{{$index}}</td>
            <td>{{$members['location']}}</td>
            <td>{{$members['function']}}</td>
            <td>{{$members['login_id']}}</td>
            <td>{{$members['emp_no']}}</td>
            <td>{{$members['master']}}</td>
            <td>
                @if ($members['status'] == 'N')
                    <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" title="帳號已停權"></span>
                @else
                    <span class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>
                @endif
            </td>
            <td> 
                @if ($members['resign'] == 'Y')
                    <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" title="員工已離職"></span>
                @else
                    <span class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>
                @endif
            </td>
          </tr>
        @endforeach
        </tbody>
      </table>
      @endif
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
    $('#save').click(function(){
            $('#dialog').modal('hide');
            $('#importBasicIfo').button('loading');
            var formData = new FormData();
            formData.append('basicInfoFile',$('#uploadBasicInfo')[0].files[0]);
            $.ajax({
                url: "uploaBasicInfo",
                type: "POST",
                data:formData,
                contentType: false,
                processData: false,
                success: function (d, status, xhr) {
                    if(d.ResultCode == 1) {
                       showMessageDialog('操作成功','資料匯入成功','',true);
                    }else if(d.ResultCode == {{ResultCode::_014905_fieldFormatError}}){
                        showMessageDialog('錯誤','上傳檔案錯誤',d.Content);
                    }else if(d.ResultCode == {{ResultCode::_014908_accountNotExist}}){
                        showMessageDialog('錯誤','匯入失敗, 請修正以下所有錯誤後重新上傳',d.Content);
                    }else{
                        showMessageDialog('錯誤','匯入失敗, 請聯絡系統管理員');
                    }
                    $('#importBasicIfo').button('reset');
                },
                error: function (e) {
                    console.log(e.responseText);
                    alert(e.responseText);
                    $('#importBasicIfo').button('reset');
                }
            });
    });

    $('.openDialog').click(function(){
        $('#uploadBasicInfo-error').text('');
        $('#pathCover').val('');
        $('#uploadBasicInfo').val('')
        $('#dialog').modal('show')
    });

    $('input[id=uploadBasicInfo]').change(function() { 
        $('#pathCover').val($('#uploadBasicInfo')[0].files[0].name); 
    }); 

    $('#registerSuperUser').click(function(){
        $('#registerSuperUser').button('loading');
        $.ajax({
                url: "registerSuperUserToMessage",
                type: "POST",
                success: function (d, status, xhr) {
                    if(d.ResultCode == 1) {
                       showMessageDialog('操作成功',d.Message,d.Content.replace(/,/g,"</br>"),true);
                    }else{
                        showMessageDialog('錯誤','註冊失敗, 請聯絡系統管理員');
                    }
                    $('#registerSuperUser').button('reset');
                },
                error: function (e) {
                    console.log(e.responseText);
                    alert(e.responseText);
                    $('#registerSuperUser').button('reset');
                }
            });
    });
  
</script>

@endsection
