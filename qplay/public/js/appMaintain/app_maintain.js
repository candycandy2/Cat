SaveAppDetail = function(){
var formData = new FormData();
var mainInfoData = $('#mainInfoForm').serializeArray(); 

$.each(mainInfoData,function(key,input){
   formData.append(input.name,input.value);
});

//formData.append("mainInfo", mainInfoData);

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