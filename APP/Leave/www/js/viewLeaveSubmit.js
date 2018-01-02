var pleaseSelectStr = langStr["str_069"]; //請選擇
var selectBasedayStr = langStr["str_127"]; //選擇時間
var otherBasedayStr = langStr["str_141"]; //選擇其他基準日
var viewLeaveSubmitInit = false;
var timeoutQueryEmployee = null;
var timeoutChangeBegindate = null;
var timeoutChangeEnddate = null;
var selectCategory = ""; //选择的类别，可能为“所有类别”
var leaveCategory = ""; //对应假别的类别，肯定没有“所有类别”
var leaveObj = {};
var leaveDetail = {};
var leaveSelected = false;
var agentName = "";
var startLeaveDate, endLeaveDate, startLeaveDay, endLeaveDay, startLeaveTime, endLeaveTime;
var basedayList = false;
var baseday = "";
var needBaseday = false;
var leaveReason = "";
var countApplyDays = "0",
    countApplyHours = "0";

var leaveData = {
    id: "leave-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveAgentData = {
    id: "leave-agent-popup",
    option: [],
    title: '<input type="search" id="searchAgent" />',
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};


//檢查是否符合預覽送簽標準
function checkLeaveBeforePreview() {
    //必須符合3個條件：1.請假理由不能爲空 2.開始時間和结束时间 3.需要基准日的是否已选择 4.代理人必须选择
    if (leaveReason !== "" &&
        $("#leave-agent-popup option").text() !== pleaseSelectStr &&
        $('#startText').text() !== pleaseSelectStr &&
        $('#endText').text() !== pleaseSelectStr &&
        $("#leave-popup option").text() !== pleaseSelectStr) {
        //判斷基準日是否選擇
        if (needBaseday == true) {
            if ($("#chooseBaseday").text() == selectBasedayStr) {
                $('#previewBtn').removeClass('leavePreview-active-btn');
            } else {
                $('#previewBtn').addClass('leavePreview-active-btn');
            }
        } else {
            $('#previewBtn').addClass('leavePreview-active-btn');
        }

    } else {
        $('#previewBtn').removeClass('leavePreview-active-btn');
    }
}

//根据类别获取假别
function getLeaveByCategory() {
    var leaveList = [];
    leaveData["option"] = [];
    $("#leaveGenre").empty();
    $("#leave-popup-option-popup").remove();

    //类别分“所有类别”和所选类别
    if (selectCategory === allLeaveCategroyStr) {
        for (var i in allLeaveList) {
            var obj = {};
            obj["leaveid"] = allLeaveList[i]["leaveid"];
            obj["name"] = allLeaveList[i]["name"];
            leaveList.push(obj);
        }
    } else {
        for (var i in allLeaveList) {
            if (selectCategory === allLeaveList[i]["category"]) {
                var obj = {};
                obj["leaveid"] = allLeaveList[i]["leaveid"];
                obj["name"] = allLeaveList[i]["name"];
                leaveList.push(obj);
            }
        }
    }

    for (var i in leaveList) {
        leaveData["option"][i] = {};
        leaveData["option"][i]["value"] = leaveList[i]["leaveid"];
        leaveData["option"][i]["text"] = leaveList[i]["name"];
    }

    tplJS.DropdownList("viewLeaveSubmit", "leaveGenre", "prepend", "typeB", leaveData);

    //假別一旦更改，除了類別的其他選項都需要恢復初始狀態
    $('#leaveIntroduce').empty().hide();
    $('#baseDate').hide();
    $('#uploadAttachment').hide();
    $('#divEmpty').hide();
    //更換假別對基準日有直接影響
    $("#chooseBaseday").text(selectBasedayStr);
    $("#oldBaseday").val("");
    $("#newBaseday").val("");

    leaveid = "";
    leaveType = "";
    baseday = "";
    basedayList = false;
}

$("#viewLeaveSubmit").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        //当有基准日时，不需要对假别剩余天数进行判断
        function selectLeaveNeedBasedate() {
            //desc
            if (leaveDetail["desc"] !== "") {
                var divIntroduce = "<span>*" + leaveDetail["desc"] + "</span>";
                $('#leaveIntroduce').empty().append(divIntroduce).show();
            } else {
                $('#leaveIntroduce').empty().hide();
            }

            //attachment
            if (leaveDetail["attach"] === "Y") {
                $('#uploadAttachment').show();
            } else {
                $('#uploadAttachment').hide();
            }

            $('#baseDate').show();
            $('#divEmpty').show();
            needBaseday = true;

            $("#leaveDays").text("0");
            $("#leaveHours").text("0");
        }

        //查询某假别正在使用的有效基准日——<LayoutHeader><EmpNo>0409132</EmpNo><leaveid>3010</leaveid></LayoutHeader>
        window.QueryDatumDates = function() {

            this.successCallback = function(data) {
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var dateArr = $("date", htmlDom);

                    //length大于0则有有效基准日列表，获取即可
                    if (dateArr.length == 0) {
                        basedayList = false;
                    } else {
                        var basedayHtml = "";
                        for (var i = 0; i < dateArr.length; i++) {
                            basedayHtml += '<div class="tpl-option-msg-list">' + formatDate($.trim($(dateArr[i]).html())) + '</div>';
                        }
                        $(".old-baseday-list").empty().append(basedayHtml);
                        $(".old-baseday-list").append('<div class="tpl-option-msg-list">' + otherBasedayStr + '</div>');

                        basedayList = true;
                    }

                    selectLeaveNeedBasedate();
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryDatumDates", self.successCallback, self.failCallback, queryDatumDatesQueryData, "");
            }();
        };

        //選擇結束時間計算請假數
        window.CountLeaveHoursByEnd = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var leaveSuccess = $("success", htmlDom);
                    var leaveError = $("error", htmlDom);
                    var applyDays = $("ApplyDays", htmlDom);
                    var applyHours = $("ApplyHours", htmlDom);
                    countApplyDays = $(applyDays).html();
                    countApplyHours = $(applyHours).html();

                    if ($(leaveSuccess).html() != undefined) {
                        //success无提示，改变请假数即可
                        $("#leaveDays").text(countApplyDays);
                        $("#leaveHours").text(countApplyHours);
                    } else {
                        //error提示
                        var errorMsg = $(leaveError).html();
                        $('.leftDaysByLeave').find('.header-text').html(errorMsg);
                        popupMsgInit('.leftDaysByLeave');
                        //enddate
                        $("#endText").text(pleaseSelectStr);
                        $("#endDate").val("");
                        $("#leaveDays").text("0");
                        $("#leaveHours").text("0");
                    }

                    //檢查是否可以預覽送簽
                    checkLeaveBeforePreview();

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "CountLeaveHours", self.successCallback, self.failCallback, countLeaveHoursByEndQueryData, "");
            }();
        };

        //请假申请送签
        window.SendApplyLeaveData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDom);
                    if ($(success).html() != undefined) {
                        //如果送签成功，重新获取请假单列表，并跳转到“请假单查询”页，并记录代理人到local端
                        $("#backMain").click();
                        QueryEmployeeLeaveApplyForm();
                        changePageByPanel("viewLeaveQuery"); 
                        $("#sendLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                        //送签成功，清空申请表单
                        $("#emptyLeaveForm").trigger("click");
                        //如果快速请假申请成功，代理人信息存到local端，姓名在前，工号在后
                        localStorage.setItem("agent", JSON.stringify([$("#leave-agent-popup option").text(), agentid]));
                    } else {
                        loadingMask("hide");
                        var error = $("error", htmlDom);
                        var errorMsg = $(error).html();
                        $('.leftDaysByLeave').find('.header-text').html(errorMsg);
                        popupMsgInit('.leftDaysByLeave');
                    }

                }
            };

            this.failCallback = function(data) {
                loadingMask("hide");
            };

            var __construct = function() {
                CustomAPI("POST", true, "SendLeaveApplicationData", self.successCallback, self.failCallback, sendApplyLeaveQueryData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewLeaveSubmit").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewLeaveSubmit").on("pageshow", function(event, ui) {
            //如果是从“假单详情（已撤回）”编辑功能跳转过来的，且该代理人不在职，popup提示重新选择代理人
            if (editLeaveForm && employeeName == "") {
                popupMsgInit('.agentNotData');
            }
            $('#applyDay').text(applyDay);
            $('#previewApplyDay').text(applyDay);

            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveSubmit").keypress(function(event) {

        });

        //選擇類別——select change
        $(document).on("change", "#categroy-popup", function() {
            //selectCategory = $.trim($(this).text()); 
            selectCategory = $(this).val();
            getLeaveByCategory();
            checkLeaveBeforePreview();
        });

        //获取所选的假别信息——select change
        $(document).on("change", "#leave-popup", function() {
            leaveid = $(this).val();
            leaveType = $.trim($(this).text());
            leaveSelected = true;
            baseday = "";
            console.log("leaveid:" + leaveid);
        });

        //點擊假別彈框關閉以後判斷是否可以預覽送簽
        $(document).on("popupafterclose", "#leave-popup-option", function() {
            if (leaveSelected) {
                for (var i in allLeaveList) {
                    if (leaveid == allLeaveList[i]["leaveid"]) {
                        //選擇假別後，獲取假別對象
                        leaveDetail = allLeaveList[i];
                        leaveCategory = allLeaveList[i]["category"];

                        //不需要基准日回传剩余天数，需要基准日回传有效基准日列表
                        if (leaveDetail["basedate"] == "N") {
                            queryLeftDaysData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //console.log(queryLeftDaysData);
                            //呼叫API
                            QueryLeftDaysData();

                        } else if (leaveDetail["basedate"] == "Y") {
                            queryDatumDatesQueryData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //呼叫API
                            QueryDatumDates();

                        }

                        return false;
                    }
                }
            }
            checkLeaveBeforePreview();
        });

        $(document).on("click", "#leave-popup-option-list li", function() {
            var self = $.trim($(this).text());
            if (editLeaveForm == true) {
                for (var i in allLeaveList) {
                    if (self == allLeaveList[i]["name"]) {
                        //選擇假別後，獲取假別對象
                        leaveDetail = allLeaveList[i];
                        leaveCategory = allLeaveList[i]["category"];
                        leaveid = allLeaveList[i]["leaveid"];

                        //不需要基准日回传剩余天数，需要基准日回传有效基准日列表
                        if (leaveDetail["basedate"] == "N") {
                            queryLeftDaysData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //console.log(queryLeftDaysData);
                            //呼叫API
                            QueryLeftDaysData();

                        } else if (leaveDetail["basedate"] == "Y") {
                            queryDatumDatesQueryData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //呼叫API
                            QueryDatumDates();

                        }

                        return false;
                    }
                }
            }
            checkLeaveBeforePreview();
        });

        //搜索代理人
        $(document).on("keyup", "#searchAgent", function(e) {
            if ($("#searchAgent").val().length == 0) {
                $("#loaderQuery").hide();
                $("#leave-agent-popup-option-list").hide();
                return;
            }
            var searchEmpNo = "";
            var searchName = "";
            var searchData = $("#searchAgent").val().match(/^[A-Za-z\.]*/);
            if (searchData[0] != "") {
                searchName = searchData[0];
            } else {
                searchEmpNo = $("#searchAgent").val();
            }
            queryEmployeeData = "<LayoutHeader><EmpNo>" +
                myEmpNo +
                "</EmpNo><qEmpno>" +
                searchEmpNo +
                "</qEmpno><qName>" +
                searchName +
                "</qName></LayoutHeader>";
            //console.log(queryEmployeeData);
            if (timeoutQueryEmployee != null) {
                clearTimeout(timeoutQueryEmployee);
                timeoutQueryEmployee = null;
            }
            timeoutQueryEmployee = setTimeout(function() {
                QueryEmployeeData();

                $("#loaderQuery").show();
                $("#leave-agent-popup-option-list").hide();
            }, 2000);
            if (e.which == 13) {
                $("#searchAgent").blur();
            }
        });

        //點擊獲取代理人的姓名（去除代理人部門代碼）
        $(document).on("click", "#leave-agent-popup-option ul li", function(e) {
            agentid = $(this).attr("value");
            agentName = $(this).children("div").eq(1).children("span").text();
        });

        //popup打开以后生成代理人列表
        $(document).on("popupafteropen", "#leave-agent-popup-option", function() {
            $("#searchAgent").val("");
            $("#leave-agent-popup-option-list").empty();

            if ($("#loaderQuery").length <= 0) {
                $("#leave-agent-popup-option-popup .ui-content").append('<img id="loaderQuery" src="img/query-loader.gif" width="15" height="15" style="margin-left:45%; display:none;">');
            } else {
                $("#loaderQuery").hide();
            }
        });

        //代理人选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#leave-agent-popup-option", function() {
            checkLeaveBeforePreview();
        });

        //選擇基準日，根據是否有有效基準日操作——click
        $("#selectBaseday").on("click", function() {
            if (basedayList) {
                popupMsgInit('.basedayList');
            } else {
                //datetime-local
                if (device.platform === "iOS") {
                    $("#newBaseday").trigger("focus");
                } else if (device.platform === "Android") {
                    $("#newBaseday").trigger("click");
                }
            }
        });

        //新基準日選擇——datetime change
        $("#newBaseday").on("change", function() {
            baseday = dateFormat($(this).val());

            if (baseday === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            } else {
                $("#chooseBaseday").text(baseday);
            }

            //只要换基准日，结束时间都恢复“请选择”
            $('#endText').text(pleaseSelectStr);
            $("#endDate").val("");

            checkLeaveBeforePreview();
        });

        //選擇有效基準日列表——click basedaylist
        $(document).on("click", ".basedayList .old-baseday-list div", function() {
            var self = $(this).text();

            //去除所有已选择样式，并给this添加已选择样式
            $(".basedayList .old-baseday-list div").removeClass("tpl-dropdown-list-selected");
            $(this).addClass("tpl-dropdown-list-selected");

            //关闭popup
            $(".basedayList").popup("close");

            //如果點擊 “選擇其他基準日” ，則彈出datetime
            if (self === otherBasedayStr) {
                baseday = "";
                if (device.platform === "iOS") {
                    $("#oldBaseday").trigger("focus");
                } else if (device.platform === "Android") {
                    $("#oldBaseday").trigger("click");
                }
            } else {
                baseday = self;
                $("#chooseBaseday").text(self);
            }

            //只要换基准日，结束时间都恢复“请选择”
            $('#endText').text(pleaseSelectStr);
            $("#endDate").val("");

            checkLeaveBeforePreview();
        });

        //無有效基準日選擇——datetime change
        $("#oldBaseday").on("change", function() {
            baseday = dateFormat($(this).val());

            if (baseday === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            } else {
                $("#chooseBaseday").text(baseday);
            }

            //只要换基准日，结束时间都恢复“请选择”
            $('#endText').text(pleaseSelectStr);
            $("#endDate").val("");

            checkLeaveBeforePreview();
        });

        //關閉有效基準日列表——popup close
        $("#closeBasedayList").on("click", function() {
            $(".basedayList").popup("close");
        });

        //點擊開始日期
        $("#btnStartday").on("click", function() {
            //選擇開始日期之前判斷假別是否選擇
            if (leaveid === "") {
                popupMsgInit('.categroyFirst');
            } else {
                //再判斷是否需要基準日
                if (needBaseday) {
                    //再判斷基準日是否已经选择
                    if ($("#chooseBaseday").text() !== selectBasedayStr) {
                        if (device.platform === "iOS") {
                            $("#startDate").trigger("focus");
                        } else if (device.platform === "Android") {
                            $("#startDate").trigger("click");
                        }
                    } else {
                        popupMsgInit('.basedayFirst');
                    }
                } else {
                    if (device.platform === "iOS") {
                        $("#startDate").trigger("focus");
                    } else if (device.platform === "Android") {
                        $("#startDate").trigger("click");
                    }
                }
            }
        });

        //開始日期改变
        // $("#startDate").on("change", function() {

        //     if(timeoutChangeBegindate != null) {
        //         clearTimeout(timeoutChangeBegindate);
        //         timeoutChangeBegindate = null;
        //     }
        //     timeoutChangeBegindate = setTimeout(function() {
        //         var self = $("#startDate").val();
        //         //console.log(self);
        //         var minute = parseInt(self.substring(14, 16));

        //         startLeaveDate = "";
        //         startLeaveDay = 0;
        //         startLeaveTime = 0;

        //         //開始時間是否爲空
        //         if(self !== "") {
        //             //android上日期格式:yyyy-MM-dd T hh:mm，ios上日期格式：yyyy-MM-dd T hh:mm:ss
        //             //分钟数小于30设为“00”,如果大于等于30设为“30”
        //             if(minute < 30) {
        //                 startLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "00";
        //             } else {
        //                 startLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "30";
        //             }

        //             //分别获取日期和时间，需要与结束时间进行比较，原则上开始时间必须小于结束时间
        //             startLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
        //             startLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

        //             $('#startText').text(startLeaveDate);

        //         } else {
        //             $('#startText').text(pleaseSelectStr);
        //             $("#startDate").val("");

        //         }
        //         //如果开始时间改变，结束时间无论如何也要清空
        //         $("#endText").text(pleaseSelectStr);
        //         $("#endDate").val("");

        //         //请假数恢复00
        //         $("#leaveDays").text("0");
        //         $("#leaveHours").text("0");

        //         //檢查是否可以預覽送簽
        //         checkLeaveBeforePreview();

        //     }, 2000);

        // });

        $("#startDate").on("change", function() {
            if (device.platform === "iOS") {
                if (timeoutChangeBegindate != null) {
                    clearTimeout(timeoutChangeBegindate);
                    timeoutChangeBegindate = null;
                }
                timeoutChangeBegindate = setTimeout(function() {
                    $("#startDate").blur();
                }, 12000);
            } else if (device.platform === "Android") {
                $("#startDate").blur();
            }


        });

        $("#startDate").on("blur", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            startLeaveDate = "";
            startLeaveDay = 0;
            startLeaveTime = 0;

            //開始時間是否爲空
            if (self !== "") {
                //android上日期格式:yyyy-MM-dd T hh:mm，ios上日期格式：yyyy-MM-dd T hh:mm:ss
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if (minute < 30) {
                    startLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "00";
                } else {
                    startLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "30";
                }

                //分别获取日期和时间，需要与结束时间进行比较，原则上开始时间必须小于结束时间
                startLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                startLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                $('#startText').text(startLeaveDate);

            } else {
                $('#startText').text(pleaseSelectStr);
                $("#startDate").val("");

            }
            //如果开始时间改变，结束时间无论如何也要清空
            $("#endText").text(pleaseSelectStr);
            $("#endDate").val("");

            //请假数恢复00
            $("#leaveDays").text("0");
            $("#leaveHours").text("0");

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });


        //點擊結束日期——datetime
        $("#btnEndday").on("click", function() {
            //点击“结束时间”只需要判断“开始时间”是否选择
            if ($("#startText").text() == pleaseSelectStr) {
                popupMsgInit('.startdayFirst');
            } else {
                if (device.platform === "iOS") {
                    $("#endDate").trigger("focus");
                } else if (device.platform === "Android") {
                    $("#endDate").trigger("click");
                }
            }

        });

        //結束日期改變
        // $("#endDate").on("change", function() {
        //     if(timeoutChangeEnddate != null) {
        //         clearTimeout(timeoutChangeEnddate);
        //         timeoutChangeEnddate = null;
        //     }
        //     timeoutChangeEnddate = setTimeout(function() {
        //         var self = $("#endDate").val();
        //         var minute = parseInt(self.substring(14, 16));

        //         endLeaveDate = "";
        //         endLeaveDay = 0;
        //         endLeaveTime = 0;         

        //         //結束時間是否爲空
        //         if(self !== "") {
        //             //分钟数小于30设为“00”,如果大于等于30设为“30”
        //             if(minute < 30) {
        //                 endLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "00";
        //             } else {
        //                 endLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "30";
        //             }

        //             //分别获取日期和时间，需要与开始时间进行比较，原则上开始时间必须小于结束时间
        //             endLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
        //             endLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

        //             //結束時間必須大於開始時間
        //             if(startLeaveDay > endLeaveDay || (startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime)) {
        //                 //提示錯誤信息
        //                 popupMsgInit('.dateTimeError');
        //                 $('#endText').text(pleaseSelectStr);
        //                 $("#endDate").val("");
        //                 //请假数恢复0，0
        //                 $("#leaveDays").text("0");
        //                 $("#leaveHours").text("0");
        //             } else {
        //                 //loadingMask("show");
        //                 $('#endText').text(endLeaveDate);

        //                 countLeaveHoursByEndQueryData = "<LayoutHeader><EmpNo>"
        //                                               + myEmpNo
        //                                               + "</EmpNo><leaveid>"
        //                                               + leaveid
        //                                               + "</leaveid><begindate>"
        //                                               + startLeaveDate.split(" ")[0]
        //                                               + "</begindate><begintime>"
        //                                               + startLeaveDate.split(" ")[1]
        //                                               + "</begintime><enddate>"
        //                                               + endLeaveDate.split(" ")[0]
        //                                               + "</enddate><endtime>"
        //                                               + endLeaveDate.split(" ")[1]
        //                                               + "</endtime><datumdate>"
        //                                               + ((needBaseday == true) ? baseday : '')
        //                                               + "</datumdate></LayoutHeader>";
        //                 //console.log(countLeaveHoursByEndQueryData);
        //                 CountLeaveHoursByEnd();  
        //             }
        //         } else {
        //             $('#endText').text(pleaseSelectStr);
        //             $("#endDate").val("");
        //             //请假数恢复00
        //             $("#leaveDays").text("0");
        //             $("#leaveHours").text("0");
        //         }

        //         //檢查是否可以預覽送簽
        //         checkLeaveBeforePreview();

        //     }, 2500);

        // });

        $("#endDate").on("change", function() {
            if (device.platform === "iOS") {
                if (timeoutChangeEnddate != null) {
                    clearTimeout(timeoutChangeEnddate);
                    timeoutChangeEnddate = null;
                }
                timeoutChangeEnddate = setTimeout(function() {
                    $("#endDate").blur();
                }, 12000);
            } else if (device.platform === "Android") {
                $("#endDate").blur();
            }

        });

        $("#endDate").on("blur", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            endLeaveDate = "";
            endLeaveDay = 0;
            endLeaveTime = 0;

            //結束時間是否爲空
            if (self !== "") {
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if (minute < 30) {
                    endLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "00";
                } else {
                    endLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "30";
                }

                //分别获取日期和时间，需要与开始时间进行比较，原则上开始时间必须小于结束时间
                endLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                endLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                //結束時間必須大於開始時間
                if (startLeaveDay > endLeaveDay || (startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime)) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(pleaseSelectStr);
                    $("#endDate").val("");
                    //请假数恢复0，0
                    $("#leaveDays").text("0");
                    $("#leaveHours").text("0");
                } else {
                    //loadingMask("show");
                    $('#endText').text(endLeaveDate);

                    countLeaveHoursByEndQueryData = "<LayoutHeader><EmpNo>" +
                        myEmpNo +
                        "</EmpNo><leaveid>" +
                        leaveid +
                        "</leaveid><begindate>" +
                        startLeaveDate.split(" ")[0] +
                        "</begindate><begintime>" +
                        startLeaveDate.split(" ")[1] +
                        "</begintime><enddate>" +
                        endLeaveDate.split(" ")[0] +
                        "</enddate><endtime>" +
                        endLeaveDate.split(" ")[1] +
                        "</endtime><datumdate>" +
                        ((needBaseday == true) ? baseday : '') +
                        "</datumdate></LayoutHeader>";
                    //console.log(countLeaveHoursByEndQueryData);
                    CountLeaveHoursByEnd();

                }
            } else {
                $('#endText').text(pleaseSelectStr);
                $("#endDate").val("");
                //请假数恢复00
                $("#leaveDays").text("0");
                $("#leaveHours").text("0");
            }

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });

        //實時獲取多行文本值
        $("#leaveReason").on("keyup", function() {
            leaveReason = $.trim($(this).val());

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });

        //清除請假申請
        $("#emptyLeaveForm").on("click", function() {
            //申請日期
            $('#applyDay').text(applyDay);

            //類別
            $.each($("#categroy-popup-option-list li"), function(i, item) {
                if ($(item).text() === allLeaveCategroyStr) {
                    $(item).trigger("click");
                    return false;
                }
            });

            //假別
            getLeaveByCategory();
            leaveid = "";

            //代理人不清除

            //開始時間
            $("#startText").text(pleaseSelectStr);
            $("#startDate").val("");
            startLeaveDate = "";

            //結束時間
            $("#endText").text(pleaseSelectStr);
            $("#endDate").val("");
            endLeaveDate = "";

            //請假理由
            $("#leaveReason").val("");
            leaveReason = "";

            //基準日
            $("#chooseBaseday").text(selectBasedayStr);
            $("#oldBaseday").val("");
            $("#newBaseday").val("");
            baseday = "";

            //请假数
            $("#leaveDays").text("0");
            $("#leaveHours").text("0");
        });

        //預覽送簽按鈕
        $("#previewBtn").on("click", function() {
            if ($('#previewBtn').hasClass('leavePreview-active-btn')) {
                //傳值到預覽頁面
                $("#applyCategroy").text(leaveCategory);
                $("#applyLeave").text(leaveType);
                $("#applyAgent").text(agentName);
                $("#applyStartday").text(startLeaveDate);
                $("#applyEndday").text(endLeaveDate);
                $("#applyReason").text(leaveReason);
                $("#previewLeaveDays").text(countApplyDays);
                $("#previewLeaveHours").text(countApplyHours);

                $('.apply-container').hide();
                $('#viewLeaveSubmit .leaveMenu').hide();
                $('.apply-preview').show();
                $('#backMain').show();
                $("#applyBtn").show();
            }
        });

        //从预览返回申请
        $("#backMain").on("click", function() {
            $('.apply-preview').hide();
            $('#backMain').hide();
            $('.apply-container').show();
            $('#viewLeaveSubmit .leaveMenu').show();
            //return false;
        });

        //立即預約popup
        $("#applyBtn").on("click", function() {
            popupMsgInit('.confirmSend');
        });

        //確定送簽
        $("#confirmSendLeave").on("click", function() {
            $("#applyBtn").hide();
            loadingMask("show");
            sendApplyLeaveQueryData = '<LayoutHeader><empno>' +
                myEmpNo +
                '</empno><delegate>' +
                agentid +
                '</delegate><leaveid>' +
                leaveid +
                '</leaveid><begindate>' +
                startLeaveDate.split(" ")[0] +
                '</begindate><begintime>' +
                startLeaveDate.split(" ")[1] +
                '</begintime><enddate>' +
                endLeaveDate.split(" ")[0] +
                '</enddate><endtime>' +
                endLeaveDate.split(" ")[1] +
                '</endtime><datumdate>' +
                ((needBaseday == true) ? baseday : '') +
                '</datumdate><applydays>' +
                countApplyDays +
                '</applydays><applyhours>' +
                countApplyHours +
                '</applyhours><reason>' +
                leaveReason +
                '</reason><isattached>' +
                '</isattached><attachment>' +
                '</attachment><formid>' +
                ((editLeaveForm == false) ? '' : leaveDetailObj['formid']) +
                '</formid></LayoutHeader>';

            //console.log(sendApplyLeaveQueryData);
            //呼叫API
            SendApplyLeaveData();
        });


    }
});