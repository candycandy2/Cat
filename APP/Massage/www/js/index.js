var QueryReserveDetailQuerydata, ReserveRelieveQuerydata, ReserveCancelQuerydata, QueryMyReserveQuerydata;
var queryDate, QueryReserveDetailCallBackData, ReserveRelieveCallBackData, ReserveCancelCallBackData, QueryMyReserveCallBackdata, myEmpNo;
var reserveSite = "QTT";
var initialAppName = "Massage";
var appKeyOriginal = "appmassage";
var appKey = "appmassage";
var pageList = ["viewReserve"];
var appSecretKey = "7f341dd51f8492ca49278142343558d0";
var prevPageID;
var time = new Date(Date.now());
var lastDateOfMonth = new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate();
var currentYear = time.getFullYear();
var currentMonth = ((time.getMonth() + 1) < 10) ? "0"+(time.getMonth() + 1) : (time.getMonth() + 1);
var currentDate = (time.getDate() < 10) ? "0"+time.getDate() : time.getDate();
var currentDay = time.getDay();
var arrOtherTimeBlock = [];
var dayTable = {
    "1" : "(一)",
    "2" : "(二)",
    "3" : "(三)",
    "4" : "(四)",
    "5" : "(五)"
};

$(document).one("pagebeforeshow", function() {
    scorllDateInit(10);
});

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    loadingMask("show");
    $.mobile.changePage('#viewReserve');
    if (device.platform === "iOS") {
        $('.page-main').css({'padding-top': '0.1vw'});
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
            } else if ($("#reserveTab :radio:checked").val() == 'tab2'){
                $("input[id=tab1]").trigger('click');
                $("label[for=tab1]").addClass('ui-btn-active');
                $("label[for=tab2]").removeClass('ui-btn-active');
                $("label[for=tab3]").removeClass('ui-btn-active');
            }
            else{
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
    var day = currentDay;
    var date = currentDate;
    var month = currentMonth;
    for(var i=0; i<upper; i++) {
        if(day < 6 && day > 0) {
            scrollDate += '<a id="' + month + date + '" class="ui-link">' + month + '/' + date + '&nbsp;' + dayTable[day] + '</a>';
            day++;
            if(day == 6) {
                day = 1;
                if((Number(date) + 3) <= lastDateOfMonth) {
                    date = ((Number(date) + 3) < 10) ? "0"+(Number(date) + 3) : (Number(date) + 3);    
                }else if((Number(date) + 3) > lastDateOfMonth) {
                    month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                    date = ((Number(date) + 3 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 3 - lastDateOfMonth) : (Number(date) + 3 - lastDateOfMonth);    
                }
            }else if((Number(date) + 1) <= lastDateOfMonth) {
                date = ((Number(date) + 1) < 10) ? "0"+(Number(date) + 1) : (Number(date) + 1);
            }else if((Number(date) + 1) > lastDateOfMonth) {
                month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                date = ((Number(date) + 1 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 1 - lastDateOfMonth) : (Number(date) + 1 - lastDateOfMonth);
            }
        }else if(day == 6) {
            day = 1;
            if((Number(date) + 2) <= lastDateOfMonth) {
                date = ((Number(date) + 2) < 10) ? "0"+(Number(date) + 2) : (Number(date) + 2);    
            }else if((Number(date) + 2) > lastDateOfMonth) {
                month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                date = ((Number(date) + 2 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 2 - lastDateOfMonth) : (Number(date) + 2 - lastDateOfMonth);    
            }
        }else if(day == 0) {
            day = 1;
            if((Number(date) + 1) <= lastDateOfMonth) {
                date = ((Number(date) + 1) < 10) ? "0"+(Number(date) + 1) : (Number(date) + 1);    
            }else if((Number(date) + 1) > lastDateOfMonth) {
                month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                date = ((Number(date) + 1 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 1 - lastDateOfMonth) : (Number(date) + 1 - lastDateOfMonth);    
            }
        }
    }
    $("#scrollDate").html("");
    $("#scrollDate").append(scrollDate).enhanceWithin();
}