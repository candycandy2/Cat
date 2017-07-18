@php
    $eventList  = $data['eventList'];
    $appKey = $data['appKey'];
@endphp

@extends('layouts.admin')
@section('content')
     <div class="col-md-4">
         <h4><b>新增事件</b></h4>
         <form role="form">
          <div class="form-group">
            <label for="event_type">等級</label>
            <select class="form-control">
              <option value="1">警急通報 (1)</option>
              <option value="2">一般通報 (2)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="event_title">標題</label>
            <input type="text" class="form-control" id="event_title" placeholder="輸入事件標題">
          </div>
          <div class="form-group">
            <label for="event_desc">描述</label>
            <textarea class="form-control" rows="5" id="event_desc" placeholder="輸入事件描述"></textarea> 
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">位置/function</label>
            <select multiple class="form-control">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div class="form-group">
            <label for="event_title">希望完成時間</label>
            <input type="text" class="form-control" id="event_title" placeholder="輸入希望完成時間">
          </div>
          <div class="form-group">
            <label for="event_title">添加關聯事件</label>
           {{--  <input type="text" class="form-control" id="event_title" placeholder="輸入關聯事件id">
            <button type="button" class="btn" data-toggle="modal" data-target="#myModal">
                Launch demo modal
            </button> --}}
            <div class="input-group">
              <input type="text" class="form-control" placeholder="輸入關聯事件id">
              <span class="input-group-btn">
                <button class="btn btn-secondary" id="selectEvent" type="button"  data-toggle="modal" data-target="#myModal">
                Click to choice event
                </button>
              </span>
            </div>
          </div>
          <button type="submit" class="btn btn-default">送出</button>
        </form>
     </div>
     <div class="col-md-4"> 
         <div class="row">
         <h4><b>事件列表</b></h4>
        @foreach ($eventList as $event)
            <div class="col-sm-12">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <div>
                    {{$event['event_row_id']}} 
                        @if ($event['event_type'] == '緊急通報')
                            <span class="label label-danger" style="margin-left: 5px">{{$event['event_type']}}</span>
                        @else
                            <span class="label label-success" style="margin-left: 5px">{{$event['event_type']}}</span>
                        @endif
                            <span class="label label-default" style="margin-left: 5px">{{$event['event_status']}}</span>
                    </div>
                    <div>
                    {{$event['event_title']}}
                    </div>
                    <div>
                    @if ($event['related_event_row_id'] != 0)
                        <span class="glyphicon glyphicon-tag" aria-hidden="true"></span>{{$event['related_event_row_id']}}
                    @endif
                    </div>
                  </div>
                  <div class="panel-body">
                    {{$event['event_desc']}}
                  </div>
                  <!-- List group -->
                 {{--  <ul class="list-group">
                    <li class="list-group-item" style="background-color: Khaki"><label>related_id : </label> {{$event['related_event_row_id']}}</li> --}}
                  {{--   <li class="list-group-item">Dapibus ac facilisis in</li>
                    <li class="list-group-item">Morbi leo risus</li>
                    <li class="list-group-item">Porta ac consectetur ac</li>
                    <li class="list-group-item">Vestibulum at eros</li> --}}
                  </ul>
                </div> 
            </div>
        @endforeach
        </div>
    </div>
    <div class="col-md-4">
        <h4><b>成員清單</b></h4>
        <div id="basicInfo">
        </div>
    </div>

<div class="modal fade"  id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title"><b>請選擇關聯事件</b></h4>
      </div>
      <div class="modal-body">
        <div class="radio">
        <label><input type="radio" name="optradio">Option 1</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="optradio">Option 2</label>
        </div>
        <div class="radio disabled">
          <label><input type="radio" name="optradio" disabled>Option 3</label>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary">OK</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<script>
var appKey = '{{$appKey}}';
$(function(){
    var mydataStr = '{"strXml":"<LayoutHeader><emp_no>1607279</emp_no><app_key>'+ appKey +'</app_key></LayoutHeader>"}';
     $.ajax({
        url: "getBasicInfo",
        dataType:"json",
        contentType: "application/json",
        type: "POST",
        data:mydataStr,
        success: function (d, status, xhr) {
            if(d.ResultCode == 1) {
                 console.log(d);
                 var basicInfo = "";
                 $.each(d.Content,function(idx,obj){
                    $("#basicInfo").append('<div class="panel panel-info" id=lf_'+ idx +'></div>');
                    $("#lf_"+idx).append('<div class="panel-heading"></div><div class="panel-body"></div>');
                    $("#lf_"+idx).find('.panel-heading').append('<h3 class="panel-title">'+obj.location + '-' + obj.function+'</h3>');
                    $.each(obj.user_list, function(subIdx, userData){
                        $("#lf_"+idx).find('.panel-body').append(userData.login_id + '<br>');
                    });
                 });
                // $('#basicInfo').html(basicInfo);
            }else{
                showMessageDialog('錯誤','註冊失敗, 請聯絡系統管理員');
            }
            $('#registerSuperUser').button('reset');
        },
        error: function (e) {
            $('#registerSuperUser').button('reset');
        }
    });
});
</script>

@endsection