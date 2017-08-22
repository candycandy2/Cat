/*******************global variable function*****************/
var chartbubble,chartLandscapebubble,chartRect,chartLandscapeRect;
var buChartArea1,buChartArea2,buChartArea3,buChartArea4;
var csdChartArea1,csdChartArea2,csdChartArea3,csdChartArea4;
var buChartColumn1,buChartColumn2,buChartColumn3,buChartColumn4;
var csdChartColumn1,csdChartColumn2,csdChartColumn3,csdChartColumn4;
var chartColumnLandscape = null;
var currentYear, currentMonth, currentDate;
var length,thisYear,thisMonth;
var ARSummaryQueryData,OverdueDetailQueryData,OutstandDetailQueryData,CreditExpiredSoonQueryData;
var arSummaryCallBackData,overdueDetailCallBackData,outstandDetailCallBackData,creditExpiredSoonCallBackData,araUserAuthorityCallBackData;
var treemapState = false;
var switchState = false;
var thisMonthExpiredTime = 1;
var AraUserAuthorityQueryData = "<LayoutHeader><Account>Alex.Chang</Account></LayoutHeader>";
//var AraUserAuthorityQueryData = "<LayoutHeader><Account>Alan.Chen</Account></LayoutHeader>";
var lastPageID = "viewMain";
var pageList = ["viewMain", "viewDetail"];
var initialAppName = "QisdaEIS";
var appKeyOriginal = "appqisdaeis";
var appKey = "appqisdaeis";
var appSecretKey = "b383e7bdeea5e91eb4223602a9df2f05";
var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" data-position-fixed="true" style="background-color:#cecece; box-shadow:0 0 0;">'
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
var time = new Date(Date.now());
var nowTime = new Date();

window.initialSuccess = function() {
	currentYear = time.getFullYear();
    currentDate = time.getDate();
    currentMonth = ((time.getMonth() + 1) < 10) ? "0"+(time.getMonth() + 1) : (time.getMonth() + 1);
    if(currentDate == 1) {
        currentMonth = currentMonth - 1;
    }
    
    loadingMask("show");
    ARSummaryQueryData =   "<LayoutHeader><StartYearMonth>"
                        + (currentYear - 3) + "/01"
                        + "</StartYearMonth><EndYearMonth>"
                        + currentYear + "/" + currentMonth
                        + "</EndYearMonth></LayoutHeader>";                   
    console.log(ARSummaryQueryData);
    
    ARSummary();//support lifecycle
    AraUserAuthority();
    $.mobile.changePage("#viewMain");
}

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

    //backkey from treemap to bubble
    $('#backBtn').on("click", function(){
    	$('#overview-hc-rectangle-landscape').hide();
    	$('#backBtn').hide();
    	$('#overview-hc-bubble-landscape').show();
    });

    //open or close credit memo
    $('#memoBtn').on('click', function(){
    	if(switchState == false){
    		$('#memoBtn').attr('src', 'img/switch_b.png');
    		
    		chartColumnLandscape.update({
				title: {
					text: 'Overdue Trend in Last 6 weeks'
				}
			});
			
    		switchState = true;
			getOverdueDetailData(facility);
			clickSingleListBtn();
			setAllAreaData();
    	}
    	else{
    		$('#memoBtn').attr('src', 'img/switch_g.png');
    		
			chartColumnLandscape.update({
				title: {
					text: 'Total AR and Overdue Amount'
				}
			});
			
			switchState = false;
			getOverdueDetailData(facility);
			clickSingleListBtn();
			setAllAreaData();
    	}

    });

    //BU allList btn
    $('#buAllListBtn').on('click', function(){
    	var flag = $('#buAllListBtn').attr('src');
    	if(flag === 'img/all_list_down.png'){
    		$('#buAllListBtn').attr('src', 'img/all_list_up.png');
    		$('.buSingleListBtn').attr('src', 'img/list_up.png');
    		$('.bu-single-list').show();
    		$('.bu-single-list').prev().css('border-bottom', '1px solid white');
    		
    		if(buColumnCheckAll == false){
    			loadingMask("show");
    			setAllColumnData('bu');
    			loadingMask("hide");
    		}
    		

    	}else{
    		$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.buSingleListBtn').attr('src', 'img/list_down.png');
    		$('.bu-single-list').hide();
    		$('.bu-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
    	}

    });

    //CSD allList btn
    $('#csdAllListBtn').on('click', function(){
    	var flag = $('#csdAllListBtn').attr('src');
    	if(flag === 'img/all_list_down.png'){
    		$('#csdAllListBtn').attr('src', 'img/all_list_up.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_up.png');
    		$('.csd-single-list').show();
    		$('.csd-single-list').prev().css('border-bottom', '1px solid white');
    		
    		if(csdColumnCheckAll == false){
    			loadingMask("show");
    			setAllColumnData('csd');
    			loadingMask("hide");
    		}
    		

    	}else{
    		$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_down.png');
    		$('.csd-single-list').hide();
    		$('.csd-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
    	}

    });

	//sort
	$('#buOverdueSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
			
			
			
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
			
			
			
			
		}
	});
	
	$('#buOverdueSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
			
			
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
			
				
		}
	});
	
	$('#csdOverdueSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#csdOverdueSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#buOverdueSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#buOverdueSoonSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#csdOverdueSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#csdOverdueSoonSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#expiredSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#expiredSoonSortByDay').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#expiredSoonSortByLimit').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			$(this).attr('src', 'img/priority_up.png');
				
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
            }else if(treemapState === true){
            	$('#overview-hc-rectangle-landscape').hide();
            	$('#backBtn').hide();
            	$('#overview-hc-bubble-landscape').show();
            	treemapState = false;
            }else if($("#viewMain :radio:checked").val() == "viewMain-tab-1") {
                navigator.app.exitApp();
            }else if($("#viewMain :radio:checked").val() == "viewMain-tab-2") {
                $("input[id=viewMain-tab-1]").trigger('click');
                $("label[for=viewMain-tab-1]").addClass('ui-btn-active');
                $("label[for=viewMain-tab-2]").removeClass('ui-btn-active');
            }
        }
    }else if(activePageID == "viewDetail") {
        if($("body").hasClass("ui-landscape")) {
            /*** Zoom Out the chart ***/
            zoomOutChart("viewDetail-hc-canvas");
        }else{
            /*** change tab and close the panel ***/
            if($(".ui-page-active").jqmData("panel") === "open") {
                $("#mypanel").panel( "close");
            }else if($("#viewDetail :radio:checked").val() == "viewDetail-tab-1") {
                changePageByPanel(lastPageID);
            }else if($("#viewDetail :radio:checked").val() == "viewDetail-tab-2") {
                $("input[id=viewDetail-tab-1]").trigger('click');
                $("label[for=viewDetail-tab-1]").addClass('ui-btn-active');
                $("label[for=viewDetail-tab-2]").removeClass('ui-btn-active');
                $("label[for=viewDetail-tab-3]").removeClass('ui-btn-active');
            }else if($("#viewDetail :radio:checked").val() == "viewDetail-tab-3") {
                $("input[id=viewDetail-tab-2]").trigger('click');
                $("label[for=viewDetail-tab-2]").addClass('ui-btn-active');
                $("label[for=viewDetail-tab-1]").removeClass('ui-btn-active');
                $("label[for=viewDetail-tab-3]").removeClass('ui-btn-active');
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

function zoomInChartByTreemap(){
	if(screen.width < screen.height) {
        chartLandscapeRect.setSize(screen.height, screen.width*0.84, false);
   	}else {
        chartLandscapeRect.setSize(screen.width, screen.height*0.84, false);
    }
}

function zoomInChartByColumn(){
	if(screen.width < screen.height) {
        chartColumnLandscape.setSize(screen.height, screen.width*0.93, false);
   	}else {
        chartColumnLandscape.setSize(screen.width, screen.height*0.93, false);
    }
}

function changeFontColor(num){
	if(num <= 0){
		$('#moneyOverdue').css('color', '#ec3a24');
	}else{
		$('#moneyOverdue').css('color', '#323232');
	}
}

//参数n必须为number类型
function formatNumber(n) {
    n += "";
    var arr = n.split(".");
    var regex = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(regex, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
}


function changePageByPanel(pageId) {
	window.firstClick = true;

	if(device.platform === "Android"){
		$.mobile.defaultPageTransition = 'fade';
	}else if(device.platform === "iOS"){
		$.mobile.defaultPageTransition = 'none';
	}

    if($.mobile.activePage[0].id !== pageId) {
    	loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        lastPageID = $.mobile.activePage[0].id;
        
        $.mobile.changePage("#" + pageId);

        if(firstClick){
        	firstClick = false;
        	$.mobile.defaultPageTransition = 'fade';
        }

        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
    }
    $("#mypanel").panel("close");
}

function changePageInitViewDetail(){
	$("label[for=viewDetail-tab-1]").addClass('ui-btn-active');
    $("label[for=viewDetail-tab-2]").removeClass('ui-btn-active');
    $("label[for=viewDetail-tab-3]").removeClass('ui-btn-active');
    
	$('#memoBtn').attr('src', 'img/switch_g.png');
	$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    $('.buSingleListBtn').attr('src', 'img/list_down.png');
    $('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    $('.csdSingleListBtn').attr('src', 'img/list_down.png');
    $('.bu-single-list').hide();
    $('.csd-single-list').hide();
    
    $('#overdueSoon').hide();
	$('#expiredSoon').hide();
	$('#overdue').show();
	
    $(".Facility #" + facility).parent('.scrollmenu').find('.hover').removeClass('hover');
    $(".Facility #ALL").removeClass('disableHover');
    $(".Facility #ALL").addClass('hover');
}


//横竖屏切换
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
	
    if($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel( "close");
    }
    if(window.orientation === 180 || window.orientation === 0) {
    	if($.mobile.activePage[0].id === 'viewMain'){
    		$('#overview-hc-bubble-landscape').hide();
			$('#overview-hc-rectangle-landscape').hide();
			$('#backBtn').hide();
    	}else{
    		$('#viewDetail-hc-column-landscape').hide();
    		
    	}

    }
    if(window.orientation === 90 || window.orientation === -90 ) {
        if($.mobile.activePage[0].id === 'viewMain'){
        	zoomInChart();
        	$('#overview-hc-rectangle').hide();
        	$('#overview-hc-bubble-landscape').show();
        }else{
        	getLandscapeColumn(false);
			zoomInChartByColumn();
        	$('#viewDetail-hc-column-landscape').show();
        	
        }

    }
}, false);
