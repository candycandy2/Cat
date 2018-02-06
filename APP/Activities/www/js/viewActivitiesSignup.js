
$("#viewActivitiesSignup").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var timeoutQueryEmployee = null;
        var limitPlace, currentPlace;     //限制人數和目前人數
        var teamName, departNo, submitID, submitModel;
        var personSubmitPlace;
        var memberNoArr = [];
        var personFieldArr = [];
        var familyFieldArr = [];
        var fieldArr = [];
        var timeoutCheckFamilySignup = null;
        var timeoutCheckPersonSignup = null;
        var selectLength = 0, textLength = 0, checkboxLength = 0;
        //var selectClassName = "familySignupSelect";
        var checkboxArr = [];
        var employeeData = {
            id: "employee-popup",
            option: [],
            title: '<input type="search" id="searchBar" />',
            //defaultText: "請選擇",
            defaultText: langStr["str_040"],
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };

        /********************************** function *************************************/
        //我要報名
        window.ActivitiesSignupQuery = function (model) {

            this.successCallback = function (data) {
                console.log(data);

                //報名提交的活動類型
                submitModel = model;
                if (data["ResultCode"] == "1") {
                    var signupObj = data["Content"][0];
                    submitID = signupObj["ActivitiesID"];

                    if (model == "1") {
                        //页面初始化
                        $("#personLimitPlace").empty();
                        $("#person-popup-option-popup").remove();
                        $(".person-signup-custom-field").empty();
                        for (var i = 0; i < 5; i++) {
                            $("#column-popup-personSignupSelect-" + i + "-option-screen").remove();
                            $("#column-popup-personSignupSelect-" + i + "-option-popup").remove();
                        }
                        $("#personSignupBtn").addClass("btn-disabled");
                        //赋值
                        $("#personSignupThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#personSignupName").text(signupObj["ActivitiesName"]);
                        $(".person-signup-remark").empty().append("<div>" + signupObj["ActivitiesRemarks"] + "</div>");
                        //根据限制人数动态生成报名人数栏位
                        selectPersonByLimit(signupObj["LimitPlaces"]);

                        //獲取自定義欄位數組並去空
                        personFieldArr = getCustomField(signupObj);
                        if (personFieldArr.length == 0) {
                            $("#personSignupBtn").removeClass("btn-disabled");
                        } else {
                            //根據欄位類型，生成不同欄位
                            for (var i in personFieldArr) {
                                if (personFieldArr[i]["ColumnType"] == "Select") {
                                    setSelectCustomField(personFieldArr, i, "viewActivitiesSignup", "personSignupSelect", "person-signup-custom-field");

                                } else if (personFieldArr[i]["ColumnType"] == "Text") {
                                    setTextCustomField(personFieldArr, i, "personSignupText", "person-signup-custom-field");

                                } else if (personFieldArr[i]["ColumnType"] == "Multiple") {
                                    setCheckboxCustomField(personFieldArr, i, "personSignupCheckbox", "person-signup-custom-field");

                                }
                            }
                        }

                    } else if (model == "3") {
                        //頁面初始化
                        $(".family-signup-custom-field").empty();
                        for (var i = 0; i < 5; i++) {
                            $("#column-popup-" + i + "-option-screen").remove();
                            $("#column-popup-" + i + "-option-popup").remove();
                        }
                        $("#selectFamilyBtn").addClass("btn-disabled");
                        selectLength = 0, textLength = 0, checkboxLength = 0;

                        $("#familySignupThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#familySignupName").text(signupObj["ActivitiesName"]);
                        $("#familyLimitPlace").text(signupObj["LimitPlaces"]);
                        $("#familyEmpName").text(signupObj["EmployeeName"]);
                        $("#familyEmpRlts").text(signupObj["EmployeeRelationship"]);
                        $("#familyEmpGender").text(signupObj["EmployeeGender"]);
                        $("#familyEmpID").text(signupObj["EmpoyeeID"]);
                        $("#familyEmpBirth").text(signupObj["EmployeeBirthday"]);

                        //選擇眷屬頁面
                        $("#familySelectThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#familySelectName").text(signupObj["ActivitiesName"]);
                        $("#familySelectLimitPlace").text(signupObj["LimitPlaces"]);
                        $(".select-family-remark").empty().append("<div>" + signupObj["ActivitiesRemarks"] + "</div>");

                        //处理自定义栏位，放入數組中
                        familyFieldArr = getCustomField(signupObj);

                        // familyFieldArr = [{
                        //     "ColumnName": "自助餐",
                        //     "ColumnType": "Multiple",
                        //     "ColumnItem": "火鍋;燒烤;拉麪",
                        //     "ColumnAnswer": ""
                        // },
                        // {
                        //     "ColumnName": "攜帶人數",
                        //     "ColumnType": "Select",
                        //     "ColumnItem": "1;2;3;4;5;6",
                        //     "ColumnAnswer": ""
                        // },
                        // {
                        //     "ColumnName": "意見",
                        //     "ColumnType": "Text",
                        //     "ColumnItem": "",
                        //     "ColumnAnswer": ""
                        // },
                        // {
                        //     "ColumnName": "建議",
                        //     "ColumnType": "Text",
                        //     "ColumnItem": "",
                        //     "ColumnAnswer": ""
                        // }];
                        ///familyFieldArr = [];
                        fieldArr = customFieldByItem(familyFieldArr);

                        //根據欄位類型，生成不同欄位
                        for (var i in familyFieldArr) {
                            if (familyFieldArr[i]["ColumnType"] == "Select") {
                                selectLength++;
                                setSelectCustomField(familyFieldArr, i, "viewActivitiesSignup", "familySignupSelect", "family-signup-custom-field");

                            } else if (familyFieldArr[i]["ColumnType"] == "Text") {
                                textLength++;
                                setTextCustomField(familyFieldArr, i, "familySignupText", "family-signup-custom-field");

                            } else if (familyFieldArr[i]["ColumnType"] == "Multiple") {
                                checkboxLength++;
                                setCheckboxCustomField(familyFieldArr, i, "familySignupCheckbox", "family-signup-custom-field");

                            }
                        }

                    } else if (model == "4") {
                        $("#teamSignupThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#teamSignupName").text(signupObj["ActivitiesName"]);
                        $("#teamCurrentPlace").text("0");
                        $("#teamLimitPlace").text(signupObj["LimitPlaces"]);
                        $("#teamRemark").empty().append("<div>" + signupObj["ActivitiesRemarks"].replace("TeamNumber", signupObj["LimitPlaces"]) + "</div>");

                        //記錄已添加人數
                        limitPlace = signupObj["LimitPlaces"];
                        currentPlace = 0;

                    } else if (model == "5") {

                    }




                } else if (data["ResultCode"] == "045910") {

                }


                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_Signup", self.successCallback, self.failCallback, activitiesSignupQueryData, "");
            }();

        };

        //選擇眷屬
        window.ActivitiesSignupFamilyQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

                if (data["ResultCode"] == "1") {
                    var selectFamilyArr = data["Content"];
                    var selectContent = "";
                    for (var i in selectFamilyArr) {
                        selectContent += '<div><div class="select-family-tr"><div><img src="img/checkbox_n.png" class="family-checkbox-img"></div><div>'
                            + selectFamilyArr[i]["FamilyName"]
                            + '</div><div>'
                            + selectFamilyArr[i]["FamilyRelationshipDesc"]
                            + '</div><div>'
                            + selectFamilyArr[i]["FamilyGenderDesc"]
                            + '</div><div><img src="img/list_down.png" class="family-expand-img"></div></div><div class="select-family-detail"><div class="select-family-id font-style12 font-color2"><span>'
                            + langStr["str_048"]
                            + '</span><span> / </span><span>'
                            + langStr["str_049"]
                            + '</span></div><div class="select-family-birth font-style11 font-color1"><span>'
                            + selectFamilyArr[i]["FamilyID"]
                            + '</span><span> / </span><span>'
                            + selectFamilyArr[i]["FamilyBirthday"]
                            + '</span></div><div class="select-family-field">' + selectFieldByFamily(fieldArr, i, "family-select") + '</div></div></div>';
                    }

                    $(".select-family-tbody").empty().append(selectContent);

                }


                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Family", self.successCallback, self.failCallback, activitiesSignupFamilyQueryData, "");
            }();

        };

        //查詢員工，添加成員
        window.ActivitiesSignupEmployeeQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "1") {
                    var employeeArr = data["Content"];
                    var employeeList = "";
                    for (var i in employeeArr) {
                        employeeList += '<li class="tpl-option-msg-list" value="'
                            + employeeArr[i]["EmployeeNo"]
                            + '"><div style="width: 25VW;"><span>'
                            + employeeArr[i]["EmployeeDept"]
                            + '</span></div><div><span>'
                            + employeeArr[i]["EmployeeName"]
                            + '</span></div></li><hr class="ui-hr ui-hr-option">';
                    }

                    $("#employee-popup-option-list").empty().append(employeeList).children("ul hr:last-child").remove();
                    resizePopup("employee-popup-option");

                    $("#employee-popup-option-list").show();
                    $("#loaderQuery").hide();


                } else if (data["ResultCode"] == "045915") {
                    //查無員工資料
                    $("#employee-popup-option").popup("close");
                    popupMsgInit('.queryNoEmployee');
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Employee", self.successCallback, self.failCallback, activitiesSignupEmployeeQueryData, "");
            }();

        };

        //活動報名送出
        window.ActivitiesSignupConfirmQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

                if (data['ResultCode'] == "045911") {
                    //重新獲取報名列表
                    ActivitiesListQuery();

                    //跳轉
                    $.each($("#openList .activity-list"), function (index, item) {
                        if ($(item).attr("data-id") == submitID) {
                            $(item).trigger("click");
                        }
                    });

                    //清空欄位值
                    memberNoArr = [];
                    $("#departNo").val("");
                    $("#teamName").val("");
                    $(".team-signup-employee-list").empty();
                    $("#sendTeamSignup").addClass("btn-disabled");

                    //重新獲取報名記錄
                    ActivitiesRecordQuery();

                } else if (data['ResultCode'] == "045912") {
                    //失敗，報名組數超過剩餘名額
                    popupMsgInit('.overLimitMsg');
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Confirm", self.successCallback, self.failCallback, activitiesSignupConfirmQueryData, "");
            }();

        };

        //重新設置popup的size
        function resizePopup(popupID) {
            var popup = $("#" + popupID);
            var popupHeight = popup.height();
            var popupHeaderHeight = $("#" + popupID + " .header").height();
            var popupFooterHeight = popup.find("div[data-role='main'] .footer").height();

            //ui-content paddint-top/padding-bottom:3.07vw
            // var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 3.07 * 2 / 100, 10);

            //Ul margin-top:2.17vw
            // var ulMarginTop = parseInt(document.documentElement.clientWidth * 2.17 / 100, 10);
            // var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop, 10);
            var popupMainHeight = "200";
            popup.find("div[data-role='main'] .main").height(popupMainHeight);

            $('#' + popupID + '-screen.in').animate({
                'overflow-y': 'hidden',
                'touch-action': 'none',
                'height': $(window).height()
            }, 0, function () {
                var top = $('#' + popupID + '-screen.in').offset().top;
                if (top < 0) {
                    $('.ui-popup-screen.in').css({
                        'top': Math.abs(top) + "px"
                    });
                }
            });

            setTimeout(function () {
                var viewHeight = $(window).height();
                var popupHeight = popup.outerHeight();
                var viewTop = (viewHeight - popupHeight) / 2;
                popup.parent().css("top", viewTop + "px");
            }, 100);
        }

        //个人报名根据限制人数生成dropdownlist
        function selectPersonByLimit(limit) {
            //1.转换成number类型
            limit = Number(limit);

            //2.select
            var personData = {
                id: "person-popup",
                option: [],
                title: '',
                defaultText: "1",
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            //3.popup
            for (var i = 1; i <= limit; i++) {
                personData["option"][i - 1] = {};
                personData["option"][i - 1]["value"] = i;
                personData["option"][i - 1]["text"] = i;
            }

            //4.dropdownlist
            tplJS.DropdownList("viewActivitiesSignup", "personLimitPlace", "prepend", "typeB", personData);

            //5.默认选中“1”
            $.each($("#person-popup-option-list li"), function (index, item) {
                if ($(item).text() == "1") {
                    $(item).trigger("click");
                }
            });
        }

        //檢查組隊報名所有欄位
        function checkFieldByTeam() {
            if (currentPlace > 0 && $.trim($("#departNo").val()) !== "" && $.trim($("#teamName").val()) !== "") {
                $("#sendTeamSignup").removeClass("btn-disabled");
                //return true;
            } else {
                $("#sendTeamSignup").addClass("btn-disabled");
                //return false;
            }
        }

        //获取所有自定义栏位
        function getCustomField(arr) {
            var list = [];
            //最多5个自定义栏位
            for (var i = 1; i < 6; i++) {
                list.push({
                    "ColumnName": arr["ColumnName_" + i],
                    "ColumnType": arr["ColumnType_" + i],
                    "ColumnItem": arr["ColumnItem_" + i],
                    "ColumnAnswer": ""
                });
            }

            for (var i = 0; i < list.length; i++) {
                if (list[i]["ColumnName"] == "") {
                    list.splice(i, 1);
                    i--;
                }
            }
            return list;
        }

        function customFieldByItem(arr) {
            var list = [];
            for (var i in arr) {
                if (arr[i]["ColumnType"] == "Multiple") {
                    list.push({
                        "ColumnName": arr[i]["ColumnName"],
                        "ColumnType": arr[i]["ColumnType"],
                        "ColumnItem": arr[i]["ColumnItem"].split(";"),
                        "ColumnAnswer": ""
                    });
                } else {
                    list.push({
                        "ColumnName": arr[i]["ColumnName"],
                        "ColumnType": arr[i]["ColumnType"],
                        "ColumnItem": arr[i]["ColumnItem"],
                        "ColumnAnswer": ""
                    });
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
        }

        //生成每個眷屬的自定義欄位-select
        function selectFieldByFamily(arr, familyID, className) {
            var selectHtml = "";
            var textHtml = "";
            var checkboxHtml = "";

            for (var i in arr) {
                if (arr[i]["ColumnType"] == "Select") {
                    selectHtml += '<div class="custom-field"><label class="font-style11 font-color1">'
                        + arr[i]["ColumnName"]
                        + '</label><div id="' + familyID + "-" + i + '" class="' + className + "-select" + '"></div></div>';

                } else if (arr[i]["ColumnType"] == "Text") {
                    textHtml += '<div class="custom-field"><label class="font-style11 font-color1">'
                        + arr[i]["ColumnName"]
                        + '</label><input id="' + familyID + "-" + i + '" type="text" data-role="none" class="' + className + "-text" + '"></div>';

                } else if (arr[i]["ColumnType"] == "Multiple") {
                    var checkHtml = "";
                    for (var j in arr[i]["ColumnType"]) {
                        checkHtml += '<div class="' + className + '-checkbox-' + j
                            + '"><img src="img/checkbox_n.png" class="family-signup-checkbox"><span>'
                            + arr[i]["ColumnType"][j]
                            + '</span></div>';
                    }

                    checkboxHtml += '<div class="custom-field"><label class="font-style11 font-color1">'
                        + arr[i]["ColumnName"]
                        + '</label><div class="' + className + '-checkbox' + ' font-style3 font-color1">' + checkHtml + '</div></div>';

                }
            }

            return selectHtml + textHtml + checkboxHtml;
        }

        //生成Text自定義欄位
        function setTextCustomField(arr, i, id, container) {
            var fieldContent = '<div class="custom-field"><label for="' + id + i + '" class="font-style11 font-color1">'
                + arr[i]["ColumnName"]
                + '</label><input name="' + id + i + '" id="' + id + i + '" type="text" data-role="none" class="' + id + '"></div>';

            $("." + container).append(fieldContent);
        }

        //生成Checkbox自定義欄位
        function setCheckboxCustomField(arr, i, id, content) {
            //先處理checkbox所有選項
            var mutipleArr = arr[i]["ColumnItem"].split(";");
            var mutipleContent = "";
            for (var j in mutipleArr) {
                mutipleContent += '<div data-name="checkbox-' + id + '-' + i
                    + '"><img src="img/checkbox_n.png" class="family-signup-checkbox"><span>'
                    + mutipleArr[j]
                    + '</span></div>';
            }

            var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
                + arr[i]["ColumnName"]
                + '</label><div class="custom-field-checkbox font-style3 font-color1 checkbox-' + id + '-' + i + '">';

            $("." + content).append(fieldContent + mutipleContent + "</div><div>");

            //生成checkbox的value對象，初始value爲空，打勾添加，打叉刪除
            var mutipleObj = {
                "name": arr[i]["ColumnName"],
                "value": []
            };

            checkboxArr.push(mutipleObj);
        }

        //記錄所選欄位的值
        function setFieldValue(name, value) {
            for (var i in familyFieldArr) {
                if (name == familyFieldArr[i]["ColumnName"]) {
                    familyFieldArr[i]["ColumnAnswer"] = value;
                    break;
                }
            }
        }

        //檢查眷属报名所有欄位是否爲空
        function checkFamilyForm() {
            //select
            var selLength = 0;
            if ($(".family-signup-custom-field .familySignupSelect select").length > 0) {
                $.each($(".familySignupSelect select"), function (index, item) {
                    if ($(item).val() !== langStr["str_040"]) {
                        selLength++;
                    } else {
                        selLength--;
                    }
                });
            }

            //text
            var texLength = 0;
            if ($(".family-signup-custom-field .familySignupText").length > 0) {
                $.each($(".familySignupText"), function (index, item) {
                    if ($.trim($(item).val()) !== "") {
                        texLength++;
                    } else {
                        texLength--;
                    }
                });
            }

            //checkbox
            var cheLength = 0;
            if (checkboxArr.length > 0) {
                for (var i in checkboxArr) {
                    if (checkboxArr[i]["value"].length > 0) {
                        cheLength++;
                    } else {
                        cheLength--;
                    }
                }
            }

            if (selLength == selectLength && texLength == textLength && cheLength == checkboxLength) {
                $("#selectFamilyBtn").removeClass("btn-disabled");
            } else {
                $("#selectFamilyBtn").addClass("btn-disabled");
            }
        }

        //记录个人报名自定义栏位值，并检查是否为空
        function saveValueAndCheckPersonForm(arr, name, value, bool) {
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
                    $("#personSignupBtn").addClass("btn-disabled");
                    break;
                } else {
                    $("#personSignupBtn").removeClass("btn-disabled");
                }
            }

            //console.log(personFieldArr);

        }

        /********************************** page event *************************************/
        $("#viewActivitiesSignup").on("pagebeforeshow", function (event, ui) {
            if (viewSignupInit) {
                //dropdownlist
                tplJS.DropdownList("viewActivitiesSignup", "employeeDropdownlist", "prepend", "typeB", employeeData);

                viewSignupInit = false;
            }
        });

        $("#viewActivitiesSignup").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesSignup").keypress(function (event) {

        });

        //從報名頁返回詳情頁
        $("#viewActivitiesSignup .back-detail").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });

        /******************************* employee component ********************************/
        // 1. 點擊“新增名單”，觸發dropdownlist的click事件，可以彈出popup
        $(".add-team-member").on("click", function () {
            if (currentPlace < limitPlace) {
                $("#employee-popup").trigger("click");
            }
        });

        // 2. 每次打開查詢員工popup，popup恢復初始狀態
        $("#viewActivitiesSignup").on("popupafteropen", "#employee-popup-option", function () {
            $("#searchBar").val("");
            $("#employee-popup-option-list").empty();
            //resizePopup("employee-popup-option");

            if ($("#loaderQuery").length <= 0) {
                $("#employee-popup-option-popup .ui-content").append('<img id="loaderQuery" src="img/query-loader.gif">');
            } else {
                $("#loaderQuery").hide();
            }
        });

        // 3. 搜索員工，2秒後呼叫API，返回查詢信息
        $("#viewActivitiesSignup").on("keyup", "#searchBar", function (e) {
            var self = $(this).val();
            if (self.length == 0) {
                $("#loaderQuery").hide();
                $("#employee-popup-option-list").hide();
                return;
            }

            if (timeoutQueryEmployee != null) {
                clearTimeout(timeoutQueryEmployee);
                timeoutQueryEmployee = null;
            }
            timeoutQueryEmployee = setTimeout(function () {
                activitiesSignupEmployeeQueryData = '<LayoutHeader><Employee>'
                    + $.trim(self)
                    + '</Employee></LayoutHeader>';

                ActivitiesSignupEmployeeQuery();

                $("#loaderQuery").show();
                $("#employee-popup-option-list").hide();
            }, 2000);

            //如果點擊的是“回車(search)”按鈕，search控件失去焦點，虛擬鍵盤隱藏
            if (e.which == 13) {
                $("#searchBar").blur();
            }
        });

        // 4. 點擊員工，添加到html
        $("#viewActivitiesSignup").on("click", "#employee-popup-option ul li", function (e) {
            var self = $(this);
            var employeeList = '<div class="team-employee-list" data-id="'
                + self.attr("value")
                + '"><span>'
                + self.children("div").eq(0).text()
                + '</span><span>'
                + self.children("div").eq(1).text()
                + '</span><span><img src="img/delete.png" class="team-signup-delete"></span></div>';

            $(".team-signup-employee-list").append(employeeList);
            currentPlace++;
            $("#teamCurrentPlace").text(currentPlace);
            //將被添加員工的工號放入數組當中
            memberNoArr.push(self.attr("value"));
            //檢查欄位
            checkFieldByTeam();
        });

        // 5. 刪除組隊成員
        $("#viewActivitiesSignup").on("click", ".team-signup-delete", function () {
            var empNo = $(this).parent().parent().attr("data-id");
            $(this).parent().parent().remove();
            currentPlace--;
            $("#teamCurrentPlace").text(currentPlace);
            //將員工工號刪除與數組
            for (var i in memberNoArr) {
                if (empNo == memberNoArr[i]) {
                    memberNoArr.splice(i, 1);
                    break;
                }
            }
            //檢查欄位
            checkFieldByTeam();
        });

        /*********************************** team signup ***********************************/
        $("#departNo").on("keyup", function () {
            checkFieldByTeam();
        });

        $("#teamName").on("keyup", function () {
            checkFieldByTeam();
        });

        $("#departNo").on("change", function () {
            departNo = $.trim($(this).val());
        });

        $("#teamName").on("change", function () {
            teamName = $.trim($(this).val());
        });

        $("#sendTeamSignup").on("click", function () {
            if (!$(this).hasClass("btn-disabled")) {
                //loadingMask("show");
                activitiesSignupConfirmQueryData = '<LayoutHeader><ActivitiesID>'
                    + submitID
                    + '</ActivitiesID><SignupModel>'
                    + submitModel
                    + '</SignupModel><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><TeamName>'
                    + teamName
                    + '</TeamName><TeamDept>'
                    + departNo
                    + '</TeamDept><MemberEmpNo>'
                    + memberNoArr.join(",")
                    + '</MemberEmpNo></LayoutHeader>';

                //console.log(activitiesSignupConfirmQueryData);
                ActivitiesSignupConfirmQuery();
            }

        });


        /*********************************** family signup ***********************************/
        //select
        $(".family-signup-custom-field").on("change", ".familySignupSelect select", function () {
            var selfName = $(this).parent().prev().text();
            var selfVal = $(this).val();

            //檢查表單
            checkFamilyForm();
            //記錄欄位值
            setFieldValue(selfName, selfVal);
        });

        //text
        $(".family-signup-custom-field").on("keyup", ".familySignupText", function () {
            var selfName = $(this).prev().text();
            var selfVal = $(this).val();

            if (timeoutCheckFamilySignup != null) {
                clearTimeout(timeoutCheckFamilySignup);
                timeoutCheckFamilySignup = null;
            }
            timeoutCheckFamilySignup = setTimeout(function () {
                //檢查表單
                checkFamilyForm();
                //記錄欄位值
                setFieldValue(selfName, selfVal);
            }, 1000);

        });

        //checkbox
        $(".family-signup-custom-field").on("click", ".custom-field-checkbox > div", function () {
            var src = $(this).find("img").attr("src");
            var name = $(this).parent().prev().text();
            var value = $(this).children("span").text();

            if (src == "img/checkbox_n.png") {
                for (var i in checkboxArr) {
                    if (name == checkboxArr[i]["name"]) {
                        checkboxArr[i]["value"].push(value);
                    }
                }

                $(this).find("img").attr("src", "img/checkbox_s.png");
            } else {
                for (var i in checkboxArr) {
                    for (var j in checkboxArr[i]["value"]) {
                        if (name == checkboxArr[i]["name"] && value == checkboxArr[i]["value"][j]) {
                            checkboxArr[i]["value"].splice(j, 1);
                            break;
                        }
                    }
                }

                $(this).find("img").attr("src", "img/checkbox_n.png");
            }

            //檢查表單
            checkFamilyForm();

            var checkboxVal = "";
            for (var i in checkboxArr) {
                if (name == checkboxArr[i]["name"]) {
                    checkboxVal = checkboxArr[i]["value"].join(";");
                }
            }

            //記錄欄位值
            setFieldValue(name, checkboxVal);

        });

        //點擊“選擇眷屬”
        $("#selectFamilyBtn").on("click", function () {
            if (!$("#selectFamilyBtn").hasClass("btn-disabled")) {
                //跳轉
                changePageByPanel("viewSelectFamily", true);
            }
        });


        /*********************************** person signup ***********************************/
        //選擇人數dropdownlist
        $("#personLimitPlace").on("change", "select", function () {
            personSubmitPlace = $(this).val();
        });

        //select
        $(".person-signup-custom-field").on("change", ".personSignupSelect select", function () {
            var selfName = $(this).parent().prev().text();
            var selfVal = $(this).val();
            //保存栏位值并检查表单
            saveValueAndCheckPersonForm(personFieldArr, selfName, selfVal, null);
        });

        //text
        $(".person-signup-custom-field").on("keyup", ".personSignupText", function () {
            var selfName = $(this).prev().text();
            var selfVal = $(this).val();

            if (timeoutCheckPersonSignup != null) {
                clearTimeout(timeoutCheckPersonSignup);
                timeoutCheckPersonSignup = null;
            }
            timeoutCheckPersonSignup = setTimeout(function () {
                //保存栏位值并检查表单
                saveValueAndCheckPersonForm(personFieldArr, selfName, selfVal, null);
            }, 1000);

        });

        //checkbox
        $(".person-signup-custom-field").on("click", ".custom-field-checkbox > div", function () {
            var src = $(this).find("img").attr("src");
            var name = $(this).parent().prev().text();
            var value = $(this).children("span").text();

            if (src == "img/checkbox_n.png") {
                //保存栏位值并检查表单
                saveValueAndCheckPersonForm(personFieldArr, name, value, true);
                $(this).find("img").attr("src", "img/checkbox_s.png");
            } else {
                //保存栏位值并检查表单
                saveValueAndCheckPersonForm(personFieldArr, name, value, false);
                $(this).find("img").attr("src", "img/checkbox_n.png");
            }

        });

        //開始報名
        $("#personSignupBtn").on("click", function () {
            var self = $(this).hasClass("btn-disbaled");
            if (!self) {
                for (var i in personFieldArr) {
                    if (personFieldArr[i]["ColumnType"] == "Multiple") {
                        var StrLength = personFieldArr[i]["ColumnAnswer"].length;
                        personFieldArr[i]["ColumnAnswer"] = personFieldArr[i]["ColumnAnswer"].substring(1, StrLength);
                    }
                }

                activitiesSignupConfirmQueryData = '<LayoutHeader><ActivitiesID>'
                    + submitID
                    + '</ActivitiesID><SignupModel>'
                    + submitModel
                    + '</SignupModel><SignupPlaces>'
                    + personSubmitPlace
                    + '</SignupPlaces><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><ColumnAnswer_1>'
                    + (personFieldArr[0] == undefined ? "" : personFieldArr[0]["ColumnAnswer"])
                    + '</ColumnAnswer_1><ColumnAnswer_2>'
                    + (personFieldArr[1] == undefined ? "" : personFieldArr[1]["ColumnAnswer"])
                    + '</ColumnAnswer_2><ColumnAnswer_3>'
                    + (personFieldArr[2] == undefined ? "" : personFieldArr[2]["ColumnAnswer"])
                    + '</ColumnAnswer_3><ColumnAnswer_4>'
                    + (personFieldArr[3] == undefined ? "" : personFieldArr[3]["ColumnAnswer"])
                    + '</ColumnAnswer_4><ColumnAnswer_5>'
                    + (personFieldArr[4] == undefined ? "" : personFieldArr[4]["ColumnAnswer"])
                    + '</ColumnAnswer_5></LayoutHeader>';

                //console.log(activitiesSignupConfirmQueryData);
                ActivitiesSignupConfirmQuery();
            }
        });


    }
});
