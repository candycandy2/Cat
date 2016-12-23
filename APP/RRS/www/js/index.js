/*global variable, function*/
var initialAppName = "RRS";
var appKeyOriginal = "apprrs";
var appKey = "apprrs";
var pageList = ["viewReserve", "viewMyReserve", "viewSettingList", "viewNewSetting"];
var appSecretKey = "2e936812e205445490efb447da16ca13";

var prevPageID;
var arrReserve = [];
var arrClickReserve = [];
var arrTimeBlock = [];
var meetingRoomTreeData = new Tree('meetingRoom');
var htmlContent = '';
var clickEditSettingID = '';
var dictDayOfWeek = {
    '1': '(一)',
    '2': '(二)',
    '3': '(三)',
    '4': '(四)',
    '5': '(五)',
    '6': '(六)',
    '0': '(日)'
};
var arrSite = ['2', '1', '43', '100'];
var dictSite = {
    '1': 'QTY',
    '2': 'BQT/QTT',
    '43': '雙星',
    '100': 'QTH'
};
var dictSiteCategory = {
    '1': '2',
    '2': '1',
    '43': '2',
    '100': '8'
};

window.initialSuccess = function() {
    // loadingMask("show");

    $.mobile.changePage('#viewReserve');

    $("a[name=goPrevPage]").on("click", function() {
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });
}

function getAPIListAllMeetingRoom() {
    loadingMask('show');
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
            loadingMask('hide');

        } else {
            // console.log('APIListAllMeetingRoomMsg No Data!');
            loadingMask('hide');
            popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
        }
    };

    this.failCallback = function(data) {
        // console.log('apiFailCallback');
        loadingMask('hide');
        popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
    };

    var __construct = function() {
        QPlayAPI("POST", false, "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData);
    }();
}

function getAPIListAllTime() {
    loadingMask('show');
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
            loadingMask('hide');
        } else {
            // console.log('APIListAllTimeMsg No Data!');
            loadingMask('hide');
            popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
        }
    };

    this.failCallback = function(data) {
        // console.log('apiFailCallback');
        loadingMask('hide');
        popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
    };

    var __construct = function() {
        QPlayAPI("POST", false, "ListAllTime", self.successCallback, self.failCallback, queryData);
    }();
}

function getTimeID(sTime, eTime, siteCategoryID) {
    var arrSelectTime = [];
    var strTime = sTime;

    do {
        arrSelectTime.push(strTime);
        strTime = addThirtyMins(strTime);
    } while (strTime != eTime);

    var filterTimeBlock = grepData(arrTimeBlock, 'category', siteCategoryID);

    var strTimeID = '';
    for (var item in filterTimeBlock) {
        $.each(arrSelectTime, function(index, value) {
            if (value == filterTimeBlock[item].time) {
                strTimeID += filterTimeBlock[item].timeID + ',';
            }
        });
    }

    return strTimeID;
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

function setDefaultSettingData() {

    var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
    if (roomSettingdata === null) {
        var obj = new Object();
        obj.id = '0';
        obj.title = '現在空的會議室';
        obj.site = '2';
        obj.siteName = dictSite['2'];
        obj.people = '0';
        obj.time = 'none'
        obj.timeID = 'none';
        obj.floorName = 'none';
        var strFloor = '';
        var index = findIndex(meetingRoomTreeData._root.children, '2');
        $.each(meetingRoomTreeData._root.children[index].children, function(index, value) {
            strFloor += value.data + ',';
        });
        obj.floor = strFloor.replaceAll('F', '');

        var jsonData = {};
        jsonData = {
            content: [obj]
        };

        localStorage.setItem('roomSettingData', JSON.stringify(jsonData));
    }
}

function ConverToTree(data) {

    for (var key in arrSite) {

        meetingRoomTreeData.add(arrSite[key], 'meetingRoom', meetingRoomTreeData.traverseDF);
        var floorData = grepData(data, 'MeetingRoomSite', arrSite[key])
        var dfloorData = uniqueData(floorData, 'MeetingRoomFloor');
        dfloorData.sort(function compareNumber(a, b) {
            return a - b;
        });

        for (var j in dfloorData) {

            meetingRoomTreeData.add(dfloorData[j] + 'F', arrSite[key], meetingRoomTreeData.traverseDF);
            var roomData = grepData(floorData, 'MeetingRoomFloor', dfloorData[j])
            roomData.sort(cmpStringsWithNumbers);

            for (var k in roomData) {
                meetingRoomTreeData.add(roomData[k], dfloorData[j] + 'F', meetingRoomTreeData.traverseDF);
            }
        }
    }
}


//filter data
function grepData(grepData, grepPram, grepValue) {
    return $.grep(grepData, function(item, index) {
        return item[grepPram] == grepValue;
    });
}

//distinct data
function uniqueData(uniqueData, uniquePram) {
    var uniqueArray = [];
    for (var i = 0, item; item = uniqueData[i]; i++) {
        if (uniqueArray.indexOf(item[uniquePram]) === -1) {
            uniqueArray.push(item[uniquePram]);
        }
    }
    return uniqueArray;
}

function sortDataByKey(sortData, sortKey, asc) {
    sortData = sortData.sort(function(a, b) {
        if (asc) return (a[sortKey] > b[sortKey]);
        else return (b[sortKey] > a[sortKey]);
    });
}

(function() {
    var reParts = /\d+|\D+/g;
    var reDigit = /\d/;

    cmpStringsWithNumbers = function(a, b) {
        a = a.MeetingRoomName.toUpperCase();
        b = b.MeetingRoomName.toUpperCase();

        var aParts = a.match(reParts);
        var bParts = b.match(reParts);
        var isDigitPart;

        if (aParts && bParts &&
            (isDigitPart = reDigit.test(aParts[0])) == reDigit.test(bParts[0])) {
            var len = Math.min(aParts.length, bParts.length);

            for (var i = 0; i < len; i++) {
                var aPart = aParts[i];
                var bPart = bParts[i];

                if (isDigitPart) {
                    aPart = parseInt(aPart, 10);
                    bPart = parseInt(bPart, 10);
                }

                if (aPart != bPart) {
                    return aPart < bPart ? -1 : 1;
                }
                isDigitPart = !isDigitPart;
            }
        }

        return (a >= b) - (a <= b);
    };
})();

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
    $('#reservePopupSchemeMsg > div > div').css('margin', '0 0 0 23vw');
    $('#reservePopupSchemeMsg').removeClass();
    $('#reservePopupSchemeMsg').popup(); //initialize the popup
    $('#reservePopupSchemeMsg').popup('open');
}

function popupMsg(id, attr, title, content, btn1, btnIsDisplay, btn2, popupIsBig) {
    $('#' + id).attr('for', attr);
    $('#' + id + ' #msgTitle').html(title);
    $('#' + id + ' #msgContent').html(content);
    $('#' + id + ' #cancel').html(btn1);
    $('#' + id + ' #confirm').html(btn2);

    if (title == '') {
        $('#' + id + ' > div > div').css('margin', '5vh 0 0 0');
    } else {
        $('#' + id + ' > div > div').css('margin', '0 0 0 23vw');
    }

    if (popupIsBig == true) {
        $('#' + id + ' > div').css('height', '30vh');
    } else {
        $('#' + id + ' > div').css('height', '');
    }

    $('#' + id).removeClass();
    $('#' + id + ' button').removeClass();
    if (btnIsDisplay == true) {
        $('#' + id + ' #cancel').removeClass('disable');
        $('#' + id + ' #confirm').css('width', '50%');
    } else {
        $('#' + id + ' #cancel').addClass('disable');
        $('#' + id + ' #confirm').css('width', '100%');
    }
    $('#' + id + ' #cancel').attr('onClick', 'popupCancelClose()')

    $('#' + id).popup(); //initialize the popup
    $('#' + id).popup('open');
}

function popupCancelClose() {
    $('body').on('click', 'div[for*=Msg] #cancel', function() {
        $('div[for*=Msg]').popup('close');
    });
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

function padLeft(str,lenght){
    if(str.length >= lenght)
        return str;
    else
        return padLeft("0" +str,lenght);
}


// var panelsize = 60;
// var step = 15;
// var bAnimation = false;
// var minValue = 0;

// function animation(obj, isUpDown) {
//     setTimeout(function() {
//         var currentTop = parseInt($(obj).css("top"));

//         if (isUpDown == 'down') {
//             if (currentTop <= minValue) {
//                 setTimeout(function() {
//                     bAnimation = false;
//                 });
//                 return;
//             }
//         } else {
//             if (currentTop >= minValue) {
//                 setTimeout(function() {
//                     bAnimation = false;
//                 });
//                 return;
//             }
//         }

//         $(obj).css({ "top": currentTop - step });
//         animation();
//     });
// }


// function scrollUpDown(id, isUpDown) {
//     if (bAnimation) return;
//     var currentTop = parseInt($('#' + id).css("top"));

//     if (isUpDown == 'down') { 
//         minValue = currentTop - panelsize;
//         step = 15;
//     } else {
//         minValue = currentTop + panelsize;
//         step = -15;
//     }

//     if (parseInt(minValue) <= 0 && parseInt(minValue) >= parseInt(-300)) {
//         animation($('#' + id), isUpDown);
//     } else {
//         minValue = 0;
//         bAnimation = false;
//     }
// };
