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
    {id: '12', categroy: '婚嫁', leave: '婚嫁', introduce: '可分開請，結婚生效日前30日及後90日內請畢，基準日爲結婚登記日', attachment: 1, basedate: 1, leftday: 5},
    {id: '13', categroy: '婚嫁', leave: '訂婚假', introduce: '訂婚當日及其前後兩日之五日內請畢', attachment: 0, basedate: 1, leftday: 1.5},
    {id: '14', categroy: '喪家', leave: '3天喪家', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 0},
    {id: '15', categroy: '喪家', leave: '6天喪家', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 0},
    {id: '16', categroy: '喪家', leave: '8天喪家', introduce: '可分開請，但須與100日內請畢', attachment: 1, basedate: 1, leftday: 1},
    {id: '17', categroy: '產假', leave: '有薪產檢假', introduce: '以懷孕日爲基準，請假以小時爲最小單位', attachment: 1, basedate: 1, leftday: 1.5},
    {id: '18', categroy: '產假', leave: '產假', introduce: '不得分開請假，應與子女出生前後一星期內辦理請假手續', attachment: 1, basedate: 1, leftday: 0},
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

var departmentMemberList = [
    {id: 'ABC10', name: 'Jack Wang', no: '1705063'},
    {id: 'ABC10', name: 'Jane Xu', no: '1340261'},
    {id: 'ABC11', name: 'Jerry Chen', no: '1278973'},
    {id: 'ABC11', name: 'Sunny Lee', no: '1462850'},
    {id: 'ABC12', name: 'Darren Ben', no: '1596874'},
    {id: 'ABC12', name: 'Andy Liu', no: '1510627'},
    {id: 'ABC13', name: 'Jay Zhou', no: '1663498'},
    {id: 'ABC13', name: 'Mini Yang', no: '1725864'},
    {id: 'ABC14', name: 'Back Wu', no: '1631145'},
    {id: 'ABC14', name: 'Eirc Zhao', no: '1564681'}
];

var baseDayList = ['2017-02-02', '2017-06-02'];

var allLeaveCategroyStr = langStr["str_122"];    //所有類別
var pleaseSelectStr = langStr["str_069"];    //請選擇
var leftStr = langStr["str_124"];    //剩餘
var dayStr = langStr["str_071"];    //天
var canApplyStr = langStr["str_125"];    //可申請
var otherBasedayStr = langStr["str_141"];    //選擇其他基準日
var selectBasedayStr = langStr["str_127"];    //選擇時間
var basedayStr = "selectOtherBaseday";
var viewLeaveSubmitInit = false;
var categroyList = [];
var selectCategroy;
var LeaveList = [];
var selectLeave;
var leaveObj = {};
var leaveState = false;
var startLeaveDate,endLeaveDate,startLeaveDay,endLeaveDay,startLeaveTime,endLeaveTime;
var basedayState;
var otherBaseVal,newBaseVal;
var leftdayMsg;
var needBaseday = false;
var selectBaseday = false;
var datetimeState = false;
var leaveReason;
var leaveSubmitPreview = false;
var count = 0;

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
        function checkBaseday(leave) {
            if(leave == "婚嫁" || leave == "產假") {
                return true;
            }else {
                return false;
            }
        }

        //获取基准日列表——並新增 “選擇其他基準日” 選項
        function getBasedayByLeave() {    
            baseData["option"] = [];
            $("#baseTime").empty();
            $("#basedate-popup-option-popup").remove();
            $("#basedate-popup-option-list #otherBasedate").remove();

            for(var i in baseDayList) {
                baseData["option"][i] = {};
                baseData["option"][i]["value"] = baseDayList[i];
                baseData["option"][i]["text"] = baseDayList[i];
            }

            tplJS.DropdownList("viewLeaveSubmit", "baseTime", "prepend", "typeB", baseData);

            var otherBasedayList = "<li class='tpl-option-msg-list' id='otherBasedate'>" + otherBasedayStr + "</li>";
            $("#basedate-popup-option-list").append(otherBasedayList);

        }
        

        /********************************** page event *************************************/
        $("#viewLeaveSubmit").on("pagebeforeshow", function(event, ui) {
            if(!viewLeaveSubmitInit){
                $('#applyDay').text(applyDay);
                $('#previewApplyDay').text(applyDay);
                getAllLeaveCategroy();

                if(lastPageID === "viewPersonalLeave") {
                    tplJS.DropdownList("viewLeaveSubmit", "leaveAgent", "prepend", "typeB", leaveAgentData);
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
        });

        //點擊假別——獲取假別對象詳細信息——list click
        $(document).on("click", "#leave-popup-option ul li", function() {
            selectLeave = $(this).text();
            leaveObj = getLeaveObj();
            leaveState = true;

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
                    popupMsgInit('.leftDaysByLeave');                    
        
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
                        basedayState = checkBaseday(selectLeave);
                        getBasedayByLeave();

                        //true表示有已經生效的基準日，可以從已有當中選擇
                        if(basedayState) {
                            $('#baseTime').show();
                            $('#noBaseTime').hide();
                        
                        //false表示沒有已經生效的基準日，需要新增基準日
                        }else {
                            $('#noBaseTime').show();
                            $('#baseTime').hide();
                        }
                        
                        needBaseday = true;
                    }else {
                        $('#baseDate').hide();
                        $('#divEmpty').hide();

                        needBaseday = false;
                    }
                    
                }else {
                    getLeaveByCategroy();
                    $(document).off("change", "#leave-popup");  
                    popupMsgInit('.leaveNotEnough');
                    
                }
            }, 100);
            
        });

        //點擊“選擇其他基準日”——click
        $(document).on("click", "#otherBasedate", function() {
            $("#basedate-popup").on("change", function(e) {
                e.preventDefault();
            });

            // if(device.platform === "iOS") {
            //     $("#oldBaseday").trigger("focus");
            // }else if(device.platform === "Android") {
            //     $("#oldBaseday").trigger("click");
            // }
        });

        //從list選擇已有基準日——popup change
        $(document).on("change", "#basedate-popup", function() {
            selectBaseday = true;
        });

        //其他基準日控件——input change
        $(document).on("change", "#oldBaseday", function() {
            var self = $(this).val();
            
            //日期值要判斷是否爲空
            if(self !== "") {
                //值不爲空則顯示在option當中
                var newOption = "<option hidden>" + self + "</option>";
                $("#basedate-popup").find("option").remove().end().append(newOption);

            }else {
                //值爲空則顯示“選擇時間”
                var newOption = "<option hidden>" + selectBasedayStr + "</option>";
                $("#basedate-popup").find("option").remove().end().append(newOption);

            }

            tplJS.reSizeDropdownList("basedate-popup", "typeB");

        });

        //選擇新基準日——click btn
        $(document).on("click", "#noBaseTime", function() {
            if(device.platform === "iOS") {
                $("#newBaseday").trigger("focus");
            }else if(device.platform === "Android") {
                $("#newBaseday").trigger("click");
            }
        });

        //直接基準日控件——input change
        $(document).on("change", "#newBaseday", function() {
            newBaseVal = $(this).val();
            if(newBaseVal !== "") {
                selectBaseday = true;
            }
            $("#noBaseTime").find("span").text(newBaseVal);
        });

        //點擊開始日期
        $(document).on("click", "#btnStartday", function() {
            //選擇開始日期之前判斷假別是否選擇
            if(selectLeave == undefined  || selectLeave == "請選擇") {
                popupMsgInit('.categroyFirst');
            }else {
                //再判斷是否需要基準日
                if(needBaseday){
                    //再判斷是否選擇基準日
                    if(selectBaseday) {
                        if(device.platform === "iOS") {
                            $("#startDate").focus();
                        }else if(device.platform === "Android") {
                            $("#startDate").click();
                        } 
                    }else {
                        popupMsgInit('.basedayFirst');
                    }
                }else {
                    if(device.platform === "iOS") {
                        $("#startDate").focus();
                    }else if(device.platform === "Android") {
                        $("#startDate").click();
                    }            
                }
            }
        });

        //點擊結束日期
        $(document).on("click", "#btnEndday", function() {
            //選擇結束日期之前判斷假別是否選擇
            if(selectLeave == undefined || selectLeave == "請選擇") {
                popupMsgInit('.categroyFirst');
            }else {
                //再判斷是否需要基準日
                if(needBaseday){
                    //再判斷是否選擇基準日
                    if(selectBaseday) {
                        if(device.platform === "iOS") {
                            $("#endDate").focus();
                        }else if(device.platform === "Android") {
                            $("#endDate").click();
                        }
                    }else {
                        popupMsgInit('.basedayFirst');
                    }
                }else {
                    if(device.platform === "iOS") {
                        $("#endDate").focus();
                    }else if(device.platform === "Android") {
                        $("#endDate").click();
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
            //開始時間是否被清空
            if(self !== "") {
                startLeaveDate = self.replace("T", " ").substring(0, 16);
                startLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                startLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                $('#startText').text(startLeaveDate);
                
                //結束時間必須大於開始時間
                if(startLeaveDay > endLeaveDay) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#startText').text(pleaseSelectStr);
                }else if(startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#startText').text(pleaseSelectStr);
                }else {
                    $('.leftDaysByLeave').find('.header-text').html(leftdayMsg);
                    //popupMsgInit('.leftDaysByLeave');
                }
            }else {  
                $('#startText').text(pleaseSelectStr); 
            }

            //展現請假統計
            if(startLeaveDate !== "" && endLeaveDate !== "" & startLeaveDate !== "請選擇" && endLeaveDate !== "請選擇") {
                datetimeState = true;
            }else {
                datetimeState = false;
            }
            
        });

        //結束日期改變
        $(document).on("change", "#endDate", function() {
            endLeaveDate = "";
            endLeaveDay = 0;
            endLeaveTime = 0;

            var self = $(this).val();
            if(self !== "") {
                endLeaveDate = self.replace("T", " ").substring(0, 16);
                endLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                endLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                $('#endText').text(endLeaveDate);

                //結束時間必須大於開始時間
                if(startLeaveDay > endLeaveDay) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(pleaseSelectStr); 
                }else if(startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(pleaseSelectStr); 
                }else {
                    $('.leftDaysByLeave').find('.header-text').html(leftdayMsg);
                    //popupMsgInit('.leftDaysByLeave');
                }
            }else {
                $('#endText').text(pleaseSelectStr); 
            }

            //展現請假統計
            if(startLeaveDate !== "" && endLeaveDate !== "" & startLeaveDate !== "請選擇" && endLeaveDate !== "請選擇") {
                datetimeState = true;
            }else {
                datetimeState = false;
            }
            
        });

        //有有效基準日選擇——有問題
        $(document).on("change", "#oldBaseday", function() {
            otherBaseVal = $(this).val();
            if(otherBaseVal !== "") {
                selectBaseday = true;
            }
            $('#basedate-popup').find("option[value='undefined']").text(otherBaseVal);
        });       

        //實時獲取多行文本值
        $(document).on("keyup", "#leaveReason", function() {
            leaveReason = $(this).val();
            //console.log(leaveReason);

            if(leaveReason !== "" && datetimeState == true) {
                $('#previewBtn').addClass('leavePreview-active-btn');

            }else {
                $('#previewBtn').removeClass('leavePreview-active-btn');
                
            }
        });
        
        //預覽送簽按鈕
        $(document).on("click", "#previewBtn", function() {
            if($('#previewBtn').hasClass('leavePreview-active-btn')) {
                $('.apply-container').hide();
                $('.leaveMenu').hide();
                $('.apply-preview').show();
                //$('.ui-title').find("span").text(langStr["str_130"]);  
                $('#backMain').show();
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

        //立即預約，假單送簽
        $("#applyBtn").on("click", function() {
            //$("#backMain").tigger("click");
            $("#backMain").click();
            changePageByPanel("viewLeaveQuery");
            $("#sendLeaveMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
        });
    }
});