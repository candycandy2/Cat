//$(document).one("pagecreate", "#viewDetailInfo", function(){

// review
var detailHasDataAry = [],
    expiredQueryTime = 1; // expired time = 1 minutes
$("#viewDetailInfo").pagecontainer({
    create: function(event, ui) {
        var tmpemployeeInfo = {};
        /********************************** function *************************************/
        function QueryEmployeeDataDetail() {

            if (prevPageID === "viewQueryResult") {
                $("#addStar").show();
                $("#deleteStar").hide();
                tmpemployeeInfo = employeeData;
            } else if (prevPageID === "viewDataInput") {
                tmpemployeeInfo = phonebookData;
                $("#addStar").hide();
                $("#deleteStar").show();
            }

            var self = this;
            var queryData = '<LayoutHeader><Company>' + tmpemployeeInfo[employeeSelectedIndex].company + '</Company>' +
                '<Name_EN>' + tmpemployeeInfo[employeeSelectedIndex].ename + '</Name_EN></LayoutHeader>';

            // review
            // data is not exist
            var dataExist = false;
            if (localStorage.getItem('detailInfo') === null) {
                // do nothing
            } else {
                detailHasDataAry = JSON.parse(localStorage.getItem("detailInfo"));
                // check data is exist or not
                for (var item in detailHasDataAry) {
                    if (queryData === detailHasDataAry[item].query) {
                        dataContent = detailHasDataAry[item].result;
                        if (checkDataExpired(detailHasDataAry[item].time, expiredQueryTime, 'dd')) {
                            dataExist = false;
                            detailHasDataAry.splice(item, 1);
                        } else {
                            insertDetailValue(dataContent);
                            dataExist = true;
                        }
                        loadingMask("hide");
                        break;
                    }
                }
            }

            // review
            if (!dataExist) {
                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];

                    if (resultcode === "1") {
                        // save data into localstorage
                        var nowTime = new Date();
                        detailHasDataAry.push({ 'query': queryData, 'result': data['Content'], 'time': nowTime });

                        if (prevPageID === "viewQueryResult") {
                            tmpemployeeInfo[employeeSelectedIndex].employeeid = data['Content'][0].EmployeeID;
                            for (var i = 0; i < Object.keys(phonebookData).length; i++) {
                                if (tmpemployeeInfo[employeeSelectedIndex].employeeid === phonebookData[Object.keys(phonebookData)[i]].employeeid) {
                                    $("#addStar").hide();
                                    $("#deleteStar").show();
                                    break;
                                }
                            }
                        }
                        localStorage.setItem('detailInfo', JSON.stringify(detailHasDataAry));
                        insertDetailValue(data['Content']);
                    }
                    loadingMask("hide");
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    CustomAPI("POST", true, "QueryEmployeeDataDetail", self.successCallback, self.failCallback, queryData, "");
                }();
            } else {
                // do nothing
            }

        }

        // review
        function insertDetailValue(dataContent) {
            // check has more than one ext num or not
            if (dataContent[0].Ext_No !== null) {
                if (dataContent[0].Ext_No.indexOf(';') > 0) {
                    telString = " class='chooseNumPop extNumMore'" + ' ';
                    for (var i = 0; i < dataContent[0].Ext_No.match(/;/igm).length + 1; i++) {
                        telString += "data-extnum" + (i + 1) + "=" + dataContent[0].Ext_No.split(';')[i] + ' ';
                    }
                    telString += 'data-extnum=' + dataContent[0].Ext_No + '>' + dataContent[0].Ext_No.split(';')[0];
                    extTmpNum = dataContent[0].Ext_No.split(';')[0];
                } else {
                    telString = " href='tel:" + dataContent[0].Ext_No + "'>" + dataContent[0].Ext_No;
                    extTmpNum = dataContent[0].Ext_No;
                }
            } else {
                telString = '';
            }

            $("#detial-name-title #eName").html(dataContent[0].Name_EN);
            $("#detial-name-title #cName").html(dataContent[0].Name_CH);
            $("#detail-data #companyName").html(dataContent[0].Company);
            //$("#detail-data #employeeID").html(dataContent[0].EmployeeID);
            $("#detail-data #sideCode").html(dataContent[0].SiteCode);
            $("#detail-data #dept").html(dataContent[0].Dept);
            $("#detail-data #deptCode").html(dataContent[0].DeptCode);
            $("#detail-data #extNo").html("<a" + telString + "</a>");
            $("#detail-data #eMail").html(dataContent[0].EMail);

            if (prevPageID === "viewQueryResult") {
                tmpemployeeInfo[employeeSelectedIndex].employeeid = dataContent[0].EmployeeID;
                for (var i = 0; i < Object.keys(phonebookData).length; i++) {
                    if (tmpemployeeInfo[employeeSelectedIndex].employeeid === phonebookData[Object.keys(phonebookData)[i]].employeeid) {
                        $("#addStar").hide();
                        $("#deleteStar").show();
                        break;
                    }
                }
            }
        }

        function AddMyPhoneBook() {

            var self = this;
            var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID>' +
                '<Add_EmpID>' + tmpemployeeInfo[employeeSelectedIndex].employeeid + '</Add_EmpID>' +
                '<Add_Company>' + tmpemployeeInfo[employeeSelectedIndex].company + '</Add_Company></LayoutHeader>';

            this.successCallback = function(data) {
                if (data['ResultCode'] === "001902") {
                    window.localStorage.removeItem('QueryMyPhoneBookData'); //set dirty
                    QueryMyPhoneBook(); //need update list for compare
                    $("#addStar").hide();
                    $("#deleteStar").show();
                } else if (resultcode === "000908" || resultcode === "000907" || resultcode === "000914") {
                    getServerData();
                } else {
                    //ResultCode = 001903, [fail]
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "AddMyPhoneBook", self.successCallback, self.failCallback, queryData, "");
            }();

        }

        window.deletePheonBookFinished = function() {
            $("#addStar").show();
            $("#deleteStar").hide();
        };

        /********************************** page event *************************************/
        $("#viewDetailInfo").on("pagebeforeshow", function(event, ui) {
            loadingMask("show");
            var employeeDataDetail = new QueryEmployeeDataDetail();
        });


        $("#viewDetailInfo").one("pagebeforeshow", function(event, ui) {
            var eventAddConfirmPopupData = {
                id: "askAddPhonebook",
                content: $("template#tplaskAddPhonebook").html()
            };
            tplJS.Popup("viewDetailInfo", "DetailInfo", "append", eventAddConfirmPopupData);
            var eventDeleteConfirmPopupData = {
                id: "askDeletePhonebook",
                content: $("template#tplDeletePhonebook").html()
            };
            tplJS.Popup("viewDetailInfo", "DetailInfo", "append", eventDeleteConfirmPopupData);
        });


        /********************************** dom event *************************************/
        $("#addStar").on("click", function() {
            $('#askAddPhonebook').popup('open');
        });

        $(document).on("click", "#askAddPhonebook .cancel", function() {
            $("#askAddPhonebook").popup("close");
        });

        $(document).on("click", "#askAddPhonebook .confirm", function() {
            AddMyPhoneBook();
            $("#askAddPhonebook").popup("close");
        });

        $("#deleteStar").on("click", function() {
            $("#askDeletePhonebook").popup("open");
        });

        $(document).on("click", "#askDeletePhonebook .cancel", function() {
            $("#askDeletePhonebook").popup("close");
        });

        $(document).on("click", "#askDeletePhonebook .confirm", function() {
            deletePhoneBook("viewDetailInfo", tmpemployeeInfo[employeeSelectedIndex].employeeid);
            $("#askDeletePhonebook").popup("close");
        });
    }
});
//});
