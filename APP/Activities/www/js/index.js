
/*global variable, function*/
//var lastPageID = "viewActivitiesSignup";
var activitiesListQueryData, activitiesDetailQueryData, activitiesSignupQueryData,
    activitiesSignupManageQueryData, activitiesSignupConfirmQueryData, activitiesSignupCancelQueryData,
    activitiesRecordCancelQueryData, activitiesSignupFamilyQueryData, activitiesSignupEmployeeQueryData,
    activitiesRecordQueryData, activitiesFamilyQueryData, activitiesFamilyAddQueryData,
    activitiesFamilyUpdateQueryData, activitiesFamilyDeleteQueryData, activitiesIsFullQueryData;
var pageList = ["viewPanel", "viewActivitiesList", "viewActivitiesRecord", "viewMyFamilyDatum", "viewActivitiesDetail", "viewActivitiesSignup", "viewActivitiesManage", "viewSelectFamily"];
var initialAppName = "Activities";
var appKeyOriginal = "appactivities";
var appKey = "appactivities";
var appSecretKey = "b1580f5dcdef21cf35993f1310edf511";
var htmlContent = "";
//var myEmpNo = "0207379";
//var myEmpNo = "1501005";
var pageVisitedList = ["viewActivitiesList"];
var addFamilyOrNot;    //眷屬資料是新增還是編輯
var recordArr = [];    //活動記錄列表
var selectFamilyLimit = 0;    //選擇眷屬的人數限制
var familyIsSignup;    //眷屬是否報名
var viewSignupInit = true, viewFamilyInit = true, activityStatus = "", activityModel = "", activityID = "";
var overTime = "";
var myEmpNo = "";

window.initialSuccess = function () {
    myEmpNo = localStorage.getItem("emp_no");

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

        //如果是超時popup,重新獲取活動列表
        if (popupID == "detailTimeOverMsg") {
            $("#detailTimeOverBtn").trigger("click");
        } else if (popupID == "signupTimeOverMsg") {
            $("#signupTimeOverBtn").trigger("click");
        } else if (popupID == "manageTimeOverMsg") {
            $("#manageTimeOverBtn").trigger("click");
        } else if (popupID == "selectTimeOverMsg") {
            $("#selectTimeOverBtn").trigger("click");
        } else if (popupID == "recordTimeOverMsg") {
            $("#recordTimeOverBtn").trigger("click");
        } else if (popupID == "signupOverLimitMsg") {
            ActivitiesListQuery();
            if (activityModel == "3") {
                for (var i = 0; i < 3; i++) {
                    pageVisitedList.pop();
                }
            } else {
                for (var i = 0; i < 2; i++) {
                    pageVisitedList.pop();
                }
            }
            $.each($("#openList .activity-list"), function (index, item) {
                if ($(item).attr("data-id") == activityID) {
                    $(item).trigger("click");
                }
            });
        }
        
    } else if ($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel("close");
    } else if (activePageID == "viewActivitiesSignup") {
        popupMsgInit('.signupNoFinish');
    } else if (activePageID == "viewActivitiesManage" && ($("#viewPersonManage").css("display") == "block" || $("#viewFamilyManage").css("display") == "block")) {
        popupMsgInit('.updateNoFinish');
    } else if (activePageID == "viewMyFamilyDatum" && $("#viewFamilyEdit").css("display") == "block" && addFamilyOrNot == true) {
        popupMsgInit('.confirmCancelAddFamily');
    } else if (activePageID == "viewMyFamilyDatum" && $("#viewFamilyEdit").css("display") == "block" && addFamilyOrNot == false) {
        popupMsgInit('.confirmCancelEditFamily');
    } else if (activePageID == "viewSelectFamily") {
        popupMsgInit('.selectNoFinish');
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

//根據不同活動類型，show不同頁面
function showViewByModel(view, model) {
    $.each($("#" + view + " .page-main > div"), function (index, item) {
        if ($(item).attr("data-model") == model) {
            $(item).show();
        } else {
            $(item).hide();
        }
    });
}

//獲取所有自定義欄位並放入數組當中
function getCustomField(obj) {
    var list = [];
    //最多5个自定义栏位
    for (var i = 1; i < 6; i++) {
        list.push({
            "ColumnName": obj["ColumnName_" + i],
            "ColumnType": obj["ColumnType_" + i],
            "ColumnItem": obj["ColumnItem_" + i],
            "ColumnAnswer": obj["ColumnAnswer_" + i] == undefined ? "" : obj["ColumnAnswer_" + i]
        });
    }

    //去除空白欄位
    for (var i = 0; i < list.length; i++) {
        if (list[i]["ColumnName"] == "") {
            list.splice(i, 1);
            i--;
        }
    }
    return list;
}

//生成Select-dropdownlist欄位
function setSelectCustomField(arr, i, page, id, container) {
    //1.聲明dropdownlist對象
    var columnData = {
        id: "column-popup-" + id + "-" + i,
        option: [],
        title: '',
        defaultText: langStr["str_040"],
        changeDefaultText: true,
        attr: {
            class: "tpl-dropdown-list-icon-arrow"
        }
    };

    //2.生成html
    var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
        + arr[i]["ColumnName"]
        + '</label><div id="' + id + i + '" class="' + id + '"></div></div>';

    //3.append
    $("." + container).append(fieldContent);

    //4.取value值
    var valueArr = arr[i]["ColumnItem"].split(";");

    //5.动态生成popup
    for (var j in valueArr) {
        columnData["option"][j] = {};
        columnData["option"][j]["value"] = valueArr[j];
        columnData["option"][j]["text"] = valueArr[j];
    }

    //6.生成dropdownlist
    tplJS.DropdownList(page, id + i, "prepend", "typeB", columnData);

    //7.如果有值，選中默認值
    if (arr[i]["ColumnAnswer"] != "") {
        $.each($("#column-popup-" + id + "-" + i + "-option-list li"), function (index, item) {
            if (arr[i]["ColumnAnswer"] == $(item).text()) {
                $(item).trigger("click");
            }
        });
    }
}

//選擇眷屬的select
function setSelectCustomField2(index, arr, i, page, id, $container) {
    //1.聲明dropdownlist對象
    var columnData = {
        id: "column-popup-" + index + "-" + id + "-" + i,
        option: [],
        title: '',
        defaultText: langStr["str_040"],
        changeDefaultText: true,
        attr: {
            class: "tpl-dropdown-list-icon-arrow"
        }
    };

    //2.生成html
    var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
        + arr[i]["ColumnName"]
        + '</label><div id="' + index + id + i + '" class="' + id + '"></div></div>';

    //3.append
    $container.append(fieldContent);

    //4.取value值
    var valueArr = arr[i]["ColumnItem"].split(";");

    //5.动态生成popup
    for (var j in valueArr) {
        columnData["option"][j] = {};
        columnData["option"][j]["value"] = valueArr[j];
        columnData["option"][j]["text"] = valueArr[j];
    }

    //6.生成dropdownlist
    tplJS.DropdownList(page, index + id + i, "prepend", "typeB", columnData);

    //7.如果有值，選中默認值
    if (arr[i]["ColumnAnswer"] != "") {
        $.each($("#column-popup-" + index + "-" + id + "-" + i + "-option-list li"), function (index, item) {
            if (arr[i]["ColumnAnswer"] == $(item).text()) {
                $(item).trigger("click");
            }
        });
    }
}

//生成Text欄位
function setTextCustomField(arr, i, id, container) {
    var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
        + arr[i]["ColumnName"]
        + '</label><input id="' + id + i + '" type="text" maxlength="50" onkeyup="stripScript(this)" data-role="none" class="' + id + '" value="'
        + (arr[i]["ColumnAnswer"] == "" ? "" : arr[i]["ColumnAnswer"])
        + '"></div>';

    $("." + container).append(fieldContent);
}

//選擇眷屬的Text
function setTextCustomField2(index, arr, i, id, $container) {
    var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
        + arr[i]["ColumnName"]
        + '</label><input id="' + index + id + i + '" type="text" maxlength="50" onkeyup="stripScript(this)" data-role="none" class="' + id + '" value="'
        + (arr[i]["ColumnAnswer"] == "" ? "" : arr[i]["ColumnAnswer"])
        + '"></div>';

    $container.append(fieldContent);
}

//生成Checkbox自定義欄位
function setCheckboxCustomField(arr, i, id, container) {
    //先處理checkbox所有選項
    var mutipleArr = arr[i]["ColumnItem"].split(";");
    var mutipleContent = "";

    for (var j in mutipleArr) {
        mutipleContent += '<div data-name="checkbox-' + id + '-' + j
            + '"><img src="img/checkbox_n.png" class="family-signup-checkbox"><span>'
            + mutipleArr[j]
            + '</span></div>';
    }

    var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
        + arr[i]["ColumnName"]
        + '</label><div class="custom-field-checkbox font-style3 font-color1 checkbox-' + id + '-' + i + '">';

    $("." + container).append(fieldContent + mutipleContent + "</div><div>");

    //選中默認值
    if (arr[i]["ColumnAnswer"] != "") {
        var valueArr = arr[i]["ColumnAnswer"].split(";");
        $.each($(".checkbox-" + id + "-" + i + " span"), function (index, item) {
            for (var j in valueArr) {
                if ($(item).text() == valueArr[j]) {
                    $(item).prev().attr("src", "img/checkbox_s.png");
                    //$(item).prev().trigger("click");
                }
            }
        });
    }
}

//選擇眷屬的Checkbox
function setCheckboxCustomField2(index, arr, i, id, $container) {
    //先處理checkbox所有選項
    var mutipleArr = arr[i]["ColumnItem"].split(";");
    var mutipleContent = "";

    for (var j in mutipleArr) {
        mutipleContent += '<div data-name="checkbox-' + index + '-' + id + '-' + j
            + '"><img src="img/checkbox_n.png" class="family-signup-checkbox"><span>'
            + mutipleArr[j]
            + '</span></div>';
    }

    var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
        + arr[i]["ColumnName"]
        + '</label><div class="custom-field-checkbox font-style3 font-color1 checkbox-' + index + '-' + id + '-' + i + '">';

    $container.append(fieldContent + mutipleContent + "</div><div>");

    //選中默認值
    if (arr[i]["ColumnAnswer"] != "") {
        var valueArr = arr[i]["ColumnAnswer"].split(";");
        $.each($(".checkbox-" + index + "-" + id + "-" + i + " span"), function (index, item) {
            for (var j in valueArr) {
                if ($(item).text() == valueArr[j]) {
                    $(item).prev().attr("src", "img/checkbox_s.png");
                }
            }
        });
    }
}

//檢查所有自定義欄位是否爲空，並保存數據
function saveValueAndCheckForm(arr, name, value, bool, btn) {
    //bool为true，添加checkbox;若为false，删除checkbox;若为other，text和select赋值
    for (var i in arr) {
        if (name == arr[i]["ColumnName"] && bool == true) {
            arr[i]["ColumnAnswer"] += (";" + value);
        } else if (name == arr[i]["ColumnName"] && bool == false) {
            arr[i]["ColumnAnswer"] = arr[i]["ColumnAnswer"].replace(";" + value, "");
        } else if (name == arr[i]["ColumnName"] && bool == null) {
            arr[i]["ColumnAnswer"] = value;
        }
    }

    //检查表单是否为空
    for (var i in arr) {
        if (arr[i]["ColumnAnswer"] == "") {
            $("#" + btn).addClass("btn-disabled");
            break;
        } else {
            $("#" + btn).removeClass("btn-disabled");
        }
    }
    //console.log(arr);
}

//按時段編號排序
function sortByTimeID(prop1) {
    return function (obj1, obj2) {
        //time
        var val1 = obj1[prop1];
        var val2 = obj2[prop1];

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
            return 0;
        }
    }
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

    // var reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]/g;
    // if(s.match(reg)) {
    //     s = s.replace(reg, '');
    // }
    // var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
    // s = s.replace(patt, function (char) {
    //     var H, L, code;
    //     if (char.length === 2) {
    //         H = char.charCodeAt(0); // 取出高位  
    //         L = char.charCodeAt(1); // 取出低位  
    //         code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
    //         return "&#" + code + ";";
    //     } else {
    //         return char;
    //     }
    // });

    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    str.value = rs;
}

//獲取當前時間，並轉換成int類型
function getTimeNow() {
    var time = new Date(Date.now());
    var currentYear = time.getFullYear();
    var currentMonth = ((time.getMonth() + 1) < 10) ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
    var currentDate = (time.getDate() < 10) ? "0" + time.getDate() : time.getDate();
    var currentHour = (time.getHours() < 10 ? "0" + time.getHours() : time.getHours());
    var currentMin = time.getMinutes();
    var timeNow = parseInt(currentYear + currentMonth + currentDate + currentHour + currentMin);
    return timeNow;
}

//處理活動結束時間，並轉換成int類型
function timeConversion(str) {
    var time = str.replace(/\//g, "").replace(/:/g, "").replace(/ /g, "");
    return parseInt(time);
}