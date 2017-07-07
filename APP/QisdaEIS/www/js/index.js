/*******************global variable function*****************/
var chartbubble,chartLandscapebubble,chartRect,chartLandscapeRect;
var hcHidden = false;
var overviewRectState = false;
var ytdStrExist = false;
var lastPageID = "viewMain";
var pageList = ["viewMain", "viewDetail"];
var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="background-color:#cecece; box-shadow:0 0 0;">'
        +   '<div id="panel-header">'
        +       '<span class="panel-text" style="line-height:7.5VH;">AR Overdue Analysis</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewMain">'
        +       '<span class="panel-text" style="line-height:7.5VH;">&nbsp;&nbsp;AR Overdue Overview</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewDetail">'
        +       '<span class="panel-text" style="line-height:7.5VH;">&nbsp;&nbsp;AR Overdue Detail</span>'
        +   '</div>'
        +'</div>';


$(document).one('pagebeforeshow', function(){
	$.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewMain").css("background", "#503f81");
    $("#mypanel #mypanelviewMain").css("color", "#fff");

    $("#mypanel #mypanelviewMain").on("click", function() {
        changePageByPanel("viewMain");
    });

    $("#mypanel #mypanelviewDetail").on("click", function() {
        changePageByPanel("viewDetail");
    });

    $(".menu-btn").on("click", function() {
        $("#mypanel").panel("open");
    });

    $("#viewMain").on("swiperight", function(event) {
        if($(".ui-page-active").jqmData("panel") !== "open" && (window.orientation === 180 || window.orientation === 0)) {
            $("#mypanel").panel( "open");
        }
    });
	
});


//[Android]Handle the back button
function onBackKeyDown() {
	var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;
    if(activePageID == "viewMain") {
        if($("body").hasClass("ui-landscape")) {
            /*** Zoom Out the chart ***/
            zoomOutChart("overview-hc-bubble"); 
        }else{
            /*** change tab and close the panel ***/
            if($(".ui-page-active").jqmData("panel") === "open") {
                $("#mypanel").panel( "close");
            }else if($("#viewMain :radio:checked").val() == "viewMain-tab-1") {
                navigator.app.exitApp();
            }else if($("#viewMain :radio:checked").val() == "viewMain-tab-2") {
                $("input[id=viewMain-tab-1]").trigger('click');
                $("label[for=viewMain-tab-1]").addClass('ui-btn-active');
                $("label[for=viewMain-tab-2]").removeClass('ui-btn-active');
            }
        }
    }
    
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
    	$('#overview-hc-rectangle').hide();
        zoomInChart();
        overviewRectState = false;
        //$(".YTD-Str").css("display", "none");
        
    }
}, false);















