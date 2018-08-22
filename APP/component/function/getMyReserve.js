
//数组合并并排序
function formatReserveList() {
    //1. 先按照日期合併同一天預約
    var tempArr = [];
    $.each(reserveList, function (index, item) {
        var key = item.ReserveDate;
        if (typeof tempArr[key] == "undefined") {
            tempArr[key] = [];
            tempArr[key].push(item);

        } else {
            tempArr[key].push(item);
        }
    });

    //2. 再按照時間將同一天內的預約進行排序
    for (var i in tempArr) {
        tempArr[i].sort(sortByBeginTime("ReserveBeginTime", "ReserveEndTime"));
    }

    reserveList = tempArr;
}

function formatReserveDate(str) {
    return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2);
}

//获取所有预约
function getMyReserve(key, secret) {
    var self = this;
    var year = new Date().getFullYear().toString();
    var month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString();
    var firstDay = year + month + '01'; //每月第一天
    var queryData = '<LayoutHeader><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><NowDate>' + firstDay + '</NowDate></LayoutHeader>';
    var rrsStr = langStr["str_063"], //预约
        relieveStr = langStr["str_064"], //物理治疗
        parkingStr = langStr["str_065"], //车位预约
        massageStr = langStr["str_066"]; //按摩预约

    var versionKey = "";
    if (loginData["versionName"].indexOf("Staging") !== -1) {
        versionKey = key + "test";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        versionKey = key + "dev";
    } else {
        versionKey = key + "";
    }

    this.successCallback = function(data) {
        //console.log(data);

        var reserveDirty = false;
        if (data['ResultCode'] === "1") {
            var resultArr = data['Content'];

            if (key == "apprrs") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "預約" + resultArr[i].MeetingRoomName;
                        resultArr[i].item = rrsStr + resultArr[i].MeetingRoomName;
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            } else if (key == "apprelieve") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "物理治療";
                        resultArr[i].item = relieveStr;
                        resultArr[i].ReserveBeginTime = new Date(resultArr[i].ReserveBeginTime).hhmm();
                        resultArr[i].ReserveEndTime = new Date(resultArr[i].ReserveEndTime).hhmm();
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            } else if (key == "appparking") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "車位預約";
                        resultArr[i].item = parkingStr;
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            } else if (key == "appmassage") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "按摩預約";
                        resultArr[i].item = massageStr;
                        resultArr[i].ReserveBeginTime = new Date(resultArr[i].ReserveBeginTime).hhmm();
                        resultArr[i].ReserveEndTime = new Date(resultArr[i].ReserveEndTime).hhmm();
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            }

        } else if (data['ResultCode'] === "002901") {}

        if (key == "appmassage") {
            formatReserveList();
        }

        //review by alan
        if (reserveDirty) {
            formatReserveList();
            //不符合OO精神
            //reserveCalendar.reserveData = reserveList;
            //reserveCalendar.refreshReserve(reserveList);
            reserveDirty = false;
        }
    };

    var __construct = function() {
        CustomAPIByKey("POST", true, key, secret, "QueryMyReserve", self.successCallback, self.failCallback, queryData, "", 60 * 60, "low");
    }();
}