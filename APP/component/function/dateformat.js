
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
