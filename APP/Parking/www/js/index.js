var htmlContent = '';
var initialAppName = "Parking";
var appKeyOriginal = "appparking";
var appKey = "appparking";
var appSecretKey = "eaf786afb27f567a9b04803e4127cef3";
var pageList = ["viewMain","viewParkingDetailAdd","viewQTYParkingDetail"];
var htmlContent = '';
var dictDayOfWeek = {
    '1': '(一)',
    '2': '(二)',
    '3': '(三)',
    '4': '(四)',
    '5': '(五)',
    '6': '(六)',
    '0': '(日)'
};
var arrSite = ['92', '111'];
var arrSiteCategory = ['10', '28'];
var dictSiteCategory = {
    '92': '10',
    '111': '28'
};
var reserveDays = 14;
var myReserveLocalData = [];
var isReloadPage = false;
var clickEditSettingID = '';
var pdName = '';
var pdCategory = '';
var pdRemark = '';
var pdCar = '';
var parkingQTYData = [];
var timeClick = [];
var selectedSite = '';
var clickDateId = '';
var clickSpaceId = '';
var timeNameClick = [];
var parkingSettingdata = {};

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    //loadingMask("show");
    $.mobile.changePage('#viewMain');
    if (device.platform === "iOS") {
        $('.page-main').css({'padding-top': '0.1vw'});
    }
}

function getAPIListAllParkingSpace() {
    loadingMask('show');
    var self = this;
    var queryData = {};

    this.successCallback = function(data) {
        if (data['ResultCode'] === "1") {

            //save to local data
            localStorage.removeItem('parkingSpaceLocalData');
            var jsonData = {};
            jsonData = {
                lastUpdateTime: new Date(),
                content: data['Content']
            };
            localStorage.setItem('parkingSpaceLocalData', JSON.stringify(jsonData));
            loadingMask('hide');

        } else {
            loadingMask('hide');
            popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
        }
    };

    var __construct = function() {
        CustomAPI("POST", false, "ListAllParkingSpace", self.successCallback, self.failCallback, queryData, "");
    }();
}

function getAPIListAllTime() {
    loadingMask('show');
    var self = this;
    var queryData = {};

    this.successCallback = function(data) {
        if (data['ResultCode'] === "1") {

            var arrTimeBlock = [];
            for (var i = 0, item; item = data['Content'][i]; i++) {
                var bTimeStr = new Date(new Date().toDateString() + ' ' + '08:00');
                if (item.TimeCategory === 10){
                    var eTimeStr = new Date(new Date().toDateString() + ' ' + '17:30');
                }else if (item.TimeCategory === 28) {
                    var eTimeStr = new Date(new Date().toDateString() + ' ' + '19:00');
                }
                var timeStr = new Date(new Date().toDateString() + ' ' + item.BTime);
                var newTimeBlock = new timeblockObj(item.TimeCategory, item.BTime, item.TimeID);
                if (timeStr >= bTimeStr && timeStr <= eTimeStr) {
                    arrTimeBlock.push(newTimeBlock);
                } 
            }

            //save to local data
            var jsonData = {};
            var jsonChildData = {};
            jsonData = {
                lastUpdateTime: new Date(),
                content: []
            };
            localStorage.removeItem('allTimeLocalData');
            localStorage.setItem('allTimeLocalData', JSON.stringify(jsonData));
            var allTimeLocalData = JSON.parse(localStorage.getItem('allTimeLocalData'));

            for (var key in arrSiteCategory) {
                //to do
                //arrTimeBlock scrop 
                var filterTimeBlock = grepData(arrTimeBlock, 'category', arrSiteCategory[key]);

                filterTimeBlock.sort(function(a, b) {
                    return new Date(new Date().toDateString() + ' ' + a.time) - new Date(new Date().toDateString() + ' ' + b.time);
                });

                jsonChildData = {
                    siteCategoryID: arrSiteCategory[key],
                    data: filterTimeBlock
                };

                allTimeLocalData.content.push(jsonChildData);
                jsonData = allTimeLocalData;
            }

            localStorage.setItem('allTimeLocalData', JSON.stringify(jsonData));
            arrTimeBlockBySite = JSON.parse(localStorage.getItem('allTimeLocalData'))['content'];

            loadingMask('hide');
        } else {
            // console.log('APIListAllTimeMsg No Data!');
            loadingMask('hide');
            popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
        }
    };

    var __construct = function() {
        CustomAPI("POST", false, "ListAllTime", self.successCallback, self.failCallback, queryData, "");
    }();
}

function getAPIListAllManager() {
    loadingMask('show');
    var self = this;
    var queryData = {};

    this.successCallback = function(data) {
        if (data['ResultCode'] === "1") {
            //save to local data
            localStorage.removeItem('listAllManager');
            var jsonData = {};

            var tempContent = data['Content'].filter(function(item) {
                return item.EmpNo.trim() === loginData['emp_no'];
            });

            jsonData = {
                lastUpdateTime: new Date(),
                content: tempContent
            };

            localStorage.setItem('listAllManager', JSON.stringify(jsonData));
            loadingMask('hide');

        } else {
            loadingMask('hide');
            popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
        }
    };

    var __construct = function() {
        CustomAPI("POST", false, "ListAllManager", self.successCallback, self.failCallback, queryData, "");
    }();
}

function setReserveDetailLocalDate() {
    //save to local data
    localStorage.removeItem('reserveDetailLocalData');
    jsonData = [];
    localStorage.setItem('reserveDetailLocalData', JSON.stringify(jsonData));
}

//filter data
function grepData(grepData, grepPram, grepValue) {
    return $.grep(grepData, function(item, index) {
        return item[grepPram] == grepValue;
    });
}

function sortDataByKey(sortData, sortKey, asc) {
    sortData = sortData.sort(function(a, b) {
        var x = a[sortKey];
        var y = b[sortKey];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (checkPopupShown()) {
        popupClose();
    } else {
        if (activePageID === "viewMain") {

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

        } else if (activePageID === "viewParkingDetailAdd") {

            $.mobile.changePage('#viewMain');

        } else if (activePageID === "viewQTYParkingDetail") {

            $.mobile.changePage('#viewMain');
        }
    }
}

//close onBackKeyDown
function popupClose() {
    var popupMsgID = $(".ui-popup-active")[0].children[0].id;
    $('#' + popupMsgID).popup('close');
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

function refreshPage(data) {
    // || data.status == 500
    if (data.statusText == 'timeout') {
        console.log('timeout');
        var doAPIQueryMyReserveTime = new getAPIQueryMyReserveTime();
        loadingMask('hide');
        isReloadPage = true;
        var activePage = $.mobile.activePage.attr("id");
        $.mobile.changePage(
            '#' + activePage, {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: false,
                reloadPage: false
            }
        );
    }
}

// create timeblock object 
function timeblockObj(category, time, timeID) {
    this.category = category;
    this.time = time;
    this.timeID = timeID;
};

// create reserve object 
function reserveObj(spaceId, date) {
    this.spaceId = spaceId;
    this.date = date;
    this.detailInfo = {};
    this.addDetail = function(key, value) {
        this.detailInfo[key] = value;
    };

    this.addDetail();
    return this;
};

function reserveLocalDataObj(spaceId, date, data) {
    this.lastUpdateTime = new Date();
    this.spaceId = spaceId;
    this.date = date;
    this.data = data;
};
