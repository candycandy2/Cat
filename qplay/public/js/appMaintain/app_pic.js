var screenShotfileQueue = {};
$(function (){
    
    function format_float(num, pos)
    {
        var size = Math.pow(10, pos);
        return Math.round(num * size) / size;
    }
 
    function iconPreview(input) {
        
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
               validImageSize(512,512,e.target.result,function(valisRes){
                    if(valisRes!=""){
                        showMessageDialog(Messages.ERROR,valisRes);
                        $("#"+$(input).attr('id')).val('');
                        return false;
                    }else{
                         $('.iconUpload').parent().find('.imgLi').html('<img class="icon-preview"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="icon"/></div>')
                         $('.icon-preview').attr('src', e.target.result);
                         $('.iconUpload').parent().find('.imgLi').show();
                         $('.iconUpload').next('label.error').remove();
                        $('.iconUpload').hide();
                    }
               });
              // var KB = format_float(e.total / 1024, 2);
              // $('.size').text("檔案大小：" + KB + " KB");
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    function screenPreview(input,uplBtnId){
        var langId = $(input).attr('id').split('_')[1];
        var deviceType = ( $(input).attr('id').split('_')[0] == 'androidScreenUpload')?'android':'ios';
        var oriImageCnt =  $('#'+ uplBtnId).parent('ul').find('li .screen-preview').length;
        if(typeof screenShotfileQueue[$(input).attr('id')] == "undefined"){
            screenShotfileQueue[$(input).attr('id')] = new Array();

        }
        var total = parseInt(oriImageCnt) + parseInt(input.files.length);
        if(total > 5){
            showMessageDialog(Messages.ERROR, Messages.ERR_SCREENSHOT_FILE_LIMIT.replace('%s',5).replace('%l',total));
            return false;
        }
        for(var i = 0; i< input.files.length; i++)
        {
            if (input.files && input.files[i]) {
                input.files[i].uploadName = Date.now();
                screenShotfileQueue[$(input).attr('id')].push(input.files[i]);
                if(window.FileReader) {
                    var reader = new FileReader();
                    reader.fileName = input.files[i].uploadName; //input.files[i].name;
                    reader.langId = langId;
                    reader.deviceType = deviceType;
                    reader.onload = function (e,name) {
                        validImageSize(768,1024,e.target.result,function(valisRes){
                        if(valisRes!=""){
                            showMessageDialog(Messages.ERROR,valisRes);
                            $("#"+$(input).attr('id')).val('');
                            screenShotfileQueue[$(input).attr('id')].pop();
                            return false;
                        }else{
                            $('#'+ uplBtnId).before('<li class="imgLi" data-url="'+e.target.fileName+'" data-lang="'+e.target.langId+'" data-device="'+deviceType+'"><img src="'+e.target.result+'" class="screen-preview"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="screenshot"/></li>');
                            var imgCount = $('#'+ uplBtnId).parent('ul').find('li .screen-preview').length;
                            if(imgCount >= 5){
                                $('#'+ uplBtnId).parent('ul').find('.screen-upl-btn').hide();
                            }
                            $('#'+ uplBtnId).next('label.error').remove();
                            }
                        });
                    }
                    reader.readAsDataURL(input.files[i]);
                }else{
                    alert('browser not support !');
                }
            }
        }
        $("#"+$(input).attr('id')).val('');
    }

    function deleteIcon($target){
        $target.parent().hide();
        $target.parent().find('img').remove();
        $("#fileIconUpload").val('');
        $('.iconUpload').show();
    }

    function deleteScreenShot($target){
        var $container = $target.parents('ul');
        if(typeof($target.parent().data('picid'))!="undefined"){
            delPicArr.push($target.parent().data('picid'));
        }

        deleteScreenShotQueue($target.parent().data('url'),$container.find('.js-upl-addition').attr('id'));
        $target.parent().remove();
        if($container.find('li:visible').length < 5){
            $container.find('.js-screen-file').show();
        }
    }

    function deleteScreenShotQueue(find,target){

        $.each( screenShotfileQueue[target], function(i, file) {
            if(typeof file!= "undefined" &&  file.uploadName == find){
              screenShotfileQueue[target].splice(i,1)
            }
        });
    }

    function validImageSize(widthLimit,heightLimit,fileBase64,callback){
        
        var img = new Image();
        img.onload = function(){
            var result = "";
            if(img.width != widthLimit || img.height != heightLimit){
                result =  Messages.ERR_SCREENSHOT_SCALE_LIMIT.replace('%s',widthLimit).replace('%l',heightLimit);
            }
            if(callback) callback(result);    
        }   
        img.src = fileBase64;
    }

    var imageSize = function(url, callback) {
        var img = new Image();
        img.onload = function(){        
          if(callback) callback(img.width,img.height);    
        }   
        img.src = url;    
    }

    $("body").on("change", ".js-upl-overlap", function (){
        iconPreview(this);
    });

    $("body").on("change", ".js-upl-addition", function (){ 
        var uplBtnId = $(this).parent().attr('id');
        screenPreview(this,uplBtnId);
    });

    $(".js-icon-file").click(function(){
        $('#fileIconUpload').trigger('click');
    });

    $("body").on("click", ".js-screen-file", function (e){
       $(e.target.children[2]).trigger('click');
    });

    $("body").on("click", ".js-screen-file > div", function (e){
      $(e.target).parent().click();
    });

    $( ".sortable" ).sortable({
        start: function( event, ui ) {
        }
    });

    $( ".sortable" ).disableSelection();

    $('body').on('mouseover','.screen-preview',function(e) {  
        $(e.currentTarget).next('.delete').show()
    });
    
    $('body').on('mouseover','.icon-preview',function(e) {  
        $(e.currentTarget).next('.delete').show()
    });

    $('body').on('mouseleave ','.imgLi',function(e) {  
        $(e.currentTarget).find('.delete').hide();  
    });

    $('body').on('click','.imgLi .delete',function(e) {

        if($(e.currentTarget).data('source') == 'icon'){
            deleteIcon($(e.currentTarget));
        }else{
            deleteScreenShot($(e.currentTarget));
        }
    });


});