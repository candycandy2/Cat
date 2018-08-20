
$("#viewApplyInsurance").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var applyDate, applyDateVal, reasonVal, subsidyVal, certiVal, cardVal, remarkVal, detailType = "";

        //API:ModifyHealthInsurance
        window.QueryModifyHealthInsurance = function() {
            loadingMask("show");
            var self = this;
            var strSubsidy = ((subsidyVal == 'subsidyYes') ? 'Y' : 'N'); 
            var strCerti = ((certiVal == 'certiYes') ? 'Y' : 'N');
            var strHealthcard = ((cardVal == 'cardYes') ? 'Y' : 'N');
            var strApplyType = '';
            if (detailType == "pending") {
                strApplyType = '‬健保取消申請'; 
                applyDateVal = ''; 
                reasonVal = ''; 
                strSubsidy = '';   
                strCerti = ''; 
                strHealthcard = ''; 
                remarkVal = '';        
            } else if (detailType == "newApply") {
                strApplyType = '健保加保';
            }
            var queryData = '<LayoutHeader><ins_id>' + 
                clickInsID +'</ins_id><app_id>' +
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
        };

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

        //退保原因DDL生成
        function getWithdrawReasonList() {
            //初始化           
            $("#withdrawReason").html("");
            $("#withdrawReason-popup").remove();
            $(document).off("click", "#withdrawReason-popup-option");
            $("#withdrawReason-popup-option").popup("destroy").remove();

            var options = [{value: "10", text: "轉換投保單位" }, 
                           {value: "11", text: "自行就業"},
                           {value: "12", text: "離緍"},
                           {value: "13", text: "年滿二十歲未具或喪失續保資格"},
                           {value: "14", text: "改變依附對象"},
                           {value: "15", text: "終止收養關係"},
                           {value: "16", text: "死亡"},
                           {value: "17", text: "監所受刑二個月以上"},
                           {value: "18", text: "失蹤滿六個月"},
                           {value: "19", text: "喪失第十條資格"}];

            var defaultReason = "轉換投保單位";

            var withdrawReasonData = {
                id: "withdrawReason-popup",
                option: options,
                defaultText: defaultReason,
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            //生成申請加保reason dropdownlist
            tplJS.DropdownList("viewApplyInsurance", "withdrawReason", "prepend", "typeB", withdrawReasonData);

        }

        function setDefaultStatus() {
            $("#familyName").text(clickFamilyName);
            $("#applyDate").val("");
            //加保畫面
            $(".apply-insurance-ddl").show();
            $(".withdraw-insurance-ddl").hide();
            getApplyReasonList();
            $("#newSubsidy").show();
            $("#newHealthcard").show(); 
            //退保畫面       
            /*$(".withdraw-insurance-ddl").show();
            $(".apply-insurance-ddl").hide();
            getWithdrawReasonList();
            $("#newSubsidy").hide();
            $("#newHealthcard").hide(); */
            
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
            certiVal = $("#newCertificate :radio:checked").val();
            remarkVal = $.trim($("#applyRemark").val());
            
            subsidyVal = $("#newSubsidy :radio:checked").val();
            cardVal = $("#newHealthcard :radio:checked").val();
            if (nameVal !== "" && applyDateVal !== "" && reasonVal !== "" && subsidyVal !== undefined && certiVal !== undefined && cardVal !== undefined && remarkVal !== "") {
                $('#previewBtn').addClass('insurPreview-active-btn');
            } else {
                $('#previewBtn').removeClass('insurPreview-active-btn');
            }
            //退保需檢查的欄位
            /*if (nameVal !== "" && applyDateVal !== "" && reasonVal !== "" && certiVal !== undefined && remarkVal !== "") {
                $('#previewBtn').addClass('insurPreview-active-btn');
            } else {
                $('#previewBtn').removeClass('insurPreview-active-btn');
            }*/
           
        }

        function changeToDetailPage(detailType) {
            var preNameAge = clickFamilyName + '/' + clickRelation + '/' + clickAge;
            if (detailType == "newApply") {
                $("#perviewApplyDate").hide();
                $("#perviewStatus").hide();
                $("#perviewDealday").hide();
                var preDate = langStr["str_116"] + ': ' + applyDateVal;
                var preReason = langStr["str_117"] + ': ' + reasonVal;
                var preSubsidy = langStr["str_133"] + ': ' + ((subsidyVal == 'subsidyYes') ? langStr["str_128"] : langStr["str_129"]); 
                var preCertificate = langStr["str_134"] + ': ' + ((certiVal == 'certiYes') ? langStr["str_128"] : langStr["str_129"]);
                var preHealthcard = langStr["str_120"] + ': ' + ((cardVal == 'cardYes') ? langStr["str_128"] : langStr["str_129"]);
            } else {
                $("#perviewApplyDate").show();
                $("#perviewStatus").show();               
                var preSubsidy = langStr["str_133"] + ': ' + ((clickSubsidy == 'Y') ? langStr["str_128"] : langStr["str_129"]);
                var preCertificate = langStr["str_134"] + ': ' + ((clickCerti == 'Y') ? langStr["str_128"] : langStr["str_129"]);
                var preHealthcard = langStr["str_120"] + ': ' + ((clickHealthcard == 'Y') ? langStr["str_128"] : langStr["str_129"]);
                var applyDateDetail = langStr["str_145"] + ': ' + clickApplyday;
                var statusDetail = langStr["str_146"] + ': ' + clickDealwith;               
                $("#perviewApplyDate").text(applyDateDetail);
                $("#perviewStatus").text(statusDetail);              
                if (detailType == "withdraw") {
                    var preDate = langStr["str_122"] + ': ' + clickApplyday;
                    var preReason = langStr["str_123"] + ': ' + clickReason;
                    //顯示處理狀態並傳值
                    $("#perviewDealday").show();
                    var dealdayDetail = langStr["str_147"] + ': ' + clickDealday;
                    $("#perviewDealday").text(dealdayDetail);
                } else if (detailType == "applied") {
                    var preDate = langStr["str_116"] + ': ' + clickApplyday;
                    var preReason = langStr["str_117"] + ': ' + clickReason;
                    //顯示處理狀態並傳值
                    $("#perviewDealday").show();
                    var dealdayDetail = langStr["str_147"] + ': ' + clickDealday;
                    $("#perviewDealday").text(dealdayDetail);
                } else if (detailType == "pending") {
                    if (clickDealwith == "加保待處理") {
                        var preDate = langStr["str_116"] + ': ' + clickApplyday;
                        var preReason = langStr["str_117"] + ': ' + clickReason;
                    } else if (clickDealwith == "退保待處理") {
                        var preDate = langStr["str_122"] + ': ' + clickApplyday;
                        var preReason = langStr["str_123"] + ': ' + clickReason;
                    } else if (clickDealwith == "停保待處理") {
                        var preDate = langStr["str_124"] + ': ' + clickApplyday;
                        var preReason = langStr["str_125"] + ': ' + clickReason;
                    } else if (clickDealwith == "復保待處理") {
                        var preDate = langStr["str_126"] + ': ' + clickApplyday;
                        var preReason = langStr["str_127"] + ': ' + clickReason;
                    }
                    //待處理，不顯示處理狀態
                    $("#perviewDealday").hide();
                }
            }
            /*if (detailType == "withdraw"){
                $("#perviewApplyDate").show();
                $("#perviewStatus").show();
                $("#perviewDealday").show();
                var preDate = langStr["str_122"] + ': ' + clickApplyday;
                var preReason = langStr["str_123"] + ': ' + clickReason;
                var preSubsidy = langStr["str_133"] + ': ' + ((clickSubsidy == 'Y') ? langStr["str_128"] : langStr["str_129"]);
                var preCertificate = langStr["str_134"] + ': ' + ((clickCerti == 'Y') ? langStr["str_128"] : langStr["str_129"]);
                var preHealthcard = langStr["str_120"] + ': ' + ((clickHealthcard == 'Y') ? langStr["str_128"] : langStr["str_129"]);
                var applyDateDetail = langStr["str_145"] + ': ' + clickApplyday;
                var statusDetail = langStr["str_146"] + ': ' + clickDealwith;
                var dealdayDetail = langStr["str_147"] + ': ' + clickDealday;
                $("#perviewApplyDate").text(applyDateDetail);
                $("#perviewStatus").text(statusDetail);
                $("#perviewDealday").text(dealdayDetail);
               
            } else if (detailType == "newApply") {
                $("#perviewApplyDate").hide();
                $("#perviewStatus").hide();
                $("#perviewDealday").hide();
                var preDate = langStr["str_116"] + ': ' + applyDateVal;
                var preReason = langStr["str_117"] + ': ' + reasonVal;
                var preSubsidy = langStr["str_133"] + ': ' + ((subsidyVal == 'subsidyYes') ? langStr["str_128"] : langStr["str_129"]); 
                var preCertificate = langStr["str_134"] + ': ' + ((certiVal == 'certiYes') ? langStr["str_128"] : langStr["str_129"]);
                var preHealthcard = langStr["str_120"] + ': ' + ((cardVal == 'cardYes') ? langStr["str_128"] : langStr["str_129"]);
            }*/
            $("#previewNameAge").text(preNameAge);
            $("#previewBirthday").text(clickBirth);
            $("#previewID").text(clickID);
            $("#previewDate").text(preDate);
            $("#previewReason").text(preReason);
            $("#previewSubsidy").text(preSubsidy); 
            $("#previewCertificate").text(preCertificate);
            $("#previewHealthcard").text(preHealthcard);
                
        }

        /********************************** page event *************************************/
        $("#viewApplyInsurance").one("pagebeforeshow", function (event, ui) {
            $("#applyRemark").attr("placeholder", langStr["str_130"]);
        });

        $("#viewApplyInsurance").on("pageshow", function (event, ui) {     
            if (nextPage == "addDetail") {  
                $('.apply-insur-title').show();
                $('.family-insur-title').hide();   
                $('#backPersonalInsuranceFromApply').show();
                $('#backPersonalInsuranceFromDetail').hide();
                $('#viewInsurApplication').show();
                $('#previewBtn').show();
                $('#backWithdrawDetail').hide();
                $('#backApplyInsurance').hide();
                $('#viewPreviewApplication').hide();
                setDefaultStatus();
                checkFormByApplyInsur();
            } else {                  
                $('.family-insur-title').show();
                $('.apply-insur-title').hide();
                $('#backPersonalInsuranceFromDetail').show(); 
                $('#backPersonalInsuranceFromApply').hide();
                //加保/退保/停保/復保資訊 隱藏字串  
                $('.new-insur-info').hide(); 
                $('.withdraw-insur-info').hide(); 
                $('.stop-insur-info').hide();     
                $('.recover-insur-info').hide(); 
                //隱藏單顆&雙顆按鈕
                $('.apply-button-style').hide();  
                $('.two-button-style').hide(); 
                $('#applyBtn').hide();
                $('#cancelBtn').hide(); 
                $('#insurBtn').hide();                            
                $('#viewPreviewApplication').show(); 
                $('#viewInsurApplication').hide();                
                $('#previewBtn').hide(); 
                $('#backWithdrawDetail').hide();
                $('#backApplyInsurance').hide();  
                if (nextPage == "withdrawDetail") {
                    detailType = "withdraw"; 
                    $('.withdraw-insur-info').show();
                    $('.apply-button-style').show();              
                    $('#insurBtn').show();                   
                } else if (nextPage == "pendingDetail") {
                    detailType = "pending";                    
                    if (clickDealwith == "加保待處理") {
                        $('.new-insur-info').show(); 
                    } else if (clickDealwith == "退保待處理") {
                        $('.withdraw-insur-info').show();  
                    } else if (clickDealwith == "停保待處理") {
                        $('.stop-insur-info').show(); 
                    } else if (clickDealwith == "復保待處理") {
                        $('.recover-insur-info').show();
                    }
                    $('.apply-button-style').show();  
                    $('#cancelBtn').show();
                } else if (nextPage == "appliedDetail") {
                    detailType = "applied";
                    $('.new-insur-info').show();
                    $('.two-button-style').show();                   
                }    
                changeToDetailPage(detailType);                    
            }
            loadingMask("hide");
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
        //從保險申請頁面返回到個人保險現況，彈窗popup
        $("#backPersonalInsuranceFromApply").on("click", function () {
            popupMsgInit('.confirmCancelApply');
        });

        //從保險明細返回到個人保險現況，
        $("#backPersonalInsuranceFromDetail").on("click", function () {
            $.mobile.changePage("#viewPersonalInsurance");
        });

        //返回到保險申請，彈窗popup
        $("#backApplyInsurance").on("click", function () {
            $('#backPersonalInsuranceFromApply').show();
            $("#viewInsurApplication").show();
            $("#previewBtn").show();
            $('#backApplyInsurance').hide();
            $("#viewPreviewApplication").hide();
        });

        //返回到退保明細
        $('#backWithdrawDetail').on("click", function () {
            $('#backWithdrawDetail').hide();
            $("#viewInsurApplication").hide();
            $("#previewBtn").hide();
            $('#backPersonalInsuranceFromDetail').show();      
            $('.withdraw-insur-info').show();
            $('.new-insur-info').hide();     
            $("#viewPreviewApplication").show();
        });

        //預覽送簽按鈕
        $("#previewBtn").on("click", function() {
            if ($('#previewBtn').hasClass('insurPreview-active-btn')) {
                detailType = "newApply";
                changeToDetailPage(detailType);
                $('.apply-button-style').show();  
                $('.two-button-style').hide(); 
                $("#applyBtn").show();
                $("#cancelBtn").hide(); 
                $("#insurBtn").hide();
                $('#backPersonalInsuranceFromApply').hide();
                $('#backWithdrawDetail').hide();
                $("#viewInsurApplication").hide();
                $("#previewBtn").hide();
                $('.withdraw-insur-info').hide();
                $('#backApplyInsurance').show();
                $('.new-insur-info').show();
                $("#viewPreviewApplication").show();
            }
        });

        //確定送出按鈕
        $("#applyBtn").on("click", function() {
            QueryModifyHealthInsurance();
        });  

        //加保按鈕
        $("#insurBtn").on("click", function() {            
            $('#backWithdrawDetail').show();
            $('.withdraw-insur-info').show();
            $("#viewInsurApplication").show();
            $("#previewBtn").show();
            $('#backPersonalInsuranceFromDetail').hide();
            $('#backApplyInsurance').hide();
            $("#viewPreviewApplication").hide();
            setDefaultStatus();
            checkFormByApplyInsur();
        }); 

        //取消申請按鈕
        $("#cancelBtn").on("click", function() {
            $(".confirmCancelPendingApply .main-cancel").text(clickFamilyName);
            popupMsgInit('.confirmCancelPendingApply');
        });
        
        //確定取消新增，跳轉
        $("#confirmCancelApplyBtn").on("click", function () {
            $.mobile.changePage("#viewPersonalInsurance"); 
        });

        //確定取消申請，跳轉
        $("#confirmCancelPendingApplyBtn").on("click", function () {
            QueryModifyHealthInsurance();             
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
    }
});