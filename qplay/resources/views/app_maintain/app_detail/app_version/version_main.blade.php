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
                                       id="tbxVersionLog" value="" style="height: 100px;"/></textarea>
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
                                   id="tbxEditVersionLog" value="" style="height: 100px;"/></textarea>
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
                    <input type="hidden"  id="hidDeviceType" name="hidDeviceType">
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
                                       id="tbxExternalLog" value="" style="height: 100px;"/></textarea>
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

function versionNameFormatter(value, row) {
    return '<a href="#" class="editVersion" data-rowid="'+ row.row_id  +'" data-device="'+row.device_type+'" data-version_name="'+row.version_name+'" data-version_code="'+row.version_code+'" data-download_url="'+row.download_url+'" data-external="'+row.external_app+'" data-log="'+row.version_log+'" data-url="'+row.url+'"> '+ value +'</a>';
};

function createdDateFormatter(value, row){
    return convertUTCToLocalDateTime(value);
}

function versionLogDateFormatter(value, row){
    if( value !=null ){
        var versionLog = value.replace(new RegExp('\r?\n','g'), '<br />');
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
        $dialogObj.find('textarea').val("");
        $dialogObj.find('span.error').html("");
        $dialogObj.modal('show');
}

var newExternalLink = function (device){
        $('form').attr('device',device);
        $dialogObj = $("#appNewExternalLinkDialog");
        $dialogObj.find('input[type=text]').val("");
        $dialogObj.find('textarea').val("");
        $dialogObj.find('span.error').html("");
        $dialogObj.modal('show');
}

var EditAppVersion = function(){

    var require = ['tbxEditVersionName','tbxEditVersionNo','tbxEditVersionLog','tbxEditVersionUrl'];
    var errors = validRequired(require);
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
    var deviceType = $("#hidDeviceType").val();
    var $gridList = (deviceType == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var currentData = $gridList.bootstrapTable('getData');
    var $gridEditVersionListObj = (deviceType == 'ios')?$("#gridIOSVersionList"):$("#gridAndroidVersionList");
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
    var errors = validRequired(require);
    var fileFackPath = $('input[name=versionFile]').val();
    var fileName = fileFackPath.replace(/C:\\fakepath\\/i, '');
    
    var versionCode = $('input[name=tbxVersionNo]').val();
    var versionName = $('input[name=tbxVersionName]').val();
    var versionLog = $('textarea[name=tbxVersionLog]').val();

    var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var currentData = $gridList.bootstrapTable('getData');

    var regNum = /^\d+$/;

    if($('input[name=versionFile]').val().length > 0){
        var fileExtension = fileFackPath.split('.').pop();
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

    for(var j = 0; j < currentData.length; j++) {
        if($.trim(currentData[j].version_code) == $.trim(versionCode)) {
            var error = new Error;
            error.field = 'tbxVersionNo';
            error.msg = '{{trans('messages.ERR_VERSION_NO_DUPLICATE')}}';
            errors.push(error);
            break;
        }
    }


    $.each(errors,function(i, error){
        $('span[for='+error.field+']').html(error.msg);
    });

    if(errors.length > 0){
        return false;
    }
   
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
    currentData.push(newVersion);
    $gridList.bootstrapTable('load', currentData);
    $("#newAppVersionDialog").modal('hide');
}

var uploadNewExternalLink = function(){
    var device = $('#newAppVersionForm').attr('device');
    var require = ['tbxExternalName','tbxExternalNo','tbxExternalLog','tbxExternalLink'];
    var _validExtension = (device == 'ios')?'ipa':'apk';
    var errors = validRequired(require);
    
    var externalNo = $('input[name=tbxExternalNo]').val();
    var externalName = $('input[name=tbxExternalName]').val();
    var externalLog = $('textarea[name=tbxExternalLog]').val();
    var externalLink = $('input[name=tbxExternalLink]').val();

    var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var currentData = $gridList.bootstrapTable('getData');

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

    for(var j = 0; j < currentData.length; j++) {
        if($.trim(currentData[j].version_code) == $.trim(externalNo)) {
            var error = new Error;
            error.field = 'tbxExternalNo';
            error.msg = '{{trans('messages.ERR_VERSION_NO_DUPLICATE')}}';
            errors.push(error);
            break;
        }
    }
    for(var j = 0; j < currentData.length; j++) {
        if($.trim(currentData[j].version_name) == $.trim(externalName)) {
            var error = new Error;
            error.field = 'tbxExternalName';
            error.msg = '{{trans('messages.ERR_VERSION_NAME_DUPLICATE')}}';
            errors.push(error);
            break;
        }
    }
    $.each(errors,function(i, error){
        $('span[for='+error.field+']').html(error.msg);
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
    currentData.push(newVersion);
    $gridList.bootstrapTable('load', currentData);
    $("#appNewExternalLinkDialog").modal('hide');
}

var delAppVersion = function(device){
    var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
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
                    for(var j = 0; j < currentData.length; j++) {
                        if(currentData[j].row_id == version.row_id) {
                            delVersionArr.push(version.row_id);
                            currentData.splice(j,1);
                            break;
                        }
                    }
                });
 
                $gridList.bootstrapTable('load', currentData);
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
    var url =  baseUrl + '/' +  appId + '/apk/' +  deviceType + '/' + versionCode + '/' + fileName;    
    if(deviceType == 'ios'){
        url = 'itms-services://?action=download-manifest&url=' + url;
    }
    return url;
}

$(function () {
    $('body').on('change','.file', function(){showUploadFileName($(this))});
    $('body').on('keypress','input[type=text]', function(){clearError($(this));});
    $('body').on('change','input[type=file]', function(){clearError($(this));});
    $('body').on('change','textarea', function(){clearError($(this));});
    
    $('body').on('click','div.switch-success', function(){
        var index = $(this).parents('tr').data('index');
        $(this).removeClass('switch-success').addClass('switch-off');
        var currentData = $(this).parents('table').bootstrapTable('getData');
        currentData[index].status = 'cancel';
    });

    $('body').on('click','div.switch-off', function(){
       $(this).parents('tbody').find('div.switch-success').removeClass('switch-success').addClass('switch-off');
       var index = $(this).parents('tr').data('index');
       $(this).removeClass('switch-off').addClass('switch-success');
        var currentData = $(this).parents('table').bootstrapTable('getData');
        
        for (var i in currentData) {
            if(i == index){
                 currentData[i].status = 'ready'; 
            }else{
               currentData[i].status = 'cancel'; 
            }
        }
    });

     $('body').on('click','.editVersion',function(e) {  
        $currentTarget = $(e.currentTarget);
        var disabled = true;
        
        if($currentTarget.data('external') == 1){
            disabled = false;
        }

        $('#hidIndex').val($currentTarget.parent().parent().data('index'));
        $('#hidVersionRowId').val($currentTarget.data('rowid'));
        $('#hidDeviceType').val($currentTarget.data('device'));
        $('#hidUrl').val($currentTarget.data('url'));
        $('#tbxEditVersionName').val($currentTarget.data('version_name')).prop('disabled', disabled);
        $('#tbxEditVersionNo').val($currentTarget.data('version_code')).prop('disabled', disabled);
        $('#tbxEditVersionUrl').val($currentTarget.data('download_url')).prop('disabled', disabled);
        $('#tbxEditVersionLog').val($currentTarget.data('log'));

        $('#appVersionDialog').modal('show');
        $('#appVersionDialog').find('span.error').html("");
    });

});
</script>