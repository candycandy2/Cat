
$(document).one("pagecreate", "#viewDataInput", function(){
    
    $("#viewDataInput").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            window.QueryCompanyData = function() {
                
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];
                    
                    if (resultcode === "1" || resultcode === "1906") {
                        var dataContent = data['Content'];
                        
                        for (var i=2; i<dataContent.length; i++) { // ignore 0 and 1, 0: "All Company", 1: ""
                            var companyname = dataContent[i].CompanyName;
                            $('#Company').append('<option value="' + companyname + '">' + companyname + '</option>');
                        }
                    }
                };

                this.failCallback = function(data) {
                    
                };

                var __construct = function() {
                    QPlayAPI("POST", "QueryCompanyData", self.successCallback, self.failCallback);
                }();

            };
            /*
            function QueryEmployeeData() {

                var self = this;
                var queryData = '<LayoutHeader><Company>' + $("#Company").val() + '</Company><Name_CH>' + $("#CName").val() + 
                                '</Name_CH><Name_EN>' + $("#EName").val() + '</Name_EN><DeptCode>' + $("#Department").val() + 
                                '</DeptCode><Ext_No>' + $("#ExtNum").val() + '</Ext_No></LayoutHeader>';
                
                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];
                    
                    if (resultcode == 1 || resultcode == 1906) {
        
                        var dataContent = data['Content'];
                        //employeedata.total = dataContent.length;
                        var htmlContent = "";
                        var errorMsg = $("#errorMsg").html();

                        for (var i=0; i<dataContent.length; i++){
                            var company = dataContent[i].Company;
                            //employeedata.company[i] = company;
                            var ename = dataContent[i].Name_EN;
                            //employeedata.ename[i] = ename;
                            var cname = dataContent[i].Name_CH;
                            //employeedata.cname[i] = cname;
                            var extnum = dataContent[i].Ext_No;

                            var content = htmlContent
                                + '<li>'
                                +   '<div class="company">'
                                +       '<p>' + company + '</p>'
                                +   '</div>'
                                +   '<div class="e-name">'
                                +       '<p><a href="#detail_info_page" value="' + i.toString() + '" id="detailindex' + i.toString() + '">' + ename + '</a></p>'
                                +       '<p><a rel="external" href="tel:+' + extnum + '" style="color:red;">' + extnum + '</a></p>'
                                +   '</div>'
                                +   '<div class="c-name">'
                                +       '<p><a href="#detail_info_page" value="' + i.toString() + '" id="detailindex' + i.toString() + '">' + cname + '</a></p>'
                                +   '</div>'
                                + '</li>';

                            htmlContent = content;
                        }
                        
                        htmlContent = htmlContent + errorMsg;

                        $("#employeeData").html("");
                        $("#employeeData").append($(htmlContent)).enhanceWithin();
                        $('#employeeData').listview('refresh');

                        $.mobile.changePage('#viewQueryResult');

                        $('a[id^="detailindex"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                          
                            employeedata.index = this.getAttribute('value');
                            $.mobile.changePage('#viewDetailInfo');
                        });

                      }
                };

                this.failCallback = function(data) {
                    
                };

                var __construct = function() {
                    QPlayAPI("POST", "QueryEmployeeData", self.successCallback, self.failCallback, queryData);
                }();
                
            }
            */
            /********************************** page event *************************************/
            $("#viewDataInput").one("pagebeforeshow", function(event, ui) {
            
            });

            $("#viewDataInput").one("pageshow", function(event, ui) {
            
            });

            /********************************** dom event *************************************/
            $("#cleanQuery").on("click", function() {
                var company = $("select#Company"); 
                company[0].selectedIndex = 0; 
                company.selectmenu("refresh");

                $("#viewDataInput input[type=text]").val("");
            });

            $("#callQuery").on("click", function() {
                var emptyData = true;

                $("#viewDataInput input[type=text]").each(function(index, element){
                    if ($(element).val().length !== 0) {
                        emptyData = false;
                    }
                });

                if (emptyData) {
                    $("#noQueryCondition").popup("open");
                } else {
                    //QueryEmployeeData();
                    $.mobile.changePage('#viewQueryResult');
                }
            });

            $('#viewDataInput').keypress(function(event){
                if (event.keyCode === 13) // keyCode of 'Enter' key is 13
                {
                    //getEmployeeData();
                }
            });

        }
    });

});