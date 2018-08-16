
//获取所有预约
function getMyReserve(key, secret) {
    var self = this;
    var today = new Date();
    var queryData = '<LayoutHeader><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><NowDate>' + today.yyyymmdd('') + '</NowDate></LayoutHeader>';
    var rrsStr = langStr["str_063"],    //预约
        relieveStr = langStr["str_064"],    //物理治疗
        parkingStr = langStr["str_065"],    //车位预约
        massageStr = langStr["str_066"];    //按摩预约

    var versionKey = "";
    if (loginData["versionName"].indexOf("Staging") !== -1) {
        versionKey = key + "test";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        versionKey = key + "dev";
    } else {
        versionKey = key + "";
    }

    this.successCallback = function (data) {
        //console.log(data);

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

        } else if (data['ResultCode'] === "002901") { }

        if (key == "appmassage") {
            formatReserveList();
        }

        if (reserveDirty && reserveCalendar != null) {
            formatReserveList();
            reserveCalendar.reserveData = reserveList;
            reserveCalendar.refreshReserve(reserveList);
            reserveDirty = false;
        }
    };

    var __construct = function () {
        CustomAPIByKey("POST", false, key, secret, "QueryMyReserve", self.successCallback, self.failCallback, queryData, "", 60*60, "low");
    }();
}