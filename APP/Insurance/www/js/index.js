
var htmlContent = '';
var initialAppName = "Insurance";
var appKeyOriginal = "appinsurance";
var appKey = "appinsurance";
var appSecretKey = "e85c0c548016c12b5ef56244067ab616";
var pageList = ["viewMain","viewTalk", "viewQRScanner", "viewQRCodeCreate"];

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    //loadingMask("show");
    $.mobile.changePage('#viewMain');
    if (device.platform === "iOS") {
        $('.page-main').css({'padding-top': '0.1vw'});
    }
}

function onBackKeyDown() {

}
