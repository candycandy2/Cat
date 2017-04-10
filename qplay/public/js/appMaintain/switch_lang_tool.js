    var addLang = function(){
        $('#addLangDialog').modal('show');
        $('#addLangDialog').find('input[name="optionsRadios"]:checked').prop('checked',false);
    }
    var delLang = function(){
         var $oldDefLangObj = $('#delLangDialog').find('input[type=checkbox]:disabled');
         var oldVal =  $oldDefLangObj.val();
         var oldLang = $oldDefLangObj.parent().text();
         var index = oldLang.search("\\(");
         oldLang = $oldDefLangObj.parent().text().substring(0,index);

         $oldDefLangObj.parent().text("").append('<input type="checkbox" value="'+oldVal+'">'+oldLang);
         var $targetDefLangObj  = $('#delLangDialog').find('input[type=checkbox][value='+jsDefaultLang+']');
         var targetLang = $targetDefLangObj.parent().text();
         $targetDefLangObj.parent().text("").append('<input type="checkbox" value="'+jsDefaultLang+'" disabled=""><span class="text-muted">'+targetLang+' ('+Messages.MSG_DEFAULT_LANGUAGE_CAN_NOT_REMOVE+')</span>');
         $('#delLangDialog').find('input[type="checkbox"]').each(function(){
            $(this).prop('checked',false);
         });
         $('#delLangDialog').modal('show');
    }

    var changDefaultLang = function(){
        $('#changDefaultLangDialog').find('input[name="optionsRadios"][value='+jsDefaultLang+']').prop('checked',true);
        $('#changDefaultLangDialog').modal('show');
    }

    var saveChangeDefaultanlg = function(){
        jsDefaultLang =  $('#changDefaultLangDialog').find('input[name="optionsRadios"]:checked').val();
        $('#changDefaultLangDialog').modal('hide');

    }

    var AddAppAllowLang = function(){

        var $addLangDialog = $('#addLangDialog');
        var $targetLanObj =  $addLangDialog.find('input[name="optionsRadios"]:checked');
        var targetLanId = $targetLanObj.val();
        if(typeof targetLanId ==='undefined'){
            return false;
        }
        var targetLanStr = $targetLanObj.parent().text().trim();
        var infoSwitchContent = '<li class="js-switch-lang" id="ddlLang_'+ targetLanId +'" data-toggle="'+ targetLanId +'"><a href="#">'+ targetLanStr +'</a></li>';
        var picSwitchContent = '<li class="js-switch-lang" id="ddlPicLang_'+ targetLanId +'" data-toggle="'+ targetLanId +'"><a href="#">'+ targetLanStr +'</a></li>';
        $addLangDialog.find('#radioLang_'+targetLanId).remove();
        cloneInfo(targetLanId);
        clonePic(targetLanId);
        $('#switchLang').append(infoSwitchContent);
        $('#switchPicLang').append(picSwitchContent);
        switchToLangCotent(targetLanId);
        $addLangDialog.modal('hide');
        addRemoveableLang(targetLanId,targetLanStr);
        addDefaulableLang(targetLanId,targetLanStr);
        checkLangToolStatus();
    }

    var cloneInfo = function(targetLanId){
        var $contentObj = $('#infoDymaicContent');
        var content =  '<div class="lang js-lang-' + targetLanId + '">' + $contentObj.html().replace(/\{langId}/g,targetLanId) + '</div>';
        $('.info-dymaic-content').append(content);

    }
    var clonePic = function(targetLanId){
         var $contentObj = $('#picDymaicContent');
         var content =  '<div class="lang js-lang-' + targetLanId + '">' + $contentObj.html().replace(/\{langId}/g,targetLanId) + '</div>';
         $('.pic-dymaic-content').append(content);
    }

    var addRemoveableLang = function(langId,langStr){
        var removeableLangContent = '<div class="checkbox"><label><input type="checkbox" id="" value="'+langId+'">'+langStr+'</label></div>';
        $('#removeableLang').append(removeableLangContent);
    }

    var addDefaulableLang = function(langId,langStr){
       var defaultableLangContent = '<div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios_'+langId+'" value="'+langId+'">'+langStr+'</label></div>';
       $('#defaultableLang').append(defaultableLangContent);
    }

    var removeDefaulableLang = function(langId){
       $('#defaultableLang').find($('#optionsRadios_'+langId)).parent().remove();
    }

    var addSelectableLang = function(langId,langStr){
        var selectableLangContent = '<div class="radio" id="radioLang_'+langId+'"><label><input type="radio" name="optionsRadios" value="'+ langId +'">'+langStr+'</label></div>';
       $('#addableLang').append(selectableLangContent);
    } 

    var removeSwitchLang = function(langId){
       $('.js-switchLang').find($('#ddlLang_'+langId)).remove();
       $('.js-switchLang').find($('#ddlPicLang_'+langId)).remove();
    }

    var checkLangToolStatus = function(){
        var addableLangCount = $('#addLangDialog').find('#addableLang').find('input[name="optionsRadios"]').length;
        var $langToolBar = $('.js-lang-tool-bar');
        var $switchLangBtn = $langToolBar .find('.js-switch-lang-btn');
        var $addLangBtn = $('#btnAddLang');
        var defaultableLangCount = $('#defaultableLang').find('input[name="optionsRadios"]').length;
        var newCount = $('#btnLagSwitchController').find('.js-switchLang').children().length;
        
        (addableLangCount == 0)?$addLangBtn.hide():$addLangBtn.show();
        if(newCount > 1){
            $langToolBar.find('.js-lang-count').text(newCount);
            $switchLangBtn.show();
        }else{
            $switchLangBtn.hide();
        }
        if(defaultableLangCount > 1){
            $('#btnChangeDefaultLang').removeClass('disabled').attr('title','').attr("onclick",'changDefaultLang()');
        }
    }
    var switchToLangCotent = function(langId){
       $('.lang').hide();
       $('.js-lang-'+ langId).fadeIn('1500');
       $('.label-hint').text($('#ddlLang_'+langId).children('a').text());
    }
    var saveRemoveLang= function(){
        if($('#removeableLang').find('input[type=checkbox]:checked').length == 0){
            return false;
        }
        showConfirmDialog(Messages.REMOVE_CONFIRM, Messages.MSG_SYSTEM_WILL_DELETE_ALL_ALNGUAGE,"",function () {
            hideConfirmDialog();
            var chk = $('#removeableLang').find('input[type=checkbox]:checked').each(function(){
            var chkLangId = $(this).val();
            var targetLanStr = $(this).parent().text().trim();
                addSelectableLang(chkLangId,targetLanStr);  
                $(this).parent().remove(); 
                $('.js-lang-' + chkLangId).remove();
                removeDefaulableLang(chkLangId);
                removeSwitchLang(chkLangId); 
            });
            switchToLangCotent(jsDefaultLang);
            checkLangToolStatus();
            $('#delLangDialog').modal('hide');  
        });
    }

$(function (){
    var iniLangCount = $('#btnLagSwitchController').find('.js-switchLang').children().length;

    $('div.lang').hide();
    $('.js-lang-'+jsDefaultLang).show();
    $('.label-hint').text(jsDefaultLangStr);
    $('.js-lang-count').text(iniLangCount);
    if(iniLangCount == 1){
        $('.js-lang-tool-bar').find('.js-switch-lang-btn').hide();
    }
    $(document).on('click', '.js-switch-lang', function(event){
        var lanId = $(this).data('toggle');
        switchToLangCotent(lanId);
    });
    checkLangToolStatus();

});