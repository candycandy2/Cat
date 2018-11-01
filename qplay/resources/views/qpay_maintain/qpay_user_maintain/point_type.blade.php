@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_USER_POINT_TYPE";
?>
@extends('layouts.admin_template')
@section('content')
    <h1></h1>
    <div class="row">
        <div class="col-lg-6 col-xs-6">
                <div class='col-md-3'>
                    <div class="form-group">
                        <label for="pointType">{{trans('messages.QPAY_POINT_TYPE')}}</label>
                        <div class="input-group">
                            <input class="form-control" type="text" name="" id="pointType" placeholder="{{trans('messages.QPAY_INPUT_POINT_TYPE')}}">
                        </div>
                    </div>
                </div>
                <div class='col-md-3'>
                    <label for="newColorSelector">{{trans('messages.QPAY_POINT_COLOR')}}</label>
                    <div class="form-group">
                        <div id="newColorSelector" class="color_selector"><div style="background-color: #0000ff;"></div></div>
                        <input class="form-control" type="text" value="#0000ff" id="pointColor" style="display: none">
                    </div>
                </div>
                 <div class='col-md-3'>
                    <label for="addPointType">&nbsp;&nbsp;</label>
                    <div class="form-group">
                        <button type="button" id="addPointType" class="btn btn-primary">{{trans('messages.NEW')}}</button>
                    </div>
                </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <table id="gridPointTypeList" class="bootstrapTable" data-toggle="table"
                   data-url="getQPayUserPointTypeList"
                   data-sort-name="point_type_name" data-sort-order="desc" data-toolbar="#toolbar"
                   data-height="" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="false"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="name" data-sortable="true" data-searchable="true" data-width="30%" data-formatter="pointTypeNameFormatter">{{trans('messages.QPAY_POINT_TYPE')}}</th>
                    <th data-field="color" data-sortable="false" data-searchable="false" data-width="30%" data-formatter="pointTypeColorFormatter">{{trans('messages.QPAY_POINT_COLOR')}}</th>
                    <th data-field="status" data-sortable="true" data-searchable="false" data-width="30%" data-formatter="pointTyprStatusFormatter">{{trans('messages.QPAY_POINT_TYPE_STATUS')}}</th>
                </tr>
                </thead>
            </table>
    </div>

    <div id="editPointTypeDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="editPointTypeTitle">{{trans('messages.QPAY_UPDATE_POINT_TYPE')}}</h1>
                </div>
                <div class="modal-body">
                    <table style="width:100%">
                        <tr>
                            <td>{{trans('messages.QPAY_POINT_TYPE')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" class="form-control" data-clear-btn="true" id="editPointTypeName" value=""/>
                                <span style="color: red;" class="error" for="editPointTypeName"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.QPAY_POINT_COLOR')}}:</td>
                            <td style="padding: 10px;">
                                <div id="editColorSelector" class="color_selector"><div style="background-color: #0000ff;"></div></div>
                                <input id="editPointColor" class="form-control" type="text" value="#0000ff" style="display: none">
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.ENABLE')}}:</td>
                            <td style="padding: 10px;">
                                <div id="editStatus" class="switch"  data-on="success" data-on-label="Y" data-off-label="N">
                                    <input type="checkbox" checked />
                                </div>
                            </td>
                        </tr>
                        <input id="editRowId" type="hidden" value="" />
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="editPintType()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        
        function pointTypeNameFormatter(value, row, index) {
            return '<a href="#" class="editPointType" data-index="'+ index +'" data-id="' + row.row_id +'"><span class="glyphicon glyphicon-edit"></span> '+ value +'</a>';
        };

        function pointTypeColorFormatter(value, row) {
            return '<canvas id="colorBlock" width="10" height="10" style="background-color: ' + value + ';"></canvas> ' + value;
        };

        function pointTyprStatusFormatter(value, row){
            if (value == "Y") {
                return "{{trans("messages.ENABLE")}}";
            } else if (value == "N") {
                return "{{trans("messages.DISABLE")}}";
            }
        }

        function editPintType(){
            var rowId = $('#editRowId').val();
            var name = $('#editPointTypeName').val();
            var color = $('#editPointColor').val();
            var status =  ($('#editStatus').bootstrapSwitch('status'))?'Y':'N';
            
            //Check Data Empty
            if (name.length == 0 || color.length == 0 ) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            var mydata = {
                        rowId:  rowId,
                        name:   name,
                        color:  color,
                        status: status
                };

            $.ajax({
                url: "editPointType",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: $.toJSON(mydata),
                success: function (d, status, xhr) {
                    if (d.result_code == 1) {
                       $('#editPointTypeDialog').modal('hide');
                       $("#gridPointTypeList").bootstrapTable("refresh");
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
        }

        $(function () {
            $('#newColorSelector').ColorPicker({
                color: '#0000ff',
                onShow: function (colpkr) {
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $('#newColorSelector div').css('backgroundColor', '#' + hex);
                    $('#pointColor').val('#' + hex);
                },
            });

            //new point type
            $('#addPointType').on("click",function(){
                var name = $('#pointType').val();
                var color =  $('#pointColor').val();
                
                //Check Data Empty
                if (name.length == 0 || color.length == 0 ) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                    return false;
                }
                var mydata = {
                        name:   name,
                        color:  color
                };

                $.ajax({
                    url: "newPointType",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: $.toJSON(mydata),
                    success: function (d, status, xhr) {

                        if (d.result_code == 1) {
                           $('#pointType').val("");
                           $('#pointColor').val("#0000ff");
                           $('#newColorSelector div').css('backgroundColor', "#0000ff");
                           $("#gridPointTypeList").bootstrapTable("refresh");
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

            //edit point type
            $('body').on('click','.editPointType',function(e) {
            
                var currentData = $("#gridPointTypeList").bootstrapTable('getData');
                var index = ($(this).data('index'));
                var rowId = ($(this).data('id'));
                var status = (currentData[index].status == 'Y')?true:false;
                $('#editColorSelector').ColorPicker({
                    color: currentData[index].color,
                    onShow: function (colpkr) {
                        $(colpkr).css('zIndex',9999);
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#editColorSelector div').css('backgroundColor', '#' + hex);
                        $('#editPointColor').val('#' + hex);
                    },
                });
                $('#editRowId').val(rowId);
                $('#editPointTypeName').val(currentData[index].name);
                $('#editPointColor').val(currentData[index].color);
                $('#editColorSelector div').css('backgroundColor', currentData[index].color);
                $('#editStatus').bootstrapSwitch('setState', status);
                $('#editPointTypeDialog').modal('show');
            });
        });


    </script>

@endsection