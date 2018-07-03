/*global variable, function*/
var initialAppName = "RRS";
var appKeyOriginal = "apprrs";
var appKey = "apprrs";
var pageList = ["viewReserve", "viewMyReserve", "viewSettingList", "viewNewSetting"];
var appSecretKey = "2e936812e205445490efb447da16ca13";

var prevPageID;
var arrReserve = [];
var arrTimeBlockBySite = [];
var arrOtherTimeBlock = [];
var meetingRoomTreeData = new Tree('meetingRoom');
var meetingRoomData = {};
var roleTreeData = new Tree('role');
var roleData = {};
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
//fix by allen
//var arrSite = ['2', '1', '43', '100'];
var arrSite = [];
//var arrSiteCategory = ['1', '2', '8'];
var arrSiteCategory = [];
var arrRole = ['1', '2', '4'];
// var dictSite = {
//     '1': 'QTY',
//     '2': 'BQT/QTT',
//     '43': '雙星',
//     '100': 'QTH'
// };
var dictSite = {};
// var dictSiteCategory = {
//     '1': '2',
//     '2': '1',
//     '43': '2',
//     '100': '8'
// };
var dictSiteCategory = {};
var arrLimitRoom = ['T00', 'T13', 'A30', 'A70', 'B71', 'E31'];
var dictRole = {
    'system': 'role1',
    'secretary': 'role2',
    'super': 'role4'
};
var reserveDays = 14;
var myReserveLocalData = [];
var isReloadPage = false;

window.initialSuccess = function() {
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

            ConverToMeetingTree(data['Content']);

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

    var __construct = function() {
        CustomAPI("POST", false, "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData, "");
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

            if (tempContent.length == 0) {
                tempContent = 'normal';
            } else {
                ConverToRoleTree(tempContent);
            }

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

//add by allen
function getAPIListAllSite() {
    var self = this;
    var queryData = {};

    this.successCallback = function(data) {

        var resultData = data['Content'];

        var siteCategory = [];
        for (var i in resultData) {
            dictSite[resultData[i].SiteID] = resultData[i].SiteName;
            dictSiteCategory[resultData[i].SiteID] = resultData[i].SiteTimeCategory;
            arrSite.push(resultData[i].SiteID);
            siteCategory.push(resultData[i].SiteTimeCategory);
        }

        //去重
        for(var j in siteCategory) {
            if(arrSiteCategory.indexOf(siteCategory[j]) == -1) {
                arrSiteCategory.push(siteCategory[j]);
            }
        }
    };

    this.failCallback = function () {}

    var __construct = function() {
        CustomAPI("POST", false, "ListAllSite", self.successCallback, self.failCallback, queryData, "");
    }();
}

function getAPIQueryMyReserveTime() {
    loadingMask('show');
    var self = this;
    var today = new Date();
    var queryData = '<LayoutHeader><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><NowDate>' + today.yyyymmdd('') + '</NowDate></LayoutHeader>';

    this.successCallback = function(data) {
        var jsonData = [];
        myReserveLocalData = jsonData;

        if (data['ResultCode'] === "1") {
            //Successful
            for (var i = 0, item; item = data['Content'][i]; i++) {
                var strBeginTime = item.ReserveBeginTime;
                var strEndTime = item.ReserveEndTime;
                var searchRoomNode = searchTree(meetingRoomData, item.MeetingRoomName, 'MeetingRoomName');
                if(searchRoomNode == null)
                    continue;
                var searchSiteNode = searchRoomNode.parent.parent.data;

                if (strBeginTime == strEndTime) {
                    jsonData = {
                        room: item.MeetingRoomName,
                        site: searchSiteNode,
                        date: item.ReserveDate,
                        time: strBeginTime
                    };
                    myReserveLocalData.push(jsonData);

                } else {
                    do {
                        jsonData = {
                            room: item.MeetingRoomName,
                            site: searchSiteNode,
                            date: item.ReserveDate,
                            time: strBeginTime
                        };

                        myReserveLocalData.push(jsonData);
                        strBeginTime = addThirtyMins(strBeginTime);
                    } while (strBeginTime != strEndTime);
                }
            }
        }
        loadingMask('hide');
    };

    var __construct = function() {
        CustomAPI("POST", false, "QueryMyReserve", self.successCallback, self.failCallback, queryData, "");
    }();
}

function getSTimeToETime(sTime, eTime) {
    var arrResult = [];
    var strTime = sTime;

    if (sTime == eTime) {
        arrResult.push(strTime);
    } else {
        do {
            arrResult.push(strTime);
            strTime = addThirtyMins(strTime);
        } while (strTime != eTime);
    }

    return arrResult;
}


function getTimeID(sTime, eTime, siteCategoryID) {

    var arrSelectTime = getSTimeToETime(sTime, eTime);
    var filterTimeBlock = grepData(arrTimeBlockBySite, 'siteCategoryID', siteCategoryID)[0].data;

    var strTimeID = '';
    for (var item in filterTimeBlock) {
        $.each(arrSelectTime, function(index, value) {
            if (value == filterTimeBlock[item].time) {
                strTimeID += filterTimeBlock[item].timeID + ',';
            }
        });
    }
    if (strTimeID == '') {
        arrOtherTimeBlock = JSON.parse(localStorage.getItem('allOtherTimeLocalData'))['content'];
        var filterOtherTimeBlock = grepData(arrOtherTimeBlock, 'category', siteCategoryID);
        for (var item in filterOtherTimeBlock) {
            $.each(arrSelectTime, function(index, value) {
                if (value == filterOtherTimeBlock[item].time) {
                    strTimeID += filterOtherTimeBlock[item].timeID + ',';
                }
            });
        }
    }

    return strTimeID;
}

function setReserveDetailLocalDate() {
    //save to local data
    localStorage.removeItem('reserveDetailLocalData');
    jsonData = [];
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
        obj.id = 0;
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

function ConverToMeetingTree(data) {
    //level 1 = Site, level 2 = Floor, level 3 = Room Detail Info

    for (var key in arrSite) {

        meetingRoomTreeData.add(arrSite[key], 'meetingRoom', meetingRoomTreeData.traverseDF);
        var floorData = grepData(data, 'MeetingRoomSite', arrSite[key]);
        var dfloorData = uniqueData(floorData, 'MeetingRoomFloor');
        dfloorData.sort(function compareNumber(a, b) {
            return a - b;
        });

        for (var j in dfloorData) {

            //meetingRoomTreeData.add(dfloorData[j] + 'F', arrSite[key], meetingRoomTreeData.traverseDF);
            //fix by allen
            meetingRoomTreeData.add(dfloorData[j] + (arrSite[key] != '116' ? 'F' : ''), arrSite[key], meetingRoomTreeData.traverseDF);
            var roomData = grepData(floorData, 'MeetingRoomFloor', dfloorData[j])
            roomData.sort(cmpStringsWithNumbers);

            for (var k in roomData) {
                //meetingRoomTreeData.add(roomData[k], dfloorData[j] + 'F', meetingRoomTreeData.traverseDF);
                meetingRoomTreeData.add(roomData[k], dfloorData[j] + (arrSite[key] != '116' ? 'F' : ''), meetingRoomTreeData.traverseDF);
            }
        }
    }
}

function ConverToRoleTree(data) {
    //level 1 = Role, level 2 = Site

    for (var key in arrRole) {
        var roleData = grepData(data, 'SystemRole', arrRole[key]);
        var droleData = uniqueData(roleData, 'SystemRole');

        if (droleData.length != 0) {
            roleTreeData.add('role' + arrRole[key], 'role', roleTreeData.traverseDF);
        }

        for (var j in roleData) {
            roleTreeData.add(roleData[j].MeetingRoomSite, 'role' + arrRole[key], roleTreeData.traverseDF);
        }
    }

    //if include role1 and role2, just keep role1 data
    var searchRole1 = searchTree(roleTreeData._root, 'role1', '');
    var searchRole2 = searchTree(roleTreeData._root, 'role2', '');
    if (searchRole1 != null && searchRole2 != null) {
        //remove all role2 node
        roleTreeData.remove('role2', 'role', roleTreeData.traverseDF);
    }
}

function getOneHour() {
    var nowTime = new Date();
    var nowTimeHour = nowTime.getHours();
    var nowTimeMins = nowTime.getMinutes();

    if (nowTimeMins < 15) {
        nowTimeMins = 0;
    } else if (nowTimeMins >= 15 && nowTimeMins < 45) {
        nowTimeMins = 30;
    } else if (nowTimeMins >= 45) {
        nowTimeHour += 1;
        nowTimeMins = 0;
    }

    nowTime.setHours(nowTimeHour);
    nowTime.setMinutes(nowTimeMins);
    var sTime = nowTime.hhmm();
    var eTime = addThirtyMins(addThirtyMins(sTime));
    var dictResult = {};
    dictResult['sTime'] = sTime;
    dictResult['eTime'] = eTime;

    return dictResult;
}

//use dictionary value get key
// function getKeyByValue(object, value) {
//     return Object.keys(object).find(key => object[key] === value);
// }

// Object.prototype.getKeyByValue = function(value){
//   for(var key in this){
//     if(this[key] == value){
//       return key;
//     }
//   }
//   return null;
// };

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
        var x = a[sortKey];
        var y = b[sortKey];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

//comparing & sorting string with number ex:sorting T01, T02, T03...
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
    $('#reservePopupSchemeMsg').removeClass();
    $('#reservePopupSchemeMsg').popup(); //initialize the popup
    $('#reservePopupSchemeMsg').show();
    $('#reservePopupSchemeMsg').popup('open');
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

function calSelectWidth(obj) {
    $("#tmp_option_width").html($('#' + obj.attr('id') + ' option:selected').text());
    var pxWidth = $('#tmp_option_width').outerWidth();
    //px conver to vw
    var vwWidth = (100 / document.documentElement.clientWidth) * pxWidth + 7;
    obj.css('width', vwWidth + 'vw');
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
