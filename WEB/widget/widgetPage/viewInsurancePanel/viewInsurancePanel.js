var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="position:fixed;">'
        +   '<div class="ios-fix-overlap-div"></div>'
        +   '<div class="panel-content" id="mypanelviewInsuranceMain">'
        //+       '<span class="panel-text">保險概要</span>'
        +       '<span class="panel-text">' + langStr["str_050"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewInsuranceInfo">'
        //+       '<span class="panel-text">個人保險概要</span>'
        +       '<span class="panel-text">' + langStr["str_051"] + '</span>'
        +   '</div>'   
        +   '<div class="panel-content" id="mypanelviewInsuranceFamilyData">'
        //+       '<span class="panel-text">眷屬資料維護</span>'
        +       '<span class="panel-text">' + langStr["str_052"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewInsuranceContact">'
        //+       '<span class="panel-text">服務窗口</span>'
        +       '<span class="panel-text">' + langStr["str_053"] + '</span>'
        +   '</div>'
        +'</div>'
        +'<div class="page-mask" style="display: none;"></div>';

$(document).one("pagebeforeshow", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewInsuranceMain").css("background", "#503f81");
    $("#mypanel #mypanelviewInsuranceMain").css("color", "#fff");

    if (device.platform === "iOS") {
        $("#mypanelviewInsuranceMain").css("margin-top", "20px");
        $(".page-mask").css("top", "20px");
    }

    $("#mypanel #mypanelviewInsuranceMain").on("click", function() {
        //changePageByPanel("viewMain");
        checkWidgetPage('viewInsuranceMain', visitedPageList);
    });

    $("#mypanel #mypanelviewInsuranceInfo").on("click", function() {
        editLeaveForm = false; 
        //changePageByPanel("viewPersonalInsurance");
        checkWidgetPage('viewInsuranceInfo', visitedPageList);
    });

    $("#mypanel #mypanelviewInsuranceFamilyData").on("click", function() {
        //changePageByPanel("viewFamilyData");
        checkWidgetPage('viewInsuranceFamilyData', visitedPageList);
    });

    $("#mypanel #mypanelviewInsuranceContact").on("click", function() {
        //changePageByPanel("viewContact");
        checkWidgetPage('viewInsuranceContact', visitedPageList);
    });

    $(".menu-btn .insuranceMenu").on("click", function() {
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