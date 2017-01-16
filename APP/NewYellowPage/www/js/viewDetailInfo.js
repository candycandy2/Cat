
$(document).one("pagecreate", "#viewDetailInfo", function(){

    $("#viewDetailInfo").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryEmployeeDataDetail() {
                
                if (prevPageID === "viewQueryResult") {
                    $("#addStar").show();
                    $("#deleteStar").hide();
                } else if (prevPageID === "viewPhonebook") {
                    employeeData = phonebookData;
                    $("#addStar").hide();
                    $("#deleteStar").show();
                }

                var self = this;
                var queryData = '<LayoutHeader><Company>' + employeeData[employeeSelectedIndex].company + '</Company>' + 
                                '<Name_EN>' + employeeData[employeeSelectedIndex].ename + '</Name_EN></LayoutHeader>';

                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];

                    if (resultcode === "1") {

                        if (prevPageID === "viewQueryResult") {
                            employeeData[employeeSelectedIndex].employeeid = data['Content'][0].EmployeeID;
                            for(var i=0; i<Object.keys(phonebookData).length; i++) {
                                if(employeeData[employeeSelectedIndex].employeeid === phonebookData[i].employeeid) {
                                    $("#addStar").hide();
                                    $("#deleteStar").show();
                                    break;
                                }
                            }
                        }
                        $("#detial-name-title #eName").html(data['Content'][0].Name_EN);
                        $("#detial-name-title #cName").html(data['Content'][0].Name_CH);
                        $("#detail-data #companyName").html(data['Content'][0].Company);
                        $("#detail-data #employeeID").html(data['Content'][0].EmployeeID);
                        $("#detail-data #sideCode").html(data['Content'][0].SiteCode);
                        $("#detail-data #dept").html(data['Content'][0].Dept);
                        $("#detail-data #deptCode").html(data['Content'][0].DeptCode);
                        $("#detail-data #extNo").html(data['Content'][0].Ext_No);
                        $("#detail-data #eMail").html(data['Content'][0].EMail);
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
                        $("#askAddPhonebook").popup('close');
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
                    QPlayAPI("POST", "AddMyPhoneBook", self.successCallback, self.failCallback, queryData);
                }();

            }

            window.deletePheonBookFinished = function() {
                $("#addStar").show();
                $("#deleteStar").hide();
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