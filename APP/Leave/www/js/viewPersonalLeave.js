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
    defaultText: langStr["str_069"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var agentData = {
    id: "agent-popup",
    option: [],
    title: '<input type="search" id="searchBar" />',
    defaultText: langStr["str_069"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

$("#viewPersonalLeave").pagecontainer({
    create: function(event, ui) {

        var leaveIDArry = "";

        /********************************** function *************************************/
        window.QueryCalendarData = function() {

            this.successCallback = function(data) {
                myCalendarData = {};
                myHolidayData = [];
                var leaveFlag = "3";
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["Result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var colorTagArry = $("color", htmlDoc);
                    var informationTagArry = $("information", htmlDoc);

                    for(var day = 1; day <= colorTagArry.length; day++) {
                        if(myCalendarData[$(colorTagArry[day-1]).html()] === undefined ) {
                            myCalendarData[$(colorTagArry[day-1]).html()] = [];
                        }
                        myCalendarData[$(colorTagArry[day-1]).html()].push(day);
                        myHolidayData[day] = parseCDATA($(informationTagArry[day-1]).html());
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
                //console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["quickleavelist"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var leaveTypeArry = $("name", htmlDoc);
                    leaveIDArry = $("leaveid", htmlDoc);
                    for(var i = 0; i < leaveTypeArry.length; i++) {
                        leaveTypeData["option"][i] = {};
                        leaveTypeData["option"][i]["value"] = $(leaveIDArry[i]).html();
                        leaveTypeData["option"][i]["text"] = $(leaveTypeArry[i]).html();
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

                    //$("#leaveType > span:nth-of-type(1)").text("* 尚有 " + leftDaysData[leaveid] + " 天");
                    $("#leaveType > span:nth-of-type(1)").text("* " + langStr["str_070"] + " " + leftDaysData[leaveid] + " " + langStr["str_071"]);
                    $("input[id=leaveTime-tab1]").prop("disabled", false);
                    $("input[id=leaveTime-tab1]").parent().removeClass("ui-state-disabled");

                    if (leftDaysData[leaveid] < 0) {
                        $("#leaveType > span:nth-of-type(1)").text("");
                    } else if (leftDaysData[leaveid] >= 0 && leftDaysData[leaveid] < 0.5) {
                        //var msgContent = leaveType + "只剩下 " + leftDaysData[leaveid] + " 天";
                        var msgContent = leaveType + langStr["str_072"] + " " + leftDaysData[leaveid] + " " + langStr["str_071"];
                        $('.leftDaysNotEnough').find('.main-paragraph').html(msgContent);
                        popupMsgInit('.leftDaysNotEnough');

                        $("#leaveType > span:nth-of-type(1)").text("");
                        //$("#leaveType-popup option").text("請選擇");
                        $("#leaveType-popup option").text(langStr["str_069"]);
                        tplJS.reSizeDropdownList("leaveType-popup", "typeB");
                        leaveid = "";
                        leaveType = "";
                        $("#leaveConfirm").addClass("btn-disable");
                        $("#leaveConfirm").removeClass("btn-enable");

                    } else if (leftDaysData[leaveid] >= 0.5 && leftDaysData[leaveid] < 1) {
                        $("input[id=leaveTime-tab1]").prop("disabled", true);
                        $("input[id=leaveTime-tab1]").parent().addClass("ui-state-disabled");
                        if(leaveTimetab == "leaveTime-tab1") {
                            $("input[id=leaveTime-tab2]").trigger('click');
                            $("label[for=leaveTime-tab1]").removeClass('ui-btn-active');
                            $("label[for=leaveTime-tab2]").addClass('ui-btn-active');
                            $("label[for=leaveTime-tab3]").removeClass('ui-btn-active');
                        }
                    }

                    if(leaveid != "" && agentid != "") {
                        $("#leaveConfirm").removeClass("btn-disable");
                        $("#leaveConfirm").addClass("btn-enable");
                    }
                    leaveTypeSelected = false;
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryLeftDaysData", self.successCallback, self.failCallback, queryLeftDaysData, "");
            }();
        };

        window.QueryEmployeeData = function(callback) {
            callback = callback || null;

            this.successCallback = function(data) {
                if(data['ResultCode'] === "1") {
                    var agentList = "";
                    var agentNotExist = false;
                    if(data['Content'][0] == undefined) {
                        agentNotExist = true;
                    }else {
                        var callbackData = data['Content'][0]["result"];
                        var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                        var DepArry = $("Department", htmlDoc);
                        var nameArry = $("name", htmlDoc);
                        var agentIDArry = $("Empno", htmlDoc)
                        for(var i=0; i<DepArry.length; i++) {
                            if($(agentIDArry[i]).html() !== localStorage["emp_no"]) {
                                agentList += '<li class="tpl-option-msg-list" value="'+ $(agentIDArry[i]).html() + "" +'">'
                                           +    '<div style="width: 25VW;"><span>'
                                           +        $(DepArry[i]).html()
                                           +    '</span></div>'
                                           +    '<div><span>'
                                           +        $(nameArry[i]).html()
                                           +    '</span></div>'
                                           + '</li>';
                            }
                        }
                        if(agentList == "") {
                            agentNotExist = true;
                        }else {
                            //viewPersonalLeave
                            $("#agent-popup-option-list").empty().append(agentList);
                            resizePopup("agent-popup-option");

                            $("#agent-popup-option-list").show();
                            $("#queryLoader").hide();

                            //viewLeaveSubmit
                            $("#leave-agent-popup-option-list").empty().append(agentList);
                            resizePopup("leave-agent-popup-option");
                            $("#leave-agent-popup-option-list").show();
                            $(".queryLoader").hide();

                            if (callback === "CountLeaveHours") {
                                CountLeaveHours();
                            }
                        }
                    }

                    if(agentNotExist) {
                        $("#agent-popup-option").popup("close");
                        popupMsgInit('.agentNotExist');

                        //Clear Data
                        //var newOption = '<option hidden>請選擇</option>';
                        var newOption = '<option hidden>' + langStr["str_069"] + '</option>';
                        //veiwPersonalLeave
                        $("#agent-popup").find("option").remove().end().append(newOption);
                        //viewLeaveSubmit
                        $("#leave-agent-popup").find("option").remove().end().append(newOption);
                        agentid = "";
                        window.localStorage.removeItem('agent');
                        setTimeout(function(){
                            //viewPersonalLeave
                            tplJS.reSizeDropdownList("agent-popup", "typeB");
                            //viewLeaveSubmit
                            tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
                        }, 1000);
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
                console.log(data);
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

                    if (callbackData.indexOf("error") != -1) {
                        //$('.applyLeaveFail').find('.main-paragraph').html("假單送簽失敗");
                        $('.applyLeaveFail').find('.main-paragraph').html(langStr["str_073"]);
                        popupMsgInit('.applyLeaveFail');
                    } else {
                        var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                        var success = $("success", htmlDoc);
                        if ($(success).html() != undefined) {
                            $(".toast-style").fadeIn(100).delay(3000).fadeOut(100);
                            localStorage.setItem("agent", JSON.stringify([$("#agent-popup option").text(), agentid]));
                        } else {
                            var error = $("error", htmlDoc);
                            var msgContent = $(error).html();
                            $('.applyLeaveFail').find('.main-paragraph').html(msgContent);
                            popupMsgInit('.applyLeaveFail');
                        }
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

        function parseCDATA(data) {
            data = data.toString();
            var dataTempA = data.split("CDATA");
            var dataTempB = dataTempA[1].split("[");
            var dataTempC = dataTempB[1].split("]]");

            return dataTempC[0];
        }

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
            $("#tab-1").hide();
            $("#tab-2").show();
            if(lastPageID === "viewPersonalLeave") {
                //viewPersonalLeave
                tplJS.DropdownList("viewPersonalLeave", "agent", "prepend", "typeB", agentData);
                //viewLeaveSubmit
                tplJS.DropdownList("viewLeaveSubmit", "leaveAgent", "prepend", "typeB", leaveAgentData);
            }
            $("label[for=viewPersonalLeave-tab-1]").removeClass('ui-btn-active');
            $("label[for=viewPersonalLeave-tab-2]").addClass('ui-btn-active');
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

            if(localStorage.getItem("agent") !== null) {
                queryEmployeeData = "<LayoutHeader><EmpNo>"
                                  + myEmpNo
                                  + "</EmpNo><qEmpno>"
                                  + JSON.parse(localStorage.getItem("agent"))[1]
                                  + "</qEmpno><qName>"
                                  + JSON.parse(localStorage.getItem("agent"))[0]
                                  + "</qName></LayoutHeader>";
                QueryEmployeeData();
            }
        });

        $("#infoTitle-1").on("click", function() {
            if($("#infoContent-1").css("display") === "none") {
                $("#infoContent-1").slideDown(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_up.png");
            }else if($("#infoContent-1").css("display") === "block") {
                $("#infoContent-1").slideUp(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_down.png")
            }
        });

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

        $("#leaveTime-tab1").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            //$("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab2]").text(langStr["str_074"]);
            //$("label[for=leaveTime-tab3]").text("下午");
            $("label[for=leaveTime-tab3]").text(langStr["str_075"]);
            leaveTimetab = "leaveTime-tab1";
        });

        $("#leaveTime-tab2").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            $("label[for=leaveTime-tab2]").text("08:00-12:00");
            //$("label[for=leaveTime-tab3]").text("下午");
            $("label[for=leaveTime-tab3]").text(langStr["str_075"]);
            leaveTimetab = "leaveTime-tab2";
        });

        $("#leaveTime-tab3").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            //$("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab2]").text(langStr["str_074"]);
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

                if(localStorage.getItem("agent") !== null) {
                    queryEmployeeData = "<LayoutHeader><EmpNo>"
                                  + myEmpNo
                                  + "</EmpNo><qEmpno>"
                                  + JSON.parse(localStorage.getItem("agent"))[1]
                                  + "</qEmpno><qName>"
                                  + JSON.parse(localStorage.getItem("agent"))[0]
                                  + "</qName></LayoutHeader>";
                    QueryEmployeeData("CountLeaveHours");
                } else {
                    CountLeaveHours();
                }

                loadingMask("show");
            }
        });

        $(document).keyup(function(e) {
            if ($("#searchBar").val().length == 0) {
                $("#queryLoader").hide();
                $("#agent-popup-option-list").hide();
                return;
            }
            var searchEmpNo = "";
            var searchName = "";
            var searchData = $("#searchBar").val().match(/^[A-Za-z\.]*/);
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

                $("#queryLoader").show();
                $("#agent-popup-option-list").hide();
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
                for(var i = 0; i < leaveIDArry.length; i++) {
                    if (leaveid === $(leaveIDArry[i]).html()) {
                        queryLeftDaysData = "<LayoutHeader><EmpNo>"
                                          + myEmpNo
                                          + "</EmpNo><leaveid>"
                                          + $(leaveIDArry[i]).html()
                                          + "</leaveid></LayoutHeader>";
                        QueryLeftDaysData($(leaveIDArry[i]).html());
                    }
                }
            }
        });

        $(document).on("click", "#agent-popup-option ul li", function(e) {
            agentid = $(this).attr("value");
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

            if ($("#queryLoader").length <= 0) {
                $("#agent-popup-option-popup .ui-content").append('<img id="queryLoader" src="img/query-loader.gif" width="15" height="15" style="margin-left:45%; display:none;">');
            } else {
                $("#queryLoader").hide();
            }
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

        //Calendar Event
        $(document).on({
            click: function(event) {
                var isLeave = false;
                var isWeekend = false;
                var isNormal = false;
                var dayNumber = $(event.target).prop("id");
                var divWidth;
                var divWidthPX;
                var firstTdWidth;
                var calendarFirstTr = $(".QPlayCalendar").find("tr:eq(1)")[0];
                var calendarFirstTrTop = $(calendarFirstTr).position().top;
                var tooltipMarginTop = parseInt(document.documentElement.clientWidth * 1.724 / 100, 10);
                calendarFirstTrTop = parseInt(calendarFirstTrTop + tooltipMarginTop, 10);
                var clickTdTop = $(event.target).parent().position().top;
                var tooltipTop;

                //Leave
                if ($(event.target).parent().hasClass("leave")) {
                    isLeave = true;
                }

                //Weekend
                if ($(event.target).parent().hasClass("weekend")) {
                    isWeekend = true;
                }

                //Normal
                if (!isLeave && !isWeekend) {
                    isNormal = true;
                }

                if (isLeave) {
                    divWidth = "48vw";
                    firstTdWidth = "24vw";
                    divWidthPX = parseInt(document.documentElement.clientWidth * 48 / 100, 10);
                    tooltipTop = calendarFirstTrTop;
                } else if (isWeekend) {
                    divWidth = "32vw";
                    divWidthPX = parseInt(document.documentElement.clientWidth * 32 / 100, 10);
                    tooltipTop = parseInt(clickTdTop + tooltipMarginTop, 10);
                } else if (isNormal) {
                    divWidth = "25vw";
                    divWidthPX = parseInt(document.documentElement.clientWidth * 25 / 100, 10);
                    tooltipTop = parseInt(clickTdTop + tooltipMarginTop, 10);
                }

                //Tooltip position: left / right
                var dayIndexInWeek = $(event.target).parent().index(); //0,1,2,3,4,5,6
                var tooltipPosition = "right";
                var tooltipHorizontalPosition;
                var tdLeft = $(event.target).position().left;
                var tdWidth = $(event.target).width();
                var tdPaddingY = parseInt(document.documentElement.clientWidth * 1.53 / 100, 10);
                var tooltipMarginY = parseInt(document.documentElement.clientWidth * 2.81 / 100, 10);

                if (dayIndexInWeek >= 3) {
                    tooltipPosition = "left";
                }

                if (tooltipPosition === "left") {
                    tooltipHorizontalPosition = "left:" + parseInt(tdLeft - divWidthPX - tdPaddingY - tooltipMarginY, 10) + "px;";
                } else {
                    tooltipHorizontalPosition = "left:" + parseInt(tdLeft + tdWidth - tdPaddingY*2 + tooltipMarginY, 10) + "px;";
                }

                $(".tooltip").remove();
                $("#viewPersonalLeave").append('<div class="tooltip" style="width:' + divWidth + '; top:' + tooltipTop + 'px; ' + tooltipHorizontalPosition + '">' + myHolidayData[dayNumber] + '</div>');

                if (isLeave) {
                    $(".tooltip").find("table").css({
                        "width": divWidth,
                        "line-height": "1.2"
                    });

                    $(".tooltip").find("table").each(function(index, dom) {
                        $(dom).find("td:eq(0)").css("width", firstTdWidth);
                    });
                }

            }
        }, ".QPlayCalendar");

        $(document).on("click", function(event) {
            if (!$(event.target).parent().parent().parent().parent().parent().hasClass("QPlayCalendar")) {
                if (!$(event.target).parent().parent().parent().parent().parent().hasClass("tooltip")) {
                    if ($(".tooltip").length > 0) {
                        $(".tooltip").remove();
                    }
                }
            }
        });

        $(document).on("change", "input[name=radio-choice-h-2]", function() {
            if ($(".tooltip").length > 0) {
                $(".tooltip").remove();
            }
        });

        //Leave Date scroll click
        $(document).on("click", "#leaveDate a", function() {
            $("#leaveDate a").removeClass("hover");
            $(this).addClass("hover");

            beginDate = endDate = $(this).data("value");
        });

    }
});
