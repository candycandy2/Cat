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
                                    瀏覽檔案<input type="file" id="versionFile" name="versionFile" class="file">
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
                    <input type="hidden"  id="hidIndex" name="hidIndex">
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
        $dialogObj.find('#versionFile').val("");
        $dialogObj.find('.file-input-name').text("");
        $dialogObj.find('input[type=text]').val("");
        $dialogObj.find('span.error').html("");
        $dialogObj.modal('show');
    }

function switchFormatter(value, row) {
    var status = (row.status == 'ready')?'success':'off';
    return'<div class="switch  has-switch" data-version="'+ row.row_id +'" data-name="'+row.version_name+'"><div class="switch-'+ status +' switch-animate"><input type="checkbox"><span class="switch-left switch-success">Publish</span><label class="">&nbsp;</label><span class="switch-right">UnPlish</span></div></div></div>';
};

function versionNameFormatter(value, row) {
    return '<a href="#" class="editVersion" data-rowid="'+ row.row_id  +'" data-device="'+row.device_type+'" data-version="'+row.version_name+'" data-url="'+row.url+'" data-status="'+row.status+'"> '+ value +'</a>';
};

var updateVersion = function(row_id, device_type, version_name, url, status){
    var statusStr = (status == 'ready')?'Publish':'UnPlish';
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
    var deviceType = $("#hidDeviceType").val();
    var $gridList = (deviceType == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var currentData = $gridList.bootstrapTable('getData');
    var $gridEditVersionListObj = (deviceType == 'ios')?$("#gridIOSVersionList"):$("#gridAndroidVersionList");
    currentData[$('#hidIndex').val()].version_name =  $('#tbxEditVersionName').val();
    $gridList.bootstrapTable('load', currentData);
    $("#appVersionDialog").modal('hide');
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
    var require = ['tbxVersionName','tbxVersionNo','versionFile'];
    var _validExtension = (device == 'ios')?'ipa':'apk';
    var errors = validRequired(require);
    var fileFackPath = $('input[name=versionFile]').val();
    var fileName = fileFackPath.replace(/C:\\fakepath\\/i, '');
    
    var versionCode = $('input[name=tbxVersionNo]').val();
    var versionName = $('input[name=tbxVersionName]').val();

    var $gridList = (device == 'ios')? $('#gridIOSVersionList'):$('#gridAndroidVersionList');
    var currentData = $gridList.bootstrapTable('getData');

    var regNum = /^\d+$/;

    if($('input[name=versionFile]').val().length > 0){
        var fileExtension = fileFackPath.split('.').pop();
         if(fileExtension != _validExtension){
            var error = new Error;
            error.field = 'versionFile';
            error.msg = device+'僅接受'+_validExtension+'檔案';
            errors.push(error);
         }
    }

    if(versionCode!="" && !regNum.test(versionCode)){
        var error = new Error;
        error.field = 'tbxVersionNo';
        error.msg = '僅接受數字';
        errors.push(error);
    }

    for(var j = 0; j < currentData.length; j++) {
        if($.trim(currentData[j].version_code) == $.trim(versionCode)) {
            var error = new Error;
            error.field = 'tbxVersionNo';
            error.msg = '版本號不可重複';
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
    newVersion.updated_at = getFormattedDate();
    newVersion.url = fileName;
    newVersion.version_code = versionCode;
    newVersion.version_name = versionName;
    newVersion.version_file = $('#versionFile')[0].files[0];
    currentData.push(newVersion);
    $gridList.bootstrapTable('load', currentData);
    $("#newAppVersionDialog").modal('hide');
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
         showConfirmDialog("{{trans("messages.CONFIRM")}}", "系統將刪除所選版本，確認刪除?", "", function () {
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
        showMessageDialog("無法刪除","所選版本為發布狀態，不可刪除");
    }
     
}

function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}

function getApkDownLoadPath(appId,deviceType,versionCode,fileName){
    var baseUrl = '{{url(\Config::get('app.upload_url'))}}';
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
        var statusStr = ($currentTarget.data('status') == 'ready')?'Publish':'UnPlish';
        $('#hidIndex').val($currentTarget.parent().parent().data('index'));
        $('#hidVersionRowId').val($currentTarget.data('rowid'));
        $('#hidDeviceType').val($currentTarget.data('device'));
        $('#tbxEditVersionName').val($currentTarget.data('version'));
        $('#tbxEditVersionUrl').val($currentTarget.data('url'));
        $('#tbxEditVersionStatus').val(statusStr);
        $('#appVersionDialog').modal('show');
        $('#appVersionDialog').find('span.error').html("");
    });

});
</script>