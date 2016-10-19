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
                $('.iconUpload').parent().find('.imgLi').append('<img class="icon-preview"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="icon"/></div>')
                $('.icon-preview').attr('src', e.target.result);
                $('.iconUpload').parent().find('.imgLi').show();
                $('.iconUpload').hide();
               // var KB = format_float(e.total / 1024, 2);
               // $('.size').text("檔案大小：" + KB + " KB");
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    function screenPreview(input,uplBtnId){
         if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {

                $('#'+ uplBtnId).before('<li class="imgLi"><img src="'+e.target.result+'" class="screen-preview js-screen-file"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="screenshot"/></li>');
                var imgCount = $('#'+ uplBtnId).parent('ul').find('li .screen-preview').length;
                if(imgCount >= 5){
                    $('#'+ uplBtnId).parent('ul').find('.screen-upl-btn').hide();
                }
            }   
            reader.readAsDataURL(input.files[0]);
        }
       
    }

    function deleteIcon($target){
        $target.parent().hide();
        $target.parent().find('img').remove();
        $('.iconUpload').show();
    }

    function deleteScreenShot($target){
        var $container = $target.parents('ul');
        $target.parent().remove();
        if($container.find('li:visible').length < 5){
            $container.find('.js-screen-file').show();
        }
    }

    var timeout;
    var iconTimeout;

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

    $(".js-screen-file").click(function(e){
        $(e.target.children[2]).trigger('click');
    });
     
    $( ".sortable" ).sortable({
        start: function( event, ui ) {
            clearTimeout(timeout);  
        }
    });

    $( ".sortable" ).disableSelection();

    $('body').on('mousedown','.screen-preview',function(e) {  
        var $currentTarget = $(e.currentTarget);
        timeout = setTimeout(function() {
            $currentTarget.next('.delete').show()
        }, 500);  
    });
    $('body').on('mouseup','.screen-preview',function() {  
         clearTimeout(timeout);  
    });
    $('body').on('mouseout','.screen-preview',function() {  
         clearTimeout(timeout);  
    });
    
    $('body').on('mousedown','.icon-preview',function(e) {  
        var $currentTarget = $(e.currentTarget);
        iconTimeout = setTimeout(function() {
            $currentTarget.next('.delete').show()
        }, 500);  
    });
    $('body').on('mouseup','.icon-preview',function() {  
         clearTimeout(iconTimeout);  
    });
    $('body').on('mouseout','.icon-preview',function() {  
         clearTimeout(iconTimeout);  
    });

    $('body').on('click','.imgLi .delete',function(e) {
        if($(e.currentTarget).data('source') == 'icon'){
            deleteIcon($(e.currentTarget));
        }else{
            deleteScreenShot($(e.currentTarget));
        }
    });


});