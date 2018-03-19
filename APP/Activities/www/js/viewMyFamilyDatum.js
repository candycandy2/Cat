
$("#viewMyFamilyDatum").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var familyArr = [];
        var familyNo = "", familyName = "", familyID = "", familyBirth = "", relationshipNo = "", genderNo = "";
        var timeoutFamilyName = null, timeoutFamilyID = null;
        var relationshipData = {
            id: "relationship-popup",
            option: [],
            title: '',
            //defaultText: "請選擇",
            defaultText: langStr["str_040"],
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };
        var genderData = {
            id: "gender-popup",
            option: [],
            title: '',
            //defaultText: "請選擇",
            defaultText: langStr["str_040"],
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };

        //眷屬資料
        window.ActivitiesFamilyQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                familyArr = [];
                if (data["ResultCode"] == "1") {
                    //排序
                    familyArr = data["Content"].sort(sortByRelationship("FamilyRelationship", "FamilyName"));
                    var familyRemark = data["Content"][0]["FamilyRemark"];

                    var familyList = "";
                    for (var i in familyArr) {
                        if (familyArr[i]["IsActivities"] == "N") {
                            familyList += '<div class="family-list"><div class="font-style10 font-color2 family-edit" data-id="'
                                + familyArr[i]["FamilyNo"]
                                + '"><div><span>'
                                + familyArr[i]["FamilyName"]
                                + '</span>/<span>'
                                + familyArr[i]["RelationshipDesc"]
                                + '</span></div><div>'
                                + familyArr[i]["FamilyBirthday"]
                                + '</div><div>'
                                + familyArr[i]["FamilyID"]
                                + '</div></div><div><img src="img/delete.png" class="family-delete"></div></div><div class="activity-line"></div>';
                        } else {
                            familyList += '<div class="family-list"><div class="font-style10 font-color2 family-edit" data-id="'
                                + familyArr[i]["FamilyNo"]
                                + '"><div><span>'
                                + familyArr[i]["FamilyName"]
                                + '</span>/<span>'
                                + familyArr[i]["RelationshipDesc"]
                                + '</span></div><div>'
                                + familyArr[i]["FamilyBirthday"]
                                + '</div><div>'
                                + familyArr[i]["FamilyID"]
                                + '</div></div><div class="font-style10 font-color3"><span>'
                                //+ "活動尚未結束無法刪除"
                                + langStr["str_037"]
                                + '</span></div></div><div class="activity-line"></div>';
                        }
                    }

                    $("#familyList").empty().append(familyList).children("div:last-child").remove();
                    $(".family-notice").empty().append("<div>" + familyRemark + "</div>");

                } else if (data["ResultCode"] == "045902") {
                    $("#viewFamilyList").hide();
                    $("#viewFamilyNone").show();
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_Family", self.successCallback, self.failCallback, activitiesFamilyQueryData, "");
            }();

        };

        //添加眷屬資料
        window.ActivitiesFamilyAddQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "045903") {
                    ActivitiesFamilyQuery();
                    changeViewToList();
                } else if (data["ResultCode"] == "045904") {
                    //新增眷屬資料失敗
                    $(".familyErrorMsg .header-text").text(langStr["str_041"]);
                    popupMsgInit('.familyErrorMsg');
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Family_Add", self.successCallback, self.failCallback, activitiesFamilyAddQueryData, "");
            }();

        };

        //更新眷屬資料
        window.ActivitiesFamilyUpdateQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "045905") {
                    ActivitiesFamilyQuery();
                    changeViewToList();
                } else if (data["ResultCode"] == "045906") {
                    //更新眷屬資料失敗
                    $(".familyErrorMsg .header-text").text(langStr["str_042"]);
                    popupMsgInit('.familyErrorMsg');
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Family_Update", self.successCallback, self.failCallback, activitiesFamilyUpdateQueryData, "");
            }();

        };

        //刪除眷屬資料
        window.ActivitiesFamilyDeleteQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "045907") {
                    ActivitiesFamilyQuery();
                    changeViewToList();
                } else if (data["ResultCode"] == "045908") {
                    //刪除眷屬資料失敗
                    $(".familyErrorMsg .header-text").text(langStr["str_043"]);
                    popupMsgInit('.familyErrorMsg');
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Family_Delete", self.successCallback, self.failCallback, activitiesFamilyDeleteQueryData, "");
            }();

        };

        //生成關係和性別的dropdownlist
        function setDropdownlistByFamily() {
            //關係
            relationshipData["option"][0] = {};
            relationshipData["option"][0]["value"] = "1";
            relationshipData["option"][0]["text"] = langStr["str_090"];
            relationshipData["option"][1] = {};
            relationshipData["option"][1]["value"] = "2";
            relationshipData["option"][1]["text"] = langStr["str_091"];
            relationshipData["option"][2] = {};
            relationshipData["option"][2]["value"] = "3";
            relationshipData["option"][2]["text"] = langStr["str_092"];
            relationshipData["option"][3] = {};
            relationshipData["option"][3]["value"] = "4";
            relationshipData["option"][3]["text"] = langStr["str_093"];
            relationshipData["option"][4] = {};
            relationshipData["option"][4]["value"] = "5";
            relationshipData["option"][4]["text"] = langStr["str_094"];
            relationshipData["option"][5] = {};
            relationshipData["option"][5]["value"] = "6";
            relationshipData["option"][5]["text"] = langStr["str_095"];
            relationshipData["option"][6] = {};
            relationshipData["option"][6]["value"] = "7";
            relationshipData["option"][6]["text"] = langStr["str_096"];
            relationshipData["option"][7] = {};
            relationshipData["option"][7]["value"] = "8";
            relationshipData["option"][7]["text"] = langStr["str_097"];
            relationshipData["option"][8] = {};
            relationshipData["option"][8]["value"] = "9";
            relationshipData["option"][8]["text"] = langStr["str_098"];

            $("#relationshipDropdownlist").empty();
            tplJS.DropdownList("viewMyFamilyDatum", "relationshipDropdownlist", "prepend", "typeB", relationshipData);

            //性別
            genderData["option"][0] = {};
            genderData["option"][0]["value"] = "0";
            genderData["option"][0]["text"] = langStr["str_099"];
            genderData["option"][1] = {};
            genderData["option"][1]["value"] = "1";
            genderData["option"][1]["text"] = langStr["str_100"];

            $("#genderDropdownlist").empty();
            tplJS.DropdownList("viewMyFamilyDatum", "genderDropdownlist", "prepend", "typeB", genderData);
        }

        //檢查所有欄位是否爲空
        function checkFormByFamily() {
            var nameVal = $.trim($("#familyName").val());
            var relationshipVal = $.trim($("#familyRelationship").val());
            var genderVal = $.trim($("#familyGender").val());
            var idVal = $.trim($("#familyID").val());
            var birthVal = $.trim($("#familyBirth").val());

            if (nameVal !== "" && relationshipVal !== "" && genderVal !== "" && idVal !== "" && birthVal !== "") {
                $(".family-save-btn").css("opacity", "1");
                return true;
            } else {
                $(".family-save-btn").css("opacity", "0.6");
                return false;
            }
        }

        //清空所有欄位
        function clearFormByFamily() {
            $("#familyName").val("");
            $("#familyRelationship").val("");
            $("#familyGender").val("");
            $("#familyID").val("");
            $("#familyBirth").val("");
            familyNo = "";
            familyName = "";
            familyID = "";
            familyBirth = "";
            relationshipNo = "";
            genderNo = "";

            $.each($("#relationship-popup-option-list li"), function (index, item) {
                if ($(item).hasClass("tpl-dropdown-list-selected")) {
                    $(item).removeClass("tpl-dropdown-list-selected");
                }
            });

            $.each($("#gender-popup-option-list li"), function (index, item) {
                if ($(item).hasClass("tpl-dropdown-list-selected")) {
                    $(item).removeClass("tpl-dropdown-list-selected");
                }
            });
        }

        //“取消編輯”和“取消新增”的跳轉
        function changeViewToList() {
            $("#viewMyFamilyDatum .back-family").hide();
            $(".family-save-btn").hide();
            $("#viewFamilyEdit").hide();
            $("#viewMyFamilyDatum .menu").show();
            if (familyArr.length == 0) {
                $("#viewFamilyNone").show();
            } else {
                $("#viewFamilyList").show();
            }
            $(".family-add-img").show();
        }

        //“編輯”和“新增”的跳轉
        function changeViewToDetail() {
            $("#viewMyFamilyDatum .menu").hide();
            if (familyArr.length == 0) {
                $("#viewFamilyNone").hide();
            } else {
                $("#viewFamilyList").hide();
            }
            $(".family-add-img").hide();
            $("#viewMyFamilyDatum .back-family").show();
            $(".family-save-btn").show();
            $("#viewFamilyEdit").show();
        }


        /********************************** page event *************************************/
        $("#viewMyFamilyDatum").on("pagebeforeshow", function (event, ui) {
            if (viewFamilyInit) {
                setDropdownlistByFamily();
                viewFamilyInit = false;
            }

        });

        $("#viewMyFamilyDatum").on("pageshow", function (event, ui) {

        });

        /******************************** datetimepicker ***********************************/
        $('#familyBirth').datetimepicker({
            timepicker: false
        });

        $("#familyBirth").on("click", function () {
            $('#familyBirth').datetimepicker("show");
        });

        $("#familyBirth").on("change", function () {
            familyBirth = $(this).val().substring(0, 10);
            $(this).val(familyBirth);
            checkFormByFamily();
        });

        /********************************** dom event *************************************/
        $("#viewMyFamilyDatum").keypress(function (event) {

        });

        //刪除眷屬資料彈窗popup
        $("#familyList").on("click", ".family-delete", function () {
            familyNo = $(this).parent().prev().attr("data-id");
            familyName = $(this).parent().prev().children("div:first-child").children("span:first-child").text();
            $(".confirmDeleteFamily .main-paragraph").text(familyName);
            popupMsgInit('.confirmDeleteFamily');
        });

        //確定刪除
        $("#confirmDeleteFamilyBtn").on("click", function () {
            loadingMask("show");
            activitiesFamilyDeleteQueryData = '<LayoutHeader><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo><FamilyNo>'
                + familyNo
                + '</FamilyNo></LayoutHeader>';

            //console.log(activitiesFamilyDeleteQueryData);
            ActivitiesFamilyDeleteQuery();
        });

        //返回到眷屬列表，彈窗popup
        $("#viewMyFamilyDatum .back-family").on("click", function () {
            if (addFamilyOrNot) {
                popupMsgInit('.confirmCancelAddFamily');
            } else {
                popupMsgInit('.confirmCancelEditFamily');
            }

        });

        //確定取消新增，跳轉
        $("#confirmCancelAddFamilyBtn").on("click", function () {
            changeViewToList();
        });

        //確定取消編輯，跳轉
        $("#confirmCancelEditFamilyBtn").on("click", function () {
            changeViewToList();
        });

        //添加眷屬，跳轉到編輯頁
        $(".family-add-img").on("click", function () {
            clearFormByFamily();
            changeViewToDetail();
            addFamilyOrNot = true;
            checkFormByFamily();
            $("#familyName").removeAttr("readonly");
            $("#familyName").css("background", "#f9f9f9");
        });

        //修改眷屬，跳轉到編輯頁
        $("#familyList").on("click", ".family-edit", function () {
            //1.傳值
            var self = $(this).attr("data-id");
            familyNo = self;
            for (var i in familyArr) {
                if (self == familyArr[i]["FamilyNo"]) {
                    $("#familyName").val(familyArr[i]["FamilyName"]);
                    $("#familyRelationship").val(familyArr[i]["RelationshipDesc"]);
                    $("#familyGender").val(familyArr[i]["GenderDesc"]);
                    $("#familyID").val(familyArr[i]["FamilyID"]);
                    $("#familyBirth").val(familyArr[i]["FamilyBirthday"]);
                    familyID = familyArr[i]["FamilyID"];
                    familyBirth = familyArr[i]["FamilyBirthday"];
                    relationshipNo = familyArr[i]["FamilyRelationship"];
                    genderNo = familyArr[i]["FamilyGender"];

                    $.each($("#relationship-popup-option-list li"), function (index, item) {
                        if ($.trim($(item).text()) == familyArr[i]["RelationshipDesc"]) {
                            $(item).trigger("click");
                        }
                    });

                    $.each($("#gender-popup-option-list li"), function (index, item) {
                        if ($.trim($(item).text()) == familyArr[i]["GenderDesc"]) {
                            $(item).trigger("click");
                        }
                    });

                    break;
                }
            }

            //2.跳轉
            familyName = $(this).children("div:first-child").children("span:first-child").text();
            changeViewToDetail();
            addFamilyOrNot = false;
            $(".confirmCancelEditFamily .main-paragraph").text(familyName);
            checkFormByFamily();
            $("#familyName").attr("readonly", "readonly");
            $("#familyName").css("background", "#cccccc");
        });

        //儲存按鈕
        $(".family-save-btn").on("click", function () {
            if (checkFormByFamily()) {
                loadingMask("show");
                familyName = $.trim($("#familyName").val());
                familyID = $.trim($("#familyID").val());

                if (addFamilyOrNot) {
                    activitiesFamilyAddQueryData = '<LayoutHeader><EmployeeNo>'
                        + myEmpNo
                        + '</EmployeeNo><FamilyID>'
                        + familyID
                        + '</FamilyID><FamilyName>'
                        + familyName
                        + '</FamilyName><FamilyGender>'
                        + genderNo
                        + '</FamilyGender><FamilyRelationship>'
                        + relationshipNo
                        + '</FamilyRelationship><FamilyBirthday>'
                        + familyBirth
                        + '</FamilyBirthday></LayoutHeader>';

                    //console.log(activitiesFamilyAddQueryData);
                    ActivitiesFamilyAddQuery();
                } else {
                    activitiesFamilyUpdateQueryData = '<LayoutHeader><EmployeeNo>'
                        + myEmpNo
                        + '</EmployeeNo><FamilyNo>'
                        + familyNo
                        + '</FamilyNo><FamilyID>'
                        + familyID
                        + '</FamilyID><FamilyGender>'
                        + genderNo
                        + '</FamilyGender><FamilyRelationship>'
                        + relationshipNo
                        + '</FamilyRelationship><FamilyBirthday>'
                        + familyBirth
                        + '</FamilyBirthday></LayoutHeader>';

                    //console.log(activitiesFamilyUpdateQueryData);
                    ActivitiesFamilyUpdateQuery();
                }
            }

        });

        //關係dropdownlist-popup
        $("#familyRelationship").on("click", function () {
            $("#familyName").blur();
            $("#familyID").blur();
            setTimeout(function () {
                $("#relationship-popup").trigger("click");
            }, 200);

        });

        //性別dropdownlist-popup
        $("#familyGender").on("click", function () {
            $("#familyName").blur();
            $("#familyID").blur();
            setTimeout(function () {
                $("#gender-popup").trigger("click");
            }, 200);

        });

        //點擊關係列表，觸發change事件
        $("#viewMyFamilyDatum").on("click", "#relationship-popup-option ul li", function () {
            var self = $(this).text();
            $("#familyRelationship").val($.trim(self));
            checkFormByFamily();
        });

        $("#viewMyFamilyDatum").on("popupafterclose", "#relationship-popup-option", function () {
            var self = $("#relationship-popup").val();
            if (self !== langStr["str_040"]) {
                relationshipNo = self;
            }
        });

        //點擊性別列表，觸發change事件
        $("#viewMyFamilyDatum").on("click", "#gender-popup-option ul li", function () {
            var self = $(this).text();
            $("#familyGender").val($.trim(self));
            checkFormByFamily();
        });

        $("#viewMyFamilyDatum").on("popupafterclose", "#gender-popup-option", function () {
            var self = $("#gender-popup").val();
            if (self !== langStr["str_040"]) {
                genderNo = self;
            }
        });

        //檢查表單（姓名和身份證）是否符合提交要求
        $("#familyName").on("keyup", function () {
            if (timeoutFamilyName != null) {
                clearTimeout(timeoutFamilyName);
                timeoutFamilyName = null;
            }
            timeoutFamilyName = setTimeout(function () {
                familyName = $.trim($("#familyName").val());
                checkFormByFamily();
            }, 1000);
        });

        $("#familyID").on("keyup", function () {
            if (timeoutFamilyID != null) {
                clearTimeout(timeoutFamilyID);
                timeoutFamilyID = null;
            }
            timeoutFamilyID = setTimeout(function () {
                familyID = $.trim($("#familyID").val());
                checkFormByFamily();
            }, 1000);
        });


    }


});