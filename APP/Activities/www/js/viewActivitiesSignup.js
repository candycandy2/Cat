
$("#viewActivitiesSignup").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/
        var timeoutQueryEmployee = null;
        var limitPlace = 4;     //限制人數
        var currentPlace = 0;   //目前人數
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

        //查詢員工，添加成員
        window.ActivitiesSignupEmployeeQuery = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");
                //console.log(data);

                if(data["ResultCode"] == "1") {
                    var employeeArr = data["Content"];
                    var employeeList = "";
                    for(var i in employeeArr) {
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


                } else if(data["ResultCode"] == "045915") {
                    //查無員工資料
                    $("#employee-popup-option").popup("close");
                    popupMsgInit('.queryNoEmployee');
                }
                
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Signup_Employee", self.successCallback, self.failCallback, activitiesSignupEmployeeQueryData, "");
            }();

        };

        //根據不同活動類型，顯示不同頁面
        function showViewByModel() {
            var viewModel;
            if(actModel == 1) {
                viewModel = "Person";
            } else if(actModel == 3) {
                viewModel = "Family";
            } else if(actModel == 4) {
                viewModel = "Team";
            } else if(actModel == 5) {
                viewModel = "Time";
            }

            var viewHtml;
            if(isSignup) {
                viewHtml = "Manage";
            } else {
                viewHtml = "Signup"
            }

            var viewID = "view" + viewModel + viewHtml;

            $.each($("#viewActivitiesSignup .page-main > div"), function(index, item) {
                if($(item).attr("id") == viewID) {
                    $(item).removeClass("view-hide").addClass("view-show");
                } else {
                    $(item).removeClass("view-show").addClass("view-hide");
                }
            });
        }

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
            }, 0, function() {
                var top = $('#' + popupID + '-screen.in').offset().top;
                if (top < 0) {
                    $('.ui-popup-screen.in').css({
                        'top': Math.abs(top) + "px"
                    });
                }
            });

            setTimeout(function() {
                var viewHeight = $(window).height();
                var popupHeight = popup.outerHeight();
                var viewTop = (viewHeight - popupHeight) / 2;
                popup.parent().css("top", viewTop + "px");
            }, 100);    
        }

        /********************************** page event *************************************/
        $("#viewActivitiesSignup").on("pagebeforeshow", function(event, ui) {
            if(viewSignupInit) {
                //dropdownlist
                tplJS.DropdownList("viewActivitiesSignup", "employeeDropdownlist", "prepend", "typeB", employeeData);
                
                //places
                $("#teamCurrentPlace").text(currentPlace);
                $("#teamLimitPlace").text(limitPlace);
                $("#teamLimitPlaces").text(limitPlace);

                viewSignupInit = false;
            }
            showViewByModel();
        });

        $("#viewActivitiesSignup").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesSignup").keypress(function(event) {

        });

        //從報名頁返回詳情頁
        $("#viewActivitiesSignup .back-detail").on("click", function() {
            changePageByPanel("viewActivitiesDetail", false);
        });

        /******************************* employee component ********************************/
        // 1. 點擊“新增名單”，觸發dropdownlist的click事件，可以彈出popup
        $(".add-team-member").on("click", function() {
            if(currentPlace < limitPlace) {
                $("#employee-popup").trigger("click");
            }
        });

        // 2. 每次打開查詢員工popup，popup恢復初始狀態
        $(document).on("popupafteropen", "#employee-popup-option", function() {
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
        $(document).on("keyup", "#searchBar", function(e) {
            var self = $(this).val();
            if(self.length == 0) {
                $("#loaderQuery").hide();
                $("#employee-popup-option-list").hide();
                return;
            }

            if (timeoutQueryEmployee != null) {
                clearTimeout(timeoutQueryEmployee);
                timeoutQueryEmployee = null;
            }
            timeoutQueryEmployee = setTimeout(function() {
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
        $(document).on("click", "#employee-popup-option ul li", function(e) {
            var self = $(this);
            var employeeList = '<div class="team-employee-list" data-id="'
                + self.attr("value")
                + '"><span>'
                + self.children("div").eq(0).text()
                + '</span><span>'
                + self.children("div").eq(1).text()
                +'</span><span><img src="img/delete.png" class="team-signup-delete"></span></div>';

            $(".team-signup-employee-list").append(employeeList);
            currentPlace ++;
            $("#teamCurrentPlace").text(currentPlace);
        });

        // 5. 刪除組隊成員
        $(document).on("click", ".team-signup-delete", function() {
            $(this).parent().parent().remove();
            currentPlace --;
            $("#teamCurrentPlace").text(currentPlace);
        });




    }
});
