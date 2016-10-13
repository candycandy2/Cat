@include("layouts.lang")
<ul class="nav nav-tabs">
    <li role="presentation" class="active"><a href="#tab_version_android" data-toggle="tab">Android</a></li>
    <li role="presentation"><a href="#tab_version_ios" data-toggle="tab">IOS</a></li>
</ul>
<div class="tab-content">
    <div class="tab-pane fade in active" id="tab_version_android">
        @include($version_path. '.version_android')
    </div> 
    <div class="tab-pane fade" id="tab_version_ios">
        @include($version_path. '.version_ios')
    </div>
</div>


<div id="newAppVersionDialog" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h1 class="modal-title" id="newAppVersionDialogTitle">上傳新版本</h1>
            </div>
            <div class="modal-body">
                <form id="newAppVersionForm" source="" enctype='multipart/form-data' action="AppMaintain/saveAppVersion" method="post">
                    <table style="width:100%">
                        <tr>
                            <td>版本名稱:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxVersionName"
                                       id="tbxVersionName" value=""/>
                                <span style="color: red;" class="error" for="tbxVersionName"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>版本號:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxVersionNo"
                                       id="tbxVersionNo" value=""/>
                                <span style="color: red;" class="error" for="tbxVersionNo"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>檔案:</td>
                            <td style="padding: 10px;">
                                <span class="btn btn-primary btn-file">
                                    瀏覽檔案<input type="file" id="file" name="file" class="file">
                                </span>
                                <span class="file-input-name" style="padding-left: 20px"></span>
                                <span style="color: red;" class="error" for="file"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button"  class="btn btn-danger" onclick="uploadNewVersion()">{{trans("messages.NEW")}}</button>
                <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CANCEL")}}</button>
            </div>
        </div>
    </div>
</div>



<div id="appVersionDialog" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h1 class="modal-title" id="appVersionDialogDialogTitle">修改版本</h1>
            </div>
            <div class="modal-body">
                <table style="width:100%">
                    <tr>
                        <td>版本名稱:</td>
                        <td style="padding: 10px;">
                            <input type="text" class="form-control" data-clear-btn="true" name="tbxEditVersionName"
                                   id="tbxEditVersionName" value=""/>
                            <span style="color: red;" class="error" for="tbxEditVersionName"></span>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>檔案:</td>
                        <td style="padding: 10px;">
                            <input type="text" class="form-control" data-clear-btn="true" name="tbxEditVersionUrl"
                                   id="tbxEditVersionUrl" value="" disabled />
                        </td>
                    </tr>
                    <tr>
                        <td>狀態:</td>
                        <td style="padding: 10px;">
                            <input type="text" class="form-control" data-clear-btn="true" name="tbxEditVersionStatus"
                                   id="tbxEditVersionStatus" value="" disabled/>
                        </td>
                    </tr>
                    <input type="hidden"  id="hidVersionRowId" name="hidVersionRowId">
                    <input type="hidden"  id="hidDeviceType" name="hidDeviceType">
                </table>
            </div>
            <div class="modal-footer">
                <button type="button"  class="btn btn-danger" onclick="EditAppVersion()">{{trans("messages.SAVE")}}</button>
                <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
            </div>
        </div>
    </div>
</div>


<script>

var newAppVersion = function (device){

        $('form').attr('device',device);
        $dialogObj = $("#newAppVersionDialog");
        $dialogObj.find('#file').val("");
        $dialogObj.find('.file-input-name').text("");
        $dialogObj.find('input[type=text]').val("");
        $dialogObj.find('span.error').html("");
        $dialogObj.modal('show');
    }

function switchFormatter(value, row) {
    var status = (row.status == 'ready')?'on':'off';
    return'<div class="switch  has-switch" data-version="'+ row.row_id +'" data-name="'+row.version_name+'"><div class="switch-'+ status +' switch-animate"><input type="checkbox"><span class="switch-left switch-success">Publish</span><label class="">&nbsp;</label><span class="switch-right">UnPlish</span></div></div></div>';
};

function versionNameFormatter(value, row) {
    return '<a href="#" class="editVersion" onclick="updateVersion(' + row.row_id +',\''+ row.device_type +'\',\'' + row.version_name + '\',\'' +row.url + '\',\'' + row.status + '\')">' + value + '</a>';
};

function versionUrlFormatter(value, row) {
    return ;
};

var updateVersion = function(row_id, device_type, version_name, url, status){
    var statusStr = (status == 'ready')?'Published':'UnPlished';
    $('#hidVersionRowId').val(row_id);
    $('#hidDeviceType').val(device_type);
    $('#tbxEditVersionName').val(version_name);
    $('#tbxEditVersionUrl').val(url);
    $('#tbxEditVersionStatus').val(statusStr);
    $('#appVersionDialog').modal('show');
    $('#appVersionDialog').find('span.error').html("");
}

var EditAppVersion = function(){

  var require = ['tbxEditVersionName'];
  var errors = validRequired(require);

   $.each(errors,function(i, error){
        $('span[for='+error.field+']').html(error.msg);
   });

   if(errors.length > 0){
    return false;
   }

    var mydata = {
        versionRowId: $('#hidVersionRowId').val(),
        versionName: $('#tbxEditVersionName').val()
    };
    var $gridEditVersionListObj = ($("#hidDeviceType") == 'ios')?$("#gridIOSVersionList"):$("#gridAndroidVersionList");
    var mydataStr = $.toJSON(mydata);
    $.ajax({
        url: "AppMaintain/editAppVersion",
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        data: mydataStr,
        success: function (d, status, xhr) {
            if(d.result_code != 1) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_CATEGORY_FAILED")}}");
            }  else {
                $gridEditVersionListObj.bootstrapTable('refresh');
                $("#appVersionDialog").modal('hide');
                showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
            }
        },
        error: function (e) {
            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_CATEGORY_FAILED")}}", e.responseText);
        }
    });

}

function validRequired(fieldList){
    var errors = new Array();
    $.each(fieldList, function(i, item) {
        var value = $('input[name='+item+']').val();
        if($.trim(value) == ""){
            var error = new Error;
            error.field = item;
            error.msg = '此為必填欄位';
            errors.push(error);
        }
   });
    return errors;
}

function Error(field, msg) {
    this.field = field;
    this.msg = msg;
}
var clearError = function($target){
    var field = $target.attr('name');
    $('span[for='+field+']').html("");
}

var uploadNewVersion = function(){
    var device = $('#newAppVersionForm').attr('device');
    var require = ['tbxVersionName','tbxVersionNo','file'];
    var _validExtension = (device == 'ios')?'ipa':'apk';
    var errors = validRequired(require);
    var fileName = $('input[name=file]').val();

   if($('input[name=file]').val().length > 0){
        var fileExtension = fileName.split('.').pop();
         if(fileExtension != _validExtension){
            var error = new Error;
            error.field = 'file';
            error.msg = device+'僅接受'+_validExtension+'檔案';
            errors.push(error);
         }
   }

   $.each(errors,function(i, error){
        $('span[for='+error.field+']').html(error.msg);
   });

   if(errors.length > 0){
    return false;
   }
   submitNewAppForm(device);

}

var submitNewAppForm = function(device){
   var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
   var formData = new FormData($('#newAppVersionForm')[0]);
   formData.append("appRowId", {{app('request')->input('app_row_id')}});
   formData.append("appKey", $('#txbAppKey').val());
   formData.append("deviceType",device);

     $.ajax({
        url: "AppMaintain/saveAppVersion",
        type: "POST",
        contentType: false,
        data: formData,
        processData: false,
        success: function (d, status, xhr) {
            if(d.result_code != 1) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
            }  else {
                $gridList.bootstrapTable('refresh');
                showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
            }
        },
        error: function (e) {
            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
        }
    });

    hideConfirmDialog();
    $("#newAppVersionDialog").modal('hide');

}

var delAppVersion = function(device){
    var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var selectedVersion = $gridList.bootstrapTable('getSelections');
    var validToDelete = true;
    $.each(selectedVersion,function(i, version){
        if(version['status'] == 'ready'){
           validToDelete = false;
           return false;
        }
    });
    if(validToDelete){
         showConfirmDialog("{{trans("messages.CONFIRM")}}", "系統將刪除所選版本，確認刪除?", "", function () {
                hideConfirmDialog();
                var versionItemList = new Array();
                var appRowId = {{app('request')->input('app_row_id')}};
                $.each(selectedVersion, function(i, version){
                    var versionItem = new Object();
                    versionItem.row_id = version.row_id;
                    versionItem.app_row_id = appRowId;
                    versionItem.device_type = version.device_type;
                    versionItem.version_code = version.version_code;
                    versionItem.url = version.url;
                    versionItemList.push(versionItem);
                });
                var mydata = {versionItemList:versionItemList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "AppMaintain/deleteAppVersion",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","刪除版本失敗!");
                        }  else {
                            $gridList.bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "刪除版本失敗!", e.responseText);
                    }
                });
            });
    }else{
        showMessageDialog("無法刪除","所選版本為發布狀態，不可刪除");
    }
}

var showUploadFileName = function($target){
    var fileName;
    fileName = $target.val();
    $target.parent().next('.file-input-name').remove();
    if (!!$target.prop('files') && $target.prop('files').length > 1) {
        fileName =$target[0].files.length+' files';
    }
    else {
        fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    }
    if (!fileName) {
        return;
    }
    $target.parent().after('<span class="file-input-name" style="padding-left: 20px">'+fileName+'</span>');  
}

var unPublishApp = function(versionId,$gridList){
    var mydata = {versionRowId:versionId};
    var mydataStr = $.toJSON(mydata);

    $.ajax({
        url: "AppMaintain/unPublishApp",
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        data: mydataStr,
        success: function (d, status, xhr) {
            if(d.result_code != 1) {
                showMessageDialog("{{trans("messages.ERROR")}}","應用程式下架失敗");
            }  else {
                $gridList.bootstrapTable('refresh');
                 $publishAppHint = $('#appVersionStatus').find('span[data-toggle='+ $gridList.attr("id") +']');
                 $publishAppHint.text( $publishAppHint.text().split('-')[0] + '-' + 'UnPlished');
                 $publishAppHint.css('font-weight','normal')
            }
        },
        error: function (e) {
            showMessageDialog("{{trans("messages.ERROR")}}", "應用程式下架失敗", e.responseText);
        }
    });
}

var publishApp = function(versionId,versionName,$gridList){
    //Cleo TODO: 錯誤顯示
    var errorCount = 0;
    $('#mainInfoForm').find('input,textarea').each(function(){
        if($(this).val() == ""){
            var langCode = $(this).attr('id').split('_')[1];
            console.log($('#ddlLang_' + langCode).children('a').text());
            console.log($(this).parent().prev().text());
           //errorMsg += '應用程式資訊尚未填寫完成</br>';
           errorCount++;
        }
    });

    if($('#ddlAppUserType').val() == 1){
        if($('#selNormal').find('input:checked').length == 0){
             //console.log('selNormal ==0');
             errorCount++;
        }
    }else{
        $('#selUserRole').find('.js-role-table').each(function(){
            if($(this).find('input:checked').length == 0){
                //console.log('selUserRole ==0');
                errorCount++;
            }
        });
        if($('#gridUserList').bootstrapTable('getData').length == 0){
            //console.log('gridUserList ==0');
                errorCount++;
        }

    }

   if(errorCount > 0){
        showMessageDialog("{{trans("messages.ERROR")}}","資訊尚未填寫完成!");
        return false;
   }else{
        var mydata = {versionRowId:versionId};
        var mydataStr = $.toJSON(mydata);
        $.ajax({
            url: "AppMaintain/publishApp",
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            data: mydataStr,
            success: function (d, status, xhr) {
                if(d.result_code != 1) {
                    showMessageDialog("{{trans("messages.ERROR")}}","應用程式上架失敗");
                }  else {
                    $gridList.bootstrapTable('refresh');
                    $publishAppHint = $('#appVersionStatus').find('span[data-toggle='+ $gridList.attr("id") +']');
                    $publishAppHint.text( $publishAppHint.text().split('-')[0] + '-' + versionName);
                    $publishAppHint.css('font-weight','bold');
                }
            },
            error: function (e) {
                showMessageDialog("{{trans("messages.ERROR")}}", "應用程式上架失敗", e.responseText);
            }
        });

   }
}

$(function () {
    $('body').on('change','.file', function(){showUploadFileName($(this))});
    $('body').on('keypress','input[type=text]', function(){clearError($(this));});
    $('body').on('change','input[type=file]', function(){clearError($(this));});
    $('body').on('click','.switch-on', function(){
        var versionId = $(this).parents('.switch').data('version');
        var $gridList = $(this).parents('.bootstrapTable');
        unPublishApp(versionId,$gridList);
    });

    $('body').on('click','.switch-off', function(){
        
        var versionId = $(this).parents('.switch').data('version');
        var versionName = $(this).parents('.switch').data('name');
        var $gridList = $(this).parents('.bootstrapTable');
        publishApp(versionId,versionName,$gridList);
    });

});
</script>