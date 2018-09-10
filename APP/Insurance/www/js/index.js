
var htmlContent = '';
var initialAppName = "Insurance";
var appKeyOriginal = "appinsurance";
var appKey = "appinsurance";
var appSecretKey = "e85c0c548016c12b5ef56244067ab616";
var pageList = ["viewMain", "viewPanel", "viewContact", "viewFamilyData", "viewPersonalInsurance", "viewApplyInsurance"];
var visitedPageList = ["viewMain"];
var addFamilyOrNot;    //眷屬資料是新增還是編輯
var viewListInit = true, viewSignupInit = true, viewFamilyInit = true;
var clickEditSettingID = '';
var clickFamilyID, clickInsID, clickAppID, clickFamilyName, clickRelation, clickAge, clickBirth, clickID; 
var clickCanApply, clickDealwith, clickInsuredday, clickApplyday, clickDealday, clickReason, clickSubsidy, clickCerti, clickHealthcard;
var applyType, nextPage;
var viewPersonalInsuranceShow = false;
var activePageListID;
var scrollClassName;

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    //loadingMask("show");
    $.mobile.changePage('#viewMain');
    if (device.platform === "iOS") {
        $('.page-main').css({'padding-top': '0.1vw'});
    }
}

function onBackKeyDown() {
    var activePageID = visitedPageList[visitedPageList.length - 1];
    var prePageID = visitedPageList[visitedPageList.length - 2];
    if (checkPopupShown()) {
        var popupID = $(".ui-popup-active")[0].children[0].id;
        $('#' + popupID).popup("close");
    } else if ($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel("close");
    } else if ($("#applyRemark").is(":focus")) {
        $("#applyRemark").blur();
    } else if ($("#backMain").css("display") == "block") {
        $("#backMain").click();
    } else if ($("#backFamilyList").css("display") == "block") {
        $("#backFamilyList").click();
    } else if ($("#backContactInfo").css("display") == "block") {
        $("#backContactInfo").click();
    } else if ($("#backPersonalInsuranceFromApply").css("display") == "block") {
        $("#backPersonalInsuranceFromApply").click();
    } else if ($("#backPersonalInsuranceFromDetail").css("display") == "block") {
        $("#backPersonalInsuranceFromDetail").click();
    } else if ($("#backApplyInsurance").css("display") == "block") {
        $("#backApplyInsurance").click();
    } else if ($("#backWithdrawDetail").css("display") == "block") {
        $("#backWithdrawDetail").click();
    } else if (activePageID === "viewMain") {
        if ($("#mainTab :radio:checked").val() == 'tab1') {
            navigator.app.exitApp();
        } else if ($("#mainTab :radio:checked").val() == 'tab2') {
            $("input[id=tab1]").trigger('click');
            $("label[for=tab1]").addClass('ui-btn-active');
            $("label[for=tab2]").removeClass('ui-btn-active');
            $("label[for=tab3]").removeClass('ui-btn-active');
        } else {
            $("input[id=tab1]").trigger('click');
            $("label[for=tab1]").addClass('ui-btn-active');
            $("label[for=tab2]").removeClass('ui-btn-active');
            $("label[for=tab3]").removeClass('ui-btn-active');
        }
    } else if (activePageID === "viewPersonalInsurance") {
        if ($("label[for=fam-insur-tab-1]").hasClass("ui-btn-active")) {
            visitedPageList.pop();
            changePageByPanel(prePageID);
        } else {
            $("input[id=fam-insur-tab-1]").trigger('click');
            $("label[for=fam-insur-tab-1]").addClass('ui-btn-active');
            $("label[for=fam-insur-tab-2]").removeClass('ui-btn-active');
        } 
    } else if (visitedPageList.length == 1) {
        navigator.app.exitApp();
    } else {
        visitedPageList.pop();
        changePageByPanel(prePageID);
    }

    
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

function transferBirthToAge(birthday){
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear(); 
    var birthMonth = today.getMonth() - birthDate.getMonth();
    if (birthMonth < 0 || (birthMonth === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//Set Each Tab Height in different View to Scroll Smoothly
function scrollHeightByTab(viewName, className, num) {
    // Tab1/Tab2/Tab3 height
    var tabHeight = $('.'+ className +' > div:nth-child(1)').height();
    var mainHeight = $('.'+ className +' > div:nth-child('+ num +')').height() + tabHeight;
    var headHeight = $('#'+ viewName +' .page-header').height();
    var totalHeight;
    if (device.platform === "iOS") {
        totalHeight = (mainHeight + headHeight + iOSFixedTopPX()).toString();
    } else {
        totalHeight = (mainHeight + headHeight).toString();
    }
    $('.'+ className +' > div:nth-child('+ num +')').css('height', totalHeight + 'px'); 
}

function scrollHeightFixedPage(viewName, className) {
    var mainHeight = $('.'+ className +' > div').height();
    var headHeight = $('#'+ viewName +' .page-header').height();
    var totalHeight;
    if (device.platform === "iOS") {
        totalHeight = (mainHeight + headHeight + iOSFixedTopPX()).toString();
    } else {
        totalHeight = (mainHeight + headHeight).toString();
    }
    $('.'+ className +' > div').css('height', totalHeight + 'px'); 
}     
