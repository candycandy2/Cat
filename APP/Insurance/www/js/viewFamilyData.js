
$("#viewFamilyData").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var familyArr = [];
        var familyNo = "", familyName = "", familyID = "", familyBirth = "", relationshipNo = "";
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

        //檢查所有欄位是否爲空
        function checkFormByFamily() {
            var nameVal = $.trim($("#familyName").val());
            var relationshipVal = $.trim($("#familyRelationship").val());
            var idVal = $.trim($("#familyID").val());
            var birthVal = $.trim($("#familyBirth").val());

            if (nameVal !== "" && relationshipVal !== "" && idVal !== "" && birthVal !== "") {
                $(".family-save-btn").css("opacity", "1");
                return true;
            } else {
                $(".family-save-btn").css("opacity", "0.6");
                return false;
            }
        }

        //“編輯”和“新增”的跳轉
        function changeViewToDetail() {
            $("#viewFamilyData .menu").hide();
            if (familyArr.length == 0) {
                $("#viewFamilyNone").hide();
            } else {
                $("#viewFamilyList").hide();
            }
            $(".family-add-img").hide();
            $("#backFamilyList").show();
            $(".family-save-btn").show();
            $("#viewFamilyEdit").show();
        }


        /********************************** page event *************************************/
        $("#viewFamilyData").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewFamilyData").on("pageshow", function (event, ui) {

        });
        
        /******************************** datetimepicker ***********************************/


        /********************************** dom event *************************************/
        $("#viewFamilyData").keypress(function (event) {

        });

        //返回到眷屬列表，彈窗popup
        $("#viewFamilyData .back-family").on("click", function () {
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
                    $("#familyID").val(familyArr[i]["FamilyID"]);
                    $("#familyBirth").val(familyArr[i]["FamilyBirthday"]);
                    familyID = familyArr[i]["FamilyID"];
                    familyBirth = familyArr[i]["FamilyBirthday"];
                    relationshipNo = familyArr[i]["FamilyRelationship"];

                    $.each($("#relationship-popup-option-list li"), function (index, item) {
                        if ($.trim($(item).text()) == familyArr[i]["RelationshipDesc"]) {
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

        });

        //關係dropdownlist-popup
        $("#familyRelationship").on("click", function () {
            $("#familyName").blur();
            $("#familyID").blur();
            setTimeout(function () {
                $("#relationship-popup").trigger("click");
            }, 200);
        });

        //點擊關係列表，觸發change事件
        $("#viewFamilyData").on("click", "#relationship-popup-option ul li", function () {
            var self = $(this).text();
            $("#familyRelationship").val($.trim(self));
            checkFormByFamily();
        });

        $("#viewFamilyData").on("popupafterclose", "#relationship-popup-option", function () {
            var self = $("#relationship-popup").val();
            if (self !== langStr["str_040"]) {
                relationshipNo = self;
            }
        });

        //檢查表單（姓名和身份證）是否符合提交要求
        $("#familyName").on("keyup", function (event) {
            if (timeoutFamilyName != null) {
                clearTimeout(timeoutFamilyName);
                timeoutFamilyName = null;
            }
            timeoutFamilyName = setTimeout(function () {
                familyName = $.trim($("#familyName").val());
                checkFormByFamily();
            }, 1000);
        });

        $("#familyID").on("keyup", function (event) {
            var pattern = /([^a-zA-Z0-9]*)[a-zA-Z0-9]*([^a-zA-Z0-9]*)/;
            var residue = event.currentTarget.value.match(pattern);
            if (residue[1] !== "" || residue[2] !== "") {
                $("#familyID").val($("#familyID").val().replace(residue[1], ""));
                $("#familyID").val($("#familyID").val().replace(residue[2], ""));
            }

            familyID = $.trim($("#familyID").val());
            checkFormByFamily();
        });


    }
});