
//page-main height
function getPageMainHeight(view) {
    var win = $(window).height();
    var header = $('#' + view + ' .page-header').height();
    var main;
    if(device.platform === "iOS") {
        main = win - header - iOSFixedTopPX();
    } else {
        main = win - header;
    }
    return main.toString();
}