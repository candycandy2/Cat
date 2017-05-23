var ShowLoading;
var HideLoading;

(function ($) {
    var $LoadingCover = null;
    var $LoadingFlash = null;
    var showLoadingStatus = 0;  //0：初始化，1：已经"Loading动画"，2：已经关闭"Loading动画"

    function initializationQLoadingObject() {
        if (!$LoadingCover) {
            $LoadingCover = $("<div class='QLoading_Cover_CSS'>&nbsp;</div>");
            $(document.body).append($LoadingCover);
        }

        if (!$LoadingFlash) {
            $LoadingFlash = $("<div style='display: none;' align='center' class='QLoading_Flash_CSS'>" +
                "<input type='button' class='QLoading_Loading_CSS' title='Loading' /><br />" +
                "Loading..." +
            "</div>");
            $(document.body).append($LoadingFlash);
        }
    }

    ShowLoading = function() {
        initializationQLoadingObject();

        $LoadingCover.height($(document).height() - 10);
        $LoadingCover.show();

        showLoadingStatus = 0;

        //500毫秒后显示"Loading动画"
        setTimeout(function() {
            if (showLoadingStatus == 0) {
                $LoadingFlash
                    .css(
                    {
                        top: (document.documentElement.clientHeight - $LoadingFlash.height()) / 2,
                        left: (document.documentElement.clientWidth - $LoadingFlash.width()) / 2
                    })
                    .show();
                showLoadingStatus = 1;
            }
        }, 500);
    };

    HideLoading = function() {
        initializationQLoadingObject();

        $LoadingCover.hide();
        $LoadingFlash.hide();

        showLoadingStatus = 2;
    };

    try {
        Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(function (sender, args) {
            ShowLoading();
        });

        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function (sender, args) {
            HideLoading();
        });
    } catch (ex) {
    }

})(jQuery);