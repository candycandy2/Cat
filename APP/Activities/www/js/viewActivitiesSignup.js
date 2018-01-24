
$("#viewActivitiesSignup").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var timeoutQueryEmployee = null;
        var limitPlace, currentPlace;     //限制人數和目前人數
        var teamName, departNo, submitID, submitModel;
        var memberNoArr = [];
        var timeoutCheckFamilySignup = null;
        var selectClassName = "familySignupSelect";
        var employeeData = {
            id: "employee-popup",
            option: [],
            title: '<input type="search" id="searchBar" />',
            defaultText: "請選擇",
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };

        /********************************** function *************************************/
        //我要報名
        window.ActivitiesSignupQuery = function (model) {

            this.successCallback = function (data) {
                console.log(data);

                //報名提交的活動類型
                submitModel = model;
                if (data["ResultCode"] == "1") {
                    var signupObj = data["Content"][0];

                    if (model == "1") {



                    } else if (model == "3") {
                        $("#familySignupThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#familySignupName").text(signupObj["ActivitiesName"]);
                        $("#familyLimitPlace").text(signupObj["LimitPlaces"]);
                        $("#familyEmpName").text(signupObj["EmployeeName"]);
                        $("#familyEmpRlts").text(signupObj["EmployeeRelationship"]);
                        $("#familyEmpGender").text(signupObj["EmployeeGender"]);
                        $("#familyEmpID").text(signupObj["EmpoyeeID"]);
                        $("#familyEmpBirth").text(signupObj["EmployeeBirthday"]);

                        //处理自定义栏位
                        var fieldArr = getCustomField(signupObj);
                        // var fieldArr = [{
                        //     "ColumnName": "自助餐",
                        //     "ColumnType": "Multiple",
                        //     "ColumnItem": "火鍋;燒烤;拉麪"
                        // },
                        // {
                        //     "ColumnName": "攜帶人數",
                        //     "ColumnType": "Multiple",
                        //     "ColumnItem": "1;2;3;4;5;6"
                        // }];
                        for(var i in fieldArr) {
                            if(fieldArr[i]["ColumnType"] == "Select") {
                                setSelectCustomField(fieldArr, i , "viewActivitiesSignup", selectClassName, "family-signup-custom-field");

                            } else if(fieldArr[i]["ColumnType"] == "Text") {
                                setTextCustomField(fieldArr, i, "familySignupText", "family-signup-custom-field");

                            } else if(fieldArr[i]["ColumnType"] == "Multiple") {

                            }
                        }

                    
                    } else if (model == "4") {
                        $("#teamSignupThumbnail").attr("src", signupObj["ActivitiesImage"]);
                        $("#teamSignupName").text(signupObj["ActivitiesName"]);
                        $("#teamCurrentPlace").text("0");
                        $("#teamLimitPlace").text(signupObj["LimitPlaces"]);
                        $("#teamRemark").empty().append("<div>" + signupObj["ActivitiesRemarks"].replace("TeamNumber", signupObj["LimitPlaces"]) + "</div>");

                        //記錄已添加人數
                        limitPlace = signupObj["LimitPlaces"];
                        currentPlace = 0;

                        //報名參數
                        submitID = signupObj["ActivitiesID"];


                    } else if (model == "5") {

                    }




                } else if (data["ResultCode"] == "045910") {

                }


                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_Signup", self.successCallback, self.failCallback, activitiesSignupQueryData, "");
            }();

        };


        //查詢員工，添加成員
        window.ActivitiesSignupEmployeeQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "1") {
                    var employeeArr = data["Content"];
                    var employeeList = "";
                    for (var i in employeeArr) {
                        employeeList += '<li class="tpl-option-msg-list" value="'
                            + employeeArr[i]["EmployeeNo"]
                            + '"><div style="width: 25VW;"><span>'
                            + employeeArr[i]["EmployeeDept"]
                            + '</span></div><div><span>'
                            + employeeArr[i]["EmployeeName"]
                            + '</span></div></li><hr class="ui-hr ui-hr-option">';
                    }

                    $("#employee-popup-option-list").empty().append(employeeList).children("ul hr:last-child").remove();
                    resizePopup("employee-popup-option");

                    $("#employee-popup-option-list").show();
                    $("#loaderQuery").hide();


                } else if (data["ResultCode"] == "045915") {
                    //查無員工資料
                    $("#employee-popup-option").popup("close");
                    popupMsgInit('.queryNoEmployee');
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Employee", self.successCallback, self.failCallback, activitiesSignupEmployeeQueryData, "");
            }();

        };

        //活動報名送出
        window.ActivitiesSignupConfirmQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

                if (data['ResultCode'] == "045911") {
                    ActivitiesListQuery();
                    ActivitiesRecordQuery();
                    //跳轉
                    $.each($("#openList .activity-list"), function (index, item) {
                        if ($(item).attr("data-id") == submitID) {
                            $(item).trigger("click");
                        }
                    });
                } else if (data['ResultCode'] == "045912") {
                    //失敗，報名組數超過剩餘名額
                    popupMsgInit('.overLimitMsg');
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Confirm", self.successCallback, self.failCallback, activitiesSignupConfirmQueryData, "");
            }();

        };

        //設置popup的size
        function resizePopup(popupID) {
            var popup = $("#" + popupID);
            var popupHeight = popup.height();
            var popupHeaderHeight = $("#" + popupID + " .header").height();
            var popupFooterHeight = popup.find("div[data-role='main'] .footer").height();

            //ui-content paddint-top/padding-bottom:3.07vw
            // var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 3.07 * 2 / 100, 10);

            //Ul margin-top:2.17vw
            // var ulMarginTop = parseInt(document.documentElement.clientWidth * 2.17 / 100, 10);
            // var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop, 10);
            var popupMainHeight = "200";
            popup.find("div[data-role='main'] .main").height(popupMainHeight);

            $('#' + popupID + '-screen.in').animate({
                'overflow-y': 'hidden',
                'touch-action': 'none',
                'height': $(window).height()
            }, 0, function () {
                var top = $('#' + popupID + '-screen.in').offset().top;
                if (top < 0) {
                    $('.ui-popup-screen.in').css({
                        'top': Math.abs(top) + "px"
                    });
                }
            });

            setTimeout(function () {
                var viewHeight = $(window).height();
                var popupHeight = popup.outerHeight();
                var viewTop = (viewHeight - popupHeight) / 2;
                popup.parent().css("top", viewTop + "px");
            }, 100);
        }

        //檢查組隊報名所有欄位
        function checkFieldByTeam() {
            if (currentPlace > 0 && $.trim($("#departNo").val()) !== "" && $.trim($("#teamName").val()) !== "") {
                $("#sendTeamSignup").removeClass("btn-disabled");
                return true;
            } else {
                $("#sendTeamSignup").addClass("btn-disabled");
                return false;
            }
        }

        //获取所有自定义栏位
        function getCustomField(arr) {
            var list = [];
            for (var i = 1; i < 6; i++) {
                list.push({
                    "ColumnName": arr["ColumnName_" + i],
                    "ColumnType": arr["ColumnType_" + i],
                    "ColumnItem": arr["ColumnItem_" + i],
                });
            }

            for (var i = 0; i < list.length; i++) {
                if (list[i]["ColumnName"] == "") {
                    list.splice(i, 1);
                    i--;
                }
            }
            return list;
        }

        //生成Select-dropdownlist欄位
        function setSelectCustomField(arr, i, page, id, container) {
            //1.聲明dropdownlist對象
            var columnData = {
                id: "column-popup-"+i,
                option: [],
                title: '',
                defaultText: langStr["str_040"],
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            //2.生成html
            var fieldContent = '<div class="custom-field"><label class="font-style11">'
                + arr[i]["ColumnName"]
                +'</label><div id="'+id+i+'" class="'+id+'"></div></div>';

            //3.append
            $("."+container).append(fieldContent);

            //4.取value值
            var valueArr = arr[i]["ColumnItem"].split(";");

            //5.动态生成popup
            for(var j in valueArr){
                columnData["option"][j] = {};
                columnData["option"][j]["value"] = valueArr[j];
                columnData["option"][j]["text"] = valueArr[j];
            }

            //6.生成dropdownlist
            tplJS.DropdownList(page, id+i, "prepend", "typeB", columnData);
        }

        //生成Text自定義欄位
        function setTextCustomField(arr, i , id, container) {
            var fieldContent = '<div class="custom-field"><label for="'+id+i+'" class="font-style11">'
                + arr[i]["ColumnName"]
                + '</label><input name="'+id+i+'" id="'+id+i+'" type="text" data-role="none" class="'+id+'"></div>';

            $("."+container).append(fieldContent);
        }

        //檢查所有select欄位是否爲空
        function checkFamilyForm() {
            var selectBoolean = false;
            if($("."+selectClassName+" select").length > 0) {
                $.each($("."+selectClassName+" select"), function(index, item) {
                    if($(item).val() !== langStr["str_040"]) {
                        selectBoolean = true;
                    } else {
                        selectBoolean = false;
                    }
                });
            } else {
                selectBoolean = true;
            }
            
            var textBoolean = false;
            if($(".familySignupText").length > 0) {
                $.each($(".familySignupText"), function(index, item) {
                    if($.trim($(item).val()) !== "") {
                        textBoolean = true;
                    } else {
                        textBoolean = false;
                    }
                });
            } else {
                textBoolean = false;
            }

            if(selectBoolean && textBoolean) {
                $("#selectFamilyBtn").removeClass("btn-disabled");
            } else {
                $("#selectFamilyBtn").addClass("btn-disabled");
            }
        }

        /********************************** page event *************************************/
        $("#viewActivitiesSignup").on("pagebeforeshow", function (event, ui) {
            if (viewSignupInit) {
                //dropdownlist
                tplJS.DropdownList("viewActivitiesSignup", "employeeDropdownlist", "prepend", "typeB", employeeData);

                viewSignupInit = false;
            }
        });

        $("#viewActivitiesSignup").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesSignup").keypress(function (event) {

        });

        //從報名頁返回詳情頁
        $("#viewActivitiesSignup .back-detail").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });

        /******************************* employee component ********************************/
        // 1. 點擊“新增名單”，觸發dropdownlist的click事件，可以彈出popup
        $(".add-team-member").on("click", function () {
            if (currentPlace < limitPlace) {
                $("#employee-popup").trigger("click");
            }
        });

        // 2. 每次打開查詢員工popup，popup恢復初始狀態
        $(document).on("popupafteropen", "#employee-popup-option", function () {
            $("#searchBar").val("");
            $("#employee-popup-option-list").empty();
            //resizePopup("employee-popup-option");

            if ($("#loaderQuery").length <= 0) {
                $("#employee-popup-option-popup .ui-content").append('<img id="loaderQuery" src="img/query-loader.gif">');
            } else {
                $("#loaderQuery").hide();
            }
        });

        // 3. 搜索員工，2秒後呼叫API，返回查詢信息
        $(document).on("keyup", "#searchBar", function (e) {
            var self = $(this).val();
            if (self.length == 0) {
                $("#loaderQuery").hide();
                $("#employee-popup-option-list").hide();
                return;
            }

            if (timeoutQueryEmployee != null) {
                clearTimeout(timeoutQueryEmployee);
                timeoutQueryEmployee = null;
            }
            timeoutQueryEmployee = setTimeout(function () {
                activitiesSignupEmployeeQueryData = '<LayoutHeader><Employee>'
                    + $.trim(self)
                    + '</Employee></LayoutHeader>';

                ActivitiesSignupEmployeeQuery();

                $("#loaderQuery").show();
                $("#employee-popup-option-list").hide();
            }, 2000);

            //如果點擊的是“回車(search)”按鈕，search控件失去焦點，虛擬鍵盤隱藏
            if (e.which == 13) {
                $("#searchBar").blur();
            }
        });

        // 4. 點擊員工，添加到html
        $(document).on("click", "#employee-popup-option ul li", function (e) {
            var self = $(this);
            var employeeList = '<div class="team-employee-list" data-id="'
                + self.attr("value")
                + '"><span>'
                + self.children("div").eq(0).text()
                + '</span><span>'
                + self.children("div").eq(1).text()
                + '</span><span><img src="img/delete.png" class="team-signup-delete"></span></div>';

            $(".team-signup-employee-list").append(employeeList);
            currentPlace++;
            $("#teamCurrentPlace").text(currentPlace);
            //將被添加員工的工號放入數組當中
            memberNoArr.push(self.attr("value"));
            //檢查欄位
            checkFieldByTeam();
        });

        // 5. 刪除組隊成員
        $(document).on("click", ".team-signup-delete", function () {
            var empNo = $(this).parent().parent().attr("data-id");
            $(this).parent().parent().remove();
            currentPlace--;
            $("#teamCurrentPlace").text(currentPlace);
            //將員工工號刪除與數組
            for (var i in memberNoArr) {
                if (empNo == memberNoArr[i]) {
                    memberNoArr.splice(i, 1);
                    break;
                }
            }
            //檢查欄位
            checkFieldByTeam();
        });

        /*********************************** team signup ***********************************/
        $("#departNo").on("keyup", function () {
            checkFieldByTeam();
        });

        $("#teamName").on("keyup", function () {
            checkFieldByTeam();
        });

        $("#departNo").on("change", function () {
            departNo = $.trim($(this).val());
        });

        $("#teamName").on("change", function () {
            teamName = $.trim($(this).val());
        });

        $("#sendTeamSignup").on("click", function () {
            if (!$(this).hasClass("btn-disabled")) {
                loadingMask("show");
                activitiesSignupConfirmQueryData = '<LayoutHeader><ActivitiesID>'
                    + submitID
                    + '</ActivitiesID><SignupModel>'
                    + submitModel
                    + '</SignupModel><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo><TeamName>'
                    + teamName
                    + '</TeamName><TeamDept>'
                    + departNo
                    + '</TeamDept><MemberEmpNo>'
                    + memberNoArr.join(",")
                    + '</MemberEmpNo></LayoutHeader>';

                //console.log(activitiesSignupConfirmQueryData);
                ActivitiesSignupConfirmQuery();
            }

        });

        //獲取自定義欄位slecet值
        $(document).on("change", "." + selectClassName + " select", function() {
            //console.log($(this).val());
            checkFamilyForm();
        });

        //獲取自定義欄位Text值
        $(document).on("keyup", ".familySignupText", function() {
            //console.log($(this).val());
            if(timeoutCheckFamilySignup != null) {
                clearTimeout(timeoutCheckFamilySignup);
                timeoutCheckFamilySignup = null;
            }
            timeoutCheckFamilySignup = setTimeout(function() {
                checkFamilyForm();
            }, 2000);
            
        });

    }
});
