@include("layouts.lang")
<?php
    use App\lib\ResultCode;
    $menu_name = "QPAY_USER_SHOP";
?>
@extends('layouts.admin_template')
@section('content')
<style>
#newShopForm .col-lg-10 {
    width: 100%;
}
#newShopForm .col-md-2 {
    padding-right: 0px;
    padding-left: 0px;
    width: 14%;
}
#newShopForm .form-control {
    padding: 6px 8px;
}
</style>
    <h1></h1>
    <div class="row">
        <form id="newShopForm" name="newShopForm">
            <div class="col-lg-10 col-xs-10">
                <div class='col-md-2'>
                    <div class="form-group">
                        <label for="shopName">{{trans('messages.QPAY_SHOP_NAME')}}</label>
                        <div class="input-group">
                            <input class="form-control" type="text" name="shopName" placeholder="{{trans('messages.QPAY_INPUT_SHOP_NAME')}}">
                        </div>
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="address">{{trans('messages.QPAY_SHOP_ADDRESS')}}</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="address" placeholder="{{trans('messages.QPAY_INPUT_SHOP_ADDRESS')}}">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="tel">{{trans('messages.QPAY_SHOP_TEL')}}</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="tel" placeholder="{{trans('messages.QPAY_INPUT_SHOP_TEL')}}">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="loginId">{{trans('messages.USER_LOGIN_ID')}}</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="loginId" placeholder="{{trans('messages.QPAY_INPUT_LOGIN_ID')}}">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="pwd">{{trans('messages.USER_PWD')}}</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="pwd" maxlength="20" placeholder="{{trans('messages.QPAY_INPUT_ORI_PWD')}}">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="pwd_trade">{{trans('messages.QPAY_TRADE_PWD_DEFAULT')}}</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="pwd_trade" maxlength="4" placeholder="{{trans('messages.QPAY_TRADE_PWD')}}">
                    </div>
                </div>
                <div class='col-md-2'>
                    <label for="addShop">&nbsp;&nbsp;</label>
                    <div class="form-group">
                        <button type="button" id="addShop" class="btn btn-primary">{{trans('messages.NEW')}}</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div id="toolbar">
        <button type="button" class="btn btn-danger" onclick="deleteShop()" id="btnDeleteShop" style="display: none">
                {{trans("messages.DELETE")}}
        </button>
    </div>
    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <table id="gridShopList" class="bootstrapTable" data-toggle="table"
                   data-url="getQPayShopList"
                   data-sort-name="created_at" data-sort-order="desc" data-toolbar="#toolbar"
                   data-height="" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="false"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="emp_name" data-sortable="true" data-searchable="true"  data-formatter="shopNameFormatter">{{trans('messages.QPAY_SHOP_NAME')}}</th>
                    <th data-field="address" data-sortable="true" data-searchable="true"  data-formatter="addressFormatter">{{trans('messages.QPAY_SHOP_ADDRESS')}}</th>
                    <th data-field="ext_no" data-sortable="true" data-searchable="true" data-formatter="telFormatter">{{trans('messages.QPAY_SHOP_TEL')}}</th>
                    <th data-field="login_id" data-sortable="true" data-searchable="true" data-formatter="loginIdFormatter">{{trans('messages.USER_LOGIN_ID')}}</th>
                    <th data-field="" data-width="5px" data-searchable="false" data-formatter="resetPwdFormatter">{{trans('messages.RESET_PWD')}}</th>
                    <th data-field="" data-width="5px" data-searchable="false" data-formatter="resetOriginFormatter">{{trans('messages.RESET_TO_ORIGIN')}}
                    <th data-field="" data-width="5px" data-searchable="false" data-formatter="resetTradePwdFormatter">{{trans('messages.RESET_TRADE_PWD')}}</th>
                    <th data-field="status" data-width="10px" data-searchable="false" data-formatter="userStatusFormatter">{{trans('messages.QACCOUNT_USER_STATUS')}}</th>
                    <th data-field="trade_status" data-width="10px" data-searchable="false" data-formatter="tradeStatusFormatter">{{trans('messages.QPAY_TRADE_STATUS')}}</th>
                </tr>
                </thead>
            </table>
    </div>

    <div id="editShopDialog" class="modal fade">
        <form id="editShopForm">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h1 class="modal-title" id="editShopTitle">{{trans('messages.QPAY_UPDATE_SHOP_INFO')}}</h1>
                    </div>
                    <div class="modal-body">
                        <table style="width:100%">
                            <tr>
                                <td>{{trans('messages.QPAY_SHOP_NAME')}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" class="form-control" data-clear-btn="true" name="shopName" value="" placeholder="{{trans('messages.QPAY_INPUT_SHOP_NAME')}}"/>
                                    <span style="color: red;" class="error" for="editPointTypeName"></span>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td>{{trans('messages.QPAY_SHOP_ADDRESS')}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" class="form-control" data-clear-btn="true" name="address" value="" placeholder="{{trans('messages.QPAY_INPUT_SHOP_ADDRESS')}}"/>
                                    <span style="color: red;" class="error" for="address"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('messages.QPAY_SHOP_TEL')}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" class="form-control" data-clear-btn="true" name="tel" value="" placeholder="{{trans('messages.QPAY_INPUT_SHOP_TEL')}}"/>
                                    <span style="color: red;" class="error" for="tel"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('messages.USER_LOGIN_ID')}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" class="form-control" data-clear-btn="true" name="loginId" value="" placeholder="{{trans('messages.QPAY_INPUT_LOGIN_ID')}}"/>
                                    <span style="color: red;" class="error" for="loginId"></span>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <input name="shopId" type="hidden" value="" />
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button"  class="btn btn-danger" id="submitEditShop">{{trans("messages.SAVE")}}</button>
                        <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div id="resetPwdDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="resetPwdTitle">{{trans('messages.RESET_PWD')}}</h1>
                </div>
                <div class="modal-body">
                    <table style="width:100%">
                        <tr>
                            <td id ="newPwdInputTitle">{{trans('messages.NEW_PWD')}} : </td>
                            <td style="padding: 10px;">
                                <input type="text" class="form-control" data-clear-btn="true" id="resetPwd" value="" maxlength="20" placeholder="{{trans('messages.QPAY_INPUT_NEW_PWD')}}"/>
                                <span style="color: red;" class="error" for="resetPwd"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                            <input id="targetUserId" type="hidden" value="" />
                            <input id="targetIndex" type="hidden" value="" />
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="resetNewPwd()">{{trans("messages.CONFIRM")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="resetTradePwdDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="resetTradePwdTitle">{{trans('messages.RESET_TRADE_PWD')}}</h1>
                </div>
                <div class="modal-body">
                    <table style="width:100%">
                        <tr>
                            <td id ="newTradePwdInputTitle">{{trans('messages.NEW_PWD')}} : </td>
                            <td style="padding: 10px;">
                                <input type="text" class="form-control" data-clear-btn="true" id="resetTradePwd" value="" maxlength="4" placeholder="{{trans('messages.QPAY_INPUT_NEW_PWD')}}"/>
                                <span style="color: red;" class="error" for="resetTradePwd"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                            <input id="targetUserId2" type="hidden" value="" />
                            <input id="targetIndex2" type="hidden" value="" />
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="resetNewTradePwd()">{{trans("messages.CONFIRM")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        var passwordRegexp = /((^(?!.*[^\x21-\x7e])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$)|(^(?!.*[^\x21-\x7e])(?=.*[\W])(?=.*[A-Z])(?=.*\d).*$)|(^(?!.*[^\x21-\x7e])(?=.*[\W])(?=.*[a-z])(?=.*[A-Z]).*$)|(^(?!.*[^\x21-\x7e])(?=.*[\W])(?=.*[a-z])(?=.*\d).*$))/;

        var accountRegexp = /^[A-Za-z0-9.]*$/;

        var tradePwdRegexp = /^[0-9]*$/;

        function shopNameFormatter(value, row, index) {
            return '<a href="#" class="editShop" data-index="'+ index +'" data-id="' + row.row_id +'"><span class="glyphicon glyphicon-edit"></span> '+ htmlEscape(value) +'</a>';
        }

        function addressFormatter(value, row, index){
            return htmlEscape(value);
        }

        function telFormatter(value, row, index){
            return htmlEscape(value);
        }

        function loginIdFormatter(value, row, index){
            return htmlEscape(value);
        }

        function userStatusFormatter(value, row, index){
            
            var status = (value == 'Y')?'success':'off';
            return'<div class="switch has-switch" data-index="'+ index +'"data-shopid="'+ row.shop_id +'" data-userid="'+row.user_id+'"><div class="switch-'+ status +' switch-animate user-status"><input type="checkbox"><span class="switch-left switch-success">Y</span><label class="">&nbsp;</label><span class="switch-right">N</span></div></div></div>';
        }

        function tradeStatusFormatter(value, row, index){

            var status = (value == 'Y')?'success':'off';
            return'<div class="switch has-switch" data-index="'+ index +'" data-shopid="'+ row.shop_id +'" data-userid="'+row.user_id+'"><div class="switch-'+ status +' switch-animate trade-status"><input type="checkbox"><span class="switch-left switch-success">Y</span><label class="">&nbsp;</label><span class="switch-right">N</span></div></div></div>';
        }

        function resetPwdFormatter(value, row, index){

            if(value!=""){
                return '<div class="reset-pwd-block" id="resetPwdBlock_' + row.user_id + '" style="text-align: center;"><button type="button" data-index="' + index + '" data-userid="' + row.user_id + '" class="btn btn-light reset-pwd" title="{{trans('messages.RESET_PWD')}}">Reset</button></div>';
            }
        }

        function resetOriginFormatter(value, row, index){

            if(value!=""){
                return '<div class="reset-ori-block" id="resetOriBlock_' + row.user_id + '" style="text-align: center;"><button type="button" data-index="' + index + '"data-userid="' + row.user_id + '" class="btn btn-light reset-ori" title="{{trans('messages.RESET_TO_ORIGIN')}}">Reset Origin</button></div>';
            }
        }

        function resetTradePwdFormatter(value, row, index){

            if(value!=""){
                return '<div class="reset-pwd-block" id="resetTradePwdBlock_' + row.user_id + '" style="text-align: center;"><button type="button" data-index="' + index + '" data-userid="' + row.user_id + '" class="btn btn-light reset-trade-pwd" title="{{trans('messages.RESET_TRADE_PWD')}}">Reset</button></div>';
            }
        }
        
        function deleteShop(){

            showConfirmDialog('{{trans("messages.CONFIRM")}}', '{{trans("messages.QPAY_SHOP_CONFIRM_DELETE_DIALOG")}}?','', function () {
                hideConfirmDialog();

                var $gridList = $("#gridShopList");
                var $toolbar  =  $($gridList.data('toolbar'));
                var selecItems = $gridList.bootstrapTable('getSelections');
                var shopIdList = [];
                $.each(selecItems, function(i, shop) {
                    shopIdList.push(shop.shop_id);
                });
                var mydata = {
                    shopIdList:  shopIdList
                };
                $.ajax({
                    url: "deleteShop",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: $.toJSON(mydata),
                    success: function (d, status, xhr) {
                        if (d.result_code == 1) {
                           $('#editShopDialog').modal('hide');
                           $("#gridShopList").bootstrapTable("refresh");
                        } else {
                            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }
                    },
                    error: function (e) {

                        if (handleAJAXError(this, e, "../")) {
                            return false;
                        }

                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", 
                            e.responseText);
                    }
                });
            });
        }

        function resetNewPwd(){

            var resetPwd = $("#resetPwd").val();
            var userId = $("#targetUserId").val();
            var index = $('#targetIndex').val();
            var $block = $("#resetPwdBlock_" + userId);

            var patt = new RegExp(passwordRegexp);
            var res = patt.test(resetPwd);
            var checkFail = false;

            if (!res) {
                checkFail = true;
            }

            if (resetPwd.length < 8 || resetPwd.length > 20) {
                checkFail = true;
            }

            if (checkFail) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            var mydata = {
                userId: userId,
                resetPwd: resetPwd
            };

            resetQAccountPwd(
                mydata, 
                function(){
                    $('#resetPwdDialog').modal('hide');
                    $block.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
                },
                function(){
                    $block.html(' <button type="button" data-index="' + index + '" data-userid="' + userId + '" class="btn btn-light reset-pwd" title="{{trans('messages.RESET_PWD')}}">Reset</button>');
                }
            );
        }

        function resetNewTradePwd(){

            var resetTradePwd = $("#resetTradePwd").val();
            var userId = $("#targetUserId2").val();
            var index = $('#targetIndex2').val();
            var $block = $("#resetTradePwdBlock_" + userId);

            var patt = new RegExp(tradePwdRegexp);
            var res = patt.test(resetTradePwd);
            var checkFail = false;

            if (!res) {
                checkFail = true;
            }

            if (resetTradePwd.length != 4) {
                checkFail = true;
            }

            if (checkFail) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            var mydata = {
                userId: userId,
                resetTradePwd: resetTradePwd
            };

            updateShopTradePwd(
                mydata,
                function(){
                    $('#resetTradePwdDialog').modal('hide');
                    $block.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
                },
                function(){
                    $block.html(' <button type="button" data-index="' + index + '" data-userid="' + userId + '" class="btn btn-light reset-pwd" title="{{trans('messages.RESET_PWD')}}">Reset</button>');
                }
            );
        }

        var selectedChanged = function (row, $element) {
            var selectedUsers = $("#gridShopList").bootstrapTable('getSelections');
            if(selectedUsers.length > 0) {
                 $("#btnDeleteShop").fadeIn(300);
            } else {
                $("#btnDeleteShop").fadeOut(300);
            }
        }

        var resetQAccountPwd = function(mydata, beforeSend, complete){

            var mydataStr = $.toJSON(mydata);

            $.ajax({
                url: "resetQAccountPwd",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                beforeSend: beforeSend,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                        $("#gridShopList").bootstrapTable("refresh");
                        return false;
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this, e, "../")){
                        return false;
                    }
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                },
                complete:complete
            });
        }

        var updateShopTradePwd = function(mydata, beforeSend, complete){

            var mydataStr = $.toJSON(mydata);

            $.ajax({
                url: "updateShopTradePwd",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                beforeSend: beforeSend,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                        $("#gridShopList").bootstrapTable("refresh");
                        return false;
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this, e, "../")){
                        return false;
                    }
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                },
                complete:complete
            });
        }

        $(function () {
            $.validator.addMethod(
                    "regex",
                    function(value, element, regexp) {
                        var m;
                        var test = false;
                        if ((m = regexp.exec(value)) !== null) {
                            test = true;
                        }
                        return this.optional(element) || test;
                    }
            );

            $('#gridShopList').on('check.bs.table', selectedChanged);
            $('#gridShopList').on('uncheck.bs.table', selectedChanged);
            $('#gridShopList').on('check-all.bs.table', selectedChanged);
            $('#gridShopList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridShopList').on('load-success.bs.table', selectedChanged);

            // switch user status
            $('body').on('click','.user-status', function(){
                
                var status = 'off';
                var switchToStr = '{{trans("messages.OPEN")}}';
                var $thisObj = $(this);
                var userId = $(this).parents().data('userid');
                var index = $(this).parents().data('index');
                
                var currentData = $('#gridShopList').bootstrapTable('getData');
                var row = currentData[index];

                if($thisObj.hasClass('switch-success')){
                    status = 'success';
                    switchToStr = '{{trans("messages.CLOSE")}}';   
                }

                showConfirmDialog( switchToStr + "{{trans("messages.QACCOUNT_USER_STATUS")}}", "{{trans("messages.CONFIRM")}}" + switchToStr + "{{trans("messages.USER_LOGIN_ID")}} <b>"+ row.login_id +"</b> {{trans("messages.QACCOUNT_USER_STATUS")}}?","", function () {
                  
                    hideConfirmDialog();
                    var action = '';
                    if(status == 'success'){
                       $thisObj.removeClass('switch-success').addClass('switch-off');
                       action = 'close';
                    }else{
                       $thisObj.removeClass('switch-off').addClass('switch-success');     
                       action = 'open';
                    }              
                    var mydata =
                        {
                            userId: userId,
                            action: action 
                        };
                    var mydataStr = $.toJSON(mydata);
                    $.ajax({
                        url: "updateUserStatus",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: mydataStr,
                        success: function (d, status, xhr) {
                            if(d.result_code != 1) {
                                
                                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                                $("#gridShopList").bootstrapTable("refresh");
                                return false;

                            }
                        },
                        error: function (e) {
                            if(handleAJAXError(this, e, "../")){
                                return false;
                            }
                              showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                        }
                    });
                });
            });

            //update trade status
            $('body').on('click','.trade-status', function(){
                var status = 'off';
                var switchToStr = '{{trans("messages.OPEN")}}';
                var $thisObj = $(this);
                var shopId = $(this).parents().data('shopid');
                var index = $(this).parents().data('index');
                if($thisObj.hasClass('switch-success')){
                    status = 'success';
                    switchToStr = '{{trans("messages.CLOSE")}}';   
                }
                var currentData = $('#gridShopList').bootstrapTable('getData');
                var row = currentData[index];

                showConfirmDialog( switchToStr + "{{trans("messages.QPAY_TRAD_STATUS")}}", "{{trans("messages.CONFIRM")}}" + switchToStr + "<b> "+ row.emp_name +" </b>{{trans("messages.QPAY_TRAD_STATUS")}}?","", function () { 
                
                    hideConfirmDialog();
                    var action = '';
                    if(status == 'success'){
                       $thisObj.removeClass('switch-success').addClass('switch-off');
                       action = 'close';
                    }else{
                       $thisObj.removeClass('switch-off').addClass('switch-success');     
                       action = 'open';
                    }              
                    var mydata =
                        {
                            shopId: shopId,
                            action: action 
                        };
                    var mydataStr = $.toJSON(mydata);
                    $.ajax({
                        url: "updateTradeStatus",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: mydataStr,
                        success: function (d, status, xhr) {
                            if(d.result_code != 1) {
                                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                                $("#gridShopList").bootstrapTable("refresh");
                                return false;
                            }
                        },
                        error: function (e) {
                            if(handleAJAXError(this, e, "../")){
                                return false;
                            }
                              showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                        }
                    });
                });
            });

            //reset ori QAccount password
            $('body').on('click','.reset-ori', function(){
                var userId = $(this).data('userid');
                var index = $(this).data('index');
                var $block = $("#resetOriBlock_" + userId);
                var currentData = $('#gridShopList').bootstrapTable('getData');
                var row = currentData[index];
                var mydata =
                        {
                            userId: userId
                        };
                showConfirmDialog( "{{trans('messages.RESET_TO_ORIGIN')}}", "{{trans('messages.CONFIRM_RESET_TO_ORI_PWD')}}".replace("%s", row.login_id), "", function () { 
                    hideConfirmDialog();
                    resetQAccountPwd(
                        mydata, 
                        function(){
                            $block.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
                        },
                        function(){
                            $block.html('<button type="button" data-index="' + index + '"data-userid="' + userId + '" class="btn btn-light reset-ori" title="{{trans('messages.RESET_TO_ORIGIN')}}">Reset Origin</button>');
                        }
                    );
                });
            });

            //reset new QAccount password
            $('body').on('click','.reset-pwd', function(){
                var index = $(this).data('index');
                var currentData = $('#gridShopList').bootstrapTable('getData');
                var row = currentData[index];
                $('#resetPwdDialog').find("#newPwdInputTitle").text("{{trans('messages.INPUT_NEW_RESET_PWD_LABEL')}}:".replace("%s", row.login_id));
                $("#resetPwd").val("");
                $('#targetUserId').val($(this).data('userid'));
                $('#targetIndex').val(index);
                $('#resetPwdDialog').modal('show');
            });

            //reset Trade password
            $('body').on('click','.reset-trade-pwd', function(){
                var index = $(this).data('index');
                var currentData = $('#gridShopList').bootstrapTable('getData');
                var row = currentData[index];
                $('#resetTradePwdDialog').find("#newTradePwdInputTitle").text("{{trans('messages.INPUT_NEW_RESET_TRADE_PWD_LABEL')}}:".replace("%s", row.login_id));
                $("#resetTradePwd").val("");
                $('#targetUserId2').val($(this).data('userid'));
                $('#targetIndex2').val(index);
                $('#resetTradePwdDialog').modal('show');
            });

            //new shop
            $('#addShop').on("click",function(){
                $('#newShopForm').submit();
            });

            $("#newShopForm").validate({
                rules: {           
                    shopName: {
                        required: true,
                        maxlength: 20
                    },
                    address: {
                        maxlength: 50
                    },
                    tel: {
                        maxlength: 50
                    },
                    loginId:{
                        required: true,
                        rangelength: [4,20],
                        regex: accountRegexp
                    },
                    pwd:{
                        required: true,
                        rangelength: [8,20],
                        regex: passwordRegexp
                    },
                    pwd_trade:{
                        required: true,
                        digits: true,
                        rangelength: [4,4],
                        regex: tradePwdRegexp
                    }
                },
                submitHandler: function(form) {

                    var name = $(form).find('input[name=shopName]').val();
                    var address = $(form).find('input[name=address]').val();
                    var tel = $(form).find('input[name=tel]').val();
                    var loginId = $(form).find('input[name=loginId]').val();
                    var pwd = $(form).find('input[name=pwd]').val();
                    var pwd_trade = $(form).find('input[name=pwd_trade]').val();

                    var mydata = {
                            name:   name,
                            address:  address,
                            tel: tel,
                            loginId: loginId,
                            pwd: pwd,
                            pwd_trade: pwd_trade
                    };
                    $.ajax({
                        url: "newQPayShop",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: $.toJSON(mydata),
                        success: function (d, status, xhr) {
                            if (d.result_code == 1) {
                                $(form).find('input').val("");
                            
                            }else if(d.result_code == "000922"){
                                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.QPAY_ERROR_MSG_DUPLICATE_SHOP_LOGIN_ID")}}");
                            }else{
                                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}");
                            }

                            $("#gridShopList").bootstrapTable("refresh");

                        },
                        error: function (e) {

                            if (handleAJAXError(this, e, "../")) {
                                return false;
                            }

                            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", 
                                e.responseText);

                        }
                    });       
                }
            });

            //edit shop
            $('body').on('click','.editShop',function(e) {
                var currentData = $("#gridShopList").bootstrapTable('getData');
                var $form =  $("#editShopForm");
                var index = ($(this).data('index'));
                $form.find('input[name=shopId]').val(currentData[index].shop_id);
                $form.find('input[name=shopName]').val(currentData[index].emp_name);
                $form.find('input[name=address]').val(currentData[index].address);
                $form.find('input[name=tel]').val(currentData[index].ext_no);
                $form.find('input[name=loginId]').val(currentData[index].login_id);
                $form.find("input").removeClass("error");
                $form.find("label.error").hide();
                $('#editShopDialog').modal('show');
            });

            $('body').on('click','#submitEditShop',function(e) {
                $("#editShopForm").submit();
            });
             $("#editShopForm").validate({
                rules: {           
                    shopName: {
                        required: true,
                        maxlength: 20
                    },
                    address: {
                        maxlength: 50
                    },
                    tel: {
                        maxlength: 50
                    },
                    loginId:{
                        required: true,
                        rangelength: [4,20],
                        regex: accountRegexp
                    }
                },
                submitHandler: function(form) {
                    
                    var name = $(form).find('input[name=shopName]').val();
                    var address = $(form).find('input[name=address]').val();
                    var tel = $(form).find('input[name=tel]').val();
                    var loginId = $(form).find('input[name=loginId]').val();
                    var shopId = $(form).find('input[name=shopId]').val();
                    
                    var mydata = {
                            shopId:  shopId,
                            name:   name,
                            address:  address,
                            tel: tel,
                            loginId: loginId
                    };
                    $.ajax({
                        url: "updateShop",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: $.toJSON(mydata),
                        success: function (d, status, xhr) {
                            if (d.result_code == 1) {
                                $('#editShopDialog').modal('hide');
                            }else if(d.result_code == "000922"){
                                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.QPAY_ERROR_MSG_DUPLICATE_SHOP_LOGIN_ID")}}");
                            }else{
                                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}");
                            }

                            $("#gridShopList").bootstrapTable("refresh");

                        },
                        error: function (e) {

                            if (handleAJAXError(this, e, "../")) {
                                return false;
                            }

                            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", 
                                e.responseText);

                        }
                    });       
                }
            });

        });

    </script>

@endsection