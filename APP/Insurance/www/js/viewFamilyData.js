var familyArr = [{family_id:"1", name:"王小明", relation:"父母", birthday:"1980/01/01", idtype:"0", idno:"A123456789"},
                {family_id:"2", name:"王小美", relation:"父母", birthday:"1981/01/01", idtype:"0", idno:"A123456788"}]; 

$("#viewFamilyData").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
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

        //API:QueryFamilyData
        function queryFamilyList() {
            //replace familyArr's content to data["Content"]
            //var familyArr = JSON.parse(localStorage.getItem('familySettingdata')); 
 
            //replace (familyArr != null) to (data["ResultCode"] == "1")       
            if (familyArr != null) {
                //familyArr = data["Content"].sort(sortByRelationship("relation", "name"));
                var familyList = "";
                //for (var i in familyArr) {
                for (var i=0; i<familyArr.length; i++ ) {
                    var ageDate = new Date(Date.now() - new Date(familyArr[i]["birthday"]).getTime()); 
                    var familyAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                    familyList += '<div class="family-list"><div class="font-style10 font-color2" data-id="'
                        + familyArr[i]["family_id"]
                        + '"><div><span>'
                        + familyArr[i]["name"]
                        + '</span>/<span>'
                        + familyArr[i]["relation"]
                        + '</span>/<span>'
                        + familyAge
                        + '</span></div><div>'
                        + familyArr[i]["birthday"]
                        + '</div><div>'
                        + familyArr[i]["idno"]
                        + '</div></div><div><img src="img/info.png" class="family-edit"><img src="img/delete.png" class="family-delete"></div></div><div class="activity-line"></div>';
                }
                $("#familyList").empty().append(familyList).children("div:last-child").remove();
            } else {
                $("#viewFamilyList").hide();
                $("#viewFamilyNone").show();
            }
            loadingMask("hide");
        }

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

        //“編輯”和“新增”的跳轉
        function changeViewToDetail() {
            $("#viewFamilyData .insuranceMenu").hide();
            if (familyArr.length == 0) {
                $("#viewFamilyNone").hide();
            } else {
                $("#viewFamilyList").hide();
            }
            $(".family-add-img").hide();
            $("#backFamilyList").show();  
            $(".family-list-title").hide();         
            $(".family-add-title").show();
            $(".family-save-btn").show();
            $("#viewFamilyEdit").show();
        }


        /********************************** page event *************************************/
        $("#viewFamilyData").on("pagebeforeshow", function (event, ui) {
            queryFamilyList();
        });

        $("#viewFamilyData").on("pageshow", function (event, ui) {
            //loadingMask("hide");           
        });
        
        /******************************** datetimepicker ***********************************/


        /********************************** dom event *************************************/
        $("#viewFamilyData").keypress(function (event) {

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
            //API: ModifyFamilyData
            ActivitiesFamilyDeleteQuery();
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

        //編輯按鈕
        $(".family-edit-btn").on("click", function () {
            $(".family-edit-btn").hide();
            $(".family-cancle-btn").show();
            $(".family-edit").hide();
            $(".family-delete").show();
        });

        //取消按鈕
        $(".family-cancle-btn").on("click", function () {
            $(".family-cancle-btn").hide();
            $(".family-edit-btn").show();
            $(".family-delete").hide();
            $(".family-edit").show();
            
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