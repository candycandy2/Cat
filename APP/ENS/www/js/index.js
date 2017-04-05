
/*global variable, function*/
var initialAppName = "ENS";
var appKeyOriginal = "appens";
var appKey = "appens";
var pageList = ["viewEventList", "viewEventAdd", "viewEventContent"];
var appSecretKey = "dd88f6e1eea34e77a9ab75439d327363";

var prevPageID;

//Set the result code which means [Unknown Error]
errorCodeArray = ["014999"];

window.initialSuccess = function() {

    loadingMask("show");

    processLocalData.initialData();
    checkEventTemplateData("check");

    $.mobile.changePage('#viewEventList');
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

            if (latestUpdateTimeStamp >= expiredTimeStamp) {
                //data expired, call API again
                callAPI();
            } else {
                //data not expired, just update latestUpdateTimeStamp
                var nowTime = new Date();
                var nowTimeStamp = nowTime.TimeStamp();
                localData[dataName]["latestUpdateTimeStamp"] = nowTimeStamp;

                dataExistCallBack(localData[dataName]["data"], true);
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
    },
    createXMLDataString: function(data) {
        var XMLDataString = "";

        $.each(data, function(key, value) {
            XMLDataString += "<" + key + ">" + htmlspecialchars(value) + "</" + key + ">";
        });

        return XMLDataString;
    }
};

//Cehck User Authority
function checkAuthority(level) {
    // admin / supervisor / common
    if (loginData["RoleList"].indexOf(level) != -1) {
        return true;
    } else {
        return false;
    }
}

//Check Event Template Data
function checkEventTemplateData(action, data) {
    data = data || null;

    if (window.localStorage.getItem("template") !== null) {
        var tempDate = window.localStorage.getItem("template");
        templateData = JSON.parse(tempDate);

        if (action === "update") {
            if (templateData.length < 20) {
                var value = templateData.length+1;
                var text = data;
                var tempObj = {
                    value: value,
                    text: text
                };

                templateData.push(tempObj);
            } else {

                var templateUpdateIndex = 1;

                if (window.localStorage.getItem("templateUpdateIndex") !== null) {
                    templateUpdateIndex = window.localStorage.getItem("templateUpdateIndex");
                }

                for (var i=0; i<templateData.length; i++) {
                    if (templateUpdateIndex == parseInt(i+1, 10)) {
                        var value = templateUpdateIndex;
                        var text = data;
                        var tempObj = {
                            value: value,
                            text: text
                        };

                        templateData[i] = tempObj;
                    }
                }
                templateUpdateIndex++;
                window.localStorage.setItem("templateUpdateIndex", templateUpdateIndex);
            }

            window.localStorage.setItem("template", JSON.stringify(templateData));
        }
    } else {
        templateData = [{
            value: "1",
            text: "罐頭範本-1"
        }, {
            value: "2",
            text: "罐頭範本-2"
        }, {
            value: "3",
            text: "罐頭範本-3"
        }];

        window.localStorage.setItem("template", JSON.stringify(templateData));
    }
}

function footerFixed() {
    $(".ui-footer").removeClass("ui-fixed-hidden");
}

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

    } else if (activePageID === "viewEventContent") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
            footerFixed();
        } else {
            $.mobile.changePage('#viewEventList');
        }

    } else if (activePageID === "viewEventAdd") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
            footerFixed();
        } else {
            if (prevPageID === "viewEventList") {
                $.mobile.changePage('#viewEventList');
            } else if (prevPageID === "viewEventContent") {
                $("#eventEditCancelConfirm").popup("open");
            }
        }

    }
}
