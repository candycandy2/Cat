var pleaseSelectStr = langStr["str_069"]; //請選擇
var selectBasedayStr = langStr["str_127"]; //選擇時間

var workingday, clockinday = "";
var workName = "";

var workTypeData = {
    id: "work-type-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var reasonTypeData = {
    id: "reason-type-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

//檢查是否符合預覽送簽標準
function checkClockinBeforePreview() {
    //必須符合3個條件：1.請假理由不能爲空 2.開始時間和结束时间 3.需要基准日的是否已选择 4.代理人必须选择
    if (workName !== "" &&
        $("#work-type-popup option").text() !== pleaseSelectStr &&
        $('#chooseWorkday').text() !== pleaseSelectStr &&
        $('#chooseClockinday').text() !== pleaseSelectStr &&
        $('#chooseClockintime').text() !== pleaseSelectStr &&
        $("#reason-type-popup option").text() !== pleaseSelectStr) {
            $('#previewClockinBtn').addClass('leavePreview-active-btn');
    } else {
        $('#previewClockinBtn').removeClass('leavePreview-active-btn');
    }
}

//生成刷卡類型
function getWorkingType() {
    var typeList = [{id:"01", name:"上班"},
                    {id:"02", name:"下班"}];
    workTypeData["option"] = [];
    $("#workType").empty();
    $("#work-type-popup-option-popup").remove();

    for (var i in typeList) {
        workTypeData["option"][i] = {};
        workTypeData["option"][i]["value"] = typeList[i]["id"];
        workTypeData["option"][i]["text"] = typeList[i]["name"];
    }

    tplJS.DropdownList("viewClockin", "workType", "prepend", "typeB", workTypeData);
}

//生成未刷卡理由
function getReasonType() {
    var reasonList = [{id:"01", name:"未帶卡"},
                      {id:"02", name:"忘記刷卡"},
                      {id:"03", name:"其他"}];
    reasonTypeData["option"] = [];
    $("#clockinReason").empty();
    $("#reason-type-popup-option-popup").remove();

    for (var i in reasonList) {
        reasonTypeData["option"][i] = {};
        reasonTypeData["option"][i]["value"] = reasonList[i]["id"];
        reasonTypeData["option"][i]["text"] = reasonList[i]["name"];
    }

    tplJS.DropdownList("viewClockin", "clockinReason", "prepend", "typeB", reasonTypeData);
}

$("#viewClockin").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/


        /********************************** page event *************************************/
        $("#viewClockin").one("pagebeforeshow", function(event, ui) {
            getWorkingType();
            getReasonType();
            $("#chooseWorkday").text(pleaseSelectStr);
            $("#chooseClockinday").text(pleaseSelectStr);
            $("#chooseClockintime").text(pleaseSelectStr);
        });

        $("#viewClockin").on("pageshow", function(event, ui) {
            $('#applyClockinDay').text(applyDay);
            $('#previewApplyDay').text(applyDay);
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewClockin").keypress(function(event) {

        });

        //选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#work-type-popup-option", function() {
            checkClockinBeforePreview();
        });

         //选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#reason-type-popup-option", function() {
            checkClockinBeforePreview();
        });

        $('#newWorkDate').datetimepicker({
            timepicker: false,
            yearStart: '2016',
            yearEnd: '2018'
        });

        //選擇出勤日期
        $("#selectWorkday").on("click", function() {
            //datetime-local
            $('#newWorkDate').datetimepicker('show');
            var currentStep = $('.xdsoft_datetimepicker').filter(function(item){
                var workingDatepickerStyle = $(".xdsoft_datetimepicker")[item].style;
                if (workingDatepickerStyle.display === 'block') {
                    $(this).addClass('datepicker-position');
                }
            });
        });

        //新出勤日選擇——datetime change
        $("#newWorkDate").on("change", function() {
            workingday = ($(this).val()).substring(0, 10);
            if (workingday === "") {
                $("#chooseWorkday").text(pleaseSelectStr);
            } else {
                $("#chooseWorkday").text(workingday);
            }
            checkClockinBeforePreview();
        });

        $('#newClockinDate').datetimepicker({
            timepicker: false,
            yearStart: '2016',
            yearEnd: '2018'
        });

        //選擇刷卡日期
        $("#selectClockinday").on("click", function() {
            //datetime-local
            $('#newClockinDate').datetimepicker('show');
        });

        //新刷卡日選擇——datetime change
        $("#newClockinDate").on("change", function() {
            clockinday = ($(this).val()).substring(0, 10);
            if (clockinday === "") {
                $("#chooseClockinday").text(pleaseSelectStr);
            } else {
                $("#chooseClockinday").text(clockinday);
            }
            checkClockinBeforePreview();
        });

        $('#newClockinTime').datetimepicker({
            datepicker: false
        });

         //選擇刷卡時間
        $("#selectClockintime").on("click", function() {
            //datetime-local
            $('#newClockinTime').datetimepicker('show');
        });

        //新刷卡時間選擇——datetime change
        $("#newClockinTime").on("change", function() {
            clockinday = ($(this).val()).substring(11, 16);
            if (clockinday === "") {
                $("#chooseClockintime").text(pleaseSelectStr);
            } else {
                $("#chooseClockintime").text(clockinday);
            }
            checkClockinBeforePreview();
        });

        function GetWorkName() {
            workName = $.trim($("#workName").val());
            //檢查是否可以預覽送簽
            checkClockinBeforePreview();
        }

        var timeoutGetWorkName = null;
        //實時獲取多行文本值
        $("#workName").on("keyup", function() {
            if (timeoutGetWorkName != null) {
                clearTimeout(timeoutGetWorkName);
                timeoutGetWorkName = null;
            }
            timeoutGetWorkName = setTimeout(function() {
                GetWorkName();
            }, 2000);

        });


        //預覽送簽按鈕
        $("#previewClockinBtn").on("click", function() {
            GetReason(); //手寫或語音輸入
            if ($('#previewClockinBtn').hasClass('leavePreview-active-btn')) {
                //傳值到預覽頁面
                $("#applyCategroy").text(leaveCategory);
                $("#applyLeave").text(leaveType);
                $("#applyAgent").text(agentName);
                $("#applyStartday").text(startLeaveDate);
                $("#applyEndday").text(endLeaveDate);
                $("#applyReason").text(leaveReason); //review by alan
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