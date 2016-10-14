SaveAppDetail = function(){
    $("#mainInfoForm").submit();
    $("#basicInfoForm").submit();
    $('#iconForm').submit();
    $('#screenShotForm').submit();
}

$(function () {
    var validate = 0;
    $('form').each(function() {
        $(this).validate({
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
                }
            }, 
            groups: {
                setAppUser: "cbxRole cbxAllRole"
            },
            errorPlacement: function ($error, $element) {
                if($element.attr("name") == 'chkCompany'){
                    $error.insertAfter("#selNormal");
                }
                else if($element.attr("name") == 'cbxRole' || $element.attr("name") == 'cbxAllRole'){
                    $error.insertAfter("#selUserRole");
                }else if($element.hasClass('js-upl-addition')){
                    $element.parent('li').after($error);
                }else{
                    $error.insertAfter($element);
                }
           },
           submitHandler: function (form) {
            validate++;
                if(validate == 4){
                    var formData = new FormData();
                    formData.append('appId',jsAppRowId);
                    if(jsDefaultLang != oriDefaultLang){
                        formData.append('defaultLang',jsDefaultLang);
                    }
                    formData.append('mainInfoForm',$('#mainInfoForm').serialize());
                    $.ajax({
                        url: "AppMaintain/saveAppDetail",
                        type: "POST",
                        contentType: false,
                        data: formData,
                        processData: false,
                        success: function (d, status, xhr) {
                            alert('ok');
                        },
                        error: function (e) {
                           alert('error')
                        }
                    });
                }else{
                    validate = 0;
                    return false;
                }
            }
        });
    });

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
    
    jQuery.validator.addMethod("setAppUser", function(value, element) {
        if($('.cbxRole:checked').length <= 0 &&　$('#gridUserList').bootstrapTable('getData').length == 0){
            return false;
        }
        return true;
    });

    jQuery.validator.addMethod("icon", function(value, element) {
        if($('.icon-preview:visible').length == 1 ){
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