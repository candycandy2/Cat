SaveAppDetail = function(){
var formData = new FormData();
var mainInfoData = $('#mainInfoForm').serializeArray(); 
formData.append('appId',jsAppRowId);
//if change default language
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
                // if(d.result_code != 1) {
                //     alert('error')
                // }  else {
                //    alert('ok')
                // }
                alert('ok');
            },
            error: function (e) {
               alert('error')
            }
        });


}