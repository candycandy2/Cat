
$("#viewActivitiesSignup").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var timeoutQueryEmployee = null, timeoutCheckFamilySignup = null, timeoutCheckPersonSignup = null;
        var timeoutDepartNo = null, timeoutTeamName = null, timeoutCheckTimeSignup = null;
        var teamName, departNo, submitID, submitModel;
        var limitPlace, currentPlace;     //組隊報名限制人數和目前已選人數
        var personSubmitPlace = "1";    //個人報名人數
        var timeID;    //時段編號
        var memberNoArr = [];    //組隊報名成員數組
        var personFieldArr = [], familyFieldArr = [], timeFieldArr = [];    //自定義欄位 
        var radioFlag = false;    //時段是否選擇
        var actIsFull = "";    //活動是否額滿
        var empPopupStatus = true;    //搜索員工popup是否重複

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
                //console.log(data);

                //報名提交的活動類型
                submitModel = model;
                if (data["ResultCode"] == "1") {
                    var signupObj = data["Content"][0];
                    submitID = signupObj["ActivitiesID"];

                    if (model == "1") {
                        //页面初始化
                        $("#personLimitPlace").empty();
                        $("#person-popup-option-screen").remove();
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
                        //根据限制人数动态生成报名人数dropdownlist栏位
                        selectPersonByLimit(signupObj["LimitPlaces"]);

                        //獲取自定義欄位數組並去空
                        personFieldArr = getCustomField(signupObj);
                        if (personFieldArr.length == 0) {
                            $("#personSignupBtn").removeClass("btn-disabled");
                        } else {
                            //根據欄位類型，生成不同欄位
                            var noAnswerCount = 0;
                            for (var i in personFieldArr) {
                                if (personFieldArr[i]["ColumnType"] == "Select") {
                                    noAnswerCount = setSelectCustomField(personFieldArr, i, "viewActivitiesSignup", "personSignupSelect", "person-signup-custom-field", noAnswerCount);

                                } else if (personFieldArr[i]["ColumnType"] == "Text") {
                                    noAnswerCount = setTextCustomField(personFieldArr, i, "personSignupText", "person-signup-custom-field", noAnswerCount);

                                } else if (personFieldArr[i]["ColumnType"] == "Multiple") {
                                    noAnswerCount = setCheckboxCustomField(personFieldArr, i, "personSignupCheckbox", "person-signup-custom-field", noAnswerCount);

                                }
                            }

                            //如果有欄位值爲空，按鈕不可用
                            if (noAnswerCount > 0) {
                                $("#personSignupBtn").addClass("btn-disabled");
                            }
                        }

                    } else if (model == "3") {
                        //頁面初始化
                        $(".family-signup-custom-field").empty();
                        for (var i = 0; i < 5; i++) {
                            $("#column-popup-familySignupSelect-" + i + "-option-screen").remove();
                            $("#column-popup-familySignupSelect-" + i + "-option-popup").remove();
                        }
                        $("#selectFamilyBtn").addClass("btn-disabled");

                        //賦值
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
                        $("#familySelectLimitPlace").text(Number(signupObj["LimitPlaces"]) - 1);
                        $(".select-family-remark").empty().append("<div>" + signupObj["ActivitiesRemarks"] + "</div>");

                        //因爲眷屬報名必須包含本人，所以可攜帶眷屬數量=總數量-1
                        selectFamilyLimit = Number(signupObj["LimitPlaces"]) - 1;

                        //处理自定义栏位，放入數組中
                        familyFieldArr = getCustomField(signupObj);
                        //測試數據
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

                        //根據欄位類型，生成不同欄位
                        if (familyFieldArr.length == 0) {
                            $("#selectFamilyBtn").removeClass("btn-disabled");
                        } else {
                            var noAnswerCount = 0;
                            for (var i in familyFieldArr) {
                                if (familyFieldArr[i]["ColumnType"] == "Select") {
                                    noAnswerCount = setSelectCustomField(familyFieldArr, i, "viewActivitiesSignup", "familySignupSelect", "family-signup-custom-field", noAnswerCount);

                                } else if (familyFieldArr[i]["ColumnType"] == "Text") {
                                    noAnswerCount = setTextCustomField(familyFieldArr, i, "familySignupText", "family-signup-custom-field", noAnswerCount);

                                } else if (familyFieldArr[i]["ColumnType"] == "Multiple") {
                                    noAnswerCount = setCheckboxCustomField(familyFieldArr, i, "familySignupCheckbox", "family-signup-custom-field", noAnswerCount);

                                }
                            }

                            //如果有欄位值爲空，按鈕不可用
                            if (noAnswerCount > 0) {
                                $("#selectFamilyBtn").addClass("btn-disabled");
                            }
                        }


                    } else if (model == "4") {
                        //初始化
                        memberNoArr = [];
                        $("#departNo").val("");
                        $("#teamName").val("");
                        $(".team-signup-employee-list").empty();
                        $("#sendTeamSignup").addClass("btn-disabled");

                        //賦值
                        $("#teamSignupThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#teamSignupName").text(signupObj["ActivitiesName"]);
                        $("#teamCurrentPlace").text("0");
                        $("#teamLimitPlace").text(signupObj["LimitPlaces"]);
                        $("#teamRemark").empty().append("<div>" + signupObj["ActivitiesRemarks"].replace("TeamNumber", signupObj["LimitPlaces"]) + "</div>");

                        //記錄已添加人數
                        limitPlace = signupObj["LimitPlaces"];
                        currentPlace = 0;

                    } else if (model == "5") {
                        //頁面初始化
                        $(".time-signup-custom-field").empty();
                        for (var i = 0; i < 5; i++) {
                            $("#column-popup-timeSignupSelect-" + i + "-option-screen").remove();
                            $("#column-popup-timeSignupSelect-" + i + "-option-popup").remove();
                        }
                        $("#timeSignupBtn").addClass("btn-disabled");
                        //賦值
                        $("#timeSignupThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#timeSignupName").text(signupObj["ActivitiesName"]);
                        radioFlag = false;

                        //1.獲取各時段
                        var timeArr = [];
                        for (var i in data["Content"]) {
                            timeArr.push({
                                "TimeSort": data["Content"][i]["TimeSort"],
                                "TimeID": data["Content"][i]["TimeID"],
                                "SignupTime": data["Content"][i]["SignupTime"],
                                "QuotaPlaces": data["Content"][i]["QuotaPlaces"],
                                "RemainingPlaces": data["Content"][i]["RemainingPlaces"]
                            });
                        }
                        //2.排序
                        timeArr.sort(sortByTimeID("TimeSort"));
                        //console.log(timeArr);

                        //3.生成html
                        var timeContent = "";
                        for (var i in timeArr) {
                            timeContent += '<div class="time-signup-tr"><div data-id="'
                                + timeArr[i]["TimeID"]
                                + '"><img src="img/radio_n.png" class="time-signup-radio"></div><div>'
                                + timeArr[i]["SignupTime"]
                                + '</div><div>'
                                + timeArr[i]["QuotaPlaces"]
                                + '</div><div>'
                                + timeArr[i]["RemainingPlaces"]
                                + '</div></div>';
                        }
                        $(".time-signup-tbody").empty().append(timeContent);

                        //自定義欄位
                        timeFieldArr = getCustomField(signupObj);
                        var noAnswerCount = 0;
                        for (var i in timeFieldArr) {
                            if (timeFieldArr[i]["ColumnType"] == "Select") {
                                noAnswerCount = setSelectCustomField(timeFieldArr, i, "viewActivitiesSignup", "timeSignupSelect", "time-signup-custom-field", noAnswerCount);

                            } else if (timeFieldArr[i]["ColumnType"] == "Text") {
                                noAnswerCount = setTextCustomField(timeFieldArr, i, "timeSignupText", "time-signup-custom-field", noAnswerCount);

                            } else if (timeFieldArr[i]["ColumnType"] == "Multiple") {
                                noAnswerCount = setCheckboxCustomField(timeFieldArr, i, "timeSignupCheckbox", "time-signup-custom-field", noAnswerCount);

                            }
                        }

                        //如果有欄位值爲空，按鈕不可用
                        if (noAnswerCount > 0) {
                            $("#timeSignupBtn").addClass("btn-disabled");
                        }
                        

                    }

                    //根據不同活動類型，展示不同頁面，並跳轉
                    showViewByModel("viewActivitiesSignup", model);
                    setTimeout(function () {
                        changePageByPanel("viewActivitiesSignup", true);
                    }, 500);

                } else if (data["ResultCode"] == "045910") {
                    //已報名同類活動，不能報名該活動
                    popupMsgInit('.signupedSameMsg');
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_Signup", self.successCallback, self.failCallback, activitiesSignupQueryData, "");
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
        window.ActivitiesSignupConfirmQuery = function (actID, model, isSignup) {

            this.successCallback = function (data) {
                //console.log(data);

                activityStatus = "", activityModel = model;
                if (data['ResultCode'] == "045911") {
                    //重新獲取報名列表
                    ActivitiesListQuery();

                    //跳轉前刪除訪問頁面數組最後2個
                    if (model == "3") {
                        for (var i = 0; i < 3; i++) {
                            pageVisitedList.pop();
                        }
                    } else {
                        for (var i = 0; i < 2; i++) {
                            pageVisitedList.pop();
                        }
                    }

                    //跳轉
                    $.each($("#openList .activity-list"), function (index, item) {
                        if ($(item).attr("data-id") == actID) {
                            $(item).trigger("click");
                        }
                    });

                    //記錄活動狀態
                    if (isSignup == "N") {
                        activityStatus = "Y";
                    } else if (isSignup == "Y") {
                        activityStatus = "N";
                    }

                    //重新獲取報名記錄和眷屬資料
                    ActivitiesRecordQuery();
                    if (model == "3") {
                        ActivitiesFamilyQuery();
                    }

                } else if (data['ResultCode'] == "045912") {
                    //先獲取該活動是否額滿，如果未額滿停留在本頁（報名頁面）；如果已額滿，返回詳情頁
                    activitiesIsFullQueryData = '<LayoutHeader><ActivitiesID>'
                        + actID
                        + '</ActivitiesID><EmployeeNo>'
                        + myEmpNo
                        + '</EmployeeNo></LayoutHeader>';

                    ActivitiesIsFullQuery();

                    //報名和管理的彈窗不一致
                    if (isSignup == "N") {
                        //失敗，報名組數超過剩餘名額
                        if (model == "4") {
                            $(".signupOverLimitMsg .main-paragraph").text(langStr["str_025"]);
                        } else {
                            $(".signupOverLimitMsg .main-paragraph").text(langStr["str_024"]);
                        }
                        popupMsgInit(".signupOverLimitMsg");

                    } else if (isSignup == "Y") {
                        if (model == "4") {
                            $(".manageOverLimitMsg .main-paragraph").text(langStr["str_025"]);
                        } else {
                            $(".manageOverLimitMsg .main-paragraph").text(langStr["str_024"]);
                        }
                        popupMsgInit(".manageOverLimitMsg");
                    }

                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Confirm", self.successCallback, self.failCallback, activitiesSignupConfirmQueryData, "");
            }();

        };

        //報名失敗，查詢該活動是否額滿
        window.ActivitiesIsFullQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "1") {
                    actIsFull = data["Content"][0]["IsFull"];

                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_Detail", self.successCallback, self.failCallback, activitiesIsFullQueryData, "");
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
            } else {
                $("#sendTeamSignup").addClass("btn-disabled");
            }
        }

        //時段報名存值
        function saveValueForTimeArr(arr, name, value, bool) {
            //bool为true，添加checkbox;若为false，删除checkbox;若为other，text和select赋值
            for (var i in arr) {
                if (name == arr[i]["ColumnName"] && bool == true) {
                    arr[i]["ColumnAnswer"] += (";" + value);
                    break;
                } else if (name == arr[i]["ColumnName"] && bool == false) {
                    arr[i]["ColumnAnswer"] = arr[i]["ColumnAnswer"].replace(";" + value, "");
                    break;
                } else if (name == arr[i]["ColumnName"] && bool == null) {
                    arr[i]["ColumnAnswer"] = value;
                    break;
                }
            }
        }

        //判斷時段報名answer是否有空
        function checkFormForTimeArr(arr) {
            var count = 0;
            for (var i in arr) {
                if (arr[i]["ColumnAnswer"] == "") {
                    count++;
                }
            }

            var flag = true;
            if (count > 0) {
                flag = false;
            } else {
                flag = true;
            }

            return flag;
        }

        //時段報名根據欄位值和單選判斷按鈕是否可用
        function removeOrAddClass(flag, arr, btn) {
            if (flag && checkFormForTimeArr(arr)) {
                $("#" + btn).removeClass("btn-disabled");
            } else {
                $("#" + btn).addClass("btn-disabled");
            }
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

        //從報名頁返回詳情頁-popup
        $("#viewActivitiesSignup .back-detail").on("click", function () {
            popupMsgInit('.signupNoFinish');
        });

        //確定取消報名，返回上一頁
        $("#cancelSignupBtn").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });

        //報名失敗提示popup，如果已額滿就跳轉
        $("#signupOverBtn").on("click", function () {
            if (actIsFull == "Y") {
                //如果已額滿，重新獲取活動列表
                ActivitiesListQuery();

                //跳轉前刪除訪問頁面數組最後2個
                if (submitModel == "3") {
                    for (var i = 0; i < 3; i++) {
                        pageVisitedList.pop();
                    }
                } else {
                    for (var i = 0; i < 2; i++) {
                        pageVisitedList.pop();
                    }
                }

                //跳轉
                $.each($("#openList .activity-list"), function (index, item) {
                    if ($(item).attr("data-id") == actID) {
                        $(item).trigger("click");
                    }
                });
            }
        });

        //超時關閉popup，並返回活動列表
        $("#signupTimeOverBtn").on("click", function () {
            //重新獲取活動列表
            ActivitiesListQuery();
            pageVisitedList.pop();
            //跳轉
            changePageByPanel("viewActivitiesList", false);
        });

        /******************************* employee component ********************************/
        // 1. 點擊“新增名單”，觸發dropdownlist的click事件，可以彈出popup
        $(".add-team-member").on("click", function () {
            if (currentPlace < limitPlace) {
                $("#employee-popup").trigger("click");
            } else {
                //提示成員已滿
                //popupMsgInit('.memberFullMsg');
            }
        });

        // 2. 每次打開查詢員工popup，popup恢復初始狀態
        $("#viewActivitiesSignup").on("popupafteropen", "#employee-popup-option", function () {
            $("#searchBar").val("");
            $("#employee-popup-option-list").empty();

            if ($("#loaderQuery").length <= 0) {
                $("#employee-popup-option-popup .ui-content").append('<img id="loaderQuery" src="img/query-loader.gif">');
            } else {
                $("#loaderQuery").hide();
            }
        });

        // 3. 搜索員工，2秒後呼叫API，返回查詢信息
        $("#viewActivitiesSignup").on("keyup", "#searchBar", function (e) {
            var self = $("#searchBar").val();
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

            //判斷是否重複添加
            var count = 0;
            for (var i in memberNoArr) {
                if (self.attr("value") == memberNoArr[i]) {
                    count++;
                    break;
                }
            }

            //一個隊伍不能重複添加相同隊員
            if (count == 0) {
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

                empPopupStatus = true;
            } else {
                empPopupStatus = false;
            }

        });

        // 5. 關閉查詢popup後，不能添加相同同仁提示
        $("#viewActivitiesSignup").on("popupafterclose", "#employee-popup-option", function () {
            if (!empPopupStatus) {
                popupMsgInit('.memberRepeat');
            }
            empPopupStatus = true;
        });

        // 6. 刪除組隊成員
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
        //輸入部門代碼
        $("#departNo").on("keyup", function (event) {
            if (timeoutDepartNo != null) {
                clearTimeout(timeoutDepartNo);
                timeoutDepartNo = null;
            }
            timeoutDepartNo = setTimeout(function () {
                departNo = $.trim($("#departNo").val());
                checkFieldByTeam();
            }, 1000);

        });

        //輸入隊伍名稱
        $("#teamName").on("keyup", function (event) {
            if (timeoutTeamName != null) {
                clearTimeout(timeoutTeamName);
                timeoutTeamName = null;
            }
            timeoutTeamName = setTimeout(function () {
                teamName = $.trim($("#teamName").val());
                checkFieldByTeam();
            }, 1000);

        });

        //組隊報名申請
        $("#sendTeamSignup").on("click", function () {
            var selfClass = $(this).hasClass("btn-disabled");

            if (!selfClass) {
                //先判斷是否超時
                var nowTime = getTimeNow();
                if (nowTime - overTime < 0) {
                    loadingMask("show");
                    teamName = $.trim($("#teamName").val());
                    departNo = $.trim($("#departNo").val());

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
                    ActivitiesSignupConfirmQuery(submitID, submitModel, "N");

                } else {
                    //超時提示
                    popupMsgInit('.signupTimeOverMsg');
                }

            }

        });

        //footer fixed定位会因为虚拟键盘展开影响页面大小
        // $("#viewTeamSignup").on("focus", "input", function() {
        //     $("#sendTeamSignup").hide();
        // });

        // $("#viewTeamSignup").on("blur", "input", function() {
        //     $("#sendTeamSignup").show();
        // });

        /*********************************** family signup ***********************************/
        //select
        $(".family-signup-custom-field").on("change", ".familySignupSelect select", function () {
            var selfName = $(this).parent().prev().text();
            var selfVal = $(this).val();
            //保存栏位值并检查表单
            saveValueAndCheckForm(familyFieldArr, selfName, selfVal, null, "selectFamilyBtn");
        });

        //text
        $(".family-signup-custom-field").on("keyup", ".familySignupText", function () {
            var self = $(this);
            var selfName = $(this).prev().text();

            if (timeoutCheckFamilySignup != null) {
                clearTimeout(timeoutCheckFamilySignup);
                timeoutCheckFamilySignup = null;
            }
            timeoutCheckFamilySignup = setTimeout(function () {
                var selfVal = $.trim(self.val());
                //保存栏位值并检查表单
                saveValueAndCheckForm(familyFieldArr, selfName, selfVal, null, "selectFamilyBtn");
            }, 1000);

        });

        //失去焦點再次更新欄位值
        // $(".family-signup-custom-field").on("blur", ".familySignupText", function () {
        //     var selfName = $(this).prev().text();
        //     var selfVal = $.trim($(this).val());
        //     //保存栏位值并检查表单
        //     saveValueAndCheckForm(personFieldArr, selfName, selfVal, null, "selectFamilyBtn");
        // });

        //checkbox
        $(".family-signup-custom-field").on("click", ".custom-field-checkbox > div", function () {
            var src = $(this).find("img").attr("src");
            var name = $(this).parent().prev().text();
            var value = $(this).children("span").text();

            if (src == "img/checkbox_n.png") {
                //保存栏位值并检查表单
                saveValueAndCheckForm(familyFieldArr, name, value, true, "selectFamilyBtn");
                $(this).find("img").attr("src", "img/checkbox_s.png");
            } else {
                //保存栏位值并检查表单
                saveValueAndCheckForm(familyFieldArr, name, value, false, "selectFamilyBtn");
                $(this).find("img").attr("src", "img/checkbox_n.png");
            }

        });

        //點擊“選擇眷屬”，呼叫API
        $("#selectFamilyBtn").on("click", function () {
            var selfClass = $(this).hasClass("btn-disabled");

            if (!selfClass) {
                loadingMask("show");
                //呼叫API前，再次更新欄位值
                getTextValueBeforeCall("family", "signup", "familySignupText", familyFieldArr);

                //1.本人信息
                var answerList = "";
                for (var i = 1; i < 6; i++) {
                    answerList += '<ColumnAnswer_' + i + '>'
                        + (familyFieldArr[i - 1] != undefined ? familyFieldArr[i - 1]["ColumnAnswer"] : "")
                        + '</ColumnAnswer_' + i + '>';
                }

                var familyList = '<FamilyList><ActivitiesID>'
                    + submitID
                    + '</ActivitiesID><SignupPlaces>1</SignupPlaces><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><FamilyNo>'
                    + myEmpNo
                    + '</FamilyNo>'
                    + answerList
                    + '</FamilyList>';

                //console.log(familyList);

                //2.API信息
                activitiesSignupFamilyQueryData = '<LayoutHeader><ActivitiesID>'
                    + submitID
                    + '</ActivitiesID><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><IsSignup>N</IsSignup></LayoutHeader>';

                //console.log(activitiesSignupFamilyQueryData);
                ActivitiesSignupFamilyQuery(submitID, submitModel, "N", familyFieldArr, familyList);

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
            saveValueAndCheckForm(personFieldArr, selfName, selfVal, null, "personSignupBtn");
        });

        //text
        $(".person-signup-custom-field").on("keyup", ".personSignupText", function () {
            var self = $(this);
            var selfName = $(this).prev().text();

            if (timeoutCheckPersonSignup != null) {
                clearTimeout(timeoutCheckPersonSignup);
                timeoutCheckPersonSignup = null;
            }
            timeoutCheckPersonSignup = setTimeout(function () {
                var selfVal = $.trim(self.val());
                //保存栏位值并检查表单
                saveValueAndCheckForm(personFieldArr, selfName, selfVal, null, "personSignupBtn");
            }, 1000);

        });

        //checkbox
        $(".person-signup-custom-field").on("click", ".custom-field-checkbox > div", function () {
            var src = $(this).find("img").attr("src");
            var name = $(this).parent().prev().text();
            var value = $(this).children("span").text();

            if (src == "img/checkbox_n.png") {
                //保存栏位值并检查表单
                saveValueAndCheckForm(personFieldArr, name, value, true, "personSignupBtn");
                $(this).find("img").attr("src", "img/checkbox_s.png");
            } else {
                //保存栏位值并检查表单
                saveValueAndCheckForm(personFieldArr, name, value, false, "personSignupBtn");
                $(this).find("img").attr("src", "img/checkbox_n.png");
            }

        });

        //个人報名
        $("#personSignupBtn").on("click", function () {
            var selfClass = $(this).hasClass("btn-disabled");

            if (!selfClass) {
                //先判斷是否超時
                var nowTime = getTimeNow();
                if (nowTime - overTime < 0) {
                    loadingMask("show");
                    //呼叫API前，再次更新欄位值
                    getTextValueBeforeCall("person", "signup", "personSignupText", personFieldArr);

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
                    ActivitiesSignupConfirmQuery(submitID, submitModel, "N");

                } else {
                    //超時提示
                    popupMsgInit('.signupTimeOverMsg');
                }

            }
        });


        /*********************************** time signup ***********************************/
        //radio
        $(".time-signup-tbody").on("click", ".time-signup-radio", function () {
            var src = $(this).attr("src");
            timeID = $(this).parent().attr("data-id");

            //1.先將所有radio變爲空
            $(".time-signup-radio").attr("src", "img/radio_n.png");

            //2.再把點擊的變爲非空
            if (src == "img/radio_n.png") {
                $(this).attr("src", "img/radio_s.png");
            } else {
                $(this).attr("src", "img/radio_n.png");
            }

            //3.遍歷單選是否已選，1表示已選，0表示未選
            var radioLength = 0;
            $.each($(".time-signup-tbody .time-signup-radio"), function (index, item) {
                if ($(item).attr("src") == "img/radio_s.png") {
                    radioLength++;
                }
            });

            if (radioLength > 0) {
                radioFlag = true;
            } else {
                radioFlag = false;
            }

            //檢查時段和欄位是否爲空
            removeOrAddClass(radioFlag, timeFieldArr, "timeSignupBtn");
        });

        //select
        $(".time-signup-custom-field").on("change", ".timeSignupSelect select", function () {
            var selfName = $(this).parent().prev().text();
            var selfVal = $(this).val();
            //保存栏位值
            saveValueForTimeArr(timeFieldArr, selfName, selfVal, null);
            //檢查時段和欄位是否爲空
            removeOrAddClass(radioFlag, timeFieldArr, "timeSignupBtn");

        });

        //text
        $(".time-signup-custom-field").on("keyup", ".timeSignupText", function () {
            var self = $(this);
            var selfName = $(this).prev().text();

            if (timeoutCheckTimeSignup != null) {
                clearTimeout(timeoutCheckTimeSignup);
                timeoutCheckTimeSignup = null;
            }
            timeoutCheckTimeSignup = setTimeout(function () {
                var selfVal = $.trim(self.val());
                //保存栏位值
                saveValueForTimeArr(timeFieldArr, selfName, selfVal, null);
            }, 1000);
            //檢查時段和欄位是否爲空
            removeOrAddClass(radioFlag, timeFieldArr, "timeSignupBtn");
        });

        //checkbox
        $(".time-signup-custom-field").on("click", ".custom-field-checkbox > div", function () {
            var src = $(this).find("img").attr("src");
            var selfName = $(this).parent().prev().text();
            var selfVal = $(this).children("span").text();

            if (src == "img/checkbox_n.png") {
                //保存栏位值
                saveValueForTimeArr(timeFieldArr, selfName, selfVal, true);
                $(this).find("img").attr("src", "img/checkbox_s.png");
            } else {
                //刪除栏位值
                saveValueForTimeArr(timeFieldArr, selfName, selfVal, false);
                $(this).find("img").attr("src", "img/checkbox_n.png");
            }

            //檢查時段和欄位是否爲空
            removeOrAddClass(radioFlag, timeFieldArr, "timeSignupBtn");

        });

        //確定送出
        $("#timeSignupBtn").on("click", function () {
            var selfClass = $(this).hasClass("btn-disabled");

            if (!selfClass) {
                //先判斷是否超時
                var nowTime = getTimeNow();
                if (nowTime - overTime < 0) {
                    loadingMask("show");
                    //呼叫API前，再次更新欄位值
                    getTextValueBeforeCall("time", "signup", "timeSignupText", timeFieldArr);

                    activitiesSignupConfirmQueryData = '<LayoutHeader><ActivitiesID>'
                        + submitID
                        + '</ActivitiesID><SignupModel>'
                        + submitModel
                        + '</SignupModel><SignupPlaces>1</SignupPlaces><EmployeeNo>'
                        + myEmpNo
                        + '</EmployeeNo><ColumnAnswer_1>'
                        + (timeFieldArr[0] == undefined ? "" : timeFieldArr[0]["ColumnAnswer"])
                        + '</ColumnAnswer_1><ColumnAnswer_2>'
                        + (timeFieldArr[1] == undefined ? "" : timeFieldArr[1]["ColumnAnswer"])
                        + '</ColumnAnswer_2><ColumnAnswer_3>'
                        + (timeFieldArr[2] == undefined ? "" : timeFieldArr[2]["ColumnAnswer"])
                        + '</ColumnAnswer_3><ColumnAnswer_4>'
                        + (timeFieldArr[3] == undefined ? "" : timeFieldArr[3]["ColumnAnswer"])
                        + '</ColumnAnswer_4><ColumnAnswer_5>'
                        + (timeFieldArr[4] == undefined ? "" : timeFieldArr[4]["ColumnAnswer"])
                        + '</ColumnAnswer_5><TimeID>'
                        + timeID
                        + '</TimeID></LayoutHeader>';

                    //console.log(activitiesSignupConfirmQueryData);
                    ActivitiesSignupConfirmQuery(submitID, submitModel, "N");

                } else {
                    //超時提示
                    popupMsgInit('.signupTimeOverMsg');
                }

            }
        });



    }
});
