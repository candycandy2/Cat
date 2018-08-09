var overtimeday = "", startottime = "", endottime = "", otreason = "", otpaidtype = "";
var timeoutGetOTReason = null;
var countOTHours = "0";
var editOvertimeForm = false;
var paidTypeData = {
    id: "paid-type-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

//檢查是否符合預覽送簽標準
function checkOvertimeBeforePreview() {
    if (otreason !== "" &&
        $('#chooseOTday').text() !== pleaseSelectStr &&
        $('#startTimeText').text() !== pleaseSelectStr &&
        $('#endTimeText').text() !== pleaseSelectStr) {
            $('#previewOTBtn').addClass('leavePreview-active-btn');
    } else {
        $('#previewOTBtn').removeClass('leavePreview-active-btn');
    }
}

function checkAcutalOTBeforePreview() {
    if ($('#chooseOTday').text() !== pleaseSelectStr &&
        $('#startTimeText').text() !== pleaseSelectStr &&
        $('#endTimeText').text() !== pleaseSelectStr &&
        $.trim($('#paidType').text()) !== pleaseSelectStr ) {
            $('#previewActualOTBtn').addClass('leavePreview-active-btn');
    } else {
        $('#previewActualOTBtn').removeClass('leavePreview-active-btn');
    }
}

//生成加班選擇類型
function getOTPaidType() {
    var typeList = [{id:"1", name:"補休"},
                    {id:"2", name:"加班費"}];
    paidTypeData["option"] = [];
    $("#paidType").empty();
    $("#paid-type-popup-option-popup").remove();

    for (var i in typeList) {
        paidTypeData["option"][i] = {};
        paidTypeData["option"][i]["value"] = typeList[i]["id"];
        paidTypeData["option"][i]["text"] = typeList[i]["name"];
    }

    tplJS.DropdownList("viewOvertimeSubmit", "paidType", "prepend", "typeB", paidTypeData);
}

$("#viewOvertimeSubmit").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/       
        function GetOTReason() {
            otreason = $.trim($("#overtimeReason").val()); 
            //檢查是否可以預覽送簽
            checkOvertimeBeforePreview();
        }

        //選擇結束時間計算請假數
        window.CountOvertimeHoursByEnd = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var overtimeSuccess = $("success", htmlDom);
                    var overtimeError = $("error", htmlDom);
                    var applyDays = $("ApplyDays", htmlDom);
                    var applyHours = $("ApplyHours", htmlDom); 
                    countOTHours = $(applyHours).html();                   
                    if ($(overtimeSuccess).html() != undefined) {
                        //success无提示，改变请假数即可
                        $("#overtimeHours").text(countOTHours);
                    } else {
                        //error提示
                        var errorMsg = $(overtimeError).html();
                        $('.leftDaysByOT').find('.header-text').html(errorMsg);
                        popupMsgInit('.leftDaysByOT');
                        //enddate
                        $("#endTimeText").text(pleaseSelectStr);
                        $("#overtimeHours").text("0");
                        countOTHours = "0";
                    }

                    //檢查是否可以預覽送簽
                    if (!viewAcutalOTApplyShow) {
                        checkOvertimeBeforePreview();
                    } else {
                        checkAcutalOTBeforePreview();
                    }
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "CountOvertimeHours", self.successCallback, self.failCallback, countOvertimeHoursByEndQueryData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewOvertimeSubmit").on("pagebeforeshow", function(event, ui) {          
            if (!viewAcutalOTApplyShow) {
                $('#viewOvertimeSubmit .leaveMenu').show();
                $("#backOvertime").hide();
                $("#backOTQueryDetail").hide();
                $("#backActualOTApply").hide();
                //顯示加班申請
                $("#applyTitle").show();
                $("#chooseOTday").siblings().show();
                $("#expectOTInterval").show();
                $("#expectOTHours").show();
                $(".overtime-reason").show();
                $("#previewOTBtn").show();
                $("#actualApplyTitle").hide();           
                $("#actualOTInterval").hide();            
                $("#actualOTHours").hide(); 
                $(".overtime-paid").hide();
                $("#previewActualOTBtn").hide();
                //清空時數登入
                $("#emptyOvertimeForm").click();
            } else {  
                $('#viewOvertimeSubmit .leaveMenu').hide();
                $("#backOvertime").hide();
                $("#backOTQueryDetail").show();
                $("#backActualOTApply").hide();      
                //顯示時數登入
                $("#applyTitle").hide();
                $("#chooseOTday").siblings().hide();
                $("#expectOTInterval").hide();
                $("#expectOTHours").hide();
                $(".overtime-reason").hide();
                $("#previewOTBtn").hide();
                $("#actualApplyTitle").show();           
                $("#actualOTInterval").show();            
                $("#actualOTHours").show(); 
                $(".overtime-paid").show();
                $("#previewActualOTBtn").show();
                //清空時數登入
                $("#emptyOvertimeForm").click();
                //加班日期賦值
                $("#chooseOTday").text(overtimeDetailObj["targetdate"]);
                overtimeday = overtimeDetailObj["targetdate"];
                getOTPaidType();
                //viewAcutalOTApplyShow = false;
            }          
        });

        $("#viewOvertimeSubmit").on("pageshow", function(event, ui) {
            $('#applyOTDay').text(applyDay);
            $('#previewApplyDate').text(applyDay);
            loadingMask("hide");
        });

        /********************************** dom event *************************************/

        $('#newOTDate').datetimepicker({
            timepicker: false,
            yearStart: '2016',
            minDate: formatDateForNumber(Date.now())
        });

        //選擇出勤日期
        $("#selectOTday").on("click", function() {
            if (!viewAcutalOTApplyShow) {
                if ($("#chooseOTday").text() == pleaseSelectStr) {
                    recordStartText = new Date(Date.now());
                } else {
                    recordStartText = new Date($("#chooseOTday").text());
                }                    
                //datetime-local
                $('#newOTDate').datetimepicker('show');
                var currentStep = $('.xdsoft_datetimepicker').filter(function(item){
                    var workingDatepickerStyle = $(".xdsoft_datetimepicker")[item].style;
                    if (workingDatepickerStyle.display === 'block') {
                        $(this).addClass('datepicker-position');
                    }
                });
            }
        });

        //新出勤日選擇——datetime change
        $("#newOTDate").on("change", function() {
            overtimeday = ($(this).val()).substring(0, 10);
            if (overtimeday === "") {
                $("#chooseOTday").text(pleaseSelectStr);
            } else {
                $("#chooseOTday").text(overtimeday);
                //如果出勤日改變，開始和结束時間要清空
                $("#startTimeText").text(pleaseSelectStr);
                $("#startOTPicker").val("");
                startottime = "";
                $("#endTimeText").text(pleaseSelectStr);  
                $("#endOTPicker").val("");         
                endottime = "";
                //请假数恢复0，0
                $("#overtimeHours").text("0");
                countOTHours = "0";
            }
            checkOvertimeBeforePreview();
        });

        //選擇加班開始時間
        $("#btnStartTime").on("click", function() {
            //選擇加班開始時間之前判斷加班日期是否選擇
            if (overtimeday === "") {
                popupMsgInit('.overitmeDateFirst');
            } else {
                $("#startOTPicker").trigger('datebox', { 'method': 'open' });
                tplJS.preventPageScroll();
            }           
        });

        //選擇加班結束時間
        $("#btnEndTime").on("click", function() {
            //選擇加班結束時間之前判斷加班開始時間是否選擇
            if ($("#startTimeText").text() == pleaseSelectStr) {
                popupMsgInit('.starttimeFirst');
            } else {
                $("#endOTPicker").trigger('datebox', { 'method': 'open' });
                tplJS.preventPageScroll();
            }

        });

        window.setStartTime = function(obj) {
            if (!obj.cancelClose) {
                var setTime = obj.date;
                doneDateTime["hour"] = this.callFormat('%H', setTime);
                doneDateTime["minute"] = this.callFormat('%M', setTime);

                var textDateTime = doneDateTime["hour"] + ":" + doneDateTime["minute"];
                $("#startTimeText").html(textDateTime);
                startottime = textDateTime;
                //Create temporary data
                tempDateTime = JSON.parse(JSON.stringify(doneDateTime));
                //如果開始時間改變，结束時間要清空
                $("#endTimeText").text(pleaseSelectStr);  
                $("#endOTPicker").val("");         
                endottime = "";
            } 
            tplJS.recoveryPageScroll();

            $(".ui-datebox-container").css("opacity", "0");
            if (!viewAcutalOTApplyShow) {
                checkOvertimeBeforePreview();
            } else {
                checkAcutalOTBeforePreview();
            }
        };

        window.setEndTime = function(obj) {
            if (!obj.cancelClose) {
                var setTime = obj.date;
                doneDateTime["hour"] = this.callFormat('%H', setTime);
                doneDateTime["minute"] = this.callFormat('%M', setTime);

                var textDateTime = doneDateTime["hour"] + ":" + doneDateTime["minute"];
                if (!viewAcutalOTApplyShow) {
                    var expOTHours = "0";
                } else {
                    var expOTHours = overtimeDetailObj["hours"];
                }
                //結束時間必須大於開始時間
                if (startottime >= textDateTime) {
                    //提示錯誤信息
                    popupMsgInit('.endTimeError');
                    $('#endTimeText').text(pleaseSelectStr);
                    //请假数恢复0，0
                    $("#overtimeHours").text("0");
                    countOTHours = "0";
                    if (!viewAcutalOTApplyShow) {
                        checkOvertimeBeforePreview();
                    } else {
                        checkAcutalOTBeforePreview();
                    }
                } else {
                    $("#endTimeText").html(textDateTime);
                    endottime = textDateTime;
                    //Create temporary data
                    tempDateTime = JSON.parse(JSON.stringify(doneDateTime));
                    countOvertimeHoursByEndQueryData = "<LayoutHeader><EmpNo>" +
                        myEmpNo +
                        "</EmpNo><targetdate>" +
                        overtimeday +
                        "</targetdate><begintime>" +
                        startottime +
                        "</begintime><endtime>" +
                        endottime +
                        "</endtime><expectTotalhours>" + 
                        expOTHours +
                        "</expectTotalhours></LayoutHeader>"; 
                    CountOvertimeHoursByEnd(); 
                }                             
            } 
            tplJS.recoveryPageScroll();
            $(".ui-datebox-container").css("opacity", "0");
        };

        //實時獲取多行文本值
        $("#overtimeReason").on("keyup", function() {
            if (timeoutGetOTReason != null) {
                clearTimeout(timeoutGetOTReason);
                timeoutGetOTReason = null;
            }
            timeoutGetOTReason = setTimeout(function() {
                GetOTReason();
            }, 2000);
        });

        //选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#paid-type-popup-option", function() {
            otpaidtype = $("#paid-type-popup option").text();
            checkAcutalOTBeforePreview();
        });
      
        //清除加班申請
        $("#emptyOvertimeForm").on("click", function() {
            //申請日期
            $('#applyOTDay').text(applyDay);           
            $("#startTimeText").text(pleaseSelectStr);
            $("#startOTPicker").val("");
            startottime = "";
            $("#endTimeText").text(pleaseSelectStr);  
            $("#endOTPicker").val("");         
            endottime = "";          
            //请假数恢复0，0
            $("#overtimeHours").text("0");
            countOTHours = "0";
            if (!viewAcutalOTApplyShow) {
                //日期恢復請選擇
                $("#chooseOTday").text(pleaseSelectStr);
                $("#newOTDate").val("");
                overtimeday = "";
                //清除加班理由
                $("#overtimeReason").val("");
                otreason = "";
                checkOvertimeBeforePreview();
            } else {
                //加班選擇恢復請選擇
                getOTPaidType();
                otpaidtype = "";
                checkAcutalOTBeforePreview();
            }
        });

        //預覽送簽按鈕
        $("#previewOTBtn").on("click", function() {
            GetOTReason();//手寫或語音輸入
            if ($('#previewOTBtn').hasClass('leavePreview-active-btn')) {
                $("#applyOTReason").show();
                $("#applyOTPaid").hide();
                //傳值到預覽頁面
                var overtimeInterval = startottime + " - " + endottime;
                $("#previewOTDay").text(overtimeday);
                $("#previewOTTime").text(overtimeInterval);
                $("#previewOTHours").text(countOTHours);              
                $("#previewOTReason").text(otreason); 
               
                $('.apply-container').hide();
                $('#viewOvertimeSubmit .leaveMenu').hide();
                $('#backOTQueryDetail').hide();
                $('#backActualOTApply').hide();
                $('.apply-preview').show();
                $('#backOvertime').show();
                $('#confirmOTBtn').show();
                $('#confirmActualOTBtn').hide();
            }
        });

        //預覽送簽按鈕(時數登入)
        $("#previewActualOTBtn").on("click", function() {
            if ($('#previewActualOTBtn').hasClass('leavePreview-active-btn')) {
                $("#applyOTReason").hide();
                $("#applyOTPaid").show();
                //傳值到預覽頁面
                var overtimeInterval = startottime + " - " + endottime;
                $("#previewOTDay").text(overtimeday);
                $("#previewOTTime").text(overtimeInterval);
                $("#previewOTHours").text(countOTHours);              
                $("#previewOTPaid").text(otpaidtype); 
               
                $('.apply-container').hide();
                $('#viewOvertimeSubmit .leaveMenu').hide();
                $('#backOTQueryDetail').hide();
                $('#backActualOTApply').show();
                $('.apply-preview').show();
                $('#backOvertime').hide();
                $('#confirmOTBtn').hide();
                $('#confirmActualOTBtn').show();
            }
        });

        //从预览返回加班申请
        $("#backOvertime").on("click", function() {
            $('.apply-preview').hide();
            $('#backOvertime').hide();
            $('.apply-container').show();
            $('#viewOvertimeSubmit .leaveMenu').show();
        });

         //从预览返回時數登入申请
        $("#backActualOTApply").on("click", function() {
            $('.apply-preview').hide();
            $('#backActualOTApply').hide();
            $('.apply-container').show();
            $('#backOTQueryDetail').show();
        });

        $("#backOTQueryDetail").on("click", function() {           
            changePageFromSubmitToDetail = true;
            viewAcutalOTApplyShow = false;
            changePageByPanel("viewOvertimeQuery");
        });       

        //確定送簽
        $("#confirmOTBtn").on("click", function() {
            popupMsgInit('.confirmOvertime');
        });

        //確定時數登入送簽
        $("#confirmActualOTBtn").on("click", function() {
            popupMsgInit('.confirmActualOvertime');
        });

        //加班申請送簽
        window.SendApplyOvertimeData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDom);
                    if ($(success).html() != undefined) {
                        //如果送签成功，重新取得加班單列表，并跳转到“加班查詢/時數登入”页，并记录代理人到local端
                        $("#backOvertime").click();
                        QueryEmployeeOvertimeApplyForm();
                        changePageByPanel("viewOvertimeQuery");
                        $(".popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                        //送签成功，清空申请表单
                        $("#emptyOvertimeForm").trigger("click");
                    } else {
                        loadingMask("hide");
                        var error = $("error", htmlDom);
                        var errorMsg = $(error).html();
                        $('.leftDaysByOT').find('.header-text').html(errorMsg);
                        popupMsgInit('.leftDaysByOT');
                    }

                }
            };

            this.failCallback = function(data) {
                loadingMask("hide");
            };

            var __construct = function() {
                CustomAPI("POST", true, "SendOvertimeFormData", self.successCallback, self.failCallback, sendApplyOvertimeQueryData, "");
            }();
        };

        //送簽popup確定
        $("#confirmSendOT").on("click", function() {
            //$("#previewOTBtn").hide();
            loadingMask("show");
            sendApplyOvertimeQueryData = '<LayoutHeader><empno>' +
                myEmpNo +
                '</empno><targetdate>' +
                overtimeday +
                '</targetdate><begintime>' +
                startottime +
                '</begintime><endtime>' +
                endottime +
                '</endtime><hours>' +
                countOTHours +
                '</hours><reason>' +
                otreason +
                '</reason><formid>' +
                ((editOvertimeForm == false) ? '' : '') + //otDetailObj['formid']
                '</formid>';
            //filler: 本人或是秘書申請
            if (myEmpNo === originalEmpNo) {
                sendApplyOvertimeQueryData += '<filler>'+ myEmpNo +'</filler></LayoutHeader>';
            } else {
                sendApplyOvertimeQueryData += '<filler>'+ originalEmpNo +'</filler></LayoutHeader>';
            }
            //呼叫API
            SendApplyOvertimeData();
        });

        //送簽時數登入popup確定
        $("#confirmSendActualOT").on("click", function() {
            viewAcutalOTApplyShow = false;
        });
    }
});