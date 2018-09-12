@include("layouts.lang")
<?php
$menu_name = "PUSH_BATCH_SERVICE";
?>
@extends('layouts.admin_template')
@section('content')
    <div id="toolbar">
        <button id="btnNewPush" type="button" class="btn btn-primary" onclick="newPush()">
          {{trans("messages.NEW")}}
        </button>
    </div>

    <table id="gridBatchPushList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbar"
           data-url="getPushBatchServiceList" data-height="" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="20" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="row_id" data-sortable="true" data-visible="false" data-searchable="false">ID</th>
            <th data-field="file_original" data-sortable="true" data-visible="true" data-searchable="false" data-formatter="downloadPushBatchExcel">檔案名稱</th>
            <th data-field="login_id" data-sortable="true" data-visible="true" data-searchable="false">上傳人員</th>
            <th data-field="created_at" data-sortable="true" data-visible="true" data-searchable="false">時間</th>
        </tr>
        </thead>
    </table>



    <script>
        function createdDateFormatter(value, row){
            return convertUTCToLocalDateTime(value);
        };
        function downloadPushBatchExcel(value) {
//           return '<a href="file/'+ value +'" download="'+ value +'">' + value + '</a>';
           return '<a href="../storage/'+ value +'" download="'+ value +'">' + value + '</a>';
        };

        function newPush() {
            $("#blockDialogTitle").text("新增預約推播");
            $("#appPushDetailMaintainDialog").modal('show');
        };

        function saveBlockL(){
             $("#appPushDetailMaintainDialog").modal('hide');
                var formData = new FormData();
                formData.append('basicInfoFile',$('#doc')[0].files[0]);
               // var $test = $('#doc')[0].files[0];

            $.ajax({
                url: "./getdata",
                type: "POST",
                data:formData,
                contentType: false,
                processData: false,

                success: function (d, status, xhr) {
                    console.log("success");
                    console.log(d);
                   $('#gridBatchPushList').bootstrapTable('refresh');
                },
                error: function (jqXHR, textStatus, errorThrown)  {
                    alert("NO~ sorry");
                    console.log(jqXHR);
                }
            });



        }




    </script>
@endsection


@section('dialog_content')
    <div id="appPushDetailMaintainDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;
                    </button>
                    <h1 class="modal-title" id="blockDialogTitle"></h1>

                        <label  type="file"  class="btn btn-danger" method="post" enctype="multipart/form-data" >
                        上傳預約推播Excel
                          <input type="file" name="doc" id="doc"
                            enctype="multipart/form-data"
                            method="post" position="absolute"  overflow="hidden"     style="display:none;"
                            >
                              {{ csrf_field() }}
                        </label>


                </div>

                <div class="modal-footer">
                    <button type="submit"  class="btn btn-danger"
                    onclick="saveBlockL()">{{trans("messages.SAVE")}}
                    </button>


                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>


            </div>
        </div>
    </div>
@endsection
