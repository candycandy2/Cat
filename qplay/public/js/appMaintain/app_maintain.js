var submitFormAry = [$("#mainInfoForm"),
                     $("#errorCodeForm"),
                     $("#basicInfoForm"),
                     $('#iconForm'),
                     $('#screenShotForm'),
                     $('#customApiForm')];


SaveAppDetail = function(){
    
     var unPublishStr = 'UnPublish';
     var appName = $('#txbAppName_'+jsDefaultLang).val();
     var newAandroidStatus = unPublishStr;
     var newIOSStatus = unPublishStr;
     var confirmSrt = "";
     var confirmTitleSrt = "";
    
     $('#gridAndroidVersionList').find('div.switch-success').each(function(){
        newAandroidStatus = $(this).parent().data('name');
     });
     $('#gridIOSVersionList').find('div.switch-success').each(function(){
        newIOSStatus = $(this).parent().data('name');
     });

     if((jsOriAndroidStatus!=unPublishStr || jsOriIOSStatus!=unPublishStr) && 
        (newAandroidStatus == unPublishStr && newIOSStatus == unPublishStr)){
        confirmSrt = '確認將 '+ appName +' 取消發布？';
        confirmTitleSrt = '取消發佈確認';
     }else if(jsOriAndroidStatus != newAandroidStatus || jsOriIOSStatus != newIOSStatus){
         confirmSrt = '確認將 ' + appName + ' 發布 Android- ' + newAandroidStatus + ' | IOS- ' + newIOSStatus + '？';
         confirmTitleSrt = '發佈確認';
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
                }
            }, 
            groups: {
                setAppUser: "cbxRole cbxAllRole"
            },
            errorPlacement: function ($error, $element) {
                console.log($element.attr("name"));
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
                }else{
                    var langTag = $element.attr("name").split('_')[1];
                    var langStr = $('#ddlLang_'+langTag).find('a').text();
                    var labelName = $('.info-dymaic-content').find('label[for='+$element.attr("name")+']').text();
                    $error.insertAfter($element);
                    //$alert.append('<p>'+langStr+'-'+labelName+' : '+$error.text()+'</p>');
                }
                showMessageDialog("錯誤", "資訊未填寫完成");
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
                    $('#screenShotForm').find('input[name^=iosScreenUpload_]').each(function(){      
                        var iosFile = $(this).attr('id');
                        $.each($( '#'+iosFile )[0].files, function(i, file) {
                            formData.append(iosFile + '[]', file);
                        });
                    });
                    $('#screenShotForm').find('input[name^=androidScreenUpload_]').each(function(){
                        var androidFile = $(this).attr('id');
                        $.each($( '#'+androidFile )[0].files, function(i, file) {
                            formData.append(androidFile + '[]', file);
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
                    $.each(customApiList, function(i, apiObj) {
                         $.each(apiObj, function(j,data){
                            formData.append('customApiList[' + i + '][' + j + ']',data);
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
                            if(d.result_code != 1) {
                                showMessageDialog("錯誤",d.message);
                            }else{
                                showMessageDialog("消息","操作成功!");
                                $('#messageDialog').find('button').click(function(){
                                    location.reload();
                                });
                            }
                        },
                        error: function (e) {
                            validate = 0
                             showMessageDialog("錯誤", "操作失敗", e.responseText)
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
        if($('.icon-preview').length == 1 ){
            return true;
        }
        return false;
    });

    jQuery.validator.addMethod("screenshot", function(value, element) {
        if($(element).parent().parent().find('li.imgLi').length > 0 ){
            return true;
        }
        return false;
    });
});