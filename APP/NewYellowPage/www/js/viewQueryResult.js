
$(document).one("pagecreate", "#viewQueryResult", function(){

    $("#viewQueryResult").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryEmployeeData() {

                var self = this;
                var queryData = '<LayoutHeader><Company>' + $("#Company").val() + '</Company><Name_CH>' + $("#CName").val() + '</Name_CH>' +
                                '<Name_EN>' + $("#EName").val() + '</Name_EN><DeptCode>' + $("#Department").val() + '</DeptCode>' +
                                '<Ext_No>' + $("#ExtNum").val() + '</Ext_No></LayoutHeader>';
                
                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];
                    
                    if (resultcode == 1 || resultcode == 1901 || resultcode == 1906) {
                        
                        employeeData = {};
                        var dataContent = data['Content'];
                        var htmlContent = "";
                        var errorMsg = $("#errorMsg").clone();
                        var errorMsg2 = $("#errorMsg2").clone();
                        
                        for (var i=0; i<dataContent.length; i++){
                            var tempData = {};

                            tempData["company"] = dataContent[i].Company;
                            tempData["ename"] = dataContent[i].Name_EN;
                            tempData["cname"] = dataContent[i].Name_CH;
                            tempData["extnum"] = dataContent[i].Ext_No;

                            employeeData[i] = tempData;
                            
                            var content = htmlContent
                                + '<li>'
                                +   '<div class="company">'
                                +       '<p>' + tempData["company"] + '</p>'
                                +   '</div>'
                                +   '<div class="e-name">'
                                +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + tempData["ename"] + '</a></p>'
                                +       '<p><a rel="external" href="tel:' + tempData["extnum"] + '" style="color:red;">' + tempData["extnum"] + '</a></p>'
                                +   '</div>'
                                +   '<div class="c-name">'
                                +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + tempData["cname"] + '</a></p>'
                                +   '</div>'
                                + '</li>';

                            htmlContent = content;
                        }
                        
                        $("#employeeData").html("");
                        $("#employeeData").append(errorMsg);
                        $("#employeeData").append(errorMsg2);
                        $("#employeeData").prepend($(htmlContent)).enhanceWithin();
                        $('#employeeData').listview('refresh');

                        $('a[name="detailIndex"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            
                            prevPageID = "viewQueryResult";
                            employeeSelectedIndex = $(this).attr("value");
                            $.mobile.changePage('#viewDetailInfo');
                        });

                        //data length over 5, show error msg
                        if (resultcode == 1906) {
                            $("#errorMsg").show();
                            $("#errorMsg2").hide();
                        } else if (resultcode == 1901) {
                            $("#errorMsg2").show();
                            $("#errorMsg").hide();
                        } else {
                            $("#errorMsg").hide();
                            $("#errorMsg2").hide();
                        }

                    }

                    loadingMask("hide");
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "QueryEmployeeData", self.successCallback, self.failCallback, queryData);
                }();

            }

            /********************************** page event *************************************/
            $("#viewQueryResult").on("pagebeforeshow", function(event, ui){
                if (prevPageID !== null) {
                    loadingMask("show");
                    var employeeData = new QueryEmployeeData();
                }
            });
        }
    });

});
