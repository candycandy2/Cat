var leaveAllData = [
    {id: '1', categroy: '本期特休', leave: '本期特休', introduce: '依照同仁年資天數計算', attachment: 0, basedate: 0, leftday: 5},
    {id: '2', categroy: '去年特休', leave: '去年特休', introduce: '使用期限到2017/12/31止', attachment: 0, basedate: 0, leftday: 0.5},
    {id: '3', categroy: '去年彈休', leave: '去年彈休', introduce: '使用期限到2017/12/31止', attachment: 0, basedate: 0, leftday: 1},
    {id: '4', categroy: '預支特休', leave: '預支特休', introduce: '7天/年，於發放下期特休或離職時回扣', attachment: 0, basedate: 0, leftday: 0},
    {id: '5', categroy: '病假', leave: '三天病假', introduce: '超過三日以上，須檢附醫師證明方可請假，扣薪條件如半薪病假', attachment: 1, basedate: 0, leftday: 0.5},
    {id: '6', categroy: '病假', leave: '半薪病假', introduce: '一年有30天日的半薪病假', attachment: 0, basedate: 0, leftday: 2},
    {id: '7', categroy: '病假', leave: '生理假', introduce: '同半薪病假', attachment: 0, basedate: 0, leftday: 1.5},
    {id: '8', categroy: '病假', leave: '無薪病假', introduce: '一年之30日半薪病假用畢時方可使用', attachment: 1, basedate: 0, leftday: 0.5},
    {id: '9', categroy: '事假', leave: '事假', introduce: '一年有14天日的事假', attachment: 0, basedate: 0, leftday: 0.5},
    {id: '10', categroy: '事假', leave: '家庭照顧假', introduce: '同事假，全年以7日爲限，併入事假計算', attachment: 0, basedate: 0, leftday: 1},
    {id: '11', categroy: '事假', leave: '特別事假', introduce: '當一年之14日事假用畢時方可申請使用', attachment: 1, basedate: 0, leftday: 2},
    {id: '12', categroy: '婚假', leave: '婚假', introduce: '可分開請，結婚生效日前30日及後90日內請畢，基準日爲結婚登記日', attachment: 1, basedate: 1, leftday: 5},
    {id: '13', categroy: '婚假', leave: '訂婚假', introduce: '訂婚當日及其前後兩日之五日內請畢', attachment: 0, basedate: 1, leftday: 1.5},
    {id: '14', categroy: '喪假', leave: '3天喪假', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 0},
    {id: '15', categroy: '喪假', leave: '6天喪假', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 0},
    {id: '16', categroy: '喪假', leave: '8天喪假', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 1},
    {id: '17', categroy: '產假', leave: '有薪產檢假', introduce: '以懷孕日爲基準，請假以小時爲最小單位', attachment: 1, basedate: 1, leftday: 1.5},
    {id: '18', categroy: '產假', leave: '產假', introduce: '不得分開請假，應與子女出生前後一星期內辦理請假手續', attachment: 1, basedate: 1, leftday: 10},
    {id: '19', categroy: '產假', leave: '半薪產假', introduce: '到職未滿六個月以上者，以半薪計算', attachment: 1, basedate: 1, leftday: 0.5},
    {id: '20', categroy: '陪產假', leave: '陪產假', introduce: '分娩當日及其前後十五日，擇其中五日請假', attachment: 1, basedate: 1, leftday: 2.5},
    {id: '21', categroy: '流產假', leave: '流產假（3-6個月）', introduce: '同產假', attachment: 1, basedate: 1, leftday: 0.5},
    {id: '22', categroy: '流產假', leave: '半薪流產假（3-6個月）', introduce: '到職未滿六個月以上者，以半薪計算', attachment: 1, basedate: 1, leftday: 0},
    {id: '23', categroy: '流產假', leave: '流產假（2-3個月）', introduce: '不給薪', attachment: 1, basedate: 1, leftday: 0.5},
    {id: '24', categroy: '流產假', leave: '流產假（未滿2個月）', introduce: '不給薪', attachment: 1, basedate: 1, leftday: 1},
    {id: '25', categroy: '公傷假', leave: '半薪公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: 1, basedate: 1, leftday: 2},
    {id: '26', categroy: '公傷假', leave: '公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: 1, basedate: 1, leftday: 0.5},
    {id: '27', categroy: '公假', leave: '公假', introduce: '因政府之召集、集會、選舉等履行其國民權利義務時', attachment: 1, basedate: 0, leftday: 0},
    {id: '28', categroy: '曠職', leave: '曠職', introduce: '', attachment: 0, basedate: 0, leftday: 0},
    {id: '29', categroy: '志工假', leave: '志工假', introduce: '每年給予一天', attachment: 1, basedate: 0, leftday: 1},
    {id: '30', categroy: '派外探親假', leave: '派外探親假', introduce: '派外探親假，僅適用派外同仁申請', attachment: 0, basedate: 0, leftday: 1.5},
    {id: '31', categroy: '派外急難假', leave: '派外急難假', introduce: '派外...重病或死亡，由Level 2以上主管核定急難假的天數', attachment: 0, basedate: 0, leftday: 0.5},
    {id: '32', categroy: '民族祭典假', leave: '民族祭典假', introduce: '原住民依據族別不同，有不同的祭典日可請一日', attachment: 1, basedate: 1, leftday: 0.5}
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
var LeaveList = [];
var selectLeave = "";
var leaveObj = {};
var leaveState = false;
var agentName;
var startLeaveDate,endLeaveDate,startLeaveDay,endLeaveDay,startLeaveTime,endLeaveTime;
var basedayState = null;
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

$("#viewLeaveSubmit").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        //获取所有类别
        function getAllLeaveCategroy() {
            categroyList = [];

            //循環所有類別，並去重
            for(var i in leaveAllData) {
                if (categroyList.indexOf(leaveAllData[i]["categroy"]) === -1) {
                    categroyList.push(leaveAllData[i]["categroy"]);
                } 
            }
            
            //單獨添加 “所有類別” 到列表當中
            categroyList.unshift(allLeaveCategroyStr);

            for(var i in categroyList) {
                categroyData["option"][i] = {};
                categroyData["option"][i]["value"] = categroyList[i];
                categroyData["option"][i]["text"] = categroyList[i];
            }

            //生成dropdownlist
            tplJS.DropdownList("viewLeaveSubmit", "leaveCategroy", "prepend", "typeB", categroyData);
            
            //默認選中 “所有類別”
            $.each($("#categroy-popup-option-list li"), function(i, item) {
                if($(item).text() === allLeaveCategroyStr) {
                    $(item).trigger("click");
                    return false;
                }
            });
        }

        //根據類別篩選假別
        function getLeaveByCategroy() {
            leaveList = [];
            leaveData["option"] = [];
            $("#leaveGenre").empty();
            $("#leave-popup-option-popup").remove();

            //判斷類別是所有還是其他
            if(selectCategroy === allLeaveCategroyStr) {
                for(var i in leaveAllData) {
                    leaveList.push(leaveAllData[i]["leave"]);
                }
            }else {
                for(var i in leaveAllData) {
                    if(selectCategroy === leaveAllData[i]["categroy"]) {
                        leaveList.push(leaveAllData[i]["leave"]);
                    }              
                }
            }

            for(var i in leaveList) {
                leaveData["option"][i] = {};
                leaveData["option"][i]["value"] = leaveList[i];
                leaveData["option"][i]["text"] = leaveList[i];    
            }

            tplJS.DropdownList("viewLeaveSubmit", "leaveGenre", "prepend", "typeB", leaveData);

            //假別一旦更改，除了類別的其他選項都需要恢復初始狀態
            $('#leaveIntroduce').empty().hide();
            $('#baseDate').hide();
            $('#uploadAttachment').hide();
            $('#divEmpty').hide();
            $("#chooseBaseday").text(selectBasedayStr);
            selectLeave = "";
            //agentName = "";
            basedayState = null;
        }

        //获取本部门员工——查找代理人
        function getDepartmentMember() {
            var agentList = "";
            var agentNotExist = false;
            for(var i in departmentMemberList) {
                leaveAgentData["option"][i] = {};
                leaveAgentData["option"][i]["value"] = departmentMemberList[i]['id'];
                leaveAgentData["option"][i]["text"] = departmentMemberList[i]['name'];
            }

            tplJS.DropdownList("viewLeaveSubmit", "leaveAgent", "prepend", "typeB", leaveAgentData);
        }

        //根据假别获取假别对象——是否需要基准日和附件
        function getLeaveObj() {
            for(var i in leaveAllData) {
                if(selectLeave == leaveAllData[i]['leave']) {
                    return leaveAllData[i];
                }
            }
        }

        //檢查是否有已經生效的基準日
        function checkBasedayList() {
            if(selectLeave == "婚假" || selectLeave == "產假") {
                return true;
            }else {
                return false;
            }
        }

        //檢查基準提是否已選擇
        function checkBasedaySelected() {
            var self = $("#chooseBaseday").text();

            if(self === selectBasedayStr) {
                return false;
            }else {
                return true;
            } 
        }

        //檢查是否符合預覽送簽標準
        function checkLeaveBeforePreview() {
            //必須符合3個條件：1.請假理由不能爲空 2.開始時間不能爲“請選擇” 3.結束時間不能爲“請選擇”
            if($("#leaveReason").val() !== "" && $("#leave-agent-popup option").text() !== pleaseSelectStr && 
            $('#startText').text() !== pleaseSelectStr && $('#endText').text() !== pleaseSelectStr && 
            $("#leave-popup option").text() !== pleaseSelectStr) {

                $('#previewBtn').addClass('leavePreview-active-btn');
            }else {
                $('#previewBtn').removeClass('leavePreview-active-btn');
            }
        }

        /********************************** page event *************************************/
        $("#viewLeaveSubmit").on("pagebeforeshow", function(event, ui) {
            if(!viewLeaveSubmitInit){
                //申請日期和預覽申請日期，並且都是當天日期
                $('#applyDay').text(applyDay);
                $('#previewApplyDay').text(applyDay);
                getAllLeaveCategroy();

                if(lastPageID === "viewPersonalLeave") {
                    //tplJS.DropdownList("viewLeaveSubmit", "leaveAgent", "prepend", "typeB", leaveAgentData);
                }

                viewLeaveSubmitInit = true;
            }
        });

        $("#viewLeaveSubmit").on("pageshow", function(event, ui) {

            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveSubmit").keypress(function(event) {

        });

        //選擇類別——select change
        $(document).on("change", "#categroy-popup", function() {
            selectCategroy = $(this).val();
            getLeaveByCategroy();
            checkLeaveBeforePreview();
        });

        //點擊假別——獲取假別對象詳細信息——list click
        $(document).on("click", "#leave-popup-option ul li", function() {
            selectLeave = $(this).text();
            leaveObj = getLeaveObj();

            leaveState = true;

            $("#chooseBaseday").text(selectBasedayStr);
            $('#leaveIntroduce').empty().hide();

            setTimeout(function(){
                //check leftday
                if(leaveObj["leftday"] > 0) {
                    //introduce
                    var divIntroduce = "<span>*" + leaveObj["introduce"] + "</span>";
                    $('#leaveIntroduce').append(divIntroduce).show();

                    //popup——left day
                    leftdayMsg = leftStr + leaveObj["leftday"] + dayStr + leaveObj["leave"] + canApplyStr;
                    $('.leftDaysByLeave').find('.header-text').html(leftdayMsg);

                    //attachment
                    if(leaveObj["attachment"] === 1) {
                        $('#uploadAttachment').show();
                    }else {
                        $('#uploadAttachment').hide();
                    }

                    //basedate
                    if(leaveObj["basedate"] === 1) {
                        $('#baseDate').show();
                        $('#divEmpty').show();

                        //檢查是否有已經生效的基準日
                        basedayState = checkBasedayList();

                        needBaseday = true;
                    }else {
                        $('#baseDate').hide();
                        $('#divEmpty').hide();

                        needBaseday = false;
                    }

                }else {
                    popupMsgInit('.leaveNotEnough');
                    getLeaveByCategroy();
                }
            }, 50);
        });

        //點擊假別彈框關閉以後判斷是否可以預覽送簽
        $(document).on("popupafterclose", "#leave-popup-option", function() {
            checkLeaveBeforePreview();
        });

        //搜索代理人
        $(document).on("keyup", "#searchAgent", function(e) {
            if ($("#searchAgent").val().length == 0) {
                $(".queryLoader").hide();
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

                $(".queryLoader").show();
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
            console.log(agentName);
        });

        //代理人列表
        $(document).on("popupafteropen", "#leave-agent-popup-option", function() {
            $("#searchAgent").val("");
            $("#leave-agent-popup-option-list").empty();

            if ($(".queryLoader").length <= 0) {
                $("#leave-agent-popup-option-popup .ui-content").append('<img class="queryLoader" src="img/query-loader.gif">');
            } else {
                $(".queryLoader").hide();
            }
        });

        //選擇基準日，根據是否有有效基準日操作——click
        $("#selectBaseday").on("click", function() {
            if(basedayState) {
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

        //其他基準日控件——datatime change
        $(document).on("change", "#oldBaseday", function() {
            var self = $(this).val();

            if(self === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            }else {
                $("#chooseBaseday").text(self);
            }

        });

        //新基準日選擇——datetime change
        $(document).on("change", "#newBaseday", function() {
            var self = $(this).val();

            if(self === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            }else {
                $("#chooseBaseday").text(self);
            }
            
        });

        //選擇有效基準日——choose basedaylist
        $(".basedayList .old-baseday-list div").on("click", function() {
            var self = $(this).text();

            $(".basedayList").popup("close");

            //如果點擊 “選擇其他基準日” ，則彈出datetime
            if(self === otherBasedayStr) {
                if(device.platform === "iOS") {
                    $("#oldBaseday").trigger("focus");
                }else if(device.platform === "Android") {
                    $("#oldBaseday").trigger("click");
                }
            }else {
                $("#chooseBaseday").text(self);
            }
        });
        
        //關閉有效基準日列表——popup close
        $("#closeBasedayList").on("click", function() {
            $(".basedayList").popup("close");
            
        });

        //無有效基準日選擇——datetime change
        $(document).on("change", "#oldBaseday", function() {
            var self = $(this).val();
            if(self === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            }else {
                $("#chooseBaseday").text(self);
            }
        });

        //點擊開始日期
        $(document).on("click", "#btnStartday", function() {
            //選擇開始日期之前判斷假別是否選擇
            if(selectLeave === "") {
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

        //開始日期改變
        $(document).on("change", "#startDate", function() {
            startLeaveDate = "";
            startLeaveDay = 0;
            startLeaveTime = 0;

            var self = $(this).val();

            //開始時間是否爲空
            if(self !== "") {
                //android上日期格式:yyyy-MM-dd T hh:mm，ios上日期格式：yyyy-MM-dd T hh:mm:ss
                startLeaveDate = self.replace("T", " ").substring(0, 16);
                startLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                startLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                //開始時間必須大於開始時間
                if(startLeaveDay > endLeaveDay || (startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime)) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#startText').text(pleaseSelectStr);
                }else {
                    $('#startText').text(startLeaveDate);

                }
            }else {
                $('#startText').text(pleaseSelectStr);
            }

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();

        });

        //點擊結束日期
        $(document).on("click", "#btnEndday", function() {
            //選擇開始日期之前判斷假別是否選擇
            if(selectLeave === "") {
                popupMsgInit('.categroyFirst');
            }else {
                //再判斷是否需要基準日
                if(needBaseday){
                    selectBaseday = checkBasedaySelected();

                    //再判斷是否選擇基準日
                    if(selectBaseday) {
                        if(device.platform === "iOS") {
                            $("#endDate").trigger("focus");
                        }else if(device.platform === "Android") {
                            $("#endDate").trigger("click");
                        }
                    }else {
                        popupMsgInit('.basedayFirst');
                    }
                }else {
                    if(device.platform === "iOS") {
                        $("#endDate").trigger("focus");
                    }else if(device.platform === "Android") {
                        $("#endDate").trigger("click");
                    }           
                }
            }

        });

        //結束日期改變
        $(document).on("change", "#endDate", function() {
            endLeaveDate = "";
            endLeaveDay = 0;
            endLeaveTime = 0;

            var self = $(this).val();

            //結束時間是否爲空
            if(self !== "") {
                endLeaveDate = self.replace("T", " ").substring(0, 16);
                endLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                endLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                //結束時間必須小於 20171231
                if(endLeaveDay <= 20171231) {
                    $('#endText').text(endLeaveDate);

                    //結束時間必須大於開始時間
                    if(startLeaveDay > endLeaveDay || (startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime)) {
                        //提示錯誤信息
                        popupMsgInit('.dateTimeError');
                        $('#endText').text(pleaseSelectStr);
                    }else {
                        popupMsgInit('.leftDaysByLeave');
                        $('#endText').text(endLeaveDate);

                    }
                }
            }else {
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
        
        //預覽送簽按鈕
        $("#previewBtn").on("click", function() {
            if($('#previewBtn').hasClass('leavePreview-active-btn')) {
                $('.apply-container').hide();
                $('.leaveMenu').hide();
                $('.apply-preview').show();
                //$('.ui-title').find("span").text(langStr["str_130"]);
                $('#backMain').show();

                //傳值到預覽頁面
                $("#applyCategroy").text(leaveObj["categroy"]);
                $("#applyLeave").text(selectLeave);
                $("#applyAgent").text(agentName);
                $("#applyStartday").text(startLeaveDate);
                $("#applyEndday").text(endLeaveDate);
                $("#applyReason").text(leaveReason);
            }
        });

        //返回編輯按鈕
        $("#backMain").on("click", function() {
            $('.apply-preview').hide();
            $('#backMain').hide();
            $('.apply-container').show();
            //$('.ui-title').find("span").text(langStr["str_002"]);
            $('.leaveMenu').show();
            
            return false;
        });

        //立即預約，假單送簽，跳轉到假單茶村頁
        $("#applyBtn").on("click", function() {
            $("#backMain").click();
            changePageByPanel("viewLeaveQuery");
            $("#sendLeaveMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
        });
    }
});