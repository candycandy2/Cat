
var panel = htmlContent
    + '<div data-role="panel" id="mypanel" data-display="overlay">'
    + '<div class="ios-fix-overlap-div"></div>'
    + '<div class="panel-content" id="mypanelviewActivitiesList">'
    //+ '<span class="panel-text">活動報名</span>'
    + '<span class="panel-text"><span class="langStr" data-id="str_002"></span></span>'
    + '</div>'
    + '<div class="panel-content" id="mypanelviewActivitiesRecord">'
    //+ '<span class="panel-text">報名記錄</span>'
    + '<span class="panel-text"><span class="langStr" data-id="str_003"></span></span>'
    + '</div>'
    + '<div class="panel-content" id="mypanelviewMyFamilyDatum">'
    //+ '<span class="panel-text">我的眷屬資料</span>'
    + '<span class="panel-text"><span class="langStr" data-id="str_004"></span></span>'
    + '</div>'
    + '<div class="panel-content view-hide" id="mypanelviewActivitiesDetail">'
    + '<span class="panel-text">活動詳情</span>'
    + '</div>'
    + '<div class="panel-content view-hide" id="mypanelviewActivitiesSignup">'
    + '<span class="panel-text">報名</span>'
    + '</div>'
    + '<div class="panel-content view-hide" id="mypanelviewActivitiesManage">'
    + '<span class="panel-text">管理</span>'
    + '</div>'
    + '<div class="panel-content view-hide" id="mypanelviewSelectFamily">'
    + '<span class="panel-text">選擇眷屬</span>'
    + '</div>'
    + '</div>'
    + '<div class="page-mask view-hide"></div>';

$(document).one("pagebeforeshow", function () {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewActivitiesList").css("background", "#503f81");
    $("#mypanel #mypanelviewActivitiesList").css("color", "#fff");

    if (device.platform === "iOS") {
        $("#mypanelviewActivitiesList").css("margin-top", "20px");
        $(".page-mask").css("top", "20px");
    }

    $("#mypanel #mypanelviewActivitiesList").on("click", function () {
        changePageByPanel("viewActivitiesList", true);
    });

    $("#mypanel #mypanelviewActivitiesRecord").on("click", function () {
        changePageByPanel("viewActivitiesRecord", true);
    });

    $("#mypanel #mypanelviewMyFamilyDatum").on("click", function () {
        changePageByPanel("viewMyFamilyDatum", true);
    });

    $(".menu-btn .menu").on("click", function () {
        $("#mypanel").panel("open");
        $(".page-mask").show();
    });

    $(document).on("swipeleft", function (event) {
        if ($(".ui-page-active").jqmData("panel") === "open") {
            $("#mypanel").panel("close");
            $(".page-mask").hide();
        }
    });

    $(document).on("panelbeforeclose", "#mypanel", function () {
        $(".page-mask").hide();
    });
});
