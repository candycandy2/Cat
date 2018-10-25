/*var familyArr = [{family_id:"1", name:"王小明", relation:"父母", birthday:"1980/01/01", idtype:"0", idno:"A123456789"},
                {family_id:"2", name:"王小美", relation:"父母", birthday:"1981/01/01", idtype:"0", idno:"A123456788"}]; */


$("#viewFamilyData").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var familyName, familyID , familyBirth, familyRelation, typeNo, addFamilyStatus = "";
        var timeoutFamilyName = null, timeoutFamilyID = null;
        var familyArr = {};
        var obj = new Object();
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
        //function queryFamilyList() {
        window.QueryFamilyList = function() {
            //replace familyArr's content to data["Content"]
            /*familyArr = JSON.parse(localStorage.getItem('familySettingData'));  
            if (familyArr == null || familyArr.content.length == 0) { 
                $("#viewFamilyList").hide();
                $("#viewFamilyNone").show();
            } else {
                var familyList = "";
                //for (var i in familyArr) {
                for (var i=0; i<familyArr.content.length; i++ ) {
                    //replace familyArr.content[i] to familyArr[i]
                    var ageDate = new Date(Date.now() - new Date(familyArr.content[i]["birthday"]).getTime()); 
                    var familyAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                    familyList += '<div class="family-list"><div class="font-style7 font-color2" data-id="'
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
            }*/
            loadingMask("show");
            var self = this;
            var queryData = '<empid>'+ myEmpNo +'</empid>';
            this.successCallback = function(data) { 
                //replace (familyArr != null) to (data["ResultCode"] == "1")      
                if (data["ResultCode"] == "1") {
                    familyArr = data["Content"].sort(sortByRelationship("relation", "name"));
                    var familyList = "";                   
                    //for (var i=0; i<familyArr.content.length; i++ ) {
                    for (var i in familyArr) {
                        //replace familyArr.content[i] to familyArr[i]
                        var ageDate = new Date(Date.now() - new Date(familyArr[i]["birthday"]).getTime()); 
                        var familyAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                        familyList += '<div class="family-list"><div class="font-style10 font-color2" data-id="'
                            + familyArr[i]["family_id"]
                            + '"><div><span>'
                            + $.trim(familyArr[i]["name"])
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
                    $(".family-edit-btn").show();
                    $(".family-cancle-btn").hide();
                    $("#familyList").empty().append(familyList).children("div:last-child").remove();       
                } else {
                    familyArr = data["Content"];
                    $("#viewFamilyList").hide();
                    $(".family-edit-btn").hide();
                    $(".family-cancle-btn").hide();
                    $("#viewFamilyNone").show(); 
                }
                changeViewToList();
                scrollHeightOnePage(activePageListID, scrollClassName);
                $("#" + activePageListID + ">.page-header").css({
                    'position': 'fixed'
                });
                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryFamilyData", self.successCallback, self.failCallback, queryData, "");
            }();
        };


        //新增&編輯眷屬資料 API: ModifyFamilyData 
        window.QueryInsuranceFamilyAdd = function() {
            loadingMask("show");
            var self = this;
            var addName = $.trim($('#familyInsurName').val());
            var addRelation = $.trim($("#familyRelationship").val());
            var addIDType = $.trim($('#idType').val());
            var addIDNo = $.trim($('#familyID').val());
            var addBirthday = formatDate($.trim($('#familyBirth').val()));
            var queryData = '<LayoutHeader><type>' +
                addFamilyStatus + '</type><empid>' +
                myEmpNo + '</empid><family_id>' +
                familyNo + '</family_id><name>' + 
                addName + '</name><relation>' +
                addRelation + '</relation><birthday>' +
                addBirthday + '</birthday><idtype>' +
                addIDType + '</idtype><idno>' + 
                addIDNo +'</idno></LayoutHeader>';
            this.successCallback = function(data) { 
                if (data['ResultCode'] === "1") {
                    //重新顯示眷屬列表
                    QueryFamilyList();
                    viewPersonalInsuranceShow = false;
                    tab1FamiScrollHeight = false;
                }else if (data['ResultCode'] === "046907") {
                    popupMsgInit('.familyErrorMsg');
                }
                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "ModifyFamilyData", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        //刪除眷屬資料 API: ModifyFamilyData 
        window.QueryInsuranceFamilyDelete = function() {
            loadingMask("show");
            var self = this;
            var queryData = '<LayoutHeader><type>' +
                addFamilyStatus +'</type><empid>' +
                myEmpNo +'</empid><family_id>' +
                familyNo + '</family_id><name></name><relation></relation><birthday></birthday><idtype></idtype><idno></idno></LayoutHeader>';
            this.successCallback = function(data) { 
                //familyArr = JSON.parse(localStorage.getItem('familySettingData'));
                //for (var i=0; i<familyArr.content.length; i++ ) { 
                /*for (var i in familyArr) {
                    if ( familyArr[i]["family_id"] == familyNo ) {
                        familyArr.splice(i, 1);
                    }
                }
                localStorage.setItem('familySettingData', JSON.stringify(familyArr));*/
                if (data['ResultCode'] === "1") {
                    if (clickDealwith === "未申請") {
                        QueryFamilyList();
                        //changeFamilyListHeight(activePageListID, scrollClassName, "delete");
                        $('.family-edit-btn').trigger('click');
                        $("#deleteFamilyListMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                        viewPersonalInsuranceShow = false; 
                        tab1FamiScrollHeight = false;
                    } else {
                        $(".deleteErrorMsg .recordInsurErr").addClass('addInlineBlock'); 
                        $(".deleteErrorMsg .hasInsurErr").removeClass('addInlineBlock');
                        $(".deleteErrorMsg .pendingInsurErr").removeClass('addInlineBlock');
                        $(".deleteErrorMsg .main-paragraph").text('');
                        $(".deleteErrorMsg .ui-content>.main").css("margin-top", "");
                        $(".deleteErrorMsg .ui-content>.main").css("margin-top", "10%");
                        popupMsgInit('.deleteErrorMsg');
                    }
                }else if (data['ResultCode'] === "046905") {
                    $(".deleteErrorMsg .recordInsurErr").removeClass('addInlineBlock'); 
                    $(".deleteErrorMsg .hasInsurErr").addClass('addInlineBlock');  
                    $(".deleteErrorMsg .pendingInsurErr").removeClass('addInlineBlock'); 
                    $(".deleteErrorMsg .main-paragraph").text('');
                    $(".deleteErrorMsg .ui-content>.main").css("margin-top", "");
                    $(".deleteErrorMsg .ui-content>.main").css("margin-top", "10%");  
                    popupMsgInit('.deleteErrorMsg');
                }else if (data['ResultCode'] === "046906") {
                    $(".deleteErrorMsg .recordInsurErr").removeClass('addInlineBlock'); 
                    $(".deleteErrorMsg .hasInsurErr").removeClass('addInlineBlock');  
                    $(".deleteErrorMsg .pendingInsurErr").addClass('addInlineBlock');   
                    $(".deleteErrorMsg .main-paragraph").text(langStr["str_139"]);
                    $(".deleteErrorMsg .ui-content>.main").css("margin-top", "");
                    $(".deleteErrorMsg .ui-content>.main").css("margin-top", "2%"); 
                    popupMsgInit('.deleteErrorMsg');
                }
                familyNo = 'NULL';
                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "ModifyFamilyData", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        function scrollHeightOnePage(viewName, className) {
            var headHeight = $('#'+ viewName +' .page-header').height();
            var fixHeight = $('.family-edit-btn').height();
            var iconHeight = ($('.family-add-img').height())*2;
            var contentHeight = $('#familyList').height();
            var totalHeight;
            if (device.platform === "iOS") {
                totalHeight = (headHeight + fixHeight + contentHeight + iconHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (headHeight + fixHeight + contentHeight + iconHeight).toString();
            }
            $('.'+ className +' > div').css('height', totalHeight + 'px'); 
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
            familyNo = "NULL";
            //familyInsurName = "";
            familyID = "";
            familyName = "";
            familyBirth = "";
            familyRelation = "";
            typeNo = "";

            $.each($("#relationship-popup-option-list li"), function (index, item) {
                if ($(item).hasClass("tpl-dropdown-list-selected")) {
                    $(item).removeClass("tpl-dropdown-list-selected");
                }
            });
            $.each($("#idType-popup-option-list li"), function (index, item) {
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
            if (familyArr.length == 0) {
                $("#viewFamilyNone").show();
            } else {
                $("#viewFamilyList").show();
            }
            $(".family-list-title").show();         
            $(".family-add-title").hide();
            $(".family-cancle-btn").hide();
            $(".family-edit-btn").show(); 
            $(".family-delete").hide();
            $(".family-edit").show();
            $(".family-add-img").show();
        }

        //“編輯”和“新增”的跳轉
        function changeViewToDetail() {
            $("#viewFamilyData .insuranceMenu").hide();
            //After connect to API:QueryFamilyData, delete 'familyArr == null'
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
            if (addFamilyOrNot == true) {
                $(".family-insur-apply-div").hide();
            } else {
                $(".family-insur-apply-div").show();
            }
        }

        //檢查輸入眷屬資料是否有誤
        function checkTextFormat() {
            var relationshipVal = $.trim($("#familyRelationship").val());
            var typeVal = $.trim($("#idType").val());
            var idVal = $.trim($("#familyID").val());

            if (typeVal == "身份證") {
                if (idVal.length != 10) {
                    $(".familyAddCheckMsg .lengthErr").addClass('addInlineBlock');  
                    $(".familyAddCheckMsg .formatErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .idDulErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .oneSpouseErr").removeClass('addInlineBlock');                  
                    popupMsgInit('.familyAddCheckMsg');
                    return false;
                } else if (idVal.search(/^[A-Z](1|2)\d{8}$/i) == -1){
                    $(".familyAddCheckMsg .lengthErr").removeClass('addInlineBlock');  
                    $(".familyAddCheckMsg .formatErr").addClass('addInlineBlock');  
                    $(".familyAddCheckMsg .idDulErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .oneSpouseErr").removeClass('addInlineBlock');  
                    popupMsgInit('.familyAddCheckMsg');
                    return false;
                } else {
                    return true;
                }
            } else if (typeVal == "居留證") {
                 if (idVal.length != 10) {
                    $(".familyAddCheckMsg .lengthErr").addClass('addInlineBlock');  
                    $(".familyAddCheckMsg .formatErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .idDulErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .oneSpouseErr").removeClass('addInlineBlock');                  
                    popupMsgInit('.familyAddCheckMsg');
                    return false;
                } else if (idVal.search(/^[A-Z]{1}[A-D]{1}\d{8}$/i) == -1) {
                    $(".familyAddCheckMsg .lengthErr").removeClass('addInlineBlock');  
                    $(".familyAddCheckMsg .formatErr").addClass('addInlineBlock');  
                    $(".familyAddCheckMsg .idDulErr").removeClass('addInlineBlock');   
                    $(".familyAddCheckMsg .oneSpouseErr").removeClass('addInlineBlock');  
                    popupMsgInit('.familyAddCheckMsg');
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }

        //檢查眷屬資料的身分證和配偶是否有重複
        function checkDuplicateInfo() {
            var idVal = $.trim($("#familyID").val());
            var relationshipVal = $.trim($("#familyRelationship").val());
            if (familyArr != null) {               
                //for (var i=0; i<familyArr.content.length; i++ ) {
                for (var i in familyArr) {
                    if ( familyArr[i]["family_id"] != familyNo && familyArr[i]["idno"] == idVal) {
                        $(".familyAddCheckMsg .lengthErr").removeClass('addInlineBlock');  
                        $(".familyAddCheckMsg .formatErr").removeClass('addInlineBlock');   
                        $(".familyAddCheckMsg .idDulErr").addClass('addInlineBlock');   
                        $(".familyAddCheckMsg .oneSpouseErr").removeClass('addInlineBlock');                  
                        popupMsgInit('.familyAddCheckMsg');
                        return false;
                    } else if ( familyArr[i]["family_id"] != familyNo && relationshipVal == "配偶" && familyArr[i]["relation"] == "配偶" ) {
                        $(".familyAddCheckMsg .lengthErr").removeClass('addInlineBlock');  
                        $(".familyAddCheckMsg .formatErr").removeClass('addInlineBlock');   
                        $(".familyAddCheckMsg .idDulErr").removeClass('addInlineBlock');   
                        $(".familyAddCheckMsg .oneSpouseErr").addClass('addInlineBlock');                  
                        popupMsgInit('.familyAddCheckMsg');
                        return false;
                    } 
                }
                return true;

            } else {
                return true;
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

        //After connect to API, Delete the localStorage 
        /*function addTempDataIntoObject() {
            obj.name = $('#familyInsurName').val();
            obj.relation = $("#familyRelationship").val();
            obj.idtype = $('#idType').val();
            obj.idno = $('#familyID').val();
            obj.birthday = $('#familyBirth').val();
        }*/

        function formatDate(date) { 
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year, month, day].join('-');
        }

        /********************************** page event *************************************/
        $("#viewFamilyData").on("pagebeforeshow", function (event, ui) {
            if (viewFamilyInit) {
                setDropdownlistByFamily();
                viewFamilyInit = false;
            }
        });

        $("#viewFamilyData").on("pageshow", function (event, ui) {
            loadingMask("show");
            activePageListID = visitedPageList[visitedPageList.length - 1];   
            scrollClassName = 'insur-family-scroll';
            QueryFamilyList(); 
        });
        
        /******************************** datetimepicker ***********************************/
         $('#familyBirth').datetimepicker({
            timepicker: false,
             yearStart: '1900'
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
            familyName = $.trim($(this).parent().prev().children("div:first-child").children("span:first-child").text());
            $(".confirmDeleteFamily .main-paragraph").text(familyName);
            popupMsgInit('.confirmDeleteFamily');
        });

        //確定刪除
        $("#confirmDeleteFamilyBtn").on("click", function () {
            addFamilyStatus = "Delete";
            //API: ModifyFamilyData (入參)
            QueryInsuranceFamilyDelete();
        });

        //確定取消新增，跳轉
        $("#confirmCancelAddFamilyBtn").on("click", function () {
            changeViewToList();
        });

        //確定取消編輯，跳轉
        $("#confirmCancelEditFamilyBtn").on("click", function () {
            changeViewToList();
        });

        //確定新增眷屬錯誤，跳轉
        $("#confirmErrAddBtn").on("click", function () {
            QueryFamilyList();
        });

        //添加眷屬，跳轉到編輯頁
        $(".family-add-img").on("click", function () {
            addFamilyOrNot = true;
            addFamilyStatus = "Add"; 
            clearFormByFamily();
            changeViewToDetail();            
            checkFormByFamily();
            $("#familyInsurName").removeAttr("readonly");
            $("#familyInsurName").css("background", "#f9f9f9");
        });

        function applyInsurFromFamilyData() {
            clickFamilyName = $.trim(familyName);
            clickRelation =  $.trim(familyRelation);
            clickAge = transferBirthToAge(familyBirth);
            clickBirth = $.trim(familyBirth);
            clickID = $.trim(familyID)
            $("#mypanelviewFamilyData").removeAttr("style");
            $("#mypanel #mypanelviewPersonalInsurance").css("background", "#503f81");
            $("#mypanel #mypanelviewPersonalInsurance").css("color", "#fff");   
            nextPage = "addDetail";
            $.mobile.changePage("#viewApplyInsurance");     
        }

        //健保加保申請，跳轉
        $(".addInsuranceImg").on("click", function () {
            applyInsurFromFamilyData();
        });

        //健保加保申請，跳轉
        $(".addInsuranceStr").on("click", function () {
            applyInsurFromFamilyData();
        });

        //確定編輯眷屬，跳轉
        $("#confirmEditBtn").on("click", function () {
            addFamilyStatus = "Modify";        
            //for (var i=0; i<familyArr.content.length; i++ ) {
            for (var i in familyArr) {
                //replace familyArr.content[i] to familyArr[i]
                if (familyNo == familyArr[i]["family_id"]) {
                    familyName = familyArr[i]["name"];
                    familyID = familyArr[i]["idno"];
                    familyBirth = familyArr[i]["birthday"];
                    familyRelation = familyArr[i]["relation"];
                    typeNo = familyArr[i]["idtype"];
                    $("#familyInsurName").val(familyName);
                    $("#familyRelationship").val(familyRelation);
                    $('#idType').val(typeNo);
                    $("#familyID").val(familyID);
                    $("#familyBirth").val(familyBirth);
                  
                    if (familyArr[i]["can_apply"] == '加保') {
                        $(".addInsuranceImg").show();
                        $(".addInsuranceStr").show();
                    } else {
                        $(".addInsuranceImg").hide();
                        $(".addInsuranceStr").hide();
                    }

                    $.each($("#relationship-popup-option-list li"), function (index, item) {
                        if ($.trim($(item).text()) == familyArr[i]["relation"]) {
                            $(item).trigger("click");
                        }
                    });

                    $.each($("#idType-popup-option-list li"), function (index, item) {
                        if ($.trim($(item).text()) == familyArr[i]["idtype"]) {
                            $(item).trigger("click");
                        }
                    });

                    break;
                }
            }

            //2.跳轉
            //familyInsurName = $(this).parent().siblings().find('span:nth-child(1)').text();
            addFamilyOrNot = false;
            changeViewToDetail();          
            $(".confirmCancelEditFamily .main-paragraph").text(familyName);
            checkFormByFamily();
        });

        //修改眷屬，跳轉到編輯頁
        $("#familyList").on("click", ".family-edit", function () {
            //1.傳值
            var self = $(this).parent().siblings().attr("data-id");
            familyNo = self;  
            queryHealthInsurAPI = false;
            popupMsgInit('.beforeEditMsg');          
        });

        //儲存按鈕
        $(".family-save-btn").on("click", function () {
            if (checkFormByFamily() && checkTextFormat() && checkDuplicateInfo()) {
                loadingMask("show");               
                /*familyArr = JSON.parse(localStorage.getItem('familySettingData')); 
                obj = new Object()
                var jsonData = {};               
                if ( familyArr == null || familyArr.content.length == 0) {
                    obj.family_id = 1 ;
                    addTempDataIntoObject();
                    jsonData = {
                        content: [obj]
                    };
                    localStorage.setItem('familySettingData', JSON.stringify(jsonData));
                } else if (familyNo != 'NULL') {
                    for (var i=0; i<familyArr.content.length; i++ ) { 
                        if ( familyArr.content[i]["family_id"] == familyNo ) {
                            familyArr.content[i]["name"] = $('#familyInsurName').val();
                            familyArr.content[i]["relation"] = $("#familyRelationship").val();
                            familyArr.content[i]["idtype"] = $('#idType').val();
                            familyArr.content[i]["idno"] = $('#familyID').val();
                            familyArr.content[i]["birthday"] = $('#familyBirth').val();
                        }
                    }
                    localStorage.setItem('familySettingData', JSON.stringify(familyArr));
                } else {
                    sortDataByKey(familyArr.content, 'family_id', 'asc');
                    obj.family_id = familyArr['content'][familyArr['content'].length-1].family_id + 1;
                    addTempDataIntoObject();
                    familyArr.content.push(obj);
                    jsonData = familyArr;
                    localStorage.setItem('familySettingData', JSON.stringify(jsonData));
                }*/            
  
                //API: ModifyFamilyData (入參)
                QueryInsuranceFamilyAdd(); 
                clearFormByFamily();
                checkFormByFamily();
                familyNo = 'NULL';
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
                familyRelation = self;
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
                familyName = $.trim($("#familyInsurName").val());
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