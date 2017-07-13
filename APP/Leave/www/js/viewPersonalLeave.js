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
    option: [{
        value: "0",
        text: "Colin Chen"
    }, {
        value: "1",
        text: "Jennifer Y Wang"
    }, {
        value: "2",
        text: "Marvin Lin"
    }, {
        value: "3",
        text: "Vinny YC Tang"
    }, {
        value: "4",
        text: "Eee Tsai"
    }, {
        value: "5",
        text: "Darren K Ti"
    }, {
        value: "6",
        text: "Samuel Hsieh"
    }, {
        value: "7",
        text: "Wendy Hsu"
    }, {
        value: "8",
        text: "Alan Tu"
    }],
    title: '<input type="text" id="searchBar">',
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leftDaysData = {};

$("#viewPersonalLeave").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.QueryCalendarData = function() {

            this.successCallback = function(data) {
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
                    leaveTypeData["defaultValue"] = leaveTypeData["option"][0]["value"];
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
                    // $("#leaveType > span:nth-of-type(1)").text($(leftDays).html() + "天");
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

        $("#infoTitle-1").on("click", function() {
            if($("#infoContent-1").css("display") === "none") {
                $("#infoContent-1").slideDown(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_up.png");
            }else if($("#infoContent-1").css("display") === "block") {
                $("#infoContent-1").slideUp(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#infoTitle-2").on("click", function() {
            if($("#infoContent-2").css("display") === "none") {
                $("#infoContent-2").slideDown(500);
                $("#infoTitle-2").find(".listDown").attr("src", "img/list_up.png")
            }else if($("#infoContent-2").css("display") === "block") {
                $("#infoContent-2").slideUp(500);
                $("#infoTitle-2").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#infoTitle-3").on("click", function() {
            if($("#infoContent-3").css("display") === "none") {
                $("#infoContent-3").slideDown(800);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_up.png")
            }else if($("#infoContent-3").css("display") === "block") {
                $("#infoContent-3").slideUp(800);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#leaveConfirm").on("click", function() {
            $(".toast-style").fadeIn(100).delay(1000).fadeOut(100);
        });

        $(document).on("change", "#leaveType-popup", function() {
            // queryLeftDaysData = "<LayoutHeader><EmpNo>"
            //                   + myEmpNo
            //                   + "</EmpNo><leaveid>"
            //                   + $(this).val()
            //                   + "</leaveid></LayoutHeader>";
            // QueryLeftDaysData();
            $("#leaveType > span:nth-of-type(1)").text(leftDaysData[$(this).val()] + "天");
        });
    }
});