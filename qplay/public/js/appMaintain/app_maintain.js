var submitFormAry = [$("#mainInfoForm"),
                     $("#errorCodeForm"),
                     $("#basicInfoForm"),
                     $('#iconForm'),
                     $('#screenShotForm'),
                     $('#customApiForm'),
                     $('#whistListForm')];

function SubmitError(tab,val) {
  this.tab = tab;
  this.val = val;
}

SaveAppDetail = function(){
    
     var unPublishStr = 'Unpublish';
     var appName = $('#txbAppName_'+jsDefaultLang).val();
     var newAandroidStatus = unPublishStr;
     var newIOSStatus = unPublishStr;
     var confirmSrt = "";
     var confirmTitleSrt = "";
     var qplayAppErr = [];

     $('#gridWhiteList').bootstrapTable('resetSearch');
     $('#gridAndroidVersionList').bootstrapTable('resetSearch');
     $('#gridIOSVersionList').bootstrapTable('resetSearch');
         
    if(projectCode == '000'){
        if($('#tab_version_android').find('div.switch-success').size() <= 0){
            qplayAppErr.push('Android');
        }
        if($('#tab_version_ios').find('div.switch-success').size() <= 0){
            qplayAppErr.push('IOS');
        }

        if(qplayAppErr.length > 0){
            showMessageDialog(Messages.ERROR,Messages.ERR_QPLAY_MUST_PUBLISH.replace('%s',qplayAppErr.join("、")));
            return false;
        }
    }

     $('#tab_version_android').find('div.switch-success').each(function(){
        newAandroidStatus = $(this).parent().data('name');
     });
     $('#tab_version_ios').find('div.switch-success').each(function(){
        newIOSStatus = $(this).parent().data('name');
     });

     if((jsOriAndroidStatus!=unPublishStr || jsOriIOSStatus!=unPublishStr) && 
        (newAandroidStatus == unPublishStr && newIOSStatus == unPublishStr)){
        confirmSrt = Messages.MSG_CONFIRM_UNPUBLISH_VERSION.replace('%s',appName);
        confirmTitleSrt = Messages.MSG_CONFIRM_UNPUBLISH;
     }else if(jsOriAndroidStatus != newAandroidStatus || jsOriIOSStatus != newIOSStatus){
         confirmSrt = Messages.MSG_CONFIRM_PUBLISH_STATUS.replace('%s',appName).replace('%l',newAandroidStatus).replace('%k',newIOSStatus);
         confirmTitleSrt = Messages.MSG_CONFIRM_PUBLISH;
     }
     
     if(confirmTitleSrt !="" && confirmSrt!=""){
         showConfirmDialog(confirmTitleSrt,confirmSrt,"", function () {
            hideConfirmDialog();
            SaveAppDetailToDB();
        });
     }else{
          SaveAppDetailToDB();
     }
       
}

var validate = 0;
var formSubmitcnt = 0;
var errorTab = [];
var errorLangIdArr = [];
var errorLangId;
var errorLanTab;
SaveAppDetailToDB = function(){
    validate = 0;
    $("#mainInfoForm").find("input[name^=txbAppName_]").each(function(){
        $(this).rules("add", {
        required: true,
        maxlength:250
        });
    });
    $("#mainInfoForm").find("input[name^=txbAppSummary_]").each(function(){
        $(this).rules("add", {
        required: true,
        maxlength:500
        });
    });
    $("#mainInfoForm").find("textarea[name^=txbAppDescription_]").each(function(){
        $(this).rules("add", {
        required: true
        });
    });

    $("#screenShotForm").find("input[name^=androidScreenUpload_]").each(function(){
        $(this).rules("add", {
        screenshot: true
        });
    });

    $("#screenShotForm").find("input[name^=iosScreenUpload_]").each(function(){
        $(this).rules("add", {
        screenshot: true
        });
    });
    for (var i=0 ; i < submitFormAry.length; i++) {
        formSubmitcnt ++;
        submitFormAry[i].submit();
    }
    formSubmitcnt = 0;
    errorTab = [];
    errorLangIdArr = [];
}
$(function () {
    $(document).ajaxStart(function(){
        $( "#saveAppDetail" ).prop( "disabled", true );
    });
    $(document).ajaxComplete(function(){
        $( "#saveAppDetail" ).prop( "disabled", false );
    });

    for(var key in submitFormAry){       
       submitFormAry[key].validate({
            focusInvalid: false,
            ignore: [],
            rules:{
                chkCompany:{
                    required: {
                        depends: function(element){return $("#ddlAppUserType").val() == 1;}
                    }
                },
                cbxRole:{
                    setAppUser: {
                        depends: function(element){return $("#ddlAppUserType").val() == 2;}
                    }
                },
                cbxAllRole:{
                    setAppUser: {
                        depends: function(element){return $("#ddlAppUserType").val() == 2;}
                    }
                },
                fileIconUpload:{
                    icon:true
                },
                errorCodeFile:{
                    accept:"json"
                },
                ddlAppCategory:{
                    required:true
                }
            }, 
            groups: {
                setAppUser: "cbxRole cbxAllRole"
            },
            invalidHandler: function(e,validator) {
                for (var i in validator.errorMap) {
                    var lanError =  new SubmitError($('#' + i).parents('ul.tab-pane').attr('id'),i.split('_')[1]);
                    errorLangIdArr.push(lanError);
                }
                 var submitFormId = e.target.id;
                 var errorTabId = $('#' + submitFormId).parents('div.tab-pane').attr('id')
                 var errorTabName = $('.nav-tabs a[href="#'+errorTabId+'"]').text();
                 var submitError = new SubmitError(errorTabId,errorTabName);
                 errorTab = setErrorTab(errorTab,submitError);
            },
            errorPlacement: function ($error, $element) {
                validate =0;
                $alert = $('#appMaintainAlert');
                if($element.attr("name") == 'chkCompany'){
                    $error.insertAfter("#selNormal");
                }else if($element.attr("name") == 'cbxRole' || $element.attr("name") == 'cbxAllRole'){
                   $error.insertAfter("#selUserRole");
                }else if($element.hasClass('js-upl-addition')){
                   $element.parent('li').after($error);
                }else if($element.attr("name") == 'errorCodeFile' ){
                   $error.insertAfter($('input[name=errorCodeFile]').parent().next());
                }else if($element.attr('name') == 'fileIconUpload'){
                   $error.insertAfter($('.iconUpload'));
                }else{
                    $error.insertAfter($element);
                }
           },
           submitHandler: function (form) {
                validate ++;
                if(validate==submitFormAry.length){
                    var openTabId = $($('.nav-tabs .active').get(0)).children('a').attr('href').replace('#','');
                    var formData = new FormData();
                    formData.append('appId',jsAppRowId);
                    formData.append('defaultLang',jsDefaultLang);
                    formData.append('appKey',jsAppKey);
                    formData.append('mainInfoForm',$('#mainInfoForm').serialize());
                    formData.append('icon',$('#iconForm').find('.icon-preview').data('url'));
                    if(typeof ($( '#fileIconUpload' )[0].files[0]) != "undefined"){
                        formData.append('fileIconUpload', $( '#fileIconUpload' )[0].files[0]);
                    }

                    $.each(screenShotfileQueue,function(i,item){
                          $.each(item, function(j, file) {
                                formData.append(i + '[]', file);
                          });
                    });

                    $('#screenShotForm').find('.imgLi').each(function(){
                        formData.append('insPic[]',$(this).data('lang')+'-'+$(this).data('device')+'-'+$(this).data('url'));
                    })

                    if(typeof($('#errorCodeFile')[0].files[0]) != "undefined"){
                       formData.append('errorCodeFile',$('#errorCodeFile')[0].files[0]);
                    }else{
                       if($('#errorCodeFileName').find('.link').length >0){
                            formData.append('deleteErrorCode',false);
                       }else{
                            formData.append('deleteErrorCode',true);
                       }
                    }

                    formData.append('delPic',delPicArr.join(","));
                    formData.append('categoryId',$('#ddlAppCategory').val());
                    formData.append('securityLevel',$('#ddlSecurityLevel').val());
                    $('input[name=chkCompany]:checked').each(function(){
                        formData.append('chkCompany[]',$(this).val());
                    });
                    $('input[name=cbxRole]:checked').each(function(){
                        formData.append('appRoleList[]',$(this).attr('data'));
                    });
                    var appUserData =  $("#gridUserList").bootstrapTable('getData');
                    $.each(appUserData, function(i, user) {
                        formData.append('appUserList[]',user.row_id);
                    });
                   
                    
                    var androidGridListArr = [
                                        'gridAndroidVersionList',
                                        'gridAndroidOnlineVersionList'
                                      ];
                    var iosGridListArr = [
                                        'gridIOSVersionList',
                                        'gridIOSOnlineVersionList'
                                      ];
                    var androidNum = 0;
                    for (var k = 0; k < androidGridListArr.length; k++) {
                        var gridList = $("#" + androidGridListArr[k]).bootstrapTable('getData');
                        $.each(gridList, function(i, version) {
                            $.each(version, function(j,v){
                                formData.append('versionList[android][' + androidNum + '][' + j + ']',v);
                            }); 
                            androidNum ++;
                        });
                    }
                    var iosNum = 0;
                    for (var k = 0; k < iosGridListArr.length; k++) {
                        var gridList = $("#" + iosGridListArr[k]).bootstrapTable('getData');
                        $.each(gridList, function(i, version) {
                            $.each(version, function(j,v){
                                formData.append('versionList[ios][' + iosNum + '][' + j + ']',v);
                            }); 
                            iosNum++;
                        });
                    }

                    formData.append('delVersionArr',delVersionArr);

                    var customApiList =  $("#gridCustomApi").bootstrapTable('getData');
                    $.each(customApiList, function(i, api) {
                         $.each(api, function(j,data){
                            formData.append('customApiList[' + i + '][' + j + ']',data);
                        }); 
                    });
                    formData.append('customApiDeleteList',$('#customApiDeleteList').val());
                    var whiteList =  $("#gridWhiteList").bootstrapTable('getData');
                    $.each(whiteList, function(i, white) {
                         $.each(white, function(j,data){
                            formData.append('whiteList[' + i + '][' + j + ']',data);
                        }); 
                    });
                    $.ajax({
                        url: "AppMaintain/saveAppDetail",
                        type: "POST",
                        contentType: false,
                        data: formData,
                        processData: false,
                        success: function (d, status, xhr) {
                            validate = 0;
                            if(d.result_code == 1) {
                                 showMessageDialog(Messages.MESSAGE,Messages.MSG_OPERATION_SUCCESS);
                                $('#messageDialog').find('button').click(function(){
                                   // location.reload();
                                   window.location.href = window.location.pathname+"?"+$.param({'app_row_id':jsAppRowId,'tab':openTabId});
                                });
                            }else{
                               showMessageDialog(Messages.ERROR,d.message);
                            }
                        },
                        error: function (e) {
                            if(handleAJAXError(this,e)){
                                return false;
                            }
                            validate = 0;
                             showMessageDialog(Messages.ERROR, Messages.MSG_OPERATION_FAILED, e.responseText)
                        }
                    });
                     
                }else{
                    if(errorTab.length > 0 && formSubmitcnt == submitFormAry.length){
                        var errArr = [];
                        for (var i in errorTab) {
                            errArr.push(errorTab[i].val);
                        }
                        showMessageDialog(Messages.ERROR,Messages.MSG_SAVE_FAILED,errArr.join("<br/>"));
                        $('.nav-tabs a[href="#' + errorTab[0].tab + '"]').tab('show');
                       
                        if(errorLangIdArr.length > 0){
                            if(typeof errorLangIdArr[0].val != 'undefined'){
                                $('.nav-tabs a[href="#' + errorLangIdArr[0].tab + '"]').tab('show');
                                switchToLangCotent(errorLangIdArr[0].val);
                            }
                        }
                    }
                    return false;
                }
            }
        });
    }    
    jQuery.validator.addMethod("setAppUser", function(value, element) {
        if($('.cbxRole:checked').length <= 0 &&　$('#gridUserList').bootstrapTable('getData').length == 0){
            return false;
        }
        return true;
    });

    jQuery.validator.addMethod("icon", function(value, element) {
        var iosPublishCnt = $('#gridIOSVersionList').find('div.switch-success').size() + 
                            $('#gridIOSOnlineVersionList').find('div.switch-success').size() ;
        var androidPublishCnt = $('#gridAndroidVersionList').find('div.switch-success').size() + 
                                $('#gridAndroidOnlineVersionList').find('div.switch-success').size();
        if(androidPublishCnt + iosPublishCnt ==0){
            return true;
        }
        if($('.icon-preview').length == 1 && $('.icon-preview').attr('src')!=""){
            return true;
        }
        return false;
    });

    jQuery.validator.addMethod("screenshot", function(value, element) {
        var iosPublishCnt = $('#gridIOSVersionList').find('div.switch-success').size() + 
                            $('#gridIOSOnlineVersionList').find('div.switch-success').size() ;
        var androidPublishCnt = $('#gridAndroidVersionList').find('div.switch-success').size() + 
                                $('#gridAndroidOnlineVersionList').find('div.switch-success').size();
        var ios = new RegExp('^iosScreenUpload_');
        var android = new RegExp('^androidScreenUpload_');
        if($(element).parent().parent().find('li.imgLi').length == 0){
           if(ios.test($(element).attr('name')) && iosPublishCnt == 0){
                return true;
           }
           if(android.test($(element).attr('name')) && androidPublishCnt == 0){
                return true;
           }
           return false;
        }
        return true;
    });

    function setErrorTab(errorTab,submitError){
        var unique = true;
        if(errorTab.length > 0){
            for(var l = 0;l<errorTab.length;l++){
                if(errorTab[l].tab == submitError.tab){
                    unique = false;
                    break;
                }
            }
        }
        if(unique){
            errorTab.push(submitError);
        }
        return errorTab;
    }

    var targetTab = 'tab_content_info';
    if(typeof getUrlVar('tab') != 'undefined' && $('.nav-tabs a[href="#' + getUrlVar('tab') + '"]').length > 0){
       targetTab = getUrlVar('tab');
    }
    $('.nav-tabs a[href="#' + targetTab + '"]').tab('show');
    
});