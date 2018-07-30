var overtimeday = "", startottime = "", endottime = "";

//檢查是否符合預覽送簽標準
function checkOvertimeBeforePreview() {
    var  otherReasonStatus= $("#otherReason").css('display');
    //必須符合3個條件：1.請假理由不能爲空 2.開始時間和结束时间 3.需要基准日的是否已选择 4.代理人必须选择
    if (otherReasonStatus === "none") {
        if (workName !== "" &&
            $("#work-type-popup option").text() !== pleaseSelectStr &&
            $('#chooseOTday').text() !== pleaseSelectStr &&
            $('#chooseClockinday').text() !== pleaseSelectStr &&
            $('#chooseClockintime').text() !== pleaseSelectStr &&
            $("#reason-type-popup option").text() !== pleaseSelectStr ) {
                $('#previewClockinBtn').addClass('leavePreview-active-btn');

        } else {
            $('#previewClockinBtn').removeClass('leavePreview-active-btn');
        }
    }else {
        if (workName !== "" &&
            otherReason !== "" &&
            $("#work-type-popup option").text() !== pleaseSelectStr &&
            $('#chooseOTday').text() !== pleaseSelectStr &&
            $('#chooseClockinday').text() !== pleaseSelectStr &&
            $('#chooseClockintime').text() !== pleaseSelectStr &&
            $("#reason-type-popup option").text() !== pleaseSelectStr ) {
                $('#previewClockinBtn').addClass('leavePreview-active-btn');

        } else {
            $('#previewClockinBtn').removeClass('leavePreview-active-btn');
        }
    }
}

$("#viewOvertimeSubmit").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        

        /********************************** page event *************************************/
        $("#viewOvertimeSubmit").one("pagebeforeshow", function(event, ui) {
            $("#chooseOTday").text(pleaseSelectStr);
            $("#startTimeText").text(pleaseSelectStr);
            $("#endTimeText").text(pleaseSelectStr);
        });

        $("#viewOvertimeSubmit").on("pageshow", function(event, ui) {
            $('#applyOTDay').text(applyDay);
            $('#previewOTDay').text(applyDay);
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
                    $("#overtimeDays").text("0");
                    $("#overtimeHours").text("0");
                } else {
                    $("#endTimeText").html(textDateTime);
                    endottime = textDateTime;
                    //Create temporary data
                    tempDateTime = JSON.parse(JSON.stringify(doneDateTime));
                    /*countOvertimeHoursByEndQueryData = "<LayoutHeader><EmpNo>" +
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
                        "</datumdate></LayoutHeader>"; */
                    //CountOvertimeHoursByEnd(); 
                }                             
            } 
            tplJS.recoveryPageScroll();

            $(".ui-datebox-container").css("opacity", "0");
            checkOvertimeBeforePreview();
        };
      
         //清除加班申請
        $("#emptyOvertimeForm").on("click", function() {
            //申請日期
            $('#applyOTDay').text(applyDay);
            //日期恢復請選擇
            $("#chooseOTday").text(pleaseSelectStr);
            $("#startTimeText").text(pleaseSelectStr);
            $("#endTimeText").text(pleaseSelectStr);
            startottime = "";
            endottime = "";
        });



    }
});