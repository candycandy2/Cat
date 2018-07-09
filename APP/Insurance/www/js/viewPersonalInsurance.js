var healthInsurArr = [{emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"1", name:"王小明", relation:"父母", birthday:"1980/01/01", idno:"A123456789", group:"眷屬健保在保", insuredday:"2017-01-01", reason:"", subsidy:"1", certificate:"N", healthcard:"N", applyday:"2017-01-01", dealwith:"已加保", dealwithday:"2017-01-01", remark:"", can_apply:"停保+退保"},
                      {emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"2", name:"王小美", relation:"父母", birthday:"1980/01/02", idno:"A223456788", group:"眷屬健保在保", insuredday:"2017-01-01", reason:"", subsidy:"1", certificate:"Y", healthcard:"Y", applyday:"2017-01-01", dealwith:"已加保", dealwithday:"2017-01-01", remark:"", can_apply:"停保+退保"},
                      {emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"3", name:"王晶晶", relation:"祖父母", birthday:"1950/01/02", idno:"A223456888", group:"眷屬健保不在保", insuredday:"", reason:"", subsidy:"5", certificate:"N", healthcard:"Y", applyday:"2017-01-01", dealwith:"未申請", dealwithday:"", remark:"", can_apply:"加保"},
                      {emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"4", name:"王囧囧", relation:"祖父母", birthday:"1950/01/01", idno:"A123456889", group:"眷屬健保不在保", insuredday:"", reason:"", subsidy:"5", certificate:"N", healthcard:"Y", applyday:"2017-01-01", dealwith:"已停保", dealwithday:"", remark:"", can_apply:"加保"}];
/*var groupInsurArr = [{emplid:"1607001", name:"林偉人", goupinsurancetype:"自費一般險(南山)", groupinsurancefun:"本人自費一般險A方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林小明", goupinsurancetype:"自費一般險(南山)", groupinsurancefun:"祖父母自費一般險A方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林偉人", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"本人自費一般險B方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林小明", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"祖父母自費一般險B方案", insuredday:"2017-10-01", status:"生效"}];*/
var groupInsurArr = [{emplid:"1607001", name:"林偉人", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"本人自費一般險B方案", insuredday:"2017-10-01", status:"生效"},
                     {emplid:"1607001", name:"林小明", goupinsurancetype:"自費意外險(南山)", groupinsurancefun:"祖父母自費一般險B方案", insuredday:"2017-10-01", status:"生效"}];

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
        function queryGroupInsuranceList(myEmpNo) {
            loadingMask("show");
            var self = this;
            var queryData = '<empid>'+ myEmpNo +'</empid>';
            //this.successCallback = function(data) {
                //if (data['ResultCode'] === "1") { 
                    //var groupInsurArr = data['Content'];
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
                                + '</span> <span>' 
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
                                + '</span> <span>' 
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
                //}
            //};
            /*var __construct = function() {
                CustomAPI("POST", true, "QueryGroupInsuranceData", self.successCallback, self.failCallback, queryData, "");
            }();*/
        }

        //API:QueryHealthInsuranceFamily  
        function queryHealthInsuranceList(myEmpNo) {
            loadingMask("show");
            var self = this;
            var queryData = '<empid>'+ myEmpNo +'</empid>';
            //this.successCallback = function(data) { 
                //if (data['ResultCode'] === "1") {
                    //var healthInsurArr = data['Content'];
                    if (healthInsurArr.length === 0){
                        var healthInsurList = '<div class="empty-list"><div>無</div></div>';                
                        $("#inHealthInsur").empty().append(healthInsurList);
                        $("#nonHealthInsur").empty().append(healthInsurList);
                    }else {
                        var healthInsurList = ""; 
                        var nonHealthInsurList = "";
                        var inInsur= false;
                        var notInsur = false;
                        for (var i=0; i<healthInsurArr.length; i++ ) {
                            if (healthInsurArr[i]["group"] == "眷屬健保在保"){                        
                                healthInsurList += '<div class="family-list"><div data-id="'
                                + healthInsurArr[i]["family_id"]
                                + '"><div><span>'
                                + healthInsurArr[i]["name"]
                                + '</span>/<span>'
                                + healthInsurArr[i]["relation"]
                                + '</span></div><div>'
                                + healthInsurArr[i]["birthday"]
                                + '</div><div>'
                                + healthInsurArr[i]["idno"]
                                + '</div></div><div><img src="img/100_btn_nextpage.png" class="family-next"></div></div><div class="activity-line"></div>';
                                inInsur = true;
                            }
                            if (healthInsurArr[i]["group"] == "眷屬健保不在保"){
                                nonHealthInsurList += '<div class="family-list"><div data-id="'
                                + healthInsurArr[i]["family_id"]
                                + '"><div><span>'
                                + healthInsurArr[i]["name"]
                                + '</span>/<span>'
                                + healthInsurArr[i]["relation"]
                                + '</span></div><div>'
                                + healthInsurArr[i]["birthday"]
                                + '</div><div>'
                                + healthInsurArr[i]["idno"]
                                + '</div></div><div><img src="img/024_btn_addfriend.png" class="family-add"></div></div><div class="activity-line"></div>';
                                notInsur = true;
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
                    loadingMask("hide");
                //}
            //};

            /*var __construct = function() {
                CustomAPI("POST", true, "QueryHealthInsuranceFamily", self.successCallback, self.failCallback, queryData, "");
            }();*/
        }

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
            var doQueryHealthInsuranceList = new queryHealthInsuranceList(myEmpNo);
            var doQueryGroupInsuranceList = new queryGroupInsuranceList(myEmpNo);                  
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

        /*$(".family-add").on("click", function() {
            $.mobile.changePage("#viewApplyInsurance"); 
        }); */

        $(document).on("click", ".family-add", function() {           
            var clickFamilyID = $(this).parents('.family-list').children("div").attr("data-id");
            var clickFamilyData = healthInsurArr.filter(function(item, index, array){
                if (item.family_id === clickFamilyID){
                    return item.name;
                }
            });
            clickFamilyName = clickFamilyData[0].name;
            $.mobile.changePage("#viewApplyInsurance"); 

        });        

    }
});
