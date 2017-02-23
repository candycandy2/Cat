
//$(document).one("pagecreate", "#viewQueryResult", function(){

// review
var queryHasDataAry = [], expiredQueryTime = 1;    // expired time = 1 minutes
    $("#viewQueryResult").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryEmployeeData() {

                var self = this;
                var queryData = '<LayoutHeader><Company>' + $("#Company").val() + '</Company><Name_CH>' + $("#CName").val() + '</Name_CH>' +
                                '<Name_EN>' + $("#EName").val() + '</Name_EN><DeptCode>' + $("#Department").val() + '</DeptCode>' +
                                '<Ext_No>' + $("#ExtNum").val() + '</Ext_No></LayoutHeader>';
                var dataContent;
                
                // review
                // data is not exist
                var dataExist = false;
                if (localStorage.getItem('queryInfo') === null){
                    // do nothing
                }
                else{
                    var storageData = JSON.parse(localStorage.getItem("queryInfo"));
                    for(var item in storageData){
                        if (queryData === storageData[item].query){
                            dataContent = storageData[item].result;
                            insertQueryValue(dataContent, 1);
                            loadingMask("hide");
                            dataExist = true;
                            if (checkDataExpired(storageData[item].time, expiredQueryTime, 'mm')){
                                dataExist = false;
                            }
                            break;
                        }
                        else{
                            // do nothing
                        }
                    }
                }

                if (!dataExist){
                    this.successCallback = function(data) {
                        var resultcode = data['ResultCode'];

                        if (resultcode === "1" || resultcode === "001901" || resultcode === "001906") {
                            // save data into localstorage
                            var nowTime = new Date();
                            queryHasDataAry.push({'query': queryData, 'result': data['Content'], 'time': nowTime});
                            employeeData = {};
                            dataContent = data['Content'];

                            localStorage.setItem('queryInfo', JSON.stringify(queryHasDataAry));
                            insertQueryValue(dataContent, resultcode);
                        }

                        loadingMask("hide");
                    };

                    this.failCallback = function(data) {};

                    var __construct = function() {
                        CustomAPI("POST", true, "QueryEmployeeData", self.successCallback, self.failCallback, queryData, "");
                    }();
                }

            }

            // review
            // insert value into html
            function insertQueryValue(dataContent, resultcode){
                var htmlContent = "";
                var errorMsg = $("#errorMsg").clone();
                var errorMsg2 = $("#errorMsg2").clone(), telString = "", extTmpNum = "";
                for (var i=0; i<dataContent.length; i++){
                    var tempData = {};

                    tempData["company"] = dataContent[i].Company;
                    tempData["ename"] = dataContent[i].Name_EN;
                    tempData["cname"] = dataContent[i].Name_CH;
                    tempData["extnum"] = dataContent[i].Ext_No;
                    tempData["mvpn"] = dataContent[i].Mvpn;

                    // check has more than one ext num or not
                    if (tempData["extnum"].indexOf(';')>0){
                        // check has mvpn num or not
                        if (tempData["mvpn"] === ""){
                            telString = "class='chooseNumPop extNumMore'";
                        }
                        else{
                            telString = "class='chooseNumPop extNumMore mvpnNum'" + " data-mvpnnum='" + tempData["mvpn"] + "'";
                        }
                        for (var j = 0; j < tempData["extnum"].match(/;/igm).length+1; j++){
                            telString += " data-extnum" + (j+1) + "='" + tempData["extnum"].split(';')[j].replace(' ', '') + "' " ;
                        }
                        telString += 'data-extnum="' + tempData["extnum"] + '" ';
                        extTmpNum = tempData["extnum"].split(';')[0].replace(' ', '');
                    }
                    else{
                        // check has mvpn num or not
                        if (tempData["mvpn"] === ""){
                            telString = "href='tel:" + tempData["extnum"] + "'";
                        }
                        else{
                            telString = "class='chooseNumPop mvpnNum'" + " data-mvpnnum='" + tempData["mvpn"] + "' data-extnum='" + tempData["extnum"] + "' ";
                        }
                        extTmpNum = tempData["extnum"];
                    }


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
                        +       '<p><a rel="external"' + telString + 'style="color:#2d87ba; font-size: 2.2VH; font-family:Arial; font-weight: normal;">' + extTmpNum + '</a></p>'
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

//});


