@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_USER_SHOP";
?>
@extends('layouts.admin_template')
@section('content')
    <h1></h1>
    <div class="row">
        <div class="col-lg-10 col-xs-10">
                <div class='col-md-2'>
                    <div class="form-group">
                        <label for="newName">店家名稱</label>
                        <div class="input-group">
                            <input class="form-control" type="text" name="" id="newName" placeholder="">
                        </div>
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="newAddress">地址</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="" id="newAddress" placeholder="">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="newTel">電話</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="" id="newTel" placeholder="">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="newLoginId">帳號</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="" id="newLoginId" placeholder="">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="newPwd">密碼</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="" id="newPwd" placeholder="">
                    </div>
                </div>
                 <div class='col-md-2'>
                    <label for="addShop">&nbsp;&nbsp;</label>
                    <div class="form-group">
                        <button type="button" id="addShop" class="btn btn-primary">{{trans('messages.NEW')}}</button>
                    </div>
                </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <table id="gridShopList" class="bootstrapTable" data-toggle="table"
                   data-url="getQPayShopList"
                   data-sort-name="point_type_name" data-sort-order="desc" data-toolbar="#toolbar"
                   data-height="" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="false"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="emp_name" data-sortable="true" data-searchable="true"  data-formatter="">店家名稱</th>
                    <th data-field="address" data-sortable="false" data-searchable="false"  data-formatter="">地址</th>
                    <th data-field="ext" data-sortable="true" data-searchable="false" data-formatter="">電話</th>
                    <th data-field="login_id" data-sortable="true" data-searchable="false" data-formatter="">帳號</th>
                    <th data-field="password" data-sortable="true" data-searchable="false" data-formatter="">密碼</th>
                    <th data-field="status" data-sortable="true" data-searchable="false" data-formatter="statusFormatter">使用狀態</th>
                    <th data-field="trade_status" data-sortable="true" data-searchable="false" data-formatter="statusFormatter">交易狀態</th>
                </tr>
                </thead>
            </table>
    </div>

    <script type="text/javascript">
        
        function statusFormatter(value, row){

            var status = (value == 'Y')?'success':'off';
            return'<div class="switch has-switch" data-id="'+ row.row_id +'" ><div class="switch-'+ status +' switch-animate"><input type="checkbox"><span class="switch-left switch-success">Y</span><label class="">&nbsp;</label><span class="switch-right">N</span></div></div></div>';
        }

        // function editPintType(){
        //     var rowId = $('#editRowId').val();
        //     var name = $('#editPointTypeName').val();
        //     var color = $('#editPointColor').val();
        //     var status =  ($('#editStatus').bootstrapSwitch('status'))?'Y':'N';
            
        //     //Check Data Empty
        //     if (name.length == 0 || color.length == 0 ) {
        //         showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
        //         return false;
        //     }

        //     var mydata = {
        //                 rowId:  rowId,
        //                 name:   name,
        //                 color:  color,
        //                 status: status
        //         };

        //     $.ajax({
        //         url: "editPointType",
        //         dataType: "json",
        //         type: "POST",
        //         contentType: "application/json",
        //         data: $.toJSON(mydata),
        //         success: function (d, status, xhr) {
        //             if (d.result_code == 1) {
        //                $('#editPointTypeDialog').modal('hide');
        //                $("#gridPointTypeList").bootstrapTable("refresh");
        //             } else {
        //                 showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}");
        //             }

        //         },
        //         error: function (e) {

        //             if (handleAJAXError(this,e)) {
        //                 return false;
        //             }

        //             showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", 
        //                 e.responseText);

        //         }
        //     });
        // }

        $(function () {

            //disable
            $('body').on('click','.switch-animate', function(){
                if($(this).hasClass('switch-success')){
                    $(this).removeClass('switch-success').addClass('switch-off');    
                }else{
                    $(this).removeClass('switch-off').addClass('switch-success');     
                }
            });

            //new shop
            $('#addShop').on("click",function(){
                var name = $('#newName').val();
                var address = $('#newAddress').val();
                var tel = $('#newTel').val();
                var loginId = $('#newLoginId').val();
                var pwd = $('#newPwd').val();

                //Check Data Empty
                if (name.length == 0 || address.length == 0 || tel.length ==0 || loginId.length ==0 || pwd.length ==0) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                    return false;
                }

                var mydata = {
                        name:   name,
                        address:  address,
                        tel: tel,
                        loginId: loginId,
                        pwd
                };

                $.ajax({
                    url: "newQPayShop",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: $.toJSON(mydata),
                    success: function (d, status, xhr) {

                        if (d.result_code == 1) {
                           $("#gridShopList").bootstrapTable("refresh");
                        } else {
                            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }

                    },
                    error: function (e) {

                        if (handleAJAXError(this,e)) {
                            return false;
                        }

                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", 
                            e.responseText);

                    }
                });
            });

            // //edit point type
            // $('body').on('click','.editPointType',function(e) {
            
            //     var currentData = $("#gridPointTypeList").bootstrapTable('getData');
            //     var index = ($(this).data('index'));
            //     var rowId = ($(this).data('id'));
            //     var status = (currentData[index].status == 'Y')?true:false;
            //     $('#editColorSelector').ColorPicker({
            //         color: currentData[index].color,
            //         onShow: function (colpkr) {
            //             $(colpkr).css('zIndex',9999);
            //             $(colpkr).fadeIn(500);
            //             return false;
            //         },
            //         onHide: function (colpkr) {
            //             $(colpkr).fadeOut(500);
            //             return false;
            //         },
            //         onChange: function (hsb, hex, rgb) {
            //             $('#editColorSelector div').css('backgroundColor', '#' + hex);
            //             $('#editPointColor').val('#' + hex);
            //         },
            //     });
            //     $('#editRowId').val(rowId);
            //     $('#editPointTypeName').val(currentData[index].name);
            //     $('#editPointColor').val(currentData[index].color);
            //     $('#editColorSelector div').css('backgroundColor', currentData[index].color);
            //     $('#editStatus').bootstrapSwitch('setState', status);
            //     $('#editPointTypeDialog').modal('show');
            // });
        });


    </script>

@endsection