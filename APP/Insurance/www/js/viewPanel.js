
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay">'
        +   '<div class="ios-fix-overlap-div"></div>'
        +   '<div class="panel-content" id="mypanelviewMain">'
        //+       '<span class="panel-text">保險概要</span>'
        +       '<span class="panel-text">' + langStr["str_050"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewPersonalInsurance">'
        //+       '<span class="panel-text">個人保險概要</span>'
        +       '<span class="panel-text">' + langStr["str_051"] + '</span>'
        +   '</div>'   
        +   '<div class="panel-content" id="mypanelviewFamilyData">'
        //+       '<span class="panel-text">眷屬資料維護</span>'
        +       '<span class="panel-text">' + langStr["str_052"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewContact">'
        //+       '<span class="panel-text">服務窗口</span>'
        +       '<span class="panel-text">' + langStr["str_053"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewInsuranceInfo">'
        //+       '<span class="panel-text">保險小常識</span>'
        +       '<span class="panel-text">' + langStr["str_054"] + '</span>'
        +   '</div>'
        +'</div>'
        +'<div class="page-mask" style="display: none;"></div>';

$(document).one("pagebeforeshow", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewMain").css("background", "#503f81");
    $("#mypanel #mypanelviewMain").css("color", "#fff");

    if (device.platform === "iOS") {
        $("#mypanelviewMain").css("margin-top", "20px");
        $(".page-mask").css("top", "20px");
    }

    $("#mypanel #mypanelviewMain").on("click", function() {
        changePageByPanel("viewMain");
    });

    /*$("#mypanel #mypanelviewPersonalInsurance").on("click", function() {
        editLeaveForm = false; 
        changePageByPanel("viewPersonalInsurance");
    });

    $("#mypanel #mypanelviewFamilyData").on("click", function() {
        changePageByPanel("viewFamilyData");
    });*/

    $("#mypanel #mypanelviewContact").on("click", function() {
        changePageByPanel("viewContact");
    });

    $("#mypanel #mypanelviewInsuranceInfo").on("click", function() {
        changePageByPanel("viewInsuranceInfo");
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
