var QueryReserveDetailQuerydata, ReserveRelieveQuerydata;
var reserveSite = "QTT";
var initialAppName = "Relieve";
var appKeyOriginal = "apprelieve";
var appKey = "apprelieve";
var pageList = ["viewReserve"];
var appSecretKey = "00a87a05c855809a0600388425c55f0b";
var prevPageID;
var arrOtherTimeBlock = [];

window.initialSuccess = function() {
    //loadingMask("show");
    QueryReserveDetailQuerydata = "<LayoutHeader><Site>QTY</Site><ReserveDate>20170318</ReserveDate></LayoutHeader>";
    QueryReserveDetail();
    ReserveRelieveQuerydata = "<LayoutHeader><Site>QTY</Site><ReserveDate>20170318</ReserveDate><ReserveUser>1501005</ReserveUser><BTime>08:30,09:00</BTime ></LayoutHeader>";
    ReserveRelieve();
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
        popupClose();
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