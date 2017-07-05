/*******************global variable function*****************/
var chartbubble,chartLandscapebubble;
var overviewRectState = false;
var ytdStrExist = false;
var lastPageID = "viewOverview";
var pageList = ["viewOverview", "viewDetail"];
var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="background-color:#cecece; box-shadow:0 0 0;">'
        +   '<div id="panel-header">'
        +       '<span class="panel-text" style="line-height:7.5VH;">AR Overdue Analysis</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewOverview">'
        +       '<span class="panel-text" style="line-height:7.5VH;">&nbsp;&nbsp;&nbsp;AR Overdue Overview</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewDetail">'
        +       '<span class="panel-text" style="line-height:7.5VH;">&nbsp;&nbsp;&nbsp;AR Overdue Detail</span>'
        +   '</div>'
        +'</div>';


$(document).one('pagebeforeshow', function(){
	$.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewOverview").css("background", "#503f81");
    $("#mypanel #mypanelviewOverview").css("color", "#fff");

    $("#mypanel #mypanelviewOverview").on("click", function() {
        changePageByPanel("viewOverview");
    });

    $("#mypanel #mypanelviewDetail").on("click", function() {
        changePageByPanel("viewDetail");
    });

    $(".menu-btn").on("click", function() {
        $("#mypanel").panel("open");
    });

    $("#viewOverview").on("swiperight", function(event) {
        if($(".ui-page-active").jqmData("panel") !== "open" && (window.orientation === 180 || window.orientation === 0)) {
            $("#mypanel").panel( "open");
        }
    });
	
});


//[Android]Handle the back button
function onBackKeyDown() {
    
}


//根据横竖屏设置图表容器大小
function zoomInChart() {
    if(screen.width < screen.height) {
        chartLandscapebubble.setSize(screen.height, screen.width*0.9, false);
    }else {
        chartLandscapebubble.setSize(screen.width, screen.height*0.9, false);
    }
}

//根据panel更换page
function changePageByPanel(pageId) {
    if($.mobile.activePage[0].id !== pageId) {
        //loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        lastPageID = $.mobile.activePage[0].id;
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
    }
    $("#mypanel").panel("close");
}

//横竖屏切换
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
    if($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel( "close");     
    }
    if(window.orientation === 180 || window.orientation === 0) {
        /*if(ytdStrExist == true) {
            $(".YTD-Str").css("display", "block");
        }*/
       	zoomInChart();
    }
    // landscape
    if(window.orientation === 90 || window.orientation === -90 ) {
        zoomInChart();
        overviewRectState = false;
        //$(".YTD-Str").css("display", "none");
    }
}, false);















