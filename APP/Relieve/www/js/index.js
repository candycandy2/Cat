
/*global variable, function*/
var initialAppName = "Relieve";
var appKeyOriginal = "apprelieve";
var appKey = "apprelieve";
var pageList = ["viewReserve"];
var appSecretKey = "00a87a05c855809a0600388425c55f0b";

var prevPageID;

var arrOtherTimeBlock = [];

window.initialSuccess = function() {

    //loadingMask("show");

    $.mobile.changePage('#viewReserve');

}

//[Android]Handle the back button
function onBackKeyDown() {
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

            } else if (activePageID === "viewMyReserve") {

                $.mobile.changePage('#viewReserve');

            } else if (activePageID === "viewSettingList") {

                $.mobile.changePage('#viewReserve');

            } else if (activePageID === "viewNewSetting") {

                $.mobile.changePage('#viewSettingList');
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