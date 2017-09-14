/*******************global variable function*****************/
var chartbubble = null,chartLandscapebubble = null;
var chartRect = null,chartLandscapeRect = null;
var chartTreemap = null,chartTreemapLandscape = null;
var chartColumnLandscape = null;
var ARSummaryQueryData,OverdueDetailQueryData,OutstandDetailQueryData,CreditExpiredSoonQueryData;
var arSummaryCallBackData,overdueDetailCallBackData,outstandDetailCallBackData,creditExpiredSoonCallBackData,araUserAuthorityCallBackData;
var treemapState = false;
var switchState = false;
var expiredTime = 1;
var visibleIndex = null;
var visibleArea = null;
var visibleMarginTop = 0;
var transTop;
var buCountNum = 1;
var buShowNum = 50;
var buPageEnd = buShowNum * buCountNum;
var buPageStart = buPageEnd - buShowNum;
var csdCountNum = 1;
var csdShowNum = 50;
var csdPageEnd = csdShowNum * csdCountNum;
var csdPageStart = csdPageEnd - csdShowNum;
var buColumnCount = 1;
var buColumnShow = 4;
var buColumnPageEnd = buColumnShow * buColumnCount;
var buColumnPageStart = buColumnPageEnd - buColumnShow;
var csdColumnCount = 1;
var csdColumnShow = 4;
var csdColumnPageEnd = csdColumnShow * csdColumnCount;
var csdColumnPageStart = csdColumnPageEnd - csdColumnShow;
//var AraUserAuthorityQueryData = "<LayoutHeader><Account>Alex.Chang</Account></LayoutHeader>";
var AraUserAuthorityQueryData;
var lastPageID = "viewMain";
var pageList = ["viewMain", "viewDetail"];
var waterMarkPageList = ["viewMain", "viewDetail"];
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
    var loginName = loginData["loginid"];
    AraUserAuthorityQueryData = "<LayoutHeader><Account>" + loginName + "</Account></LayoutHeader>";
    console.log(AraUserAuthorityQueryData);

    loadingMask("show");
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
        //第一页不用锁屏
        screen.orientation.unlock();
    });

    $("#mypanel #mypanelviewDetail").on("click", function() {
        changePageByPanel("viewDetail");
        //刚进第二页锁竖屏
        screen.orientation.lock('portrait');
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
    		switchState = true;
			
			changeSwitchInit();

    	}
    	else{
    		$('#memoBtn').attr('src', 'img/switch_g.png');
    		switchState = false;
			
    		changeSwitchInit();

    	}

    });

    //BU allList btn
    $('#buAllListBtn').on('click', function(){
    	//review by alan
    	var flag = $('#buAllListBtn').attr('src');
    	if(flag == 'img/all_list_down.png'){
    		$('#buAllListBtn').attr('src', 'img/all_list_up.png');
    		$('.buSingleListBtn').attr('src', 'img/list_up.png');
    		$('.bu-single-list[data-bu="show"]').show();
    		$('.bu-single-list').prev().css('border-bottom', '1px solid white');
    		buColumnCheckAll = true;
			
    		if(facility == "ALL"){
    			for(var i in buOverdueDetail){
	    			buOverdueDetail[i]["Header"]["SPREAD"] = 1;
	    		}
    		}
    		else{
    			for(var i in otherBuOverdueDetail){
    				otherBuOverdueDetail[i]["Header"]["SPREAD"] = 1;
    				setSingleColumnData(i, 'bu');
    			}
    		}
    		
    		checkIndexWhetherInVisible();
			
    	}
    	else{
    		$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.buSingleListBtn').attr('src', 'img/list_down.png');
    		$('.bu-single-list').hide();
    		$('.bu-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
			
    		if(facility == "ALL"){
    			for(var i in buOverdueDetail){
	    			buOverdueDetail[i]["Header"]["SPREAD"] = 0;
	    		}
    		}
    		else{
    			for(var i in otherBuOverdueDetail){
    				otherBuOverdueDetail[i]["Header"]["SPREAD"] = 0;
    			}
    		}
    		
    		checkIndexWhetherInVisible();

    	}

    });

    //CSD allList btn
    $('#csdAllListBtn').on('click', function(){
    	//review by alan
    	var flag = $('#csdAllListBtn').attr('src');
    	if(flag === 'img/all_list_down.png'){
    		$('#csdAllListBtn').attr('src', 'img/all_list_up.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_up.png');
    		$('.csd-single-list[data-csd="show"]').show();
    		$('.csd-single-list').prev().css('border-bottom', '1px solid white');
    		csdColumnCheckAll = true;
			
    		if(facility == "ALL"){
    			for(var i in csdOverdueDetail){
	    			csdOverdueDetail[i]["Header"]["SPREAD"] = 1;
	    		}
    		}
    		else{
    			for(var i in otherCsdOverdueDetail){
    				otherCsdOverdueDetail[i]["Header"]["SPREAD"] = 1;
    				setSingleColumnData(i, 'csd');

    			}
    		}
    		
    		checkIndexWhetherInVisible();
    		
    	}
    	else{
    		$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_down.png');
    		$('.csd-single-list').hide();
    		$('.csd-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
			
    		if(facility == "ALL"){
    			for(var i in csdOverdueDetail){
	    			csdOverdueDetail[i]["Header"]["SPREAD"] = 0;
	    		}
    		}
    		else{
    			for(var i in otherCsdOverdueDetail){
    				otherCsdOverdueDetail[i]["Header"]["SPREAD"] = 0;
    			}
    		}
    		
    		checkIndexWhetherInVisible();

    	}

    });

	//sort
	$('#buOverdueSortByCustomer').on('click', function(){
		buCountNum = 1;
		buPageEnd = buShowNum * buCountNum;
		buPageStart = buPageEnd - buShowNum;
		buColumnCount = 1;
		buColumnPageEnd = buColumnShow * buColumnCount;
		buColumnPageStart = buColumnPageEnd - buColumnShow;

		if($(this).attr('src') == 'img/priority_up.png'){
			buOverdueDetail.sort(compareLargeOverdue("Header", "CUSTOMER"));
			if(switchState == false){
				buCustomer.sort(compareLargeOverdueSoon("CUSTOMER"));
			}
			else{
				buCustomer.sort(compareLargeOverdueSoon("CUSTOMER"));
			}


			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();

			$(this).attr('src', 'img/priority_down.png');

		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			buOverdueDetail.sort(compareSmallOverdue("Header" ,"CUSTOMER"));
			if(switchState == false){
				buCustomer.sort(compareSmallOverdueSoon("CUSTOMER"));
			}
			else{
				buCustomer.sort(compareSmallOverdueSoon("CUSTOMER"));
			}


			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();

			$(this).attr('src', 'img/priority_up.png');

		}


	});

	$('#buOverdueSortByTotal').on('click', function(){
		buCountNum = 1;
		buPageEnd = buShowNum * buCountNum;
		buPageStart = buPageEnd - buShowNum;
		buColumnCount = 1;
		buColumnPageEnd = buColumnShow * buColumnCount;
		buColumnPageStart = buColumnPageEnd - buColumnShow;

		if($(this).attr('src') == 'img/priority_down.png'){
			if(switchState == false){
				buOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_INV"));
				buCustomer.sort(compareSmallOverdueSoon("TOTAL_INV"));
			}
			else{
				buOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_CM"));
				buCustomer.sort(compareSmallOverdueSoon("TOTAL_CM"));
			}

			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();

			$(this).attr('src', 'img/priority_up.png');

		}
		else if($(this).attr('src') == 'img/priority_up.png'){
			if(switchState == false){
				buOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_INV"));
				buCustomer.sort(compareLargeOverdueSoon("TOTAL_INV"));
			}
			else{
				buOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_CM"));
				buCustomer.sort(compareLargeOverdueSoon("TOTAL_CM"));
			}

			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();

			$(this).attr('src', 'img/priority_down.png');

		}



	});

	$('#csdOverdueSortByCustomer').on('click', function(){
		csdCountNum = 1;
		csdPageEnd = csdShowNum * csdCountNum;
		csdPageStart = csdPageEnd - csdShowNum;
		csdColumnCount = 1;
		csdColumnPageEnd = csdColumnShow * csdColumnCount;
		csdColumnPageStart = csdColumnPageEnd - csdColumnShow;

		if($(this).attr('src') == 'img/priority_up.png'){
			csdOverdueDetail.sort(compareLargeOverdue("Header", "CUSTOMER"));
			if(switchState == false){
				csdCustomer.sort(compareLargeOverdueSoon("CUSTOMER"));
			}
			else{
				csdCustomer.sort(compareLargeOverdueSoon("CUSTOMER"));
			}


			setCsdOverdueDetailData(facility);
			setCsdAreaData();
			csdSingleListBtn();

			$(this).attr('src', 'img/priority_down.png');

		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			csdOverdueDetail.sort(compareSmallOverdue("Header" ,"CUSTOMER"));
			if(switchState == false){
				csdCustomer.sort(compareSmallOverdueSoon("CUSTOMER"));
			}
			else{
				csdCustomer.sort(compareSmallOverdueSoon("CUSTOMER"));
			}

			setCsdOverdueDetailData(facility);
			setCsdAreaData();
			csdSingleListBtn();

			$(this).attr('src', 'img/priority_up.png');

		}


	});

	$('#csdOverdueSortByTotal').on('click', function(){
		csdCountNum = 1;
		csdPageEnd = csdShowNum * csdCountNum;
		csdPageStart = csdPageEnd - csdShowNum;
		csdColumnCount = 1;
		csdColumnPageEnd = csdColumnShow * csdColumnCount;
		csdColumnPageStart = csdColumnPageEnd - csdColumnShow;

		if($(this).attr('src') == 'img/priority_down.png'){
			if(switchState == false){
				csdOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_INV"));
				csdCustomer.sort(compareSmallOverdueSoon("TOTAL_INV"));
			}
			else{
				csdOverdueDetail.sort(compareSmallOverdue("Header", "TOTAL_CM"));
				csdCustomer.sort(compareSmallOverdueSoon("TOTAL_CM"));
			}

			setCsdOverdueDetailData(facility);
			setCsdAreaData();
			csdSingleListBtn();

			$(this).attr('src', 'img/priority_up.png');

		}
		else if($(this).attr('src') == 'img/priority_up.png'){
			if(switchState == false){
				csdOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_INV"));
				csdCustomer.sort(compareLargeOverdueSoon("TOTAL_INV"));
			}
			else{
				csdOverdueDetail.sort(compareLargeOverdue("Header" ,"TOTAL_CM"));
				csdCustomer.sort(compareLargeOverdueSoon("TOTAL_CM"));
			}

			setCsdOverdueDetailData(facility);
			setCsdAreaData();
			csdSingleListBtn();

			$(this).attr('src', 'img/priority_down.png');

		}


	});

	$('#buOverdueSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			buOutstand.sort(compareLargeOverdueSoon("CUSTOMER"));
			setBuOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');

		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			buOutstand.sort(compareSmallOverdueSoon("CUSTOMER"));
			setBuOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');

		}
	});

	$('#buOverdueSoonSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_down.png'){
			buOutstand.sort(compareSmallOverdueSoon("DUE_SOON_INV"));
			setBuOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');

		}
		else if($(this).attr('src') == 'img/priority_up.png'){
			buOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
			setBuOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');

		}
	});

	$('#csdOverdueSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			csdOutstand.sort(compareLargeOverdueSoon("CUSTOMER"));
			setCsdOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');

		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			csdOutstand.sort(compareSmallOverdueSoon("CUSTOMER"));
			setCsdOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');

		}
	});

	$('#csdOverdueSoonSortByTotal').on('click', function(){
		if($(this).attr('src') == 'img/priority_down.png'){
			csdOutstand.sort(compareSmallOverdueSoon("DUE_SOON_INV"));
			setCsdOverdueSoonData();
			$(this).attr('src', 'img/priority_up.png');

		}
		else if($(this).attr('src') == 'img/priority_up.png'){
			csdOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
			setCsdOverdueSoonData();
			$(this).attr('src', 'img/priority_down.png');

		}
	});

	$('#expiredSoonSortByCustomer').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			expiredSoon.sort(compareLargeOverdueSoon("CUSTOMER"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_down.png');

		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			expiredSoon.sort(compareSmallOverdueSoon("CUSTOMER"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_up.png');

		}
	});

	$('#expiredSoonSortByDay').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			expiredSoon.sort(compareLargeOverdueSoon("EXPIRED_DATE"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_down.png');

		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			expiredSoon.sort(compareSmallOverdueSoon("EXPIRED_DATE"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_up.png');

		}
	});

	$('#expiredSoonSortByLimit').on('click', function(){
		if($(this).attr('src') == 'img/priority_up.png'){
			expiredSoon.sort(compareLargeOverdueSoon("CREDIT_LIIMIT"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_down.png');

		}
		else if($(this).attr('src') == 'img/priority_down.png'){
			expiredSoon.sort(compareSmallOverdueSoon("CREDIT_LIIMIT"));
			setExpiredSoonData();
			$(this).attr('src', 'img/priority_up.png');

		}
	});

	var timoutScrollEvent = null;

	//监听屏幕滚动事件
	$(window).on('scroll', function(){
		if(viewDetailTab == "overdue" && (window.orientation === 0 || window.orientation === 180)){
			if(timoutScrollEvent !== null){
		   		clearTimeout(timoutScrollEvent);
		   		timoutScrollEvent = null;
		   	}

		   	timoutScrollEvent = setTimeout(function(){
		   		//check areaIndex in visible		   		
		   		checkIndexWhetherInVisible();
		   			   		
		   	}, 300);

		   	//setArea-hc
		   	onScrollSetAllAreaData();
			
		}
	   	
	});	
	


});


function checkIndexWhetherInVisible(){
	//获取页面可视区域的范围
   	var visibleTop = document.body.scrollTop;
   	var visibleHeight = document.body.clientHeight;
   	var visibleBottom = visibleHeight + visibleTop;
   	var partVisibleHeight = visibleHeight / 2;
   	
   	//分别获取BU区域和CSD区域
   	var buAreaTop = $('#buOverdue').offset().top;
   	var buAreaHeight = $('#buOverdue').height();
   	var buAreaBottom = buAreaTop + buAreaHeight;
   	var csdAreaTop = $('#csdOverdue').offset().top;
   	var csdAreaHeight = $('#csdOverdue').height();
   	var csdAreaBottom = csdAreaTop + csdAreaHeight;
	
	if(facility == "ALL"){
		//ALL已经删除，有ALL再添加
		
	}
	else{
		//先在BU里面找,当BU占可视区域不到1/3时，再进CSD找
		if(visibleTop < buAreaBottom && (buAreaBottom - visibleTop) > partVisibleHeight) {
			for(var i in otherBuOverdueDetail) {
				if(otherBuOverdueDetail[i]["Header"]["SPREAD"] == 1) {
					var top1 = $('#buShowList'+i).offset().top;
			   		var bottom1 = $('#buShowList'+i).offset().top + $('#buHideList'+i).height() + $('#buShowList'+i).height();
			   		
			   		if(top1 > visibleBottom || bottom1 < visibleTop) {
			   			visibleIndex = null;
			   			visibleArea = null;
			   			visibleMarginTop = 0;
			   			screen.orientation.lock('portrait');
			   		}
			   		else{
			   			visibleIndex = Number(i);
			   			visibleArea = "bu";
			   			visibleMarginTop = visibleTop;
		   				screen.orientation.unlock();
		   				break;
			   		}
				}
				else{
					visibleIndex = null;
					visibleArea = null;
					visibleMarginTop = 0;
			   		screen.orientation.lock('portrait');
				}
			}
		}	
		else{
			for(var i in otherCsdOverdueDetail){
		   		if(otherCsdOverdueDetail[i]["Header"]["SPREAD"] == 1) {
		   			var top1 = $('#csdShowList'+i).offset().top;
			   		var bottom1 = $('#csdShowList'+i).offset().top + $('#csdHideList'+i).height() + $('#csdShowList'+i).height();
			   		
			   		if(top1 > visibleBottom || bottom1 < visibleTop) {
			   			visibleIndex = null;
			   			visibleArea = null;
			   			visibleMarginTop = 0;
			   			screen.orientation.lock('portrait');
			   		}
			   		else{
			   			visibleIndex = Number(i);
			   			visibleArea = "csd";
			   			visibleMarginTop = visibleTop;
		   				screen.orientation.unlock();		
		   				break;
			   		}
			   		
		   		}
		   		else{
					visibleIndex = null;
					visibleArea = null;
					visibleMarginTop = 0;
			   		screen.orientation.lock('portrait');
				}
		    }
		}
		
		
	}
	
	//console.log(visibleArea + " ," + visibleIndex + " ," + visibleMarginTop);
	
}


function onScrollSetAllAreaData() {
	//获取页面可视区域的范围
   	var visibleTop = document.body.scrollTop;
   	var visibleHeight = document.body.clientHeight;
   	var visibleBottom = document.body.clientHeight + visibleTop;

	var buArrLength = buAreaSeriesINV.length;
   	var csdArrLength = csdAreaSeriesINV.length;

   	buPageEnd = buShowNum * buCountNum;
    buPageStart = buPageEnd - buShowNum;

   	//先从BU-Area开始
   	if(buArrLength > buPageEnd){
		var top12 = $('#buShowList' + (buPageEnd - 1)).offset().top;
		var top13 = $('#buShowList' + buPageEnd).offset().top;

		if((top12 - visibleBottom) < 200){
			buCountNum++;
			return false;
		}
		setBuAreaData();

	}
   	else{
   		buPageEnd = buArrLength;
   		setBuAreaData();

   		//buArea加载完成之后再加载CSD-Area
   		csdPageEnd = csdShowNum * csdCountNum;
		csdPageStart = csdPageEnd - csdShowNum;

		if(csdArrLength > csdPageEnd){
			var csdTop12 = $('#csdShowList' + (csdPageEnd - 1)).offset().top;

			if((csdTop12 - visibleBottom) < 200){
				csdCountNum++;
				return false;
			}

			setCsdAreaData();

		}
		else{
			csdPageEnd = csdArrLength;
			setCsdAreaData();

		}
   	}

}

function changeSwitchInit(){
	visibleIndex = null;
	visibleArea = null;
	visibleMarginTop = 0;
	
	buCountNum = 1;
	buPageEnd = buShowNum * buCountNum;
	buPageStart = buPageEnd - buShowNum;
	csdCountNum = 1;
	csdPageEnd = csdShowNum * csdCountNum;
	csdPageStart = csdPageEnd - csdShowNum;
	buColumnCount = 1;
	buColumnPageEnd = buColumnShow * buColumnCount;
	buColumnPageStart = buColumnPageEnd - buColumnShow;
	csdColumnCount = 1;
	csdColumnPageEnd = csdColumnShow * csdColumnCount;
	csdColumnPageStart = csdColumnPageEnd - csdColumnShow;

	setBuOverdueDetailData(facility);
	setBuAreaData();
	buSingleListBtn();
	setCsdOverdueDetailData(facility);
	setCsdAreaData();
	csdSingleListBtn();

	//开关关闭并转横屏后，column-hc数据由8组删除到4组
	changeSeriesBySwitch();

	buColumnCheckAll = false;
	csdColumnCheckAll = false;
	$('#buAllListBtn').attr('src', 'img/all_list_down.png');
	$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
}


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
                screen.orientation.unlock();
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
        chartLandscapebubble.setSize(screen.height, screen.width*0.95, false);
    }else {
        chartLandscapebubble.setSize(screen.width, screen.height*0.95, false);
    }
}

function zoomInChartByTreemap(){
	if(screen.width < screen.height) {
        chartLandscapeRect.setSize(screen.height, screen.width*0.85, false);
   	}else {
        chartLandscapeRect.setSize(screen.width, screen.height*0.85, false);
    }
}

function zoomInChartByColumn(){
	if(screen.width < screen.height) {
        chartColumnLandscape.setSize(screen.height, screen.width*0.95, false);
   	}else {
        chartColumnLandscape.setSize(screen.width, screen.height*0.95, false);
    }
}


//参数n必须为number类型
function formatNumber(n) {
    n += "";
    var arr = n.split(".");
    var regex = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(regex, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
}

//改变负值的字体颜色
function changeColorByNum(){
	var fontArray = document.getElementsByClassName("font-localString");
	for(var i in fontArray){
		try{
			if(parseFloat(fontArray[i].innerText) > 0){
				$(fontArray[i]).addClass("font-color-red");
			}
			else{
				$(fontArray[i]).addClass("font-color-black");
			}
		}catch(e){
			// handle the exception

		}
	}

	var fontDayArr = document.getElementsByClassName("font-day-color");
	for(var i in fontDayArr){
		try{
			if(parseFloat(fontDayArr[i].innerText) > 0){
				$(fontDayArr[i]).addClass("font-color-red");
			}
			else{
				$(fontDayArr[i]).addClass("font-color-black");
			}
		}catch(e){
			// handle the exception

		}
	}

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
					
    	}
    	else{
    		if(viewDetailTab == "overdue"){
    			$('#viewDetail .page-header').show();
	    		$('#viewDetail .page-tabs').show();
	    		$('#viewDetail #overdue').show();
	    		$('#viewDetail .scrollmenu').show();
	    		$('#viewDetail-hc-column-landscape').hide();
	    		//记录位置并返回
	    		setTimeout(function(){
	    			window.scrollTo(0, visibleMarginTop);
	    		}, 100);
    		}
			
    	}
    }
    
    if(window.orientation === 90 || window.orientation === -90) {
        if($.mobile.activePage[0].id === 'viewMain'){
        	zoomInChart();
        	$('#backBtn').hide();
        	$('#overview-hc-rectangle-landscape').hide();
        	$('#overview-hc-bubble-landscape').show();
        	//横屏状态下清除tooltip
        	chartbubble.tooltip.hide();
        	chartLandscapebubble.tooltip.hide();
        	if(chartRect !== null){
        		chartRect.tooltip.hide();
        	}
        	if(chartTreemap !== null){
        		chartTreemap.tooltip.hide();
        	}
			
        }
        else{
        	if(viewDetailTab == "overdue" && visibleIndex !== null && visibleArea !== null){
        		zoomInChartByColumn();
    			$('#viewDetail-hc-column-landscape').show();
    			$('#viewDetail .page-header').hide();
        		$('#viewDetail .scrollmenu').hide();
        		$('#viewDetail .page-tabs').hide();
        		$('#viewDetail #overdue').hide();
        		
        		getLandscapeColumn(false, visibleArea);
	        		
        	}
				
        }
    }
    
}, false);




