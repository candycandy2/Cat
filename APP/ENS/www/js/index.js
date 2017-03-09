
/*global variable, function*/
var initialAppName = "ENS";
var appKeyOriginal = "appens";
var appKey = "appens";
var pageList = ["viewEventList", "viewEventAdd", "viewEventContent"];
var appSecretKey = "dd88f6e1eea34e77a9ab75439d327363";

var prevPageID;

window.initialSuccess = function() {

    //loadingMask("show");
    /*
    if (window.localStorage.getItem(key) !== null) {

    }

    window.localStorage.setItem("messagecontent", JSON.stringify(messagecontent));

    loginData["messagecontent"] = window.localStorage.getItem("messagecontent");
    var localContent = JSON.parse(loginData["messagecontent"]);

    window.localStorage.setItem(key, value);

    if (window.localStorage.getItem("openMessage") === null) {

    }
    */
    processLocalData.initialData();

    $.mobile.changePage('#viewEventList');
    var EventList = new getEventList();
    var Authority = new getAuthority();

}

//1. Each data has its own life-cycle.
//2. Every time before call API, check the life-cycle timestamp first.
//3. If life-cycle was expired, call API to get data again.
//4. If life-cycle was not expired, don't call API.
var processLocalData = {
    initialData: function() {
        if (window.localStorage.getItem("localData") !== null) {
            var tempDate = window.localStorage.getItem("localData");
            localData = JSON.parse(tempDate);
        } else {
            localData = {};
        }
    },
    updateLocalStorage: function() {
        window.localStorage.setItem("localData", JSON.stringify(localData));
    },
    checkLifeCycle: function(dataName, callAPI, dataExistCallBack) {
        callAPI = callAPI || null;
        dataExistCallBack = dataExistCallBack || null;

        if (localData[dataName] !== undefined) {
            //data exist, check expired-timestamp & latest-update-timestamp
            var lifeCycle = parseInt(localData[dataName]["lifeCycle"]);
            var expiredTimeStamp = parseInt(localData[dataName]["expiredTimeStamp"]);
            var latestUpdateTimeStamp = parseInt(localData[dataName]["latestUpdateTimeStamp"]);

            if (latestUpdateTimeStamp > expiredTimeStamp) {
                //data expired, call API again
                callAPI();
            } else {
                //data expired, just update latestUpdateTimeStamp
                var nowTime = new Date();
                var nowTimeStamp = nowTime.TimeStamp();
                var latestUpdateTimeStamp = parseInt(nowTimeStamp + lifeCycle, 10);
                localData[dataName]["latestUpdateTimeStamp"] = latestUpdateTimeStamp;
            }

        } else {
            //data not exist
            callAPI();
        }
    },
    storeData: function(dataName, lifeCycle, data) {
        var nowTime = new Date();
        var nowTimeStamp = nowTime.TimeStamp();
        var expiredTimeStamp = parseInt(nowTimeStamp + lifeCycle, 10);

        localData[dataName] = {
            lifeCycle: lifeCycle,
            expiredTimeStamp: expiredTimeStamp,
            latestUpdateTimeStamp: nowTimeStamp,
            data: data
        };

        this.updateLocalStorage();
    }
};

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewEventList") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewEventList');
        } else {
            navigator.app.exitApp();
        }

    }/* else if (activePageID === "viewDetailInfo") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
        } else {
            $.mobile.changePage('#' + prevPageID);
        }

    }*/
}
