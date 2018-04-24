/*var familyArr = [{family_id:"1", name:"王小明", relation:"父母", birthday:"1980/01/01", idtype:"0", idno:"A123456789"},
                {family_id:"2", name:"王小美", relation:"父母", birthday:"1981/01/01", idtype:"0", idno:"A123456788"}]; */
var familyArr = {};

$("#viewFamilyData").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var familyNo = "", familyInsurName = "", familyID = "", familyBirth = "", relationshipNo = "", typeNo = "";
        var timeoutFamilyName = null, timeoutFamilyID = null;
        var relationshipData = {
            id: "relationship-popup",
            option: [],
            title: '',
            //defaultText: "請選擇",
            defaultText: langStr["str_095"],
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };
        var idTypeData = {
            id: "idType-popup",
            option: [],
            title: '',
            //defaultText: "請選擇",
            defaultText: langStr["str_095"],
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };

        //API:QueryFamilyData
        function queryFamilyList() {
            //replace familyArr's content to data["Content"]
            familyArr = JSON.parse(localStorage.getItem('familySettingData')); 
 
            //replace (familyArr != null) to (data["ResultCode"] == "1")       
            if (familyArr != null) {
                //familyArr = data["Content"].sort(sortByRelationship("relation", "name"));
                var familyList = "";
                //for (var i in familyArr) {
                for (var i=0; i<familyArr.content.length; i++ ) {
                    //replace familyArr.content[i] to familyArr[i]
                    var ageDate = new Date(Date.now() - new Date(familyArr.content[i]["birthday"]).getTime()); 
                    var familyAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                    familyList += '<div class="family-list"><div class="font-style10 font-color2" data-id="'
                        + familyArr.content[i]["family_id"]
                        + '"><div><span>'
                        + familyArr.content[i]["name"]
                        + '</span>/<span>'
                        + familyArr.content[i]["relation"]
                        + '</span>/<span>'
                        + familyAge
                        + '</span></div><div>'
                        + familyArr.content[i]["birthday"]
                        + '</div><div>'
                        + familyArr.content[i]["idno"]
                        + '</div></div><div><img src="img/info.png" class="family-edit"><img src="img/delete.png" class="family-delete"></div></div><div class="activity-line"></div>';
                }
                $("#familyList").empty().append(familyList).children("div:last-child").remove();
            } else {
                $("#viewFamilyList").hide();
                $("#viewFamilyNone").show();
            }
            changeViewToList();
            loadingMask("hide");
        }

        //生成關係和證號類別的dropdownlist
        function setDropdownlistByFamily() {
            //關係
            relationshipData["option"][0] = {};
            relationshipData["option"][0]["value"] = "1";
            relationshipData["option"][0]["text"] = langStr["str_082"];
            relationshipData["option"][1] = {};
            relationshipData["option"][1]["value"] = "2";
            relationshipData["option"][1]["text"] = langStr["str_083"];
            relationshipData["option"][2] = {};
            relationshipData["option"][2]["value"] = "3";
            relationshipData["option"][2]["text"] = langStr["str_084"];
            relationshipData["option"][3] = {};
            relationshipData["option"][3]["value"] = "4";
            relationshipData["option"][3]["text"] = langStr["str_085"];
            relationshipData["option"][4] = {};
            relationshipData["option"][4]["value"] = "5";
            relationshipData["option"][4]["text"] = langStr["str_086"];
            relationshipData["option"][5] = {};
            relationshipData["option"][5]["value"] = "6";
            relationshipData["option"][5]["text"] = langStr["str_087"];
            relationshipData["option"][6] = {};
            relationshipData["option"][6]["value"] = "7";
            relationshipData["option"][6]["text"] = langStr["str_088"];
            relationshipData["option"][7] = {};
            relationshipData["option"][7]["value"] = "8";
            relationshipData["option"][7]["text"] = langStr["str_089"];
            relationshipData["option"][8] = {};
            relationshipData["option"][8]["value"] = "9";
            relationshipData["option"][8]["text"] = langStr["str_090"];
            relationshipData["option"][9] = {};
            relationshipData["option"][9]["value"] = "10";
            relationshipData["option"][9]["text"] = langStr["str_091"];

            $("#relationshipDropdownlist").empty();
            tplJS.DropdownList("viewFamilyData", "relationshipDropdownlist", "prepend", "typeB", relationshipData);

            //證號類別
            idTypeData["option"][0] = {};
            idTypeData["option"][0]["value"] = "1";
            idTypeData["option"][0]["text"] = langStr["str_092"];
            idTypeData["option"][1] = {};
            idTypeData["option"][1]["value"] = "2";
            idTypeData["option"][1]["text"] = langStr["str_093"];
            idTypeData["option"][2] = {};
            idTypeData["option"][2]["value"] = "3";
            idTypeData["option"][2]["text"] = langStr["str_094"];

            $("#typeDropdownlist").empty();
            tplJS.DropdownList("viewFamilyData", "typeDropdownlist", "prepend", "typeB", idTypeData);

        }

        //檢查所有欄位是否爲空
        function checkFormByFamily() {
            var nameVal = $.trim($("#familyInsurName").val());
            var relationshipVal = $.trim($("#familyRelationship").val());
            var typeVal = $.trim($("#idType").val());
            var idVal = $.trim($("#familyID").val());
            var birthVal = $.trim($("#familyBirth").val());

            if (nameVal !== "" && relationshipVal !== "" && idVal !== "" && birthVal !== "" && idVal !== "") {
                $(".family-save-btn").css("opacity", "1");
                return true;
            } else {
                $(".family-save-btn").css("opacity", "0.6");
                return false;
            }
        }

         //清空所有欄位
        function clearFormByFamily() {
            $("#familyInsurName").val("");
            $("#familyRelationship").val("");
            $("#idType").val("");
            $("#familyID").val("");
            $("#familyBirth").val("");
            familyNo = "";
            familyInsurName = "";
            familyID = "";
            familyBirth = "";
            relationshipNo = "";
            typeNo = "";

            $.each($("#relationship-popup-option-list li"), function (index, item) {
                if ($(item).hasClass("tpl-dropdown-list-selected")) {
                    $(item).removeClass("tpl-dropdown-list-selected");
                }
            });
            $.each($("#relationship-popup-option-list li"), function (index, item) {
                if ($(item).hasClass("tpl-dropdown-list-selected")) {
                    $(item).removeClass("tpl-dropdown-list-selected");
                }
            });

        }

        //“取消編輯”和“取消新增”的跳轉
        function changeViewToList() {
            $('#backFamilyList').hide();
            $(".family-save-btn").hide();
            $("#viewFamilyEdit").hide();
            $('#viewFamilyData .insuranceMenu').show();
            //After connect to API:QueryFamilyData, delete 'familyArr == null'
            if ( familyArr == null || familyArr.length == 0) {
                $("#viewFamilyNone").show();
            } else {
                $("#viewFamilyList").show();
            }
            $(".family-cancle-btn").hide();
            $(".family-edit-btn").show();  
            $(".family-add-img").show();
        }

        //“編輯”和“新增”的跳轉
        function changeViewToDetail() {
            $("#viewFamilyData .insuranceMenu").hide();
             //After connect to API:QueryFamilyData, delete 'familyArr == null'
            if ( familyArr == null || familyArr.length == 0) {
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

        //檢查輸入眷屬資料是否有誤
        function checkTextFormat() {
            var relationshipVal = $.trim($("#familyRelationship").val());
            var typeVal = $.trim($("#idType").val());
            var idVal = $.trim($("#familyID").val());
            var firstID = "ABCDEFGHJKLMNPQRSTUVXYWZIO"  

            if (typeVal == "身分證") {
                if (idVal.length != 10) {
                    $(".familyAddCheckMsg .lengthErr").addClass('addInlineBlock');  
                    $(".familyAddCheckMsg .formatErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .idDulErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .oneSpouseErr").removeClass('addInlineBlock');                  
                    popupMsgInit('.familyAddCheckMsg');
                    return false;
                } else if(idVal.search(/^[A-Z](1|2)\d{8}$/i) == -1){
                    $(".familyAddCheckMsg .lengthErr").removeClass('addInlineBlock');  
                    $(".familyAddCheckMsg .formatErr").addClass('addInlineBlock');  
                    $(".familyAddCheckMsg .idDulErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .oneSpouseErr").removeClass('addInlineBlock');  
                    popupMsgInit('.familyAddCheckMsg');
                    return false;
                } else {
                    return true;
                }
            }
        }

        //根據key value排序
        function sortDataByKey(sortData, sortKey, asc) {
            sortData = sortData.sort(function(a, b) {
                var x = a[sortKey];
                var y = b[sortKey];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        /********************************** page event *************************************/
        $("#viewFamilyData").on("pagebeforeshow", function (event, ui) {
            if (viewFamilyInit) {
                setDropdownlistByFamily();
                viewFamilyInit = false;
            }
            queryFamilyList();
        });

        $("#viewFamilyData").on("pageshow", function (event, ui) {
            //loadingMask("hide");  
            $(".family-cancle-btn").hide();
            $(".family-edit-btn").show();         
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
        $("#viewFamilyData").keypress(function (event) {

        });

        //刪除眷屬資料彈窗popup
        $("#familyList").on("click", ".family-delete", function () {
            familyNo = $(this).parent().prev().attr("data-id");
            familyInsurName = $(this).parent().prev().children("div:first-child").children("span:first-child").text();
            $(".confirmDeleteFamily .main-paragraph").text(familyInsurName);
            popupMsgInit('.confirmDeleteFamily');
        });

        //確定刪除
        $("#confirmDeleteFamilyBtn").on("click", function () {
            loadingMask("show");
            //API: ModifyFamilyData
            ActivitiesFamilyDeleteQuery();
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
            $("#familyInsurName").removeAttr("readonly");
            $("#familyInsurName").css("background", "#f9f9f9");
        });

        //修改眷屬，跳轉到編輯頁
        $("#familyList").on("click", ".family-edit", function () {
            //1.傳值
            var self = $(this).attr("data-id");
            familyNo = self;
            for (var i in familyArr) {
                if (self == familyArr[i]["FamilyNo"]) {
                    $("#familyInsurName").val(familyArr[i]["FamilyName"]);
                    $("#familyRelationship").val(familyArr[i]["RelationshipDesc"]);
                    $("#familyID").val(familyArr[i]["FamilyID"]);
                    $("#familyBirth").val(familyArr[i]["FamilyBirthday"]);
                    familyID = familyArr[i]["FamilyID"];
                    familyBirth = familyArr[i]["FamilyBirthday"];
                    relationshipNo = familyArr[i]["FamilyRelationship"];
                    typeNo = familyArr[i][""];

                    $.each($("#relationship-popup-option-list li"), function (index, item) {
                        if ($.trim($(item).text()) == familyArr[i]["RelationshipDesc"]) {
                            $(item).trigger("click");
                        }
                    });

                    break;
                }
            }

            //2.跳轉
            familyInsurName = $(this).children("div:first-child").children("span:first-child").text();
            changeViewToDetail();
            addFamilyOrNot = false;
            $(".confirmCancelEditFamily .main-paragraph").text(familyName);
            checkFormByFamily();
            $("#familyInsurName").attr("readonly", "readonly");
            $("#familyInsurName").css("background", "#cccccc");
        });

        //儲存按鈕
        $(".family-save-btn").on("click", function () {
            if (checkFormByFamily() && checkTextFormat()) {
                loadingMask("show");
                familyArr = JSON.parse(localStorage.getItem('familySettingData')); 
                if (clickEditSettingID != '') {
                    //Edit Status, Update Local Data
                    familyArr.content = familyArr.content.filter(function(item) {
                        return item.id != clickEditSettingID;
                    });
                }
                var obj = new Object();
                if ( familyArr == null || familyArr.content.length == 0) {
                    obj.family_id = 1 ;
                } else if (clickEditSettingID != '') {
                    obj.family_id = clickEditSettingID;

                } else {
                    sortDataByKey(familyArr.content, 'id', 'asc');
                    obj.family_id = familyArr['content'][familyArr['content'].length-1].id + 1;
                }
                obj.name = $('#familyInsurName').val();
                obj.relation = $("#familyRelationship").val();
                obj.idtype = $('#idType').val();
                obj.idno = $('#familyID').val();
                obj.birthday = $('#familyBirth').val();

                var jsonData = {};
                if (familyArr == null) {
                    jsonData = {
                        content: [obj]
                    };
                } else {
                    familyArr.content.push(obj);
                    jsonData = familyArr;
                }

                localStorage.setItem('familySettingData', JSON.stringify(jsonData));

                clearFormByFamily();
                checkFormByFamily();
                clickEditSettingID = '';
                queryFamilyList(); 
            }
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

        //返回到眷屬列表，彈窗popup
        $("#backFamilyList").on("click", function () {
            if (addFamilyOrNot) {
                popupMsgInit('.confirmCancelAddFamily');
            } else {
                popupMsgInit('.confirmCancelEditFamily');
            }
        });

        //關係dropdownlist-popup
        $("#familyRelationship").on("click", function () {
            $("#familyInsurName").blur();
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
            if (self !== langStr["str_095"]) {
                relationshipNo = self;
            }
        });

        //證號類別 dropdownlist-popup
        $("#idType").on("click", function () {
            $("#familyInsurName").blur();
            $("#familyID").blur();
            setTimeout(function () {
                $("#idType-popup").trigger("click");
            }, 200);
        });

        //點擊證號類別列表，觸發change事件
        $("#viewFamilyData").on("click", "#idType-popup-option ul li", function () {
            var self = $(this).text();
            $("#idType").val($.trim(self));
            checkFormByFamily();
        });

        $("#viewFamilyData").on("popupafterclose", "#idType-popup-option", function () {
            var self = $("#idType-popup").val();
            if (self !== langStr["str_095"]) {
                typeNo = self;
            }
        });

        //檢查表單（姓名和身份證）是否符合提交要求
        $("#familyInsurName").on("keyup", function (event) {
            if (timeoutFamilyName != null) {
                clearTimeout(timeoutFamilyName);
                timeoutFamilyName = null;
            }
            timeoutFamilyName = setTimeout(function () {
                familyInsurName = $.trim($("#familyInsurName").val());
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