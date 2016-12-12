/*global variable, function*/
var initialAppName = "RRS";
var appKeyOriginal = "apprrs";
var appKey = "";
var pageList = ["viewReserve", "viewMyReserve", "viewSettingList", "viewNewSetting"];
var appSecretKey = "2e936812e205445490efb447da16ca13";

var prevPageID;
var arrReserve = [];
var arrTimeBlock = [];
var meetingRoomTreeData = new Tree('meetingRoom');
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

    //step1
    getAPIListAllMeetingRoom();//async
    getAPIListAllTime();//async

    loadingMask("show");//hide by change page event

    //REVIEW by alan
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    //step2 depend on step1 complete

    //step2
    // $(this).ajaxComplete(function() {
    $.mobile.changePage('#viewReserve');
    // });

    $("a[name=goPrevPage]").on("click", function() {
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });
}

function getAPIListAllMeetingRoom() {

    //REVIEW by Alan 
    //if (SystemTime not expire) PS: [7] day
        //
    //else
        //get data by API
        //keep SystemTime from API

    var self = this;
    var queryData = {};

    this.successCallback = function(data) {
        if (data['ResultCode'] === "1") {
            ConverToTree(data['Content']);
        }
        else{
            //no data
            //TODO
            //...
        }
    };

    this.failCallback = function(data) {
        console.log('apiFailCallback');
    };

    var __construct = function() {
        QPlayAPI("POST", "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData);
    }();
}

function getAPIListAllTime() {

    //REVIEW by Alan 
    //if (SystemTime not expire) PS: [7] day
        //
    //else
        //get data by API
        //keep SystemTime from API

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
        }else{
            //no data

        }
    };

    this.failCallback = function(data) {
        console.log('apiFailCallback');
    };

    var __construct = function() {
        QPlayAPI("POST", "ListAllTime", self.successCallback, self.failCallback, queryData);
    }();
}

// function getTimeBlock() {
//     var startTime = '08:00';
//     for (var i = 0; i < 20; i++) {
//         if (i != 0) {
//             startTime = addThirtyMins(startTime);
//         }
//         dictTimeBlock[i] = startTime;
//     }
// }

function ConverToTree(data) {

    var siteData = uniqueData(data, 'MeetingRoomSite');
    siteData.sort();

    for (var i in siteData) {

        meetingRoomTreeData.add(siteData[i], 'meetingRoom', meetingRoomTreeData.traverseDF);
        var floorData = grepData(data, 'MeetingRoomSite', siteData[i])
        var dfloorData = uniqueData(floorData, 'MeetingRoomFloor');
        dfloorData.sort();

        for (var j in dfloorData) {

            meetingRoomTreeData.add(dfloorData[j] + 'F', siteData[i], meetingRoomTreeData.traverseDF);
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

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewReserve") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewReserve');
        } else {
            navigator.app.exitApp();
        }

    } else if (activePageID === "viewMyReserve") {

        $.mobile.changePage('#viewMyReserve');

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

Date.prototype.yyyymmdd = function(symbol) {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return yyyy + symbol + (mm[1] ? mm : '0' + mm[0]) + symbol + (dd[1] ? dd : '0' + dd[0]);
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

// convert yyyymmdd to [yyyy, mm, dd]
function cutStringToArray(string, array) {
    var strMatch = '';
    $.each(array, function(index, value) {
        strMatch += '(\\d{' + value + '})'; //like '/(\d{4})(\d{2})(\d{2})/'
    });
    var reg = new RegExp(strMatch);
    var result = string.match(reg);
    return result;
}

function sortDataByKey(data, key, asc) {
    data = data.sort(function(a, b) {
        if (asc) return (a[key] > b[key]);
        else return (b[key] > a[key]);
    });
}

function replaceStr(content, originItem, replaceItem) {
    $.each(originItem, function(index, value) {
        content = content.replaceAll(value.toString(), replaceItem[index].toString())
    });
    return content;
}

function addThirtyMins(time) {
    var timeStr = new Date(new Date().toDateString() + ' ' + time)
    timeStr.setMinutes(timeStr.getMinutes() + 30);
    var result = timeStr.hhmm();
    return result;
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

// create tree structure for meeting room data
function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}

function Tree(data) {
    var node = new Node(data);
    this._root = node;
}

Tree.prototype.traverseDF = function(callback) {

    // this is a recurse and immediately-invoking function
    (function recurse(currentNode) {
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(currentNode.children[i]);
        }

        callback(currentNode);

    })(this._root);

};

Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};

Tree.prototype.add = function(data, toData, traversal) {
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };

    this.contains(callback, traversal);

    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

Tree.prototype.remove = function(data, fromData, traversal) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;

    var callback = function(node) {
        if (node.data === fromData) {
            parent = node;
        }
    };

    this.contains(callback, traversal);

    if (parent) {
        index = findIndex(parent.children, data);

        if (index === undefined) {
            throw new Error('Node to remove does not exist.');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist.');
    }

    return childToRemove;
};

function findIndex(arr, data) {
    var index;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }

    return index;
}
