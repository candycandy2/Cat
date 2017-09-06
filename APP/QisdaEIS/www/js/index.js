/*******************global variable function*****************/
var chartbubble = null,chartLandscapebubble = null;
var chartRect = null,chartLandscapeRect = null;
var chartTreemap = null,chartTreemapLandscape = null;
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
var buArrIndex = null;
var csdArrIndex = null;
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
var buIndexMarginTop,csdIndexMarginTop;
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
    //ARSummary();
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
    		buArrIndex = 0;
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

    	}
    	else{
    		$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.buSingleListBtn').attr('src', 'img/list_down.png');
    		$('.bu-single-list').hide();
    		$('.bu-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
    		buArrIndex = null;

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
    		csdArrIndex = 0;
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

    	}else{
    		$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    		$('.csdSingleListBtn').attr('src', 'img/list_down.png');
    		$('.csd-single-list').hide();
    		$('.csd-single-list').prev().css('border-bottom', '1px solid #D6D6D6');
    		csdArrIndex = null;

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

	if(viewDetailTab == "overdue"){
		//监听屏幕滚动事件
		$(window).on('scroll', function(){
		   	if(timoutScrollEvent !== null){
		   		clearTimeout(timoutScrollEvent);
		   		timoutScrollEvent = null;
		   	}

		   	timoutScrollEvent = setTimeout(function(){
		   		//check areaIndex in visible
		   		checkIndexVisible();
		   	}, 500);

		   	//setArea-hc
		   	onScrollSetAllAreaData();

		});

	}




});

function checkIndexVisible(){
	//获取页面可视区域的范围
   	var visibleTop = document.body.scrollTop;
   	var visibleHeight = document.body.clientHeight;
   	var visibleBottom = document.body.clientHeight + visibleTop;

   	//获取BU区域和CSD区域
   	var buOverdueAreaTop = $('.overdueDetail-bu').offset().top;
   	var buOverdueAreaHeight = $('.overdueDetail-bu').height();
   	var buOverdueAreaBottom = buOverdueAreaTop + buOverdueAreaHeight;
   	var csdOverdueAreaTop = $('.overdueDetail-csd').offset().top;
   	var csdOverdueAreaHeight = $('.overdueDetail-csd').height();
   	var csdOverdueAreaBottom = csdOverdueAreaTop + csdOverdueAreaHeight;

	if(facility == "ALL"){
		//当BU在可视区域内，才判断column-hc是否在可视区域内
		if(buOverdueAreaBottom > visibleTop && buOverdueDetail.length > 0){
			for(var i in buOverdueDetail){
		   		if(buOverdueDetail[i]["Header"]["SPREAD"] == 1){
		   			var top1 = $('#buShowList'+i).offset().top;
			   		var bottom1 = $('#buShowList'+i).offset().top + $('#buHideList'+i).height() + $('#buShowList'+i).height();

		   			//不在可视区域内
		   			if(top1 > visibleBottom || bottom1 < visibleTop){
		   				buArrIndex = null;
		   			}
		   			else{
		   				buArrIndex = Number(i);
		   				buIndexMarginTop = $('#buShowList'+i).offset().top;
		   				break;
		   			}
		   		}
		   		else{
		   			buArrIndex = null;
		   		}
		    }
		}
		//当CSD在可视区域内，才判断column-hc是否在可视区域内
		else if((visibleTop > buOverdueAreaBottom && csdOverdueAreaBottom >= visibleTop) || buOverdueDetail.length == 0){
			for(var i in csdOverdueDetail){
		   		if(csdOverdueDetail[i]["Header"]["SPREAD"] == 1){
		   			var top1 = $('#csdShowList'+i).offset().top;
			   		var bottom1 = $('#csdShowList'+i).offset().top + $('#csdHideList'+i).height() + $('#csdShowList'+i).height();

		   			//不在可视区域内
		   			if(top1 > visibleBottom || bottom1 < visibleTop){
		   				csdArrIndex = null;
		   			}
		   			else{
		   				csdArrIndex = Number(i);
		   				csdIndexMarginTop = $('#csdShowList'+i).offset().top;
		   				break;
		   			}
		   		}
		   		else{
		   			csdArrIndex = null;
		   		}
		   	}
		}
	}
	else{
		//当BU在可视区域内，才判断column-hc是否在可视区域内
		if(buOverdueAreaBottom > visibleTop && otherBuOverdueDetail.length > 0){
			for(var i in otherBuOverdueDetail){
		   		if(otherBuOverdueDetail[i]["Header"]["SPREAD"] == 1){
		   			var top1 = $('#buShowList'+i).offset().top;
			   		var bottom1 = $('#buShowList'+i).offset().top + $('#buHideList'+i).height() + $('#buShowList'+i).height();

		   			//不在可视区域内
		   			if(top1 > visibleBottom || bottom1 < visibleTop){
		   				buArrIndex = null;
		   			}
		   			else{
		   				buArrIndex = Number(i);
		   				buIndexMarginTop = $('#buShowList'+i).offset().top;
		   				break;
		   			}
		   		}
		   		else{
		   			buArrIndex = null;
		   		}
		    }
		}
		//当CSD在可视区域内，才判断column-hc是否在可视区域内
		else if((visibleTop > buOverdueAreaBottom && csdOverdueAreaBottom >= visibleTop) || otherBuOverdueDetail.length == 0){
			for(var i in otherCsdOverdueDetail){
		   		if(otherCsdOverdueDetail[i]["Header"]["SPREAD"] == 1){
		   			var top1 = $('#csdShowList'+i).offset().top;
			   		var bottom1 = $('#csdShowList'+i).offset().top + $('#csdHideList'+i).height() + $('#csdShowList'+i).height();

		   			//不在可视区域内
		   			if(top1 > visibleBottom || bottom1 < visibleTop){
		   				csdArrIndex = null;
		   			}
		   			else{
		   				csdArrIndex = Number(i);
		   				csdIndexMarginTop = $('#csdShowList'+i).offset().top;
		   				break;
		   			}
		   		}
		   		else{
		   			csdArrIndex = null;
		   		}
		   	}
		}
	}

   	//console.log(buArrIndex+" ,"+csdArrIndex);

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
	buArrIndex = null;
	csdArrIndex = null;

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


function setAllColumnByOne(i, visibleTop, visibleBottom){
	var top1 = $('#buShowList'+i).offset().top;
	var bottom1 = $('#buShowList'+i).offset().top + $('#buShowList'+i).height();
	var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);

	if(top1 > visibleTop && bottom1 < visibleBottom){
		buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
		buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
		buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
		buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
		buColumn.update({
			tooltip: {
				formatter: function () {
			        var s = '<b>' + this.x + '</b><br/><b>' + buOverdueDetail[i]["Header"]["CUSTOMER"] +
			        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
			        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
			        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
			        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
			        return s;
			    }
			}
		});
		buColumn.redraw(false);

		i++;
		return i;
	}

	setAllColumnByOne(i, visibleTop, visibleBottom);
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
        chartColumnLandscape.setSize(screen.height, screen.width*0.9, false);
   	}else {
        chartColumnLandscape.setSize(screen.width, screen.height*0.9, false);
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
	var fontArr = document.getElementsByClassName("font-localString");
	for(var i in fontArr){
		try{
			if(parseFloat(fontArr[i].innerText) > 0){
				$(fontArr[i]).addClass("font-color-red");
			}
			else{
				$(fontArr[i]).addClass("font-color-black");
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
    		$('#viewDetail .page-header').show();
    		$('#viewDetail .page-tabs').show();
    		$('#viewDetail .scrollmenu').show();

    		if(viewDetailTab == "overdue"){
    			$('#viewDetail #overdue').show();
    			//页面返回指定位置
    			if(buArrIndex !== null){
	    			window.scrollTo(0, buIndexMarginTop-100);
	    		}
	    		else if(csdArrIndex !== null){
	    			window.scrollTo(0, csdIndexMarginTop-100);
	    		}
    		}
    		else if(viewDetailTab == "overdueSoon"){
    			$('#viewDetail #overdueSoon').show();
    		}
    		else if(viewDetailTab == "expiredSoon"){
    			$('#viewDetail #expiredSoon').show();
    		}

    	}
    }
    if(window.orientation === 90 || window.orientation === -90 ) {
        if($.mobile.activePage[0].id === 'viewMain'){
        	zoomInChart();
        	$('#overview-hc-rectangle').hide();
        	$('#overview-hc-bubble-landscape').show();
        }else{
        	console.log(buArrIndex+" ,"+csdArrIndex);
        	getLandscapeColumn(true, "");
    		if(viewDetailTab == "overdue" && buArrIndex !== null){
        		getLandscapeColumn(false, "BU");
        		$('#viewDetail .page-header').hide();
        		$('#viewDetail .page-tabs').hide();
        		$('#viewDetail #overdue').hide();
        		$('#viewDetail #overdueSoon').hide();
        		$('#viewDetail #expiredSoon').hide();
        		$('#viewDetail .scrollmenu').hide();
        		$('#viewDetail-hc-column-landscape').show();
        	}
    		else if(viewDetailTab == "overdue" && csdArrIndex !== null){
        		getLandscapeColumn(false, "CSD");
        		$('#viewDetail .page-header').hide();
        		$('#viewDetail .page-tabs').hide();
        		$('#viewDetail #overdue').hide();
        		$('#viewDetail #overdueSoon').hide();
        		$('#viewDetail #expiredSoon').hide();
        		$('#viewDetail .scrollmenu').hide();
        		$('#viewDetail-hc-column-landscape').show();
    		}




        }
    }
}, false);
