
/*global variable, function*/
var lastPageID = "viewActivitiesSignup";
var pageList = ["viewPanel","viewActivitiesSignup","viewActivitiesRecord","viewMyFamilyDatum"];
var pageVisitedList = ["viewActivitiesSignup"];
var htmlContent = "";


function changePageByPanel(pageId) {
    if($.mobile.activePage[0].id !== pageId) {
        //loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        lastPageID = $.mobile.activePage[0].id;
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
        //切换菜单才添加，back返回时不添加
        if(pageId !== pageVisitedList[pageVisitedList.length-1]) {
            pageVisitedList.push(pageId);
        }
    }
    $("#mypanel").panel("close");
}