var overtimeday = "", startottime = "";

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
            loadingMask("hide");
        });

        /********************************** dom event *************************************/


        $('#newOTDate').datetimepicker({
            timepicker: false,
            yearStart: '2016',
            maxDate: formatDateForNumber(Date.now())
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
            checkClockinBeforePreview();
        });

        //選擇加班時間
        $("#btnStartTime").on("click", function() {
            $("#otpicker").trigger('datebox', { 'method': 'open' });
            tplJS.preventPageScroll();
        });

        window.setDoneTime = function(obj) {
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
      
         //清除加班申請
        $("#emptyOvertimeForm").on("click", function() {
            //申請日期
            $('#applyOTDay').text(applyDay);
            //日期恢復請選擇
            $("#chooseOTday").text(pleaseSelectStr);
            $("#startTimeText").text(pleaseSelectStr);
            $("#endTimeText").text(pleaseSelectStr);
            startottime = "";
        });



    }
});