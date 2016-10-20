var submitFormAry = [$("#mainInfoForm"),$("#basicInfoForm"),$('#iconForm'),$('#screenShotForm')];
var validate = 0;
SaveAppDetail = function(){
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

    $("#mainInfoForm").submit();
    $("#basicInfoForm").submit();
    $('#iconForm').submit();
    $('#screenShotForm').submit();
}

$(function () {
    for(var key in submitFormAry){       
       submitFormAry[key].validate({
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
               // console.log($element.attr("name"));
                validate =0;
                $alert = $('#appMaintainAlert');
                if($element.attr("name") == 'chkCompany'){
                    $error.insertAfter("#selNormal");
                    $alert.append('<p>角色設定:請選擇公司</p>');
                }
                else if($element.attr("name") == 'cbxRole' || $element.attr("name") == 'cbxAllRole'){
                    $error.insertAfter("#selUserRole");
                    $alert.append('<p>角色設定:請選擇企業角色或加入用戶</p>');
                }else if($element.hasClass('js-upl-addition')){
                    $element.parent('li').after($error);
                    var langTag = $element.attr("name").split('_')[1];
                    var langStr = $('#ddlLang_'+langTag).find('a').text();
                    if($element.attr("name").search(/ios/) == 0){
                        $alert.append('<p>'+langStr+'-IOS : '+$error.text()+'</p>');
                    }else if($element.attr("name").search(/android/) == 0){
                        $alert.append('<p>'+langStr+'-Android : '+$error.text()+'</p>');
                    }
                }else{
                    var langTag = $element.attr("name").split('_')[1];
                    var langStr = $('#ddlLang_'+langTag).find('a').text();
                    var labelName = $('.info-dymaic-content').find('label[for='+$element.attr("name")+']').text();
                    $error.insertAfter($element);
                    $alert.append('<p>'+langStr+'-'+labelName+' : '+$error.text()+'</p>');
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
                    formData.append('delPic',delPicArr.join(","));
                    formData.append('categoryId',$('#ddlAppCategory').val());
                    formData.append('securityLevel',$('#ddlSecurityLevel').val());
                    $('input[name=chkCompany]:checked').each(function(){
                        formData.append('chkCompany[]',$(this).val());
                    });
                    $('input[name=cbxRole]:checked').each(function(){
                        formData.append('appRoleList[]',$(this).attr('data'));
                    });
                    var currentData =  $("#gridUserList").bootstrapTable('getData');
                    $.each(currentData, function(i, user) {
                        formData.append('appUserList[]',user.row_id);
                    });


                    $.ajax({
                        url: "AppMaintain/saveAppDetail",
                        type: "POST",
                        contentType: false,
                        data: formData,
                        processData: false,
                        success: function (d, status, xhr) {
                            validate = 0
                            alert('ok');
                            //location.reload();
                        },
                        error: function (e) {
                            validate = 0
                            alert('error')
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