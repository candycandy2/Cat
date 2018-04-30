var healthInsurArr = [{emplid:"1607001", INS_ID:"", APP_ID:"", family_id:"1", name:"王小明", relation:"11", birthday:"1980/01/01", idno:"A123456789", group:"眷屬健保在保", insuredday:"2017-01-01", reason:"", subsidy:"1", certificate:"N", healthcard:"N", applyday:"2017-01-01", dealwith:"已加保", dealwithday:"2017-01-01", remark:"", can_apply:"停保+退保"},
                      {emplid:"1607002", INS_ID:"", APP_ID:"", family_id:"2", name:"王小美", relation:"11", birthday:"1980/01/02", idno:"A223456788", group:"眷屬健保在保", insuredday:"2017-01-01", reason:"", subsidy:"1", certificate:"Y", healthcard:"Y", applyday:"2017-01-01", dealwith:"已加保", dealwithday:"2017-01-01", remark:"", can_apply:"停保+退保"},
                      {emplid:"1607003", INS_ID:"", APP_ID:"", family_id:"3", name:"王晶晶", relation:"15", birthday:"1950/01/02", idno:"A223456888", group:"眷屬健保不在保", insuredday:"", reason:"", subsidy:"5", certificate:"N", healthcard:"Y", applyday:"2017-01-01", dealwith:"", dealwithday:"", remark:"", can_apply:"加保"},
                      {emplid:"1607004", INS_ID:"", APP_ID:"", family_id:"4", name:"王囧囧", relation:"15", birthday:"1950/01/01", idno:"A123456889", group:"眷屬健保不在保", insuredday:"", reason:"", subsidy:"5", certificate:"N", healthcard:"Y", applyday:"2017-01-01", dealwith:"", dealwithday:"", remark:"", can_apply:"加保"}];

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

        //API:QueryHealthInsuranceFamily  
        function queryHealthInsuranceList() {
            if (healthInsurArr == null){
                var healthInsurList = "無";                
                $("#inHealthInsur").empty().append(healthInsurList).children("div:last-child").remove();
                $("#nonHealthInsur").empty().append(healthInsurList).children("div:last-child").remove();
            }else {
                var healthInsurList = ""; 
                var nonhealthInsurList = "";
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
                    }
                    if (healthInsurArr[i]["group"] == "眷屬健保不在保"){
                        nonhealthInsurList += '<div class="family-list"><div data-id="'
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
                    }
                }
                $("#inHealthInsur").empty().append(healthInsurList).children("div:last-child").remove();
                $("#nonHealthInsur").empty().append(nonhealthInsurList).children("div:last-child").remove();
            }
            loadingMask("hide");
        }

        /********************************** page event *************************************/
        $("#viewPersonalInsurance").on("pagebeforeshow", function(event, ui) {
            $('#pageInsurStatus-1').show();
            $('#pageInsurStatus-2').hide();
            $("label[for=fam-insur-tab-2]").removeClass('ui-btn-active');
            $("label[for=fam-insur-tab-1]").addClass('ui-btn-active');
            queryHealthInsuranceList();
        });

        $("#viewPersonalInsurance").on("pageshow", function(event, ui) {       
            
        });

        /********************************** dom event *************************************/
        $('#viewPersonalInsurance').change(function() {
            timeQueue = {};
            var tabValue = $("#viewPersonalInsurance :radio:checked").val();
            if (tabValue == 'fam-insur-tab-1') {
                $('#pageInsurStatus-1').show();
                $('#pageInsurStatus-2').hide();        
            } else {
                $('#pageInsurStatus-2').show();
                $('#pageInsurStatus-1').hide();
            }
        });  

        $("#fam-insur-tab-1").on('click', function() {
            $("label[for=fam-insur-tab-2]").removeClass('ui-btn-active');
            $("label[for=fam-insur-tab-1]").addClass('ui-btn-active');        
        });   

        $("#fam-insur-tab-2").on('click', function() {
            $("label[for=fam-insur-tab-1]").removeClass('ui-btn-active');   
            $("label[for=fam-insur-tab-2]").addClass('ui-btn-active');                
        });           

    }
});
