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
var expiredTime = 1;
var buArrIndex,csdArrIndex;
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

    //credit memo included
    $('#memoBtn').on('click', function(){
    	if(switchState == false){
    		$('#memoBtn').attr('src', 'img/switch_b.png');
    		
    		chartColumnLandscape.update({
				title: {
					text: 'Overdue Trend in Last 6 weeks'
				}
			});
			
    		switchState = true;
			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();
			setTimeout(function(){
				//设置CSD数据
				setCsdOverdueDetailData(facility);
				setCsdAreaData();
				csdSingleListBtn();
			}, 300);
			
    	}
    	else{
    		$('#memoBtn').attr('src', 'img/switch_g.png');
    		
			chartColumnLandscape.update({
				title: {
					text: 'Total AR and Overdue Amount'
				}
			});
			
			switchState = false;
			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();
			setTimeout(function(){
				//设置CSD数据
				setCsdOverdueDetailData(facility);
				setCsdAreaData();
				csdSingleListBtn();
			}, 300);
			
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
    		
    		for(var i in buOverdueDetail){
    			buOverdueDetail[i]["Header"]["SPREAD"] = 1;
    			
    		}
    		
    		if(buColumnCheckAll == false){
    			loadingMask("show");
    			setAllColumnData('bu');
    			loadingMask("hide");
    			buColumnCheckAll = true;
    		}
    		

    	}else{
    		$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.buSingleListBtn').attr('src', 'img/list_down.png');
    		$('.bu-single-list').hide();
    		$('.bu-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
    		for(var i in buOverdueDetail){
    			buOverdueDetail[i]["Header"]["SPREAD"] = 0;
    		}
    		
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
    		
    		for(var i in csdOverdueDetail){
    			csdOverdueDetail[i]["Header"]["SPREAD"] = 1;
    			
    		}
    		
    		if(csdColumnCheckAll == false){
    			loadingMask("show");
    			setAllColumnData('csd');
    			loadingMask("hide");
    			csdColumnCheckAll = true;
    		}
    		

    	}else{
    		$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_down.png');
    		$('.csd-single-list').hide();
    		$('.csd-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
    		for(var i in csdOverdueDetail){
    			csdOverdueDetail[i]["Header"]["SPREAD"] = 0;
    		}
    		
    	}

    });

	//sort
	$('#buOverdueSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			buOverdueDetail.sort(compareSmallOverdue("Header", "CUSTOMER"));
			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();
			$(this).attr('src', 'img/priority_down.png');
			
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			buOverdueDetail.sort(compareLargeOverdue("Header" ,"CUSTOMER"));
			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();
			$(this).attr('src', 'img/priority_up.png');
			
		}
	});
	
	$('#buOverdueSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			if(switchState == false){
				buOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_INV"));
			}
			else{
				buOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_CM"));
			}
			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();
			$(this).attr('src', 'img/priority_down.png');
			
			
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			if(switchState == false){
				buOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_INV"));
			}
			else{
				buOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_CM"));
			}
			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();
			$(this).attr('src', 'img/priority_up.png');
			
				
		}
	});
	
	$('#csdOverdueSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			csdOverdueDetail.sort(compareSmallOverdue("Header", "CUSTOMER"));
			setCsdOverdueDetailData(facility);	
			setCsdAreaData();
			csdSingleListBtn();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			csdOverdueDetail.sort(compareLargeOverdue("Header", "CUSTOMER"));
			setCsdOverdueDetailData(facility);	
			setCsdAreaData();
			csdSingleListBtn();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#csdOverdueSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			if(switchState == false){
				csdOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_INV"));
			}
			else{
				csdOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_CM"));
			}
			setCsdOverdueDetailData(facility);	
			setCsdAreaData();
			csdSingleListBtn();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			if(switchState == false){
				csdOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_INV"));
			}
			else{
				csdOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_CM"));
			}
			setCsdOverdueDetailData(facility);	
			setCsdAreaData();
			csdSingleListBtn();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#buOverdueSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			buOutstand.sort(compareSmallOverdueSoon("CUSTOMER"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			buOutstand.sort(compareLargeOverdueSoon("CUSTOMER"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#buOverdueSoonSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			buOutstand.sort(compareSmallOverdueSoon("DUE_SOON_INV"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			buOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#csdOverdueSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			csdOutstand.sort(compareSmallOverdueSoon("CUSTOMER"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			csdOutstand.sort(compareLargeOverdueSoon("CUSTOMER"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#csdOverdueSoonSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			csdOutstand.sort(compareSmallOverdueSoon("DUE_SOON_INV"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			csdOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
			setOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#expiredSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			expiredSoon.sort(compareSmallOverdueSoon("CUSTOMER"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			expiredSoon.sort(compareLargeOverdueSoon("CUSTOMER"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#expiredSoonSortByDay').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			expiredSoon.sort(compareSmallOverdueSoon("EXPIRED_DATE"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			expiredSoon.sort(compareLargeOverdueSoon("EXPIRED_DATE"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	$('#expiredSoonSortByLimit').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			expiredSoon.sort(compareSmallOverdueSoon("CREDIT_LIIMIT"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_down.png');
				
		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			expiredSoon.sort(compareLargeOverdueSoon("CREDIT_LIIMIT"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_up.png');
				
		}
	});
	
	//监听屏幕滚动事件
	$(window).on('scroll', function(){
	   	var visibleTop = document.body.scrollTop;
	   	var visibleHeight = document.body.clientHeight;
	   	var visibleBottom = document.body.clientHeight + visibleTop;  	
	   	//console.log("top:"+visibleTop+" ,bottom:"+visibleBottom);
		
		//竖转横之前，获取横屏显示数据的index
	   	for(var i in buOverdueDetail){
	   		if(buOverdueDetail[i]["Header"]["SPREAD"] == 1){	   	
	   			var top1 = $('#buShowList'+i).offset().top;
		   		var bottom1 = $('#buShowList'+i).offset().top + $('#buHideList'+i).height() + $('#buShowList'+i).height();
		   		
		   		//完全在可视区域内
	   			if(top1 >= visibleTop && bottom1 <= visibleBottom){
	   				buArrIndex = i;
	   				return false;		
	   			}
	   			//上部在可视区域内
	   			else if(top1 < visibleTop && bottom1 > visibleTop){
	   				buArrIndex = i;
	   				return false;	
	   			}
	   			//下部在可视区域
	   			else if(top1 < visibleBottom && bottom1 > visibleBottom){
	   				buArrIndex = i;
	   				return false;
	   			}
	   			else{
	   				buArrIndex = undefined;
	   				return false;
	   			}
	   		}
	   	}
	   	
	   	for(var i in csdOverdueDetail){
	   		if(csdOverdueDetail[i]["Header"]["SPREAD"] == 1){	   	
	   			var top1 = $('#csdShowList'+i).offset().top;
		   		var bottom1 = $('#csdShowList'+i).offset().top + $('#csdHideList'+i).height() + $('#csdShowList'+i).height();
		   		
		   		//完全在可视区域内
	   			if(top1 >= visibleTop && bottom1 <= visibleBottom){
	   				csdArrIndex = i;
	   				return false;		
	   			}
	   			//上部在可视区域内
	   			else if(top1 < visibleTop && bottom1 > visibleTop){
	   				csdArrIndex = i;
	   				return false;	
	   			}
	   			//下部在可视区域
	   			else if(top1 < visibleBottom && bottom1 > visibleBottom){
	   				csdArrIndex = i;
	   				return false;
	   			}	
	   		}
	   	}

	   

	   	
	   	
	   	
	   	
	   	
	});
	
});


var compareSmallOverdue = function (prop1, prop2) {
    return function (obj1, obj2) {
        var val1 = obj1[prop1][prop2];
        var val2 = obj2[prop1][prop2];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
}

var compareLargeOverdue = function (prop1, prop2) {
    return function (obj1, obj2) {
        var val1 = obj1[prop1][prop2];
        var val2 = obj2[prop1][prop2];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
    } 
}

var compareSmallOverdueSoon = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
}

var compareLargeOverdueSoon = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
    } 
}


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

function isVisible($node){
    var winH = $(window).height();
    var scrollTop = $(window).scrollTop();
    var offSetTop = $node.offSet().top;
    
    if (offSetTop < winH + scrollTop) {
        return true;
    } else {
        return false;
    }
}


//监听横竖屏切换事件
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
        	console.log(buArrIndex);
    		if(buArrIndex !== undefined){       			
        		getLandscapeColumn(false);	
        	}
    		zoomInChartByColumn();
    		$('#viewDetail-hc-column-landscape').show();
	        	
        
        	
        }
    }
}, false);
