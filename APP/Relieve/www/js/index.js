var QueryReserveDetailQuerydata, ReserveRelieveQuerydata, ReserveCancelQuerydata, QueryMyReserveQuerydata;
var queryDate, QueryReserveDetailCallBackData, ReserveRelieveCallBackData, ReserveCancelCallBackData, QueryMyReserveCallBackdata, myEmpNo;
var reserveSite = "QTT";
var initialAppName = "Relieve";
var appKeyOriginal = "apprelieve";
var appKey = "apprelieve";
var pageList = ["viewReserve"];
var appSecretKey = "00a87a05c855809a0600388425c55f0b";
var prevPageID;
var time = new Date(Date.now());
var lastDateOfMonth = new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate();
var firstItemYear = 0; //need to set default value
var firstItemMonth = 0; //need to set default value
var firstItemDate = 0; //need to set default value
var firstItemDay = 0; //need to set default value
var arrOtherTimeBlock = [];
var dayTable = {
    "1": "(一)",
    "2": "(二)",
    "3": "(三)",
    "4": "(四)",
    "5": "(五)"
};

$(document).one("pagebeforeshow", function() {
    scorllDateInit(10);
});

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    loadingMask("show");
    $.mobile.changePage('#viewReserve');
    if (device.platform === "iOS") {
        $('.page-main').css({ 'padding-top': '0.1vw' });
    }
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (checkPopupShown()) {
        // popupClose();
    } else {
        if (activePageID === "viewReserve") {
            if ($("#reserveTab :radio:checked").val() == 'tab1') {
                navigator.app.exitApp();
            } else if ($("#reserveTab :radio:checked").val() == 'tab2') {
                $("input[id=tab1]").trigger('click');
                $("label[for=tab1]").addClass('ui-btn-active');
                $("label[for=tab2]").removeClass('ui-btn-active');
                $("label[for=tab3]").removeClass('ui-btn-active');
            } else {
                $("input[id=tab1]").trigger('click');
                $("label[for=tab1]").addClass('ui-btn-active');
                $("label[for=tab2]").removeClass('ui-btn-active');
                $("label[for=tab3]").removeClass('ui-btn-active');
            }
        }
    }
}

function popupSchemeMsg(attr, title, content, href1, href2) {
    $('#reservePopupSchemeMsg').attr('for', attr);
    $('#reservePopupSchemeMsg #msgTitle').html(title);
    $('#reservePopupSchemeMsg #msgContent').html(content);
    $('#reservePopupSchemeMsg #mail').attr('href', href1);
    $('#reservePopupSchemeMsg #tel').attr('href', href2);
    $('#reservePopupSchemeMsg > div').css('height', '30vh');
    $('#reservePopupSchemeMsg').removeClass();
    $('#reservePopupSchemeMsg').popup(); //initialize the popup
    $('#reservePopupSchemeMsg').show();
    $('#reservePopupSchemeMsg').popup('open');
}

function scorllDateInit(upper) {
    var scrollDate = "";
    var tomorrow = time;
    for (var i = 0; i < upper; i++) {
        var year = tomorrow.getFullYear();
        var month = ((tomorrow.getMonth() + 1) < 10) ? "0" + (tomorrow.getMonth() + 1) : (tomorrow.getMonth() + 1);
        var date = (tomorrow.getDate() < 10) ? "0" + tomorrow.getDate() : tomorrow.getDate();
        var day = tomorrow.getDay();
        if (day == 6 || day == 0) { //bypass weekend
            tomorrow.setDate(time.getDate() + 1);
            i--;
            continue;
        }
        scrollDate += '<a id="' + year + month + date + '" class="ui-link">' + month + '/' + date + '&nbsp;' + dayTable[day] + '</a>';
        if (i == 0) { //set first item
            firstItemYear = year;
            firstItemMonth = month;
            firstItemDate = date;
            firstItemDay = day;
        }
        tomorrow.setDate(time.getDate() + 1);
    }
    $("#scrollDate").html("");
    $("#scrollDate").append(scrollDate).enhanceWithin();
}