
$("#viewActivitiesManage").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var teamResultArr = [];    //已報名隊伍
        var personManageArr = [];    //個人報名管理所有欄位
        var familyManageFieldArr = [];    //眷屬報名管理所有欄位
        var timeoutCheckPersonManage = null, timeoutCheckFamilyManage = null;
        var cancelModel, cancelActName, cancelID, cancelNo, cancelContent, submitSignupPlace;

        /********************************** function *************************************/
        //報名管理
        window.ActivitiesSignupManageQuery = function (model) {

            this.successCallback = function (data) {
                //console.log(data);

                //取消報名的活動類型
                cancelModel = model;
                if (data["ResultCode"] == "1") {
                    if (model == "1") {
                        var manageObj = data["Content"][0];

                        //初始化
                        $("#personManagePlace").empty();
                        $("#person-manage-option-screen").remove();
                        $("#person-manage-option-popup").remove();
                        $(".person-manage-custom-field").empty();
                        for (var i = 0; i < 5; i++) {
                            $("#column-popup-personManageSelect-" + i + "-option-screen").remove();
                            $("#column-popup-personManageSelect-" + i + "-option-popup").remove();
                        }
                        $("#updatePersonSignup").removeClass("btn-disabled");

                        //賦值
                        $("#personManageThumbnail").attr("src", manageObj["ActivitiesImage"]);
                        $("#personManageName").text(manageObj["ActivitiesName"]);
                        $("#personIsFull").css("display", manageObj["IsFull"] == "Y" ? "block" : "none");
                        $("#personSignupedPlace").text(manageObj["SignupPlaces"]);
                        $(".person-manage-remark").empty().append("<div>" + manageObj["ActivitiesRemarks"] + "</div>");
                        //dropdownlist
                        personDropdownlist(manageObj["LimitPlaces"], manageObj["SignupPlaces"]);

                        //根據欄位類型，生成不同欄位
                        personManageArr = getCustomField(manageObj);
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
                        cancelActName = manageObj["ActivitiesName"];
                        cancelContent = manageObj["EmployeeName"] + " / " + "同仁" + " / " + manageObj["SignupPlaces"] + "人";
                        cancelID = manageObj["ActivitiesID"];
                        cancelNo = manageObj["SignupNo"];

                    } else if (model == "3") {
                        var manageObj = data["Content"][0];

                        //初始化
                        $(".family-manage-custom-field").empty();
                        for (var i = 0; i < 5; i++) {
                            $("#column-popup-familyManageSelect-" + i + "-option-screen").remove();
                            $("#column-popup-familyManageSelect-" + i + "-option-popup").remove();
                        }

                        //賦值
                        $("#familyManageThumbnail").attr("src", manageObj["ActivitiesImage"]);
                        $("#familyManageName").text(manageObj["ActivitiesName"]);
                        $("#familyManageLimit").text(manageObj["LimitPlaces"]);
                        $("#familyManageEmpName").text(manageObj["EmployeeName"]);
                        $("#familyManageRlts").text(manageObj["EmployeeRelationship"]);
                        $("#familyManageGender").text(manageObj["EmployeeGender"]);
                        $("#familyManageID").text(manageObj["EmpoyeeID"]);
                        $("#familyManageBirth").text(manageObj["EmployeeBirthday"]);

                        //選擇眷屬頁面
                        $("#familySelectThumbnail").attr("src", manageObj["ActivitiesImage"]);
                        $("#familySelectName").text(manageObj["ActivitiesName"]);
                        $("#familySelectLimitPlace").text(manageObj["LimitPlaces"]);
                        $(".select-family-remark").empty().append("<div>" + manageObj["ActivitiesRemarks"] + "</div>");
                        //因爲眷屬報名必須包含本人，所以可攜帶眷屬數量=總數量-1
                        selectFamilyLimit = manageObj["LimitPlaces"] - 1;

                        //根據欄位類型，生成不同欄位
                        familyManageFieldArr = getCustomField(manageObj);
                        for (var i in familyManageFieldArr) {
                            if (familyManageFieldArr[i]["ColumnType"] == "Select") {
                                setSelectCustomField(familyManageFieldArr, i, "viewActivitiesManage", "familyManageSelect", "family-manage-custom-field");

                            } else if (familyManageFieldArr[i]["ColumnType"] == "Text") {
                                setTextCustomField(familyManageFieldArr, i, "familyManageText", "family-manage-custom-field");

                            } else if (familyManageFieldArr[i]["ColumnType"] == "Multiple") {
                                setCheckboxCustomField(familyManageFieldArr, i, "familyManageCheckbox", "family-manage-custom-field");

                            }
                        }

                        //取消報名
                        cancelID = manageObj["ActivitiesID"];
                        cancelActName = manageObj["ActivitiesName"];
                        cancelContent = "";
                        //取消眷屬報名只能去報名記錄裏面查找
                        for (var i in recordArr) {
                            if (cancelID == recordArr[i]["ActivitiesID"]) {
                                cancelContent += '<span>' + recordArr[i]["SignupName"] + ' / ' + recordArr[i]["SignupRelationship"] + ' / ' + recordArr[i]["SignupPlaces"] + '人</span><br>';
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
                                "TeamMember": item["TeamMemberDept"] + "  " + item["TeamMember"]
                            });
                        });

                        //合并属性值相同的对象
                        var temp = [];
                        $.each(simplifyArr, function (index, item) {
                            var tempKey = item["TeamID"];

                            if (typeof temp[tempKey] == "undefined") {
                                temp[tempKey] = item;
                            } else {
                                temp[tempKey]["TeamMember"] += "<br>" + item["TeamMember"];
                            }
                        });
                        teamResultArr = [];
                        for (var i in temp) {
                            teamResultArr.push(temp[i]);
                        }
                        //console.log(teamResultArr); 

                        //生成html
                        var manageContent = "";
                        for (var i in teamResultArr) {
                            manageContent += '<tr><td>'
                                + teamResultArr[i]["TeamNo"]
                                + '</td><td>'
                                + teamResultArr[i]["TeamDept"]
                                + '</td><td></td><td>'
                                + teamResultArr[i]["TeamName"]
                                + '</td><td><img src="img/list_down.png" class="list-img"></td></tr><tr style="display:none;"><td></td><td></td><td></td><td>'
                                + teamResultArr[i]["TeamMember"]
                                + '</td><td><img src="img/delete.png" class="team-delete" data-id="'
                                + teamResultArr[i]["ActivitiesID"]
                                + '" data-no="'
                                + teamResultArr[i]["TeamID"]
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
                                cancelActName = timeArr[i]["ActivitiesName"];
                                cancelContent = timeArr[i]["EmployeeName"] + " / " + "同仁" + " / 1人 / " + timeArr[i]["IsSignupTime"];
                                cancelNo = timeArr[i]["SignupNo"];
                                cancelID = timeArr[i]["ActivitiesID"];
                                //动态生成栏位
                                timeContent += '<div class="time-manage-info"><span>報名時段：</span><span>'
                                    + timeArr[i]["IsSignupTime"] + '</span></div>';

                                for (var j = 1; j < 6; j++) {
                                    if (timeArr[i]["ColumnAnswer_" + j] != "") {
                                        timeContent += '<div class="time-manage-info"><span>'
                                            + timeArr[i]["ColumnName_" + j] + '：</span><span>'
                                            //+ timeArr[i]["ColumnAnswer_" + j] + '</span></div>';
                                            + (timeArr[i]["ColumnType_" + j] == "Multiple" ? timeArr[i]["ColumnAnswer_" + j].substr(1, timeArr[i]["ColumnAnswer_" + j].length) : timeArr[i]["ColumnAnswer_" + j]) + '</span></div>';
                                    }
                                }
                                break;
                            }
                        }
                        $(".time-manage-custom-field").empty().append(timeContent);

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

            for (var i in teamResultArr) {
                if (cancelNo == teamResultArr[i]["TeamID"]) {
                    cancelContent = teamResultArr[i]["TeamName"];
                    break;
                }
            }

            $(".cancelSignupMsg .header-title").text(cancelActName);
            $(".cancelSignupMsg .main-paragraph").empty().text(cancelContent);
            popupMsgInit('.cancelSignupMsg');

        });

        //確定取消報名（所有類型活動）
        $("#confirmCancelSignup").on("click", function () {
            loadingMask("show");

            activitiesSignupCancelQueryData = '<LayoutHeader><ActivitiesID>'
                + cancelID
                + '</ActivitiesID><SignupNo>'
                //+ cancelNo
                + (cancelModel == "3" ? "" : cancelNo)
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

        //取消個人報名-popup
        $("#cancelPersonSignup").on("click", function () {
            $(".cancelSignupMsg .header-title").text(cancelActName);
            $(".cancelSignupMsg .main-paragraph").empty().text(cancelContent);
            popupMsgInit('.cancelSignupMsg');
        });

        //更改資料
        $("#updatePersonSignup").on("click", function () {
            var selfClass = $(this).hasClass("btn-disabled");

            if (!selfClass) {
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
                ActivitiesSignupConfirmQuery(cancelID, cancelModel, "N");
            }
        });


        /************************************ Time *************************************/
        //取消時段报名-popup
        $("#cancelTimeSignup").on("click", function () {
            $(".cancelSignupMsg .header-title").text(cancelActName);
            $(".cancelSignupMsg .main-paragraph").empty().text(cancelContent);
            popupMsgInit('.cancelSignupMsg');
        });


        /************************************ Family *************************************/
        //select
        $(".family-manage-custom-field").on("change", ".familyManageSelect select", function () {
            var selfName = $(this).parent().prev().text();
            var selfVal = $(this).val();

            saveValueAndCheckForm(familyManageFieldArr, selfName, selfVal, null, "manageSelectFamilyBtn");
        });

        //text
        $(".family-manage-custom-field").on("keyup", ".familyManageText", function () {
            var selfName = $(this).prev().text();
            var selfVal = $(this).val();

            if (timeoutCheckFamilyManage != null) {
                clearTimeout(timeoutCheckFamilyManage);
                timeoutCheckFamilyManage = null;
            }
            timeoutCheckFamilyManage = setTimeout(function () {
                saveValueAndCheckForm(familyManageFieldArr, selfName, selfVal, null, "manageSelectFamilyBtn");
            }, 1000);

        });

        //checkbox
        $(".family-manage-custom-field").on("click", ".custom-field-checkbox > div", function () {
            var src = $(this).find("img").attr("src");
            var name = $(this).parent().prev().text();
            var value = $(this).children("span").text();

            if (src == "img/checkbox_n.png") {
                //保存栏位值并检查表单
                saveValueAndCheckForm(familyManageFieldArr, name, value, true, "manageSelectFamilyBtn");
                $(this).find("img").attr("src", "img/checkbox_s.png");
            } else {
                //保存栏位值并检查表单
                saveValueAndCheckForm(familyManageFieldArr, name, value, false, "manageSelectFamilyBtn");
                $(this).find("img").attr("src", "img/checkbox_n.png");
            }

        });

        //眷屬管理
        $("#manageSelectFamilyBtn").on("click", function () {
            var selfClass = $(this).hasClass("btn-disabled");

            if (!selfClass) {
                loadingMask("show");

                //1.個人信息
                var answerList = "";
                for (var i = 1; i < 6; i++) {
                    answerList += '<ColumnAnswer_' + i + '>'
                        + (familyManageFieldArr[i - 1] != undefined ? familyManageFieldArr[i - 1]["ColumnAnswer"] : "")
                        + '</ColumnAnswer_' + i + '>';
                }

                var familyList = '<FamilyList><ActivitiesID>'
                    + cancelID
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
                    + cancelID
                    + '</ActivitiesID><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><IsSignup>Y</IsSignup></LayoutHeader>';

                //console.log(activitiesSignupFamilyQueryData);
                ActivitiesSignupFamilyQuery(cancelID, cancelModel, "Y", familyManageFieldArr, familyList);

            }
        });

        //取消眷屬報名-popup
        $("#cancelFamilySignup").on("click", function () {
            $(".cancelSignupMsg .header-title").text(cancelActName);
            $(".cancelSignupMsg .main-paragraph").empty().append(cancelContent);
            popupMsgInit('.cancelSignupMsg');
        });

    }
});
