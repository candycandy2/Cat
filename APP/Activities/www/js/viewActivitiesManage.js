
$("#viewActivitiesManage").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var resultArr = [];
        var personManageArr = [];
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
                        personDropdownlist(manageObj["LimitPlaces"], manageObj["SignupPlaces"]);
                        personManageArr = getCustomField(manageObj);

                        //根據欄位類型，生成不同欄位
                        for (var i in personManageArr) {
                            if (personManageArr[i]["ColumnType"] == "Select") {
                                setSelectCustomField(personManageArr, i, "viewActivitiesManage", "personManageSelect", "person-manage-custom-field");

                            } else if (personManageArr[i]["ColumnType"] == "Text") {
                                setTextCustomField(personManageArr, i, "personManageText", "person-manage-custom-field");

                            } else if (personManageArr[i]["ColumnType"] == "Multiple") {
                                //加字符“;”用於之後檢查表單是否爲空
                                personManageArr[i]["ColumnAnswer"] = ";" + personManageArr[i]["ColumnAnswer"];
                                setCheckboxCustomField(personManageArr, i, "personManageCheckbox", "person-manage-custom-field");

                            }
                        }

                        //取消報名
                        currentActName = manageObj["ActivitiesName"];
                        currentCancelContent = manageObj["EmployeeName"] + " / " + "同仁" + " / " + manageObj["SignupPlaces"] + "人";
                        cancelID = manageObj["ActivitiesID"];

                    } else if (model == "3") {

                    } else if (model == "4") {
                        //初始化
                        $("#expandAllTeam").attr("src", "img/all_list_down.png");

                        var manageArr = data["Content"];
                        cancelActName = manageArr[0]["ActivitiesName"];
                        $("#teamManageThumbnail").attr("src", manageArr[0]["ActivitiesImage"]);
                        $("#teamManageName").text(manageArr[0]["ActivitiesName"]);
                        $("#teamSignupedPlaces").text(manageArr[0]["SignupTeam"]);

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

                    //跳轉
                    $.each($("#openList .activity-list"), function (index, item) {
                        if ($(item).attr("data-id") == cancelID) {
                            $(item).trigger("click");
                        }
                    });

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

        //生成Text欄位
        function setTextCustomField(arr, i, id, container) {
            var fieldContent = '<div class="custom-field"><label class="font-style11 font-color1">'
                + arr[i]["ColumnName"]
                + '</label><input id="' + id + i + '" type="text" data-role="none" class="' + id + '" value="'
                + (arr[i]["ColumnAnswer"] == "" ? "" : arr[i]["ColumnAnswer"])
                + '"></div>';

            $("." + container).append(fieldContent);
        }

        //生成Checkbox自定義欄位
        function setCheckboxCustomField(arr, i, id, content) {
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

            $("." + content).append(fieldContent + mutipleContent + "</div><div>");

            //選中默認值
            if (arr[i]["ColumnAnswer"] != "") {
                var valueArr = arr[i]["ColumnAnswer"].split(";");
                $.each($(".checkbox-" + id + "-" + i + " span"), function (index, item) {
                    for (var j in valueArr) {
                        if ($(item).text() == valueArr[j]) {
                            $(item).prev().attr("src", "img/checkbox_s.png");
                        }
                    }
                });
            }

        }

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
            //loadingMask("show");
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

    }
});
