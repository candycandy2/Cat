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
                $('.iconUpload').parent().find('.imgLi').html('<img class="icon-preview"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="icon"/></div>')
                $('.icon-preview').attr('src', e.target.result);
                $('.iconUpload').parent().find('.imgLi').show();
                $('.iconUpload').next('label.error').remove();
                $('.iconUpload').hide();
               // var KB = format_float(e.total / 1024, 2);
               // $('.size').text("檔案大小：" + KB + " KB");
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    function screenPreview(input,uplBtnId){
       
        var langId = $(input).attr('id').split('_')[1];
        var deviceType = ( $(input).attr('id').split('_')[0] == 'androidScreenUpload')?'android':'ios';
        for(var i = 0; i< input.files.length; i++)
        {

            if (input.files && input.files[i]) {
                var reader = new FileReader();
                reader.fileName = input.files[i].name;
                reader.langId = langId;
                reader.deviceType = deviceType;
                reader.onload = function (e,name) {
                    
                    $('#'+ uplBtnId).before('<li class="imgLi" data-url="'+e.target.fileName+'" data-lang="'+e.target.langId+'" data-device="'+deviceType+'"><img src="'+e.target.result+'" class="screen-preview js-screen-file"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="screenshot"/></li>');
                    var imgCount = $('#'+ uplBtnId).parent('ul').find('li .screen-preview').length;
                    if(imgCount >= 5){
                        $('#'+ uplBtnId).parent('ul').find('.screen-upl-btn').hide();
                    }
                    $('#'+ uplBtnId).next('label.error').remove();
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
    }

    function deleteIcon($target){
        $target.parent().hide();
        $target.parent().find('img').remove();
        $('.iconUpload').show();
    }

    function deleteScreenShot($target){
        var $container = $target.parents('ul');
        delPicArr.push($target.parent().data('picid'));
        $target.parent().remove();
        if($container.find('li:visible').length < 5){
            $container.find('.js-screen-file').show();
        }
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