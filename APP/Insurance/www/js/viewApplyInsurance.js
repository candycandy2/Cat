
$("#viewApplyInsurance").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var applyDate, applyDateVal, reasonVal, subsidyVal, certiVal, cardVal, remarkVal = "";

        //API:ModifyHealthInsurance
        function queryModifyHealthInsurance() {
            loadingMask("show");
            var self = this;
            var strSubsidy = ((subsidyVal == 'subsidyYes') ? 'Y' : 'N'); 
            var strCerti = ((certiVal == 'certiYes') ? 'Y' : 'N');
            var strHealthcard = ((cardVal == 'cardYes') ? 'Y' : 'N');
            var strApplyType = '健保加保';
            var queryData = '<LayoutHeader><ins_id></ins_id>' + '<app_id>' +
                clickAppID +'</app_id><empid>' + 
                myEmpNo +'</empid><family_id>' + 
                clickFamilyID +'</family_id><insuredday>' +
                applyDateVal +'</insuredday><reason>' +
                reasonVal +'</reason><subsidy>' +
                strSubsidy +'</subsidy><certificate>' +
                strCerti +'</certificate><healthcard>' +
                strHealthcard +'</healthcard><remark>' +
                remarkVal +'</remark><applytype>' +
                strApplyType +'</applytype></LayoutHeader>';

            this.successCallback = function(data) {
                if (data['ResultCode'] === "1") {
                    QueryHealthInsuranceList();
                    changePageByPanel("viewPersonalInsurance");
                    $("#applyInsurDoneMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                }
            };

            this.failCallback = function(data) {};
            
            var __construct = function() {
                CustomAPI("POST", true, "ModifyHealthInsurance", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        //加保原因DDL生成
        function getApplyReasonList() {
            //初始化           
            $("#applyReason").html("");
            $("#applyReason-popup").remove();
            $(document).off("click", "#applyReason-popup-option");
            $("#applyReason-popup-option").popup("destroy").remove();

            var options = [{value: "1", text: "依附投保" }, 
                           {value: "2", text: "喪失被保險人身分"},
                           {value: "3", text: "結婚"},
                           {value: "4", text: "新生嬰兒"},
                           {value: "5", text: "在學無業"},
                           {value: "6", text: "禁治產宣告"},
                           {value: "7", text: "殘障不能謀生"},
                           {value: "8", text: "重傷病無業"},
                           {value: "9", text: "應屆畢業(退伍)"},
                           {value: "23", text: "等級變更"}];

            var defaultReason = "依附投保";

            var applyReasonData = {
                id: "applyReason-popup",
                option: options,
                defaultText: defaultReason,
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            //生成申請加保reason dropdownlist
            tplJS.DropdownList("viewApplyInsurance", "applyReason", "prepend", "typeB", applyReasonData);

        }

        function setDefaultStatus() {
            $("#familyName").text(clickFamilyName);
            $("#applyDate").val("");
            getApplyReasonList();
            $('#newSubsidy input[id^=subsidy]').removeAttr("checked");
            $('#newCertificate input[id^=certi]').removeAttr("checked");
            $('#newHealthcard input[id^=card]').removeAttr("checked");
            $('#applyRemark').val('');
        }

        //檢查所有欄位是否爲空
        function checkFormByApplyInsur() {
            nameVal = $.trim($("#familyName").text());
            applyDateVal = $.trim($("#applyDate").val());
            reasonVal = $.trim($("#applyReason").text());
            subsidyVal = $("#newSubsidy :radio:checked").val();
            certiVal = $("#newCertificate :radio:checked").val();
            cardVal = $("#newHealthcard :radio:checked").val();
            remarkVal = $.trim($("#applyRemark").val());

            if (nameVal !== "" && applyDateVal !== "" && reasonVal !== "" && subsidyVal !== undefined && certiVal !== undefined && cardVal !== undefined && remarkVal !== "") {
                $('#previewBtn').addClass('insurPreview-active-btn');
            } else {
                $('#previewBtn').removeClass('insurPreview-active-btn');
            }
        }

        /********************************** page event *************************************/
        $("#viewApplyInsurance").one("pagebeforeshow", function (event, ui) {
            getApplyReasonList();
            $("#applyRemark").attr("placeholder", langStr["str_130"]);
        });

        $("#viewApplyInsurance").on("pageshow", function (event, ui) {            
            setDefaultStatus();
            checkFormByApplyInsur();
        });
        
        /******************************** datetimepicker ***********************************/
         $('#applyDate').datetimepicker({
            timepicker: false
        });

        $("#applyDate").on("click", function () {
            $('#applyDate').datetimepicker("show");
        });

        $("#applyDate").on("change", function () {
            applyDate = $(this).val().substring(0, 10);
            $(this).val(applyDate);
            checkFormByApplyInsur();
        });


        /********************************** dom event *************************************/
        //返回到個人保險現況，彈窗popup
        $("#backPersonalInsurance").on("click", function () {
            popupMsgInit('.confirmCancelApply');
        });

        //返回到保險申請，彈窗popup
        $("#backApplyInsurance").on("click", function () {
            $('#backPersonalInsurance').show();
            $("#viewInsurApplication").show();
            $("#previewBtn").show();
            $('#backApplyInsurance').hide();
            $("#viewPreviewApplication").hide();
        });

        //確定取消申請，跳轉
        $("#confirmCancelApplyBtn").on("click", function () {
            $.mobile.changePage("#viewPersonalInsurance"); 
        });

        $(document).on("change", "#newSubsidy", function() {
            checkFormByApplyInsur();
        });

        $(document).on("change", "#newCertificate", function() {
            checkFormByApplyInsur();
        });

        $(document).on("change", "#newHealthcard", function() {
            checkFormByApplyInsur();
        });
        
        $(document).on("popupafterclose", "#applyReason-popup-option", function() { 
            checkFormByApplyInsur();
        });

        $(document).keyup(function(e) {
            checkFormByApplyInsur();
        });

        //預覽送簽按鈕
        $("#previewBtn").on("click", function() {
            if ($('#previewBtn').hasClass('insurPreview-active-btn')) {
                //傳值到預覽頁面
                var preNameAge = clickFamilyName + '/' + clickRelation + '/' + clickAge;
                var preDate = langStr["str_116"] + ': ' + applyDateVal;
                var preReason = langStr["str_117"] + ': ' + reasonVal;
                var preSubsidy = langStr["str_133"] + ': ' + ((subsidyVal == 'subsidyYes') ? langStr["str_128"] : langStr["str_129"]); 
                var preCertificate = langStr["str_134"] + ': ' + ((certiVal == 'certiYes') ? langStr["str_128"] : langStr["str_129"]);
                var preHealthcard = langStr["str_120"] + ': ' + ((cardVal == 'cardYes') ? langStr["str_128"] : langStr["str_129"]);
                $("#previewNameAge").text(preNameAge);
                $("#previewBirthday").text(clickBirth);
                $("#previewID").text(clickID);
                $("#previewDate").text(preDate);
                $("#previewReason").text(preReason);
                $("#previewSubsidy").text(preSubsidy); 
                $("#previewCertificate").text(preCertificate);
                $("#previewHealthcard").text(preHealthcard);

                $('#backPersonalInsurance').hide();
                $("#viewInsurApplication").hide();
                $("#previewBtn").hide();
                $('#backApplyInsurance').show();
                $("#viewPreviewApplication").show();
            }
        });

        //確定送出按鈕
        $("#applyBtn").on("click", function() {
            var doModifyHealthInsurance = new queryModifyHealthInsurance();
        });   
    }
});