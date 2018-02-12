
$("#viewSelectFamily").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var checkboxImgSrcN = "img/checkbox_n.png";
        var checkboxImgSrcY = "img/checkbox_s.png";
        var expandImgSrcN = "img/list_down.png";
        var expandImgSrcY = "img/list_up.png";
        //var familySelected = 0;
        var actID, actModel;
        var familyAllList = [];

        /********************************** function *************************************/
        //選擇眷屬
        window.ActivitiesSignupFamilyQuery = function (id, model, isSignup, arr) {

            this.successCallback = function (data) {
                console.log(arr);
                console.log(data);

                actID = id, actModel = model;
                if (data["ResultCode"] == "1") {
                    //初始化
                    $(".select-family-field").empty();
                    for (var i = 0; i < data["Content"].length; i++) {
                        for (var j = 0; j < 5; j++) {
                            $("#column-popup-" + i + "-familySelect-" + j + "-option-screen").remove();
                            $("#column-popup-" + i + "-familySelect-" + j + "-option-popup").remove();
                        }
                    }

                    //動態生成html
                    var selectFamilyArr = data["Content"];
                    var selectContent = "";
                    for (var i in selectFamilyArr) {
                        selectContent += '<div><div class="select-family-tr"><div data-no="'
                            + selectFamilyArr[i]["FamilyNo"]
                            + '"><img src="img/checkbox_n.png" class="family-checkbox-img"></div><div>'
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
                            //+ '</span></div><div class="select-family-field">' + $(".family-signup-custom-field").html() + '</div></div></div>';
                            + '</span></div><div class="select-family-field"></div></div></div>';
                    }

                    $(".select-family-tbody").empty().append(selectContent);

                    //給所有眷屬添加自定義欄位和值
                    $.each($(".select-family-field"), function (index, item) {
                        //根據欄位類型，生成不同欄位
                        for (var i in arr) {
                            if (arr[i]["ColumnType"] == "Select") {
                                setSelectCustomField2(index, arr, i, "viewSelectFamily", "familySelect", $(item));

                            } else if (arr[i]["ColumnType"] == "Text") {
                                setTextCustomField2(index, arr, i, "familySelectText", $(item));

                            } else if (arr[i]["ColumnType"] == "Multiple") {
                                setCheckboxCustomField2(index, arr, i, "familySelectCheckbox", $(item));
                            }
                        }
                    });

                    //欄位值對象
                    var answerObj = {};
                    for (var i = 0; i < 5;) {
                        for (var j = 1; j < 6; j++) {
                            answerObj["FamilyNo"] = "";
                            answerObj["ColumnName_" + j] = arr[i] == undefined ? "" : arr[i]["ColumnName"];
                            answerObj["ColumnType_" + j] = arr[i] == undefined ? "" : arr[i]["ColumnType"];
                            answerObj["ColumnItem_" + j] = arr[i] == undefined ? "" : arr[i]["ColumnItem"];
                            answerObj["ColumnAnswer_" + j] = arr[i] == undefined ? "" : arr[i]["ColumnAnswer"];
                            i++;
                        }
                    }

                    //每個眷屬生成一個自定義欄位值對象，並放入數組
                    familyAllList = [];
                    for(var i in selectFamilyArr) {
                        answerObj["FamilyNo"] = selectFamilyArr[i]["FamilyNo"];
                        familyAllList.push(answerObj);
                    }
                    console.log(familyAllList);

                    //跳轉
                    changePageByPanel("viewSelectFamily", true);
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Family", self.successCallback, self.failCallback, activitiesSignupFamilyQueryData, "");
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


        /********************************** page event *************************************/
        $("#viewSelectFamily").on("pagebeforeshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewSelectFamily").keypress(function (event) {

        });

        //返回眷屬報名或報名管理
        $("#viewSelectFamily .back-select").on("click", function () {
            changePageByPanel("viewActivitiesSignup", false);
        });

        //展開眷屬資料-img
        $(".select-family-tbody").on("click", ".family-expand-img", function () {
            var self = $(this);
            var src = $(this).attr("src");
            var parentNode = $(this).parent().parent();

            if (src == "img/list_down.png") {
                self.attr("src", "img/list_up.png");
                parentNode.parent().css("border-bottom", "0");
                parentNode.next().show();
            } else {
                self.attr("src", "img/list_down.png");
                parentNode.parent().css("border-bottom", "1px solid #d6d6d6");
                parentNode.next().hide();
            }
        });

        //選擇眷屬-checkbox
        $(".select-family-tbody").on("click", ".family-checkbox-img", function () {
            var self = $(this);
            var src = $(this).attr("src");
            var familyNo = $(this).parent().attr("data-no");
            var borderNode = $(this).parent().parent().next();

            //1.先檢查input欄位是否爲空，爲空不能選擇該眷屬
            var flag1 = true;
            var textCount = 0;
            $.each(borderNode.find(".select-family-field .custom-field > input"), function (index, item) {
                if ($.trim($(item).val()) == "") {
                    textCount++;
                }
            });
            if (textCount > 0) {
                flag1 = false;
            } else {
                flag1 = true;
            }

            //2.再檢查checkbox欄位是否爲空，爲空不能選擇眷屬
            var flag2 = true;
            var checkboxSelectCount = 0;
            $.each(borderNode.find(".select-family-field .custom-field .family-signup-checkbox"), function (index, item) {
                if ($(item).attr("src") == "img/checkbox_s.png") {
                    checkboxSelectCount++;
                }
            });
            if (checkboxSelectCount > 0) {
                flag2 = true;
            } else {
                flag2 = false;
            }

            //3.檢查目前已選擇的checkbox
            var familySelected = 0;
            $.each($(".family-checkbox-img"), function (index, item) {
                if ($(item).attr("src") == "img/checkbox_s.png") {
                    familySelected++;
                }
            });

            //4.再檢查是否小於限制
            if (flag1 && flag2 && familySelected < selectFamilyLimit && src == "img/checkbox_n.png") {
                self.attr("src", "img/checkbox_s.png");

                //欄位值添加到數組
                // familyList.push({
                //     "familyNo": familyNo,
                //     "ColumnAnswer_1": "",
                //     "ColumnAnswer_2": "",
                //     "ColumnAnswer_3": "",
                //     "ColumnAnswer_4": "",
                //     "ColumnAnswer_5": ""
                // });
            } else if (src == "img/checkbox_s.png") {
                self.attr("src", "img/checkbox_n.png");

                //欄位值從數組中刪除
                // for (var i in familyList) {
                //     if (familyList[i]["familyNo"] == familyNo) {
                //         familyList.splice(i, 1);
                //     }
                // }
            }

        });

        //展開全部眷屬資料
        $("#expandAllFamily").on("click", function () {
            var self = $(this);
            var src = $(this).attr("src");

            if (src == "img/all_list_down.png") {
                self.attr("src", "img/all_list_up.png");

                $.each($(".select-family-tr .family-expand-img"), function (index, item) {
                    if ($(item).attr("src") == "img/list_down.png") {
                        $(item).trigger("click");
                    }
                });

            } else {
                self.attr("src", "img/all_list_down.png");

                $.each($(".select-family-tr .family-expand-img"), function (index, item) {
                    if ($(item).attr("src") == "img/list_up.png") {
                        $(item).trigger("click");
                    }
                });

            }
        });

        //Select欄位值改變
        $(".")
    }
});
