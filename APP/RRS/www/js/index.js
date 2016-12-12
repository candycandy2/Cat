/*global variable, function*/
var initialAppName = "RRS";
var appKeyOriginal = "apprrs";
var appKey = "";
var pageList = ["viewReserve", "viewMyReserve", "viewSettingList", "viewNewSetting"];
var appSecretKey = "2e936812e205445490efb447da16ca13";

var prevPageID;
var arrReserve = [];
var arrClickReserve = [];
var arrTimeBlock = [];
var meetingRoomTreeData = new Tree('meetingRoom');
var htmlContent = '';
var dictDayOfWeek = {
    '1': '(一)',
    '2': '(二)',
    '3': '(三)',
    '4': '(四)',
    '5': '(五)'
};
var dictSite = {
    '1': 'BQT/QTT',
    '2': 'QTY',
    '43': '雙星',
    '100': 'QTH'
};
var dictSiteCategory = {
    '1': '1',
    '2': '2',
    '43': '2',
    '100': '8'
};

window.initialSuccess = function() {
    loadingMask("show");

    //get meetingroom last update time
    var meetingRoomLocalData = JSON.parse(localStorage.getItem('meetingRoomLocalData'));

    if (meetingRoomLocalData === null || checkDataExpired(meetingRoomLocalData['lastUpdateTime'], 3, 'mm')) {
        var doAPIListAllMeetingRoom = new getAPIListAllMeetingRoom();
        var doAPIListAllTime = new getAPIListAllTime();
    } else {
        ConverToTree(JSON.parse(localStorage.getItem('meetingRoomLocalData'))['content']);
        arrTimeBlock = JSON.parse(localStorage.getItem('allTimeLocalData'))['content'];
    }
    createReserveDetailLocalDate();
    getSiteData();

    loadingMask("hide");

    $.mobile.changePage('#viewReserve');

    $("a[name=goPrevPage]").on("click", function() {
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });
}

function getAPIListAllMeetingRoom() {
    var self = this;
    var queryData = {};

    this.successCallback = function(data) {
        if (data['ResultCode'] === "1") {

            ConverToTree(data['Content']);

            //save to local data
            localStorage.removeItem('meetingRoomLocalData');
            var jsonData = {};
            jsonData = {
                lastUpdateTime: new Date(),
                content: data['Content']
            };
            localStorage.setItem('meetingRoomLocalData', JSON.stringify(jsonData));

        } else {
            console.log('APIListAllMeetingRoomMsg No Data!');
        }
    };

    this.failCallback = function(data) {
        console.log('apiFailCallback');
    };

    var __construct = function() {
        QPlayAPI("POST", false, "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData);
    }();
}

function getAPIListAllTime() {
    var self = this;
    var queryData = {};

    this.successCallback = function(data) {
        if (data['ResultCode'] === "1") {

            for (var i = 0, item; item = data['Content'][i]; i++) {
                var bTimeStr = new Date(new Date().toDateString() + ' ' + '08:00')
                var eTimeStr = new Date(new Date().toDateString() + ' ' + '17:30')
                var timeStr = new Date(new Date().toDateString() + ' ' + item.BTime)
                if (timeStr >= bTimeStr && timeStr <= eTimeStr) {
                    var newTimeBlock = new timeblockObj(item.TimeCategory, item.BTime, item.TimeID);
                    arrTimeBlock.push(newTimeBlock);
                }
            }

            arrTimeBlock.sort(function(a, b) {
                return new Date(new Date().toDateString() + ' ' + a.time) - new Date(new Date().toDateString() + ' ' + b.time);
            });

            //save to local data
            localStorage.removeItem('allTimeLocalData');
            var jsonData = {};
            jsonData = {
                lastUpdateTime: new Date(),
                content: arrTimeBlock
            };
            localStorage.setItem('allTimeLocalData', JSON.stringify(jsonData));

        } else {
            console.log('APIListAllTimeMsg No Data!');
        }
    };

    this.failCallback = function(data) {
        console.log('apiFailCallback');
    };

    var __construct = function() {
        QPlayAPI("POST", false, "ListAllTime", self.successCallback, self.failCallback, queryData);
    }();
}

function createReserveDetailLocalDate() {
    //save to local data
    localStorage.removeItem('reserveDetailLocalData');
    jsonData = {};
    localStorage.setItem('reserveDetailLocalData', JSON.stringify(jsonData));
}

function getSiteData() {
    htmlContent = '';
    for (var i = 0, item; item = meetingRoomTreeData._root.children[i]; i++) {
        htmlContent += '<option value=' + item.data + '>' + dictSite[item.data] + '</option>';
    }

    $('#reserveSite').append(htmlContent);
    $('#newSettingSite').append(htmlContent);
    var firstNode = meetingRoomTreeData._root.children[0].data;
    $('#reserveSite-button').find('span').text(dictSite[firstNode]);
    $('#newSettingSite-button').find('span').text(dictSite[firstNode]);
}

function ConverToTree(data) {

    // var siteData = uniqueData(data, 'MeetingRoomSite');
    // siteData.sort();

    // for (var i in siteData) {

    for (var key in dictSite) {

        meetingRoomTreeData.add(key, 'meetingRoom', meetingRoomTreeData.traverseDF);
        var floorData = grepData(data, 'MeetingRoomSite', key)
        var dfloorData = uniqueData(floorData, 'MeetingRoomFloor');
        dfloorData.sort();

        for (var j in dfloorData) {

            meetingRoomTreeData.add(dfloorData[j] + 'F', key, meetingRoomTreeData.traverseDF);
            var roomData = grepData(floorData, 'MeetingRoomFloor', dfloorData[j])
            roomData.sort();

            for (var k in roomData) {
                meetingRoomTreeData.add(roomData[k], dfloorData[j] + 'F', meetingRoomTreeData.traverseDF);
            }
        }
    }
}

//filter data
function grepData(data, pram, value) {
    return $.grep(data, function(item, index) {
        return item[pram] == value;
    });
}

//distinct data
function uniqueData(data, pram) {
    return $.unique(data.map(function(item) {
        return item[pram];
    }));
}

function sortDataByKey(data, key, asc) {
    data = data.sort(function(a, b) {
        if (asc) return (a[key] > b[key]);
        else return (b[key] > a[key]);
    });
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
            } else {
                $("input[id=tab1]").trigger('click');
                $("label[for=tab1]").addClass('ui-btn-active');
                $("label[for=tab2]").removeClass('ui-btn-active');
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

function popupMsg(id, attr, content, btn1, btnIsDisable, btn2, href1, href2) {
    $('#' + id).attr('for', attr);
    $('#' + id + ' #msgContent').html(content);
    $('#' + id + ' #cancel').html(btn1);
    if (btnIsDisable == true) {
        $('#' + id + ' #cancel').addClass('disable')
    }
    $('#' + id + ' #confirm').html(btn2);
    $('#' + id + ' #cancel').attr('href', href1);
    $('#' + id + ' #confirm').attr('href', href2);
    $('#' + id).popup(); //initialize the popup
    $('#' + id).popup('open');
}

function popupClose() {
    var popupMsgID = $(".ui-popup-active")[0].children[0].id;
    $('#' + popupMsgID).popup('close');
}

function inputValidation(str) {
    //en or tw both one length
    if (str.length > 8) {
        return [false, '限制輸入8個字'];
    } else if (str.length == 0) {
        return [false, '您尚未輸入文字'];
    } else {
        return [true, ''];
    }
}

// calculation string length of byte 
// String.prototype.byteLength = function() {
//     var arr = this.match(/[^\x00-\xff]/ig);
//     return arr == null ? this.length : this.length + arr.length;
// }

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
