var leaveAllData = [
    {leaveid: '10', categroy: '本期特休', leave: '本期特休', introduce: '依照同仁年資天數計算', attachment: 0, basedate: 0, leftday: 5},
    {leaveid: '29', categroy: '去年特休', leave: '去年特休', introduce: '使用期限到2017/12/31止', attachment: 0, basedate: 0, leftday: 0.5},
    {leaveid: '30', categroy: '去年彈休', leave: '去年彈休', introduce: '使用期限到2017/12/31止', attachment: 0, basedate: 0, leftday: 1},
    {leaveid: '22', categroy: '預支特休', leave: '預支特休', introduce: '7天/年，於發放下期特休或離職時回扣', attachment: 0, basedate: 0, leftday: 0},
    {leaveid: '888', categroy: '病假', leave: '三天病假', introduce: '超過三日以上，須檢附醫師證明方可請假，扣薪條件如半薪病假', attachment: 1, basedate: 0, leftday: 0.5},
    {leaveid: '4', categroy: '病假', leave: '半薪病假', introduce: '一年有30天日的半薪病假', attachment: 0, basedate: 0, leftday: 2},
    {leaveid: '23', categroy: '病假', leave: '生理假', introduce: '同半薪病假', attachment: 0, basedate: 0, leftday: 1.5},
    {leaveid: '5', categroy: '病假', leave: '無薪病假', introduce: '一年之30日半薪病假用畢時方可使用', attachment: 1, basedate: 0, leftday: 0.5},
    {leaveid: '8', categroy: '事假', leave: '事假', introduce: '一年有14天日的事假', attachment: 0, basedate: 0, leftday: 0.5},
    {leaveid: '24', categroy: '事假', leave: '家庭照顧假', introduce: '同事假，全年以7日爲限，併入事假計算', attachment: 0, basedate: 0, leftday: 1},
    {leaveid: '31', categroy: '事假', leave: '特別事假', introduce: '當一年之14日事假用畢時方可申請使用', attachment: 1, basedate: 0, leftday: 2},
    {leaveid: '19', categroy: '婚假', leave: '婚假', introduce: '可分開請，結婚生效日前30日及後90日內請畢，基準日爲結婚登記日', attachment: 1, basedate: 1, leftday: 5},
    {leaveid: '21', categroy: '婚假', leave: '訂婚假', introduce: '訂婚當日及其前後兩日之五日內請畢', attachment: 0, basedate: 1, leftday: 1.5},
    {leaveid: '38', categroy: '喪假', leave: '3天喪假', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 0},
    {leaveid: '37', categroy: '喪假', leave: '6天喪假', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 0},
    {leaveid: '36', categroy: '喪假', leave: '8天喪假', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 1},
    {leaveid: '25', categroy: '產假', leave: '有薪產檢假', introduce: '以懷孕日爲基準，請假以小時爲最小單位', attachment: 1, basedate: 1, leftday: 1.5},
    {leaveid: '9', categroy: '產假', leave: '產假', introduce: '不得分開請假，應與子女出生前後一星期內辦理請假手續', attachment: 1, basedate: 1, leftday: 10},
    {leaveid: '19', categroy: '產假', leave: '半薪產假', introduce: '到職未滿六個月以上者，以半薪計算', attachment: 1, basedate: 1, leftday: 0.5},
    {leaveid: '39', categroy: '陪產假', leave: '陪產假', introduce: '分娩當日及其前後十五日，擇其中五日請假', attachment: 1, basedate: 1, leftday: 2.5},
    {leaveid: '32', categroy: '流產假', leave: '流產假（3-6個月）', introduce: '同產假', attachment: 1, basedate: 1, leftday: 0.5},
    {leaveid: '33', categroy: '流產假', leave: '半薪流產假（3-6個月）', introduce: '到職未滿六個月以上者，以半薪計算', attachment: 1, basedate: 1, leftday: 0},
    {leaveid: '40', categroy: '流產假', leave: '流產假（2-3個月）', introduce: '不給薪', attachment: 1, basedate: 1, leftday: 0.5},
    {leaveid: '35', categroy: '流產假', leave: '流產假（未滿2個月）', introduce: '不給薪', attachment: 1, basedate: 1, leftday: 1},
    {leaveid: '13', categroy: '公傷假', leave: '半薪公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: 1, basedate: 1, leftday: 2},
    {leaveid: '14', categroy: '公傷假', leave: '公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: 1, basedate: 1, leftday: 0.5},
    {leaveid: '20', categroy: '公假', leave: '公假', introduce: '因政府之召集、集會、選舉等履行其國民權利義務時', attachment: 1, basedate: 0, leftday: 0},
    {leaveid: '7', categroy: '曠職', leave: '曠職', introduce: '', attachment: 0, basedate: 0, leftday: 0},
    {leaveid: '777', categroy: '志工假', leave: '志工假', introduce: '每年給予一天', attachment: 1, basedate: 0, leftday: 1},
    {leaveid: '778', categroy: '派外探親假', leave: '派外探親假', introduce: '派外探親假，僅適用派外同仁申請', attachment: 0, basedate: 0, leftday: 1.5},
    {leaveid: '779', categroy: '派外急難假', leave: '派外急難假', introduce: '派外...重病或死亡，由Level 2以上主管核定急難假的天數', attachment: 0, basedate: 0, leftday: 0.5},
    {leaveid: '42', categroy: '民族祭典假', leave: '民族祭典假', introduce: '原住民依據族別不同，有不同的祭典日可請一日', attachment: 1, basedate: 1, leftday: 0.5}
];

var baseDayList = ['2017-02-02', '2017-06-02'];

var allLeaveCategroyStr = langStr["str_122"];    //所有類別
var pleaseSelectStr = langStr["str_069"];    //請選擇
var leftStr = langStr["str_124"];    //剩餘
var dayStr = langStr["str_071"];    //天
var canApplyStr = langStr["str_125"];    //可申請
var otherBasedayStr = langStr["str_141"];    //選擇其他基準日
var selectBasedayStr = langStr["str_127"];    //選擇時間
var viewLeaveSubmitInit = false;
var categroyList = [];
var selectCategroy;
var leaveObj = {};
var leaveDetail = {};
var leaveSelected = false;
var agentName;
var startLeaveDate,endLeaveDate,startLeaveDay,endLeaveDay,startLeaveTime,endLeaveTime;
var basedayList = false;
var baseday;
var otherBaseVal,newBaseVal;
var leftdayMsg;
var needBaseday = false;
var selectBaseday = false;
var selectDatetime = false;
var leaveReason;
var leaveSubmitPreview = false;

var categroyData = {
    id: "categroy-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveData = {
    id: "leave-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveAgentData = {
    id: "leave-agent-popup",
    option: [],
    title: '<input type="search" id="searchAgent" />',
    defaultText: langStr["str_069"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var baseData = {
    id: "basedate-popup",
    option: [],
    title: "",
    defaultText: langStr["str_127"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var startData = {
    id: "startday-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var endData = {
    id: "endday-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

//檢查是否符合預覽送簽標準
function checkLeaveBeforePreview() {
    //必須符合3個條件：1.請假理由不能爲空 2.開始時間不能爲“請選擇” 3.結束時間不能爲“請選擇”
    if($("#leaveReason").val() !== ""
        && $("#leave-agent-popup option").text() !== pleaseSelectStr
        && $('#startText').text() !== pleaseSelectStr 
        && $('#endText').text() !== pleaseSelectStr 
        && $("#leave-popup option").text() !== pleaseSelectStr) {
        //判斷基準日是否選擇
        if(needBaseday == true) {
            if($("#chooseBaseday").text() == selectBasedayStr) {
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
    if(selectCategroy === allLeaveCategroyStr) {
        for(var i in LeaveObjList) {
            var obj = {};
            obj["leaveid"] = LeaveObjList[i]["leaveid"];
            obj["name"] = LeaveObjList[i]["name"];
            leaveList.push(obj);
        }
    } else {
        for(var i in LeaveObjList) {
            if(selectCategroy === LeaveObjList[i]["category"]) {
                var obj = {};
                obj["leaveid"] = LeaveObjList[i]["leaveid"];
                obj["name"] = LeaveObjList[i]["name"];
                leaveList.push(obj);
            }
        }   
    }

    for(var i in leaveList) {
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
    $("#chooseBaseday").text(selectBasedayStr);
    leaveid = "";
    leaveType = "";
    basedayList = false;
}


$("#viewLeaveSubmit").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        //檢查基準提是否已選擇
        function checkBasedaySelected() {
            var self = $("#chooseBaseday").text();

            if(self === selectBasedayStr) {
                return false;
            }else {
                return true;
            } 
        }

        //查询某假别正在使用的有效基准日——<LayoutHeader><EmpNo>0409132</EmpNo><leaveid>3010</leaveid></LayoutHeader>
        window.QueryDatumDates = function() {
            
            this.successCallback = function(data) {
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var dateArr = $("date", htmlDoc);

                    //length大于0则有有效基准日列表，获取即可
                    if(dateArr.length == 0) {
                        basedayList = false;
                    } else {
                        var basedayHtml = "";
                        for(var i = 0; i < dateArr.length; i ++) {
                            basedayHtml += '<div class="tpl-option-msg-list">' + dateFormat($(dateArr[i]).html()) + '</div>';
                        }
                        $(".old-baseday-list").empty().append(basedayHtml);
                        $(".old-baseday-list").append('<div class="tpl-option-msg-list">選擇其他基準日</div>');

                        basedayList = true;
                    }
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryDatumDates", self.successCallback, self.failCallback, QueryDatumDatesQueryData, "");
            }();
        };
        

        /********************************** page event *************************************/
        $("#viewLeaveSubmit").on("pagebeforeshow", function(event, ui) {
            //申請日期和預覽申請日期，都是实际當天日期
            $('#applyDay').text(applyDay);
            $('#previewApplyDay').text(applyDay);
            //选择日期为“请选择”
            $("#startText").text(pleaseSelectStr);
            $("#endText").text(pleaseSelectStr);
            //getAllCategroyList();
        });

        $("#viewLeaveSubmit").on("pageshow", function(event, ui) {

            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveSubmit").keypress(function(event) {

        });

        //選擇類別——select change
        $(document).on("change", "#categroy-popup", function() {
            //selectCategroy = $.trim($(this).text()); 
            selectCategroy = $(this).val();
            //console.log(selectCategroy)
            getLeaveByCategory();
            checkLeaveBeforePreview();
        });

        //获取所选的假别信息——select change
        $(document).on("change", "#leave-popup", function() {
            leaveid = $(this).val();
            leaveType = $(this).text();
            leaveSelected = true;
            console.log("leaveid:"+leaveid);
        });

        //點擊假別彈框關閉以後判斷是否可以預覽送簽
        $(document).on("popupafterclose", "#leave-popup-option", function() {
            if(leaveSelected) {
                for(var i in LeaveObjList) {
                    if(leaveid == LeaveObjList[i]["leaveid"]) {
                        leaveDetail = LeaveObjList[i];
                        
                        //不需要基准日回传剩余天数，需要基准日回传有效基准日列表
                        queryLeftDaysData = "<LayoutHeader><EmpNo>" +
                                            myEmpNo +
                                            "</EmpNo><leaveid>" +
                                            leaveid +
                                            "</leaveid></LayoutHeader>";

                        QueryLeftDaysData(leaveid);

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
            if(searchData[0] != "") {
                 searchName = searchData[0];
            }else {
                searchEmpNo = $("#searchAgent").val();
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

                $("#loaderQuery").show();
                $("#leave-agent-popup-option-list").hide();
            }, 2000);
            if(e.which == 13) {
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
            if(basedayList) {
                popupMsgInit('.basedayList');
            }else {
                //datetime-local
                if(device.platform === "iOS") {
                    $("#newBaseday").trigger("focus");
                }else if(device.platform === "Android") {
                    $("#newBaseday").trigger("click");
                }
            }
        });

        //新基準日選擇——datetime change
        $(document).on("change", "#newBaseday", function() {
            baseday = $(this).val();

            if(baseday === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            }else {
                $("#chooseBaseday").text(baseday);
            }

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
            if(self === otherBasedayStr) {
                if(device.platform === "iOS") {
                    $("#oldBaseday").trigger("focus");
                }else if(device.platform === "Android") {
                    $("#oldBaseday").trigger("click");
                }
            }else {
                baseday = self;
                $("#chooseBaseday").text(self);
            }

            checkLeaveBeforePreview();
        });

        //無有效基準日選擇——datetime change
        $(document).on("change", "#oldBaseday", function() {
            baseday = $(this).val();

            if(baseday === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            }else {
                $("#chooseBaseday").text(baseday);
            }

            checkLeaveBeforePreview();
        });

        //關閉有效基準日列表——popup close
        $("#closeBasedayList").on("click", function() {
            $(".basedayList").popup("close");

        });

        //點擊開始日期
        $(document).on("click", "#btnStartday", function() {
            //選擇開始日期之前判斷假別是否選擇
            if(leaveid === "") {
                popupMsgInit('.categroyFirst');
            }else {
                //再判斷是否需要基準日
                if(needBaseday){
                    selectBaseday = checkBasedaySelected();

                    //再判斷是否選擇基準日
                    if(selectBaseday) {
                        if(device.platform === "iOS") {
                            $("#startDate").trigger("focus");
                        }else if(device.platform === "Android") {
                            $("#startDate").trigger("click");
                        }

                    }else {
                        popupMsgInit('.basedayFirst');
                    }
                }else {
                    if(device.platform === "iOS") {
                        $("#startDate").trigger("focus");
                    }else if(device.platform === "Android") {
                        $("#startDate").trigger("click");
                    }

                }
            }
        });

        //開始日期控件关闭后，让其失去焦点
        $("#startDate").on("change", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            startLeaveDate = "";
            startLeaveDay = 0;
            startLeaveTime = 0;  

            //開始時間是否爲空
            if(self !== "") {
                //android上日期格式:yyyy-MM-dd T hh:mm，ios上日期格式：yyyy-MM-dd T hh:mm:ss
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if(minute < 30) {
                    startLeaveDate = self.replace("T", " ").substring(0, 14) + "00";
                } else {
                    startLeaveDate = self.replace("T", " ").substring(0, 14) + "30";
                }

                startLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                startLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                //开始时间不需要判断是否小于结束时间，只在选择结束时间时判断是否大于开始时间即可
                //唯一可能需要判断的地方是时间是否小于“2017-12-31”

                $('#startText').text(startLeaveDate);
            }else {
                $('#startText').text(pleaseSelectStr);
            }

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();

        });

        //點擊結束日期——datetime
        $(document).on("click", "#btnEndday", function() {           
            //点击“结束时间”只需要判断“开始时间”是否选择
            if($("#startText").text() == pleaseSelectStr) {
                popupMsgInit('.startdayFirst');
            } else {
                if(device.platform === "iOS") {
                    $("#endDate").trigger("focus");
                }else if(device.platform === "Android") {
                    $("#endDate").trigger("click");
                }
            }

        });

        //結束日期改變
        $(document).on("change", "#endDate", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            endLeaveDate = "";
            endLeaveDay = 0;
            endLeaveTime = 0;         

            //結束時間是否爲空
            if(self !== "") {
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if(minute < 30) {
                    endLeaveDate = self.replace("T", " ").substring(0, 14) + "00";
                } else {
                    endLeaveDate = self.replace("T", " ").substring(0, 14) + "30";
                }

                endLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                endLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                //結束時間必須大於開始時間
                if(startLeaveDay > endLeaveDay || (startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime)) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(pleaseSelectStr);
                } else {
                    popupMsgInit('.leftDaysByLeave');
                    $('#endText').text(endLeaveDate);

                }

            } else {
                $('#endText').text(pleaseSelectStr);
            }

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
            
        });

        //實時獲取多行文本值
        $(document).on("keyup", "#leaveReason", function() {
            leaveReason = $(this).val();

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });
        
        //清除請假申請
        $("#emptyLeaveForm").on("click", function() {
            //申請日期
            $('#applyDay').text(applyDay);

            //類別
            $.each($("#categroy-popup-option-list li"), function(i, item) {
                if($(item).text() === allLeaveCategroyStr) {
                    $(item).trigger("click");
                    return false;
                }
            });

            //假別
            getLeaveByCategory();

            //代理人
            var agentOption = '<option hidden>' + pleaseSelectStr + '</option>';
            $("#leave-agent-popup").find("option").remove().end().append(agentOption);
            tplJS.reSizeDropdownList("leave-agent-popup", "typeB");

            //開始時間
            $("#startText").text(pleaseSelectStr);
            $("#startDate").val("");

            //結束時間
            $("#endText").text(pleaseSelectStr);
            $("#endDate").val("");

            //請假理由
            $("#leaveReason").val("");

            //基準日
            $("#chooseBaseday").text(selectBasedayStr);
        });

        //預覽送簽按鈕
        $("#previewBtn").on("click", function() {
            if($('#previewBtn').hasClass('leavePreview-active-btn')) {
                //傳值到預覽頁面
                $("#applyCategroy").text(leaveObj["categroy"]);
                $("#applyLeave").text(leaveType);
                $("#applyAgent").text(agentName);
                $("#applyStartday").text(startLeaveDate);
                $("#applyEndday").text(endLeaveDate);
                $("#applyReason").text(leaveReason);

                $('.apply-container').hide();
                $('.leaveMenu').hide();
                $('.apply-preview').show();
                $('#backMain').show();  
            }
        });

        //返回編輯按鈕
        $("#backMain").on("click", function() {
            $('.apply-container').show();
            $('.leaveMenu').show();
            $('.apply-preview').hide();
            $('#backMain').hide();      
                   
            return false;
        });

        //立即預約，假單送簽，跳轉到假單茶村頁
        $("#applyBtn").on("click", function() {
            $("#backMain").click();
            changePageByPanel("viewLeaveQuery");
            $("#sendLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });
    }
});