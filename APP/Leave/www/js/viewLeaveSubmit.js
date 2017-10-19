var leaveAllData = [
    {id: '1', categroy: '本期特休', leave: '本期特休', introduce: '依照同仁年資天數計算', attachment: '0', basedate: '0', leftday: 5},
    {id: '2', categroy: '去年特休', leave: '去年特休', introduce: '使用期限到2017/12/31止', attachment: '0', basedate: '0', leftday: 0.5},
    {id: '3', categroy: '去年彈休', leave: '去年彈休', introduce: '使用期限到2017/12/31止', attachment: '0', basedate: '0', leftday: 1},
    {id: '4', categroy: '預支特休', leave: '預支特休', introduce: '7天/年，於發放下期特休或離職時回扣', attachment: '0', basedate: '0', leftday: 0},
    {id: '5', categroy: '病假', leave: '三天病假', introduce: '超過三日以上，須檢附醫師證明方可請假，扣薪條件如半薪病假', attachment: '1', basedate: '0', leftday: 0.5},
    {id: '6', categroy: '病假', leave: '半薪病假', introduce: '一年有30天日的半薪病假', attachment: '0', basedate: '0', leftday: 2},
    {id: '7', categroy: '病假', leave: '生理假', introduce: '同半薪病假', attachment: '0', basedate: '0', leftday: 1.5},
    {id: '8', categroy: '病假', leave: '無薪病假', introduce: '一年之30日半薪病假用畢時方可使用', attachment: '1', basedate: '0', leftday: 0.5},
    {id: '9', categroy: '事假', leave: '事假', introduce: '一年有14天日的事假', attachment: '0', basedate: '0', leftday: 0.5},
    {id: '10', categroy: '事假', leave: '家庭照顧假', introduce: '同事假，全年以7日爲限，併入事假計算', attachment: '0', basedate: '0', leftday: 1},
    {id: '11', categroy: '事假', leave: '特別事假', introduce: '當一年之14日事假用畢時方可申請使用', attachment: '1', basedate: '0', leftday: 2},
    {id: '12', categroy: '婚嫁', leave: '婚嫁', introduce: '可分開請，結婚生效日前30日及後90日內請畢，基準日爲結婚登記日', attachment: '1', basedate: '1', leftday: 5},
    {id: '13', categroy: '婚嫁', leave: '訂婚假', introduce: '訂婚當日及其前後兩日之五日內請畢', attachment: '0', basedate: '1', leftday: 1.5},
    {id: '14', categroy: '喪家', leave: '3天喪家', introduce: '可分開請，但須與100日內請畢', attachment: '1', basedate: '1', leftday: 0},
    {id: '15', categroy: '喪家', leave: '6天喪家', introduce: '可分開請，但須與100日內請畢', attachment: '1', basedate: '1', leftday: 0},
    {id: '16', categroy: '喪家', leave: '8天喪家', introduce: '可分開請，但須與100日內請畢', attachment: '1', basedate: '1', leftday: 1},
    {id: '17', categroy: '產假', leave: '有薪產檢假', introduce: '以懷孕日爲基準，請假以小時爲最小單位', attachment: '1', basedate: '1', leftday: 1.5},
    {id: '18', categroy: '產假', leave: '產假', introduce: '不得分開請假，應與子女出生前後一星期內辦理請假手續', attachment: '1', basedate: '1', leftday: 0},
    {id: '19', categroy: '產假', leave: '半薪產假', introduce: '到職未滿六個月以上者，以半薪計算', attachment: '1', basedate: '1', leftday: 0.5},
    {id: '20', categroy: '陪產假', leave: '陪產假', introduce: '分娩當日及其前後十五日，擇其中五日請假', attachment: '1', basedate: '1', leftday: 2.5},
    {id: '21', categroy: '流產假', leave: '流產假（3-6個月）', introduce: '同產假', attachment: '1', basedate: '1', leftday: 0.5},
    {id: '22', categroy: '流產假', leave: '半薪流產假（3-6個月）', introduce: '到職未滿六個月以上者，以半薪計算', attachment: '1', basedate: '1', leftday: 0},
    {id: '23', categroy: '流產假', leave: '流產假（2-3個月）', introduce: '不給薪', attachment: '1', basedate: '1', leftday: 0.5},
    {id: '24', categroy: '流產假', leave: '流產假（未滿2個月）', introduce: '不給薪', attachment: '1', basedate: '1', leftday: 1},
    {id: '25', categroy: '公傷假', leave: '半薪公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: '1', basedate: '1', leftday: 2},
    {id: '26', categroy: '公傷假', leave: '公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: '1', basedate: '1', leftday: 0.5},
    {id: '27', categroy: '公假', leave: '公假', introduce: '因政府之召集、集會、選舉等履行其國民權利義務時', attachment: '1', basedate: '0', leftday: 0},
    {id: '28', categroy: '曠職', leave: '曠職', introduce: '', attachment: '0', basedate: '0', leftday: 0},
    {id: '29', categroy: '志工假', leave: '志工假', introduce: '每年給予一天', attachment: '1', basedate: '0', leftday: 1},
    {id: '30', categroy: '派外探親假', leave: '派外探親假', introduce: '派外探親假，僅適用派外同仁申請', attachment: '0', basedate: '0', leftday: 1.5},
    {id: '31', categroy: '派外急難假', leave: '派外急難假', introduce: '派外...重病或死亡，由Level 2以上主管核定急難假的天數', attachment: '0', basedate: '0', leftday: 0.5},
    {id: '32', categroy: '民族祭典假', leave: '民族祭典假', introduce: '原住民依據族別不同，有不同的祭典日可請一日', attachment: '1', basedate: '1', leftday: 0.5}
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

var baseDayList = [
    {id: '705122', leave: '检产假', baseday: '2017-02-02'},
    {id: '702432', leave: '检产假', baseday: '2017-06-02'}
];

var selectCategroyStr = "所有類別";
var leaveMsgStr = "請選擇";
var basedayStr = "selectOtherBaseday";
var viewLeaveSubmitInit = false;
var selectCategroy = "所有類別";
var categroyList = [];
var LeaveList = [];
var allLeaveList = [];
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

var categroyData = {
    id: "categroy-popup",
    option: [],
    title: "",
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveData = {
    id: "leave-popup",
    option: [],
    title: "",
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveAgentData = {
    id: "leave-agent-popup",
    option: [],
    title: '<input type="search" id="searchAgent" />',
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var baseData = {
    id: "basedate-popup",
    option: [],
    title: "",
    defaultText: "選擇日期",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var startData = {
    id: "startday-popup",
    option: [],
    title: "",
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var endData = {
    id: "endday-popup",
    option: [],
    title: "",
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

$("#viewLeaveSubmit").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        //获取所有类别
        function getLeaveCategroy() {
            categroyList = [];
            for(var i in leaveAllData) {
                if (categroyList.indexOf(leaveAllData[i]['categroy']) == -1) {
                    categroyList.push(leaveAllData[i]['categroy']);
                } 
            }
            
            for(var i in categroyList) {
                categroyData["option"][i] = {};
                categroyData["option"][i]["value"] = categroyList[i];
                categroyData["option"][i]["text"] = categroyList[i];
            }

            tplJS.DropdownList("viewLeaveSubmit", "leaveCategroy", "prepend", "typeB", categroyData);
            var categroyStr = "<li class='tpl-option-msg-list' id='categroyAll' value=" + selectCategroyStr + ">" + selectCategroyStr + "</li>";
            $('#categroy-popup-option-list').prepend(categroyStr);
            $('#categroyAll').trigger('click');
        }

        //获取所有假别
        function getAllLeaveList() {
            //數據初始化
            allLeaveList = [];
            leaveDataInit();

            for(var i in leaveAllData) {
                if (allLeaveList.indexOf(leaveAllData[i]['leave']) == -1) {
                    allLeaveList.push(leaveAllData[i]['leave']);
                }
            }
            
            for(var i in allLeaveList) {
                leaveData["option"][i] = {};
                leaveData["option"][i]["value"] = allLeaveList[i];
                leaveData["option"][i]["text"] = allLeaveList[i];
            }

            tplJS.DropdownList("viewLeaveSubmit", "leaveGenre", "prepend", "typeB", leaveData);
        }

        //根据类别获取假别
        function getLeaveByCategroy(categroy) {
            //數據初始化
            leaveList = [];
            leaveDataInit();
            $("#leave-popup-option-list").empty();
            var leaveOption = "";

            //選擇所有類別還是其他..
            if(categroy == selectCategroyStr) {
                for(var i in leaveAllData) {
                    if (allLeaveList.indexOf(leaveAllData[i]['leave']) == -1) {
                        allLeaveList.push(leaveAllData[i]['leave']);
                    }
                }
                
                for(var i in allLeaveList) {
                    leaveData["option"][i] = {};
                    leaveData["option"][i]["value"] = allLeaveList[i];
                    leaveData["option"][i]["text"] = allLeaveList[i];
                    leaveOption += '<li class="tpl-option-msg-list">' + allLeaveList[i] + '</li>'; 
                }
            }else {
                for(var i in leaveAllData) {
                    if(categroy == leaveAllData[i]['categroy']) {
                        leaveList.push(leaveAllData[i]['leave']);
                    }
                }
    
                for(var i in leaveList) {
                    leaveData["option"][i] = {};
                    leaveData["option"][i]["value"] = leaveList[i];
                    leaveData["option"][i]["text"] = leaveList[i];
                    leaveOption += '<li class="tpl-option-msg-list">' + leaveList[i] + '</li>';    
                }

                //選擇其他——提示
                var leavePleaseStr = "<li id='leaveSelect'>" + leaveMsgStr + "</li>";
                $("#leave-popup-option-list").prepend(leavePleaseStr);
                $('#leaveSelect').trigger('click');
                $('#applyLeaveCategroy').hide();

            }

            //update & resize
            $("#leave-popup-option-list").append(leaveOption);
            tplJS.reSizeDropdownList("leave-popup", "typeB");
            resizePopup("leave-popup-option");
            
        }

        //有問題——要修改（不影響使用）
        function getLeaveByCategroyError(categroy) {
            //數據初始化
            allLeaveList = [];
            //leaveList = [];
            leaveDataInit();
            $("#leave-popup").remove();
            //$("#leave-popup-option-list").remove();
            var leaveOption = "";

            //選擇所有類別還是其他..
            if(categroy == selectCategroyStr) {
                for(var i in leaveAllData) {
                    allLeaveList.push(leaveAllData[i]['leave']);
                }
                
                for(var i in allLeaveList) {
                    leaveData["option"][i] = {};
                    leaveData["option"][i]["value"] = allLeaveList[i];
                    leaveData["option"][i]["text"] = allLeaveList[i];
                }

                tplJS.DropdownList("viewLeaveSubmit", "leaveGenre", "prepend", "typeB", leaveData);

            }else {
                for(var i in leaveAllData) {
                    if(categroy == leaveAllData[i]['categroy']) {
                        allLeaveList.push(leaveAllData[i]['leave']);
                    }
                }
    
                for(var i in allLeaveList) {
                    leaveData["option"][i] = {};
                    leaveData["option"][i]["value"] = allLeaveList[i];
                    leaveData["option"][i]["text"] = allLeaveList[i];    
                }

                tplJS.DropdownList("viewLeaveSubmit", "leaveGenre", "prepend", "typeB", leaveData);
                
                //選擇其他——提示
                var leavePleaseStr = "<li id='leaveSelect'>" + leaveMsgStr + "</li>";
                $("#leave-popup-option-list").prepend(leavePleaseStr);
                $('#leaveSelect').trigger('click');
                $('#applyLeaveCategroy').hide();

                //resize
                // tplJS.reSizeDropdownList("leave-popup", "typeB");
                // resizePopup("leave-popup-option");
            }
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
        function getLeaveObj(leave) {
            for(var i in leaveAllData) {
                if(leave == leaveAllData[i]['leave']) {
                    return leaveAllData[i];
                }
            }
        }

        //檢查是否有已經生效的基準日
        function checkBaseday(leave) {
            if(leave == "婚嫁") {
                return true;
            }else if(leave == "產假") {
                return false;
            }else {
                return false;
            }
        }

        //获取基准日列表——真实情况下应该传参--假别
        function getBasedayByLeave() {
            var basedayOption = "";
            baseDateInit();
            $('#basedate-popup').remove();
            $('#otherBasedayBtn').remove();

            for(var i in baseDayList) {
                baseData["option"][i] = {};
                baseData["option"][i]["value"] = baseDayList[i]["baseday"];
                baseData["option"][i]["text"] = baseDayList[i]["baseday"];
            }

            tplJS.DropdownList("viewLeaveSubmit", "baseTime", "prepend", "typeB", baseData);
            basedayOption = '<li id="otherBasedayBtn" class="tpl-option-msg-list" value=' + basedayStr + '>選擇其他基準日</li>';
            $('#basedate-popup-option-list').append(basedayOption);
        }

        //初始化假別列表
        function leaveDataInit() {
            leaveData = {
                id: "leave-popup",
                option: [],
                title: "",
                defaultText: "請選擇",
                changeDefaultText : true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };
        }

        function baseDateInit() {
            baseData = {
                id: "basedate-popup",
                option: [],
                title: "",
                defaultText: "選擇日期",
                changeDefaultText : true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };
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

        

        /********************************** page event *************************************/
        $("#viewLeaveSubmit").on("pagebeforeshow", function(event, ui) {
            if(!viewLeaveSubmitInit){
                $('#applyDay').text(applyDay);
                $('#previewApplyDay').text(applyDay);
                getLeaveCategroy();
                //getLeaveByCategroy(selectCategroy);
                getAllLeaveList();
                if(lastPageID === "viewPersonalLeave") {
                    tplJS.DropdownList("viewLeaveSubmit", "leaveAgent", "prepend", "typeB", leaveAgentData);
                    tplJS.DropdownList("viewLeaveSubmit", "startDay", "prepend", "typeB", startData);
                    tplJS.DropdownList("viewLeaveSubmit", "endDay", "prepend", "typeB", endData);
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

        //選擇類別
        $(document).on("change", "#categroy-popup", function() {
            selectCategroy = $.trim($(this).text());
            //console.log(selectCategroy);
            getLeaveByCategroy(selectCategroy);      
            
        });

        //假別彈窗打開之後——清除 "請選擇"
        $(document).on("popupafteropen", "#leave-popup-option", function() {
            $('#leaveSelect').remove();
        });

        //點擊假別——獲取假別對象詳細信息
        $(document).on("click", "#leave-popup-option ul li", function() {
            selectLeave = $(this).text();
            if(selectLeave !== leaveMsgStr) {
                leaveObj = getLeaveObj(selectLeave);
            }
            leaveState = true;
        });

        //假別彈窗關閉之後——檢查剩餘天數並提示
        $(document).on("popupafterclose", "#leave-popup-option", function() {
            if(leaveState){
                //check leftday
                if(selectLeave !== leaveMsgStr && leaveObj['leftday'] > 0) {
                    for(var i in leaveAllData){
                        if(selectLeave == leaveAllData[i]['leave']) {
                            $("#categroy-popup").find("option[value=" + leaveAllData[i]['categroy'] + "]").attr("selected", "selected");
                            break;
                        }
                    }

                    //popup
                    leftdayMsg = "剩餘" + leaveObj['leftday'] + "天" + leaveObj['leave'] + "可申請";
                    $('.leftDaysByLeave').find('.header-text').html(leftdayMsg);
                    popupMsgInit('.leftDaysByLeave');

                    //introduce
                    var divIntroduce = "<span>*" + leaveObj['introduce'] + "</span>";
                    $('#applyLeaveCategroy').empty().append(divIntroduce).show();
        
                    //attachment
                    if(leaveObj['attachment'] == '1') {
                        $('#uploadAttachment').show();
                    }else {
                        $('#uploadAttachment').hide();
                    }
        
                    //basedate
                    if(leaveObj['basedate'] == '1') {
                        $('#baseDate').show();
                        $('#divEmpty').show();

                        //檢查是否有已經生效的基準日
                        basedayState = checkBaseday(selectLeave);
                        if(basedayState) {
                            $('#baseTime').show();
                            $('#baseTimeNoData').hide();
                            getBasedayByLeave();
                            $("#baseTimeNoData").find("span").text("請選擇");
                            
                        }else {
                            $('#baseTimeNoData').show();
                            $('#baseTime').hide();
                        }
                        
                        needBaseday = true;
                    }else {
                        $('#baseDate').hide();
                        $('#divEmpty').hide();

                        needBaseday = false;
                    }
                    
                }else if(selectLeave !== leaveMsgStr && leaveObj['leftday'] == 0) {
                    //popup
                    $('.leaveNotEnough').find('.main-paragraph').html("請選擇其他假別");
                    popupMsgInit('.leaveNotEnough');

                    var leavePleaseStr = "<li id='leaveSelect'>" + leaveMsgStr + "</li>";
                    $("#leave-popup-option-list").prepend(leavePleaseStr);
                    $('#leaveSelect').trigger('click');

                    $(document).off("change", "#leave-popup");
                    $('#applyLeaveCategroy').hide();
                    $('#uploadAttachment').hide();
                    $('#baseDate').hide();
                    $('#divEmpty').hide();
                }
            }

            selectBaseday = false;
            leaveState = false;
        });

        $(document).on("change", "#basedate-popup", function() {
            selectBaseday = true;
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
                        $("#startDate").click();
                    }else {
                        popupMsgInit('.basedayFirst');
                    }
                }else {
                    $("#startDate").click();
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
                        $("#endDate").click();
                    }else {
                        popupMsgInit('.basedayFirst');
                    }
                }else {
                    $("#endDate").click();
                }
            }
            

        });

        //直接選擇基準日
        $(document).on("click", "#baseTimeNoData", function() {
            $("#noDataBasedayComponent").click();

        });

        //選擇其他基準日
        $(document).on("click", "#otherBasedayBtn", function() {
            $("#hasDataBasedayComponent").click();
            
        });

        //開始日期改變
        $(document).on("change", "#startDate", function() {
            startLeaveDate = "";
            startLeaveDay = 0;
            startLeaveTime = 0;

            var self = $(this).val();
            //開始時間是否被清空
            if(self !== "") {
                startLeaveDate = self.replace("T", " ");
                startLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                startLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                $('#startText').text(startLeaveDate);
                
                //結束時間必須大於開始時間
                if(startLeaveDay > endLeaveDay) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#startText').text(leaveMsgStr);
                }else if(startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#startText').text(leaveMsgStr);
                }else {
                    $('.leftDaysByLeave').find('.header-text').html(leftdayMsg);
                    //popupMsgInit('.leftDaysByLeave');
                    //統計請假時長——會有API計算
                    if(endLeaveDay - startLeaveDay > 2 && endLeaveTime >= startLeaveTime) {
                        var leaveDay = endLeaveDay - startLeaveDay;
                        var leaveTime = endLeaveTime - startLeaveTime;
                    }else if(endLeaveDay > startLeaveDay && endLeaveTime < startLeaveTime) {
                        var leaveDay = endLeaveDay - startLeaveDay;
                        var leaveTime = endLeaveTime - startLeaveTime;
                    }else if(endLeaveDay == startLeaveDay) {
                        var leaveDay = 0;
                        var leaveTime = endLeaveTime - startLeaveTime;
                    }    
                }
            }else {  
                $('#startText').text(leaveMsgStr); 
            }

            //展現請假統計
            if(startLeaveDate !== "" && endLeaveDate !== "" & startLeaveDate !== "請選擇" && endLeaveDate !== "請選擇") {
                $('#leaveDay').text(leaveDay);
                $('#leaveTime').text(leaveTime);
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
                endLeaveDate = self.replace("T", " ");
                endLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                endLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                $('#endText').text(endLeaveDate);

                //結束時間必須大於開始時間
                if(startLeaveDay > endLeaveDay) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(leaveMsgStr); 
                }else if(startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(leaveMsgStr); 
                }else {
                    $('.leftDaysByLeave').find('.header-text').html(leftdayMsg);
                    //popupMsgInit('.leftDaysByLeave');
                    //統計請假時長——會有API計算
                    if(endLeaveDay - startLeaveDay > 2 && endLeaveTime >= startLeaveTime) {
                        var leaveDay = endLeaveDay - startLeaveDay;
                        var leaveTime = endLeaveTime - startLeaveTime;
                    }else if(endLeaveDay > startLeaveDay && endLeaveTime < startLeaveTime) {
                        var leaveDay = endLeaveDay - startLeaveDay;
                        var leaveTime = endLeaveTime - startLeaveTime;
                    }else if(endLeaveDay == startLeaveDay) {
                        var leaveDay = 0;
                        var leaveTime = endLeaveTime - startLeaveTime;
                    }
                }
            }else {
                $('#endText').text(leaveMsgStr); 
            }

            //展現請假統計
            if(startLeaveDate !== "" && endLeaveDate !== "" & startLeaveDate !== "請選擇" && endLeaveDate !== "請選擇") {
                $('#leaveDay').text(leaveDay);
                $('#leaveTime').text(leaveTime);
                datetimeState = true;
            }else {
                datetimeState = false;
            }
            
        });

        //有有效基準日選擇——有問題
        $(document).on("change", "#hasDataBasedayComponent", function() {
            otherBaseVal = $(this).val();
            if(otherBaseVal !== "") {
                selectBaseday = true;
            }
            $('#basedate-popup').find("option[value='undefined']").text(otherBaseVal);
        });

        //無有效基準日選擇
        $(document).on("change", "#noDataBasedayComponent", function() {
            newBaseVal = $(this).val();
            if(newBaseVal !== "") {
                selectBaseday = true;
            }
            $("#baseTimeNoData").find("span").text(newBaseVal);
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
                $('.apply-preview').show();
                $('.ui-title').find("span").text(langStr["str_130"]);
                $('.leaveMenu').hide();
                $('#backMain').show();
            }
        });

        //返回編輯按鈕
        $("#backMain").on("click", function() {
            $('.apply-preview').hide();
            $('.apply-container').show();
            $('.ui-title').find("span").text(langStr["str_002"]);
            $('.leaveMenu').show();
            $('#backMain').hide();
            return false;
        });


    }
});