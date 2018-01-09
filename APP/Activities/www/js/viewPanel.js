
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay">'
        +   '<div class="ios-fix-overlap-div"></div>'
        +   '<div class="panel-content" id="mypanelviewActivitiesSignup">'
        +       '<span class="panel-text">活動報名</span>'
        //+       '<span class="panel-text">' + langStr["str_002"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewActivitiesRecord">'
        +       '<span class="panel-text">報名記錄</span>'
        //+       '<span class="panel-text">' + langStr["str_003"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewMyFamilyDatum">'
        +       '<span class="panel-text">我的眷屬資料</span>'
        //+       '<span class="panel-text">' + langStr["str_004"] + '</span>'
        +   '</div>'
        +'</div>'
        +'<div class="page-mask" style="display: none;"></div>';

$(document).one("pagebeforeshow", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewActivitiesSignup").css("background", "#503f81");
    $("#mypanel #mypanelviewActivitiesSignup").css("color", "#fff");

    if (device.platform === "iOS") {
        $("#mypanelviewActivitiesSignup").css("margin-top", "20px");
        $(".page-mask").css("top", "20px");
    }

    $("#mypanel #mypanelviewActivitiesSignup").on("click", function() {
        changePageByPanel("viewActivitiesSignup");
    });

    $("#mypanel #mypanelviewActivitiesRecord").on("click", function() {
        changePageByPanel("viewActivitiesRecord");
    });

    $("#mypanel #mypanelviewMyFamilyDatum").on("click", function() {
        changePageByPanel("viewMyFamilyDatum");
    });

    $(".menu-btn .menu").on("click", function() {
        $("#mypanel").panel("open");
        $(".page-mask").show();
    });

    $(document).on("swipeleft", function(event) {
        if($(".ui-page-active").jqmData("panel") === "open") {
            $("#mypanel").panel("close");
            $(".page-mask").hide();
        }
    });

    $(document).on("panelbeforeclose", "#mypanel", function() {
        $(".page-mask").hide();
    });
});
