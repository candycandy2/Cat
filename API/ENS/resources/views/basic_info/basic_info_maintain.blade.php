@extends('layouts.admin')
@section('content')
    <h1 class="page-header">成員資訊</h1>
    <div class="fileUpload btn btn-primary">
        <span>匯入成員資料</span>
        <input type="file" class="upload" id="uploadBasicInfo" />
    </div>
    @if (count($basicInfo) > 0)
    <div class="table-responsive">
     <table class="table">
     <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Location</th>
            <th>Function</th>
            <th>Login Id</th>
            <th>Employee No.</th>
          </tr>
        </thead>
        <tbody>
        <?php $index = 0?>
        @foreach ($basicInfo as $cate)
             @foreach ($cate['user_list'] as $member)
              <?php $index++ ?>
              <tr>
                <td>{{$index}}</td>
                <td>{{$cate['location']}}</td>
                <td>{{$cate['function']}}</td>
                <td>{{$member['login_id']}}</td>
                <td>{{$member['emp_no']}}</td>
              </tr>
            @endforeach
        @endforeach
        </tbody>
      </table>
      </table>
      @endif
    </div>

<script>
    $('#uploadBasicInfo').change(function(){
            $(this).parent('div.fileUpload').addClass('disabled');
            var formData = new FormData();
            formData.append('basicInfoFile',$('#uploadBasicInfo')[0].files[0]);
            $.ajax({
                url: "uploaBasicInfo",
                type: "POST",
                data:formData,
                contentType: false,
                processData: false,
                success: function (d, status, xhr) {
                    if(d.result_code == 1) {
                        alert('匯入成功');
                    }else{
                       alert(d.Message);
                    }
                    
                   location.reload() 
                },
                error: function (e) {
                    alert(e.responseText);
                    $(this).parent('div.fileUpload').removeClass('disabled');
                }
            });
    })
</script>

@endsection
