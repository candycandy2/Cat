/*******************global variable function*****************/
var chartbubble,chartLandscapebubble,chartRect,chartLandscapeRect;
var buChartArea1,buChartArea2,buChartArea3,buChartArea4;
var csdChartArea1,csdChartArea2,csdChartArea3,csdChartArea4;
var buChartColumn1,buChartColumn2,buChartColumn3,buChartColumn4;
var csdChartColumn1,csdChartColumn2,csdChartColumn3,csdChartColumn4;
var hcHidden = false;
var overviewRectState = false;
var ytdStrExist = false;
var lastPageID = "viewMain";
var pageList = ["viewMain", "viewDetail"];
var htmlContent = "";

var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="background-color:#cecece; box-shadow:0 0 0;">'
        +   '<div id="panel-header">'
        +       '<span class="panel-text">AR Overdue Analysis</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewMain">'
        +       '<span class="panel-text">&nbsp;&nbsp;AR Overdue Overview</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewDetail">'
        +       '<span class="panel-text">&nbsp;&nbsp;AR Overdue Detail</span>'
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
    
    $("#viewDetail").on("swiperight", function(event) {
        if($(".ui-page-active").jqmData("panel") !== "open" && (window.orientation === 180 || window.orientation === 0)) {
            $("#mypanel").panel( "open");
        }
    });
    
    //backkey from treemap to bubble
    $('#backBtn').on("click", function(){
    	$('#overview-hc-rectangle-landscape').hide();
    	$('#backBtn').hide();
    	$('#overview-hc-bubble-landscape').show();	
    });
    
    //open and close credit memo
    $('#memoBtn').on('click', function(){
    	var flag = $('#memoBtn').attr('src');
    	if(flag === 'img/switch_g.png'){
    		$('#memoBtn').attr('src', 'img/switch_b.png');
    		
    		
    	}else{
    		$('#memoBtn').attr('src', 'img/switch_g.png');
    		
    		
    	}
    	
    });
    
    //BU allList btn
    $('#buAllListBtn').on('click', function(){
    	var flag = $('#buAllListBtn').attr('src');
    	if(flag === 'img/all_list_down.png'){
    		$('#buAllListBtn').attr('src', 'img/all_list_up.png');
    		$('.buSingleListBtn').attr('src', 'img/list_up.png');
    		$('.bu-single-list').show();
    		
    	}else{
    		$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.buSingleListBtn').attr('src', 'img/list_down.png');
    		$('.bu-single-list').hide();
    	}
    	
    });
    
    //CSD allList btn
    $('#csdAllListBtn').on('click', function(){
    	var flag = $('#csdAllListBtn').attr('src');
    	if(flag === 'img/all_list_down.png'){
    		$('#csdAllListBtn').attr('src', 'img/all_list_up.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_up.png');
    		$('.csd-single-list').show();
    		
    	}else{
    		$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_down.png');
    		$('.csd-single-list').hide();
    	}
    	
    });
    
	//buSingleListBtn
	$('.buSingleListBtn').on('click', function(){
		var self = $(this);
		if(self.attr('src') === 'img/list_down.png'){
			self.attr('src', 'img/list_up.png');
			self.parent().parent().parent().next().show();
			self.parent().parent().parent().next().attr('border-bottom', '1px solid #D6D6D6');
			self.parent().parent().parent().attr('border-bottom', 'none');
			
		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
		}
		
		if($('.buSingleListBtn[src="img/list_down.png"]').length === 3){
			$('#buAllListBtn').attr('src', 'img/all_list_down.png');
		}
		
		if($('.buSingleListBtn[src="img/list_up.png"]').length === 3){
			$('#buAllListBtn').attr('src', 'img/all_list_up.png');
		}
		
	});
	
	//csdSingleListBtn
	$('.csdSingleListBtn').on('click', function(){
		var self = $(this);
		if(self.attr('src') === 'img/list_down.png'){
			self.attr('src', 'img/list_up.png');
			self.parent().parent().parent().next().show();
			self.parent().parent().parent().next().attr('border-bottom', '1px solid #D6D6D6');
			self.parent().parent().parent().attr('border-bottom', 'none');
			
		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
		}
		
		if($('.csdSingleListBtn[src="img/list_down.png"]').length === 3){
			$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
		}
		
		if($('.csdSingleListBtn[src="img/list_up.png"]').length === 3){
			$('#csdAllListBtn').attr('src', 'img/all_list_up.png');
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
            zoomOutChart("viewMain-hc-canvas"); 
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
        chartLandscapeRect.setSize(screen.height, screen.width*0.9, false);
    }else {
        chartLandscapebubble.setSize(screen.width, screen.height*0.9, false);
        chartLandscapeRect.setSize(screen.width, screen.height*0.9, false);
    }
}

//根据panel更换page
function changePageByPanel(pageId) {
    if($.mobile.activePage[0].id !== pageId) {
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
    	//viewMain
    	chartbubble.tooltip.hide();
       	chartRect.tooltip.hide();
       	chartLandscapebubble.tooltip.hide();
        chartLandscapeRect.tooltip.hide();
		$('#overview-hc-bubble-landscape').hide();
		$('#overview-hc-rectangle-landscape').hide();
		$('#backBtn').hide();
        
    }
    if(window.orientation === 90 || window.orientation === -90 ) {
    	//viewMain
        zoomInChart();
        chartbubble.tooltip.hide();
       	chartRect.tooltip.hide();
        chartLandscapebubble.tooltip.hide();
        chartLandscapeRect.tooltip.hide();
        $('#overview-hc-rectangle').hide();
		$('#overview-hc-bubble-landscape').show();
          
        
    }
}, false);















