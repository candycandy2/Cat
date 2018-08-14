var workingday = "", clockinday = "", clockintime = "";
var workNameVal = "", otherReason = "";
var clockinWorkType= "", clockinReasonType = "";
var doneDateTime = {};

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
    var  otherReasonStatus= $("#otherReason").css('display');
    //必須符合3個條件：1.請假理由不能爲空 2.開始時間和结束时间 3.需要基准日的是否已选择 4.代理人必须选择
    if (otherReasonStatus === "none") {
        if (workNameVal !== "" &&
            $("#work-type-popup option").text() !== pleaseSelectStr &&
            $('#chooseWorkday').text() !== pleaseSelectStr &&
            $('#chooseClockinday').text() !== pleaseSelectStr &&
            $('#chooseClockintime').text() !== pleaseSelectStr &&
            $("#reason-type-popup option").text() !== pleaseSelectStr ) {
                $('#previewClockinBtn').addClass('leavePreview-active-btn');

        } else {
            $('#previewClockinBtn').removeClass('leavePreview-active-btn');
        }
    }else {
        if (workNameVal !== "" &&
            otherReason !== "" &&
            $("#work-type-popup option").text() !== pleaseSelectStr &&
            $('#chooseWorkday').text() !== pleaseSelectStr &&
            $('#chooseClockinday').text() !== pleaseSelectStr &&
            $('#chooseClockintime').text() !== pleaseSelectStr &&
            $("#reason-type-popup option").text() !== pleaseSelectStr ) {
                $('#previewClockinBtn').addClass('leavePreview-active-btn');

        } else {
            $('#previewClockinBtn').removeClass('leavePreview-active-btn');
        }
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
        //補登申请送签
        window.SendModifyAttendanceFormData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDom);
                    if ($(success).html() != undefined) {
                        //如果送簽成功，跳轉到“補登申請”頁
                        $("#backClockin").click();
                        $(".popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                        //送签成功，清空申请表单
                        $("#emptyClockinForm").trigger("click");
                    } else {
                        loadingMask("hide");
                        var error = $("error", htmlDom);
                        var errorMsg = $(error).html();
                        $('.errMsgByClockin').find('.header-text').html(errorMsg);
                        popupMsgInit('.errMsgByClockin');
                    }
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {
                loadingMask("hide");
            };

            var __construct = function() {
                CustomAPI("POST", true, "SendModifyAttendanceFormData", self.successCallback, self.failCallback, modifyAttendanceFormData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewClockin").one("pagebeforeshow", function(event, ui) {
            getWorkingType();
            getReasonType();
            $("#chooseWorkday").text(pleaseSelectStr);
            $("#chooseClockinday").text(pleaseSelectStr);
            $("#chooseClockintime").text(pleaseSelectStr);
            $('.ui-input-text').css({
                'display': 'none'
            });
        });

        $("#viewClockin").on("pageshow", function(event, ui) {
            $('#applyClockinDay').text(applyDay);
            $('#previewClockinApplyDay').text(applyDay);
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewClockin").keypress(function(event) {

        });

        //选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#work-type-popup-option", function() {
            clockinWorkType = $("#work-type-popup option").text();
            checkClockinBeforePreview();
        });

         //选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#reason-type-popup-option", function() {
            clockinReasonType = $("#reason-type-popup option").text();
            if (clockinReasonType === "其他") {
                $('#otherReason').show();
            } else {
                $('#otherReason').hide();
            }
            checkClockinBeforePreview();
        });

        $('#newWorkDate').datetimepicker({
            timepicker: false,
            yearStart: '2016',
            maxDate: formatDateForNumber(Date.now())
        });

        //選擇出勤日期
        $("#selectWorkday").on("click", function() {
            if ($("#chooseWorkday").text() == pleaseSelectStr) {
                recordStartText = new Date(Date.now());
            } else {
                recordStartText = new Date($("#chooseWorkday").text());
            }                    
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
            maxDate: formatDateForNumber(Date.now())
        });

        //選擇刷卡日期
        $("#selectClockinday").on("click", function() {
            if ($("#chooseClockinday").text() == pleaseSelectStr) {
                recordStartText = new Date(Date.now());
            } else {
                recordStartText = new Date($("#chooseClockinday").text());
            }                    
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

        //選擇刷卡時間
        $("#selectClockintime").on("click", function() {           
            $("#timepicker").trigger('datebox', { 'method': 'open' });  
            tplJS.preventPageScroll();        
        });

        window.setDoneTime = function(obj) {
            if (!obj.cancelClose) {
                var setTime = obj.date;
                doneDateTime["hour"] = this.callFormat('%H', setTime);
                doneDateTime["minute"] = this.callFormat('%M', setTime);

                var textDateTime = doneDateTime["hour"] + ":" + doneDateTime["minute"];
                $("#chooseClockintime").html(textDateTime);
                clockintime = textDateTime;
                //Create temporary data
                tempDateTime = JSON.parse(JSON.stringify(doneDateTime));

            } 
            tplJS.recoveryPageScroll();

            $(".ui-datebox-container").css("opacity", "0");
            checkClockinBeforePreview();
        };

        function GetWorkName() {
            workNameVal = $.trim($("#workName").val());
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

        function GetOtherReason() {
            otherReason = $.trim($("#otherReason").val());
            //檢查是否可以預覽送簽
            checkClockinBeforePreview();
        }

        var timeoutGetOtherReason = null;
        //實時獲取多行文本值
        $("#otherReason").on("keyup", function() {
            if (timeoutGetOtherReason != null) {
                clearTimeout(timeoutGetOtherReason);
                timeoutGetOtherReason = null;
            }
            timeoutGetOtherReason = setTimeout(function() {
                GetOtherReason();
            }, 2000);

        });

        //清除補登申請
        $("#emptyClockinForm").on("click", function() {
            //申請日期
            $('#applyClockinDay').text(applyDay);           
            //班別名稱
            $("#workName").val("");
            workNameVal = "";
            //刷卡類型
            getWorkingType();
            clockinWorkType = "";
            //未刷卡原因
            getReasonType();
            clockinReasonType = "";
            //隱藏其他原因框
            $('#otherReason').hide();
            otherReason = "";
            //日期恢復請選擇
            $("#chooseWorkday").text(pleaseSelectStr);
            $("#newWorkDate").val("");
            workingday = "";
            $("#chooseClockinday").text(pleaseSelectStr);
            $("#newClockinDate").val("");
            clockinday = "";
            $("#chooseClockintime").text(pleaseSelectStr);
            $("#timepicker").val("");
            clockintime = "";
            checkClockinBeforePreview();
        });

        //預覽送簽按鈕
        $("#previewClockinBtn").on("click", function() {
            GetWorkName(); 
            if ($('#previewClockinBtn').hasClass('leavePreview-active-btn')) {
                //傳值到預覽頁面
                $("#previewWorkday").text(workingday);
                $("#previewWorkName").text(workNameVal);
                $("#previewWorkType").text(clockinWorkType);
                $("#previewClockinDay").text(clockinday);               
                $("#previewClockinTime").text(clockintime); 
                $("#previewReason").text(clockinReasonType); 
                if (clockinReasonType === "其他") {
                    $('#otherReasonArea').show();
                    $("#previewOtherReason").text(otherReason);
                } else {
                    $('#otherReasonArea').hide();
                }
                $('.apply-container').hide();
                $('#viewClockin .leaveMenu').hide();
                $('.apply-preview').show();
                $('#backClockin').show();
                $("#confirmBtn").show();
            }
        });

        //从预览返回申请
        $("#backClockin").on("click", function() {
            $('.apply-preview').hide();
            $('#backClockin').hide();
            $('.apply-container').show();
            $('#viewClockin .leaveMenu').show();
            //return false;
        });

        //立即預約popup
        $("#confirmBtn").on("click", function() {
            popupMsgInit('.confirmClockin');
        });

        //確定送簽
        $("#confirmSendClockin").on("click", function() {
            $("#confirmBtn").hide();
            loadingMask("show");
            modifyAttendanceFormData = '<LayoutHeader><empno>' +
                myEmpNo +
                '</empno><targetdate>' +
                workingday +
                '</targetdate><class>' +
                workNameVal +
                '</class><type>' +
                clockinWorkType +
                '</type><checkdate>' +
                clockinday +
                '</checkdate><checktime>' +
                clockintime +
                '</checktime>';
            //未刷卡原因若為其他，將reason 帶入使用者輸入的原因
            if (clockinReasonType === "其他") {
                modifyAttendanceFormData += '<reason>'+ otherReason +'</reason><formid></formid>';
            } else {
                modifyAttendanceFormData += '<reason>'+ clockinReasonType +'</reason><formid></formid>';
            } 
            //filler: 本人或是秘書申請
            if (myEmpNo === originalEmpNo) {
                modifyAttendanceFormData += '<filler>'+ myEmpNo +'</filler></LayoutHeader>';
            } else {
                modifyAttendanceFormData += '<filler>'+ originalEmpNo +'</filler></LayoutHeader>';
            }
            //呼叫API
            SendModifyAttendanceFormData();
        });


    }
});