
var htmlContent = '';
var initialAppName = "Insurance";
var appKeyOriginal = "appinsurance";
var appKey = "appinsurance";
var appSecretKey = "e85c0c548016c12b5ef56244067ab616";
var pageList = ["viewMain", "viewPanel", "viewContact", "viewInsuranceInfo", "viewFamilyData"];
var visitedPageList = ["viewMain"];
var addFamilyOrNot;    //眷屬資料是新增還是編輯
var viewListInit = true, viewSignupInit = true, viewFamilyInit = true;

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

//先按照關係排序，關係一樣再按照中文姓名排序
function sortByRelationship(prop1, prop2) {
    return function (obj1, obj2) {
        //relationship
        var val1 = obj1[prop1];
        var val2 = obj2[prop1];
        //familyname
        var value1 = obj1[prop2];
        var value2 = obj2[prop2];
        //轉換成numer類型
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }

        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return value1.localeCompare(value2, "zh");
        }
    }
}

//禁止文本框輸入特殊字符
function stripScript(str) {
    var pattern = new RegExp("[&'<>”“‘’\"]");
    var s = str.value;
    var rs = "";

    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    str.value = rs;
}
