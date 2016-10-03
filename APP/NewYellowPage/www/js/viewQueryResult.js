
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
                            var tempData = {};

                            var company = dataContent[i].Company;
                            //employeedata.company[i] = company;
                            tempData["company"] = company;

                            var ename = dataContent[i].Name_EN;
                            //employeedata.ename[i] = ename;
                            tempData["ename"] = ename;

                            var cname = dataContent[i].Name_CH;
                            //employeedata.cname[i] = cname;
                            tempData["cname"] = cname;

                            var extnum = dataContent[i].Ext_No;
                            tempData["extnum"] = extnum;

                            employeeData[i] = tempData;
                            
                            var content = htmlContent
                                + '<li>'
                                +   '<div class="company">'
                                +       '<p>' + company + '</p>'
                                +   '</div>'
                                +   '<div class="e-name">'
                                +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + ename + '</a></p>'
                                +       '<p><a rel="external" href="tel:' + extnum + '" style="color:red;">' + extnum + '</a></p>'
                                +   '</div>'
                                +   '<div class="c-name">'
                                +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + cname + '</a></p>'
                                +   '</div>'
                                + '</li>';

                            htmlContent = content;
                        }
                        
                        $("#employeeData").html("");
                        $("#employeeData").append(errorMsg);
                        $("#employeeData").prepend($(htmlContent)).enhanceWithin();
                        $('#employeeData').listview('refresh');

                        $('a[name="detailIndex"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                          
                            //employeedata.index = this.getAttribute('value');
                            $.mobile.changePage('#viewDetailInfo', {
                                data: {
                                    "test": "123"
                                }
                            });
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

            /********************************** page event *************************************/
            $("#viewQueryResult").on("pagebeforeshow", function(event, ui){
                QueryEmployeeData();
            });

            $("#viewQueryResult").on("pageshow", function(event, ui){
            
            });

        }
    });

});
