/*var healthInsurArr = [{emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"1", name:"王小明", relation:"父母", birthday:"1980/01/01", idno:"A123456789", group:"眷屬健保在保", insuredday:"2017-01-01", reason:"", subsidy:"1", certificate:"N", healthcard:"N", applyday:"2017-01-01", dealwith:"已加保", dealwithday:"2017-01-01", remark:"", can_apply:"停保+退保"},
                      {emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"2", name:"王小美", relation:"父母", birthday:"1980/01/02", idno:"A223456788", group:"眷屬健保在保", insuredday:"2017-01-01", reason:"", subsidy:"1", certificate:"Y", healthcard:"Y", applyday:"2017-01-01", dealwith:"已加保", dealwithday:"2017-01-01", remark:"", can_apply:"停保+退保"},
                      {emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"3", name:"王晶晶", relation:"祖父母", birthday:"1950/01/02", idno:"A223456888", group:"眷屬健保不在保", insuredday:"", reason:"", subsidy:"5", certificate:"N", healthcard:"Y", applyday:"2017-01-01", dealwith:"未申請", dealwithday:"", remark:"", can_apply:"加保"},
                      {emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"4", name:"王囧囧", relation:"祖父母", birthday:"1950/01/01", idno:"A123456889", group:"眷屬健保不在保", insuredday:"", reason:"", subsidy:"5", certificate:"N", healthcard:"Y", applyday:"2017-01-01", dealwith:"已停保", dealwithday:"", remark:"", can_apply:"加保"}];*/
/*var groupInsurArr = [{emplid:"1607001", name:"林偉人", goupinsurancetype:"自費一般險(南山)", groupinsurancefun:"本人自費一般險A方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林小明", goupinsurancetype:"自費一般險(南山)", groupinsurancefun:"祖父母自費一般險A方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林偉人", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"本人自費一般險B方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林小明", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"祖父母自費一般險B方案", insuredday:"2017-10-01", status:"生效"}];*/
/*var groupInsurArr = [{emplid:"1607001", name:"林偉人", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"本人自費一般險B方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林小明", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"祖父母自費一般險B方案", insuredday:"2017-10-01", status:"生效"}];*/
var healthInsurArr = {};

$("#viewPersonalInsurance").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/
        window.APIRequest = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        }; 

        //API:QueryGroupInsuranceData      
        window.QueryGroupInsuranceList = function() {
            loadingMask("show");
            var self = this;
            var queryData = '<empid>'+ myEmpNo +'</empid>';
            this.successCallback = function(data) {
                if (data['ResultCode'] === "1") { 
                    var groupInsurArr = data['Content'];
                    if (groupInsurArr.length === 0){
                        var normalInsurList = '<div class="empty-list"><div>無</div></div>';               
                        $("#normalInsur").empty().append(normalInsurList);
                        $("#accidentInsur").empty().append(normalInsurList);
                    }else {
                        var normalInsurList = ""; 
                        var accidentInsurList = "";
                        var isNormalInsur = false;
                        var isAccidentInsur = false;
                        
                        for (var i=0; i<groupInsurArr.length; i++ ) {
                            var groupInsurType = groupInsurArr[i]["goupinsurancetype"];
                            if (groupInsurType.substr(0,5) == "自費一般險"){
                                normalInsurList += '<div class="group-list"><div><span>'
                                + groupInsurArr[i]["name"]
                                + '</span>/<span>'
                                + groupInsurArr[i]["groupinsurancefun"]
                                + '</span></div><div><span>'
                                + groupInsurArr[i]["insuredday"]
                                + '</span><span>' 
                                + groupInsurArr[i]["status"]
                                + '</span></div></div><div class="activity-line"></div>';
                                isNormalInsur = true;
                            }  
                            if (groupInsurType.substr(0,5) == "自費意外險"){
                                accidentInsurList += '<div class="group-list"><div><span>'
                                + groupInsurArr[i]["name"]
                                + '</span>/<span>'
                                + groupInsurArr[i]["groupinsurancefun"]
                                + '</span></div><div><span>'
                                + groupInsurArr[i]["insuredday"]
                                + '</span><span>' 
                                + groupInsurArr[i]["status"]
                                + '</span></div></div><div class="activity-line"></div>';
                                isAccidentInsur = true;
                            }                     
                        }
                        if (isNormalInsur == true){
                            $("#normalInsur").empty().append(normalInsurList).children("div:last-child").remove();
                        }else if (isNormalInsur == false){
                            var normalInsurList = '<div class="empty-list"><div>無</div></div>';               
                            $("#normalInsur").empty().append(normalInsurList);
                        }
                        if (isAccidentInsur == true){
                            $("#accidentInsur").empty().append(accidentInsurList).children("div:last-child").remove();
                        }else if (isAccidentInsur == false){
                            var accidentInsurList = '<div class="empty-list"><div>無</div></div>';               
                            $("#accidentInsur").empty().append(accidentInsurList);
                        }
                    }
                    loadingMask("hide");
                } else if (data['ResultCode'] === "046904") {
                    var groupInsurArr = data['Content'];
                    if (groupInsurArr.length === 0){
                        var normalInsurList = '<div class="empty-list"><div>無</div></div>';               
                        $("#normalInsur").empty().append(normalInsurList);
                        $("#accidentInsur").empty().append(normalInsurList);
                    }
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryGroupInsuranceData", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        //API:QueryHealthInsuranceFamily  
        window.QueryHealthInsuranceList = function() {
            loadingMask("show");
            var self = this;
            var queryData = '<empid>'+ myEmpNo +'</empid>';
            this.successCallback = function(data) { 
                if (data['ResultCode'] === "1") {
                    healthInsurArr = data['Content'];
                    if (healthInsurArr.length === 0) {
                        var healthInsurList = '<div class="empty-list"><div>無</div></div>';                
                        $("#inHealthInsur").empty().append(healthInsurList);
                        $("#nonHealthInsur").empty().append(healthInsurList);
                    }else {
                        var healthInsurList = ""; 
                        var nonHealthInsurList = "";
                        var dealwithStr, canapplyStr = "";
                        var inInsur= false;
                        var notInsur = false;
                        for (var i=0; i<healthInsurArr.length; i++ ) {
                            dealwithStr = $.trim(healthInsurArr[i]["dealwith"]);
                            canapplyStr = $.trim(healthInsurArr[i]["can_apply"]);
                            if (healthInsurArr[i]["group"] == "眷屬健保在保") {   
                                if (dealwithStr == "已加保"){
                                    var familyDetailList = '<div class="health-insur-list"><div class="content-list-only-img" data-id="';
                                    var familyImgList = '<div class="list-only-img"><img src="img/100_btn_nextpage.png" class="family-next">';
                                } else {
                                    var familyDetailList = '<div class="health-insur-list"><div class="content-list-text-img" data-id="';
                                    var familyImgList = '<div class="list-text-img"><label class="font-style12"><span>' + dealwithStr +'</span></label><img src="img/100_btn_nextpage.png" id="insurTextNextBtn" class="family-text-img">';
                                }                   
                                healthInsurList += familyDetailList
                                + healthInsurArr[i]["family_id"]
                                + '"><div><span>'
                                + healthInsurArr[i]["name"]
                                + '</span>/<span>'
                                + healthInsurArr[i]["relation"]
                                + '</span></div><div>'
                                + healthInsurArr[i]["birthday"]
                                + '</div><div>'
                                + healthInsurArr[i]["idno"]
                                + '</div></div>'
                                + familyImgList
                                + '</div></div><div class="activity-line"></div>';
                                inInsur = true;
                                familyDetailList, familyImgList = "";
                            }
                            if (healthInsurArr[i]["group"] == "眷屬健保不在保") {
                                if (dealwithStr == "未申請" && canapplyStr == "加保") {
                                    var familyDetailList = '<div class="health-insur-list"><div class="content-list-only-img" data-id="';
                                    var familyImgList = '<div class="list-only-img"><img src="img/024_btn_addfriend.png" class="family-add">';
                                } else if (canapplyStr == "取消申請" || canapplyStr == "復保") {
                                    var familyDetailList = '<div class="health-insur-list"><div class="content-list-text-img" data-id="';
                                    var familyImgList = '<div class="list-text-img"><label class="font-style12"><span>' + dealwithStr +'</span></label><img src="img/100_btn_nextpage.png" id="textNextBtn" class="family-text-img">';
                                } else if (canapplyStr == "加保") {
                                    var familyDetailList = '<div class="health-insur-list"><div class="content-list-text-img" data-id="';
                                    var familyImgList = '<div class="list-text-img"><label class="font-style12"><span>' + dealwithStr +'</span></label><img src="img/024_btn_addfriend.png" id="addNextBtn" class="family-text-img">';
                                }
                                nonHealthInsurList += familyDetailList
                                + healthInsurArr[i]["family_id"]
                                + '"><div><span>'
                                + healthInsurArr[i]["name"]
                                + '</span>/<span>'
                                + healthInsurArr[i]["relation"]
                                + '</span></div><div>'
                                + healthInsurArr[i]["birthday"]
                                + '</div><div>'
                                + healthInsurArr[i]["idno"]
                                + '</div></div>'
                                + familyImgList
                                + '</div></div><div class="activity-line"></div>';
                                
                                notInsur = true;
                                familyDetailList, familyImgList = "";
                            }
                        }
                        if (inInsur == true){
                            $("#inHealthInsur").empty().append(healthInsurList).children("div:last-child").remove();
                        }else if (inInsur == false){
                            var healthInsurList = '<div class="empty-list"><div>無</div></div>';               
                            $("#inHealthInsur").empty().append(healthInsurList);
                        }
                        if (notInsur == true){
                            $("#nonHealthInsur").empty().append(nonHealthInsurList).children("div:last-child").remove();
                        }else if (notInsur == false){
                             var nonHealthInsurList = '<div class="empty-list"><div>無</div></div>';               
                            $("#nonHealthInsur").empty().append(nonHealthInsurList);
                        }                
                        
                    }  
                    var inHealthChangeWidth = $('#inHealthInsur').children(1).find(".list-text-img > label > span").filter(function(item){
                        var nonHealthStatusHTML = $('#inHealthInsur').children(1).find(".list-text-img > label > span")[item];
                        if (nonHealthStatusHTML.textContent.length == 5) {
                            $('#inHealthInsur').children(1).find(".content-list-text-img")[item].style.width = "60vw";
                            $('#inHealthInsur').children(1).find(".list-text-img")[item].style.width = "26.5vw";
                        } else if (nonHealthStatusHTML.textContent.length == 4) {  
                            $('#inHealthInsur').children(1).find(".content-list-text-img")[item].style.width = "63.5vw";
                            $('#inHealthInsur').children(1).find(".list-text-img")[item].style.width = "23vw";
                        }            
                    });              
                    var nonHealthChangeWidth = $('#nonHealthInsur').children(1).find(".list-text-img > label > span").filter(function(item){
                        var nonHealthStatusHTML = $('#nonHealthInsur').children(1).find(".list-text-img > label > span")[item];
                        if (nonHealthStatusHTML.textContent.length == 5) {
                            $('#nonHealthInsur').children(1).find(".content-list-text-img")[item].style.width = "60vw";
                            $('#nonHealthInsur').children(1).find(".list-text-img")[item].style.width = "26.5vw";
                        } else if (nonHealthStatusHTML.textContent.length == 4) {
                            $('#nonHealthInsur').children(1).find(".content-list-text-img")[item].style.width = "63.5vw";
                            $('#nonHealthInsur').children(1).find(".list-text-img")[item].style.width = "23vw";
                        }               
                    });              
                    loadingMask("hide");
                } else if (data['ResultCode'] === "046902") {
                    healthInsurArr = data['Content'];
                    if (healthInsurArr.length === 0){
                        var healthInsurList = '<div class="empty-list"><div>無</div></div>';                
                        $("#inHealthInsur").empty().append(healthInsurList);
                        $("#nonHealthInsur").empty().append(healthInsurList);
                    }
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryHealthInsuranceFamily", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewPersonalInsurance").one("pagebeforeshow", function(event, ui) {
            $('#pageInsurStatus-1').show();
            $('#pageInsurStatus-2').hide();
            $("label[for=fam-insur-tab-2]").removeClass('ui-btn-active');
            $("label[for=fam-insur-tab-1]").addClass('ui-btn-active');           
        });

        $("#viewPersonalInsurance").on("pageshow", function(event, ui) { 
            $('#pageInsurStatus-1').show();
            $('#pageInsurStatus-2').hide();
            $("label[for=fam-insur-tab-2]").removeClass('ui-btn-active');
            $("label[for=fam-insur-tab-1]").addClass('ui-btn-active');
            if (!viewPersonalInsuranceShow) {
                QueryHealthInsuranceList();
                QueryGroupInsuranceList();
                viewPersonalInsuranceShow = true; 
            } else {
                loadingMask("hide");  
            }  
                     
        });

        /********************************** dom event *************************************/
        $("#fam-insur-tab-1").on('click', function() {
            $("label[for=fam-insur-tab-2]").removeClass('ui-btn-active');
            $("label[for=fam-insur-tab-1]").addClass('ui-btn-active');  
            $('#pageInsurStatus-1').show();
            $('#pageInsurStatus-2').hide();    
        });   

        $("#fam-insur-tab-2").on('click', function() {
            $("label[for=fam-insur-tab-1]").removeClass('ui-btn-active');   
            $("label[for=fam-insur-tab-2]").addClass('ui-btn-active'); 
            $('#pageInsurStatus-2').show();
            $('#pageInsurStatus-1').hide();             
        });  

        function passValueToApplyInsurance(clickFamilyID) {
            var clickFamilyData = healthInsurArr.filter(function(item, index, array){
                if (item.family_id === clickFamilyID){
                    return item.name;
                }
            });
            //將QueryHealthInsuranceFamily回傳的值傳遞至viewApplyInsurance
            clickInsID = $.trim(clickFamilyData[0].ins_id);
            clickAppID = $.trim(clickFamilyData[0].app_id);
            clickFamilyName = $.trim(clickFamilyData[0].name);
            clickRelation = $.trim(clickFamilyData[0].relation);
            clickBirth = $.trim(clickFamilyData[0].birthday);
            clickAge = transferBirthToAge(clickBirth);
            clickID = $.trim(clickFamilyData[0].idno);
            clickCanApply = $.trim(clickFamilyData[0].can_apply);
            clickDealwith = $.trim(clickFamilyData[0].dealwith);
            clickInsuredday = $.trim(clickFamilyData[0].insuredday);
            clickApplyday = $.trim(clickFamilyData[0].applyday);
            clickDealday = $.trim(clickFamilyData[0].dealwithday);
            clickReason = $.trim(clickFamilyData[0].reason);
            clickSubsidy = $.trim(clickFamilyData[0].subsidy);
            clickCerti = $.trim(clickFamilyData[0].certificate);
            clickHealthcard = $.trim(clickFamilyData[0].healthcard);
        }

        $(document).on("click", ".family-add", function() { 
            loadingMask("show");
            nextPage = "addDetail";  
            clickFamilyID = $(this).parents('.health-insur-list').children("div").attr("data-id");       
            passValueToApplyInsurance(clickFamilyID);
            $("#applyBtn").show();
            $("#cancelBtn").hide();            
            $.mobile.changePage("#viewApplyInsurance"); 
        });  

        $(document).on("click", "#insurTextNextBtn", function() { 
            loadingMask("show");        
            clickFamilyID = $(this).parents('.health-insur-list').children("div").attr("data-id");       
            passValueToApplyInsurance(clickFamilyID);
            if (clickCanApply === "停保+退保") {
                nextPage = "cancelStopInsur";
            } else if (clickCanApply === "取消申請") {
                nextPage = "pendingDetail";
            }
            $.mobile.changePage("#viewApplyInsurance");        
        });

        $(document).on("click", "#textNextBtn", function() { 
            loadingMask("show");        
            clickFamilyID = $(this).parents('.health-insur-list').children("div").attr("data-id");       
            passValueToApplyInsurance(clickFamilyID); 
            if (clickCanApply === "取消申請") { 
                nextPage = "pendingDetail";
            } else if (clickCanApply === "復保") {
                nextPage = "failedRecoverDetail";
            }                
            $.mobile.changePage("#viewApplyInsurance");   
        });

        $(document).on("click", "#addNextBtn", function() { 
            loadingMask("show");        
            clickFamilyID = $(this).parents('.health-insur-list').children("div").attr("data-id");       
            passValueToApplyInsurance(clickFamilyID); 
            if (clickDealwith === "已退保") {
                nextPage = "withdrawDetail";
            } else {
                //加保駁回/加保暫存/取消加保
                nextPage = "failedInsurDetail";
            }
            $.mobile.changePage("#viewApplyInsurance"); 
        });

        $(document).on("click", ".family-next", function() {
            loadingMask("show");        
            clickFamilyID = $(this).parents('.health-insur-list').children("div").attr("data-id");       
            passValueToApplyInsurance(clickFamilyID);           
            if (clickCanApply === "停保+退保") {
                nextPage = "appliedDetail";
            } 
            $.mobile.changePage("#viewApplyInsurance"); 
        });             

    }
});
