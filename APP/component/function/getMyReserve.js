
//数组合并并排序
function formatReserveList(arr) {
    //1. 先按照日期合併同一天預約
    var tempArr = {};
    $.each(arr, function (index, item) {
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

    return tempArr;
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

    this.successCallback = function (data) {

        if (data['ResultCode'] === "1") {
            var resultArr = data['Content'];

            if (key == "apprrs") {

                var reserveLocal = JSON.parse(localStorage.getItem(versionKey));
                if (reserveLocal == null) {
                    for (var i in resultArr) {
                        resultArr[i].type = key;
                        resultArr[i].item = rrsStr + resultArr[i].MeetingRoomName;
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(resultArr));
                } else {
                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(reserveLocal[0].result.Content));
                }

            } else if (key == "apprelieve") {

                var reserveLocal = JSON.parse(localStorage.getItem(versionKey));
                if (reserveLocal == null) {
                    for (var i in resultArr) {
                        resultArr[i].type = key;
                        resultArr[i].item = relieveStr;
                        resultArr[i].ReserveBeginTime = new Date(resultArr[i].ReserveBeginTime).hhmm();
                        resultArr[i].ReserveEndTime = new Date(resultArr[i].ReserveEndTime).hhmm();
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(resultArr));
                } else {
                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(reserveLocal[0].result.Content));
                }

            } else if (key == "appparking") {

                var reserveLocal = JSON.parse(localStorage.getItem(versionKey));
                if (reserveLocal == null) {
                    for (var i in resultArr) {
                        resultArr[i].type = key;
                        resultArr[i].item = parkingStr;
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(resultArr));
                } else {
                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(reserveLocal[0].result.Content));
                }

            } else if (key == "appmassage") {

                var reserveLocal = JSON.parse(localStorage.getItem(versionKey));
                if (reserveLocal == null) {
                    for (var i in resultArr) {
                        resultArr[i].type = key;
                        resultArr[i].item = massageStr;
                        resultArr[i].ReserveBeginTime = new Date(resultArr[i].ReserveBeginTime).hhmm();
                        resultArr[i].ReserveEndTime = new Date(resultArr[i].ReserveEndTime).hhmm();
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(resultArr));
                } else {
                    window.sessionStorage.setItem(key + 'Reserve', JSON.stringify(reserveLocal[0].result.Content));
                }

            }

        } else {
            //如果没数据，当前key存local空数组
            window.sessionStorage.setItem(key + 'Reserve', JSON.stringify([]));

        }

        var rrsReserve = JSON.parse(sessionStorage.getItem('apprrsReserve'));
        var relieveReserve = JSON.parse(sessionStorage.getItem('apprelieveReserve'));
        var parkingReserve = JSON.parse(sessionStorage.getItem('appparkingReserve'));
        var massageReserve = JSON.parse(sessionStorage.getItem('appmassageReserve'));

        if (rrsReserve !== null && relieveReserve !== null && parkingReserve !== null && massageReserve !== null) {
            //合并
            var arr = mergeAllReserve(rrsReserve, relieveReserve, parkingReserve, massageReserve);
            //排序
            var list = formatReserveList(arr);

            window.sessionStorage.setItem('reserveList', JSON.stringify(list));
            window.sessionStorage.setItem('changeReserveListDirty', 'Y');
        }

        function mergeAllReserve(arr1, arr2, arr3, arr4) {
            arr1.push.apply(arr1, arr2);
            arr1.push.apply(arr1, arr3);
            arr1.push.apply(arr1, arr4);
            return arr1;
        }
    };

    var __construct = function () {
        CustomAPIByKey("POST", true, key, secret, "QueryMyReserve", self.successCallback, self.failCallback, queryData, "", 60 * 60, "low");
    }();
}