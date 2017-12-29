/*******************************************************************************************/
/********************************** Date Ttme function *************************************/
/*******************************************************************************************/

//covert date or time format
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

Date.prototype.yyyymm = function(symbol) {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    return yyyy + symbol + (mm[1] ? mm : '0' + mm[0]);
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

Date.prototype.TimeZoneConvert = function() {
    //[this & return] format=> "2017-01-20 09:23:28"
    var timeZoneOffset = new Date().getTimezoneOffset();
    var timeZoneFixHour = timeZoneOffset / -60;
    var timeZoneFixSecond = timeZoneFixHour * 60 * 60;

    var dateStrTimestamp = this / 1000;
    var fixedDateStrTimestamp = dateStrTimestamp + timeZoneFixSecond;
    var fixedDateStr = new Date(fixedDateStrTimestamp * 1000);

    return fixedDateStr.getFullYear() + "-" + padLeft(parseInt(fixedDateStr.getMonth() + 1, 10), 2) + "-" + padLeft(fixedDateStr.getUTCDate(), 2) + " " +
        padLeft(fixedDateStr.getHours(), 2) + ":" + padLeft(fixedDateStr.getMinutes(), 2) + ":" + padLeft(fixedDateStr.getSeconds(), 2);
};

Date.prototype.TimeStamp = function() {
    return parseInt(this / 1000, 10);
};

function addThirtyMins(time) {
    var timeStr = new Date(new Date().toDateString() + ' ' + time)
    timeStr.setMinutes(timeStr.getMinutes() + 30);
    var result = timeStr.hhmm();
    return result;
}

function checkDataExpired(time, num, pram) {
    //num can't use string, use int
    var today = new Date();
    var lastTime = new Date(time);
    switch (pram) {
        case 'dd':
            lastTime.setDate(lastTime.getDate() + num);
            break;
        case 'hh':
            lastTime.setHours(lastTime.getHours() + num);
            break;
        case 'mm':
            lastTime.setMinutes(lastTime.getMinutes() + num);
            break;
        case 'ss':
            lastTime.setSeconds(lastTime.getSeconds() + num);
            break;
        case 'MM':
            lastTime.setMonth(lastTime.getMonth() + num);
            break;
        case 'yy':
            lastTime.setYear(lastTime.getYear() + num);
            break;
        default:
            break;
    }

    if (today > lastTime) {
        return true; //Expired
    } else {
        return false;
    }
}

function dateFormatYMD(date) {
    //"2017-01-20 09:23:28" is Invalid Date Format in iOS,
    //need to change into "2017/01/20 09:23:28"
    return date.replace(/-/g, '/');
}