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
                <h1 class="modal-title" id="newAppVersionDialogTitle">{{trans('messages.UPLOAD_NEW_VERSION')}}</h1>
            </div>
            <div class="modal-body">
                <form id="newAppVersionForm" source="" enctype='multipart/form-data' action="AppMaintain/saveAppVersion" method="post">
                    <table style="width:100%">
                        <tr>
                            <td>{{trans('messages.VERSION_NAME')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxVersionName"
                                       id="tbxVersionName" value=""/>
                                <span style="color: red;" class="error" for="tbxVersionName"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.VERSION_NO')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxVersionNo"
                                       id="tbxVersionNo" value=""/>
                                <span style="color: red;" class="error" for="tbxVersionNo"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.VERSION_LOG')}}:</td>
                            <td style="padding: 10px;">
                                <textarea data-clear-btn="true" class="form-control" name="tbxVersionLog"
                                       id="tbxVersionLog" value="" style="height: 300px"/></textarea>
                                <span style="color: red;" class="error" for="tbxVersionLog"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.FILE')}}:</td>
                            <td style="padding: 10px;">
                                <span class="btn btn-primary btn-file">
                                    {{trans('messages.BROWSE_FILE')}}<input type="file" id="versionFile" name="versionFile" class="file">
                                </span>
                                <span class="file-input-name" style="padding-left: 20px"></span>
                                <span style="color: red;" class="error" for="versionFile"></span>
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
                <h1 class="modal-title" id="appVersionDialogDialogTitle">{{trans('messages.EDIT_VERSION')}}</h1>
            </div>
            <div class="modal-body">
                <table style="width:100%">
                    <tr>
                        <td>{{trans('messages.VERSION_NAME')}}:</td>
                        <td style="padding: 10px;">
                            <input type="text" class="form-control" data-clear-btn="true" name="tbxEditVersionName"
                                   id="tbxEditVersionName" value=""/>
                            <span style="color: red;" class="error" for="tbxEditVersionName"></span>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans('messages.VERSION_NO')}}:</td>
                        <td style="padding: 10px;">
                            <input type="text" data-clear-btn="true" class="form-control" name="tbxEditVersionNo"
                                   id="tbxEditVersionNo" value=""/>
                            <span style="color: red;" class="error" for="tbxEditVersionNo"></span>
                        </td>
                        <td><span style="color: red;">*</span></td>
                        </tr>
                    <tr>
                        <td>{{trans('messages.VERSION_LOG')}}:</td>
                        <td style="padding: 10px;">
                            <textarea data-clear-btn="true" class="form-control" name="tbxEditVersionLog"
                                   id="tbxEditVersionLog" value="" style="height: 300px"/></textarea>
                            <span style="color: red;" class="error" for="tbxEditVersionLog"></span>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans('messages.VERSION_URL')}}:</td>
                        <td style="padding: 10px;">
                            <textarea type="text" class="form-control" data-clear-btn="true" name="tbxEditVersionUrl" id="tbxEditVersionUrl" value=""></textarea>
                            <span style="color: red;" class="error" for="tbxEditVersionUrl"></span>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <input type="hidden"  id="hidVersionRowId" name="hidVersionRowId">
                    <input type="hidden"  id="hidGridId" name="hidGridId">
                    <input type="hidden"  id="hidIndex" name="hidIndex">
                    <input type="hidden"  id="hidUrl" name="hidUrl">
                </table>
            </div>
            <div class="modal-footer">
                <button type="button"  class="btn btn-danger" onclick="EditAppVersion()">{{trans("messages.SAVE")}}</button>
                <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
            </div>
        </div>
    </div>
</div>
<div id="appNewExternalLinkDialog" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h1 class="modal-title" id="appNewExternalLinkDialogTitle">{{trans('messages.UPLOAD_NEW_EXTERNAL_LINK')}}</h1>
            </div>
            <div class="modal-body">
                <form id="newAppVersionForm" source="" enctype='multipart/form-data' action="AppMaintain/saveAppVersion" method="post">
                    <table style="width:100%">
                        <tr>
                            <td>{{trans('messages.VERSION_NAME')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxExternalName"
                                       id="tbxExternalName" value=""/>
                                <span style="color: red;" class="error" for="tbxExternalName"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.VERSION_NO')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxExternalNo"
                                       id="tbxExternalNo" value=""/>
                                <span style="color: red;" class="error" for="tbxExternalNo"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.VERSION_LOG')}}:</td>
                            <td style="padding: 10px;">
                                <textarea data-clear-btn="true" class="form-control" name="tbxExternalLog"
                                       id="tbxExternalLog" value="" style="height: 300px"></textarea>
                                <span style="color: red;" class="error" for="tbxExternalLog"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.EXTERNAL_LINK')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" class="form-control" name="tbxExternalLink" id="tbxExternalLink">
                                <span style="color: red;" class="error" for="tbxExternalLink"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button"  class="btn btn-danger" onclick="uploadNewExternalLink()">{{trans("messages.NEW")}}</button>
                <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CANCEL")}}</button>
            </div>
        </div>
    </div>
</div>

<script>

function switchFormatter(value, row) {
    var status = (row.status == 'ready')?'success':'off';
    return'<div class="switch switch-large has-switch" data-version="'+ row.row_id +'" data-name="'+row.version_name+'"><div class="switch-'+ status +' switch-animate"><input type="checkbox"><span class="switch-left switch-success">Publish</span><label class="">&nbsp;</label><span class="switch-right">Unpublish</span></div></div></div>';
};

function historySwitchFormatter(value, row, index) {

    if(row.archived == 'N')
    {
        var status = (row.status == 'ready')?'success':'off';
        return'<div class="switch switch-large has-switch" data-version="'+ row.row_id +'" data-name="'+row.version_name+'"><div class="switch-'+ status +' switch-animate"><input type="checkbox"><span class="switch-left switch-success">Publish</span><label class="">&nbsp;</label><span class="switch-right">Unpublish</span></div></div></div>';
    } else {
        return '<b>Archived</b>';
    }
};

function versionNameFormatter(value, row) {    
    return '<a href="#" class="editVersion"><span class="glyphicon glyphicon-edit"></span> '+ value +'</a>';
};

function createdDateFormatter(value, row){
    return convertUTCToLocalDateTime(value);
}

function readyDateFormatter(UNIX_timestamp){
  if(UNIX_timestamp == null){
    return null;
  }
  var a = new Date(UNIX_timestamp * 1000);
  return getDateTime(a);
}

function versionLogDateFormatter(value, row){
    if( value !=null ){
       
       var versionLog = value.replace(new RegExp('\r?\n','g'), '<br />');
       if(versionLog.length > 100){
            versionLog = versionLog.slice(0,100);
            return versionLog + '...';       
       }
       return versionLog;
       
    }
    return '-';   
}
function fileSizeFormatter(value, row){
    return formatSizeUnits(value);
}

var newAppVersion = function (device){
        $('form').attr('device',device);
        $dialogObj = $("#newAppVersionDialog");
        $dialogObj.find('#versionFile').val("");
        $dialogObj.find('.file-input-name').text("");
        $dialogObj.find('input[type=text]').val("");
        $dialogObj.find('textarea').val("").height("300px");
        $dialogObj.find('span.error').html("");
        $dialogObj.modal('show');
}

var newExternalLink = function (device){
        $('form').attr('device',device);
        $dialogObj = $("#appNewExternalLinkDialog");
        $dialogObj.find('input[type=text]').val("");
        $dialogObj.find('textarea').val("").height("300px");
        $dialogObj.find('span.error').html("");
        $dialogObj.modal('show');
}

var EditAppVersion = function(){

    var require = ['tbxEditVersionName','tbxEditVersionNo','tbxEditVersionLog','tbxEditVersionUrl'];
    var errors = new Array();
        errors = validRequired(errors, require);
    var editVersionLog = $('#tbxEditVersionLog').val();
   

    if(/<[a-z][\s\S]*>/i.test(editVersionLog)){
        var error = new Error;
        error.field = 'tbxEditVersionLog';
        error.msg = Messages.ERR_ILLEGAL_INSERT_HTML;
        errors.push(error);
    }

    $.each(errors,function(i, error){
        $('span[for='+error.field+']').html(error.msg);
    });

    if(errors.length > 0){
        return false;
    }
    var gridId = $("#hidGridId").val();
    var $gridList = $('#' + gridId);
    var currentData = $gridList.bootstrapTable('getData');
    var targetRow = currentData[$('#hidIndex').val()];
    targetRow.version_name =  $('#tbxEditVersionName').val();
    targetRow.version_code =  $('#tbxEditVersionNo').val();
    targetRow.version_log =  $('#tbxEditVersionLog').val();
    targetRow.download_url =  $('#tbxEditVersionUrl').val();
    targetRow.url =  $('#hidUrl').val();
    $gridList.bootstrapTable('load', currentData);
    $("#appVersionDialog").modal('hide');
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
    var require = ['tbxVersionName','tbxVersionNo','tbxVersionLog','versionFile'];
    var _validExtension = (device == 'ios')?'ipa':'apk';
    var errors = new Array();
        errors = validRequired(errors, require);
    var versionCode = $('input[name=tbxVersionNo]').val();
    var versionName = $('input[name=tbxVersionName]').val();
    var versionLog = $('textarea[name=tbxVersionLog]').val();

    var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var $onlineGridList = (device == 'ios')? $('#gridIOSOnlineVersionList'):$('#gridAndroidOnlineVersionList');
    var currentData = $gridList.bootstrapTable('getData');
    var onlineData = $onlineGridList.bootstrapTable('getData');
    var regNum = /^\d+$/;

    if($('input[name=versionFile]').val().length > 0){
        var fileExtension = $('#versionFile')[0].files[0].name.split('.').pop();
         if(fileExtension != _validExtension){
            var error = new Error;
            error.field = 'versionFile';
            error.msg = device+'{{trans('messages.VALIDATE_ACCEPT')}}'+_validExtension+'{{trans('messages.FILE')}}';
            errors.push(error);
         }
    }

    if(versionCode!="" && !regNum.test(versionCode)){
        var error = new Error;
        error.field = 'tbxVersionNo';
        error.msg = '{{trans('messages.VALIDATE_ACCEPT_NUMERIC')}}';
        errors.push(error);
    }

    if(/<[a-z][\s\S]*>/i.test(versionLog)){
        var error = new Error;
        error.field = 'tbxVersionLog';
        error.msg = Messages.ERR_ILLEGAL_INSERT_HTML;
        errors.push(error);
    }

    var mydata = {versionNo:$.trim(versionCode),
                 versionName:$.trim(versionName),
                deviceType:device,
                appId:jsAppRowId};
    var mydataStr = $.toJSON(mydata);
    var field = 'tbxVersion';
    errors = ajxValidVersion (errors, mydataStr, field);
    $.each(errors,function(i, error){
        if($('span[for='+error.field+']').html() == ''){
            $('span[for='+error.field+']').html(error.msg);
        }
    });
    if(errors.length > 0){
        return false;
    }
    var fileName = $('#versionFile')[0].files[0].name;
    var newVersion = new Object();
    newVersion.device_type = device;
    newVersion.download_url = getApkDownLoadPath(jsAppRowId,device,versionCode,fileName);
    newVersion.state = "undefined";
    newVersion.status = 'cancel';
    newVersion.created_at = getUTCDateTime(new Date());
    newVersion.url = fileName;
    newVersion.version_code = versionCode;
    newVersion.version_name = versionName;
    newVersion.version_log  = versionLog;
    newVersion.version_file = $('#versionFile')[0].files[0];
    newVersion.size = $('#versionFile')[0].files[0].size;
    newVersion.external_app = 0;

    if(typeof currentData[0] != 'undefined'){
        delVersionArr.push(currentData[0].row_id);
    }
    currentData.splice(0,1,newVersion);

    $gridList.bootstrapTable('load', currentData);
    $("#newAppVersionDialog").modal('hide');
}

var uploadNewExternalLink = function(){
    var device = $('#newAppVersionForm').attr('device');
    var require = ['tbxExternalName','tbxExternalNo','tbxExternalLog','tbxExternalLink'];
    var _validExtension = (device == 'ios')?'ipa':'apk';
    var errors = new Array();
    errors = validRequired(errors, require);
    
    var externalNo = $('input[name=tbxExternalNo]').val();
    var externalName = $('input[name=tbxExternalName]').val();
    var externalLog = $('textarea[name=tbxExternalLog]').val();
    var externalLink = $('input[name=tbxExternalLink]').val();

    var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var $onlineGridList = (device == 'ios')? $('#gridIOSOnlineVersionList'):$('#gridAndroidOnlineVersionList');
    var currentData = $gridList.bootstrapTable('getData');
    var onlineData = $onlineGridList.bootstrapTable('getData');

    var regNum = /^\d+$/;

    if(externalNo!="" && !regNum.test(externalNo)){
        var error = new Error;
        error.field = 'tbxExternalNo';
        error.msg = '{{trans('messages.VALIDATE_ACCEPT_NUMERIC')}}';
        errors.push(error);
    }

    if(/<[a-z][\s\S]*>/i.test(externalLog)){
        var error = new Error;
        error.field = 'tbxExternalLog';
        error.msg = Messages.ERR_ILLEGAL_INSERT_HTML;
        errors.push(error);
    }

    
    var mydata = {versionNo:$.trim(externalNo),
                 versionName:$.trim(externalName),
                deviceType:device,
                appId:jsAppRowId};
    var mydataStr = $.toJSON(mydata);
    var field = 'tbxExternal';
    errors = ajxValidVersion (errors, mydataStr, field);
    $.each(errors,function(i, error){
        if($('span[for='+error.field+']').html() == ''){
            $('span[for='+error.field+']').html(error.msg);
        }
    });
    if(errors.length > 0){
        return false;
    }

    var newVersion = new Object();
    newVersion.device_type = device;
    newVersion.download_url = externalLink;
    newVersion.state = "undefined";
    newVersion.status = 'cancel';
    newVersion.created_at = getUTCDateTime(new Date());
    newVersion.url = externalLink;
    newVersion.version_code = externalNo;
    newVersion.version_name = externalName;
    newVersion.version_log  = externalLog;
    newVersion.external_app = 1;
    if(typeof currentData[0] != 'undefined'){
        delVersionArr.push(currentData[0].row_id);
    }
    currentData.splice(0,1,newVersion);
    $gridList.bootstrapTable('load', currentData);
    $("#appNewExternalLinkDialog").modal('hide');
}
var delAppVersion = function(gridId){

    var $gridList = $( '#' + gridId );
    var $toolbar  =  $($gridList.data('toolbar'));
    var selectedVersion = $gridList.bootstrapTable('getSelections');
    var validToDelete = true;
    $.each(selectedVersion,function(i, version){
        if(version['status'] == 'ready'){
           validToDelete = false;
           return false;
        }
    });
    if(validToDelete){
         showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans('messages.MSG_CONFIRM_DELETE_VERSION')}}", "", function () {
                hideConfirmDialog();
                var currentData = $gridList.bootstrapTable('getData');
                $.each(selectedVersion, function(i, version) {
                     var index = $gridList.find('input[name=btSelectItem]:checked').first().data('index'); 
                     delVersionArr.push(currentData[index].row_id);
                     currentData.splice(index,1);
                     $gridList.bootstrapTable('load', currentData);
                });
                $gridList.find('checkbox[name=btSelectItem]').each(function(){
                    $(this).prop('check',false);
                });
                $toolbar.find('.btn-danger').fadeOut(300, function() {
                    $toolbar.find('.btn-primary').fadeIn(300);
                });

            });
    }else{
        showMessageDialog("{{trans('messages.MSG_VERSION_CAN_NOT_DELETE')}}","{{trans('messages.MSG_VERSION_IS_PUBLISH_CAN_NOT_DELETE')}}");
    }
     
}

function getApkDownLoadPath(appId,deviceType,versionCode,fileName){
    var baseUrl = '{{url(\Config::get('app.upload_folder'))}}';
    var url =  '';
    if(deviceType == 'ios'){
        url =  baseUrl + '/' +  appId + '/apk/' +  deviceType + '/' + versionCode + '/' + 'manifest.plist';
        url = 'itms-services://?action=download-manifest&url=' + url;
    }else{
        url =  baseUrl + '/' +  appId + '/apk/' +  deviceType + '/' + versionCode + '/' + fileName;
    }
    return url;
}

function ajxValidVersion(errors, mydataStr, field){
     $.ajax({
        url: "AppVersion/ajxValidVersion",
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        //async: false,//啟用同步請求
        data: mydataStr,
        success: function (d, status, xhr) {
            if(d.result_code != 1){
                for (var k in d.messages){
                     var error = new Error;
                    if (typeof d.messages[k] !== 'function') {
                        error.field = field + k;
                        error.msg = d.messages[k];
                        errors.push(error);
                    }
                }
            }
            $.each(errors,function(i, error){
                if($('span[for='+error.field+']').html() == ''){
                    $('span[for='+error.field+']').html(error.msg);
                }
            });
        },
        error: function (e) {
            showMessageDialog(Messages.ERROR, Messages.MSG_OPERATION_FAILED, e.responseText)
        }
    });
     return errors;
}

function switchPublish(gridId){
    var data = $('#' + gridId).bootstrapTable('getData');
    if(data.length > 0 ) {
        if(data[0].status == 'ready'){
            data[0].status = 'cancel'; 
            $('#' + gridId).find('tbody').find('div.switch-success').removeClass('switch-success').addClass('switch-off');
        }
    }
}

$(function () {
    $('body').on('change','.file', function(){showUploadFileName($(this))});
    $('body').on('keypress','input[type=text]', function(){clearError($(this));});
    $('body').on('change','input[type=file]', function(){clearError($(this));});
    $('body').on('change','textarea', function(){clearError($(this));});

    //unpublish
    $('body').on('click','div.switch-success', function(){
        $(this).removeClass('switch-success').addClass('switch-off');
        var currentData = $(this).parents('table').bootstrapTable('getData');
        currentData[0].status = 'cancel';
        if($(this).parents('table').attr('id').search('Online') == -1){
            var gridId = ( currentData[0].device_type == 'ios')?'gridIOSOnlineVersionList':'gridAndroidOnlineVersionList';
            $('#' + gridId).bootstrapTable('refresh');
        }
    });
    //publish
    $('body').on('click','div.switch-off', function(){
       $(this).removeClass('switch-off').addClass('switch-success');
        var currentData = $(this).parents('table').bootstrapTable('getData');
        currentData[0].status = 'ready';
        var gridList = ['gridAndroidVersionList','gridAndroidOnlineVersionList','gridAndroidHistoryVersionList'];
        if(currentData[0].device_type == 'ios'){
            gridList = ['gridIOSVersionList','gridIOSOnlineVersionList','gridIOSHistoryVersionList'];
        }
        if($(this).parents('table').attr('id').search('Online') >  -1){
            delete gridList[1];
        }else if($(this).parents('table').attr('id').search('History') > -1){
            delete gridList[2];
        }else{
            delete gridList[0];
        }
        $.each(gridList,function(i, gridId){
             switchPublish(gridId);
        });
    });

    $('body').on('click','.editVersion',function(e) {

        $currentTarget = $(e.currentTarget);
        var disabled = true;
        var currentData = $currentTarget.parents('table.bootstrapTable').bootstrapTable('getData');
        var index = $currentTarget.parent().parent().data('index');
        if(currentData[0].external_app == 1){
            disabled = false;
        }
        $('#hidIndex').val(index);
        $('#hidVersionRowId').val(currentData[index].row_id);
        $('#hidGridId').val($currentTarget.parents('table.bootstrapTable').attr('id'));
        $('#hidUrl').val(currentData[index].url);
        $('#tbxEditVersionName').val(currentData[index].version_name).prop('disabled', true);
        $('#tbxEditVersionNo').val(currentData[index].version_code).prop('disabled', true);
        $('#tbxEditVersionUrl').val(currentData[index].download_url).prop('disabled', true);
        
        if(currentData[index].version_log === ""){
            $('#tbxEditVersionLog').height("300px");
        }else{
            $('#tbxEditVersionLog').val(currentData[index].version_log);
        }
        
        if(currentData[index].archived == 'Y'){
            $('#tbxEditVersionLog').prop('disabled', true); 
        }else{
            $('#tbxEditVersionLog').prop('disabled', false); 
        }

        $('#appVersionDialog').modal('show');
        $('#appVersionDialog').find('span.error').html("");
    });

});
</script>