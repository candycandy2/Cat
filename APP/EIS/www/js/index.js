/*global variable, function*/
var initialAppName = "EIS";
var appKeyOriginal = "appeis";
var appKey = "appeis";
var pageList = ["viewHitRate", "viewMonthlyHitRate", "viewYTDHitRate"];
var appSecretKey = "af8973de05c940f98a2c5e20b2ba649b";
var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="background-color:#cecece; box-shadow:0 0 0;">'
        +   '<div id="panel-header">'
        +       '<span class="panel-text" style="line-height:7.5VH;">Sales Analysis</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewHitRate">'
        +       '<span class="panel-text" style="line-height:7.5VH;">Hit Rate</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewMonthlyHitRate">'
        +       '<span class="panel-text" style="line-height:7.5VH;">Monthly Hit Rate Trend</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewYTDHitRate">'
        +       '<span class="panel-text" style="line-height:7.5VH;">YTD Hit Rate Trend</span>'
        +   '</div>'
        +'</div>';
var time = new Date(Date.now());
var monTable = {
    '1' : "Jan.",
    '2' : "Feb.",
    '3' : "Mar.",
    '4' : "Apr.",
    '5' : "May.",
    '6' : "Jun.",
    '7' : "Jul.",
    '8' : "Aug.",
    '9' : "Sep.",
    '10' : "Oct.",
    '11' : "Nov.",
    '12' : "Dec.",
};
var eisdata = {};
var currentYear, currentMonth, queryData, callbackData, length, thisYear, thisMonth;


$(document).one("pagebeforeshow", function() {

    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewHitRate").css("background", "#503f81");
    $("#mypanel #mypanelviewHitRate").css("color", "#fff");

    $("#mypanel #mypanelviewHitRate").on("click", function() {
        changePageByPanel("viewHitRate");
    });

    $("#mypanel #mypanelviewMonthlyHitRate").on("click", function() {
        changePageByPanel("viewMonthlyHitRate");
    });

    $("#mypanel #mypanelviewYTDHitRate").on("click", function() {
        changePageByPanel("viewYTDHitRate");
    });

    $(".menu-btn").on("click", function() {
        $("#mypanel").panel("open");
    });

    $("#viewHitRate").on("swiperight", function(event) {
        if($(".ui-page-active").jqmData("panel") !== "open"){
            $("#mypanel").panel( "open");
        }
    });
    zoomBtnInit();
});

window.initialSuccess = function() {

    loadingMask("show");
    currentYear = time.getFullYear();
    currentMonth = ((time.getMonth() + 1) < 10) ? "0"+(time.getMonth() + 1) : (time.getMonth() + 1) ;            
    queryData =   "<LayoutHeader><StartYearMonth>"
                + (currentYear - 3) + "/01"
                + "</StartYearMonth><EndYearMonth>"
                + currentYear + "/" + currentMonth
                + "</EndYearMonth></LayoutHeader>";
    ROSummary();
    $.mobile.changePage("#viewHitRate");
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if($(".ui-page-active").jqmData("panel") === "open"){
        $("#mypanel").panel( "close");
    }else{
        /*leave this app*/
    }

    // if ($("#viewHitRate-tab-1 :radio:checked").val() == "viewHitRate-tab-1") {
    //     navigator.app.exitApp();
    // } else {
    //     $("input[id=viewHitRate-tab-1]").trigger('click');
    //     $("label[for=viewHitRate-tab-1]").addClass('ui-btn-active');
    //     $("label[for=viewHitRate-tab-2]").removeClass('ui-btn-active');
    //     $("label[for=viewHitRate-tab-3]").removeClass('ui-btn-active');
    // }
}

function changePageByPanel(pageId) {
    if($.mobile.activePage[0].id !== pageId) {   
        loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
    }
    $("#mypanel").panel("close");
}

function zoomBtnInit(){
    var screenWidth = $('html').width(), screenHeight = $('html').height(), tmp = 0;
    $('.zoomInBtn').on('click', function(){
        $('body').addClass('ui-landscape');
        $('.hc-fragment').css({'height': 'auto'});
        $('.zoomBtn').css({'right': -(screenHeight-$('.chartArea').width()-$('.viewIndex').css('padding-top').replace('px', '')-
            $('.viewIndex').css('padding-bottom').replace('px', ''))/$('.chartArea').width()*100 + '%'});
        chart.legend.update({ itemStyle: {fontSize: 14}});
        chart.setSize(screenHeight*0.9, screenWidth*0.85, doAnimation = true);
    });
    $('.zoomOutBtn').on('click', function(){
        $('body').removeClass('ui-landscape');
        $('.hc-fragment').css({'height': '38vh'});
        $('.zoomBtn').css({'right': '4%'});
        chart.legend.update({ itemStyle: {fontSize: 12}});
        chart.setSize($('.hc-fragment').width(), $('.hc-fragment').height(), doAnimation = true);        
    });
}