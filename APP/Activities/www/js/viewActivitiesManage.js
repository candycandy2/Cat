
$("#viewActivitiesManage").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var resultArr = [];
        var personManageArr = [];
        var familyManageFieldArr = [];
        var timeoutCheckPersonManage = null;
        var cancelModel, cancelActName, cancelID, cancelNo, cancelTeamName;
        var submitSignupPlace, currentActName, currentCancelContent;

        /********************************** function *************************************/
        //報名管理
        window.ActivitiesSignupManageQuery = function (model) {

            this.successCallback = function (data) {
                console.log(data);

                //取消報名的活動類型
                cancelModel = model;
                if (data["ResultCode"] == "1") {
                    if (model == "1") {
                        var manageObj = data["Content"][0];

                        //初始化
                        $("#personManagePlace").empty();
                        $("#person-manage-option-popup").remove();
                        $("#updatePersonSignup").removeClass("btn-disabled");
                        $(".person-manage-custom-field").empty();
                        for (var i = 0; i < 5; i++) {
                            $("#column-popup-personManageSelect-" + i + "-option-screen").remove();
                            $("#column-popup-personManageSelect-" + i + "-option-popup").remove();
                        }

                        //賦值
                        $("#personManageThumbnail").attr("src", manageObj["ActivitiesImage"]);
                        $("#personManageName").text(manageObj["ActivitiesName"]);
                        $("#personIsFull").css("display", manageObj["IsFull"] == "Y" ? "block" : "none");
                        $("#personSignupedPlace").text(manageObj["SignupPlaces"]);
                        $(".person-manage-remark").empty().append("<div>" + manageObj["ActivitiesRemarks"] + "</div>");
                        //dropdownlist
                        personDropdownlist(manageObj["LimitPlaces"], manageObj["SignupPlaces"]);
                        personManageArr = getCustomField(manageObj);

                        //根據欄位類型，生成不同欄位
                        for (var i in personManageArr) {
                            if (personManageArr[i]["ColumnType"] == "Select") {
                                setSelectCustomField(personManageArr, i, "viewActivitiesManage", "personManageSelect", "person-manage-custom-field");

                            } else if (personManageArr[i]["ColumnType"] == "Text") {
                                setTextCustomField(personManageArr, i, "personManageText", "person-manage-custom-field");

                            } else if (personManageArr[i]["ColumnType"] == "Multiple") {
                                setCheckboxCustomField(personManageArr, i, "personManageCheckbox", "person-manage-custom-field");

                            }
                        }

                        //取消報名
                        currentActName = manageObj["ActivitiesName"];
                        currentCancelContent = manageObj["EmployeeName"] + " / " + "同仁" + " / " + manageObj["SignupPlaces"] + "人";
                        cancelID = manageObj["ActivitiesID"];
                        cancelNo = manageObj["SignupNo"];

                    } else if (model == "3") {
                        var manageObj = data["Content"][0];
                        //賦值
                        $("#familyManageThumbnail").attr("src", manageObj["ActivitiesImage"]);
                        $("#familyManageName").text(manageObj["ActivitiesName"]);
                        $("#familyManageLimit").text(manageObj["LimitPlaces"]);
                        $("#familyManageEmpName").text(manageObj["EmployeeName"]);
                        $("#familyManageRlts").text(manageObj["EmployeeRelationship"]);
                        $("#familyManageGender").text(manageObj["EmployeeGender"]);
                        $("#familyManageID").text(manageObj["EmpoyeeID"]);
                        $("#familyManageBirth").text(manageObj["EmployeeBirthday"]);
                        cancelID = manageObj["ActivitiesID"];

                        familyManageFieldArr = getCustomField(manageObj);

                        //根據欄位類型，生成不同欄位
                        for (var i in familyManageFieldArr) {
                            if (familyManageFieldArr[i]["ColumnType"] == "Select") {
                                setSelectCustomField(familyManageFieldArr, i, "viewActivitiesManage", "familyManageSelect", "family-manage-custom-field");

                            } else if (familyManageFieldArr[i]["ColumnType"] == "Text") {
                                setTextCustomField(familyManageFieldArr, i, "familyManageText", "family-manage-custom-field");

                            } else if (familyManageFieldArr[i]["ColumnType"] == "Multiple") {
                                setCheckboxCustomField(familyManageFieldArr, i, "familyManageCheckbox", "family-manage-custom-field");

                            }
                        }

                    } else if (model == "4") {
                        var manageArr = data["Content"];
                        //初始化
                        $("#expandAllTeam").attr("src", "img/all_list_down.png");

                        //賦值
                        $("#teamManageThumbnail").attr("src", manageArr[0]["ActivitiesImage"]);
                        $("#teamManageName").text(manageArr[0]["ActivitiesName"]);
                        $("#teamSignupedPlaces").text(manageArr[0]["SignupTeam"]);
                        //取消報名的活動名稱
                        cancelActName = manageArr[0]["ActivitiesName"];

                        //簡化數據
                        var simplifyArr = [];
                        $.each(manageArr, function (index, item) {
                            simplifyArr.push({
                                "ActivitiesID": item["ActivitiesID"],
                                "TeamID": item["TeamID"],
                                "TeamDept": item["TeamDept"],
                                "TeamName": item["TeamName"],
                                "TeamNo": item["TeamNo"],
                                "TeamMember": item["TeamMemberDept"] + " " + item["TeamMember"]
                            });
                        });

                        //相同Team合併
                        resultArr = [];
                        for (var i = 0; i < simplifyArr.length;) {
                            if (i >= simplifyArr.length - 1) {
                                if (i == simplifyArr.length - 1) {
                                    resultArr.push(mergeItemBySameTeam(simplifyArr[i], null, "TeamMember"));
                                }
                                break;
                            }
                            //如果TeamID相同，合併對象；如果不同Team，直接添加到新數組
                            if (simplifyArr[i]["TeamID"] == simplifyArr[i + 1]["TeamID"]) {
                                var mergedItem = mergeItemBySameTeam(simplifyArr[i], simplifyArr[i + 1], "TeamMember");
                                var exist = false;
                                for (var j = 0; j < resultArr.length; j++) {
                                    if (resultArr[j]["TeamID"] == mergedItem["TeamID"]) {
                                        resultArr[j] = mergeItemBySameTeam(resultArr[j], mergedItem, "TeamMember");
                                        exist = true;
                                        break;
                                    }
                                }
                                if (!exist) {
                                    resultArr.push(mergedItem);
                                }

                                i += 2;
                            } else {
                                resultArr.push(mergeItemBySameTeam(simplifyArr[i], null, "TeamMember"));
                                i += 1;
                            }

                        }
                        //console.log(resultArr);

                        //生成html
                        var manageContent = "";
                        for (var i in resultArr) {
                            manageContent += '<tr><td>'
                                + resultArr[i]["TeamNo"]
                                + '</td><td>'
                                + resultArr[i]["TeamDept"]
                                + '</td><td></td><td>'
                                + resultArr[i]["TeamName"]
                                + '</td><td><img src="img/list_down.png" class="list-img"></td></tr><tr style="display:none;"><td></td><td></td><td></td><td>'
                                + resultArr[i]["Member"]
                                + '</td><td><img src="img/delete.png" class="team-delete" data-id="'
                                + resultArr[i]["ActivitiesID"]
                                + '" data-no="'
                                + resultArr[i]["TeamID"]
                                + '"></td></tr>';
                        }

                        $("#teamTable tr:first-child").nextAll().remove();
                        $("#teamTable").append(manageContent);


                    } else if (model == "5") {
                        var timeObj = data["Content"][0];
                        var timeArr = data["Content"];

                        //賦值
                        $("#timeManageThumbnail").attr("src", timeObj["ActivitiesImage"]);
                        $("#timeManageName").text(timeObj["ActivitiesName"]);

                        //展示所有欄位
                        var timeContent = '';
                        for (var i in timeArr) {
                            if (timeArr[i]["IsSignupTime"] != "") {
                                //取消报名信息
                                currentActName = timeArr[i]["ActivitiesName"];
                                currentCancelContent = timeArr[i]["EmployeeName"] + " / " + "同仁" + " / 1人";
                                cancelNo = timeArr[i]["SignupNo"];
                                //动态生成栏位
                                timeContent += '<div class="time-manage-info"><span>報名時段：</span><span>'
                                    + timeArr[i]["IsSignupTime"] + '</span></div>';
                                if (timeArr[i]["ColumnAnswer_1"] != "") {
                                    timeContent += '<div class="time-manage-info"><span>'
                                        + timeArr[i]["ColumnName_1"] + '：</span><span>'
                                        //+ timeArr[i]["ColumnAnswer_1"] + '</span></div>';
                                        + (timeArr[i]["ColumnType_1"] == "Multiple" ? timeArr[i]["ColumnAnswer_1"].substr(1, timeArr[i]["ColumnAnswer_1"].length) : timeArr[i]["ColumnAnswer_1"]) + '</span></div>';
                                }
                                if (timeArr[i]["ColumnAnswer_2"] != "") {
                                    timeContent += '<div class="time-manage-info"><span>'
                                        + timeArr[i]["ColumnName_2"] + '：</span><span>'
                                        //+ timeArr[i]["ColumnAnswer_2"] + '</span></div>';
                                        + (timeArr[i]["ColumnType_2"] == "Multiple" ? timeArr[i]["ColumnAnswer_2"].substr(1, timeArr[i]["ColumnAnswer_2"].length) : timeArr[i]["ColumnAnswer_2"]) + '</span></div>';
                                }
                                if (timeArr[i]["ColumnAnswer_3"] != "") {
                                    timeContent += '<div class="time-manage-info"><span>'
                                        + timeArr[i]["ColumnName_3"] + '：</span><span>'
                                        //+ timeArr[i]["ColumnAnswer_3"] + '</span></div>';
                                        + (timeArr[i]["ColumnType_3"] == "Multiple" ? timeArr[i]["ColumnAnswer_3"].substr(1, timeArr[i]["ColumnAnswer_3"].length) : timeArr[i]["ColumnAnswer_3"]) + '</span></div>';
                                }
                                if (timeArr[i]["ColumnAnswer_4"] != "") {
                                    timeContent += '<div class="time-manage-info"><span>'
                                        + timeArr[i]["ColumnName_4"] + '：</span><span>'
                                        //+ timeArr[i]["ColumnAnswer_4"] + '</span></div>';
                                        + (timeArr[i]["ColumnType_4"] == "Multiple" ? timeArr[i]["ColumnAnswer_4"].substr(1, timeArr[i]["ColumnAnswer_4"].length) : timeArr[i]["ColumnAnswer_4"]) + '</span></div>';
                                }
                                if (timeArr[i]["ColumnAnswer_5"] != "") {
                                    timeContent += '<div class="time-manage-info"><span>'
                                        + timeArr[i]["ColumnName_5"] + '：</span><span>'
                                        //+ timeArr[i]["ColumnAnswer_5"] + '</span></div>';
                                        + (timeArr[i]["ColumnType_5"] == "Multiple" ? timeArr[i]["ColumnAnswer_5"].substr(1, timeArr[i]["ColumnAnswer_5"].length) : timeArr[i]["ColumnAnswer_5"]) + '</span></div>';
                                }
                                break;
                            }
                        }
                        $(".time-manage-field").empty().append(timeContent);

                        //展示所有時段
                        var timeShortArr = [];
                        for (var i in timeArr) {
                            timeShortArr.push({
                                "TimeSort": timeArr[i]["TimeSort"],
                                "SignupTime": timeArr[i]["SignupTime"],
                                "QuotaPlaces": timeArr[i]["QuotaPlaces"],
                                "RemainingPlaces": timeArr[i]["RemainingPlaces"]
                            });
                        }
                        timeShortArr.sort(sortByTimeID("TimeSort"));

                        var timeShortContent = "";
                        for (var i in timeShortArr) {
                            timeShortContent += '<div class="time-manage-tr" data-sort="'
                                + timeShortArr[i]["TimeSort"]
                                + '"><div>'
                                + timeShortArr[i]["SignupTime"]
                                + '</div><div>'
                                + timeShortArr[i]["QuotaPlaces"]
                                + '</div><div>'
                                + timeShortArr[i]["RemainingPlaces"]
                                + '</div></div>';
                        }
                        $(".time-manage-tbody").empty().append(timeShortContent);

                        //取消报名
                        cancelID = timeObj["ActivitiesID"];

                    }

                    //根據不同活動類型，展示不同頁面，並跳轉
                    showViewByModel("viewActivitiesManage", model);
                    setTimeout(function () {
                        changePageByPanel("viewActivitiesManage", true);
                    }, 500);

                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Manage", self.successCallback, self.failCallback, activitiesSignupManageQueryData, "");
            }();

        };

        //取消報名
        window.ActivitiesSignupCancelQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "045913") {
                    //重新獲取活動列表
                    ActivitiesListQuery();

                    //跳轉前刪除訪問頁面數組最後2個
                    pageVisitedList.pop();
                    pageVisitedList.pop();

                    //跳轉
                    $.each($("#openList .activity-list"), function (index, item) {
                        if ($(item).attr("data-id") == cancelID) {
                            $(item).trigger("click");
                        }
                    });
                    $("#cancelSuccessMsg").fadeIn(100).delay(2000).fadeOut(100);

                    //重新獲取報名記錄
                    ActivitiesRecordQuery();

                } else if (data["ResultCode"] == "045914") {
                    //報名取消失敗
                    popupMsgInit('.cancelFailMsg');
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Cancel", self.successCallback, self.failCallback, activitiesSignupCancelQueryData, "");
            }();

        };



        window.APIRequest = function () {

            var self = this;

            this.successCallback = function (data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };

        //合併對象
        function mergeItemBySameTeam(obj1, obj2, param) {
            var obj = {};
            if (obj2 !== null) {
                obj["Member"] = obj1[param] + "<br>" + obj2[param];
            } else {
                obj["Member"] = obj1[param];
            }
            obj["ActivitiesID"] = obj1["ActivitiesID"];
            obj["TeamDept"] = obj1["TeamDept"];
            obj["TeamID"] = obj1["TeamID"];
            obj["TeamName"] = obj1["TeamName"];
            obj["TeamNo"] = obj1["TeamNo"];
            return obj;
        }

        //个人报名根据限制人数生成dropdownlist
        function personDropdownlist(limit, check) {
            //1.转换成number类型
            limit = Number(limit);

            //2.select
            var personData = {
                id: "person-manage",
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
            tplJS.DropdownList("viewActivitiesManage", "personManagePlace", "prepend", "typeB", personData);

            //5.默认选中
            $.each($("#person-manage-option-list li"), function (index, item) {
                if ($(item).text() == check) {
                    $(item).trigger("click");
                }
            });
        }


        /********************************** page event *************************************/
        $("#viewActivitiesManage").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewActivitiesManage").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesManage").keypress(function (event) {

        });

        //從管理頁返回詳情頁
        $("#viewActivitiesManage .back-detail").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });


        /************************************ Team *************************************/
        //展開隊伍
        $("#teamTable").on("click", ".list-img", function () {
            var self = $(this);
            var src = $(this).attr("src").split("/")[1];
            var parentNode = $(this).parent().parent();

            if (src == "list_down.png") {
                self.attr("src", "img/list_up.png");
                parentNode.css("border-bottom", "0");
                parentNode.next().css("border-bottom", "1px solid #d6d6d6");
                parentNode.next().show();
            } else {
                self.attr("src", "img/list_down.png");
                parentNode.css("border-bottom", "1px solid #d6d6d6");
                parentNode.next().css("border-bottom", "0");
                parentNode.next().hide();
            }
        });

        //展開所有隊伍
        $("#expandAllTeam").on("click", function () {
            var src = $(this).attr("src").split("/")[1];
            if (src == "all_list_down.png") {
                $.each($(".list-img"), function (index, item) {
                    if ($(item).attr("src") == "img/list_down.png") {
                        $(item).trigger("click");
                    }
                });
                $(this).attr("src", "img/all_list_up.png");
            } else {
                $.each($(".list-img"), function (index, item) {
                    if ($(item).attr("src") == "img/list_up.png") {
                        $(item).trigger("click");
                    }
                });
                $(this).attr("src", "img/all_list_down.png");
            }
        });

        //取消組隊報名
        $("#teamTable").on("click", ".team-delete", function () {
            cancelID = $(this).attr("data-id");
            cancelNo = $(this).attr("data-no");
            cancelTeamName;

            for (var i in resultArr) {
                if (cancelNo == resultArr[i]["TeamID"]) {
                    cancelTeamName = resultArr[i]["TeamName"];
                    break;
                }
            }

            $(".cancelSignupMsg .header-title").text(cancelActName);
            $(".cancelSignupMsg .main-paragraph").text(cancelTeamName);
            popupMsgInit('.cancelSignupMsg');

        });

        //確定取消報名
        $("#confirmCancelSignup").on("click", function () {
            loadingMask("show");
            activitiesSignupCancelQueryData = '<LayoutHeader><ActivitiesID>'
                + cancelID
                + '</ActivitiesID><SignupNo>'
                + cancelNo
                + '</SignupNo><SignupModel>'
                + cancelModel
                + '</SignupModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            //console.log(activitiesSignupCancelQueryData);
            ActivitiesSignupCancelQuery();

        });


        /************************************ Person *************************************/
        //dropdownlist
        $("#personManagePlace").on("change", "select", function () {
            submitSignupPlace = $(this).val();

        });

        //select
        $(".person-manage-custom-field").on("change", "select", function () {
            var selfName = $(this).parent().prev().text();
            var selfVal = $(this).val();
            //保存栏位值并检查表单
            saveValueAndCheckForm(personManageArr, selfName, selfVal, null, "updatePersonSignup");
        });

        //text
        $(".person-manage-custom-field").on("keyup", ".personManageText", function () {
            var selfName = $(this).prev().text();
            var selfVal = $(this).val();

            if (timeoutCheckPersonManage != null) {
                clearTimeout(timeoutCheckPersonManage);
                timeoutCheckPersonManage = null;
            }
            timeoutCheckPersonManage = setTimeout(function () {
                //保存栏位值并检查表单
                saveValueAndCheckForm(personManageArr, selfName, selfVal, null, "updatePersonSignup");
            }, 1000);

        });

        //checkbox
        $(".person-manage-custom-field").on("click", ".custom-field-checkbox > div", function () {
            var src = $(this).find("img").attr("src");
            var name = $(this).parent().prev().text();
            var value = $(this).children("span").text();

            if (src == "img/checkbox_n.png") {
                //保存栏位值并检查表单
                saveValueAndCheckForm(personManageArr, name, value, true, "updatePersonSignup");
                $(this).find("img").attr("src", "img/checkbox_s.png");
            } else {
                //保存栏位值并检查表单
                saveValueAndCheckForm(personManageArr, name, value, false, "updatePersonSignup");
                $(this).find("img").attr("src", "img/checkbox_n.png");
            }

        });

        //取消報名-popup
        $("#cancelPersonSignup").on("click", function () {
            $(".cancelSignupMsg .header-title").text(currentActName);
            $(".cancelSignupMsg .main-paragraph").text(currentCancelContent);
            popupMsgInit('.cancelSignupMsg');
        });

        //更改資料
        $("#updatePersonSignup").on("click", function () {
            var self = $(this).hasClass("btn-disabled");
            if (!self) {
                loadingMask("show");
                activitiesSignupConfirmQueryData = '<LayoutHeader><ActivitiesID>'
                    + cancelID
                    + '</ActivitiesID><SignupModel>'
                    + cancelModel
                    + '</SignupModel><SignupPlaces>'
                    + submitSignupPlace
                    + '</SignupPlaces><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><ColumnAnswer_1>'
                    + (personManageArr[0] == undefined ? "" : personManageArr[0]["ColumnAnswer"])
                    + '</ColumnAnswer_1><ColumnAnswer_2>'
                    + (personManageArr[1] == undefined ? "" : personManageArr[1]["ColumnAnswer"])
                    + '</ColumnAnswer_2><ColumnAnswer_3>'
                    + (personManageArr[2] == undefined ? "" : personManageArr[2]["ColumnAnswer"])
                    + '</ColumnAnswer_3><ColumnAnswer_4>'
                    + (personManageArr[3] == undefined ? "" : personManageArr[3]["ColumnAnswer"])
                    + '</ColumnAnswer_4><ColumnAnswer_5>'
                    + (personManageArr[4] == undefined ? "" : personManageArr[4]["ColumnAnswer"])
                    + '</ColumnAnswer_5></LayoutHeader>';

                //console.log(activitiesSignupConfirmQueryData);
                ActivitiesSignupConfirmQuery(cancelID, "N");
            }
        });


        /************************************ Time *************************************/
        //取消报名-popup
        $("#cancelTimeSignup").on("click", function () {
            $(".cancelSignupMsg .header-title").text(currentActName);
            $(".cancelSignupMsg .main-paragraph").text(currentCancelContent);
            popupMsgInit('.cancelSignupMsg');
        });


        /************************************ Family *************************************/
        //眷屬管理
        $("#manageSelectFamilyBtn").on("click", function () {
            if (!$("#manageSelectFamilyBtn").hasClass("btn-disabled")) {
                activitiesSignupFamilyQueryData = '<LayoutHeader><ActivitiesID>'
                    + cancelID
                    + '</ActivitiesID><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><IsSignup>Y</IsSignup></LayoutHeader>';

                //console.log(activitiesSignupFamilyQueryData);
                ActivitiesSignupFamilyQuery(cancelID, cancelModel, "Y", familyManageFieldArr, "");

            }
        });

        //取消眷屬報名
        $("#manageCancelSignupBtn").on("click", function() {
            loadingMask("show");
            activitiesSignupCancelQueryData = '<LayoutHeader><ActivitiesID>'
                + cancelID
                + '</ActivitiesID><SignupModel>'
                + cancelModel
                + '</SignupModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            console.log(activitiesSignupCancelQueryData);
            ActivitiesSignupCancelQuery();
        });

    }
});
