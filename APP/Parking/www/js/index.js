var pageList = ["viewMain"];
var htmlContent = '';

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    //loadingMask("show");
    $.mobile.changePage('#viewMain');
    if (device.platform === "iOS") {
        $('.page-main').css({'padding-top': '0.1vw'});
    }
}

