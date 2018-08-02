var overtimeday = "", startottime = "", endottime = "", otreason = "";
var timeoutGetOTReason = null;
var countOTHours = "0";
var editOvertimeForm = false;

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
                    }

                    //檢查是否可以預覽送簽
                    checkOvertimeBeforePreview();
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "CountOvertimeHours", self.successCallback, self.failCallback, countOvertimeHoursByEndQueryData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewOvertimeSubmit").one("pagebeforeshow", function(event, ui) {
            $("#chooseOTday").text(pleaseSelectStr);
            $("#startTimeText").text(pleaseSelectStr);
            $("#endTimeText").text(pleaseSelectStr);
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
            checkOvertimeBeforePreview();
        };

        window.setEndTime = function(obj) {
            if (!obj.cancelClose) {
                var setTime = obj.date;
                doneDateTime["hour"] = this.callFormat('%H', setTime);
                doneDateTime["minute"] = this.callFormat('%M', setTime);

                var textDateTime = doneDateTime["hour"] + ":" + doneDateTime["minute"];
                //結束時間必須大於開始時間
                if (startottime >= textDateTime) {
                    //提示錯誤信息
                    popupMsgInit('.endTimeError');
                    $('#endTimeText').text(pleaseSelectStr);
                    //请假数恢复0，0
                    $("#overtimeHours").text("0");
                    checkOvertimeBeforePreview();
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
                        "</endtime></LayoutHeader>"; 
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
      
         //清除加班申請
        $("#emptyOvertimeForm").on("click", function() {
            //申請日期
            $('#applyOTDay').text(applyDay);
            //日期恢復請選擇
            $("#chooseOTday").text(pleaseSelectStr);
            $("#newOTDate").val("");
            overtimeday = "";
            $("#startTimeText").text(pleaseSelectStr);
            $("#startOTPicker").val("");
            startottime = "";
            $("#endTimeText").text(pleaseSelectStr);  
            $("#endOTPicker").val("");         
            endottime = "";
            //清除加班理由
            $("#overtimeReason").val("");
            otreason = "";
            //请假数恢复0，0
            $("#overtimeHours").text("0");
            checkOvertimeBeforePreview();
        });

        //預覽送簽按鈕
        $("#previewOTBtn").on("click", function() {
            GetOTReason();//手寫或語音輸入
            if ($('#previewOTBtn').hasClass('leavePreview-active-btn')) {
                //傳值到預覽頁面
                var overtimeInterval = startottime + " - " + endottime;
                $("#previewOTDay").text(overtimeday);
                $("#previewOTTime").text(overtimeInterval);
                $("#previewOTHours").text(countOTHours);              
                $("#previewOTReason").text(otreason); 
               
                $('.apply-container').hide();
                $('#viewOvertimeSubmit .leaveMenu').hide();
                $('.apply-preview').show();
                $('#backOvertime').show();
                $("#confirmOTBtn").show();
            }
        });

        //从预览返回申请
        $("#backOvertime").on("click", function() {
            $('.apply-preview').hide();
            $('#backOvertime').hide();
            $('.apply-container').show();
            $('#viewOvertimeSubmit .leaveMenu').show();
        });

        //確定送簽
        $("#confirmOTBtn").on("click", function() {
            popupMsgInit('.confirmOvertime');
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
                        //API: QueryEmployeeOvertimeForm
                        //changePageByPanel("viewOvertimeQuery");
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
            $("#previewOTBtn").hide();
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


    }
});