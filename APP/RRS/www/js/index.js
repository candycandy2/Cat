/*global variable, function*/
var appKeyOriginal = "appyellowpage";
var appKey = "";
var pageList = ["viewReserve", "viewMyReserve", "viewSettingList", "viewNewSetting"];
var appSecretKey = "c103dd9568f8493187e02d4680e1bf2f";

// var myReserveData = {};
// var employeeSelectedIndex;
// var phonebookData = {};
var reserveArr = [];
var timeBlockArr = [];
var prevPageID;

window.initialSuccess = function() {

    // loadingMask("show");

    // var companyData = new QueryCompanyData();

    $("a[name=goPrevPage]").on("click", function() {
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });

}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewReserve") {

        // if (checkPopupShown()) {
        //     $.mobile.changePage('#viewDataInput');
        // } else {
        //     navigator.app.exitApp();
        // }

    } else if (activePageID === "viewMyReserve") {

        // $.mobile.changePage('#viewDataInput');

    } else if (activePageID === "viewSettingList") {

        // if (checkPopupShown()) {
        //     $('#' + popupID).popup('close');
        // } else {
        //     $.mobile.changePage('#' + prevPageID);
        // }

    } else if (activePageID === "viewNewSetting") {

        // if (checkPopupShown()) {
        //     $('#' + popupID).popup('close');
        // } else {
        //     //If User is doing edit phonebook, cancel edit mode.
        //     if ($("#phonebookEditBtn").css("display") === "block") {
        //         cancelEditMode();
        //     } else {
        //         $.mobile.changePage('#viewDataInput');
        //     }
        // }

    }
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.mmdd = function(symbol) {
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return (mm[1] ? mm : '0' + mm[0]) + symbol + (dd[1] ? dd : '0' + dd[0]);
};

Date.prototype.hhmm = function() {
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    return (hh[1] ? hh : '0' + hh[0]) + ':' + (mm[1] ? mm : '0' + mm[0]);
};

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

function addThirtyMins(time) {
    var timeStr = new Date(new Date().toDateString() + ' ' + time)
    timeStr.setMinutes(timeStr.getMinutes() + 30);
    var result = timeStr.hhmm();
    return result;
}

function getTimeBlock() {
    var startTime = '08:00';
    for (var i = 0; i < 20; i++) {
        if (i != 0) {
            startTime = addThirtyMins(startTime);
        }
        timeBlockArr[i] = startTime;
    }
}

function reserveObj(roomId, date) {
    this.roomId = roomId;
    this.date = date;
    this.detailInfo = [];
    this.addDetail = function(key, value) {
        var detail = new reserveDetail(key, value);
        this.detailInfo.push(detail);
    };

    this.addDetail();
    return this;
};

function reserveDetail(key, value) {
    this.key = key;
    this.value = value;
};
