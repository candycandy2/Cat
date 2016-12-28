
$(document).one("pagecreate", "#viewDetailInfo", function(){

    $("#viewDetailInfo").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryEmployeeDataDetail() {
                
                var listData;
                if (prevPageID === "viewQueryResult") {
                    listData = employeeData;
                    $("#startAdd").show();
                    $("#startDelete").hide();
                } else if (prevPageID === "viewPhonebook") {
                    listData = phonebookData;
                    $("#startAdd").hide();
                    $("#startDelete").show();
                }

                var self = this;
                var queryData = '<LayoutHeader><Company>' + listData[employeeSelectedIndex].company + '</Company>' + 
                                '<Name_EN>' + listData[employeeSelectedIndex].ename + '</Name_EN></LayoutHeader>';

                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];

                    if (resultcode === "1") {

                        if (prevPageID === "viewQueryResult") {
                            employeeData[employeeSelectedIndex].employeeid = data['Content'][0].EmployeeID;
                            for(var i=0; i<Object.keys(phonebookData).length; i++) {
                                if(employeeData[employeeSelectedIndex].employeeid === phonebookData[i].employeeid) {
                                    $("#startAdd").hide();
                                    $("#startDelete").show();
                                }
                            }
                        }

                        $("#detailData #companyName").html(data['Content'][0].Company);
                        $("#detailData #eName").html(data['Content'][0].Name_EN);
                        $("#detailData #cName").html(data['Content'][0].Name_CH);
                        $("#detailData #employeeID").html(data['Content'][0].EmployeeID);
                        $("#detailData #sideCode").html(data['Content'][0].SiteCode);
                        $("#detailData #dept").html(data['Content'][0].Dept);
                        $("#detailData #deptCode").html(data['Content'][0].DeptCode);
                        $("#detailData #extNo").html(data['Content'][0].Ext_No);
                        $("#detailData #eMail").html(data['Content'][0].EMail);
                    }

                    loadingMask("hide");
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "QueryEmployeeDataDetail", self.successCallback, self.failCallback, queryData);
                }();

            }
            
            function AddMyPhoneBook() {
                
                var self = this;
                var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID>' + 
                                '<Add_EmpID>' + employeeData[employeeSelectedIndex].employeeid + '</Add_EmpID>' + 
                                '<Add_Company>' + employeeData[employeeSelectedIndex].company + '</Add_Company></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] === "001902") {
                        $.mobile.changePage('#viewPhonebook');
                    } else if (resultcode === "000908" || resultcode === "000907" || resultcode === "000914") {
                        getServerData();
                    } else {
                        //ResultCode = 001903, [fail]
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "AddMyPhoneBook", self.successCallback, self.failCallback, queryData);
                }();

            }

            window.deletePheonBookFinished = function() {
                $("#startAdd").show();
                $("#startDelete").hide();
                $('#askDeletePhonebook').popup('close');
            };

            /********************************** page event *************************************/
            $("#viewDetailInfo").on("pagebeforeshow", function(event, ui){
                loadingMask("show");
                var employeeDataDetail = new QueryEmployeeDataDetail();
            });

            /********************************** dom event *************************************/
            $("#addPhonebook").on("click", function(){
                AddMyPhoneBook();
            });

            $("#deletePhonebook").on("click", function(){
                deletePhoneBook("viewDetailInfo", employeeSelectedIndex);
            });
        }
    });

});
