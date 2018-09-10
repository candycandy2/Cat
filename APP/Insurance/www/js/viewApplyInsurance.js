
$("#viewApplyInsurance").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var applyDate, applyDateVal, reasonVal, subsidyVal, certiVal, cardVal, remarkVal, detailType, applyType = "";

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
                if (applyType == "applyInsur") {
                    strApplyType = '健保加保';
                } else if (applyType == "withdrawInsur") { 
                    strSubsidy = ''; 
                    strHealthcard = '';
                    strApplyType = '健保退保';
                } else if (applyType == "stopInsur") {
                    strSubsidy = ''; 
                    strHealthcard = '';
                    strApplyType = '健保停保';
                } else if (applyType == "recoverInsur") {
                    strApplyType = '健保復保';
                }
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

        //停保原因DDL生成
        function getStopReasonList() {
            //初始化           
            $("#stopReason").html("");
            $("#stopReason-popup").remove();
            $(document).off("click", "#stopReason-popup-option");
            $("#stopReason-popup-option").popup("destroy").remove();

            var options = [{value: "20", text: "預定出國六個月以上" }, 
                           {value: "21", text: "因羈押二個月以上"}];

            var defaultReason = "預定出國六個月以上";

            var stopReasonData = {
                id: "stopReason-popup",
                option: options,
                defaultText: defaultReason,
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };
            //生成申請加保reason dropdownlist
            tplJS.DropdownList("viewApplyInsurance", "stopReason", "prepend", "typeB", stopReasonData);
        }

        //復保原因DDL生成
        function getRecoverReasonList() {
            //初始化           
            $("#recoverReason").html("");
            $("#recoverReason-popup").remove();
            $(document).off("click", "#recoverReason-popup-option");
            $("#recoverReason-popup-option").popup("destroy").remove();

            var options = [{value: "22", text: "回國" }];

            var defaultReason = "回國";

            var recoverReasonData = {
                id: "recoverReason-popup",
                option: options,
                defaultText: defaultReason,
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };
            //生成申請加保reason dropdownlist
            tplJS.DropdownList("viewApplyInsurance", "recoverReason", "prepend", "typeB", recoverReasonData);
        }

        function setDefaultStatus(applyType) {
            var today = new Date();
            var month = ((today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1 );
            var date = ((today.getDate() < 10) ? '0' + today.getDate() : today.getDate());
            var todayStr = today.getFullYear() + '/' + month + '/' + date;
            $("#familyName").text(clickFamilyName);
            $("#applyDate").val(todayStr);
            $(".insurDate").text("");
            $(".apply-insurance-ddl").hide();
            $(".withdraw-insurance-ddl").hide();
            $(".stop-insurance-ddl").hide(); 
            $(".recover-insurance-ddl").hide();           
            if (applyType == "applyInsur") {
                //加保畫面
                $(".insurDate").text(langStr["str_116"]);
                $(".apply-insurance-ddl").show();
                getApplyReasonList();
                $("#newSubsidy").show();
                $("#newHealthcard").show(); 
            } else if (applyType == "withdrawInsur") {
                //退保畫面  
                $(".insurDate").text(langStr["str_122"]);     
                $(".withdraw-insurance-ddl").show();
                getWithdrawReasonList();
                $("#newSubsidy").hide();
                $("#newHealthcard").hide();
            } else if (applyType == "stopInsur") {
                //停保畫面  
                $(".insurDate").text(langStr["str_124"]);
                $(".stop-insurance-ddl").show();     
                getStopReasonList();
                $("#newSubsidy").hide();
                $("#newHealthcard").hide();
            } else if (applyType == "recoverInsur") {
                //復保畫面  
                $(".insurDate").text(langStr["str_126"]);
                $(".recover-insurance-ddl").show(); 
                getRecoverReasonList();
                $("#newSubsidy").show();
                $("#newHealthcard").show();
            }
            $("#subsidyNo").prop("checked", "checked");
            $("#certiNo").prop("checked", "checked");
            $("#cardNo").prop("checked", "checked");
            $('#applyRemark').val('');    
        }

        //檢查所有欄位是否爲空
        function checkFormByApplyInsur(applyType) {
            nameVal = $.trim($("#familyName").text());
            applyDateVal = $.trim($("#applyDate").val());               
            certiVal = $("#newCertificate :radio:checked").val();
            remarkVal = $.trim($("#applyRemark").val());
            subsidyVal = $("#newSubsidy :radio:checked").val();
            cardVal = $("#newHealthcard :radio:checked").val();
            if (applyType == "applyInsur") {
                reasonVal = $.trim($("#applyReason").text());  
                if (nameVal !== "" && applyDateVal !== "" && reasonVal !== "" && subsidyVal !== undefined && certiVal !== undefined && cardVal !== undefined && remarkVal !== "") {
                    $('#previewBtn').addClass('insurPreview-active-btn');
                } else {
                    $('#previewBtn').removeClass('insurPreview-active-btn');
                }
            } else if (applyType == "withdrawInsur") {
                reasonVal = $.trim($("#withdrawReason").text());  
                //退保需檢查的欄位
                if (nameVal !== "" && applyDateVal !== "" && reasonVal !== "" && certiVal !== undefined && remarkVal !== "") {
                    $('#previewBtn').addClass('insurPreview-active-btn');
                } else {
                    $('#previewBtn').removeClass('insurPreview-active-btn');
                }
            } else if (applyType == "stopInsur") {
                reasonVal = $.trim($("#stopReason").text());  
                //退保需檢查的欄位
                if (nameVal !== "" && applyDateVal !== "" && reasonVal !== "" && certiVal !== undefined && remarkVal !== "") {
                    $('#previewBtn').addClass('insurPreview-active-btn');
                } else {
                    $('#previewBtn').removeClass('insurPreview-active-btn');
                }
            } else if (applyType == "recoverInsur") {
                reasonVal = $.trim($("#recoverReason").text());
                if (nameVal !== "" && applyDateVal !== "" && reasonVal !== "" && subsidyVal !== undefined && certiVal !== undefined && cardVal !== undefined && remarkVal !== "") {
                    $('#previewBtn').addClass('insurPreview-active-btn');
                } else {
                    $('#previewBtn').removeClass('insurPreview-active-btn');
                }
            }
        }

        function changeToDetailPage(detailType) {
            var preNameAge = clickFamilyName + '/' + clickRelation + '/' + clickAge;
            if (detailType == "newApply") {
                $("#perviewApplyDate").hide();
                $("#perviewStatus").hide();
                $("#perviewDealday").hide();
                if (applyType == "applyInsur") {
                    $("#previewSubsidy").show();
                    $("#previewHealthcard").show();
                    var preDate = langStr["str_116"] + ': ' + applyDateVal;
                    var preReason = langStr["str_117"] + ': ' + reasonVal;
                } else if (applyType == "withdrawInsur") {
                    $("#previewSubsidy").hide();
                    $("#previewHealthcard").hide();
                    var preDate = langStr["str_122"] + ': ' + applyDateVal;
                    var preReason = langStr["str_123"] + ': ' + reasonVal;
                } else if (applyType == "stopInsur") {
                    $("#previewSubsidy").hide();
                    $("#previewHealthcard").hide();
                    var preDate = langStr["str_124"] + ': ' + applyDateVal;
                    var preReason = langStr["str_125"] + ': ' + reasonVal;
                } else if (applyType == "recoverInsur") {
                    $("#previewSubsidy").show();
                    $("#previewHealthcard").show();
                    var preDate = langStr["str_126"] + ': ' + applyDateVal;
                    var preReason = langStr["str_127"] + ': ' + reasonVal;
                }          
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
                if (detailType == "pending") {
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
                    //待處理，不顯示處理日期
                    $("#perviewDealday").hide();
                } else {
                    if (detailType == "withdraw") {
                        var preDate = langStr["str_122"] + ': ' + clickApplyday;
                        var preReason = langStr["str_123"] + ': ' + clickReason;
                    } else if (detailType == "applied" || detailType == "failapplied") {
                        var preDate = langStr["str_116"] + ': ' + clickApplyday;
                        var preReason = langStr["str_117"] + ': ' + clickReason;
                    } else if (detailType == "stop") {
                        var preDate = langStr["str_124"] + ': ' + clickApplyday;
                        var preReason = langStr["str_125"] + ': ' + clickReason;
                    } else if (detailType == "recover") {
                        var preDate = langStr["str_126"] + ': ' + clickApplyday;
                        var preReason = langStr["str_127"] + ': ' + clickReason;
                    }
                    //顯示處理狀態並傳值
                    $("#perviewDealday").show();
                    var dealdayDetail = langStr["str_147"] + ': ' + clickDealday;
                    $("#perviewDealday").text(dealdayDetail);
                }           
            }
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
            $('.apply-insur-title').text("");   
            if (nextPage == "addDetail") {  
                $('.apply-insur-title').text(langStr["str_111"]);   
                $('#backPersonalInsuranceFromApply').show();
                $('#backPersonalInsuranceFromDetail').hide();
                $('#viewInsurApplication').show();
                $('#previewBtn').show();
                $('#backWithdrawDetail').hide();
                $('#backApplyInsurance').hide();
                $('#viewPreviewApplication').hide();
                applyType = "applyInsur";
                setDefaultStatus(applyType);
                checkFormByApplyInsur(applyType);
            } else {      
                $('.apply-insur-title').text(langStr["str_154"]);            
                $('#backPersonalInsuranceFromDetail').show(); 
                $('#backPersonalInsuranceFromApply').hide();
                //加保/退保/停保/復保資訊 清空字串  
                $('.insur-info-title').text("");
                //隱藏單顆&雙顆按鈕
                $('.apply-button-style').hide();  
                $('.two-button-style').hide(); 
                $('#applyBtn').hide();
                $('#cancelBtn').hide(); 
                $('#insurBtn').hide();
                $('#recoverBtn').hide();                             
                $('#viewPreviewApplication').show(); 
                $('#viewInsurApplication').hide();                
                $('#previewBtn').hide(); 
                $('#backWithdrawDetail').hide();
                $('#backApplyInsurance').hide();  
                if (nextPage == "withdrawDetail") {
                    detailType = "withdraw"; 
                    $('.insur-info-title').text(langStr["str_149"]);
                    $('.apply-button-style').show();              
                    $('#insurBtn').show();                   
                } else if (nextPage == "pendingDetail") {
                    detailType = "pending";                    
                    if (clickDealwith == "加保待處理") {
                        $('.insur-info-title').text(langStr["str_132"]);
                    } else if (clickDealwith == "退保待處理") {
                        $('.insur-info-title').text(langStr["str_149"]);
                    } else if (clickDealwith == "停保待處理") {
                        $('.insur-info-title').text(langStr["str_152"]);
                    } else if (clickDealwith == "復保待處理") {
                        $('.insur-info-title').text(langStr["str_153"]);
                    }
                    $('.apply-button-style').show();  
                    $('#cancelBtn').show();
                } else if (nextPage == "appliedDetail") {
                    detailType = "applied";
                    $('.insur-info-title').text(langStr["str_132"]);
                    $('.two-button-style').show();                   
                } else if (nextPage == "failedInsurDetail") {
                    detailType = "failapplied";
                    $('.insur-info-title').text(langStr["str_132"]);
                    $('.apply-button-style').show();  
                    $('#insurBtn').show();
                } else if (nextPage == "cancelStopInsur") {
                    if (clickDealwith == "取消退保") { 
                        detailType = "withdraw";
                        $('.insur-info-title').text(langStr["str_149"]);
                    } else if (clickDealwith == "取消停保" || clickDealwith == "停保駁回") { 
                        detailType = "stop";
                        $('.insur-info-title').text(langStr["str_152"]);
                    } else if (clickDealwith == "已復保") { 
                        detailType = "recover";
                        $('.insur-info-title').text(langStr["str_153"]);
                    } 
                    $('.two-button-style').show(); 
                } else if (nextPage == "failedRecoverDetail") {
                    if (clickDealwith == "已停保") { 
                        detailType = "stop";
                        $('.insur-info-title').text(langStr["str_152"]);
                    } else if (clickDealwith == "取消復保" || clickDealwith == "復保駁回" || clickDealwith == "復保暫存") {
                        detailType = "recover";
                        $('.insur-info-title').text(langStr["str_153"]);
                    }
                    $('.apply-button-style').show();  
                    $('#recoverBtn').show();
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
            checkFormByApplyInsur(applyType);
        });


        /********************************** dom event *************************************/
        //從保險申請頁面返回到個人保險現況，彈窗popup
        $("#backPersonalInsuranceFromApply").on("click", function () {
            popupMsgInit('.confirmCancelApply');
        });

        //從保險明細返回到個人保險現況，
        $("#backPersonalInsuranceFromDetail").on("click", function () {
            $('#backPersonalInsuranceFromDetail').hide(); 
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
            popupMsgInit('.confirmCancelApplyToDetail');
        });

        $('#applyReason').on("click", function () {
            $('#viewApplyInsurance').css({
                'position': 'fixed'
            }); 
            $("#applyReason-popup-option-popup").css({
                'position': 'fixed'
            }); 
        });

        $('#withdrawReason').on("click", function () {
            $('#viewApplyInsurance').css({
                'position': 'fixed'
            }); 
            $("#withdrawReason-popup-option-popup").css({
                'position': 'fixed'
            }); 
        });

        $('#stopReason').on("click", function () {
            $('#viewApplyInsurance').css({
                'position': 'fixed'
            }); 
            $("#stopReason-popup-option-popup").css({
                'position': 'fixed'
            }); 
        });

        $('#recoverReason').on("click", function () {
            $('#viewApplyInsurance').css({
                'position': 'fixed'
            }); 
            $("#recoverReason-popup-option-popup").css({
                'position': 'fixed'
            }); 
        });

        //預覽送簽按鈕
        $("#previewBtn").on("click", function() {
            if ($('#previewBtn').hasClass('insurPreview-active-btn')) {
                window.scrollBy(0, -50); 
                detailType = "newApply";
                changeToDetailPage(detailType);
                $('.apply-button-style').show();  
                $('.two-button-style').hide(); 
                $('#applyBtn').show();
                $('#cancelBtn').hide(); 
                $('#insurBtn').hide();
                $('#recoverBtn').hide();
                $('#backPersonalInsuranceFromApply').hide();
                $('#backWithdrawDetail').hide();
                $('#viewInsurApplication').hide();
                $('#previewBtn').hide();
                $('#backApplyInsurance').show();
                $('.insur-info-title').text("");
                if (applyType == "applyInsur") {
                    $('.insur-info-title').text(langStr["str_132"]);
                } else if (applyType == "withdrawInsur") {
                    $('.insur-info-title').text(langStr["str_149"]);
                } else if (applyType == "stopInsur") {
                    $('.insur-info-title').text(langStr["str_152"]);
                } else if (applyType == "recoverInsur") {
                    $('.insur-info-title').text(langStr["str_153"]);
                }                      
                $('#viewPreviewApplication').show();
            }
        });

        //確定送出按鈕
        $("#applyBtn").on("click", function() {
            QueryModifyHealthInsurance();
        });  

        //加保按鈕
        $("#insurBtn").on("click", function() { 
            $('.apply-insur-title').text("");
            $('.apply-insur-title').text(langStr["str_111"]);           
            $('#backWithdrawDetail').show();
            $('#viewInsurApplication').show();
            $('#previewBtn').show();
            $('#backPersonalInsuranceFromDetail').hide();
            $('#backApplyInsurance').hide();
            $('#viewPreviewApplication').hide();
            applyType = "applyInsur";
            setDefaultStatus(applyType);
            checkFormByApplyInsur(applyType);
        }); 

        //取消申請按鈕
        $("#cancelBtn").on("click", function() {
            $(".confirmCancelPendingApply .main-cancel").text(clickFamilyName);
            popupMsgInit('.confirmCancelPendingApply');
        });
        
        //確定取消新增，跳轉
        $("#confirmCancelApplyBtn").on("click", function () {
            $('#backPersonalInsuranceFromApply').hide();
            $.mobile.changePage("#viewPersonalInsurance"); 
        });

        //確定取消新增，跳轉至明細
        $("#confirmCancelApplyToDetailBtn").on("click", function () {
            $('#backWithdrawDetail').hide();
            $("#viewInsurApplication").hide();
            $("#previewBtn").hide();
            $('#backPersonalInsuranceFromDetail').show();      
            $("#viewPreviewApplication").show();
        });

        //確定取消申請，跳轉
        $("#confirmCancelPendingApplyBtn").on("click", function () {
            QueryModifyHealthInsurance();             
        });

        $("#withdrawBtn").on("click", function () {
            $('.apply-insur-title').text(""); 
            $('.apply-insur-title').text(langStr["str_112"]); 
            $('#backWithdrawDetail').show();
            $('#viewInsurApplication').show();
            $('#previewBtn').show();
            $('#backPersonalInsuranceFromDetail').hide();          
            $('#viewPreviewApplication').hide();
            applyType = "withdrawInsur";
            setDefaultStatus(applyType);
            checkFormByApplyInsur(applyType);
        });

        $("#stopBtn").on("click", function () {
            $('.apply-insur-title').text(""); 
            $('.apply-insur-title').text(langStr["str_113"]); 
            $('#backWithdrawDetail').show();
            $('#viewInsurApplication').show();
            $('#previewBtn').show();
            $('#backPersonalInsuranceFromDetail').hide();          
            $('#viewPreviewApplication').hide();
            applyType = "stopInsur";
            setDefaultStatus(applyType);
            checkFormByApplyInsur(applyType);
        });

        $("#recoverBtn").on("click", function () {
            $('.apply-insur-title').text(""); 
            $('.apply-insur-title').text(langStr["str_114"]); 
            $('#backWithdrawDetail').show();
            $('#viewInsurApplication').show();
            $('#previewBtn').show();
            $('#backPersonalInsuranceFromDetail').hide();          
            $('#viewPreviewApplication').hide();
            applyType = "recoverInsur";
            setDefaultStatus(applyType);
            checkFormByApplyInsur(applyType);
        });      

        $(document).on("change", "#newSubsidy", function() {
            checkFormByApplyInsur(applyType);
        });

        $(document).on("change", "#newCertificate", function() {
            checkFormByApplyInsur(applyType);
        });

        $(document).on("change", "#newHealthcard", function() {
            checkFormByApplyInsur(applyType);
        });
        
        $(document).on("popupafterclose", "#applyReason-popup-option", function() { 
            $('#viewApplyInsurance').css({
                'position': ''
            }); 
            $("#applyReason-popup-option-popup").css({
                'position': ''
            }); 
            checkFormByApplyInsur(applyType);
        });

        $(document).on("popupafterclose", "#withdrawReason-popup-option", function() { 
            $('#viewApplyInsurance').css({
                'position': ''
            }); 
            $("#withdrawReason-popup-option-popup").css({
                'position': ''
            }); 
            checkFormByApplyInsur(applyType);
        });

        $(document).on("popupafterclose", "#stopReason-popup-option", function() { 
            $('#viewApplyInsurance').css({
                'position': ''
            }); 
            $("#stopReason-popup-option-popup").css({
                'position': ''
            }); 
            checkFormByApplyInsur(applyType);
        });

        $(document).on("popupafterclose", "#recoverReason-popup-option", function() { 
            $('#viewApplyInsurance').css({
                'position': ''
            }); 
            $("#recoverReason-popup-option-popup").css({
                'position': ''
            }); 
            checkFormByApplyInsur(applyType);
        });

        $(document).keyup(function(e) {
            checkFormByApplyInsur(applyType);
        });
    }
});