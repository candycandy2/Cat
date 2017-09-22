var htmlContent = '';
var pageList = ["viewMain"];
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
var arrSiteCategory = ['10', '28'];
var dictSiteCategory = {
    '92': '10',
    '111': '28'
};

var reserveDays = 14;

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
                var eTimeStr = new Date(new Date().toDateString() + ' ' + '17:30');
                var timeStr = new Date(new Date().toDateString() + ' ' + item.BTime);
                var newTimeBlock = new timeblockObj(item.TimeCategory, item.BTime, item.TimeID);
                if (timeStr >= bTimeStr && timeStr <= eTimeStr) {
                    arrTimeBlock.push(newTimeBlock);
                } else {
                    arrOtherTimeBlock.push(newTimeBlock);
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

            jsonData = {
                lastUpdateTime: new Date(),
                content: arrOtherTimeBlock
            };
            localStorage.removeItem('allOtherTimeLocalData');
            localStorage.setItem('allOtherTimeLocalData', JSON.stringify(jsonData));

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

//filter data
function grepData(grepData, grepPram, grepValue) {
    return $.grep(grepData, function(item, index) {
        return item[grepPram] == grepValue;
    });
}

// create timeblock object 
function timeblockObj(category, time, timeID) {
    this.category = category;
    this.time = time;
    this.timeID = timeID;
};

// create reserve object 
function reserveObj(roomId, date) {
    this.roomId = roomId;
    this.date = date;
    this.detailInfo = {};
    this.addDetail = function(key, value) {
        this.detailInfo[key] = value;
    };

    this.addDetail();
    return this;
};

function reserveLocalDataObj(roomId, date, data) {
    this.lastUpdateTime = new Date();
    this.roomId = roomId;
    this.date = date;
    this.data = data;
};
