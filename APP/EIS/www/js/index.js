/*global variable, function*/
var currentYear, currentMonth, queryData, productDetailQueryData, roSummaryCallBackData, userAuthorityCallBackData, productDetailCallBackData, length, thisYear, thisMonth;
var options, chart, chartLandscape;
var lastPageID = "viewHitRate";
var monthlyPageDateList = "";
var ytdPageDateList = "";
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
var monthlyPageDate = [];
var ytdPageDate = [];
var eisdata = {};
var hitRateEisData = {};
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

var hcTable = {
    '1' : "Jan",
    '2' : "Feb",
    '3' : "Mar",
    '4' : "Apr",
    '5' : "May",
    '6' : "Jun",
    '7' : "Jul",
    '8' : "Aug",
    '9' : "Sep",
    '10' : "Oct",
    '11' : "Nov",
    '12' : "Dec",
};

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
        if($(".ui-page-active").jqmData("panel") !== "open" && (window.orientation === 180 || window.orientation === 0)) {
            $("#mypanel").panel( "open");
        }
    });
});

window.initialSuccess = function() {
    
    currentYear = time.getFullYear();
    currentMonth = ((time.getMonth() + 1) < 10) ? "0"+(time.getMonth() + 1) : (time.getMonth() + 1);
    loadingMask("show");
    queryData =   "<LayoutHeader><StartYearMonth>"
                + (currentYear - 3) + "/01"
                + "</StartYearMonth><EndYearMonth>"
                + currentYear + "/" + currentMonth
                + "</EndYearMonth></LayoutHeader>";
    ROSummary();
    $.mobile.changePage("#viewHitRate");

    // for(var i=0; i<=3; i++) {
    //     var maxMonth = (i == 0) ? Number(currentMonth) : 12;
    //     for(var j=maxMonth; j>0; j--) {
    //         j = (j < 10) ? "0"+j : j;
    //         productDetailQueryData = "<LayoutHeader><StartYearMonth>"
    //                     + (currentYear - i) + "/" + j
    //                     + "</StartYearMonth><EndYearMonth>"
    //                     + (currentYear - i) + "/" + j
    //                     + "</EndYearMonth></LayoutHeader>";
    //         ProductDetail();
    //     }
    // }    
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;
    if(activePageID == "viewHitRate") {
        if($("body").hasClass("ui-landscape")) {
            /*** Zoom Out the chart ***/
            zoomOutChart("viewHitRate-hc-canvas"); 
        }else{
            /*** change tab and close the panel ***/
            if($(".ui-page-active").jqmData("panel") === "open") {
                $("#mypanel").panel( "close");
            }else if($("#viewHitRate :radio:checked").val() == "viewHitRate-tab-1") {
                navigator.app.exitApp();
            }else if($("#viewHitRate :radio:checked").val() == "viewHitRate-tab-2") {
                $("input[id=viewHitRate-tab-1]").trigger('click');
                $("label[for=viewHitRate-tab-1]").addClass('ui-btn-active');
                $("label[for=viewHitRate-tab-2]").removeClass('ui-btn-active');
                $("label[for=viewHitRate-tab-3]").removeClass('ui-btn-active'); 
            }else if($("#viewHitRate :radio:checked").val() == "viewHitRate-tab-3") {
                $("input[id=viewHitRate-tab-2]").trigger('click');
                $("label[for=viewHitRate-tab-2]").addClass('ui-btn-active');
                $("label[for=viewHitRate-tab-1]").removeClass('ui-btn-active');
                $("label[for=viewHitRate-tab-3]").removeClass('ui-btn-active');
            }
        }
    }else if(activePageID == "viewMonthlyHitRate") {
        if($("body").hasClass("ui-landscape")) {
            /*** Zoom Out the chart ***/
            zoomOutChart("viewMonthlyHitRate-hc-canvas");
        }else{
            /*** change tab and close the panel ***/
            if($(".ui-page-active").jqmData("panel") === "open") {
                $("#mypanel").panel( "close");  
            }else if($("#viewMonthlyHitRate :radio:checked").val() == "viewMonthlyHitRate-tab-1") {
                changePageByPanel(lastPageID);
            }else if($("#viewMonthlyHitRate :radio:checked").val() == "viewMonthlyHitRate-tab-2") {
                $("input[id=viewMonthlyHitRate-tab-1]").trigger('click');
                $("label[for=viewMonthlyHitRate-tab-1]").addClass('ui-btn-active');
                $("label[for=viewMonthlyHitRate-tab-2]").removeClass('ui-btn-active');
                $("label[for=viewMonthlyHitRate-tab-3]").removeClass('ui-btn-active'); 
            }else if($("#viewMonthlyHitRate :radio:checked").val() == "viewMonthlyHitRate-tab-3") {
                $("input[id=viewMonthlyHitRate-tab-2]").trigger('click');
                $("label[for=viewMonthlyHitRate-tab-2]").addClass('ui-btn-active');
                $("label[for=viewMonthlyHitRate-tab-1]").removeClass('ui-btn-active');
                $("label[for=viewMonthlyHitRate-tab-3]").removeClass('ui-btn-active');
            }
        }
    }else if(activePageID == "viewYTDHitRate") {
        if($("body").hasClass("ui-landscape")) {
            /*** Zoom Out the chart ***/
            zoomOutChart("viewYTDHitRate-hc-canvas");  
        }else{
            /*** change tab and close the panel ***/
            if($(".ui-page-active").jqmData("panel") === "open") {
                $("#mypanel").panel( "close");
            }else if($("#viewYTDHitRate :radio:checked").val() == "viewYTDHitRate-tab-1") {
                changePageByPanel(lastPageID);
            }else if($("#viewYTDHitRate :radio:checked").val() == "viewYTDHitRate-tab-2") {
                $("input[id=viewYTDHitRate-tab-1]").trigger('click');
                $("label[for=viewYTDHitRate-tab-1]").addClass('ui-btn-active');
                $("label[for=viewYTDHitRate-tab-2]").removeClass('ui-btn-active');
                $("label[for=viewYTDHitRate-tab-3]").removeClass('ui-btn-active'); 
            }else if($("#viewYTDHitRate :radio:checked").val() == "viewYTDHitRate-tab-3") {
                $("input[id=viewYTDHitRate-tab-2]").trigger('click');
                $("label[for=viewYTDHitRate-tab-2]").addClass('ui-btn-active');
                $("label[for=viewYTDHitRate-tab-1]").removeClass('ui-btn-active');
                $("label[for=viewYTDHitRate-tab-3]").removeClass('ui-btn-active');
            }
        }
    }
}

function changePageByPanel(pageId) {
    if($.mobile.activePage[0].id !== pageId) {
        loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        lastPageID = $.mobile.activePage[0].id;
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
    }
    $("#mypanel").panel("close");
}

function formatNumber(n) {
    n += "";
    var arr = n.split(".");
    var regex = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(regex, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
}

window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
    if($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel( "close");
    }
    // portraint
    // if (window.orientation === 180 || window.orientation === 0) {
    // }
    // landscape
    if(window.orientation === 90 || window.orientation === -90 ) {
        zoomInChart();
    }
}, false);

function zoomInChart() {
    chart.legend.update({itemStyle: {fontSize: 14}});
    if(screen.width < screen.height) {
        chartLandscape.setSize(screen.height, screen.width*0.8, false);
    }else {
        chartLandscape.setSize(screen.width, screen.height*0.8, false);
    }
}