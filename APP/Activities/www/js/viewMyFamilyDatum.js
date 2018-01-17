
$("#viewMyFamilyDatum").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/
        var addOrUpdate;
        var familyNo,familyName;
        var relationshipData = {
            id: "relationship-popup",
            option: [],
            title: '',
            defaultText: "請選擇",
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };
        var genderData = {
            id: "gender-popup",
            option: [],
            title: '',
            defaultText: "請選擇",
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };

        //眷屬資料
        window.ActivitiesFamilyQuery = function() {

            this.successCallback = function(data) {
                loadingMask("hide");
                console.log(data);

                if(data["ResultCode"] == "1") {
                    var familyArr = data["Content"];
                    var familyList = "";
                    for(var i in familyArr) {
                        if(familyArr[i]["IsActivities"] == "N") {
                            familyList += '<div class="family-list" data-id="'
                                + familyArr[i]["FamilyNo"]
                                + '"><div class="font-style10 font-color2 family-edit"><div><span>'
                                + familyArr[i]["FamilyName"]
                                + '</span>/<span>'
                                + familyArr[i]["RelationshipDesc"]
                                + '</span></div><div>'
                                + familyArr[i]["FamilyBirthday"]
                                + '</div><div>'
                                + familyArr[i]["FamilyID"]
                                + '</div></div><div><img src="img/delete.png" class="family-delete"></div></div><div class="activity-line"></div>';
                        } else {
                            familyList += '<div class="family-list data-id="'
                                + familyArr[i]["FamilyNo"]
                                + '"><div class="font-style10 font-color2 family-edit"><div><span>'
                                + familyArr[i]["FamilyName"]
                                + '</span>/<span>'
                                + familyArr[i]["RelationshipDesc"]
                                + '</span></div><div>'
                                + familyArr[i]["FamilyBirthday"]
                                + '</div><div>'
                                + familyArr[i]["FamilyID"]
                                + '</div></div><div><span>'
                                //+ "活動尚未結束無法刪除"
                                + langStr["str_037"]
                                + '</span></div></div><div class="activity-line"></div>';
                        }
                        
                    }

                    $("#familyList").append(familyList).children("div:last-child").remove();
                    //$("#familyList").empty().append(familyList).children("div:last-child").remove();
                    $("#viewFamilyNone").hide();
                    $("#viewFamilyList").show();

                } else if(data["ResultCode"] == "045902") {
                    $("#viewFamilyList").hide();
                    $("#viewFamilyNone").show();
                }
                
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Family", self.successCallback, self.failCallback, activitiesFamilyQueryData, "");
            }();

        };

        //添加眷屬資料
        window.ActivitiesFamilyAddQuery = function() {

            this.successCallback = function(data) {
                loadingMask("hide");
                console.log(data);

                if(data["ResultCode"] == "045903") {

                } else if(data["ResultCode"] == "045904") {

                }

            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Family_Add", self.successCallback, self.failCallback, activitiesFamilyAddQueryData, "");
            }();

        };

        //更新眷屬資料
        window.ActivitiesFamilyUpdateQuery = function() {

            this.successCallback = function(data) {
                loadingMask("hide");
                console.log(data);

                if(data["ResultCode"] == "045905") {

                } else if(data["ResultCode"] == "045906") {

                }

            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Family_Update", self.successCallback, self.failCallback, activitiesFamilyUpdateQueryData, "");
            }();

        };

        //刪除眷屬資料
        window.ActivitiesFamilyDeleteQuery = function() {

            this.successCallback = function(data) {
                loadingMask("hide");
                console.log(data);

                if(data["ResultCode"] == "045907") {

                } else if(data["ResultCode"] == "045908") {

                }

            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Family_Delete", self.successCallback, self.failCallback, activitiesFamilyDeleteQueryData, "");
            }();

        };

        window.APIRequest = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };


        //生成關係和性別的dropdownlist
        function setDropdownlistByFamily() {
            //關係
            relationshipData["option"][0] = {};
            relationshipData["option"][0]["value"] = 0;
            relationshipData["option"][0]["text"] = "女";
            relationshipData["option"][1] = {};
            relationshipData["option"][1]["value"] = 1;
            relationshipData["option"][1]["text"] = "男";

            tplJS.DropdownList("viewMyFamilyDatum", "relationshipDropdownlist", "prepend", "typeB", relationshipData);

            //性別
            genderData["option"][0] = {};
            genderData["option"][0]["value"] = 1;
            genderData["option"][0]["text"] = "配偶";
            genderData["option"][1] = {};
            genderData["option"][1]["value"] = 2;
            genderData["option"][1]["text"] = "子女";
            genderData["option"][2] = {};
            genderData["option"][2]["value"] = 3;
            genderData["option"][2]["text"] = "父母";
            genderData["option"][3] = {};
            genderData["option"][3]["value"] = 4;
            genderData["option"][3]["text"] = "配偶父母";
            genderData["option"][4] = {};
            genderData["option"][4]["value"] = 5;
            genderData["option"][4]["text"] = "兄弟";
            genderData["option"][5] = {};
            genderData["option"][5]["value"] = 6;
            genderData["option"][5]["text"] = "姊妹";
            genderData["option"][6] = {};
            genderData["option"][6]["value"] = 7;
            genderData["option"][6]["text"] = "祖父母";
            genderData["option"][7] = {};
            genderData["option"][7]["value"] = 8;
            genderData["option"][7]["text"] = "外祖父母";
            genderData["option"][8] = {};
            genderData["option"][8]["value"] = 9;
            genderData["option"][8]["text"] = "其他親友";

            tplJS.DropdownList("viewMyFamilyDatum", "genderDropdownlist", "prepend", "typeB", genderData);


        }

        /********************************** page event *************************************/
        $("#viewMyFamilyDatum").on("pagebeforeshow", function(event, ui) {
            if(viewFamilyInit) {
                setDropdownlistByFamily();
                
                viewFamilyInit = false;
            }
           
        });

        $("#viewMyFamilyDatum").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewMyFamilyDatum").keypress(function(event) {

        });

        //hard code
        $(".family-delete").on("click", function() {
            var selfParent = $(this).parent().parent();
            if(selfParent.next().attr("class") == "activity-line") {
                selfParent.next().remove();
            }
            selfParent.remove();
        });

        //刪除眷屬資料彈窗popup
        $(document).on("click", ".family-delete", function() {
            familyNo = $(this).parent().parent().attr("data-id");
            familyName = $(this).parent().prev().children("div:first-child").children("span:first-child").text();
            $(".confirmDeteteFamily .main-paragraph").text(familyName);
            popupMsgInit('.confirmDeteteFamily');
        });

        //確定刪除
        $("#confirmDeteteFamilyBtn").on("click", function() {
            activitiesFamilyDeleteQueryData = '<LayoutHeader><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo><FamilyNo>'
                + familyNo
                + '</FamilyNo><LayoutHeader>';
            
            console.log(activitiesFamilyDeleteQueryData);
            //ActivitiesFamilyDeleteQuery();
        });

        //返回到眷屬列表，彈窗popup
        $("#viewMyFamilyDatum .back-family").on("click", function() {
            if(addOrUpdate) {
                popupMsgInit('.confirmCancelAddFamily');
            } else {
                $(".confirmCancelEditFamily .main-paragraph").text(familyName);
                popupMsgInit('.confirmCancelEditFamily');
            }
            
        });

        //確定取消新增，跳轉
        $("#confirmCancelAddFamilyBtn").on("click", function() {
            $("#viewMyFamilyDatum .back-family").hide();
            $("#viewFamilyEdit").hide();
            $("#viewMyFamilyDatum .menu").show();
            $("#viewFamilyList").show();
            $(".family-add-img").show();
        });

        //確定取消編輯，跳轉
        $("#confirmCancelEditFamilyBtn").on("click", function() {
            $("#viewMyFamilyDatum .back-family").hide();
            $("#viewFamilyEdit").hide();
            $("#viewMyFamilyDatum .menu").show();
            $("#viewFamilyList").show();
            $(".family-add-img").show();
        });

        //添加眷屬，跳轉到編輯頁
        $(".family-add-img").on("click", function() {
            $("#viewMyFamilyDatum .menu").hide();
            $("#viewFamilyList").hide();
            $(".family-add-img").hide();
            $("#viewMyFamilyDatum .back-family").show();
            $("#viewFamilyEdit").show();
            addOrUpdate = true;
        });

        //修改眷屬，跳轉到編輯頁
        $(document).on("click", ".family-edit", function() {
            familyName = $(this).children("div:first-child").children("span:first-child").text();
            $("#viewMyFamilyDatum .menu").hide();
            $("#viewFamilyList").hide();
            $(".family-add-img").hide();
            $("#viewMyFamilyDatum .back-family").show();
            $("#viewFamilyEdit").show();
            addOrUpdate = false;
        });

        //儲存按鈕
        $(".family-save-btn").on("click", function() {
            if(addOrUpdate) {
                //ActivitiesFamilyAddQuery();
            } else {
                //ActivitiesFamilyUpdateQuery();
            }
        });

        //關係dropdownlist
        $("#familyRelationship").on("click", function() {
            $("#relationship-popup").trigger("click");
        });

        //性別dropdownlist
        $("#familyGender").on("click", function() {
            $("#gender-popup").trigger("click");
        });

    }
});
