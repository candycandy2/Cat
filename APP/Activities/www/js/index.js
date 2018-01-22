
/*global variable, function*/
//var lastPageID = "viewActivitiesSignup";
var activitiesListQueryData, activitiesDetailQueryData, activitiesSignupQueryData, activitiesSignupManageQueryData;
var activitiesSignupConfirmQueryData, activitiesSignupCancelQueryData, activitiesSignupFamilyQueryData;
var activitiesSignupEmployeeQueryData, activitiesRecordQueryData, activitiesFamilyQueryData;
var activitiesFamilyAddQueryData, activitiesFamilyUpdateQueryData, activitiesFamilyDeleteQueryData;
var pageList = ["viewPanel", "viewActivitiesList", "viewActivitiesRecord", "viewMyFamilyDatum", "viewActivitiesDetail", "viewActivitiesSignup", "viewActivitiesManage"];
var pageVisitedList = ["viewActivitiesList"];
var initialAppName = "Activities";
var appKeyOriginal = "appactivities";
var appKey = "appactivities";
var appSecretKey = "b1580f5dcdef21cf35993f1310edf511";
var htmlContent = "";
var myEmpNo = "1501005";
//var myEmpNo = "1705055";
var viewSignupInit = true, viewFamilyInit = true, viewRecordInit = true;


window.initialSuccess = function () {
    // 1. get activities list
    activitiesListQueryData = '<LayoutHeader><EmployeeNo>' + myEmpNo + '</EmployeeNo></LayoutHeader>';
    ActivitiesListQuery();

    // 2. get family list
    activitiesFamilyQueryData = '<LayoutHeader><EmployeeNo>' + myEmpNo + '</EmployeeNo></LayoutHeader>';
    ActivitiesFamilyQuery();

    // 3. get record list
    activitiesRecordQueryData = '<LayoutHeader><EmployeeNo>' + myEmpNo + '</EmployeeNo></LayoutHeader>';
    ActivitiesRecordQuery();

    // 4. changepage
    $.mobile.changePage("#viewActivitiesList");

}

//[Android]Handle the back button
function onBackKeyDown() {
    //var activePageID = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    var activePageID = pageVisitedList[pageVisitedList.length - 1];
    var prePageID = pageVisitedList[pageVisitedList.length - 2];

    if (checkPopupShown()) {
        var popupID = $(".ui-popup-active")[0].children[0].id;
        $('#' + popupID).popup("close");
    } else if ($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel("close");
    } else if (pageVisitedList.length == 1) {
        navigator.app.exitApp();
    } else {
        changePageByPanel(prePageID, false);
    }
}

function changePageByPanel(pageId, panel) {
    if ($.mobile.activePage[0].id !== pageId) {
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        //lastPageID = $.mobile.activePage[0].id;
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
        //切换菜单才添加到數組，back返回时不添加並刪除最後一頁
        if (panel) {
            pageVisitedList.push(pageId);
        } else {
            pageVisitedList.pop();
        }
    }
    $("#mypanel").panel("close");
}
