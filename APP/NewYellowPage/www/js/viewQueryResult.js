
//$(document).one("pagecreate", "#viewQueryResult", function(){

// review
var queryHasDataAry = [], expiredQueryTime = 1;    // expired time = 1 minutes
    $("#viewQueryResult").pagecontainer({
        create: function(event, ui) {
            var maxValue = 10;   // max vlaue of search
            
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
                    queryHasDataAry = JSON.parse(localStorage.getItem("queryInfo"));
                    for(var item in queryHasDataAry){
                        if (queryData === queryHasDataAry[item].query){
                            dataContent = queryHasDataAry[item].result;
                            loadingMask("hide");
                            if (checkDataExpired(queryHasDataAry[item].time, expiredQueryTime, 'dd')){
                                dataExist = false;
                                queryHasDataAry.splice(item, 1);
                            }
                            else{
                                insertQueryValue(dataContent, 1);
                                dataExist = true;
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
                var telString = "", extTmpNum = "";
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
                            if (tempData["mvpn"].indexOf(';')>0){
                                telString = "class='chooseNumPop extNumMore mvpnNumMore mvpnNum'";
                                for (var j = 0; j < tempData["mvpn"].match(/;/igm).length+1; j++){
                                    telString += " data-mvpnnum" + (j+1) + "='" + tempData["mvpn"].split(';')[j].replace(' ', '') + "' " ;
                                }
                            }
                            else{
                                telString = "class='chooseNumPop extNumMore mvpnNum'" + " data-mvpnnum='" + tempData["mvpn"] + "'";
                            }
                        }

                        for (var j = 0; j < tempData["extnum"].match(/;/igm).length+1; j++){
                            telString += " data-extnum" + (j+1) + "='" + tempData["extnum"].split(';')[j].replace(' ', '') + "' " ;
                        }
                        telString += 'data-extnum="' + tempData["extnum"] + '" ';
                        telString += 'data-mvpnnum="' + tempData["mvpn"] + '" ';
                        extTmpNum = tempData["extnum"].split(';')[0].replace(' ', '');
                    }
                    else{
                        // check has mvpn num or not
                        if (tempData["mvpn"] === ""){
                            telString = "href='tel:" + tempData["extnum"] + "'";
                        }
                        else{
                            if (tempData["mvpn"].indexOf(';')>0){
                                telString = "class='chooseNumPop mvpnNumMore mvpnNum'";
                                for (var j = 0; j < tempData["mvpn"].match(/;/igm).length+1; j++){
                                    telString += " data-mvpnnum" + (j+1) + "='" + tempData["mvpn"].split(';')[j].replace(' ', '') + "' " + "' data-extnum='" + tempData["extnum"] + "' ";
                                }
                                telString += 'data-mvpnnum="' + tempData["mvpn"] + '" ';
                            }
                            else{
                                telString = "class='chooseNumPop mvpnNum'" + " data-mvpnnum='" + tempData["mvpn"] + "' data-extnum='" + tempData["extnum"] + "' ";
                            }                        
                        }
                        extTmpNum = tempData["extnum"];
                    }


                    employeeData[i] = tempData;

                    var content = htmlContent
                        + '<li>'
                        +   '<div class="name">'
                        +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + tempData["ename"] + '</a></p>'
                        +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + tempData["cname"] + '</a></p>'
                        +   '</div>'
                        +   '<div class="img-phone divvertical-center">'
                        +       '<div class="tel-num">'
                        +           '<img src = "img/phone.png">'
                        +           '<a rel="external"' + telString + '>' + extTmpNum + '</a>'
                        +       '</div>'
                        +   '</div>'
                        +   '<div class="img-info divvertical-center">'
                        +       '<div class="tel-num">'
                        +           '<p><a href="#" value="' + i.toString() + '" name="detailIndex"><img src="img/info.png"></a></p>'
                        +       '</div>'
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

                /*   data length over maxValue, show error msg
                     if (resultcode === "001906") {     */
                if (dataContent.length === maxValue) {
                    $("#errorMsg").show();
                    $("#errorMsg2").hide();
                    $("#errorMsg").find('.max-value').html(maxValue);
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


