
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

                    if (resultcode === "1" || resultcode === "001901" || resultcode === "001906") {

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
                            tempData["extnum"] = dataContent[i].Ext_No.match(/^([0-9X\-]{0,9})/)[1];

                            employeeData[i] = tempData;

                            var content = htmlContent
                                + '<li style="border-width:1px; border-style:none; border-bottom-style:solid; border-bottom-color:#989898;">'
                                +   '<div id="name" style="width:53.4VW">'
                                +       '<p style="margin-top:2VH;"><a href="#" value="' + i.toString() + '" name="detailIndex" style="color:#0f0f0f; font-family:Arial; font-size:2.6VH;">' + tempData["ename"] + '</a></p>'
                                +       '<p style="margin-bottom:1VH;"><a href="#" value="' + i.toString() + '" name="detailIndex" style="color:#666; font-family:Microsoft JhengHei; font-size:2.3VH; font-weight: normal;">' + tempData["cname"] + '</a></p>'
                                +   '</div>'
                                +   '<div style="margin-right:1.9VW; line-height:10VH">'
                                +       '<img src = "img/phone.png" style="width:3.5VW; height:2VH;">'
                                +   '</div>'
                                +   '<div style="margin-right:6VW; line-height:10VH; width: 21VW;">'
                                +       '<p><a rel="external" href="tel:' + tempData["extnum"] + '" style="color:#2d87ba; font-size: 2.2VH; font-family:Arial; font-weight: normal;">' + tempData["extnum"] + '</a></p>'
                                +   '</div>'
                                +   '<div style="float:right; margin-right:3.8VW; line-height:12VH">'
                                +       '<a href="#" value="' + i.toString() + '" name="detailIndex"><img src="img/info.png" style="width:6.4VW; height:3.7VH;"></a>'
                                +   '</div>'
                                + '</li>';

                            htmlContent = content;
                        }

                        $("#employeeData").html("");
                        $("#employeeData").prepend($(htmlContent)).enhanceWithin();
                        $('#employeeData').listview('refresh');

                        $('a[name="detailIndex"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            
                            prevPageID = "viewQueryResult";
                            employeeSelectedIndex = $(this).attr("value");
                            $.mobile.changePage('#viewDetailInfo');
                        });

                        /*   data length over 5, show error msg
                             if (resultcode === "001906") {     */
                        if (dataContent.length === 5) {
                            $("#errorMsg").show();
                            $("#errorMsg2").hide();
                        } else if (resultcode === "001901") {
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

            /********************************** dom event *************************************/
            $("a[id^='button']").on("click", function(){
                if ($(this).prop("id") === "buttonBack") {
                    doClearInputData = false;
                } else if ($(this).prop("id") === "buttonHome") {
                    doClearInputData = true;
                }
            });
        }
    });

});
