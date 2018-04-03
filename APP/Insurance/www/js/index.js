
var htmlContent = '';
var initialAppName = "Insurance";
var appKeyOriginal = "appinsurance";
var appKey = "appinsurance";
var appSecretKey = "e85c0c548016c12b5ef56244067ab616";
var pageList = ["viewMain", "viewPanel", "viewContact"];
var visitedPageList = ["viewMain"];

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

function changePageByPanel(pageId) {
    if($.mobile.activePage[0].id !== pageId) {
        loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        lastPageID = $.mobile.activePage[0].id;
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
        //切换菜单才添加，back返回时不添加
        if(pageId !== visitedPageList[visitedPageList.length-1]) {
            visitedPageList.push(pageId);
        }
    }
    $("#mypanel").panel("close");
}
