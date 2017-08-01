var leaveid, leaveType, agentid, beginDate, endDate, beginTime, endTime;
var leaveTimetab = "leaveTime-tab1";
var leaveTypeSelected = false;
var fulldayHide = false;
var leftDaysData = {};
var timoutQueryEmployeeData = null;

var leaveTypeData = {
    id: "leaveType-popup",
    option: [],
    title: "",
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var agentData = {
    id: "agent-popup",
    option: [],
    title: '<input type="search" id="searchBar" />',
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

$("#viewPersonalLeave").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.QueryCalendarData = function() {

            this.successCallback = function(data) {
                myCalendarData = {};
                var leaveFlag = "3";
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["Result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var colorTagArry = $("color", htmlDoc);
                    for(var day = 1; day <= colorTagArry.length; day++) {
                        if(myCalendarData[$(colorTagArry[day-1]).html()] === undefined ) {
                            myCalendarData[$(colorTagArry[day-1]).html()] = [];
                        }
                        myCalendarData[$(colorTagArry[day-1]).html()].push(day);
                    }
                    if(leaveFlag in myCalendarData) {
                        for(var day in myCalendarData[leaveFlag]) {
                            $("#viewPersonalLeave-calendar #" + myCalendarData[leaveFlag][day]).parent().addClass("leave");
                        }
                    }
                }
                loadingMask("hide");
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryCalendarData", self.successCallback, self.failCallback, queryCalendarData, "");
            }();
        };

        window.GetDefaultSetting = function() {

            this.successCallback = function(data) {
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["quickleavelist"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var leaveTypeArry = $("name", htmlDoc);
                    var leaveIDArry = $("leaveid", htmlDoc);
                    for(var i = 0; i < leaveTypeArry.length; i++) {
                        leaveTypeData["option"][i] = {};
                        leaveTypeData["option"][i]["value"] = $(leaveIDArry[i]).html();
                        leaveTypeData["option"][i]["text"] = $(leaveTypeArry[i]).html();
                        queryLeftDaysData = "<LayoutHeader><EmpNo>"
                                          + myEmpNo
                                          + "</EmpNo><leaveid>"
                                          + $(leaveIDArry[i]).html()
                                          + "</leaveid></LayoutHeader>";
                        QueryLeftDaysData($(leaveIDArry[i]).html());
                    }
                    tplJS.DropdownList("viewPersonalLeave", "leaveType", "prepend", "typeB", leaveTypeData);
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "GetDefaultSetting", self.successCallback, self.failCallback, getDefaultSettingQueryData, "");
            }();
        };

        window.QueryLeftDaysData = function(leaveid) {

            this.successCallback = function(data) {
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var leftDays = $("leftdays", htmlDoc);
                    leftDaysData[leaveid] = $(leftDays).html();
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryLeftDaysData", self.successCallback, self.failCallback, queryLeftDaysData, "");
            }();
        };

        window.QueryEmployeeData = function() {

            this.successCallback = function(data) {
                if(data['ResultCode'] === "1") {
                    var agentList = "";
                    if(data['Content'][0] == undefined) {
                        $("#agent-popup-option-list").empty().append(agentList);
                    }else {
                        var callbackData = data['Content'][0]["result"];
                        var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                        var DepArry = $("Department", htmlDoc);
                        var nameArry = $("name", htmlDoc);
                        var agentIDArry = $("Empno", htmlDoc)
                        for(var i=0; i<DepArry.length; i++) {
                            if($(nameArry[i]).html() !== localStorage["loginid"]) {
                                agentList += '<li class="tpl-option-msg-list" value="'+ $(agentIDArry[i]).html() +'">'
                                           +    '<div style="width: 25VW;"><span>'
                                           +        $(DepArry[i]).html()
                                           +    '</div></span>'
                                           +    '<div><span>'
                                           +        $(nameArry[i]).html()
                                           +    '</div></span>'
                                           + '</li>';
                            }
                        }
                        $("#agent-popup-option-list").empty().append(agentList);
                        resizePopup("agent-popup-option");
                    }
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryEmployeeData", self.successCallback, self.failCallback, queryEmployeeData, "");
            }();
        };

        window.CountLeaveHours = function() {

            this.successCallback = function(data) {
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDoc);
                    var applyDays = $("ApplyDays", htmlDoc);
                    var applyHours = $("ApplyHours", htmlDoc);
                    if($(success).html() != undefined) {
                        sendLeaveApplicationData = "<LayoutHeader><empno>"
                                                 + myEmpNo
                                                 + "</empno><delegate>"
                                                 + agentid
                                                 + "</delegate><leaveid>"
                                                 + leaveid
                                                 + "</leaveid><begindate>"
                                                 + beginDate
                                                 + "</begindate><begintime>"
                                                 + beginTime
                                                 + "</begintime><enddate>"
                                                 + endDate
                                                 + "</enddate><endtime>"
                                                 + endTime
                                                 + "</endtime><datumdate></datumdate><applydays>"
                                                 + $(applyDays).html()
                                                 + "</applydays><applyhours>"
                                                 + $(applyHours).html()
                                                 + "</applyhours><reason>"
                                                 + leaveType
                                                 + "</reason></LayoutHeader>";
                        SendLeaveApplicationData();
                    }else {
                        var error = $("error", htmlDoc);
                        var msgContent = $(error).html();
                        $('.applyLeaveFail').find('.main-paragraph').html(msgContent);
                        popupMsgInit('.applyLeaveFail');
                        loadingMask("hide");
                    }             
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "CountLeaveHours", self.successCallback, self.failCallback, countLeaveHoursQueryData, "");
            }();
        };

        window.SendLeaveApplicationData = function() {

            this.successCallback = function(data) {
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDoc);
                    if($(success).html() != undefined) {
                        $(".toast-style").fadeIn(100).delay(3000).fadeOut(100);
                        localStorage.setItem("agent", JSON.stringify([$("#agent-popup option").text(), agentid]));
                    }else {
                        var error = $("error", htmlDoc);
                        var msgContent = $(error).html();
                        $('.applyLeaveFail').find('.main-paragraph').html(msgContent);
                        popupMsgInit('.applyLeaveFail');
                    }
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "SendLeaveApplicationData", self.successCallback, self.failCallback, sendLeaveApplicationData, "");
            }();
        };

        $(document).ready(function() {
            prslvsCalendar = new Calendar({
                renderTo: "#viewPersonalLeave #myCalendar",
                id: "viewPersonalLeave-calendar",
                language: "default",
                show_days: true,
                weekstartson: 0,
                markToday: true,
                markWeekend: true,
                changeDateEventListener: function(year, month) {
                    queryCalendarData = "<LayoutHeader><Year>"
                                      + year
                                      + "</Year><Month>"
                                      + month
                                      + "</Month><EmpNo>"
                                      + myEmpNo
                                      + "</EmpNo></LayoutHeader>";
                    QueryCalendarData();
                },
                nav_icon: {
                    prev: '<img src="img/pre.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                }
            });
        });

        /********************************** page event *************************************/
        $("#viewPersonalLeave").one("pagebeforeshow", function(event, ui) {
            $("#tab-1").show();
            $("#tab-2").hide();
            if(lastPageID === "viewPersonalLeave") {
                tplJS.DropdownList("viewPersonalLeave", "agent", "prepend", "typeB", agentData);
            }
            $("label[for=viewPersonalLeave-tab-1]").addClass('ui-btn-active');
            $("label[for=viewPersonalLeave-tab-2]").removeClass('ui-btn-active');          
        });

        $("#viewPersonalLeave").on("pageshow", function(event, ui) {
            loadingMask("hide");
            leaveid = "";
            agentid= "";
            beginTime = "08:00";
            endTime = "17:00";
            beginDate = currentYear + "/" + currentMonth + "/" + currentDate;
            endDate = currentYear + "/" + currentMonth + "/" + currentDate;
            if(localStorage.getItem("agent") !== null) {
                agentid = JSON.parse(localStorage.getItem("agent"))[1];
            }
        });

        /********************************** dom event *************************************/
        $(".page-tabs #viewPersonalLeave-tab-1").on("click", function() {
            $("#tab-1").show();
            $("#tab-2").hide();
        });

        $(".page-tabs #viewPersonalLeave-tab-2").on("click", function() {
            $("#tab-1").hide();
            $("#tab-2").show();
        });

        // $("#infoTitle-1").on("click", function() {
        //     if($("#infoContent-1").css("display") === "none") {
        //         $("#infoContent-1").slideDown(500);
        //         $("#infoTitle-1").find(".listDown").attr("src", "img/list_up.png");
        //     }else if($("#infoContent-1").css("display") === "block") {
        //         $("#infoContent-1").slideUp(500);
        //         $("#infoTitle-1").find(".listDown").attr("src", "img/list_down.png")
        //     }
        // });

        // $("#infoTitle-2").on("click", function() {
        //     if($("#infoContent-2").css("display") === "none") {
        //         $("#infoContent-2").slideDown(500);
        //         $("#infoTitle-2").find(".listDown").attr("src", "img/list_up.png")
        //     }else if($("#infoContent-2").css("display") === "block") {
        //         $("#infoContent-2").slideUp(500);
        //         $("#infoTitle-2").find(".listDown").attr("src", "img/list_down.png")
        //     }
        // });

        $("#infoTitle-3").on("click", function() {
            if($("#infoContent-3").css("display") === "none") {
                $("#infoContent-3").slideDown(800);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_up.png")
            }else if($("#infoContent-3").css("display") === "block") {
                $("#infoContent-3").slideUp(800);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#leaveDate-tab1").on("click", function() {
            beginDate = endDate = $(this).val();
        });

        $("#leaveDate-tab2").on("click", function() {
            beginDate = endDate = $(this).val();
        });

        $("#leaveTime-tab1").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            $("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab3]").text("下午");
            leaveTimetab = "leaveTime-tab1";
        });

        $("#leaveTime-tab2").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            $("label[for=leaveTime-tab2]").text("08:00-12:00");
            $("label[for=leaveTime-tab3]").text("下午");
            leaveTimetab = "leaveTime-tab2";
        });

        $("#leaveTime-tab3").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            $("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab3]").text("13:00-17:00");
            leaveTimetab = "leaveTime-tab3";
        });

        $("#leaveConfirm").on("click", function() {
            if($("#leaveConfirm").hasClass("btn-enable")) {
                countLeaveHoursQueryData = "<LayoutHeader><EmpNo>"
                                         + myEmpNo
                                         + "</EmpNo><leaveid>"
                                         + leaveid
                                         + "</leaveid><begindate>"
                                         + beginDate
                                         + "</begindate><begintime>"
                                         + beginTime
                                         + "</begintime><enddate>"
                                         + endDate
                                         + "</enddate><endtime>"
                                         + endTime
                                         + "</endtime><datumdate></datumdate></LayoutHeader>";
                CountLeaveHours();
                loadingMask("show");
            }
        });

        $(document).keypress(function(e) {
            var searchEmpNo = "";
            var searchName = "";
            var searchData = $("#searchBar").val().match(/^[A-Za-z]*/);
            if(searchData[0] != "") {
                 searchName = searchData[0];
            }else {
                searchEmpNo = $("#searchBar").val();
            }
            queryEmployeeData = "<LayoutHeader><EmpNo>"
                              + myEmpNo
                              + "</EmpNo><qEmpno>"
                              + searchEmpNo
                              + "</qEmpno><qName>"
                              + searchName
                              + "</qName></LayoutHeader>";
            if(timoutQueryEmployeeData != null) {
                clearTimeout(timoutQueryEmployeeData);
                timoutQueryEmployeeData = null;
            }
            timoutQueryEmployeeData = setTimeout(function() {
                QueryEmployeeData();
            }, 2000);
            if(e.which == 13) {
                $("#searchBar").blur();
            }
        });

        $(document).on("change", "#leaveType-popup", function() {
            leaveid = $(this).val();
            leaveType = $(this).text();
            leaveTypeSelected = true;
        });

        $(document).on("popupafterclose", "#leaveType-popup-option", function() {
            if(leaveTypeSelected) {

                $("#leaveType > span:nth-of-type(1)").text("* 尚有 " + leftDaysData[leaveid] + " 天");
                $("input[id=leaveTime-tab1]").prop("disabled", false);
                $("input[id=leaveTime-tab1]").parent().removeClass("ui-state-disabled");

                if(leftDaysData[leaveid] < 0.5) {
                    var msgContent = leaveType + "只剩下 " + leftDaysData[leaveid] + " 天";
                    $('.leftDaysNotEnough').find('.main-paragraph').html(msgContent);
                    popupMsgInit('.leftDaysNotEnough');

                    $("#leaveType > span:nth-of-type(1)").text("");
                    $("#leaveType-popup option").text("請選擇");
                    tplJS.reSizeDropdownList("leaveType-popup", "typeB");
                    leaveid = "";
                    leaveType = "";
                    $("#leaveConfirm").addClass("btn-disable");
                    $("#leaveConfirm").removeClass("btn-enable");

                }else if(leftDaysData[leaveid] >= 0.5 && leftDaysData[leaveid] < 1) {
                    $("input[id=leaveTime-tab1]").prop("disabled", true);
                    $("input[id=leaveTime-tab1]").parent().addClass("ui-state-disabled");
                    if(leaveTimetab == "leaveTime-tab1") {
                        $("input[id=leaveTime-tab2]").trigger('click');
                        $("label[for=leaveTime-tab1]").removeClass('ui-btn-active');
                        $("label[for=leaveTime-tab2]").addClass('ui-btn-active');
                        $("label[for=leaveTime-tab3]").removeClass('ui-btn-active');  
                    }
                }
            }
            if(leaveid != "" && agentid != "") {
                $("#leaveConfirm").removeClass("btn-disable");
                $("#leaveConfirm").addClass("btn-enable");
            }
            leaveTypeSelected = false;
        });

        $(document).on("click", "#agent-popup-option ul li", function(e) {
            agentid = $(this).val();
        });

        $(document).on("popupafterclose", "#agent-popup-option", function() {
            if(leaveid != "" && agentid != "") {
                $("#leaveConfirm").removeClass("btn-disable");
                $("#leaveConfirm").addClass("btn-enable");
            }
        });

        $(document).on("popupafteropen", "#agent-popup-option", function() {
            $("#searchBar").val("");
            $("#agent-popup-option-list").empty();
        });

        function splitTime(time) {
            var regExp = /^(.*?)-(.*?)$/;
            return time.match(regExp);
        }

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

            var viewHeight = $(window).height();
            var popupHeight = popup.outerHeight();
            var top = (viewHeight - popupHeight) / 2;
            popup.parent().css("top", top + "px");
        }
    }
});