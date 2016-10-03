
$(document).on("pagecreate", "#viewQueryResult", function(){

    $("#viewQueryResult").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
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
                        var errorMsg = $("#errorMsg").clone();
                        

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
                        
                        $("#employeeData").html("");
                        $("#employeeData").append(errorMsg);
                        $("#employeeData").prepend($(htmlContent)).enhanceWithin();
                        $('#employeeData').listview('refresh');

                        $('a[id^="detailindex"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                          
                            employeedata.index = this.getAttribute('value');
                            $.mobile.changePage('#viewDetailInfo');
                        });

                        //data length over 10, show error msg
                        if (dataContent.length >= 10) {
                            $("#errorMsg").show();
                        } else {
                            $("#errorMsg").hide();                            
                        }

                      }
                };

                this.failCallback = function(data) {
                    
                };

                var __construct = function() {
                    QPlayAPI("POST", "QueryEmployeeData", self.successCallback, self.failCallback, queryData);
                }();
                
            }

            $("#viewQueryResult").on("pagebeforeshow", function(event, ui){
                QueryEmployeeData();
            });

            $("#viewQueryResult").on("pageshow", function(event, ui){
            
            });

            $(".company").on('click', function(){

            });
        }
    });

});
