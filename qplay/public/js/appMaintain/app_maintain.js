var submitFormAry = [$("#mainInfoForm"),
                     $("#errorCodeForm"),
                     $("#basicInfoForm"),
                     $('#iconForm'),
                     $('#screenShotForm'),
                     $('#customApiForm'),
                     $('#whistListForm')];


SaveAppDetail = function(){
    
     var unPublishStr = 'Unpublish';
     var appName = $('#txbAppName_'+jsDefaultLang).val();
     var newAandroidStatus = unPublishStr;
     var newIOSStatus = unPublishStr;
     var confirmSrt = "";
     var confirmTitleSrt = "";
     var qplayAppErr = [];
         
    if(projectCode == '000'){
        if($('#gridAndroidVersionList').find('div.switch-success').size() <= 0){
            qplayAppErr.push('Android');
        }
        if($('#gridIOSVersionList').find('div.switch-success').size() <= 0){
            qplayAppErr.push('IOS');
        }

        if(qplayAppErr.length > 0){
            showMessageDialog(Messages.ERROR,Messages.ERR_QPLAY_MUST_PUBLISH.replace('%s',qplayAppErr.join("、")));
            return false;
        }
    }

     $('#gridAndroidVersionList').find('div.switch-success').each(function(){
        newAandroidStatus = $(this).parent().data('name');
     });
     $('#gridIOSVersionList').find('div.switch-success').each(function(){
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
        submitFormAry[i].submit();
    }
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
            errorPlacement: function ($error, $element) {
                validate =0;
                $alert = $('#appMaintainAlert');
                if($element.attr("name") == 'chkCompany'){
                    $error.insertAfter("#selNormal");
                    //$alert.append('<p>角色設定:請選擇公司</p>');
                }
                else if($element.attr("name") == 'cbxRole' || $element.attr("name") == 'cbxAllRole'){
                    $error.insertAfter("#selUserRole");
                   // $alert.append('<p>角色設定:請選擇企業角色或加入用戶</p>');
                }else if($element.hasClass('js-upl-addition')){
                    $element.parent('li').after($error);
                    var langTag = $element.attr("name").split('_')[1];
                    var langStr = $('#ddlLang_'+langTag).find('a').text();
                    // if($element.attr("name").search(/ios/) == 0){
                    //     $alert.append('<p>'+langStr+'-IOS : '+$error.text()+'</p>');
                    // }else if($element.attr("name").search(/android/) == 0){
                    //     $alert.append('<p>'+langStr+'-Android : '+$error.text()+'</p>');
                    // }
                }else if($element.attr("name") == 'errorCodeFile' ){
                   $error.insertAfter($('input[name=errorCodeFile]').parent().next());
                }else if($element.attr('name') == 'fileIconUpload'){
                   $error.insertAfter($('.iconUpload'));
                }else{
                    var langTag = $element.attr("name").split('_')[1];
                    var langStr = $('#ddlLang_'+langTag).find('a').text();
                    var labelName = $('.info-dymaic-content').find('label[for='+$element.attr("name")+']').text();
                    $error.insertAfter($element);
                    //$alert.append('<p>'+langStr+'-'+labelName+' : '+$error.text()+'</p>');
                }
                showMessageDialog(Messages.ERROR,Messages.MSG_NOT_COMPLETE);
               // $('#appMaintainAlert').fadeIn('1500');
           },
           submitHandler: function (form) {
                validate ++;
                if(validate==submitFormAry.length){
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
                    
                    var androidVersionList =  $("#gridAndroidVersionList").bootstrapTable('getData');
                    $.each(androidVersionList, function(i, version) {
                        $.each(version, function(j,v){
                            formData.append('versionList[android][' + i + '][' + j + ']',v);
                        }); 
                    });
                    var iosVersionList =  $("#gridIOSVersionList").bootstrapTable('getData');
                    $.each(iosVersionList, function(i, version) {
                        $.each(version, function(j,v){
                            formData.append('versionList[ios][' + i + '][' + j + ']',v);
                        }); 
                    });

                    formData.append('delVersionArr',delVersionArr);

                    var customApiList =  $("#gridCustomApi").bootstrapTable('getData');
                    $.each(customApiList, function(i, api) {
                         $.each(api, function(j,data){
                            formData.append('customApiList[' + i + '][' + j + ']',data);
                        }); 
                    });

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
                            validate = 0
                            if(d.result_code == 1) {
                                 showMessageDialog(Messages.MESSAGE,Messages.MSG_OPERATION_SUCCESS);
                                $('#messageDialog').find('button').click(function(){
                                    location.reload();
                                });
                            }else{
                               showMessageDialog(Messages.ERROR,d.message);
                            }
                        },
                        error: function (e) {
                            validate = 0
                             showMessageDialog(Messages.ERROR, Messages.MSG_OPERATION_FAILED, e.responseText)
                        }
                    });
                     
                }else{
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
        var iosPublishCnt = $('#gridIOSVersionList').find('div.switch-success').size();
        var androidPublishCnt = $('#gridAndroidVersionList').find('div.switch-success').size();
        if(androidPublishCnt + iosPublishCnt ==0){
            return true;
        }
        if($('.icon-preview').length == 1 && $('.icon-preview').attr('src')!=""){
            return true;
        }
        return false;
    });

    jQuery.validator.addMethod("screenshot", function(value, element) {
        var iosPublishCnt = $('#gridIOSVersionList').find('div.switch-success').size();
        var androidPublishCnt = $('#gridAndroidVersionList').find('div.switch-success').size();
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
});